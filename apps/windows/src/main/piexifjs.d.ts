declare module "piexifjs" {
  interface ExifObject {
    "0th": Record<number, string | number>;
    Exif: Record<number, string | number | number[]>;
    GPS: Record<number, string | number | number[][]>;
    "1st": Record<number, string | number>;
    Interop: Record<number, string | number>;
  }

  function dump(exifObj: ExifObject): string;
  function insert(exifBytes: string, dataUrl: string): string;
  function remove(dataUrl: string): string;
  function load(dataUrl: string): ExifObject;
}
