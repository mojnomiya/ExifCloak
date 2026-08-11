"use client";

import { useCallback, useState } from "react";
import { processFiles } from "./metadata-engine";
import type { ProcessedFile } from "./types";

interface Props {
  onFiles: (files: ProcessedFile[]) => void;
}

export function DropZone({ onFiles }: Props) {
  const [dragging, setDragging] = useState(false);
  const [processing, setProcessing] = useState(false);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const items = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith("image/")
    );
    if (items.length === 0) return;
    setProcessing(true);
    const processed = await processFiles(items);
    onFiles(processed);
    setProcessing(false);
  }, [onFiles]);

  const handleInput = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const items = Array.from(e.target.files || []).filter((f) =>
      f.type.startsWith("image/")
    );
    if (items.length === 0) return;
    setProcessing(true);
    const processed = await processFiles(items);
    onFiles(processed);
    setProcessing(false);
  }, [onFiles]);

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`w-full max-w-[500px] border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
          dragging ? "border-[var(--text)] bg-[var(--bg-hover)]" : "border-[var(--border)]"
        }`}
      >
        {processing ? (
          <div className="space-y-3">
            <div className="w-6 h-6 border-2 border-[var(--text-tertiary)] border-t-[var(--text)] rounded-full animate-spin mx-auto" />
            <p className="text-[13px] text-[var(--text-secondary)]">Reading metadata...</p>
          </div>
        ) : (
          <>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto text-[var(--text-tertiary)] mb-4">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
            </svg>
            <p className="text-[15px] font-medium mb-1">Drop images here</p>
            <p className="text-[13px] text-[var(--text-secondary)] mb-4">or click to browse</p>
            <label className="inline-block cursor-pointer border border-[var(--border)] rounded-lg px-4 py-2 text-[13px] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] transition-colors">
              Choose files
              <input type="file" multiple accept="image/*" onChange={handleInput} className="hidden" />
            </label>
            <p className="mt-4 text-[11px] text-[var(--text-tertiary)]">
              JPEG, PNG, WebP, TIFF, HEIC. Processed entirely in your browser.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
