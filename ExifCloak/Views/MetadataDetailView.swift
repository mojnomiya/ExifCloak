import SwiftUI

/// Detail view showing metadata — styled like a native macOS inspector
struct MetadataDetailView: View {
    @EnvironmentObject var appState: AppState

    @State private var searchText = ""
    @State private var expandedSections: Set<MetadataStandard> = Set(MetadataStandard.allCases)
    @State private var statusMessage: StatusMessage?
    @State private var showStripAllConfirm = false
    @State private var showStripAIConfirm = false

    private var file: ImageFileItem? { appState.currentFile }

    var body: some View {
        if let file = file {
            VStack(spacing: 0) {
                // Header
                header(file)

                Divider()

                // Content
                if let metadata = file.metadata {
                    if metadata.fields.isEmpty {
                        emptyMetadataView
                    } else {
                        toolbar(file)
                        metadataContent(metadata)
                    }
                } else {
                    loadingView
                }

                // Status toast
                if let status = statusMessage {
                    statusToast(status)
                }
            }
            .id(file.id)
            .task(id: file.id) {
                if file.metadata == nil {
                    await appState.loadMetadata(for: file)
                }
            }
            .confirmationDialog("Strip All Metadata?", isPresented: $showStripAllConfirm, titleVisibility: .visible) {
                Button("Strip All", role: .destructive) { stripAll(file) }
            } message: {
                Text("Remove all metadata from \"\(file.fileName)\". This modifies the file directly.")
            }
            .confirmationDialog("Strip AI Fields?", isPresented: $showStripAIConfirm, titleVisibility: .visible) {
                Button("Strip AI Fields", role: .destructive) { stripSuspicious(file) }
            } message: {
                Text("Remove AI/tool signature fields from \"\(file.fileName)\". This modifies the file directly.")
            }
        }
    }

    // MARK: - Header

    private func header(_ file: ImageFileItem) -> some View {
        HStack(spacing: 12) {
            if let thumbnail = file.thumbnail {
                Image(nsImage: thumbnail)
                    .resizable()
                    .aspectRatio(contentMode: .fit)
                    .frame(maxWidth: 64, maxHeight: 50)
                    .clipShape(RoundedRectangle(cornerRadius: 4))
            }

            VStack(alignment: .leading, spacing: 3) {
                Text(file.fileName)
                    .font(.headline)
                    .lineLimit(1)

                HStack(spacing: 8) {
                    Text(file.fileSizeFormatted)
                    Text("·")
                    Text(file.fileExtension.uppercased())
                    if let metadata = file.metadata {
                        Text("·")
                        Text("\(metadata.fields.count) fields")
                    }
                }
                .font(.caption)
                .foregroundStyle(.secondary)

                if let metadata = file.metadata, metadata.hasSuspiciousFields {
                    Label("\(metadata.suspiciousFields.count) suspicious", systemImage: "exclamationmark.triangle.fill")
                        .font(.caption)
                        .foregroundStyle(.orange)
                }
            }
            Spacer()
        }
        .padding(12)
    }

    // MARK: - Toolbar

    private func toolbar(_ file: ImageFileItem) -> some View {
        HStack(spacing: 6) {
            // Search
            HStack(spacing: 4) {
                Image(systemName: "magnifyingglass")
                    .font(.system(size: 11))
                    .foregroundStyle(.tertiary)
                TextField("Filter", text: $searchText)
                    .textFieldStyle(.plain)
                    .font(.system(size: 12))
                if !searchText.isEmpty {
                    Button { searchText = "" } label: {
                        Image(systemName: "xmark.circle.fill")
                            .font(.system(size: 11))
                            .foregroundStyle(.tertiary)
                    }
                    .buttonStyle(.plain)
                }
            }
            .padding(.horizontal, 6)
            .padding(.vertical, 4)
            .background(Color(nsColor: .quaternarySystemFill))
            .clipShape(RoundedRectangle(cornerRadius: 5))
            .frame(maxWidth: 180)

            Spacer()

            // Actions
            Button { showStripAllConfirm = true } label: {
                Text("Strip All")
                    .font(.system(size: 11, weight: .medium))
            }
            .buttonStyle(.bordered)
            .controlSize(.small)

            Button { showStripAIConfirm = true } label: {
                Text("Strip AI")
                    .font(.system(size: 11, weight: .medium))
            }
            .buttonStyle(.bordered)
            .controlSize(.small)

            Button { appState.reloadMetadata(for: file) } label: {
                Image(systemName: "arrow.clockwise")
                    .font(.system(size: 11))
            }
            .buttonStyle(.bordered)
            .controlSize(.small)
            .help("Reload from disk")
        }
        .padding(.horizontal, 12)
        .padding(.vertical, 6)
        .background(.bar)
    }

    // MARK: - Metadata Content

