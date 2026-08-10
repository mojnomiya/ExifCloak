import Foundation

/// Represents a metadata field with its standard, key, and value
struct MetadataField: Identifiable, Hashable {
    let id = UUID()
    let standard: MetadataStandard
    let key: String
    var value: String
    let isEditable: Bool
    let isSuspicious: Bool

    /// Human-readable display name for the field
    var displayName: String {
        // Convert camelCase/snake_case keys to readable names
        key.replacingOccurrences(of: "_", with: " ")
           .replacingOccurrences(of: "([a-z])([A-Z])", with: "$1 $2", options: .regularExpression)
           .capitalized
    }
}

/// Groups metadata by standard (EXIF, IPTC, XMP, GPS, File)
enum MetadataStandard: String, CaseIterable, Identifiable {
    case exif = "EXIF"
    case iptc = "IPTC"
    case xmp = "XMP"
    case gps = "GPS"
    case tiff = "TIFF"
    case file = "File System"

    var id: String { rawValue }

    var icon: String {
        switch self {
        case .exif: return "camera"
        case .iptc: return "doc.text"
        case .xmp: return "tag"
        case .gps: return "location"
        case .tiff: return "doc.richtext"
        case .file: return "folder"
        }
    }
}

/// Complete metadata for a single image file
struct ImageMetadata {
    var fields: [MetadataField] = []

    var groupedFields: [MetadataStandard: [MetadataField]] {
        Dictionary(grouping: fields, by: \.standard)
    }

    var suspiciousFields: [MetadataField] {
        fields.filter(\.isSuspicious)
    }

    var hasGPS: Bool {
        fields.contains { $0.standard == .gps }
    }

    var hasSuspiciousFields: Bool {
        !suspiciousFields.isEmpty
    }

    mutating func updateField(id: UUID, newValue: String) {
        if let index = fields.firstIndex(where: { $0.id == id }) {
            fields[index].value = newValue
        }
    }

    mutating func removeField(id: UUID) {
        fields.removeAll { $0.id == id }
    }

    mutating func removeFields(in standard: MetadataStandard) {
        fields.removeAll { $0.standard == standard }
    }
}

/// Suspicious/AI-related field keys that should be flagged
struct SuspiciousFieldKeys {
    static let keys: Set<String> = [
        // Software/Tool signatures
        "Software",
        "CreatorTool",
        "XMP:CreatorTool",
        "HistorySoftwareAgent",
        "ProcessingSoftware",
        "ImageDescription",

        // AI generation markers
        "UserComment",
        "Comment",
        "Description",
        "dc:description",
        "photoshop:History",

        // C2PA / Content Credentials
        "C2PA",
        "c2pa.actions",
        "c2pa.claim",
        "c2pa.signature",
        "dcterms:provenance",
        "stRef:documentID",
        "stRef:instanceID",

        // Adobe-specific
        "xmp:CreatorTool",
        "xmpMM:History",
        "xmpMM:DerivedFrom",
        "xmpMM:OriginalDocumentID",

        // Stability/Midjourney/DALL-E markers
        "parameters",
        "prompt",
        "negative_prompt",
        "sd:model",
        "sd:sampler",
    ]

    static func isSuspicious(_ key: String) -> Bool {
        let normalizedKey = key.lowercased()
        return keys.contains { $0.lowercased() == normalizedKey } ||
               normalizedKey.contains("c2pa") ||
               normalizedKey.contains("contentcredentials") ||
               normalizedKey.contains("ai") && normalizedKey.contains("tool")
    }
}
