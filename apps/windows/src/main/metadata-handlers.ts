import { ipcMain } from "electron";
import * as fs from "fs";
import * as path from "path";

// We use sharp for high-quality metadata stripping on disk files
// sharp handles JPEG, PNG, WebP, TIFF, HEIC

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let sharpInstance: any = null;

function getSharpSync() {
  if (!sharpInstance) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mod = require("sharp");
    sharpInstance = typeof mod === "function" ? mod : mod.default ?? mod;
  }
  return sharpInstance;
}

function detectGroup(key: string): string {
  const lower = key.toLowerCase();
  if (lower.startsWith("gps") || lower === "latitude" || lower === "longitude") return "GPS";
  if (lower.includes("iptc") || ["headline", "caption", "keywords", "city", "country"].includes(lower)) return "IPTC";
  if (lower.includes("xmp") || lower.includes("creator")) return "XMP";
  if (["make", "model", "software", "orientation", "artist", "copyright"].includes(lower)) return "TIFF";
  return "EXIF";
}

const SUSPICIOUS_KEYS = new Set([
  "Software", "CreatorTool", "ProcessingSoftware", "HistorySoftwareAgent",
  "ImageDescription", "UserComment", "MakerNote", "XMP:CreatorTool",
  "parameters", "prompt", "negative_prompt",
]);

function isSuspiciousKey(key: string): boolean {
  if (SUSPICIOUS_KEYS.has(key)) return true;
  const lower = key.toLowerCase();
  return lower.includes("c2pa") || lower.includes("contentcredentials") || lower.includes("gps");
}

interface MetadataField {
  key: string;
  value: string;
  group: string;
  suspicious: boolean;
}

function formatValue(value: unknown): string {
  if (value instanceof Date) return value.toLocaleString();
  if (Array.isArray(value)) return value.map(String).join(", ");
  if (typeof value === "object" && value !== null) return JSON.stringify(value);
  return String(value);
}

