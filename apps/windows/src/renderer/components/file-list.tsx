import { useCallback } from "react";
import { processFilesFromPaths } from "./metadata-engine";
import type { ProcessedFile } from "../types";

interface Props {
  files: ProcessedFile[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onRemove: (id: string) => void;
  onAddMore: (files: ProcessedFile[]) => void;
}

export function FileList({
  files,
  activeId,
  onSelect,
  onRemove,
  onAddMore,
}: Props) {
  const handleAdd = useCallback(async () => {
    const filePaths = await window.electronAPI.openFiles();
    if (filePaths.length === 0) return;
    const processed = await processFilesFromPaths(filePaths);
    onAddMore(processed);
  }, [onAddMore]);

  return (
    <aside className="w-[220px] border-r border-[var(--border)] bg-[var(--bg-raised)] flex flex-col flex-shrink-0">
      <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {files.map((file) => (
          <div
            key={file.id}
            className={`group w-full flex items-center gap-2 px-2 py-2 rounded-lg text-left transition-colors cursor-pointer ${
              activeId === file.id
                ? "bg-[var(--text)] text-[var(--bg)]"
                : "hover:bg-[var(--bg-hover)]"
            }`}
            onClick={() => onSelect(file.id)}
          >
            {file.thumbnail ? (
              <img
                src={file.thumbnail}
                alt=""
                className="w-8 h-8 rounded object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-8 h-8 rounded bg-[var(--border)] flex items-center justify-center flex-shrink-0">
                <span className="text-[10px] text-[var(--text-tertiary)]">
                  {file.name.split(".").pop()?.toUpperCase()}
                </span>
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p
                className={`text-[11px] truncate ${
                  activeId === file.id
                    ? "font-medium"
                    : "text-[var(--text-secondary)]"
                }`}
              >
                {file.name}
              </p>
              <p
                className={`text-[10px] ${
                  activeId === file.id
                    ? "opacity-70"
                    : "text-[var(--text-tertiary)]"
                }`}
              >
                {formatSize(file.size)}
              </p>
            </div>
            {file.stripped && (
              <span
                className={`text-[9px] ${
                  activeId === file.id ? "opacity-70" : "text-[var(--success)]"
                }`}
              >
                ✓
              </span>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove(file.id);
              }}
              className={`opacity-0 group-hover:opacity-100 text-[10px] px-1 rounded transition-opacity ${
                activeId === file.id
                  ? "hover:bg-white/20"
                  : "hover:bg-[var(--danger)]/10 text-[var(--danger)]"
              }`}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="p-2 border-t border-[var(--border)]">
        <button
          onClick={handleAdd}
          className="flex items-center justify-center gap-1.5 w-full py-1.5 rounded-md border border-[var(--border)] text-[11px] text-[var(--text-secondary)] cursor-pointer hover:bg-[var(--bg-hover)] transition-colors"
        >
          + Add more
        </button>
      </div>
    </aside>
  );
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}
