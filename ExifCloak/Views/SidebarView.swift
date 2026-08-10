import SwiftUI
import AppKit

/// Sidebar showing the file queue — native macOS List style
struct SidebarView: View {
    @EnvironmentObject var appState: AppState
    @State private var renamingFile: ImageFileItem?
    @State private var renameText = ""
    @State private var showRenamePopover = false

    var body: some View {
        VStack(spacing: 0) {
            if appState.fileQueue.isEmpty {
                emptyQueueView
            } else {
                fileList
            }
        }
        .safeAreaInset(edge: .bottom) {
            if !appState.fileQueue.isEmpty {
                bottomBar
            }
        }
        // Rename popover anchored to the view
        .sheet(isPresented: $showRenamePopover) {
            renameSheet
        }
    }

    // MARK: - Empty State

    private var emptyQueueView: some View {
        VStack(spacing: 10) {
            Spacer()
            Image(systemName: "photo.on.rectangle.angled")
                .font(.system(size: 36))
                .foregroundStyle(.tertiary)
            Text("No Images")
                .font(.subheadline)
                .foregroundStyle(.secondary)
            Text("Drag files here or click + above")
                .font(.caption)
                .foregroundStyle(.tertiary)
            Spacer()
        }
        .frame(maxWidth: .infinity)
    }

    // MARK: - File List

    private var fileList: some View {
        List(appState.fileQueue, selection: Binding(
            get: { appState.currentFile?.id },
            set: { newId in
                // Defer to avoid reentrant NSTableView delegate operation
                DispatchQueue.main.async {
                    if let id = newId,
                       let file = appState.fileQueue.first(where: { $0.id == id }) {
                        selectFile(file)
                    }
                }
            }
        )) { file in
            FileRowView(file: file)
                .tag(file.id)
                .contextMenu { fileContextMenu(for: file) }
                .swipeActions(edge: .trailing) {
                    Button(role: .destructive) {
                        appState.removeFiles(ids: [file.id])
                    } label: {
                        Label("Remove", systemImage: "trash")
                    }
                }
        }
        .listStyle(.sidebar)
    }

    // MARK: - Rename Sheet (simple, focused, like Finder's rename)

    private var renameSheet: some View {
        VStack(spacing: 12) {
            Text("Rename")
                .font(.headline)

            TextField("File name", text: $renameText)
                .textFieldStyle(.roundedBorder)
                .font(.system(size: 13))
                .frame(width: 280)
                .onSubmit { commitRename() }

            HStack {
                Button("Cancel") {
                    showRenamePopover = false
                }
                .keyboardShortcut(.cancelAction)

                Spacer()

                Button("Rename") {
                    commitRename()
                }
                .buttonStyle(.borderedProminent)
                .keyboardShortcut(.defaultAction)
                .disabled(renameText.trimmingCharacters(in: .whitespaces).isEmpty)
            }
            .frame(width: 280)
        }
        .padding(20)
        .frame(width: 320)
    }

    // MARK: - Bottom Bar

    private var bottomBar: some View {
        HStack {
            Text("\(appState.fileQueue.count) file\(appState.fileQueue.count == 1 ? "" : "s")")
                .font(.caption)
                .foregroundStyle(.secondary)
            Spacer()
            Button("Clear All") {
                appState.clearQueue()
            }
            .font(.caption)
            .buttonStyle(.plain)
            .foregroundStyle(.secondary)
        }
        .padding(.horizontal, 12)
        .padding(.vertical, 6)
        .background(.bar)
    }

    // MARK: - Context Menu

    @ViewBuilder
    private func fileContextMenu(for file: ImageFileItem) -> some View {
        Button("Rename…") {
            startRename(file: file)
        }
        Button("Reveal in Finder") {
            NSWorkspace.shared.selectFile(file.url.path, inFileViewerRootedAtPath: "")
        }
        Divider()
        Button("Strip All Metadata") {
            appState.selectedFiles = [file.id]
            appState.stripAllMetadata()
        }
        Button("Strip AI Fields") {
            appState.selectedFiles = [file.id]
            appState.stripSuspiciousFields()
        }
        Divider()
        Button("Remove", role: .destructive) {
            appState.removeFiles(ids: [file.id])
        }
    }

    // MARK: - Actions

    private func selectFile(_ file: ImageFileItem) {
        appState.currentFile = file
        if file.metadata == nil {
            Task { await appState.loadMetadata(for: file) }
        }
    }

    private func startRename(file: ImageFileItem) {
        renamingFile = file
        renameText = (file.fileName as NSString).deletingPathExtension
        showRenamePopover = true
    }

    private func commitRename() {
        guard let file = renamingFile else { return }
        let trimmed = renameText.trimmingCharacters(in: .whitespaces)
        guard !trimmed.isEmpty else { return }

        let ext = (file.fileName as NSString).pathExtension
        let newName = ext.isEmpty ? trimmed : "\(trimmed).\(ext)"
        let newURL = file.url.deletingLastPathComponent().appendingPathComponent(newName)

        guard newURL != file.url else {
            showRenamePopover = false
            return
        }

        do {
            try FileManager.default.moveItem(at: file.url, to: newURL)
            if let idx = appState.fileQueue.firstIndex(where: { $0.id == file.id }) {
                appState.fileQueue[idx].url = newURL
                appState.fileQueue[idx].thumbnail = NSImage(contentsOf: newURL)?.resized(to: NSSize(width: 120, height: 120))
                // Force SwiftUI to detect the change by reassigning the element
                let updated = appState.fileQueue[idx]
                appState.fileQueue[idx] = updated
                if appState.currentFile?.id == file.id {
                    appState.currentFile = updated
                }
            }
        } catch {
            // Handle error silently
        }

        showRenamePopover = false
    }
}

// MARK: - File Row

struct FileRowView: View {
    let file: ImageFileItem

    var body: some View {
        HStack(spacing: 8) {
            Group {
                if let thumbnail = file.thumbnail {
                    Image(nsImage: thumbnail)
                        .resizable()
                        .aspectRatio(contentMode: .fill)
                } else {
                    Rectangle()
                        .fill(Color(nsColor: .quaternarySystemFill))
                        .overlay {
                            Image(systemName: "photo")
                                .font(.system(size: 10))
                                .foregroundStyle(.tertiary)
                        }
                }
            }
            .frame(width: 32, height: 32)
            .clipShape(RoundedRectangle(cornerRadius: 4))

            VStack(alignment: .leading, spacing: 1) {
                Text(file.fileName)
                    .font(.system(.body))
                    .lineLimit(1)

                Text(file.fileSizeFormatted)
                    .font(.caption)
                    .foregroundStyle(.secondary)
            }

            Spacer()

            if file.isProcessed {
                Image(systemName: "checkmark.circle.fill")
                    .font(.system(size: 12))
                    .foregroundStyle(.green)
            }
        }
        .padding(.vertical, 2)
    }
}
