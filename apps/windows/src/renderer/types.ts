export interface ElectronAPI {
  openFiles: () => Promise<string[]>;
  openFolder: () => Promise<string | null>;
  readFile: (filePath: string) => Promise<Uint8Array>;
  writeFile: (filePath: string, data: Uint8Array) => Promise<void>;
  getFileName: (filePath: string) => Promise<string>;
  getFileSize: (filePath: string) => Promise<number>;
  getFilePaths: (dirPath: string, extensions: string[]) => Promise<string[]>;
  onFileOpen: (callback: (filePaths: string[]) => void) => void;
  removeAllListeners: (channel: string) => void;
  invoke: (channel: string, ...args: unknown[]) => Promise<unknown>;
  platform: string;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

export interface MetadataField {
  key: string;
  value: string;
  group: string;
  suspicious: boolean;
}

export interface ProcessedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  filePath: string;
  thumbnail: string;
  metadata: MetadataField[];
  stripped: boolean;
}

export const SUSPICIOUS_KEYS = new Set([
  "Software",
  "CreatorTool",
  "ProcessingSoftware",
  "HistorySoftwareAgent",
  "ImageDescription",
  "UserComment",
  "MakerNote",
  "XMP:CreatorTool",
  "parameters",
  "prompt",
  "negative_prompt",
]);

export function isSuspicious(key: string): boolean {
  if (SUSPICIOUS_KEYS.has(key)) return true;
  const lower = key.toLowerCase();
  return (
    lower.includes("c2pa") ||
    lower.includes("contentcredentials") ||
    lower.includes("gps")
  );
}
