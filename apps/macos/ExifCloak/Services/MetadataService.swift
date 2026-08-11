import Foundation
import ImageIO
import CoreGraphics
import UniformTypeIdentifiers

/// Core service for reading, writing, and stripping image metadata
/// Uses Apple's ImageIO framework for native, fast metadata operations
final class MetadataService: Sendable {

    // MARK: - Read Metadata (synchronous, fast)

    /// Read all metadata from an image file — runs synchronously, call from background
    func readMetadata(from url: URL) throws -> ImageMetadata {
        guard let source = CGImageSourceCreateWithURL(url as CFURL, nil) else {
            throw MetadataError.cannotOpenFile(url)
        }

        var fields: [MetadataField] = []

        // Get properties dictionary (may be nil for some formats)
        let properties = CGImageSourceCopyPropertiesAtIndex(source, 0, nil) as? [String: Any] ?? [:]

        // Parse EXIF
        if let exif = properties[kCGImagePropertyExifDictionary as String] as? [String: Any] {
            fields.append(contentsOf: parseFieldGroup(exif, standard: .exif))
        }

        // Parse TIFF (also contains Make/Model for PNG)
        if let tiff = properties[kCGImagePropertyTIFFDictionary as String] as? [String: Any] {
            fields.append(contentsOf: parseFieldGroup(tiff, standard: .tiff))
        }

        // Parse IPTC
        if let iptc = properties[kCGImagePropertyIPTCDictionary as String] as? [String: Any] {
            fields.append(contentsOf: parseFieldGroup(iptc, standard: .iptc))
        }

        // Parse GPS
        if let gps = properties[kCGImagePropertyGPSDictionary as String] as? [String: Any] {
            fields.append(contentsOf: parseFieldGroup(gps, standard: .gps))
        }

        // Parse PNG-specific metadata
        if let png = properties[kCGImagePropertyPNGDictionary as String] as? [String: Any] {
            fields.append(contentsOf: parseFieldGroup(png, standard: .exif))
        }

        // Parse top-level properties (DPI, color model, dimensions, etc.)
        let topLevelKeys: Set<String> = [
            kCGImagePropertyPixelWidth as String,
            kCGImagePropertyPixelHeight as String,
            kCGImagePropertyDPIWidth as String,
            kCGImagePropertyDPIHeight as String,
            kCGImagePropertyColorModel as String,
            kCGImagePropertyProfileName as String,
            kCGImagePropertyDepth as String,
            kCGImagePropertyHasAlpha as String,
        ]
        for (key, value) in properties where topLevelKeys.contains(key) {
            fields.append(MetadataField(
                standard: .file,
                key: key,
                value: "\(value)",
                isEditable: false,
                isSuspicious: false
            ))
        }

        // Parse XMP metadata tags
        if let xmpMetadata = CGImageSourceCopyMetadataAtIndex(source, 0, nil) {
            fields.append(contentsOf: parseXMPMetadata(xmpMetadata))
        }

        // File system metadata
        fields.append(contentsOf: parseFileSystemMetadata(url))

        return ImageMetadata(fields: fields)
    }

    // MARK: - Strip All Metadata

    /// Remove all metadata from an image, preserving only pixel data
    func stripAllMetadata(for file: ImageFileItem) throws {
        let url = file.url
        guard let source = CGImageSourceCreateWithURL(url as CFURL, nil) else {
            throw MetadataError.cannotOpenFile(url)
        }

        guard let uti = CGImageSourceGetType(source) else {
            throw MetadataError.unsupportedFormat(url)
        }

        let tempURL = url.deletingLastPathComponent()
            .appendingPathComponent(".\(UUID().uuidString)_\(url.lastPathComponent)")

        guard let destination = CGImageDestinationCreateWithURL(
            tempURL as CFURL,
            uti,
            CGImageSourceGetCount(source),
            nil
        ) else {
            throw MetadataError.cannotCreateDestination(url)
        }

        // Write images with empty metadata dictionaries
        let cleanProperties: [String: Any] = [
            kCGImagePropertyExifDictionary as String: NSNull(),
            kCGImagePropertyGPSDictionary as String: NSNull(),
            kCGImagePropertyIPTCDictionary as String: NSNull(),
            kCGImagePropertyTIFFDictionary as String: [:] as [String: Any],
            kCGImagePropertyPNGDictionary as String: NSNull(),
        ]

        for i in 0..<CGImageSourceGetCount(source) {
            CGImageDestinationAddImageFromSource(destination, source, i, cleanProperties as CFDictionary)
        }

        guard CGImageDestinationFinalize(destination) else {
            try? FileManager.default.removeItem(at: tempURL)
            throw MetadataError.writeFailed(url)
        }

        try replaceFileAtomically(original: url, replacement: tempURL)
    }

