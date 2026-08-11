import Foundation
import AppKit

/// Handles exporting processed images with various configurations
actor ExportService {

    // MARK: - Export Single File

    func exportFile(
        _ file: ImageFileItem,
        to destinationURL: URL,
        naming: NamingPattern = .original
    ) async throws {
        let outputName = naming.apply(to: file.fileName)
        let outputURL = destinationURL.appendingPathComponent(outputName)

        try FileManager.default.copyItem(at: file.url, to: outputURL)
    }

    // MARK: - Export Batch

    func exportBatch(
        files: [ImageFileItem],
        configuration: ExportConfiguration,
        progressHandler: @Sendable (Int) -> Void
    ) async throws -> ExportResult {
        guard let destinationURL = configuration.destinationURL else {
            throw ExportError.noDestination
        }

        // Ensure destination directory exists
        try FileManager.default.createDirectory(
            at: destinationURL,
            withIntermediateDirectories: true
        )

        var changeLog: [ChangeLogEntry] = []
        var errorCount = 0

        for (index, file) in files.enumerated() {
            do {
                let outputName = configuration.namingPattern.apply(
                    to: file.fileName,
                    index: index
                )
                let outputURL = destinationURL.appendingPathComponent(outputName)

                if configuration.overwriteOriginals {
                    // In-place: file is already modified, just note it
                    changeLog.append(ChangeLogEntry(
                        originalFile: file.fileName,
                        outputFile: file.fileName,
                        action: "modified in place"
                    ))
                } else {
                    try FileManager.default.copyItem(at: file.url, to: outputURL)
                    changeLog.append(ChangeLogEntry(
                        originalFile: file.fileName,
                        outputFile: outputName,
                        action: "exported"
                    ))
                }

                progressHandler(index + 1)
            } catch {
                errorCount += 1
                changeLog.append(ChangeLogEntry(
                    originalFile: file.fileName,
                    outputFile: "",
                    action: "error: \(error.localizedDescription)"
                ))
            }
        }

        // Generate report if requested
        if configuration.generateReport {
            try generateReport(
                entries: changeLog,
                format: configuration.reportFormat,
                destination: destinationURL
            )
        }

        // Create zip if requested
        var zipURL: URL?
        if configuration.createZip {
            zipURL = try createZip(of: destinationURL)
        }

        return ExportResult(
            exportedCount: files.count - errorCount,
            errorCount: errorCount,
            destinationURL: destinationURL,
            zipURL: zipURL,
            changeLog: changeLog
        )
    }

    // MARK: - Report Generation

    private func generateReport(
        entries: [ChangeLogEntry],
        format: ReportFormat,
        destination: URL
    ) throws {
        switch format {
        case .json:
            try generateJSONReport(entries: entries, destination: destination)
        case .csv:
            try generateCSVReport(entries: entries, destination: destination)
        }
    }

    private func generateJSONReport(entries: [ChangeLogEntry], destination: URL) throws {
        let encoder = JSONEncoder()
        encoder.outputFormatting = [.prettyPrinted, .sortedKeys]

        let report = ExportReport(
            date: ISO8601DateFormatter().string(from: Date()),
            totalFiles: entries.count,
            entries: entries
        )

        let data = try encoder.encode(report)
        let reportURL = destination.appendingPathComponent("exifcloak_report.json")
        try data.write(to: reportURL)
    }

    private func generateCSVReport(entries: [ChangeLogEntry], destination: URL) throws {
        var csv = "Original File,Output File,Action\n"
        for entry in entries {
            csv += "\"\(entry.originalFile)\",\"\(entry.outputFile)\",\"\(entry.action)\"\n"
        }

        let reportURL = destination.appendingPathComponent("exifcloak_report.csv")
        try csv.write(to: reportURL, atomically: true, encoding: .utf8)
    }

    // MARK: - Zip Creation

    private func createZip(of directory: URL) throws -> URL {
        let zipURL = directory.deletingLastPathComponent()
            .appendingPathComponent("\(directory.lastPathComponent).zip")

        let coordinator = NSFileCoordinator()
        var zipError: NSError?

        coordinator.coordinate(
            readingItemAt: directory,
            options: .forUploading,
            error: &zipError
        ) { tempURL in
            try? FileManager.default.moveItem(at: tempURL, to: zipURL)
        }

        if let error = zipError {
            throw ExportError.zipFailed(error.localizedDescription)
        }

        return zipURL
    }
}

// MARK: - Supporting Types

struct ExportResult {
    let exportedCount: Int
    let errorCount: Int
    let destinationURL: URL
    let zipURL: URL?
    let changeLog: [ChangeLogEntry]

    var summary: String {
        if errorCount == 0 {
            return "Successfully exported \(exportedCount) file(s)"
        } else {
            return "Exported \(exportedCount) file(s) with \(errorCount) error(s)"
        }
    }
}

struct ChangeLogEntry: Codable {
    let originalFile: String
    let outputFile: String
    let action: String
}

struct ExportReport: Codable {
    let date: String
    let totalFiles: Int
    let entries: [ChangeLogEntry]
}

enum ExportError: LocalizedError {
    case noDestination
    case zipFailed(String)

    var errorDescription: String? {
        switch self {
        case .noDestination:
            return "No export destination selected"
        case .zipFailed(let reason):
            return "Failed to create ZIP: \(reason)"
        }
    }
}
