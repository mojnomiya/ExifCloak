import { ipcMain } from "electron";
import * as fs from "fs";
import * as path from "path";
import { app } from "electron";

interface PresetField {
  standard: string;
  key: string;
  valueMode: "static" | "randomFromPool" | "randomInRange" | "remove";
  staticValue?: string;
  valuePool?: string[];
}

interface Preset {
  id: string;
  name: string;
  description: string;
  category: string;
  fields: PresetField[];
  isBuiltIn: boolean;
}

interface WordBank {
  id: string;
  name: string;
  values: string[];
  isBuiltIn: boolean;
}

function getConfigDir(): string {
  const configDir = path.join(app.getPath("userData"), "config");
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }
  return configDir;
}

function getPresetsPath(): string {
  return path.join(getConfigDir(), "presets.json");
}

function getWordBanksPath(): string {
  return path.join(getConfigDir(), "wordbanks.json");
}

const BUILT_IN_PRESETS: Preset[] = [
  {
    id: "iphone",
    name: "Generic iPhone Photo",
    description: "Replaces metadata with plausible iPhone camera data",
    category: "phone",
    fields: [
      { standard: "TIFF", key: "Make", valueMode: "static", staticValue: "Apple" },
      {
        standard: "TIFF",
        key: "Model",
        valueMode: "randomFromPool",
        valuePool: ["iPhone 14 Pro", "iPhone 14 Pro Max", "iPhone 15", "iPhone 15 Pro", "iPhone 15 Pro Max", "iPhone 13"],
      },
      {
        standard: "TIFF",
        key: "Software",
        valueMode: "randomFromPool",
        valuePool: ["16.6", "17.0", "17.2", "17.3.1", "17.4"],
      },
      { standard: "EXIF", key: "LensMake", valueMode: "static", staticValue: "Apple" },
      {
        standard: "EXIF",
        key: "FocalLength",
        valueMode: "randomFromPool",
        valuePool: ["6.86", "6.765", "2.22", "9.0"],
      },
      {
        standard: "EXIF",
        key: "FNumber",
        valueMode: "randomFromPool",
        valuePool: ["1.78", "2.2", "2.8"],
      },
      {
        standard: "EXIF",
        key: "ISOSpeedRatings",
        valueMode: "randomFromPool",
        valuePool: ["50", "64", "100", "200", "400", "800"],
      },
      { standard: "EXIF", key: "UserComment", valueMode: "remove" },
      { standard: "EXIF", key: "MakerNote", valueMode: "remove" },
      { standard: "XMP", key: "CreatorTool", valueMode: "remove" },
    ],
    isBuiltIn: true,
  },
  {
    id: "dslr",
    name: "Generic DSLR Photo",
    description: "Replaces metadata with plausible DSLR camera data",
    category: "dslr",
    fields: [
      {
        standard: "TIFF",
        key: "Make",
        valueMode: "randomFromPool",
        valuePool: ["Canon", "Nikon", "Sony"],
      },
      {
        standard: "TIFF",
        key: "Model",
        valueMode: "randomFromPool",
        valuePool: ["Canon EOS R5", "NIKON D850", "ILCE-7M4"],
      },
      {
        standard: "TIFF",
        key: "Software",
        valueMode: "randomFromPool",
        valuePool: ["Adobe Photoshop Lightroom Classic 13.1", "Capture One 23"],
      },
      {
        standard: "EXIF",
        key: "FocalLength",
        valueMode: "randomFromPool",
        valuePool: ["24", "35", "50", "85", "135"],
      },
      {
        standard: "EXIF",
        key: "FNumber",
        valueMode: "randomFromPool",
        valuePool: ["1.4", "1.8", "2.8", "4.0", "5.6"],
      },
      {
        standard: "EXIF",
        key: "ISOSpeedRatings",
        valueMode: "randomFromPool",
        valuePool: ["100", "200", "400", "800", "1600"],
      },
    ],
    isBuiltIn: true,
  },
  {
    id: "mirrorless",
    name: "Generic Mirrorless Photo",
    description: "Replaces metadata with plausible mirrorless camera data",
    category: "mirrorless",
    fields: [
      {
        standard: "TIFF",
        key: "Make",
        valueMode: "randomFromPool",
        valuePool: ["FUJIFILM", "SONY", "Panasonic"],
      },
      {
        standard: "TIFF",
        key: "Model",
        valueMode: "randomFromPool",
        valuePool: ["X-T5", "ILCE-6700", "DC-GH6"],
      },
      {
        standard: "EXIF",
        key: "FocalLength",
        valueMode: "randomFromPool",
        valuePool: ["23", "33", "35", "50", "56"],
      },
      {
        standard: "EXIF",
        key: "FNumber",
        valueMode: "randomFromPool",
        valuePool: ["1.2", "1.4", "2.0", "2.8"],
      },
    ],
    isBuiltIn: true,
  },
  {
    id: "privacy",
    name: "Privacy Strip",
    description: "Remove everything — GPS, device, AI markers",
    category: "privacy",
    fields: [],
    isBuiltIn: true,
  },
];

