import SwiftUI
import UniformTypeIdentifiers

@main
struct ExifCloakApp: App {
    @StateObject private var appState = AppState()
    @NSApplicationDelegateAdaptor(AppDelegate.self) var appDelegate

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(appState)
                .frame(minWidth: 900, minHeight: 600)
        }
        .windowStyle(.titleBar)
        .windowToolbarStyle(.unified(showsTitle: true))
        .commands {
            CommandGroup(replacing: .newItem) {
                Button("Open Files...") {
                    openFilePicker()
                }
                .keyboardShortcut("o", modifiers: .command)

                Button("Open Folder...") {
                    openFolderPicker()
                }
                .keyboardShortcut("o", modifiers: [.command, .shift])
            }

            CommandMenu("Metadata") {
                Section("Current File") {
                    Button("Strip All Metadata") {
                        appState.stripAllMetadata()
                    }
                    .keyboardShortcut(.delete, modifiers: [.command, .shift])
                    .disabled(appState.fileQueue.isEmpty)

                    Button("Strip AI/Suspicious Fields") {
                        appState.stripSuspiciousFields()
                    }
                    .keyboardShortcut(.delete, modifiers: [.command, .option])
                    .disabled(appState.fileQueue.isEmpty)
                }

                Divider()

                Section("Batch (All Files)") {
                    Button("Strip All Metadata (All Files)") {
                        appState.batchStripAll()
                    }
                    .disabled(appState.fileQueue.isEmpty)

                    Button("Strip AI Fields (All Files)") {
                        appState.batchStripSuspicious()
                    }
                    .disabled(appState.fileQueue.isEmpty)
                }

                Divider()

                Button("Apply Preset...") {
                    appState.showPresetPicker = true
                }
                .keyboardShortcut("p", modifiers: [.command, .shift])
                .disabled(appState.fileQueue.isEmpty)

                Button("Auto-Generate Metadata...") {
                    appState.showGenerator = true
                }
                .keyboardShortcut("g", modifiers: [.command, .shift])
                .disabled(appState.fileQueue.isEmpty)
            }
        }

        Settings {
            SettingsView()
                .environmentObject(appState)
                .frame(minWidth: 500, minHeight: 400)
        }

        MenuBarExtra("ExifCloak", systemImage: "photo.badge.checkmark") {
            MenuBarView()
                .environmentObject(appState)
        }
    }

    // MARK: - File Pickers

    private func openFilePicker() {
        let panel = NSOpenPanel()
        panel.allowsMultipleSelection = true
        panel.canChooseDirectories = false
        panel.canChooseFiles = true
        panel.allowedContentTypes = SupportedTypes.imageTypes
        panel.message = "Select image files to process"
        panel.prompt = "Open"

        panel.begin { response in
            if response == .OK {
                Task { @MainActor in
                    appState.addFiles(from: panel.urls)
                }
            }
        }
    }

    private func openFolderPicker() {
        let panel = NSOpenPanel()
        panel.allowsMultipleSelection = true
        panel.canChooseDirectories = true
        panel.canChooseFiles = false
        panel.message = "Select folder(s) containing images"
        panel.prompt = "Import"

        panel.begin { response in
            if response == .OK {
                Task { @MainActor in
                    appState.addFiles(from: panel.urls)
                }
            }
        }
    }
}
