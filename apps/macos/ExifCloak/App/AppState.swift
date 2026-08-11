import SwiftUI
import Combine

/// Central app state managing the file queue, selections, and UI triggers
@MainActor
final class AppState: ObservableObject {
    // MARK: - File Queue
    @Published var fileQueue: [ImageFileItem] = []
    @Published var selectedFiles: Set<UUID> = []
    @Published var currentFile: ImageFileItem?

    // MARK: - UI State
    @Published var showFilePicker = false
    @Published var showFolderPicker = false
    @Published var showPresetPicker = false
    @Published var showGenerator = false
    @Published var isProcessing = false
    @Published var batchProgress: BatchProgress?
    @Published var searchText = ""

    // MARK: - Services
    let metadataService = MetadataService()
    let presetManager = PresetManager()
    let exportService = ExportService()

    // MARK: - Dock Drop Listener
    private var cancellables = Set<AnyCancellable>()

    init() {
        NotificationCenter.default.publisher(for: .didReceiveFilesFromDock)
            .compactMap { $0.userInfo?["urls"] as? [URL] }
            .receive(on: DispatchQueue.main)
            .sink { [weak self] urls in
                self?.addFiles(from: urls)
            }
            .store(in: &cancellables)
    }

    // MARK: - File Management

    func addFiles(from urls: [URL]) {
        let supportedExtensions = Set(["jpg", "jpeg", "png", "heic", "heif", "tiff", "tif", "webp"])

        for url in urls {
            let accessed = url.startAccessingSecurityScopedResource()
            defer {
                if accessed {
                    url.stopAccessingSecurityScopedResource()
                }
            }

            var isDirectory: ObjCBool = false
            guard FileManager.default.fileExists(atPath: url.path, isDirectory: &isDirectory) else {
                continue
            }

            if isDirectory.boolValue {
                addFolder(url, supportedExtensions: supportedExtensions)
            } else if supportedExtensions.contains(url.pathExtension.lowercased()) {
                addSingleFile(url)
            }
        }
    }

    private func addFolder(_ url: URL, supportedExtensions: Set<String>) {
        guard let enumerator = FileManager.default.enumerator(
            at: url,
            includingPropertiesForKeys: [.isRegularFileKey],
            options: [.skipsHiddenFiles]
        ) else { return }

        for case let fileURL as URL in enumerator {
            if supportedExtensions.contains(fileURL.pathExtension.lowercased()) {
                addSingleFile(fileURL)
            }
        }
    }

    private func addSingleFile(_ url: URL) {
        guard !fileQueue.contains(where: { $0.url == url }) else { return }

        let item = ImageFileItem(url: url)
        fileQueue.append(item)

        // Auto-select first file
        if currentFile == nil {
            currentFile = item
            selectedFiles.insert(item.id)
        }

        // Preload metadata on background thread
        let itemId = item.id
        let service = metadataService
        let fileURL = url

        Task.detached(priority: .userInitiated) {
            let metadata = try? service.readMetadata(from: fileURL)
            await MainActor.run { [weak self] in
                guard let self else { return }
                if let index = self.fileQueue.firstIndex(where: { $0.id == itemId }) {
                    self.fileQueue[index].metadata = metadata
                }
                if self.currentFile?.id == itemId {
                    self.currentFile?.metadata = metadata
                }
            }
        }
    }

    func removeFiles(ids: Set<UUID>) {
        fileQueue.removeAll { ids.contains($0.id) }
        selectedFiles.subtract(ids)
        if let current = currentFile, ids.contains(current.id) {
            currentFile = fileQueue.first
        }
    }

    func clearQueue() {
        fileQueue.removeAll()
        selectedFiles.removeAll()
        currentFile = nil
    }

    // MARK: - Metadata Actions

