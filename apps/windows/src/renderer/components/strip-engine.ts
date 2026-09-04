import type { ExifData } from "./presets";

declare global {
  interface Window {
    electronAPI: {
      openFiles: () => Promise<string[]>;
      openFolder: () => Promise<string | null>;
      readFile: (filePath: string) => Promise<Uint8Array>;
      writeFile: (filePath: string, data: Uint8Array) => Promise<void>;
      getFileName: (filePath: string) => Promise<string>;
      getFileSize: (filePath: string) => Promise<number>;
      getFilePaths: (dirPath: string, extensions: string[]) => Promise<string[]>;
      onFileOpen: (callback: (filePaths: string[]) => void) => void;
      removeAllListeners: (channel: string) => void;
      platform: string;
      invoke: (channel: string, ...args: unknown[]) => Promise<unknown>;
    };
  }
}

export async function stripAllMetadata(filePath: string): Promise<void> {
  const result = await window.electronAPI.invoke(
    "metadata:stripAll",
    filePath
  );
  if (result && typeof result === "object" && !(result as { success: boolean }).success) {
    throw new Error((result as { error: string }).error || "Strip failed");
  }
}

export async function applyPresetToFile(
  filePath: string,
  exifData: ExifData
): Promise<void> {
  const result = await window.electronAPI.invoke(
    "metadata:applyPreset",
    filePath,
    exifData
  );
  if (result && typeof result === "object" && !(result as { success: boolean }).success) {
    throw new Error((result as { error: string }).error || "Preset failed");
  }
}

export async function batchStrip(
  filePaths: string[]
): Promise<{ processed: number; errors: number; errorFiles: string[] }> {
  const result = await window.electronAPI.invoke(
    "metadata:batchStrip",
    filePaths
  );
  return result as { processed: number; errors: number; errorFiles: string[] };
}
