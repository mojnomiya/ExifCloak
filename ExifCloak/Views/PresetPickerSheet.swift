import SwiftUI

/// Sheet for choosing and applying a metadata preset
struct PresetPickerSheet: View {
    @EnvironmentObject var appState: AppState
    @Environment(\.dismiss) var dismiss
    @State private var selectedPreset: MetadataPreset?
    @State private var searchText = ""

    var body: some View {
        VStack(spacing: 0) {
            // Header
            HStack {
                Text("Apply Metadata Preset")
                    .font(.title3)
                    .fontWeight(.semibold)

                Spacer()

                Button("Cancel") {
                    dismiss()
                }
                .keyboardShortcut(.cancelAction)
            }
            .padding()

            Divider()

            // Search
            HStack {
                Image(systemName: "magnifyingglass")
                    .foregroundColor(.secondary)
                TextField("Search presets...", text: $searchText)
                    .textFieldStyle(.plain)
            }
            .padding(8)
            .background(Color(nsColor: .controlBackgroundColor))
            .clipShape(RoundedRectangle(cornerRadius: 6))
            .padding(.horizontal)
            .padding(.top, 8)

            // Preset list
            ScrollView {
                LazyVStack(spacing: 8) {
                    ForEach(PresetCategory.allCases, id: \.self) { category in
                        let presetsInCategory = filteredPresets(for: category)
                        if !presetsInCategory.isEmpty {
                            presetCategorySection(category: category, presets: presetsInCategory)
                        }
                    }
                }
                .padding()
            }

            Divider()

            // Footer
            HStack {
                if let preset = selectedPreset {
                    VStack(alignment: .leading) {
                        Text(preset.name)
                            .font(.caption)
                            .fontWeight(.medium)
                        Text("\(preset.fields.count) field(s) will be modified")
                            .font(.caption2)
                            .foregroundColor(.secondary)
                    }
                }

                Spacer()

                Button("Apply") {
                    if let preset = selectedPreset {
                        appState.batchApplyPreset(preset)
                        dismiss()
                    }
                }
                .buttonStyle(.borderedProminent)
                .disabled(selectedPreset == nil)
                .keyboardShortcut(.defaultAction)
            }
            .padding()
        }
        .frame(width: 500, height: 500)
    }

    // MARK: - Sections

    private func presetCategorySection(category: PresetCategory, presets: [MetadataPreset]) -> some View {
        VStack(alignment: .leading, spacing: 6) {
            HStack(spacing: 4) {
                Image(systemName: category.icon)
                    .font(.caption)
                Text(category.rawValue)
                    .font(.caption)
                    .fontWeight(.semibold)
            }
            .foregroundColor(.secondary)

            ForEach(presets) { preset in
                presetRow(preset)
            }
        }
    }

    private func presetRow(_ preset: MetadataPreset) -> some View {
        Button {
            selectedPreset = preset
        } label: {
            HStack {
                VStack(alignment: .leading, spacing: 2) {
                    Text(preset.name)
                        .font(.subheadline)
                        .fontWeight(.medium)

                    if !preset.description.isEmpty {
                        Text(preset.description)
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                }

                Spacer()

                if preset.isBuiltIn {
                    Text("Built-in")
                        .font(.caption2)
                        .padding(.horizontal, 6)
                        .padding(.vertical, 2)
                        .background(Color.blue.opacity(0.1))
                        .clipShape(Capsule())
                }

                if selectedPreset?.id == preset.id {
                    Image(systemName: "checkmark.circle.fill")
                        .foregroundColor(.accentColor)
                }
            }
            .padding(10)
            .background(
                RoundedRectangle(cornerRadius: 8)
                    .fill(selectedPreset?.id == preset.id ?
                          Color.accentColor.opacity(0.1) :
                          Color(nsColor: .controlBackgroundColor))
            )
        }
        .buttonStyle(.plain)
    }

    // MARK: - Filtering

    private func filteredPresets(for category: PresetCategory) -> [MetadataPreset] {
        let categoryPresets = appState.presetManager.presets.filter { $0.category == category }

        if searchText.isEmpty {
            return categoryPresets
        }

        let query = searchText.lowercased()
        return categoryPresets.filter {
            $0.name.lowercased().contains(query) ||
            $0.description.lowercased().contains(query)
        }
    }
}