    // MARK: - Strip Suspicious Fields Only

    func stripSuspiciousFields(for file: ImageFileItem) throws {
        let url = file.url
        guard let source = CGImageSourceCreateWithURL(url as CFURL, nil) else {
            throw MetadataError.cannotOpenFile(url)
        }

        guard let uti = CGImageSourceGetType(source) else {
            throw MetadataError.unsupportedFormat(url)
        }

        var properties = CGImageSourceCopyPropertiesAtIndex(source, 0, nil) as? [String: Any] ?? [:]

        // Clean EXIF suspicious fields
        if var exif = properties[kCGImagePropertyExifDictionary as String] as? [String: Any] {
            exif.removeValue(forKey: "UserComment")
            exif.removeValue(forKey: "MakerNote")
            for key in SuspiciousFieldKeys.keys {
                exif.removeValue(forKey: key)
            }
            properties[kCGImagePropertyExifDictionary as String] = exif
        }

        // Clean TIFF suspicious fields
        if var tiff = properties[kCGImagePropertyTIFFDictionary as String] as? [String: Any] {
            tiff.removeValue(forKey: "Software")
            tiff.removeValue(forKey: "ProcessingSoftware")
            tiff.removeValue(forKey: "ImageDescription")
            properties[kCGImagePropertyTIFFDictionary as String] = tiff
        }

        // Clean IPTC
        if var iptc = properties[kCGImagePropertyIPTCDictionary as String] as? [String: Any] {
            iptc.removeValue(forKey: "OriginatingProgram")
            iptc.removeValue(forKey: "ProgramVersion")
            properties[kCGImagePropertyIPTCDictionary as String] = iptc
        }

        // Clean PNG text chunks
        if var png = properties[kCGImagePropertyPNGDictionary as String] as? [String: Any] {
            png.removeValue(forKey: "Software")
            png.removeValue(forKey: "Description")
            png.removeValue(forKey: "Comment")
            png.removeValue(forKey: "parameters")
            properties[kCGImagePropertyPNGDictionary as String] = png
        }

        try writeMetadata(properties, to: url, sourceType: uti)
    }

    // MARK: - Apply Preset

    func applyPreset(_ preset: MetadataPreset, to file: ImageFileItem) throws {
        let url = file.url
        guard let source = CGImageSourceCreateWithURL(url as CFURL, nil) else {
            throw MetadataError.cannotOpenFile(url)
        }

        guard let uti = CGImageSourceGetType(source) else {
            throw MetadataError.unsupportedFormat(url)
        }

        var properties = CGImageSourceCopyPropertiesAtIndex(source, 0, nil) as? [String: Any] ?? [:]

        for field in preset.fields {
            let resolvedValue = field.resolvedValue()
            switch field.valueMode {
            case .remove:
                removeFieldFromProperties(&properties, standard: field.standard, key: field.key)
            default:
                setFieldInProperties(&properties, standard: field.standard, key: field.key, value: resolvedValue)
            }
        }

        try writeMetadata(properties, to: url, sourceType: uti)
    }

    // MARK: - Edit Single Field

