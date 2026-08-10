import AppKit
import SwiftUI

class AppDelegate: NSObject, NSApplicationDelegate {

    func applicationDidFinishLaunching(_ notification: Notification) {
        // Ensure the app becomes a regular foreground app that accepts keyboard input.
        // This is required when running via `swift build` (not an .app bundle).
        NSApp.setActivationPolicy(.regular)
        NSApp.activate(ignoringOtherApps: true)

        // Make sure the main window becomes key
        DispatchQueue.main.async {
            if let window = NSApp.windows.first {
                window.makeKeyAndOrderFront(nil)
            }
        }
    }

    func application(_ application: NSApplication, open urls: [URL]) {
        // Handle files dropped on Dock icon
        NotificationCenter.default.post(
            name: .didReceiveFilesFromDock,
            object: nil,
            userInfo: ["urls": urls]
        )
    }

    func applicationShouldTerminateAfterLastWindowClosed(_ sender: NSApplication) -> Bool {
        return false // Keep alive for menu bar
    }
}

extension Notification.Name {
    static let didReceiveFilesFromDock = Notification.Name("didReceiveFilesFromDock")
}