const BUILT_IN_WORD_BANKS: WordBank[] = [
  {
    id: "makes",
    name: "Camera Makes",
    values: ["Apple", "Canon", "Nikon", "Sony", "FUJIFILM", "Panasonic", "Google", "samsung", "OM Digital Solutions", "Leica", "Hasselblad", "Phase One", "DJI"],
    isBuiltIn: true,
  },
  {
    id: "phone-models",
    name: "Phone Models",
    values: ["iPhone 15 Pro", "iPhone 15 Pro Max", "iPhone 14 Pro", "iPhone 14", "iPhone 13 Pro", "Pixel 8 Pro", "Pixel 8", "SM-S928B", "SM-S918B", "Galaxy S24 Ultra", "Galaxy S23", "OnePlus 12", "Xiaomi 14 Pro", "Huawei P60 Pro", "Sony Xperia 1 V"],
    isBuiltIn: true,
  },
  {
    id: "dslr-models",
    name: "DSLR/Mirrorless Models",
    values: ["Canon EOS R5", "Canon EOS R6 Mark II", "Canon EOS 5D Mark IV", "NIKON Z8", "NIKON Z6 III", "NIKON D850", "ILCE-7M4", "ILCE-7RM5", "ILCE-9M3", "X-T5", "X-H2S", "X100VI", "DC-GH6", "DC-S5M2", "OM-1 Mark II", "LUMIX S5 II", "LEICA Q3", "Hasselblad X2D 100C", "DJI Mavic 3 Pro", "Fujifilm GFX 100S", "Sony A7R V", "Nikon Z9"],
    isBuiltIn: true,
  },
  {
    id: "cities",
    name: "Common Cities",
    values: ["New York", "Los Angeles", "London", "Tokyo", "Paris", "Berlin", "Sydney", "Toronto", "Singapore", "Dubai", "San Francisco", "Dhaka", "Chittagong", "Sylhet", "Mumbai", "Seoul", "Bangkok", "Amsterdam", "Rome", "Barcelona", "Istanbul", "Cairo", "Lagos", "Nairobi", "Mexico City", "São Paulo", "Buenos Aires", "Lima", "Bogota"],
    isBuiltIn: true,
  },
  {
    id: "software",
    name: "Photo Software",
    values: ["Adobe Photoshop Lightroom Classic 13.1", "Adobe Photoshop 25.3", "Capture One 23", "DxO PhotoLab 7", "ON1 Photo RAW 2024", "Affinity Photo 2", "GIMP 2.10", "Darktable 4.6", "RawTherapee 5.10", "Apple Photos", "Google Photos", "Snapseed"],
    isBuiltIn: true,
  },
];

function loadPresets(): Preset[] {
  try {
    const data = fs.readFileSync(getPresetsPath(), "utf-8");
    const loaded = JSON.parse(data) as Preset[];
    // Ensure built-in presets exist
    const existingIds = new Set(loaded.map((p) => p.id));
    for (const builtIn of BUILT_IN_PRESETS) {
      if (!existingIds.has(builtIn.id)) {
        loaded.unshift(builtIn);
      }
    }
    return loaded;
  } catch {
    return [...BUILT_IN_PRESETS];
  }
}

function savePresets(presets: Preset[]): void {
  fs.writeFileSync(getPresetsPath(), JSON.stringify(presets, null, 2));
}

function loadWordBanks(): WordBank[] {
  try {
    const data = fs.readFileSync(getWordBanksPath(), "utf-8");
    const loaded = JSON.parse(data) as WordBank[];
    const existingIds = new Set(loaded.map((b) => b.id));
    for (const builtIn of BUILT_IN_WORD_BANKS) {
      if (!existingIds.has(builtIn.id)) {
        loaded.unshift(builtIn);
      }
    }
    return loaded;
  } catch {
    return [...BUILT_IN_WORD_BANKS];
  }
}

function saveWordBanks(banks: WordBank[]): void {
  fs.writeFileSync(getWordBanksPath(), JSON.stringify(banks, null, 2));
}

export function registerPresetIPC(): void {
  ipcMain.handle("presets:list", () => {
    return loadPresets();
  });

  ipcMain.handle("presets:save", (_event, presets: Preset[]) => {
    savePresets(presets);
    return { success: true };
  });

  ipcMain.handle("presets:add", (_event, preset: Preset) => {
    const presets = loadPresets();
    presets.push(preset);
    savePresets(presets);
    return { success: true };
  });

  ipcMain.handle("presets:update", (_event, preset: Preset) => {
    const presets = loadPresets();
    const idx = presets.findIndex((p) => p.id === preset.id);
    if (idx >= 0) {
      presets[idx] = preset;
      savePresets(presets);
    }
    return { success: true };
  });

  ipcMain.handle("presets:delete", (_event, presetId: string) => {
    const presets = loadPresets();
    const preset = presets.find((p) => p.id === presetId);
    if (preset && !preset.isBuiltIn) {
      const filtered = presets.filter((p) => p.id !== presetId);
      savePresets(filtered);
    }
    return { success: true };
  });

  ipcMain.handle("presets:export", (_event, presetId: string) => {
    const presets = loadPresets();
    const preset = presets.find((p) => p.id === presetId);
    if (!preset) return null;
    return JSON.stringify(preset, null, 2);
  });

  ipcMain.handle("presets:import", (_event, jsonStr: string) => {
    try {
      const preset = JSON.parse(jsonStr) as Preset;
      preset.id = crypto.randomUUID();
      preset.isBuiltIn = false;
      const presets = loadPresets();
      presets.push(preset);
      savePresets(presets);
      return { success: true };
    } catch {
      return { success: false, error: "Invalid JSON" };
    }
  });

  // Word Banks
  ipcMain.handle("wordbanks:list", () => {
    return loadWordBanks();
  });

  ipcMain.handle("wordbanks:save", (_event, banks: WordBank[]) => {
    saveWordBanks(banks);
    return { success: true };
  });
}
