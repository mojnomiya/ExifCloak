import Foundation

/// Manages undo history for metadata operations
/// Stores snapshots of original metadata before changes
@MainActor
final class MetadataUndoManager: ObservableObject {
    @Published var history: [UndoEntry] = []

    private let maxHistorySize = 50

    struct UndoEntry: Identifiable {
        let id = UUID()
        let fileURL: URL
        let fileName: String
        let action: String
        let originalMetadata: Data? // Serialized original file copy
        let timestamp: Date

        var timeAgo: String {
            let formatter = RelativeDateTimeFormatter()
            formatter.unitsStyle = .abbreviated
            return formatter.localizedString(for: timestamp, relativeTo: Date())
        }
    }

    /// Save a backup before modifying a file
    func saveSnapshot(for url: URL, action: String) {
        let backupDir = FileManager.default.temporaryDirectory
            .appendingPathComponent("ExifCloak_Undo", isDirectory: true)

        try? FileManager.default.createDirectory(
            at: backupDir,
            withIntermediateDirectories: true
        )

        let backupURL = backupDir.appendingPathComponent(
            "\(UUID().uuidString)_\(url.lastPathComponent)"
        )

        do {
            try FileManager.default.copyItem(at: url, to: backupURL)

            let entry = UndoEntry(
                fileURL: url,
                fileName: url.lastPathComponent,
                action: action,
                originalMetadata: try? Data(contentsOf: backupURL),
                timestamp: Date()
            )

            history.insert(entry, at: 0)

            // Trim old entries
            if history.count > maxHistorySize {
                history = Array(history.prefix(maxHistorySize))
            }

            // Clean up old backup file (we stored the data)
            try? FileManager.default.removeItem(at: backupURL)
        } catch {
            print("Failed to save undo snapshot: \(error)")
        }
    }

    /// Restore a file from a previous snapshot
    func restore(entry: UndoEntry) -> Bool {
        guard let data = entry.originalMetadata else { return false }

        do {
            try data.write(to: entry.fileURL, options: .atomic)
            history.removeAll { $0.id == entry.id }
            return true
        } catch {
            print("Failed to restore: \(error)")
            return false
        }
    }

    /// Clear all history and temp files
    func clearHistory() {
        history.removeAll()
        let backupDir = FileManager.default.temporaryDirectory
            .appendingPathComponent("ExifCloak_Undo", isDirectory: true)
        try? FileManager.default.removeItem(at: backupDir)
    }
}
