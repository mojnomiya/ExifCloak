import SwiftUI

/// Sheet for configuring and running auto-generation of metadata
struct GeneratorSheet: View {
    @EnvironmentObject var appState: AppState
    @Environment(\.dismiss) var dismiss

    @State private var selectedCategory: PresetCategory = .phone
    @State private var includeGPS = false
    @State private var selectedCity: String = "Random"
    @State private var randomizeTimestamp = true
    @State private var isGenerating = false

    private let cities = [
        "Random", "New York", "Los Angeles", "London",
        "Tokyo", "Paris", "Berlin", "Sydney", "Toronto",
        "Singapore", "Dubai", "San Francisco", "Dhaka",
        "Mumbai", "Seoul", "Bangkok"
    ]

    var body: some View {
        VStack(spacing: 0) {
            header
            Divider()
            ScrollView { formContent }
            Divider()
            footer
        }
        .frame(width: 440, height: 420)
    }

    // MARK: - Header

    private var header: some View {
        HStack {
            VStack(alignment: .leading) {
                Text("Auto-Generate Metadata")
                    .font(.title3)
                    .fontWeight(.semibold)
                Text("Create realistic camera metadata profiles")
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
            Spacer()
            Button("Cancel") { dismiss() }
                .keyboardShortcut(.cancelAction)
        }
        .padding()
    }

    // MARK: - Form

    private var formContent: some View {
        VStack(alignment: .leading, spacing: 16) {
            // Device category
            GroupBox("Device Type") {
                Picker("Generate as:", selection: $selectedCategory) {
                    Label("Phone", systemImage: "iphone").tag(PresetCategory.phone)
                    Label("DSLR", systemImage: "camera").tag(PresetCategory.dslr)
                    Label("Mirrorless", systemImage: "camera.viewfinder")
                        .tag(PresetCategory.mirrorless)
                }
                .pickerStyle(.segmented)
                .padding(.vertical, 4)

                Text(categoryDescription)
                    .font(.caption)
                    .foregroundColor(.secondary)
            }

            // Location options
            GroupBox("Location") {
                VStack(alignment: .leading, spacing: 8) {
                    Toggle("Include GPS data", isOn: $includeGPS)

                    if includeGPS {
                        Picker("Near city:", selection: $selectedCity) {
                            ForEach(cities, id: \.self) { city in
                                Text(city).tag(city)
                            }
                        }
                        Text("GPS coordinates will be randomized within the city area")
                            .font(.caption2)
                            .foregroundColor(.secondary)
                    }
                }
                .padding(.vertical, 4)
            }

            // Timestamp options
            GroupBox("Timestamp") {
                VStack(alignment: .leading, spacing: 8) {
                    Toggle("Randomize timestamp (within last 12 months)", isOn: $randomizeTimestamp)
                    Text("Biased toward daylight hours for realism")
                        .font(.caption2)
                        .foregroundColor(.secondary)
                }
                .padding(.vertical, 4)
            }

            // Info
            GroupBox("How it works") {
                VStack(alignment: .leading, spacing: 4) {
                    infoRow("Generates cohesive camera profiles (matching make/model/lens)")
                    infoRow("Each file gets a unique random combination")
                    infoRow("Strips existing suspicious fields before applying")
                    infoRow("Original pixel data is never modified")
                }
                .padding(.vertical, 4)
            }
        }
        .padding()
    }

    // MARK: - Footer

    private var footer: some View {
        HStack {
            let count = appState.selectedFiles.isEmpty ?
                appState.fileQueue.count : appState.selectedFiles.count
            Text("Will apply to \(count) file(s)")
                .font(.caption)
                .foregroundColor(.secondary)

            Spacer()

            Button("Generate & Apply") {
                applyGeneration()
            }
            .buttonStyle(.borderedProminent)
            .disabled(appState.fileQueue.isEmpty || isGenerating)
            .keyboardShortcut(.defaultAction)
        }
        .padding()
    }

    // MARK: - Helpers

    private var categoryDescription: String {
        switch selectedCategory {
        case .phone:
            return "Random iPhone, Pixel, or Samsung Galaxy profiles"
        case .dslr:
            return "Canon, Nikon, or Sony DSLR with matching lenses"
        case .mirrorless:
            return "Fujifilm, Sony, Panasonic, or OM mirrorless profiles"
        case .privacy, .custom:
            return ""
        }
    }

    private func infoRow(_ text: String) -> some View {
        HStack(alignment: .top, spacing: 6) {
            Image(systemName: "checkmark.circle.fill")
                .font(.caption2)
                .foregroundColor(.green)
            Text(text)
                .font(.caption)
                .foregroundColor(.secondary)
        }
    }

    // MARK: - Apply

    private func applyGeneration() {
        isGenerating = true

        let targets = appState.selectedFiles.isEmpty ?
            appState.fileQueue :
            appState.fileQueue.filter { appState.selectedFiles.contains($0.id) }

        let generator = MetadataGenerator(presetManager: appState.presetManager)
        let service = appState.metadataService
        let category = selectedCategory
        let shouldIncludeGPS = includeGPS
        let citySelection = selectedCity

        appState.isProcessing = true
        appState.batchProgress = BatchProgress(total: targets.count)

        Task.detached(priority: .userInitiated) {
            for (index, file) in targets.enumerated() {
                do {
                    // First strip suspicious fields
                    try service.stripSuspiciousFields(for: file)

                    // Generate new profile
                    let profile = await generator.generateProfile(for: category)

                    // Apply profile fields
                    for (standard, fields) in profile {
                        for (key, value) in fields {
                            if let metaStandard = MetadataStandard(rawValue: standard) {
                                try service.updateField(
                                    key: key, value: value,
                                    standard: metaStandard, in: file.url
                                )
                            }
                        }
                    }

                    // Add GPS if requested
                    if shouldIncludeGPS {
                        let city = citySelection == "Random" ? nil : citySelection
                        let gps = await generator.generateRandomGPS(near: city)
                        for (key, value) in gps {
                            try service.updateField(
                                key: key, value: value,
                                standard: .gps, in: file.url
                            )
                        }
                    }

                    await MainActor.run {
                        appState.batchProgress?.completed = index + 1
                    }
                } catch {
                    await MainActor.run {
                        appState.batchProgress?.errors.append(
                            BatchError(file: file, error: error)
                        )
                    }
                }
            }

            await MainActor.run {
                if let current = appState.currentFile {
                    appState.reloadMetadata(for: current)
                }
                appState.isProcessing = false
            }

            await MainActor.run {
                isGenerating = false
                dismiss()
            }
        }
    }
}
