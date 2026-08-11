import SwiftUI
import UniformTypeIdentifiers

/// Main window — NavigationSplitView with native macOS styling
struct ContentView: View {
    @EnvironmentObject var appState: AppState
    @State private var isDropTargeted = false
    @State private var showBatchStripAllConfirm = false
    @State private var showBatchStripAIConfirm = false
    @State private var showBatchRename = false

    var body: some View {
        NavigationSplitView {
            SidebarView()
        } detail: {
            if appState.currentFile != nil {
                MetadataDetailView()
            } else {
                EmptyStateView()
            }
        }
        .navigationSplitViewColumnWidth(min: 200, ideal: 240, max: 320)
        .toolbar {
            ToolbarItemGroup(placement: .primaryAction) {
                addMenu
                batchMenu
            }
        }
        .overlay {
            if isDropTargeted { dropIndicator }
        }
        .sheet(isPresented: $appState.showPresetPicker) {
            PresetPickerSheet().environmentObject(appState)
        }
        .sheet(isPresented: $appState.showGenerator) {
            GeneratorSheet().environmentObject(appState)
        }
        .sheet(isPresented: $showBatchRename) {
            BatchRenameSheet().environmentObject(appState)
        }
        .batchProgressOverlay()
        .onDrop(of: [UTType.fileURL], isTargeted: $isDropTargeted) { providers in
            handleDrop(providers)
            return true
        }
        .confirmationDialog("Strip All Metadata?", isPresented: $showBatchStripAllConfirm, titleVisibility: .visible) {
            Button("Strip All (\(appState.fileQueue.count) files)", role: .destructive) {
                appState.batchStripAll()
            }
        } message: {
            Text("Permanently remove all metadata from every file. This cannot be undone.")
        }
        .confirmationDialog("Strip AI Fields?", isPresented: $showBatchStripAIConfirm, titleVisibility: .visible) {
            Button("Strip AI Fields (\(appState.fileQueue.count) files)", role: .destructive) {
                appState.batchStripSuspicious()
            }
        } message: {
            Text("Remove AI/tool signatures from every file. This cannot be undone.")
        }
    }

    // MARK: - Toolbar: Add

    private var addMenu: some View {
        Menu {
            Button("Open Files…") { openFilePicker() }
            Button("Open Folder…") { openFolderPicker() }
        } label: {
            Label("Add", systemImage: "plus")
        }
    }

    // MARK: - Toolbar: Batch

    private var batchMenu: some View {
        Menu {
            Button { showBatchStripAllConfirm = true } label: {
                Label("Strip All Metadata", systemImage: "trash")
            }
            Button { showBatchStripAIConfirm = true } label: {
                Label("Strip AI Fields", systemImage: "exclamationmark.triangle")
            }
            Divider()
            Button("Apply Preset…") { appState.showPresetPicker = true }
            Button("Auto-Generate…") { appState.showGenerator = true }
            Divider()
            Button { showBatchRename = true } label: {
                Label("Rename…", systemImage: "pencil")
            }
        } label: {
            Label("Batch", systemImage: "rectangle.stack.badge.play")
        }
        .disabled(appState.fileQueue.isEmpty)
    }

    // MARK: - Drop Indicator (native feel)

    private var dropIndicator: some View {
        RoundedRectangle(cornerRadius: 10)
            .strokeBorder(Color.accentColor.opacity(0.7), lineWidth: 2)
            .background(RoundedRectangle(cornerRadius: 10).fill(Color.accentColor.opacity(0.03)))
            .padding(3)
            .allowsHitTesting(false)
    }

    // MARK: - File Pickers

    private func openFilePicker() {
        let panel = NSOpenPanel()
        panel.allowsMultipleSelection = true
        panel.canChooseDirectories = false
        panel.canChooseFiles = true
        panel.allowedContentTypes = SupportedTypes.imageTypes
        panel.begin { response in
            if response == .OK {
                Task { @MainActor in appState.addFiles(from: panel.urls) }
            }
        }
    }

    private func openFolderPicker() {
        let panel = NSOpenPanel()
        panel.allowsMultipleSelection = true
        panel.canChooseDirectories = true
        panel.canChooseFiles = false
        panel.begin { response in
            if response == .OK {
                Task { @MainActor in appState.addFiles(from: panel.urls) }
            }
        }
    }

    // MARK: - Drop Handler

    private func handleDrop(_ providers: [NSItemProvider]) {
        for provider in providers {
            if provider.hasItemConformingToTypeIdentifier(UTType.fileURL.identifier) {
                provider.loadItem(forTypeIdentifier: UTType.fileURL.identifier, options: nil) { item, _ in
                    var url: URL?
                    if let data = item as? Data {
                        url = URL(dataRepresentation: data, relativeTo: nil)
                    } else if let u = item as? URL {
                        url = u
                    }
                    guard let fileURL = url else { return }
                    Task { @MainActor in
                        let accessed = fileURL.startAccessingSecurityScopedResource()
                        defer { if accessed { fileURL.stopAccessingSecurityScopedResource() } }
                        appState.addFiles(from: [fileURL])
                    }
                }
            }
        }
    }
}