    func stripAllMetadata() {
        let targets = targetFiles()
        guard !targets.isEmpty else { return }

        let service = metadataService
        Task.detached(priority: .userInitiated) {
            await MainActor.run { [weak self] in
                self?.isProcessing = true
                self?.batchProgress = BatchProgress(total: targets.count)
            }

            for (index, file) in targets.enumerated() {
                do {
                    try service.stripAllMetadata(for: file)
                    await MainActor.run { [weak self] in
                        guard let self else { return }
                        if let idx = self.fileQueue.firstIndex(where: { $0.id == file.id }) {
                            self.fileQueue[idx].isProcessed = true
                        }
                        self.batchProgress?.completed = index + 1
                    }
                } catch {
                    await MainActor.run { [weak self] in
                        self?.batchProgress?.errors.append(BatchError(file: file, error: error))
                    }
                }
            }

            // Reload current file metadata
            await MainActor.run { [weak self] in
                guard let self else { return }
                if let current = self.currentFile {
                    self.reloadMetadata(for: current)
                }
                self.isProcessing = false
            }
        }
    }

    func stripSuspiciousFields() {
        let targets = targetFiles()
        guard !targets.isEmpty else { return }

        let service = metadataService
        Task.detached(priority: .userInitiated) {
            await MainActor.run { [weak self] in
                self?.isProcessing = true
                self?.batchProgress = BatchProgress(total: targets.count)
            }

            for (index, file) in targets.enumerated() {
                do {
                    try service.stripSuspiciousFields(for: file)
                    await MainActor.run { [weak self] in
                        guard let self else { return }
                        if let idx = self.fileQueue.firstIndex(where: { $0.id == file.id }) {
                            self.fileQueue[idx].isProcessed = true
                        }
                        self.batchProgress?.completed = index + 1
                    }
                } catch {
                    await MainActor.run { [weak self] in
                        self?.batchProgress?.errors.append(BatchError(file: file, error: error))
                    }
                }
            }

            await MainActor.run { [weak self] in
                guard let self else { return }
                if let current = self.currentFile {
                    self.reloadMetadata(for: current)
                }
                self.isProcessing = false
            }
        }
    }

    func applyPreset(_ preset: MetadataPreset) {
        let targets = targetFiles()
        guard !targets.isEmpty else { return }

        let service = metadataService
        Task.detached(priority: .userInitiated) {
            await MainActor.run { [weak self] in
                self?.isProcessing = true
                self?.batchProgress = BatchProgress(total: targets.count)
            }

            for (index, file) in targets.enumerated() {
                do {
                    try service.applyPreset(preset, to: file)
                    await MainActor.run { [weak self] in
                        guard let self else { return }
                        if let idx = self.fileQueue.firstIndex(where: { $0.id == file.id }) {
                            self.fileQueue[idx].isProcessed = true
                        }
                        self.batchProgress?.completed = index + 1
                    }
                } catch {
                    await MainActor.run { [weak self] in
                        self?.batchProgress?.errors.append(BatchError(file: file, error: error))
                    }
                }
            }

            await MainActor.run { [weak self] in
                guard let self else { return }
                if let current = self.currentFile {
                    self.reloadMetadata(for: current)
                }
                self.isProcessing = false
            }
        }
    }

    /// Reload metadata for a file (called from main actor)
    func reloadMetadata(for file: ImageFileItem) {
        let service = metadataService
        let fileId = file.id
        let url = file.url

        Task.detached(priority: .userInitiated) {
            let metadata = try? service.readMetadata(from: url)
            await MainActor.run { [weak self] in
                guard let self else { return }
                if let index = self.fileQueue.firstIndex(where: { $0.id == fileId }) {
                    self.fileQueue[index].metadata = metadata
                }
                if self.currentFile?.id == fileId {
                    self.currentFile?.metadata = metadata
                }
            }
        }
    }

    /// Load metadata for a file — called from .task in views
    func loadMetadata(for file: ImageFileItem) async {
        let service = metadataService
        let fileId = file.id
        let url = file.url

        // Run on background thread to avoid blocking UI
        let metadata: ImageMetadata? = await Task.detached(priority: .userInitiated) {
            try? service.readMetadata(from: url)
        }.value

        // Update state on main actor
        if let index = fileQueue.firstIndex(where: { $0.id == fileId }) {
            fileQueue[index].metadata = metadata
        }
        if currentFile?.id == fileId {
            currentFile?.metadata = metadata
        }
    }

