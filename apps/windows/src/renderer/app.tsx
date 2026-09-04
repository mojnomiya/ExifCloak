import { useState, useCallback, useEffect } from "react";
import { processFilesFromPaths } from "./components/metadata-engine";
import { ToolHeader } from "./components/tool-header";
import { DropZone } from "./components/drop-zone";
import { FileList } from "./components/file-list";
import { MetadataPanel } from "./components/metadata-panel";
import type { ProcessedFile } from "./types";

export function App() {
  const [files, setFiles] = useState<ProcessedFile[]>([]);
  const [activeFileId, setActiveFileId] = useState<string | null>(null);

  const activeFile = files.find((f) => f.id === activeFileId) || null;

  // Listen for files opened from OS (file association / drag on taskbar)
  useEffect(() => {
    window.electronAPI.onFileOpen(async (filePaths) => {
      const processed = await processFilesFromPaths(filePaths);
      setFiles((prev) => {
        const next = [...prev, ...processed];
        if (!activeFileId && next.length > 0) {
          setActiveFileId(next[0].id);
        }
        return next;
      });
    });

    return () => {
      window.electronAPI.removeAllListeners("app:fileOpen");
    };
  }, [activeFileId]);

  const handleFiles = useCallback(
    (newFiles: ProcessedFile[]) => {
      setFiles((prev) => {
        const next = [...prev, ...newFiles];
        if (!activeFileId && next.length > 0) {
          setActiveFileId(next[0].id);
        }
        return next;
      });
    },
    [activeFileId]
  );

  const updateFile = useCallback(
    (id: string, updated: Partial<ProcessedFile>) => {
      setFiles((prev) =>
        prev.map((f) => (f.id === id ? { ...f, ...updated } : f))
      );
    },
    []
  );

  const removeFile = useCallback(
    (id: string) => {
      setFiles((prev) => {
        const next = prev.filter((f) => f.id !== id);
        if (activeFileId === id) {
          setActiveFileId(next[0]?.id || null);
        }
        return next;
      });
    },
    [activeFileId]
  );

  const clearAll = useCallback(() => {
    setFiles([]);
    setActiveFileId(null);
  }, []);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Titlebar drag region */}
      <div className="drag-region h-8 flex-shrink-0" />

      <ToolHeader fileCount={files.length} onClear={clearAll} />

      {files.length === 0 ? (
        <DropZone onFiles={handleFiles} />
      ) : (
        <div className="flex-1 flex min-h-0">
          <FileList
            files={files}
            activeId={activeFileId}
            onSelect={setActiveFileId}
            onRemove={removeFile}
            onAddMore={handleFiles}
          />
          <MetadataPanel file={activeFile} onUpdate={updateFile} />
        </div>
      )}
    </div>
  );
}
