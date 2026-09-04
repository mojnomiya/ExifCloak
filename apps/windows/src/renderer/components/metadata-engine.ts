import type { ProcessedFile, MetadataField } from "../types";

interface ReadResult {
  fields: MetadataField[];
  name: string;
  size: number;
  type: string;
}

async function readMetadataFromMain(filePath: string): Promise<ReadResult> {
  const result = await window.electronAPI.invoke("metadata:read", filePath);
  return result as ReadResult;
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

export async function processFileFromPath(filePath: string): Promise<ProcessedFile | null> {
  try {
    const [thumbnail, readResult] = await Promise.all([
      createThumbnailFromFile(filePath),
      readMetadataFromMain(filePath),
    ]);

    return {
      id: crypto.randomUUID(),
      name: readResult.name,
      size: readResult.size,
      type: readResult.type,
      filePath,
      thumbnail,
      metadata: readResult.fields,
      stripped: false,
    };
  } catch (err) {
    console.error("[metadata-engine] processFileFromPath error:", err);
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
