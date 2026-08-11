"use client";

import { useState, useCallback } from "react";
import { DropZone } from "./drop-zone";
import { FileList } from "./file-list";
import { MetadataPanel } from "./metadata-panel";
import { ToolHeader } from "./tool-header";
import type { ProcessedFile } from "./types";

export function ToolApp() {
  const [files, setFiles] = useState<ProcessedFile[]>([]);
  const [activeFileId, setActiveFileId] = useState<string | null>(null);

  const activeFile = files.find((f) => f.id === activeFileId) || null;

  const handleFiles = useCallback((newFiles: ProcessedFile[]) => {
    setFiles((prev) => [...prev, ...newFiles]);
    if (!activeFileId && newFiles.length > 0) {
      setActiveFileId(newFiles[0].id);
    }
  }, [activeFileId]);

  const updateFile = useCallback((id: string, updated: Partial<ProcessedFile>) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...updated } : f))
    );
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    if (activeFileId === id) {
      setActiveFileId(files.find((f) => f.id !== id)?.id || null);
    }
  }, [activeFileId, files]);

  const clearAll = useCallback(() => {
    setFiles([]);
    setActiveFileId(null);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <ToolHeader fileCount={files.length} onClear={clearAll} />

      {files.length === 0 ? (
        <DropZone onFiles={handleFiles} />
      ) : (
        <div className="flex-1 flex">
          <FileList
            files={files}
            activeId={activeFileId}
            onSelect={setActiveFileId}
            onRemove={removeFile}
            onAddMore={handleFiles}
          />
          <MetadataPanel
            file={activeFile}
            onUpdate={updateFile}
          />
        </div>
      )}
    </div>
  );
}
