"use client";

import { ThemeToggle } from "../theme-toggle";

interface Props {
  fileCount: number;
  onClear: () => void;
}

export function ToolHeader({ fileCount, onClear }: Props) {
  return (
    <header className="border-b border-[var(--border)] px-5 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <a href="/" className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-md bg-[var(--text)] flex items-center justify-center">
            <span className="text-[var(--bg)] text-[8px] font-bold">EC</span>
          </div>
          <span className="text-[14px] font-semibold">ExifCloak</span>
        </a>
        <span className="text-[12px] text-[var(--text-tertiary)] border-l border-[var(--border)] pl-3">Web Tool</span>
      </div>

      <div className="flex items-center gap-3">
        {fileCount > 0 && (
          <>
            <span className="text-[12px] text-[var(--text-tertiary)]">{fileCount} file{fileCount !== 1 ? "s" : ""}</span>
            <button onClick={onClear} className="text-[12px] text-[var(--text-tertiary)] hover:text-[var(--danger)] transition-colors">
              Clear all
            </button>
          </>
        )}
        <ThemeToggle />
      </div>
    </header>
  );
}
