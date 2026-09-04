import type { ExifData } from "./presets";

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
