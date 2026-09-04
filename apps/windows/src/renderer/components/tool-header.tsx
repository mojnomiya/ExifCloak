interface Props {
  fileCount: number;
  onClear: () => void;
}

export function ToolHeader({ fileCount, onClear }: Props) {
  return (
    <header className="drag-region border-b border-[var(--border)] px-5 py-2 flex items-center justify-between flex-shrink-0">
      <div className="flex items-center gap-3 no-drag">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-md bg-[var(--text)] flex items-center justify-center">
            <span className="text-[var(--bg)] text-[8px] font-bold">EC</span>
          </div>
          <span className="text-[14px] font-semibold">ExifCloak</span>
        </div>
        <span className="text-[12px] text-[var(--text-tertiary)] border-l border-[var(--border)] pl-3">
          Windows
        </span>
      </div>

      <div className="flex items-center gap-3 no-drag">
        {fileCount > 0 && (
          <>
            <span className="text-[12px] text-[var(--text-tertiary)]">
              {fileCount} file{fileCount !== 1 ? "s" : ""}
            </span>
            <button
              onClick={onClear}
              className="text-[12px] text-[var(--text-tertiary)] hover:text-[var(--danger)] transition-colors"
            >
              Clear all
            </button>
          </>
        )}
      </div>
    </header>
  );
}
