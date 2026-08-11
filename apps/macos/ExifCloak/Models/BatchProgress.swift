import Foundation

/// Tracks progress of batch operations
struct BatchProgress {
    let total: Int
    var completed: Int = 0
    var errors: [BatchError] = []

    var progress: Double {
        guard total > 0 else { return 0 }
        return Double(completed) / Double(total)
    }

    var isComplete: Bool {
        completed >= total
    }

    var hasErrors: Bool {
        !errors.isEmpty
    }

    var summary: String {
        if isComplete && !hasErrors {
            return "Completed \(total) files successfully"
        } else if isComplete && hasErrors {
            return "Completed with \(errors.count) error(s) out of \(total) files"
        } else {
            return "Processing \(completed)/\(total)..."
        }
    }
}

struct BatchError: Identifiable {
    let id = UUID()
    let file: ImageFileItem
    let error: Error

    var description: String {
        "\(file.fileName): \(error.localizedDescription)"
    }
}

/// Export configuration for batch operations
struct ExportConfiguration {
    var destinationURL: URL?
    var namingPattern: NamingPattern = .suffix("_clean")
    var overwriteOriginals: Bool = false
    var generateReport: Bool = false
    var reportFormat: ReportFormat = .json
    var createZip: Bool = false
}

enum NamingPattern {
    case original
    case suffix(String)
    case prefix(String)
    case custom(String) // {original}, {date}, {index}

    var description: String {
        switch self {
        case .original: return "Keep original name"
        case .suffix(let s): return "Add suffix: \(s)"
        case .prefix(let p): return "Add prefix: \(p)"
        case .custom(let c): return "Custom: \(c)"
        }
    }

    func apply(to originalName: String, index: Int = 0) -> String {
        let nameWithoutExt = (originalName as NSString).deletingPathExtension
        let ext = (originalName as NSString).pathExtension

        switch self {
        case .original:
            return originalName
        case .suffix(let suffix):
            return "\(nameWithoutExt)\(suffix).\(ext)"
        case .prefix(let prefix):
            return "\(prefix)\(nameWithoutExt).\(ext)"
        case .custom(let pattern):
            let dateFormatter = DateFormatter()
            dateFormatter.dateFormat = "yyyyMMdd_HHmmss"
            return pattern
                .replacingOccurrences(of: "{original}", with: nameWithoutExt)
                .replacingOccurrences(of: "{date}", with: dateFormatter.string(from: Date()))
                .replacingOccurrences(of: "{index}", with: String(format: "%03d", index))
                .appending(".\(ext)")
        }
    }
}

enum ReportFormat: String, CaseIterable {
    case json = "JSON"
    case csv = "CSV"
}
