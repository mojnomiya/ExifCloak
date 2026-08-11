declare module "piexifjs" {
  export function load(data: string): object;
  export function dump(exifObj: object): string;
  export function insert(exifBytes: string, data: string): string;
  export function remove(data: string): string;
}
