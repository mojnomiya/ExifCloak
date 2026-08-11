import SwiftUI

/// Menu bar extra view for quick metadata operations
struct MenuBarView: View {
    @EnvironmentObject var appState: AppState
    @State private var dropTargeted = false

    var body: some View {
        VStack(spacing: 8) {
            // Header
            HStack {
                Image(systemName: "photo.badge.checkmark")
                    .foregroundColor(.accentColor)
                Text("ExifCloak")
                    .font(.headline)
                Spacer()
            }
            .padding(.horizontal)
            .padding(.top, 8)

            Divider()

            // Quick drop zone
            VStack(spacing: 6) {
                Image(systemName: dropTargeted ? "arrow.down.circle.fill" : "arrow.down.circle")
                    .font(.title2)
                    .foregroundColor(dropTargeted ? .accentColor : .secondary)

                Text("Drop image to strip metadata")
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
            .frame(maxWidth: .infinity)
            .frame(height: 80)
            .background(
                RoundedRectangle(cornerRadius: 8)
                    .stroke(style: StrokeStyle(lineWidth: 1.5, dash: [6]))
                    .foregroundColor(dropTargeted ? .accentColor : .secondary.opacity(0.5))
            )
            .padding(.horizontal)
            .onDrop(of: SupportedTypes.imageUTTypes, isTargeted: $dropTargeted) { providers in
                handleQuickStrip(providers)
                return true
            }

            Divider()

            // Queue status
            if !appState.fileQueue.isEmpty {
                HStack {
                    Text("\(appState.fileQueue.count) files in queue")
                        .font(.caption)
                        .foregroundColor(.secondary)
                    Spacer()
                    Button("Open App") {
                        NSApp.activate(ignoringOtherApps: true)
                        if let window = NSApp.windows.first(where: { $0.isVisible }) {
                            window.makeKeyAndOrderFront(nil)
                        }
                    }
                    .font(.caption)
                    .buttonStyle(.borderless)
                }
                .padding(.horizontal)
            }

            // Quick actions
            VStack(spacing: 4) {
                Button {
                    appState.showFilePicker = true
                    NSApp.activate(ignoringOtherApps: true)
                } label: {
                    Label("Open Files...", systemImage: "doc.badge.plus")
                        .frame(maxWidth: .infinity, alignment: .leading)
                }
                .buttonStyle(.borderless)

                Button {
                    appState.showFolderPicker = true
                    NSApp.activate(ignoringOtherApps: true)
                } label: {
                    Label("Open Folder...", systemImage: "folder.badge.plus")
                        .frame(maxWidth: .infinity, alignment: .leading)
                }
                .buttonStyle(.borderless)
            }
            .padding(.horizontal)

            Divider()

            Button("Quit ExifCloak") {
                NSApplication.shared.terminate(nil)
            }
            .padding(.horizontal)
            .padding(.bottom, 8)
        }
        .frame(width: 260)
    }

    // MARK: - Quick Strip

    private func handleQuickStrip(_ providers: [NSItemProvider]) {
        for provider in providers {
            provider.loadItem(forTypeIdentifier: "public.file-url", options: nil) { data, _ in
                guard let data = data as? Data,
                      let url = URL(dataRepresentation: data, relativeTo: nil) else { return }

                Task { @MainActor in
                    let file = ImageFileItem(url: url)
                    do {
                        try appState.metadataService.stripAllMetadata(for: file)
                        // Copy cleaned file to Downloads
                        let downloads = FileManager.default.urls(
                            for: .downloadsDirectory,
                            in: .userDomainMask
                        ).first!
                        let destURL = downloads.appendingPathComponent(
                            "\(url.deletingPathExtension().lastPathComponent)_clean.\(url.pathExtension)"
                        )
                        try? FileManager.default.copyItem(at: url, to: destURL)
                    } catch {
                        print("Quick strip failed: \(error)")
                    }
                }
            }
        }
    }
}
