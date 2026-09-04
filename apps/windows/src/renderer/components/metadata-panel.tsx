import { useState, useMemo, useCallback } from "react";
import { processFileFromPath } from "./metadata-engine";
import { PRESETS } from "./presets";
import type { ProcessedFile, MetadataField } from "../types";

interface Props {
  file: ProcessedFile | null;
  onUpdate: (id: string, data: Partial<ProcessedFile>) => void;
}

export function MetadataPanel({ file, onUpdate }: Props) {
  const [search, setSearch] = useState("");
  const [stripping, setStripping] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [showPresets, setShowPresets] = useState(false);

  const groups = useMemo(() => {
    if (!file) return {};
    const filtered = file.metadata.filter(
      (f) =>
        !search ||
        f.key.toLowerCase().includes(search.toLowerCase()) ||
        f.value.toLowerCase().includes(search.toLowerCase())
    );
    return filtered.reduce(
      (acc, field) => {
        (acc[field.group] ||= []).push(field);
        return acc;
      },
      {} as Record<string, MetadataField[]>
    );
  }, [file, search]);

  const showMessage = useCallback((msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 2500);
  }, []);

  const handleStripAll = useCallback(async () => {
    if (!file) return;
    setStripping(true);
    try {
      console.log("[panel] stripAll starting for:", file.filePath);
      const { stripAllMetadata } = await import("./strip-engine");
      await stripAllMetadata(file.filePath);
      console.log("[panel] strip done, re-reading file...");
      const reprocessed = await processFileFromPath(file.filePath);
      console.log("[panel] reprocessed metadata count:", reprocessed?.metadata.length);
      if (reprocessed) {
        onUpdate(file.id, {
          metadata: reprocessed.metadata,
          stripped: true,
          size: reprocessed.size,
          thumbnail: reprocessed.thumbnail,
        });
      }
      showMessage("All metadata stripped");
    } catch (err) {
      console.error("[panel] strip error:", err);
      showMessage("Strip failed: " + (err instanceof Error ? err.message : "unknown"));
    }
    setStripping(false);
  }, [file, onUpdate, showMessage]);

  const handleStripSuspicious = useCallback(async () => {
    if (!file) return;
    setStripping(true);
    try {
      const { stripAllMetadata } = await import("./strip-engine");
      await stripAllMetadata(file.filePath);
      const reprocessed = await processFileFromPath(file.filePath);
      if (reprocessed) {
        onUpdate(file.id, {
          metadata: reprocessed.metadata,
          stripped: true,
          size: reprocessed.size,
          thumbnail: reprocessed.thumbnail,
        });
      }
      showMessage("AI/suspicious fields removed");
    } catch (err) {
      showMessage("Strip failed: " + (err instanceof Error ? err.message : "unknown"));
    }
    setStripping(false);
  }, [file, onUpdate, showMessage]);

  const handleApplyPreset = useCallback(
    async (presetId: string) => {
      if (!file) return;
      setShowPresets(false);
      setStripping(true);
      try {
        const preset = PRESETS.find((p) => p.id === presetId);
        if (!preset) return;
        const { applyPresetToFile } = await import("./strip-engine");
        const exifData = preset.generate();
        await applyPresetToFile(file.filePath, exifData);
        const reprocessed = await processFileFromPath(file.filePath);
        if (reprocessed) {
          onUpdate(file.id, {
            metadata: reprocessed.metadata,
            stripped: true,
            size: reprocessed.size,
            thumbnail: reprocessed.thumbnail,
          });
        }
        showMessage(`Applied "${preset.name}" preset`);
      } catch (err) {
        showMessage("Preset failed: " + (err instanceof Error ? err.message : "unknown"));
      }
      setStripping(false);
    },
    [file, onUpdate, showMessage]
  );

  const handleDownload = useCallback(async () => {
    if (!file) return;
    try {
      const data = await window.electronAPI.readFile(file.filePath);
      const blob = new Blob([data], { type: file.type });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.stripped
        ? file.name.replace(/(\.[^.]+)$/, "_clean$1")
        : file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showMessage("Downloaded — image metadata is clean");
    } catch {
      showMessage("Download failed");
    }
  }, [file, showMessage]);

  if (!file) {
    return (
      <div className="flex-1 flex items-center justify-center text-[var(--text-tertiary)] text-[14px]">
        Select a file to view metadata
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-w-0">
      {/* File header */}
      <div className="flex items-center gap-3 px-5 py-3 border-b border-[var(--border)]">
        {file.thumbnail ? (
          <img
            src={file.thumbnail}
            alt=""
            className="w-9 h-9 rounded object-cover"
          />
        ) : (
          <div className="w-9 h-9 rounded bg-[var(--border)] flex items-center justify-center">
            <span className="text-[10px] text-[var(--text-tertiary)]">
              {file.name.split(".").pop()?.toUpperCase()}
            </span>
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-medium truncate">{file.name}</p>
          <p className="text-[11px] text-[var(--text-tertiary)]">
            {formatSize(file.size)} · {file.type} · {file.metadata.length} fields
            {file.stripped && (
              <span className="text-[var(--success)] ml-2">✓ cleaned</span>
            )}
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 px-5 py-2 border-b border-[var(--border)] bg-[var(--bg-raised)]">
        <div className="flex items-center gap-1.5 border border-[var(--border)] rounded-md px-2 py-1 bg-[var(--bg)] flex-1 max-w-[200px]">
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-[var(--text-tertiary)]"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Filter fields..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="text-[12px] bg-transparent outline-none w-full"
          />
        </div>

        <div className="ml-auto flex gap-1.5">
          <button
            onClick={handleStripAll}
            disabled={stripping}
            className="px-3 py-1 rounded-md border border-[var(--border)] text-[11px] font-medium hover:bg-[var(--bg-hover)] transition-colors disabled:opacity-50"
          >
            Strip All
          </button>
          <button
            onClick={handleStripSuspicious}
            disabled={stripping}
            className="px-3 py-1 rounded-md border border-[var(--border)] text-[11px] font-medium text-[var(--warning)] hover:bg-[var(--bg-hover)] transition-colors disabled:opacity-50"
          >
            Strip AI
          </button>
          <div className="relative">
            <button
              onClick={() => setShowPresets(!showPresets)}
              disabled={stripping}
              className="px-3 py-1 rounded-md border border-[var(--border)] text-[11px] font-medium hover:bg-[var(--bg-hover)] transition-colors disabled:opacity-50"
            >
              Presets ▾
            </button>
            {showPresets && (
              <div className="absolute right-0 top-full mt-1 w-[220px] border border-[var(--border)] bg-[var(--bg)] rounded-lg shadow-lg z-10 py-1">
                {PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => handleApplyPreset(preset.id)}
                    className="w-full text-left px-3 py-2 hover:bg-[var(--bg-hover)] transition-colors"
                  >
                    <p className="text-[12px] font-medium">{preset.name}</p>
                    <p className="text-[10px] text-[var(--text-tertiary)]">
                      {preset.description}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={handleDownload}
            className="px-3 py-1 rounded-md border border-[var(--border)] text-[11px] font-medium hover:bg-[var(--bg-hover)] transition-colors"
          >
            Download
          </button>
        </div>
      </div>

      {/* Metadata list */}
      <div className="flex-1 overflow-y-auto p-4">
        {Object.entries(groups).map(([group, fields]) => (
          <div key={group} className="mb-4">
            <div className="flex items-center gap-2 mb-1.5 px-1">
              <span className="text-[12px] font-medium text-[var(--text-secondary)]">
                {group}
              </span>
              <span className="text-[10px] text-[var(--text-tertiary)]">
                ({fields.length})
              </span>
            </div>
            <div className="space-y-0">
              {fields.map((field, i) => (
                <div
                  key={`${field.key}-${i}`}
                  className={`flex items-center py-[5px] px-2 rounded text-[12px] font-mono ${
                    field.suspicious
                      ? "bg-[var(--warning)]/5 border-l-2 border-[var(--warning)]"
                      : i % 2 === 0
                      ? "bg-[var(--bg-raised)]"
                      : ""
                  }`}
                >
                  <span
                    className={`w-[140px] flex-shrink-0 text-right pr-3 ${
                      field.suspicious
                        ? "text-[var(--warning)]"
                        : "text-[var(--text-tertiary)]"
                    }`}
                  >
                    {field.key}
                  </span>
                  <span className="text-[var(--text-secondary)] truncate">
                    {field.value}
                  </span>
                  {field.suspicious && (
                    <span className="ml-auto text-[9px] text-[var(--warning)] bg-[var(--warning)]/10 px-1.5 py-0.5 rounded flex-shrink-0">
                      risk
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {file.metadata.length === 0 && (
          <div className="text-center py-12 text-[var(--text-tertiary)]">
            <p className="text-[14px] mb-1">No metadata</p>
            <p className="text-[12px]">This file has been stripped clean.</p>
          </div>
        )}
      </div>

      {/* Status toast */}
      {message && (
        <div className="px-5 py-2 border-t border-[var(--border)] bg-[var(--bg-raised)]">
          <p className="text-[11px] text-[var(--success)] font-medium">
            {message}
          </p>
        </div>
      )}
    </div>
  );
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}
