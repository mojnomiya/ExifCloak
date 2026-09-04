import { app, BrowserWindow, dialog, ipcMain, Menu } from "electron";
import * as path from "path";
import * as fs from "fs";
import { registerMetadataIPC } from "./metadata-handlers";
import { createTray, destroyTray, setQuitting } from "./tray";
import { registerPresetIPC } from "./preset-manager";
import { registerExportIPC } from "./export-service";
import { setupAutoUpdater, stopAutoUpdater } from "./updater";

let mainWindow: BrowserWindow | null = null;

const SUPPORTED_EXTENSIONS = [
  ".jpg", ".jpeg", ".png", ".heic", ".heif", ".tiff", ".tif", ".webp",
];

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    title: "ExifCloak",
    icon: path.join(__dirname, "../../resources/icon.png"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
    titleBarStyle: process.platform === "win32" ? "default" : "hidden",
    backgroundColor: "#161618",
  });

  if (process.env.NODE_ENV === "development" || process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL || "http://localhost:5173");
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, "../renderer/index.html"));
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  createTray(mainWindow);
  buildMenu();
}

function buildMenu(): void {
  const template: Electron.MenuItemConstructorOptions[] = [
    {
      label: "File",
      submenu: [
        {
          label: "Open Files...",
          accelerator: "CmdOrCtrl+O",
          click: () => handleOpenFiles(),
        },
        {
          label: "Open Folder...",
          accelerator: "CmdOrCtrl+Shift+O",
          click: () => handleOpenFolder(),
        },
        { type: "separator" },
        {
          label: "Exit",
          accelerator: process.platform === "win32" ? "Alt+F4" : "CmdOrCtrl+Q",
          click: () => app.quit(),
        },
      ],
    },
    {
      label: "Edit",
      submenu: [
        { role: "undo" },
        { role: "redo" },
        { type: "separator" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
        { role: "selectAll" },
      ],
    },
    {
      label: "View",
      submenu: [
        { role: "reload" },
        { role: "forceReload" },
        { role: "toggleDevTools" },
        { type: "separator" },
        { role: "resetZoom" },
        { role: "zoomIn" },
        { role: "zoomOut" },
        { type: "separator" },
        { role: "togglefullscreen" },
      ],
    },
    {
      label: "Help",
      submenu: [
        {
          label: "About ExifCloak",
          click: () => {
            dialog.showMessageBox(mainWindow!, {
              type: "info",
              title: "About ExifCloak",
              message: "ExifCloak",
              detail: `Version: ${app.getVersion()}\n\nImage metadata manager.\nSee what your photos reveal. Then decide what stays.\n\n100% offline. Your images never leave your device.`,
            });
          },
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

async function handleOpenFiles(): Promise<void> {
  if (!mainWindow) return;
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ["openFile", "multiSelections"],
    filters: [
      {
        name: "Images",
        extensions: ["jpg", "jpeg", "png", "heic", "heif", "tiff", "tif", "webp"],
      },
      { name: "All Files", extensions: ["*"] },
    ],
  });

  if (!result.canceled && result.filePaths.length > 0) {
    mainWindow.webContents.send("app:fileOpen", result.filePaths);
  }
}

async function handleOpenFolder(): Promise<string | null> {
  if (!mainWindow) return null;
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ["openDirectory"],
  });

  if (!result.canceled && result.filePaths.length > 0) {
    const dirPath = result.filePaths[0];
    const filePaths = getFilePathsRecursive(dirPath);
    mainWindow.webContents.send("app:fileOpen", filePaths);
    return dirPath;
  }
  return null;
}

function getFilePathsRecursive(dirPath: string): string[] {
  const results: string[] = [];
  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      if (entry.isDirectory()) {
        results.push(...getFilePathsRecursive(fullPath));
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if (SUPPORTED_EXTENSIONS.includes(ext)) {
          results.push(fullPath);
        }
      }
    }
  } catch {
    // Skip unreadable directories
  }
  return results;
}

// IPC Handlers
function registerIPC(): void {
  ipcMain.handle("dialog:openFiles", async () => {
    const result = await dialog.showOpenDialog(mainWindow!, {
      properties: ["openFile", "multiSelections"],
      filters: [
        {
          name: "Images",
          extensions: ["jpg", "jpeg", "png", "heic", "heif", "tiff", "tif", "webp"],
        },
        { name: "All Files", extensions: ["*"] },
      ],
    });
    return result.canceled ? [] : result.filePaths;
  });

  ipcMain.handle("dialog:openFolder", async () => {
    const result = await dialog.showOpenDialog(mainWindow!, {
      properties: ["openDirectory"],
    });
    if (result.canceled || result.filePaths.length === 0) return null;
    return result.filePaths[0];
  });

  ipcMain.handle("file:read", async (_event, filePath: string) => {
    const buffer = fs.readFileSync(filePath);
    return new Uint8Array(buffer);
  });

  ipcMain.handle("file:write", async (_event, filePath: string, data: Uint8Array) => {
    fs.writeFileSync(filePath, Buffer.from(data));
  });

  ipcMain.handle("file:getName", (_event, filePath: string) => {
    return path.basename(filePath);
  });

  ipcMain.handle("file:getSize", async (_event, filePath: string) => {
    const stats = fs.statSync(filePath);
    return stats.size;
  });

  ipcMain.handle(
    "file:getPaths",
    async (_event, dirPath: string, extensions: string[]) => {
      const results: string[] = [];
      try {
        const entries = fs.readdirSync(dirPath, { withFileTypes: true });
        for (const entry of entries) {
          const fullPath = path.join(dirPath, entry.name);
          if (entry.isFile()) {
            const ext = path.extname(entry.name).toLowerCase();
            if (extensions.includes(ext)) {
              results.push(fullPath);
            }
          }
        }
      } catch {
        // Skip
      }
      return results;
    }
  );
}

// App lifecycle
  app.whenReady().then(() => {
  registerIPC();
  registerMetadataIPC();
  registerPresetIPC();
  registerExportIPC();
  createWindow();
  setupAutoUpdater();

  // Handle file args on Windows (launched via file association)
  if (process.platform !== "darwin" && mainWindow) {
    const fileArgs = process.argv.slice(1).filter((arg) => {
      const ext = path.extname(arg).toLowerCase();
      return SUPPORTED_EXTENSIONS.includes(ext);
    });
    if (fileArgs.length > 0) {
      mainWindow.webContents.on("did-finish-load", () => {
        mainWindow!.webContents.send("app:fileOpen", fileArgs);
      });
    }
  }

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("before-quit", () => {
  setQuitting(true);
  stopAutoUpdater();
  destroyTray();
});

// Handle file open from OS
// macOS: open-file event
if (process.platform === "darwin") {
  app.on("open-file", (_event, filePath) => {
    if (mainWindow) {
      mainWindow.webContents.send("app:fileOpen", [filePath]);
    }
  });
}

// Handle second instance (Windows: user opens file while app is running)
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on("second-instance", (_event, commandLine) => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
      const fileArgs = commandLine.slice(1).filter((arg) => {
        const ext = path.extname(arg).toLowerCase();
        return SUPPORTED_EXTENSIONS.includes(ext);
      });
      if (fileArgs.length > 0) {
        mainWindow.webContents.send("app:fileOpen", fileArgs);
      }
    }
  });
}
