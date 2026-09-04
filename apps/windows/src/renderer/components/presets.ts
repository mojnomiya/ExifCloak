export interface Preset {
  id: string;
  name: string;
  description: string;
  category: "phone" | "dslr" | "mirrorless" | "privacy";
  generate: () => ExifData;
}

export interface ExifData {
  "0th": Record<number, string | number>;
  Exif: Record<number, string | number | number[]>;
  GPS: Record<number, string | number | number[][]>;
}

const TAG = {
  Make: 271,
  Model: 272,
  Software: 305,
  Orientation: 274,
  FNumber: 33437,
  ExposureTime: 33434,
  ISOSpeedRatings: 34855,
  DateTimeOriginal: 36867,
  DateTimeDigitized: 36868,
  FocalLength: 37386,
  LensMake: 42035,
  LensModel: 42036,
  ColorSpace: 40961,
  GPSLatitudeRef: 1,
  GPSLatitude: 2,
  GPSLongitudeRef: 3,
  GPSLongitude: 4,
};

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomTimestamp(): string {
  const now = Date.now();
  const daysBack = Math.floor(Math.random() * 365);
  const hour =
    Math.random() > 0.3
      ? Math.floor(Math.random() * 12) + 7
      : Math.floor(Math.random() * 24);
  const d = new Date(now - daysBack * 86400000);
  d.setHours(hour, Math.floor(Math.random() * 60), Math.floor(Math.random() * 60));
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${d.getFullYear()}:${pad(d.getMonth() + 1)}:${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function toRational(value: number): [number, number] {
  return [Math.round(value * 100), 100];
}

export const PRESETS: Preset[] = [
  {
    id: "iphone",
    name: "Generic iPhone",
    description: "Realistic iPhone 14/15 Pro camera profile",
    category: "phone",
    generate() {
      const model = randomFrom([
        "iPhone 15 Pro",
        "iPhone 15 Pro Max",
        "iPhone 14 Pro",
        "iPhone 14",
        "iPhone 13 Pro",
      ]);
      const sw = randomFrom(["17.4.1", "17.3.1", "17.2", "16.7.1", "16.6"]);
      const focalLength = randomFrom([6.765, 6.86, 5.7, 2.22]);
      const fNumber = randomFrom([1.78, 2.2, 2.8, 1.6]);
      const iso = randomFrom([32, 50, 64, 100, 200, 400]);
      const timestamp = randomTimestamp();

      return {
        "0th": {
          [TAG.Make]: "Apple",
          [TAG.Model]: model,
          [TAG.Software]: sw,
          [TAG.Orientation]: 1,
        },
        Exif: {
          [TAG.FNumber]: toRational(fNumber) as unknown as number,
          [TAG.ExposureTime]: toRational(
            1 / randomFrom([125, 250, 500, 1000])
          ) as unknown as number,
          [TAG.ISOSpeedRatings]: iso,
          [TAG.DateTimeOriginal]: timestamp,
          [TAG.DateTimeDigitized]: timestamp,
          [TAG.FocalLength]: toRational(focalLength) as unknown as number,
          [TAG.LensMake]: "Apple" as unknown as number,
          [TAG.LensModel]: `${model} back camera ${focalLength}mm f/${fNumber}` as unknown as number,
          [TAG.ColorSpace]: 1,
        },
        GPS: {},
      };
    },
  },
  {
    id: "dslr",
    name: "Generic DSLR",
    description: "Canon/Nikon/Sony DSLR with matching lens",
    category: "dslr",
    generate() {
      const brand = randomFrom(["Canon", "NIKON CORPORATION", "SONY"]);
      const models: Record<string, string[]> = {
        Canon: ["Canon EOS R5", "Canon EOS R6 Mark II", "Canon EOS 5D Mark IV"],
        "NIKON CORPORATION": ["NIKON Z8", "NIKON Z6 III", "NIKON D850"],
        SONY: ["ILCE-7M4", "ILCE-7RM5", "ILCE-9M3"],
      };
      const lenses: Record<string, string[]> = {
        Canon: [
          "RF 24-70mm F2.8 L IS USM",
          "RF 50mm F1.2 L USM",
          "RF 85mm F1.2 L USM",
        ],
        "NIKON CORPORATION": [
          "NIKKOR Z 24-70mm f/2.8 S",
          "NIKKOR Z 50mm f/1.2 S",
        ],
        SONY: [
          "FE 24-70mm F2.8 GM II",
          "FE 50mm F1.2 GM",
          "FE 85mm F1.4 GM",
        ],
      };
      const model = randomFrom(models[brand]);
      const lens = randomFrom(lenses[brand]);
      const focalLength = randomFrom([24, 35, 50, 70, 85, 135]);
      const fNumber = randomFrom([1.4, 1.8, 2.8, 4.0, 5.6]);
      const iso = randomFrom([100, 200, 400, 800, 1600]);
      const software = randomFrom([
        "Adobe Photoshop Lightroom Classic 13.1",
        "Capture One 23",
        "DxO PhotoLab 7",
      ]);
      const timestamp = randomTimestamp();

      return {
        "0th": {
          [TAG.Make]: brand,
          [TAG.Model]: model,
          [TAG.Software]: software,
          [TAG.Orientation]: 1,
        },
        Exif: {
          [TAG.FNumber]: toRational(fNumber) as unknown as number,
          [TAG.ExposureTime]: toRational(
            1 / randomFrom([250, 500, 1000, 2000])
          ) as unknown as number,
          [TAG.ISOSpeedRatings]: iso,
          [TAG.DateTimeOriginal]: timestamp,
          [TAG.DateTimeDigitized]: timestamp,
          [TAG.FocalLength]: toRational(focalLength) as unknown as number,
          [TAG.LensMake]: brand as unknown as number,
          [TAG.LensModel]: lens as unknown as number,
          [TAG.ColorSpace]: 1,
        },
        GPS: {},
      };
    },
  },
  {
    id: "mirrorless",
    name: "Generic Mirrorless",
    description: "Fujifilm/Sony/Panasonic mirrorless profile",
    category: "mirrorless",
    generate() {
      const brand = randomFrom(["FUJIFILM", "SONY", "Panasonic"]);
      const models: Record<string, string[]> = {
        FUJIFILM: ["X-T5", "X-H2S", "X100VI"],
        SONY: ["ILCE-6700", "ZV-E1", "ILCE-7CM2"],
        Panasonic: ["DC-GH6", "DC-S5M2", "DC-G9M2"],
      };
      const lenses: Record<string, string[]> = {
        FUJIFILM: [
          "XF23mmF1.4 R LM WR",
          "XF56mmF1.2 R WR",
          "XF33mmF1.4 R LM WR",
        ],
        SONY: ["E 35mm F1.8 OSS", "FE 50mm F2.5 G"],
        Panasonic: ["LUMIX S 50mm F1.8", "LUMIX S 24-70mm F2.8"],
      };
      const model = randomFrom(models[brand]);
      const lens = randomFrom(lenses[brand]);
      const focalLength = randomFrom([23, 33, 35, 50, 56]);
      const fNumber = randomFrom([1.2, 1.4, 2.0, 2.8]);
      const iso = randomFrom([160, 200, 400, 800, 1600]);
      const timestamp = randomTimestamp();

      return {
        "0th": {
          [TAG.Make]: brand,
          [TAG.Model]: model,
          [TAG.Software]: randomFrom([
            "Adobe Photoshop Lightroom Classic 13.1",
            "Capture One 23",
          ]),
          [TAG.Orientation]: 1,
        },
        Exif: {
          [TAG.FNumber]: toRational(fNumber) as unknown as number,
          [TAG.ExposureTime]: toRational(
            1 / randomFrom([125, 250, 500])
          ) as unknown as number,
          [TAG.ISOSpeedRatings]: iso,
          [TAG.DateTimeOriginal]: timestamp,
          [TAG.DateTimeDigitized]: timestamp,
          [TAG.FocalLength]: toRational(focalLength) as unknown as number,
          [TAG.LensMake]: brand as unknown as number,
          [TAG.LensModel]: lens as unknown as number,
          [TAG.ColorSpace]: 1,
        },
        GPS: {},
      };
    },
  },
  {
    id: "privacy",
    name: "Privacy Strip",
    description: "Remove everything — GPS, device, AI markers",
    category: "privacy",
    generate() {
      return { "0th": {}, Exif: {}, GPS: {} };
    },
  },
];