    // MARK: - Helpers

    private func targetFiles() -> [ImageFileItem] {
        if selectedFiles.isEmpty {
            return fileQueue
        }
        return fileQueue.filter { selectedFiles.contains($0.id) }
    }

    // MARK: - Batch Actions (ALL files, no selection needed)

    /// Strip all metadata from every file in the queue
    func batchStripAll() {
        let targets = fileQueue
        guard !targets.isEmpty else { return }

        let service = metadataService
        Task.detached(priority: .userInitiated) {
            await MainActor.run { [weak self] in
                self?.isProcessing = true
                self?.batchProgress = BatchProgress(total: targets.count)
            }

            for (index, file) in targets.enumerated() {
                do {
                    try service.stripAllMetadata(for: file)
                    await MainActor.run { [weak self] in
                        guard let self else { return }
                        if let idx = self.fileQueue.firstIndex(where: { $0.id == file.id }) {
                            self.fileQueue[idx].isProcessed = true
                        }
                        self.batchProgress?.completed = index + 1
                    }
                } catch {
                    await MainActor.run { [weak self] in
                        self?.batchProgress?.errors.append(BatchError(file: file, error: error))
                    }
                }
            }

            await MainActor.run { [weak self] in
                guard let self else { return }
                if let current = self.currentFile {
                    self.reloadMetadata(for: current)
                }
                self.isProcessing = false
            }
        }
    }

    /// Strip AI/suspicious fields from every file in the queue
    func batchStripSuspicious() {
        let targets = fileQueue
        guard !targets.isEmpty else { return }

        let service = metadataService
        Task.detached(priority: .userInitiated) {
            await MainActor.run { [weak self] in
                self?.isProcessing = true
                self?.batchProgress = BatchProgress(total: targets.count)
            }

            for (index, file) in targets.enumerated() {
                do {
                    try service.stripSuspiciousFields(for: file)
                    await MainActor.run { [weak self] in
                        guard let self else { return }
                        if let idx = self.fileQueue.firstIndex(where: { $0.id == file.id }) {
                            self.fileQueue[idx].isProcessed = true
                        }
                        self.batchProgress?.completed = index + 1
                    }
                } catch {
                    await MainActor.run { [weak self] in
                        self?.batchProgress?.errors.append(BatchError(file: file, error: error))
                    }
                }
            }

            await MainActor.run { [weak self] in
                guard let self else { return }
                if let current = self.currentFile {
                    self.reloadMetadata(for: current)
                }
                self.isProcessing = false
            }
        }
    }

    /// Apply a preset to every file in the queue
    func batchApplyPreset(_ preset: MetadataPreset) {
        let targets = fileQueue
        guard !targets.isEmpty else { return }

        let service = metadataService
        Task.detached(priority: .userInitiated) {
            await MainActor.run { [weak self] in
                self?.isProcessing = true
                self?.batchProgress = BatchProgress(total: targets.count)
            }

            for (index, file) in targets.enumerated() {
                do {
                    try service.applyPreset(preset, to: file)
                    await MainActor.run { [weak self] in
                        guard let self else { return }
                        if let idx = self.fileQueue.firstIndex(where: { $0.id == file.id }) {
                            self.fileQueue[idx].isProcessed = true
                        }
                        self.batchProgress?.completed = index + 1
                    }
                } catch {
                    await MainActor.run { [weak self] in
                        self?.batchProgress?.errors.append(BatchError(file: file, error: error))
                    }
                }
            }

            await MainActor.run { [weak self] in
                guard let self else { return }
                if let current = self.currentFile {
                    self.reloadMetadata(for: current)
                }
                self.isProcessing = false
            }
        }
    }
}
