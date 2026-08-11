import SwiftUI

/// App settings/preferences window
struct SettingsView: View {
    @EnvironmentObject var appState: AppState
    @AppStorage("defaultAction") private var defaultAction = "strip"
    @AppStorage("preserveOriginals") private var preserveOriginals = true
    @AppStorage("defaultNamingSuffix") private var defaultNamingSuffix = "_clean"
    @AppStorage("showMenuBarIcon") private var showMenuBarIcon = true
    @AppStorage("confirmOverwrite") private var confirmOverwrite = true

    var body: some View {
        TabView {
            generalTab
                .tabItem {
                    Label("General", systemImage: "gear")
                }

            presetsTab
                .tabItem {
                    Label("Presets", systemImage: "slider.horizontal.3")
                }

            wordBanksTab
                .tabItem {
                    Label("Word Banks", systemImage: "text.book.closed")
                }
        }
        .frame(width: 500, height: 400)
    }

    // MARK: - General Tab

    private var generalTab: some View {
        Form {
            Section("Default Behavior") {
                Picker("Default action for dropped files:", selection: $defaultAction) {
                    Text("Strip All Metadata").tag("strip")
                    Text("Strip AI Fields Only").tag("stripAI")
                    Text("Open for Review").tag("review")
                }

                Toggle("Preserve original files (work on copies)", isOn: $preserveOriginals)
                Toggle("Confirm before overwriting", isOn: $confirmOverwrite)
            }

            Section("File Naming") {
                TextField("Default suffix for cleaned files:", text: $defaultNamingSuffix)
                    .textFieldStyle(.roundedBorder)
                Text("Example: photo\(defaultNamingSuffix).jpg")
                    .font(.caption)
                    .foregroundColor(.secondary)
            }

            Section("Menu Bar") {
                Toggle("Show menu bar icon", isOn: $showMenuBarIcon)
                Text("Quick-drop images on the menu bar icon to strip metadata instantly")
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
        }
        .formStyle(.grouped)
        .padding()
    }

    // MARK: - Presets Tab

    private var presetsTab: some View {
        VStack(alignment: .leading) {
            HStack {
                Text("Metadata Presets")
                    .font(.headline)
                Spacer()

                Button {
                    importPreset()
                } label: {
                    Label("Import", systemImage: "square.and.arrow.down")
                }
            }
            .padding(.horizontal)
            .padding(.top)

            List {
                ForEach(appState.presetManager.presets) { preset in
                    HStack {
                        Image(systemName: preset.category.icon)
                            .foregroundColor(.accentColor)
                            .frame(width: 20)

                        VStack(alignment: .leading) {
                            Text(preset.name)
                                .font(.subheadline)
                            Text(preset.description)
                                .font(.caption)
                                .foregroundColor(.secondary)
                        }

                        Spacer()

                        if preset.isBuiltIn {
                            Text("Built-in")
                                .font(.caption2)
                                .foregroundColor(.secondary)
                        } else {
                            Button {
                                appState.presetManager.deletePreset(preset)
                            } label: {
                                Image(systemName: "trash")
                                    .foregroundColor(.red)
                            }
                            .buttonStyle(.borderless)
                        }

                        Button {
                            exportPreset(preset)
                        } label: {
                            Image(systemName: "square.and.arrow.up")
                        }
                        .buttonStyle(.borderless)
                    }
                }
            }
        }
    }

    // MARK: - Word Banks Tab

    private var wordBanksTab: some View {
        VStack(alignment: .leading) {
            HStack {
                Text("Word/Phrase Banks")
                    .font(.headline)
                Spacer()

                Button {
                    addNewWordBank()
                } label: {
                    Label("Add Bank", systemImage: "plus")
                }
            }
            .padding(.horizontal)
            .padding(.top)

            List {
                ForEach(appState.presetManager.wordBanks) { bank in
                    VStack(alignment: .leading, spacing: 4) {
                        HStack {
                            Text(bank.name)
                                .font(.subheadline)
                                .fontWeight(.medium)

                            Text("(\(bank.values.count) values)")
                                .font(.caption)
                                .foregroundColor(.secondary)

                            Spacer()

                            if bank.isBuiltIn {
                                Text("Built-in")
                                    .font(.caption2)
                                    .foregroundColor(.secondary)
                            }
                        }

                        Text(bank.values.prefix(5).joined(separator: ", "))
                            .font(.caption)
                            .foregroundColor(.secondary)
                            .lineLimit(1)
                    }
                    .padding(.vertical, 2)
                }
            }
        }
    }

    // MARK: - Actions

    private func importPreset() {
        let panel = NSOpenPanel()
        panel.allowedContentTypes = [.json]
        panel.canChooseFiles = true
        panel.canChooseDirectories = false

        if panel.runModal() == .OK, let url = panel.url {
            if let data = try? Data(contentsOf: url) {
                _ = try? appState.presetManager.importPreset(from: data)
            }
        }
    }

    private func exportPreset(_ preset: MetadataPreset) {
        guard let data = try? appState.presetManager.exportPreset(preset) else { return }

        let panel = NSSavePanel()
        panel.allowedContentTypes = [.json]
        panel.nameFieldStringValue = "\(preset.name).json"

        if panel.runModal() == .OK, let url = panel.url {
            try? data.write(to: url)
        }
    }

    private func addNewWordBank() {
        let newBank = WordBank(
            name: "New Word Bank",
            category: "Custom",
            values: []
        )
        appState.presetManager.addWordBank(newBank)
    }
}
