import { useCallback, useState } from "react";
import { processFilesFromPaths } from "./metadata-engine";
import type { ProcessedFile } from "../types";

interface Props {
  onFiles: (files: ProcessedFile[]) => void;
}

export function DropZone({ onFiles }: Props) {
  const [dragging, setDragging] = useState(false);
  const [processing, setProcessing] = useState(false);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);

      // Check for file paths (Electron拖拽)
      const paths = Array.from(e.dataTransfer.files)
        .map((f) => (f as unknown as { path: string }).path)
        .filter((p) => p);

      if (paths.length > 0) {
        setProcessing(true);
        const processed = await processFilesFromPaths(paths);
        onFiles(processed);
        setProcessing(false);
        return;
      }

      // Fallback: browser File API
      const items = Array.from(e.dataTransfer.files).filter((f) =>
        f.type.startsWith("image/")
      );
      if (items.length === 0) return;
      setProcessing(true);
      // Use Electron file dialog as fallback
      const filePaths = await window.electronAPI.openFiles();
      if (filePaths.length > 0) {
        const processed = await processFilesFromPaths(filePaths);
        onFiles(processed);
      }
      setProcessing(false);
    },
    [onFiles]
  );

  const handleBrowse = useCallback(async () => {
    const filePaths = await window.electronAPI.openFiles();
    if (filePaths.length === 0) return;
    setProcessing(true);
    const processed = await processFilesFromPaths(filePaths);
    onFiles(processed);
    setProcessing(false);
  }, [onFiles]);

  const handleFolder = useCallback(async () => {
    const dirPath = await window.electronAPI.openFolder();
    if (!dirPath) return;
    setProcessing(true);
    const extensions = [".jpg", ".jpeg", ".png", ".heic", ".heif", ".tiff", ".tif", ".webp"];
    const filePaths = await window.electronAPI.getFilePaths(dirPath, extensions);
    const processed = await processFilesFromPaths(filePaths);
    onFiles(processed);
    setProcessing(false);
  }, [onFiles]);

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`w-full max-w-[500px] border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
          dragging
            ? "border-[var(--text)] bg-[var(--bg-hover)]"
            : "border-[var(--border)]"
        }`}
      >
        {processing ? (
          <div className="space-y-3">
            <div className="w-6 h-6 border-2 border-[var(--text-tertiary)] border-t-[var(--text)] rounded-full animate-spin mx-auto" />
            <p className="text-[13px] text-[var(--text-secondary)]">
              Reading metadata...
            </p>
          </div>
        ) : (
          <>
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="mx-auto text-[var(--text-tertiary)] mb-4"
            >
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
            </svg>
            <p className="text-[15px] font-medium mb-1">Drop images here</p>
            <p className="text-[13px] text-[var(--text-secondary)] mb-4">
              or click to browse
            </p>
            <div className="flex gap-2 justify-center">
              <button
                onClick={handleBrowse}
                className="cursor-pointer border border-[var(--border)] rounded-lg px-4 py-2 text-[13px] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] transition-colors"
              >
                Choose Files
              </button>
              <button
                onClick={handleFolder}
                className="cursor-pointer border border-[var(--border)] rounded-lg px-4 py-2 text-[13px] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] transition-colors"
              >
                Open Folder
              </button>
            </div>
            <p className="mt-4 text-[11px] text-[var(--text-tertiary)]">
              JPEG, PNG, WebP, TIFF, HEIC. 100% offline — your images never
              leave your device.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
