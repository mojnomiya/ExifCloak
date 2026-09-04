import type { ProcessedFile, MetadataField } from "../types";
import { isSuspicious } from "../types";

function detectGroup(key: string): string {
  const lower = key.toLowerCase();
  if (lower.startsWith("gps") || lower === "latitude" || lower === "longitude") return "GPS";
  if (lower.includes("iptc") || ["headline", "caption", "keywords", "city", "country"].includes(lower)) return "IPTC";
  if (lower.includes("xmp") || lower.includes("creator")) return "XMP";
  if (["make", "model", "software", "orientation", "artist", "copyright"].includes(lower)) return "TIFF";
  return "EXIF";
}

function formatValue(value: unknown): string {
  if (value instanceof Date) return value.toLocaleString();
  if (Array.isArray(value)) return value.map(String).join(", ");
  if (typeof value === "object" && value !== null) return JSON.stringify(value);
  return String(value);
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + " bytes";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

async function createThumbnailFromFile(filePath: string): Promise<string> {
  try {
    const data = await window.electronAPI.readFile(filePath);
    const blob = new Blob([data]);
    const url = URL.createObjectURL(blob);

    return new Promise<string>((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const size = 64;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d")!;
        const scale = Math.max(size / img.width, size / img.height);
        const w = img.width * scale;
        const h = img.height * scale;
        ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
        URL.revokeObjectURL(url);
        resolve(canvas.toDataURL("image/jpeg", 0.6));
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve("");
      };
      img.src = url;
    });
  } catch {
    return "";
  }
}

async function readMetadataFromFile(filePath: string): Promise<MetadataField[]> {
  const fields: MetadataField[] = [];

  try {
    const exifr = await import("exifr");
    const buffer = await window.electronAPI.readFile(filePath);
    const data = await exifr.parse(buffer, {
      tiff: true,
      exif: true,
      gps: true,
      iptc: true,
      xmp: true,
      icc: false,
      jfif: true,
      ihdr: true,
    });

    if (!data) return fields;

    for (const [key, value] of Object.entries(data)) {
      if (value === undefined || value === null) continue;
      const group = detectGroup(key);
      const strValue = formatValue(value);
      fields.push({
        key,
        value: strValue,
        group,
        suspicious: isSuspicious(key),
      });
    }
  } catch {
    // File might not have parseable metadata
  }

  return fields;
}

export async function processFileFromPath(filePath: string): Promise<ProcessedFile | null> {
  try {
    const name = await window.electronAPI.getFileName(filePath);
    const size = await window.electronAPI.getFileSize(filePath);
    const ext = name.split(".").pop()?.toLowerCase() || "";
    const typeMap: Record<string, string> = {
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      heic: "image/heic",
      heif: "image/heif",
      tiff: "image/tiff",
      tif: "image/tiff",
      webp: "image/webp",
    };
    const type = typeMap[ext] || "image/jpeg";

    const [thumbnail, metadata] = await Promise.all([
      createThumbnailFromFile(filePath),
      readMetadataFromFile(filePath),
    ]);

    metadata.push(
      { key: "FileName", value: name, group: "File", suspicious: false },
      { key: "FileSize", value: formatBytes(size), group: "File", suspicious: false },
      { key: "FileType", value: type, group: "File", suspicious: false }
    );

    return {
      id: crypto.randomUUID(),
      name,
      size,
      type,
      filePath,
      thumbnail,
      metadata,
      stripped: false,
    };
  } catch {
    return null;
  }
}

export async function processFilesFromPaths(filePaths: string[]): Promise<ProcessedFile[]> {
  const results: ProcessedFile[] = [];
  for (const fp of filePaths) {
    const processed = await processFileFromPath(fp);
    if (processed) results.push(processed);
  }
  return results;
}

export async function reprocessFile(file: ProcessedFile): Promise<ProcessedFile | null> {
  return processFileFromPath(file.filePath);
}
