import exifr from "exifr";
import type { ProcessedFile, MetadataField } from "./types";
import { isSuspicious } from "./types";

export async function processFiles(files: File[]): Promise<ProcessedFile[]> {
  const results: ProcessedFile[] = [];

  for (const file of files) {
    const processed = await processOneFile(file);
    if (processed) results.push(processed);
  }

  return results;
}

async function processOneFile(file: File): Promise<ProcessedFile | null> {
  try {
    const thumbnail = await createThumbnail(file);
    const metadata = await readMetadata(file);

    return {
      id: crypto.randomUUID(),
      name: file.name,
      size: file.size,
      type: file.type,
      originalFile: file,
      thumbnail,
      metadata,
      stripped: false,
    };
  } catch {
    return null;
  }
}

async function readMetadata(file: File): Promise<MetadataField[]> {
  const fields: MetadataField[] = [];

  try {
    // Read all metadata with exifr
    const data = await exifr.parse(file, {
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

    // Flatten into key-value pairs with group detection
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

  // Add file info
  fields.push(
    { key: "FileName", value: file.name, group: "File", suspicious: false },
    { key: "FileSize", value: formatBytes(file.size), group: "File", suspicious: false },
    { key: "FileType", value: file.type || "unknown", group: "File", suspicious: false },
  );

  return fields;
}

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

async function createThumbnail(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
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
        resolve(canvas.toDataURL("image/jpeg", 0.6));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

// Strip all metadata from an image by re-encoding through Canvas
// Canvas output is guaranteed metadata-free (no EXIF/IPTC/XMP)
// Note: macOS adds "Where From" as a filesystem extended attribute on download —
// that's not image metadata and can only be removed via `xattr -d` in Terminal.
export async function stripAllMetadata(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0);

        // Use maximum quality to avoid visible compression artifacts
        const outputType = file.type === "image/png" ? "image/png" : "image/jpeg";
        const quality = file.type === "image/png" ? undefined : 0.97;

        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error("Failed to create blob"));
          },
          outputType,
          quality
        );
      };
      img.onerror = reject;
      img.src = reader.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Apply a preset: strip metadata, then inject new EXIF data (JPEG only)
export async function applyPreset(
  file: File,
  exifData: { "0th": Record<number, string | number>; Exif: Record<number, string | number | number[]>; GPS: Record<number, string | number | number[][]> }
): Promise<Blob> {
  // First strip via Canvas
  const stripped = await stripAllMetadata(file);

  // If privacy preset (empty data), just return stripped
  const hasData = Object.keys(exifData["0th"]).length > 0 || Object.keys(exifData.Exif).length > 0;
  if (!hasData) return stripped;

  // For JPEG, inject EXIF back using piexifjs
  if (file.type === "image/jpeg" || file.type === "image/jpg") {
    try {
      const piexif = await import("piexifjs");
      const dataUrl = await blobToDataURL(stripped);
      const exifObj = { "0th": exifData["0th"], Exif: exifData.Exif, GPS: exifData.GPS, "1st": {}, Interop: {} };
      const exifBytes = piexif.dump(exifObj);
      const newDataUrl = piexif.insert(exifBytes, dataUrl);
      return dataURLToBlob(newDataUrl);
    } catch {
      // If piexif fails, return stripped version
      return stripped;
    }
  }

  // For non-JPEG, can't inject EXIF — just return stripped
  return stripped;
}

function blobToDataURL(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

function dataURLToBlob(dataUrl: string): Blob {
  const parts = dataUrl.split(",");
  const mime = parts[0].match(/:(.*?);/)?.[1] || "image/jpeg";
  const binary = atob(parts[1]);
  const array = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    array[i] = binary.charCodeAt(i);
  }
  return new Blob([array], { type: mime });
}
