import SwiftUI
import UniformTypeIdentifiers

/// Empty state — minimal, native macOS feel
struct EmptyStateView: View {
    @EnvironmentObject var appState: AppState

    var body: some View {
        VStack(spacing: 16) {
            Spacer()

            Image(systemName: "photo.badge.checkmark")
                .font(.system(size: 52, weight: .thin))
                .foregroundStyle(.tertiary)

            VStack(spacing: 4) {
                Text("ExifCloak")
                    .font(.title2)
                    .fontWeight(.medium)

                Text("Drop images here to view and manage metadata")
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
            }

            HStack(spacing: 10) {
                Button("Open Files…") { openFilePicker() }
                    .buttonStyle(.borderedProminent)
                    .controlSize(.large)

                Button("Open Folder…") { openFolderPicker() }
                    .buttonStyle(.bordered)
                    .controlSize(.large)
            }
            .padding(.top, 4)

            Spacer()
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }

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
}
