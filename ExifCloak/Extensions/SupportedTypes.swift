import UniformTypeIdentifiers

/// Defines supported file types for the app
enum SupportedTypes {
    /// UTTypes for file pickers
    static let imageTypes: [UTType] = [
        .jpeg,
        .png,
        .heic,
        .heif,
        .tiff,
        .webP,
    ]

    /// UTType identifiers for drag-and-drop
    static let imageUTTypes: [String] = [
        "public.jpeg",
        "public.png",
        "public.heic",
        "public.heif",
        "public.tiff",
        "org.webmproject.webp",
        "public.image",
    ]

    /// File extensions we support
    static let supportedExtensions: Set<String> = [
        "jpg", "jpeg", "png", "heic", "heif", "tiff", "tif", "webp"
    ]

    /// Check if a URL points to a supported image
    static func isSupported(_ url: URL) -> Bool {
        supportedExtensions.contains(url.pathExtension.lowercased())
    }
}
