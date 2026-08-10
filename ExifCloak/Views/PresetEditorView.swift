import SwiftUI

/// View for creating/editing custom metadata presets
struct PresetEditorView: View {
    @EnvironmentObject var appState: AppState
    @Environment(\.dismiss) var dismiss

    @State var preset: MetadataPreset
    let isNew: Bool

    @State private var newFieldStandard = "EXIF"
    @State private var newFieldKey = ""
    @State private var showAddField = false

    var body: some View {
        VStack(spacing: 0) {
            // Header
            HStack {
                Text(isNew ? "New Preset" : "Edit Preset")
                    .font(.title3)
                    .fontWeight(.semibold)
                Spacer()
                Button("Cancel") { dismiss() }
                    .keyboardShortcut(.cancelAction)
            }
            .padding()

            Divider()

            // Form
            ScrollView {
                VStack(alignment: .leading, spacing: 16) {
                    // Basic info
                    GroupBox("Preset Info") {
                        VStack(alignment: .leading, spacing: 8) {
                            TextField("Name:", text: $preset.name)
                                .textFieldStyle(.roundedBorder)

                            TextField("Description:", text: $preset.description)
                                .textFieldStyle(.roundedBorder)

                            Picker("Category:", selection: $preset.category) {
                                ForEach(PresetCategory.allCases, id: \.self) { cat in
                                    Label(cat.rawValue, systemImage: cat.icon).tag(cat)
                                }
                            }
                        }
                        .padding(.vertical, 4)
                    }

                    // Fields
                    GroupBox {
                        VStack(alignment: .leading, spacing: 8) {
                            HStack {
                                Text("Fields (\(preset.fields.count))")
                                    .font(.subheadline)
                                    .fontWeight(.medium)
                                Spacer()
                                Button {
                                    showAddField.toggle()
                                } label: {
                                    Label("Add Field", systemImage: "plus")
                                }
                                .controlSize(.small)
                            }

                            if showAddField {
                                addFieldRow
                            }

                            ForEach(Array(preset.fields.enumerated()), id: \.element.id) { index, field in
                                presetFieldRow(field: field, index: index)
                            }

                            if preset.fields.isEmpty {
                                Text("No fields configured. Add fields to define what this preset modifies.")
                                    .font(.caption)
                                    .foregroundColor(.secondary)
                                    .padding(.vertical, 8)
                            }
                        }
                        .padding(.vertical, 4)
                    } label: {
                        Text("Metadata Fields")
                    }
                }
                .padding()
            }

            Divider()

            // Footer
            HStack {
                Spacer()
                Button(isNew ? "Create Preset" : "Save Changes") {
                    savePreset()
                }
                .buttonStyle(.borderedProminent)
                .disabled(preset.name.isEmpty)
                .keyboardShortcut(.defaultAction)
            }
            .padding()
        }
        .frame(width: 550, height: 600)
    }

    // MARK: - Add Field Row

    private var addFieldRow: some View {
        HStack {
            Picker("Standard:", selection: $newFieldStandard) {
                Text("EXIF").tag("EXIF")
                Text("TIFF").tag("TIFF")
                Text("IPTC").tag("IPTC")
                Text("GPS").tag("GPS")
                Text("XMP").tag("XMP")
            }
            .frame(width: 100)

            TextField("Key name", text: $newFieldKey)
                .textFieldStyle(.roundedBorder)

            Button("Add") {
                let newField = PresetField(
                    standard: newFieldStandard,
                    key: newFieldKey,
                    valueMode: .static,
                    staticValue: ""
                )
                preset.fields.append(newField)
                newFieldKey = ""
                showAddField = false
            }
            .disabled(newFieldKey.isEmpty)
        }
        .padding(8)
        .background(Color(nsColor: .controlBackgroundColor))
        .clipShape(RoundedRectangle(cornerRadius: 6))
    }

    // MARK: - Preset Field Row

    private func presetFieldRow(field: PresetField, index: Int) -> some View {
        HStack(spacing: 8) {
            Text(field.standard)
                .font(.caption2)
                .padding(2)
                .background(Color.accentColor.opacity(0.1))
                .clipShape(RoundedRectangle(cornerRadius: 3))

            Text(field.key)
                .font(.system(.caption, design: .monospaced))
                .lineLimit(1)

            Spacer()

            // Value mode
            Picker("", selection: Binding(
                get: { preset.fields[safe: index]?.valueMode ?? .static },
                set: { preset.fields[safe: index]?.valueMode = $0 }
            )) {
                ForEach(ValueMode.allCases, id: \.self) { mode in
                    Text(mode.rawValue).tag(mode)
                }
            }
            .frame(width: 130)
            .controlSize(.small)

            Button {
                preset.fields.remove(at: index)
            } label: {
                Image(systemName: "trash")
                    .font(.caption)
                    .foregroundColor(.red)
            }
            .buttonStyle(.borderless)
        }
        .padding(.vertical, 4)
    }

    // MARK: - Save

    private func savePreset() {
        if isNew {
            appState.presetManager.addPreset(preset)
        } else {
            appState.presetManager.updatePreset(preset)
        }
        dismiss()
    }
}

// Safe array subscript
extension Array {
    subscript(safe index: Int) -> Element? {
        get { indices.contains(index) ? self[index] : nil }
        set {
            if let newValue = newValue, indices.contains(index) {
                self[index] = newValue
            }
        }
    }
}