    private func metadataContent(_ metadata: ImageMetadata) -> some View {
        List {
            ForEach(MetadataStandard.allCases) { standard in
                let fields = filteredFields(for: standard, in: metadata)
                if !fields.isEmpty {
                    Section(isExpanded: Binding(
                        get: { expandedSections.contains(standard) },
                        set: { expanded in
                            if expanded { expandedSections.insert(standard) }
                            else { expandedSections.remove(standard) }
                        }
                    )) {
                        ForEach(fields) { field in
                            MetadataFieldRow(
                                field: field,
                                onEdit: { editField(field, newValue: $0) },
                                onDelete: { deleteField(field) }
                            )
                        }
                    } header: {
                        sectionHeader(standard: standard, count: fields.count, fields: fields)
                    }
                }
            }
        }
        .listStyle(.inset(alternatesRowBackgrounds: true))
    }

    private func sectionHeader(standard: MetadataStandard, count: Int, fields: [MetadataField]) -> some View {
        HStack(spacing: 5) {
            Image(systemName: standard.icon)
                .font(.system(size: 10))
                .foregroundStyle(.secondary)
            Text(standard.rawValue)
                .font(.system(size: 11, weight: .semibold))
            Text("(\(count))")
                .font(.system(size: 10))
                .foregroundStyle(.tertiary)
            if fields.contains(where: \.isSuspicious) {
                Image(systemName: "exclamationmark.triangle.fill")
                    .font(.system(size: 9))
                    .foregroundStyle(.orange)
            }
        }
    }

    // MARK: - States

    private var emptyMetadataView: some View {
        VStack(spacing: 10) {
            Spacer()
            Image(systemName: "checkmark.shield.fill")
                .font(.system(size: 36))
                .foregroundStyle(.green)
            Text("Clean")
                .font(.title3)
                .fontWeight(.medium)
            Text("No metadata found in this file.")
                .font(.caption)
                .foregroundStyle(.secondary)
            Spacer()
        }
        .frame(maxWidth: .infinity)
    }

    private var loadingView: some View {
        VStack(spacing: 6) {
            Spacer()
            ProgressView()
                .controlSize(.small)
            Text("Reading metadata…")
                .font(.caption)
                .foregroundStyle(.secondary)
            Spacer()
        }
        .frame(maxWidth: .infinity)
    }

    // MARK: - Status Toast

    private func statusToast(_ status: StatusMessage) -> some View {
        HStack(spacing: 5) {
            Image(systemName: status.icon)
            Text(status.text)
        }
        .font(.caption)
        .foregroundStyle(status.color)
        .padding(.horizontal, 10)
        .padding(.vertical, 5)
        .background(status.color.opacity(0.08), in: RoundedRectangle(cornerRadius: 5))
        .padding(8)
        .transition(.move(edge: .bottom).combined(with: .opacity))
    }

    // MARK: - Actions

    private func stripAll(_ file: ImageFileItem) {
        appState.selectedFiles = [file.id]
        appState.stripAllMetadata()
        showStatus("All metadata stripped", icon: "checkmark.circle.fill", color: .green)
    }

    private func stripSuspicious(_ file: ImageFileItem) {
        appState.selectedFiles = [file.id]
        appState.stripSuspiciousFields()
        showStatus("AI fields stripped", icon: "checkmark.circle.fill", color: .orange)
    }

    private func editField(_ field: MetadataField, newValue: String) {
        guard let file = file else { return }
        let service = appState.metadataService
        Task.detached(priority: .userInitiated) {
            try? service.updateField(key: field.key, value: newValue, standard: field.standard, in: file.url)
            await MainActor.run { [weak appState] in
                appState?.reloadMetadata(for: file)
            }
        }
        showStatus("'\(field.key)' saved", icon: "checkmark.circle.fill", color: .green)
    }

    private func deleteField(_ field: MetadataField) {
        guard let file = file else { return }
        let service = appState.metadataService
        Task.detached(priority: .userInitiated) {
            try? service.removeField(key: field.key, standard: field.standard, in: file.url)
            await MainActor.run { [weak appState] in
                appState?.reloadMetadata(for: file)
            }
        }
        showStatus("'\(field.key)' removed", icon: "minus.circle.fill", color: .red)
    }

    private func showStatus(_ text: String, icon: String, color: Color) {
        withAnimation(.easeOut(duration: 0.15)) {
            statusMessage = StatusMessage(text: text, icon: icon, color: color)
        }
        DispatchQueue.main.asyncAfter(deadline: .now() + 2.5) {
            withAnimation(.easeIn(duration: 0.2)) { statusMessage = nil }
        }
    }

    // MARK: - Filtering

    private func filteredFields(for standard: MetadataStandard, in metadata: ImageMetadata) -> [MetadataField] {
        let grouped = metadata.groupedFields[standard] ?? []
        if searchText.isEmpty { return grouped }
        let q = searchText.lowercased()
        return grouped.filter {
            $0.key.lowercased().contains(q) ||
            $0.value.lowercased().contains(q)
        }
    }
}

struct StatusMessage {
    let text: String
    let icon: String
    let color: Color
}
