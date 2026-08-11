import Foundation
import SwiftData

/// A reusable metadata template/preset
struct MetadataPreset: Identifiable, Codable, Hashable {
    let id: UUID
    var name: String
    var description: String
    var category: PresetCategory
    var fields: [PresetField]
    var isBuiltIn: Bool
    var dateCreated: Date
    var dateModified: Date

    init(
        id: UUID = UUID(),
        name: String,
        description: String = "",
        category: PresetCategory = .custom,
        fields: [PresetField] = [],
        isBuiltIn: Bool = false
    ) {
        self.id = id
        self.name = name
        self.description = description
        self.category = category
        self.fields = fields
        self.isBuiltIn = isBuiltIn
        self.dateCreated = Date()
        self.dateModified = Date()
    }
}

enum PresetCategory: String, Codable, CaseIterable {
    case phone = "Phone"
    case dslr = "DSLR"
    case mirrorless = "Mirrorless"
    case privacy = "Privacy"
    case custom = "Custom"

    var icon: String {
        switch self {
        case .phone: return "iphone"
        case .dslr: return "camera"
        case .mirrorless: return "camera.viewfinder"
        case .privacy: return "lock.shield"
        case .custom: return "slider.horizontal.3"
        }
    }
}

/// A single field value within a preset, supporting randomization
struct PresetField: Identifiable, Codable, Hashable {
    let id: UUID
    let standard: String
    let key: String
    var valueMode: ValueMode
    var staticValue: String?
    var valuePool: [String]?
    var rangeMin: String?
    var rangeMax: String?

    init(
        id: UUID = UUID(),
        standard: String,
        key: String,
        valueMode: ValueMode = .static,
        staticValue: String? = nil,
        valuePool: [String]? = nil,
        rangeMin: String? = nil,
        rangeMax: String? = nil
    ) {
        self.id = id
        self.standard = standard
        self.key = key
        self.valueMode = valueMode
        self.staticValue = staticValue
        self.valuePool = valuePool
        self.rangeMin = rangeMin
        self.rangeMax = rangeMax
    }

    /// Resolve the value for this field (handles randomization)
    func resolvedValue() -> String {
        switch valueMode {
        case .static:
            return staticValue ?? ""
        case .randomFromPool:
            return valuePool?.randomElement() ?? ""
        case .randomInRange:
            return generateRandomInRange()
        case .remove:
            return ""
        }
    }

    private func generateRandomInRange() -> String {
        // Handle date ranges
        if key.lowercased().contains("date") || key.lowercased().contains("time") {
            return generateRandomDate()
        }
        // Handle numeric ranges
        if let min = Double(rangeMin ?? "0"), let max = Double(rangeMax ?? "100") {
            return String(format: "%.6f", Double.random(in: min...max))
        }
        return staticValue ?? ""
    }

    private func generateRandomDate() -> String {
        let now = Date()
        let calendar = Calendar.current
        let monthsBack = Int.random(in: 1...12)
        guard let randomDate = calendar.date(byAdding: .month, value: -monthsBack, to: now) else {
            return ISO8601DateFormatter().string(from: now)
        }
        // Add random time component
        let randomSeconds = Int.random(in: 0...(24 * 60 * 60))
        let finalDate = randomDate.addingTimeInterval(TimeInterval(randomSeconds))
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy:MM:dd HH:mm:ss"
        return formatter.string(from: finalDate)
    }
}

/// How a preset field's value is determined
enum ValueMode: String, Codable, CaseIterable {
    case `static` = "Static"
    case randomFromPool = "Random from Pool"
    case randomInRange = "Random in Range"
    case remove = "Remove Field"
}

/// Word/phrase bank for metadata generation
struct WordBank: Identifiable, Codable {
    let id: UUID
    var name: String
    var category: String
    var values: [String]
    var isBuiltIn: Bool

    init(id: UUID = UUID(), name: String, category: String, values: [String], isBuiltIn: Bool = false) {
        self.id = id
        self.name = name
        self.category = category
        self.values = values
        self.isBuiltIn = isBuiltIn
    }
}