export function registerMetadataIPC(): void {
  // Strip all metadata from a file on disk
  ipcMain.handle(
    "metadata:stripAll",
    async (_event, filePath: string): Promise<{ success: boolean; error?: string }> => {
      try {
        console.log("[metadata] stripAll called for:", filePath);
        const s = getSharpSync();
        console.log("[metadata] sharp loaded:", typeof s);
        const buffer = fs.readFileSync(filePath);
        console.log("[metadata] file read, size:", buffer.length);
        const ext = path.extname(filePath).toLowerCase();

        let pipeline = s(buffer);

        // sharp strips metadata by default when re-encoding
        // We keep the same format
        switch (ext) {
          case ".jpg":
          case ".jpeg":
            pipeline = pipeline.jpeg({ quality: 97, mozjpeg: false });
            break;
          case ".png":
            pipeline = pipeline.png();
            break;
          case ".webp":
            pipeline = pipeline.webp({ quality: 95 });
            break;
          case ".tiff":
          case ".tif":
            pipeline = pipeline.tiff({ quality: 95 });
            break;
          default:
            pipeline = pipeline.jpeg({ quality: 97 });
        }

        const outputBuffer = await pipeline.toBuffer();
        console.log("[metadata] sharp output size:", outputBuffer.length);

        // Atomic write: write to temp, then rename
        const tempPath = filePath + ".tmp_" + Date.now();
        fs.writeFileSync(tempPath, outputBuffer);
        console.log("[metadata] temp file written:", tempPath);
        fs.renameSync(tempPath, filePath);
        console.log("[metadata] rename done, strip complete");

        return { success: true };
      } catch (err) {
        console.error("[metadata] stripAll error:", err);
        return {
          success: false,
          error: err instanceof Error ? err.message : "Unknown error",
        };
      }
    }
  );

  // Apply preset (write specific EXIF values) - for JPEG only via piexifjs
  ipcMain.handle(
    "metadata:applyPreset",
    async (
      _event,
      filePath: string,
      exifData: {
        "0th": Record<number, string | number>;
        Exif: Record<number, string | number | number[]>;
        GPS: Record<number, string | number | number[][]>;
      }
    ): Promise<{ success: boolean; error?: string }> => {
      try {
        const ext = path.extname(filePath).toLowerCase();
        const isJpeg = ext === ".jpg" || ext === ".jpeg";

        if (!isJpeg) {
          // For non-JPEG, just strip metadata
          const s = getSharpSync();
          const buffer = fs.readFileSync(filePath);
          let pipeline = s(buffer);

          switch (ext) {
            case ".png":
              pipeline = pipeline.png();
              break;
            case ".webp":
              pipeline = pipeline.webp({ quality: 95 });
              break;
            case ".tiff":
            case ".tif":
              pipeline = pipeline.tiff({ quality: 95 });
              break;
            default:
              pipeline = pipeline.jpeg({ quality: 97 });
          }

          const outputBuffer = await pipeline.toBuffer();
          const tempPath = filePath + ".tmp_" + Date.now();
          fs.writeFileSync(tempPath, outputBuffer);
          fs.renameSync(tempPath, filePath);
          return { success: true };
        }

        // For JPEG: strip then inject EXIF via piexifjs
        const s = getSharpSync();
        const buffer = fs.readFileSync(filePath);

        // First strip all metadata
        const strippedBuffer = await s(buffer).jpeg({ quality: 97 }).toBuffer();

        // Convert to base64 data URL for piexifjs
        const base64 = strippedBuffer.toString("base64");
        const dataUrl = `data:image/jpeg;base64,${base64}`;

        // Dynamically import piexifjs (it's a browser lib but works in Node)
        const piexif = await import("piexifjs");

        const hasData =
          Object.keys(exifData["0th"]).length > 0 ||
          Object.keys(exifData.Exif).length > 0;

        if (!hasData) {
          // Privacy preset - just stripped is fine
          const tempPath = filePath + ".tmp_" + Date.now();
          fs.writeFileSync(tempPath, strippedBuffer);
          fs.renameSync(tempPath, filePath);
          return { success: true };
        }

        const exifObj = {
          "0th": exifData["0th"],
          Exif: exifData.Exif,
          GPS: exifData.GPS,
          "1st": {},
          Interop: {},
        };

        const exifBytes = piexif.dump(exifObj);
        const newDataUrl = piexif.insert(exifBytes, dataUrl);

        // Convert back to buffer
        const newBase64 = newDataUrl.split(",")[1];
        const outputBuffer = Buffer.from(newBase64, "base64");

        const tempPath = filePath + ".tmp_" + Date.now();
        fs.writeFileSync(tempPath, outputBuffer);
        fs.renameSync(tempPath, filePath);

        return { success: true };
      } catch (err) {
        return {
          success: false,
          error: err instanceof Error ? err.message : "Unknown error",
        };
      }
    }
  );

  // Batch strip multiple files
  ipcMain.handle(
    "metadata:batchStrip",
    async (
      _event,
      filePaths: string[]
    ): Promise<{ processed: number; errors: number; errorFiles: string[] }> => {
      let processed = 0;
      let errors = 0;
      const errorFiles: string[] = [];

      for (const filePath of filePaths) {
        try {
          const s = getSharpSync();
          const buffer = fs.readFileSync(filePath);
          const ext = path.extname(filePath).toLowerCase();

          let pipeline = s(buffer);
          switch (ext) {
            case ".jpg":
            case ".jpeg":
              pipeline = pipeline.jpeg({ quality: 97, mozjpeg: false });
              break;
            case ".png":
              pipeline = pipeline.png();
              break;
            case ".webp":
              pipeline = pipeline.webp({ quality: 95 });
              break;
            case ".tiff":
            case ".tif":
              pipeline = pipeline.tiff({ quality: 95 });
              break;
            default:
              pipeline = pipeline.jpeg({ quality: 97 });
          }

          const outputBuffer = await pipeline.toBuffer();
          const tempPath = filePath + ".tmp_" + Date.now();
          fs.writeFileSync(tempPath, outputBuffer);
          fs.renameSync(tempPath, filePath);
          processed++;
        } catch {
          errors++;
          errorFiles.push(filePath);
        }
      }

      return { processed, errors, errorFiles };
    }
  );

  // Read metadata from a file on disk (runs in main process where exifr works reliably)
  ipcMain.handle(
    "metadata:read",
    async (
      _event,
      filePath: string
    ): Promise<{ fields: MetadataField[]; name: string; size: number; type: string }> => {
      const name = path.basename(filePath);
      const stats = fs.statSync(filePath);
      const ext = path.extname(filePath).toLowerCase();
      const typeMap: Record<string, string> = {
        ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png",
        ".heic": "image/heic", ".heif": "image/heif", ".tiff": "image/tiff",
        ".tif": "image/tiff", ".webp": "image/webp",
      };
      const type = typeMap[ext] || "image/jpeg";

      const fields: MetadataField[] = [];

      try {
        const exifr = require("exifr");
        const buffer = fs.readFileSync(filePath);
        const data = await exifr.parse(buffer, {
          tiff: true, exif: true, gps: true, iptc: true,
          xmp: true, icc: false, jfif: true, ihdr: true,
        });

        if (data) {
          for (const [key, value] of Object.entries(data)) {
            if (value === undefined || value === null) continue;
            fields.push({
              key,
              value: formatValue(value),
              group: detectGroup(key),
              suspicious: isSuspiciousKey(key),
            });
          }
        }
      } catch (err) {
        console.error("[metadata] read exifr error:", err);
      }

      // File info fields
      fields.push(
        { key: "FileName", value: name, group: "File", suspicious: false },
        {
          key: "FileSize",
          value: stats.size < 1024 ? stats.size + " B"
            : stats.size < 1024 * 1024 ? (stats.size / 1024).toFixed(0) + " KB"
            : (stats.size / (1024 * 1024)).toFixed(1) + " MB",
          group: "File", suspicious: false,
        },
        { key: "FileType", value: type, group: "File", suspicious: false }
      );

      return { fields, name, size: stats.size, type };
    }
  );
}
