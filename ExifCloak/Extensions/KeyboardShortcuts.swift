import SwiftUI

/// Global keyboard shortcut handling via view modifiers
extension View {
    /// Adds standard ExifCloak keyboard shortcuts
    func exifCloakShortcuts(appState: AppState) -> some View {
        self
            .onDeleteCommand {
                // Delete selected files from queue
                if !appState.selectedFiles.isEmpty {
                    appState.removeFiles(ids: appState.selectedFiles)
                }
            }
    }
}

/// Key commands for the app
enum AppKeyCommand {
    static let openFiles = KeyEquivalent("o")
    static let openFolder = KeyEquivalent("o") // + shift
    static let stripAll = KeyEquivalent("\u{08}") // backspace + cmd + shift
    static let stripAI = KeyEquivalent("\u{08}") // backspace + cmd + option
    static let applyPreset = KeyEquivalent("p") // + cmd + shift
    static let generate = KeyEquivalent("g") // + cmd + shift
    static let export = KeyEquivalent("e") // + cmd
    static let exportAll = KeyEquivalent("e") // + cmd + shift
}
