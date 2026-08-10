import Foundation
import AppKit

/// Represents a single image file in the processing queue
struct ImageFileItem: Identifiable, Hashable {
    let id: UUID
    var url: URL
    var metadata: ImageMetadata?
    var thumbnail: NSImage?
    var isProcessed: Bool = false
    var exportURL: URL?

    var fileName: String { url.lastPathComponent }
    var fileExtension: String { url.pathExtension.lowercased() }

    var fileSizeFormatted: String {
        guard let attrs = try? FileManager.default.attributesOfItem(atPath: url.path),
              let size = attrs[.size] as? Int64 else {
            return "Unknown"
        }
        return ByteCountFormatter.string(fromByteCount: size, countStyle: .file)
    }

    init(url: URL, id: UUID = UUID()) {
        self.id = id
        self.url = url
        self.thumbnail = NSImage(contentsOf: url)?.resized(to: NSSize(width: 120, height: 120))
    }

    func hash(into hasher: inout Hasher) {
        hasher.combine(id)
        hasher.combine(url)
    }

    static func == (lhs: ImageFileItem, rhs: ImageFileItem) -> Bool {
        lhs.id == rhs.id && lhs.url == rhs.url
    }
}

extension NSImage {
    func resized(to targetSize: NSSize) -> NSImage {
        let ratioX = targetSize.width / size.width
        let ratioY = targetSize.height / size.height
        let ratio = min(ratioX, ratioY)

        let newSize = NSSize(
            width: size.width * ratio,
            height: size.height * ratio
        )

        let image = NSImage(size: newSize)
        image.lockFocus()
        NSGraphicsContext.current?.imageInterpolation = .high
        draw(
            in: NSRect(origin: .zero, size: newSize),
            from: NSRect(origin: .zero, size: self.size),
            operation: .copy,
            fraction: 1.0
        )
        image.unlockFocus()
        return image
    }
}