    func updateField(key: String, value: String, standard: MetadataStandard, in url: URL) throws {
        guard let source = CGImageSourceCreateWithURL(url as CFURL, nil) else {
            throw MetadataError.cannotOpenFile(url)
        }

        guard let uti = CGImageSourceGetType(source) else {
            throw MetadataError.unsupportedFormat(url)
        }

        var properties = CGImageSourceCopyPropertiesAtIndex(source, 0, nil) as? [String: Any] ?? [:]
        setFieldInProperties(&properties, standard: standard.rawValue, key: key, value: value)
        try writeMetadata(properties, to: url, sourceType: uti)
    }

    /// Remove a single metadata field
    func removeField(key: String, standard: MetadataStandard, in url: URL) throws {
        guard let source = CGImageSourceCreateWithURL(url as CFURL, nil) else {
            throw MetadataError.cannotOpenFile(url)
        }

        guard let uti = CGImageSourceGetType(source) else {
            throw MetadataError.unsupportedFormat(url)
        }

        var properties = CGImageSourceCopyPropertiesAtIndex(source, 0, nil) as? [String: Any] ?? [:]
        removeFieldFromProperties(&properties, standard: standard.rawValue, key: key)
        try writeMetadata(properties, to: url, sourceType: uti)
    }

    // MARK: - Private Helpers

    private func writeMetadata(_ properties: [String: Any], to url: URL, sourceType: CFString) throws {
        guard let source = CGImageSourceCreateWithURL(url as CFURL, nil) else {
            throw MetadataError.cannotOpenFile(url)
        }

        let tempURL = url.deletingLastPathComponent()
            .appendingPathComponent(".\(UUID().uuidString)_\(url.lastPathComponent)")

        guard let destination = CGImageDestinationCreateWithURL(
            tempURL as CFURL,
            sourceType,
            CGImageSourceGetCount(source),
            nil
        ) else {
            throw MetadataError.cannotCreateDestination(url)
        }

        for i in 0..<CGImageSourceGetCount(source) {
            CGImageDestinationAddImageFromSource(destination, source, i, properties as CFDictionary)
        }

        guard CGImageDestinationFinalize(destination) else {
            try? FileManager.default.removeItem(at: tempURL)
            throw MetadataError.writeFailed(url)
        }

        try replaceFileAtomically(original: url, replacement: tempURL)
    }

    private func replaceFileAtomically(original: URL, replacement: URL) throws {
        let fileManager = FileManager.default
        let backupURL = original.deletingLastPathComponent()
            .appendingPathComponent(".\(original.lastPathComponent).bak")

        if fileManager.fileExists(atPath: original.path) {
            try fileManager.moveItem(at: original, to: backupURL)
        }

        do {
            try fileManager.moveItem(at: replacement, to: original)
            try? fileManager.removeItem(at: backupURL)
        } catch {
            try? fileManager.moveItem(at: backupURL, to: original)
            try? fileManager.removeItem(at: replacement)
            throw MetadataError.writeFailed(original)
        }
    }

    private func parseFieldGroup(_ dictionary: [String: Any], standard: MetadataStandard) -> [MetadataField] {
        dictionary.compactMap { key, value in
            let stringValue: String
            if let array = value as? [Any] {
                stringValue = array.map { "\($0)" }.joined(separator: ", ")
            } else if let dict = value as? [String: Any] {
                stringValue = dict.map { "\($0.key)=\($0.value)" }.joined(separator: "; ")
            } else {
                stringValue = "\(value)"
            }

            return MetadataField(
                standard: standard,
                key: key,
                value: stringValue,
                isEditable: standard != .file,
                isSuspicious: SuspiciousFieldKeys.isSuspicious(key)
            )
        }
    }

    private func parseXMPMetadata(_ metadata: CGImageMetadata) -> [MetadataField] {
        var fields: [MetadataField] = []

        guard let tags = CGImageMetadataCopyTags(metadata) as? [CGImageMetadataTag] else {
            return fields
        }

        for tag in tags {
            guard let name = CGImageMetadataTagCopyName(tag) as String? else {
                continue
            }

            let value = CGImageMetadataTagCopyValue(tag)
            let stringValue: String
            if let str = value as? String {
                stringValue = str
            } else if let array = value as? [Any] {
                stringValue = array.map { "\($0)" }.joined(separator: ", ")
            } else if value != nil {
                stringValue = "\(value!)"
            } else {
                continue
            }

            let prefix = CGImageMetadataTagCopyPrefix(tag) as String? ?? "xmp"
            let fullKey = "\(prefix):\(name)"

            fields.append(MetadataField(
                standard: .xmp,
                key: fullKey,
                value: stringValue,
                isEditable: true,
                isSuspicious: SuspiciousFieldKeys.isSuspicious(fullKey)
            ))
        }

        return fields
    }

