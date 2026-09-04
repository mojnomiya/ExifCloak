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
}
