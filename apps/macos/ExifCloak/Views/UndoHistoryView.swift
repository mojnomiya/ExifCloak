import SwiftUI

/// Panel showing undo/restore history
struct UndoHistoryView: View {
    @ObservedObject var undoManager: MetadataUndoManager
    @State private var showClearConfirmation = false

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            // Header
            HStack {
                Label("Recent Changes", systemImage: "clock.arrow.circlepath")
                    .font(.headline)

                Spacer()

                if !undoManager.history.isEmpty {
                    Button("Clear All") {
                        showClearConfirmation = true
                    }
                    .font(.caption)
                    .buttonStyle(.borderless)
                }
            }
            .padding()

            Divider()

            if undoManager.history.isEmpty {
                emptyState
            } else {
                historyList
            }
        }
        .confirmationDialog(
            "Clear all undo history?",
            isPresented: $showClearConfirmation
        ) {
            Button("Clear History", role: .destructive) {
                undoManager.clearHistory()
            }
        } message: {
            Text("This cannot be undone. You won't be able to restore previous file states.")
        }
    }

    private var emptyState: some View {
        VStack(spacing: 8) {
            Spacer()
            Image(systemName: "clock")
                .font(.title)
                .foregroundColor(.secondary)
            Text("No changes recorded yet")
                .font(.caption)
                .foregroundColor(.secondary)
            Spacer()
        }
        .frame(maxWidth: .infinity)
    }

    private var historyList: some View {
        List {
            ForEach(undoManager.history) { entry in
                HStack {
                    VStack(alignment: .leading, spacing: 2) {
                        Text(entry.fileName)
                            .font(.caption)
                            .fontWeight(.medium)
                            .lineLimit(1)

                        Text(entry.action)
                            .font(.caption2)
                            .foregroundColor(.secondary)

                        Text(entry.timeAgo)
                            .font(.caption2)
                            .foregroundColor(.secondary)
                    }

                    Spacer()

                    Button("Restore") {
                        _ = undoManager.restore(entry: entry)
                    }
                    .controlSize(.small)
                    .buttonStyle(.bordered)
                }
                .padding(.vertical, 2)
            }
        }
        .listStyle(.plain)
    }
}
