import SwiftUI

/// Sheet for configuring and executing file export
struct ExportSheet: View {
    @EnvironmentObject var appState: AppState
    @Environment(\.dismiss) var dismiss

    enum Mode {
        case selected
        case all
    }

    let mode: Mode

    @State private var config = ExportConfiguration()
    @State private var namingSuffix = "_clean"
    @State private var namingPrefix = "cleaned_"
    @State private var customPattern = "{original}_clean"
    @State private var selectedNaming: NamingType = .suffix
    @State private var isExporting = false
    @State private var exportResult: ExportResult?

    enum NamingType: String, CaseIterable {
        case original = "Keep Original"
        case suffix = "Add Suffix"
        case prefix = "Add Prefix"
        case custom = "Custom Pattern"
    }

    private var targetFiles: [ImageFileItem] {
        switch mode {
        case .selected:
            return appState.fileQueue.filter { appState.selectedFiles.contains($0.id) }
        case .all:
            return appState.fileQueue
        }
    }

    var body: some View {
        VStack(spacing: 0) {
            header
            Divider()
            ScrollView {
                settingsForm
            }
            Divider()
            footer
        }
        .frame(width: 480, height: 500)
    }

    // MARK: - Header

    private var header: some View {
        HStack {
            VStack(alignment: .leading) {
                Text("Export Files")
                    .font(.title3)
                    .fontWeight(.semibold)
                Text("\(targetFiles.count) file(s) to export")
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
            Spacer()
            Button("Cancel") { dismiss() }
                .keyboardShortcut(.cancelAction)
        }
        .padding()
    }

    // MARK: - Settings Form

    private var settingsForm: some View {
        VStack(alignment: .leading, spacing: 20) {
            // Destination
            GroupBox("Destination") {
                VStack(alignment: .leading, spacing: 8) {
                    Toggle("Overwrite originals (in-place)", isOn: $config.overwriteOriginals)

                    if !config.overwriteOriginals {
                        HStack {
                            if let url = config.destinationURL {
                                Text(url.path)
                                    .font(.caption)
                                    .lineLimit(1)
                                    .truncationMode(.head)
                            } else {
                                Text("No destination selected")
                                    .font(.caption)
                                    .foregroundColor(.secondary)
                            }
                            Spacer()
                            Button("Choose...") {
                                chooseDestination()
                            }
                        }
                    }
                }
                .padding(.vertical, 4)
            }

            // File naming
            if !config.overwriteOriginals {
                GroupBox("File Naming") {
                    VStack(alignment: .leading, spacing: 8) {
                        Picker("Pattern:", selection: $selectedNaming) {
                            ForEach(NamingType.allCases, id: \.self) { type in
                                Text(type.rawValue).tag(type)
                            }
                        }
                        .pickerStyle(.segmented)

                        switch selectedNaming {
                        case .suffix:
                            TextField("Suffix:", text: $namingSuffix)
                                .textFieldStyle(.roundedBorder)
                            Text("Example: photo\(namingSuffix).jpg")
                                .font(.caption2)
                                .foregroundColor(.secondary)
                        case .prefix:
                            TextField("Prefix:", text: $namingPrefix)
                                .textFieldStyle(.roundedBorder)
                            Text("Example: \(namingPrefix)photo.jpg")
                                .font(.caption2)
                                .foregroundColor(.secondary)
                        case .custom:
                            TextField("Pattern:", text: $customPattern)
                                .textFieldStyle(.roundedBorder)
                            Text("Variables: {original}, {date}, {index}")
                                .font(.caption2)
                                .foregroundColor(.secondary)
                        case .original:
                            Text("Files keep their original names")
                                .font(.caption)
                                .foregroundColor(.secondary)
                        }
                    }
                    .padding(.vertical, 4)
                }
            }

            // Options
            GroupBox("Options") {
                VStack(alignment: .leading, spacing: 8) {
                    Toggle("Generate change report", isOn: $config.generateReport)

                    if config.generateReport {
                        Picker("Format:", selection: $config.reportFormat) {
                            ForEach(ReportFormat.allCases, id: \.self) { format in
                                Text(format.rawValue).tag(format)
                            }
                        }
                        .pickerStyle(.segmented)
                        .frame(width: 200)
                    }

                    Toggle("Create ZIP archive", isOn: $config.createZip)
                }
                .padding(.vertical, 4)
            }
        }
        .padding()
    }

    // MARK: - Footer

    private var footer: some View {
        HStack {
            if let result = exportResult {
                Label(result.summary, systemImage: result.errorCount > 0 ? "exclamationmark.triangle" : "checkmark.circle")
                    .font(.caption)
                    .foregroundColor(result.errorCount > 0 ? .orange : .green)
            }

            Spacer()

            Button("Export") {
                performExport()
            }
            .buttonStyle(.borderedProminent)
            .disabled(!canExport)
            .keyboardShortcut(.defaultAction)
        }
        .padding()
    }

    // MARK: - Actions

    private var canExport: Bool {
        config.overwriteOriginals || config.destinationURL != nil
    }

    private func chooseDestination() {
        let panel = NSOpenPanel()
        panel.canChooseDirectories = true
        panel.canChooseFiles = false
        panel.canCreateDirectories = true
        panel.prompt = "Choose Export Folder"

        if panel.runModal() == .OK {
            config.destinationURL = panel.url
        }
    }

    private func performExport() {
        // Build naming pattern
        config.namingPattern = {
            switch selectedNaming {
            case .original: return .original
            case .suffix: return .suffix(namingSuffix)
            case .prefix: return .prefix(namingPrefix)
            case .custom: return .custom(customPattern)
            }
        }()

        isExporting = true

        Task {
            do {
                let result = try await appState.exportService.exportBatch(
                    files: targetFiles,
                    configuration: config,
                    progressHandler: { _ in }
                )
                exportResult = result
                isExporting = false

                if result.errorCount == 0 {
                    DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) {
                        dismiss()
                    }
                }
            } catch {
                isExporting = false
            }
        }
    }
}
