import { ipcMain } from "electron";
import * as fs from "fs";
import * as path from "path";

// We use sharp for high-quality metadata stripping on disk files
// sharp handles JPEG, PNG, WebP, TIFF, HEIC

let sharp: typeof import("sharp") | null = null;

async function getSharp(): Promise<typeof import("sharp")> {
  if (!sharp) {
    sharp = await import("sharp");
  }
  return sharp;
}

export function registerMetadataIPC(): void {
  // Strip all metadata from a file on disk
  ipcMain.handle(
    "metadata:stripAll",
    async (_event, filePath: string): Promise<{ success: boolean; error?: string }> => {
      try {
        const s = await getSharp();
        const buffer = fs.readFileSync(filePath);
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

        // Atomic write: write to temp, then rename
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
          const s = await getSharp();
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
        const s = await getSharp();
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
          const s = await getSharp();
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