    private func parseFileSystemMetadata(_ url: URL) -> [MetadataField] {
        var fields: [MetadataField] = []

        if let attrs = try? FileManager.default.attributesOfItem(atPath: url.path) {
            if let size = attrs[.size] as? Int64 {
                fields.append(MetadataField(
                    standard: .file,
                    key: "FileSize",
                    value: ByteCountFormatter.string(fromByteCount: size, countStyle: .file),
                    isEditable: false,
                    isSuspicious: false
                ))
            }

            if let created = attrs[.creationDate] as? Date {
                let formatter = DateFormatter()
                formatter.dateStyle = .medium
                formatter.timeStyle = .medium
                fields.append(MetadataField(
                    standard: .file,
                    key: "DateCreated",
                    value: formatter.string(from: created),
                    isEditable: false,
                    isSuspicious: false
                ))
            }

            if let modified = attrs[.modificationDate] as? Date {
                let formatter = DateFormatter()
                formatter.dateStyle = .medium
                formatter.timeStyle = .medium
                fields.append(MetadataField(
                    standard: .file,
                    key: "DateModified",
                    value: formatter.string(from: modified),
                    isEditable: false,
                    isSuspicious: false
                ))
            }
        }

        fields.append(MetadataField(
            standard: .file, key: "FileName",
            value: url.lastPathComponent, isEditable: false, isSuspicious: false
        ))
        fields.append(MetadataField(
            standard: .file, key: "FileType",
            value: url.pathExtension.uppercased(), isEditable: false, isSuspicious: false
        ))

        return fields
    }

    private func setFieldInProperties(_ properties: inout [String: Any], standard: String, key: String, value: String) {
        guard let dictKey = dictionaryKeyForStandard(standard) else { return }
        var dict = properties[dictKey] as? [String: Any] ?? [:]
        dict[key] = value
        properties[dictKey] = dict
    }

    private func removeFieldFromProperties(_ properties: inout [String: Any], standard: String, key: String) {
        guard let dictKey = dictionaryKeyForStandard(standard) else { return }
        var dict = properties[dictKey] as? [String: Any] ?? [:]
        dict.removeValue(forKey: key)
        properties[dictKey] = dict
    }

    private func dictionaryKeyForStandard(_ standard: String) -> String? {
        switch standard.uppercased() {
        case "EXIF":
            return kCGImagePropertyExifDictionary as String
        case "TIFF":
            return kCGImagePropertyTIFFDictionary as String
        case "IPTC":
            return kCGImagePropertyIPTCDictionary as String
        case "GPS":
            return kCGImagePropertyGPSDictionary as String
        case "XMP":
            return nil // XMP is handled differently
        default:
            return nil
        }
    }
}

// MARK: - Errors

enum MetadataError: LocalizedError {
    case cannotOpenFile(URL)
    case cannotReadMetadata(URL)
    case unsupportedFormat(URL)
    case cannotCreateDestination(URL)
    case writeFailed(URL)

    var errorDescription: String? {
        switch self {
        case .cannotOpenFile(let url):
            return "Cannot open file: \(url.lastPathComponent)"
        case .cannotReadMetadata(let url):
            return "Cannot read metadata from: \(url.lastPathComponent)"
        case .unsupportedFormat(let url):
            return "Unsupported format: \(url.pathExtension)"
        case .cannotCreateDestination(let url):
            return "Cannot write to: \(url.lastPathComponent)"
        case .writeFailed(let url):
            return "Write failed for: \(url.lastPathComponent)"
        }
    }
}
