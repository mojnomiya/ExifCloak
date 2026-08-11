import SwiftUI
import AppKit

/// Finder-style batch rename — three modes like macOS Finder
struct BatchRenameSheet: View {
    @EnvironmentObject var appState: AppState
    @Environment(\.dismiss) var dismiss

    @State private var mode: RenameMode = .replaceText
    @State private var findText = ""
    @State private var replaceText = ""
    @State private var addText = ""
    @State private var addPosition: AddPosition = .afterName
    @State private var formatTemplate = "Image"
    @State private var startNumber = 1
    @State private var separator: SeparatorOption = .space
    @State private var errorMessage: String?

    enum RenameMode: String, CaseIterable {
        case replaceText = "Replace Text"
        case addText = "Add Text"
        case format = "Format"
    }

    enum AddPosition: String, CaseIterable {
        case beforeName = "Before Name"
        case afterName = "After Name"
    }

    enum SeparatorOption: String, CaseIterable {
        case space = "Space"
        case dash = "Dash"
        case underscore = "Underscore"
        case none = "None"

        var character: String {
            switch self {
            case .space: return " "
            case .dash: return "-"
            case .underscore: return "_"
            case .none: return ""
            }
        }
    }

    var body: some View {
        VStack(spacing: 0) {
            // Title
            HStack {
                Text("Rename \(appState.fileQueue.count) Items")
                    .font(.headline)
                Spacer()
            }
            .padding()

            Divider()

            // Mode picker
            Picker("", selection: $mode) {
                ForEach(RenameMode.allCases, id: \.self) { m in
                    Text(m.rawValue).tag(m)
                }
            }
            .pickerStyle(.segmented)
            .padding(.horizontal)
            .padding(.top, 12)

            // Options form
            Form {
                switch mode {
                case .replaceText:
                    TextField("Find:", text: $findText)
                    TextField("Replace with:", text: $replaceText)
                case .addText:
                    TextField("Text to add:", text: $addText)
                    Picker("Position:", selection: $addPosition) {
                        ForEach(AddPosition.allCases, id: \.self) { p in
                            Text(p.rawValue).tag(p)
                        }
                    }
                case .format:
                    TextField("Name:", text: $formatTemplate)
                    Picker("Separator:", selection: $separator) {
                        ForEach(SeparatorOption.allCases, id: \.self) { s in
                            Text(s.rawValue).tag(s)
                        }
                    }
                    Stepper("Start at: \(startNumber)", value: $startNumber, in: 0...9999)
                }
            }
            .formStyle(.grouped)
            .frame(height: 140)

            // Preview
            GroupBox("Preview") {
                VStack(alignment: .leading, spacing: 3) {
                    ForEach(Array(appState.fileQueue.prefix(4).enumerated()), id: \.element.id) { index, file in
                        HStack(spacing: 6) {
                            Text(file.fileName)
                                .font(.system(size: 11))
                                .foregroundStyle(.secondary)
                                .lineLimit(1)
                                .frame(maxWidth: .infinity, alignment: .leading)
                            Image(systemName: "arrow.right")
                                .font(.system(size: 9))
                                .foregroundStyle(.quaternary)
                            Text(computeNewName(for: file, index: index))
                                .font(.system(size: 11, weight: .medium))
                                .lineLimit(1)
                                .frame(maxWidth: .infinity, alignment: .leading)
                        }
                    }
                    if appState.fileQueue.count > 4 {
                        Text("+ \(appState.fileQueue.count - 4) more")
                            .font(.caption2)
                            .foregroundStyle(.tertiary)
                    }
                }
                .padding(4)
            }
            .padding(.horizontal)

            Spacer(minLength: 8)
            Divider()

            // Footer
            HStack {
                if let err = errorMessage {
                    Text(err)
                        .font(.caption)
                        .foregroundStyle(.red)
                }
                Spacer()
                Button("Cancel") { dismiss() }
                    .keyboardShortcut(.cancelAction)
                Button("Rename") { performRename() }
                    .buttonStyle(.borderedProminent)
                    .keyboardShortcut(.defaultAction)
                    .disabled(!canRename)
            }
            .padding()
        }
        .frame(width: 460, height: 440)
    }

    // MARK: - Logic

    private var canRename: Bool {
        switch mode {
        case .replaceText: return !findText.isEmpty
        case .addText: return !addText.isEmpty
        case .format: return !formatTemplate.isEmpty
        }
    }

    private func computeNewName(for file: ImageFileItem, index: Int) -> String {
        let name = (file.fileName as NSString).deletingPathExtension
        let ext = (file.fileName as NSString).pathExtension

        let newBase: String
        switch mode {
        case .replaceText:
            newBase = name.replacingOccurrences(of: findText, with: replaceText)
        case .addText:
            switch addPosition {
            case .beforeName: newBase = addText + name
            case .afterName: newBase = name + addText
            }
        case .format:
            let number = startNumber + index
            let digits = max(String(appState.fileQueue.count + startNumber - 1).count, 1)
            let padded = String(format: "%0\(digits)d", number)
            newBase = formatTemplate + separator.character + padded
        }

        return ext.isEmpty ? newBase : "\(newBase).\(ext)"
    }

    private func performRename() {
        errorMessage = nil
        let fm = FileManager.default

        for (index, file) in appState.fileQueue.enumerated() {
            let newName = computeNewName(for: file, index: index)
            let newURL = file.url.deletingLastPathComponent().appendingPathComponent(newName)

            if newURL == file.url { continue }

            if fm.fileExists(atPath: newURL.path) && newURL != file.url {
                errorMessage = "\"\(newName)\" already exists"
                return
            }

            do {
                try fm.moveItem(at: file.url, to: newURL)
                appState.fileQueue[index].url = newURL
                appState.fileQueue[index].thumbnail = NSImage(contentsOf: newURL)?.resized(to: NSSize(width: 120, height: 120))
                let updated = appState.fileQueue[index]
                appState.fileQueue[index] = updated
                if appState.currentFile?.id == file.id {
                    appState.currentFile = updated
                }
            } catch {
                errorMessage = error.localizedDescription
                return
            }
        }

        dismiss()
    }
}
