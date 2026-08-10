import Foundation

/// Manages metadata presets: built-in defaults + user-created custom presets
@MainActor
final class PresetManager: ObservableObject {
    @Published var presets: [MetadataPreset] = []
    @Published var wordBanks: [WordBank] = []

    private let presetsKey = "com.exifcloak.presets"
    private let wordBanksKey = "com.exifcloak.wordBanks"

    init() {
        loadPresets()
        loadWordBanks()
        ensureBuiltInPresetsExist()
        ensureBuiltInWordBanksExist()
    }

    // MARK: - Preset CRUD

    func addPreset(_ preset: MetadataPreset) {
        presets.append(preset)
        savePresets()
    }

    func updatePreset(_ preset: MetadataPreset) {
        if let index = presets.firstIndex(where: { $0.id == preset.id }) {
            var updated = preset
            updated.dateModified = Date()
            presets[index] = updated
            savePresets()
        }
    }

    func deletePreset(_ preset: MetadataPreset) {
        guard !preset.isBuiltIn else { return }
        presets.removeAll { $0.id == preset.id }
        savePresets()
    }

    func duplicatePreset(_ preset: MetadataPreset) -> MetadataPreset {
        var copy = preset
        copy = MetadataPreset(
            name: "\(preset.name) (Copy)",
            description: preset.description,
            category: preset.category,
            fields: preset.fields,
            isBuiltIn: false
        )
        addPreset(copy)
        return copy
    }

    // MARK: - Word Bank CRUD

    func addWordBank(_ bank: WordBank) {
        wordBanks.append(bank)
        saveWordBanks()
    }

    func updateWordBank(_ bank: WordBank) {
        if let index = wordBanks.firstIndex(where: { $0.id == bank.id }) {
            wordBanks[index] = bank
            saveWordBanks()
        }
    }

    func deleteWordBank(_ bank: WordBank) {
        guard !bank.isBuiltIn else { return }
        wordBanks.removeAll { $0.id == bank.id }
        saveWordBanks()
    }

    // MARK: - Import/Export

    func exportPreset(_ preset: MetadataPreset) throws -> Data {
        let encoder = JSONEncoder()
        encoder.outputFormatting = [.prettyPrinted, .sortedKeys]
        return try encoder.encode(preset)
    }

    func importPreset(from data: Data) throws -> MetadataPreset {
        let decoder = JSONDecoder()
        var preset = try decoder.decode(MetadataPreset.self, from: data)
        preset = MetadataPreset(
            name: preset.name,
            description: preset.description,
            category: preset.category,
            fields: preset.fields,
            isBuiltIn: false
        )
        addPreset(preset)
        return preset
    }

    // MARK: - Persistence

    private func savePresets() {
        if let data = try? JSONEncoder().encode(presets) {
            UserDefaults.standard.set(data, forKey: presetsKey)
        }
    }

    private func loadPresets() {
        guard let data = UserDefaults.standard.data(forKey: presetsKey),
              let loaded = try? JSONDecoder().decode([MetadataPreset].self, from: data) else {
            return
        }
        presets = loaded
    }

    private func saveWordBanks() {
        if let data = try? JSONEncoder().encode(wordBanks) {
            UserDefaults.standard.set(data, forKey: wordBanksKey)
        }
    }

    private func loadWordBanks() {
        guard let data = UserDefaults.standard.data(forKey: wordBanksKey),
              let loaded = try? JSONDecoder().decode([WordBank].self, from: data) else {
            return
        }
        wordBanks = loaded
    }

    // MARK: - Built-in Presets

    private func ensureBuiltInPresetsExist() {
        let builtInNames = Set(BuiltInPresets.all.map(\.name))
        let existingBuiltIns = Set(presets.filter(\.isBuiltIn).map(\.name))

        for preset in BuiltInPresets.all where !existingBuiltIns.contains(preset.name) {
            presets.insert(preset, at: 0)
        }

        if !builtInNames.isEmpty {
            savePresets()
        }
    }

    private func ensureBuiltInWordBanksExist() {
        let builtInNames = Set(BuiltInWordBanks.all.map(\.name))
        let existingBuiltIns = Set(wordBanks.filter(\.isBuiltIn).map(\.name))

        for bank in BuiltInWordBanks.all where !existingBuiltIns.contains(bank.name) {
            wordBanks.insert(bank, at: 0)
        }

        if !builtInNames.isEmpty {
            saveWordBanks()
        }
    }
}
