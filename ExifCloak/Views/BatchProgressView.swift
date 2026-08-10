import SwiftUI

/// Overlay progress indicator for batch operations
struct BatchProgressView: View {
    let progress: BatchProgress

    var body: some View {
        VStack(spacing: 16) {
            ProgressView(value: progress.progress) {
                Text("Processing...")
                    .font(.headline)
            } currentValueLabel: {
                Text(progress.summary)
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
            .progressViewStyle(.linear)
            .frame(width: 300)

            if progress.hasErrors {
                VStack(alignment: .leading, spacing: 4) {
                    Text("Errors:")
                        .font(.caption)
                        .fontWeight(.medium)
                        .foregroundColor(.red)

                    ForEach(progress.errors.prefix(5)) { error in
                        Text(error.description)
                            .font(.caption2)
                            .foregroundColor(.secondary)
                    }

                    if progress.errors.count > 5 {
                        Text("...and \(progress.errors.count - 5) more")
                            .font(.caption2)
                            .foregroundColor(.secondary)
                    }
                }
            }
        }
        .padding(24)
        .background(
            RoundedRectangle(cornerRadius: 12)
                .fill(.regularMaterial)
                .shadow(radius: 8)
        )
    }
}

/// View modifier to show batch progress overlay
struct BatchProgressOverlay: ViewModifier {
    @EnvironmentObject var appState: AppState

    func body(content: Content) -> some View {
        content.overlay {
            if appState.isProcessing, let progress = appState.batchProgress {
                Color.black.opacity(0.3)
                    .ignoresSafeArea()

                BatchProgressView(progress: progress)
            }
        }
    }
}

extension View {
    func batchProgressOverlay() -> some View {
        modifier(BatchProgressOverlay())
    }
}
