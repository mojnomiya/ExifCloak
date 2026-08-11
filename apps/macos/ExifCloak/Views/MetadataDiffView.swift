import SwiftUI

/// Before/After diff view for comparing original vs cleaned metadata
struct MetadataDiffView: View {
    let originalMetadata: ImageMetadata
    let currentMetadata: ImageMetadata

    var body: some View {
        VStack(spacing: 0) {
            // Header
            HStack {
                Text("Metadata Changes")
                    .font(.title3)
                    .fontWeight(.semibold)
                Spacer()
                changesCount
            }
            .padding()

            Divider()

            // Diff content
            ScrollView {
                LazyVStack(alignment: .leading, spacing: 2) {
                    ForEach(computeDiff(), id: \.key) { entry in
                        diffRow(entry)
                    }
                }
                .padding()
            }
        }
        .frame(minWidth: 500, minHeight: 400)
    }

    private var changesCount: some View {
        let diff = computeDiff()
        let added = diff.filter { $0.type == .added }.count
        let removed = diff.filter { $0.type == .removed }.count
        let modified = diff.filter { $0.type == .modified }.count

        return HStack(spacing: 8) {
            if added > 0 {
                Label("\(added)", systemImage: "plus.circle.fill")
                    .font(.caption)
                    .foregroundColor(.green)
            }
            if removed > 0 {
                Label("\(removed)", systemImage: "minus.circle.fill")
                    .font(.caption)
                    .foregroundColor(.red)
            }
            if modified > 0 {
                Label("\(modified)", systemImage: "pencil.circle.fill")
                    .font(.caption)
                    .foregroundColor(.orange)
            }
        }
    }

    private func diffRow(_ entry: DiffEntry) -> some View {
        HStack(spacing: 8) {
            // Change type icon
            Image(systemName: entry.type.icon)
                .font(.caption)
                .foregroundColor(entry.type.color)
                .frame(width: 16)

            // Key
            Text(entry.key)
                .font(.system(.caption, design: .monospaced))
                .frame(width: 150, alignment: .leading)

            // Values
            VStack(alignment: .leading, spacing: 2) {
                if let old = entry.oldValue {
                    HStack(spacing: 4) {
                        Text("−")
                            .foregroundColor(.red)
                        Text(old)
                            .strikethrough()
                            .foregroundColor(.red.opacity(0.7))
                    }
                    .font(.system(.caption2, design: .monospaced))
                }

                if let new = entry.newValue {
                    HStack(spacing: 4) {
                        Text("+")
                            .foregroundColor(.green)
                        Text(new)
                            .foregroundColor(.green)
                    }
                    .font(.system(.caption2, design: .monospaced))
                }
            }

            Spacer()
        }
        .padding(.vertical, 4)
        .padding(.horizontal, 8)
        .background(
            RoundedRectangle(cornerRadius: 4)
                .fill(entry.type.color.opacity(0.05))
        )
    }

    // MARK: - Diff Computation

    private func computeDiff() -> [DiffEntry] {
        var diff: [DiffEntry] = []

        let originalByKey = Dictionary(
            originalMetadata.fields.map { ("\($0.standard.rawValue):\($0.key)", $0.value) },
            uniquingKeysWith: { first, _ in first }
        )

        let currentByKey = Dictionary(
            currentMetadata.fields.map { ("\($0.standard.rawValue):\($0.key)", $0.value) },
            uniquingKeysWith: { first, _ in first }
        )

        // Find removed fields
        for (key, value) in originalByKey where currentByKey[key] == nil {
            diff.append(DiffEntry(key: key, type: .removed, oldValue: value, newValue: nil))
        }

        // Find added fields
        for (key, value) in currentByKey where originalByKey[key] == nil {
            diff.append(DiffEntry(key: key, type: .added, oldValue: nil, newValue: value))
        }

        // Find modified fields
        for (key, newValue) in currentByKey {
            if let oldValue = originalByKey[key], oldValue != newValue {
                diff.append(DiffEntry(key: key, type: .modified, oldValue: oldValue, newValue: newValue))
            }
        }

        return diff.sorted { $0.key < $1.key }
    }
}

// MARK: - Supporting Types

struct DiffEntry {
    let key: String
    let type: DiffType
    let oldValue: String?
    let newValue: String?
}

enum DiffType {
    case added
    case removed
    case modified

    var icon: String {
        switch self {
        case .added: return "plus.circle.fill"
        case .removed: return "minus.circle.fill"
        case .modified: return "pencil.circle.fill"
        }
    }

    var color: Color {
        switch self {
        case .added: return .green
        case .removed: return .red
        case .modified: return .orange
        }
    }
}
