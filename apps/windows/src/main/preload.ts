import { contextBridge, ipcRenderer } from "electron";

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

contextBridge.exposeInMainWorld("electronAPI", {
  openFiles: () => ipcRenderer.invoke("dialog:openFiles"),
  openFolder: () => ipcRenderer.invoke("dialog:openFolder"),
  readFile: (filePath: string) => ipcRenderer.invoke("file:read", filePath),
  writeFile: (filePath: string, data: Uint8Array) =>
    ipcRenderer.invoke("file:write", filePath, data),
  getFileName: (filePath: string) => ipcRenderer.invoke("file:getName", filePath),
  getFileSize: (filePath: string) => ipcRenderer.invoke("file:getSize", filePath),
  getFilePaths: (dirPath: string, extensions: string[]) =>
    ipcRenderer.invoke("file:getPaths", dirPath, extensions),
  onFileOpen: (callback: (filePaths: string[]) => void) => {
    ipcRenderer.on("app:fileOpen", (_event, filePaths) => callback(filePaths));
  },
  removeAllListeners: (channel: string) => {
    ipcRenderer.removeAllListeners(channel);
  },
  invoke: (channel: string, ...args: unknown[]) =>
    ipcRenderer.invoke(channel, ...args),
  platform: process.platform,
} satisfies ElectronAPI);
