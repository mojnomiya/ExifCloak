import SwiftUI

/// A single metadata field — styled like native macOS key-value rows
struct MetadataFieldRow: View {
    let field: MetadataField
    let onEdit: (String) -> Void
    let onDelete: () -> Void

    @State private var isEditing = false
    @State private var editValue = ""
    @State private var isHovered = false

    var body: some View {
        HStack(spacing: 0) {
            // Key column
            HStack(spacing: 4) {
                if field.isSuspicious {
                    Circle()
                        .fill(.orange)
                        .frame(width: 5, height: 5)
                        .help("AI/tool signature field")
                }
                Text(field.key)
                    .font(.system(size: 11, weight: .medium))
                    .foregroundStyle(field.isSuspicious ? .orange : .secondary)
                    .lineLimit(1)
            }
            .frame(width: 140, alignment: .trailing)
            .padding(.trailing, 8)

            // Value column
            if isEditing {
                editView
            } else {
                valueView
            }
        }
        .padding(.vertical, 1)
        .onHover { isHovered = $0 }
        .contextMenu {
            if field.isEditable {
                Button("Edit Value") {
                    editValue = field.value
                    isEditing = true
                }
                Button("Copy Value") {
                    NSPasteboard.general.clearContents()
                    NSPasteboard.general.setString(field.value, forType: .string)
                }
                Divider()
                Button("Remove Field", role: .destructive) { onDelete() }
            } else {
                Button("Copy Value") {
                    NSPasteboard.general.clearContents()
                    NSPasteboard.general.setString(field.value, forType: .string)
                }
            }
        }
    }

    private var valueView: some View {
        HStack(spacing: 4) {
            Text(field.value)
                .font(.system(size: 11))
                .lineLimit(2)
                .textSelection(.enabled)
                .frame(maxWidth: .infinity, alignment: .leading)

            if isHovered && field.isEditable {
                Button {
                    editValue = field.value
                    isEditing = true
                } label: {
                    Image(systemName: "pencil")
                        .font(.system(size: 9))
                }
                .buttonStyle(.plain)
                .foregroundStyle(.tertiary)

                Button { onDelete() } label: {
                    Image(systemName: "xmark")
                        .font(.system(size: 9))
                }
                .buttonStyle(.plain)
                .foregroundStyle(.tertiary)
            }
        }
    }

    private var editView: some View {
        HStack(spacing: 4) {
            TextField("", text: $editValue)
                .textFieldStyle(.roundedBorder)
                .font(.system(size: 11))
                .onSubmit { commit() }

            Button { commit() } label: {
                Image(systemName: "checkmark")
                    .font(.system(size: 9, weight: .bold))
            }
            .buttonStyle(.bordered)
            .controlSize(.mini)

            Button { isEditing = false } label: {
                Image(systemName: "xmark")
                    .font(.system(size: 9))
            }
            .buttonStyle(.plain)
            .foregroundStyle(.secondary)
        }
    }

    private func commit() {
        onEdit(editValue)
        isEditing = false
    }
}
