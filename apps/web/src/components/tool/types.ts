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
  originalFile: File;
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
