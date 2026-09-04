import { Tray, Menu, nativeImage, app, BrowserWindow } from "electron";
import * as path from "path";

let tray: Tray | null = null;

export function createTray(mainWindow: BrowserWindow): void {
  // Create a 16x16 tray icon
  const iconPath = path.join(__dirname, "../../resources/icon.png");
  let trayIcon: nativeImage;
  try {
    trayIcon = nativeImage.createFromPath(iconPath).resize({ width: 16, height: 16 });
  } catch {
    // Fallback: create a simple colored icon
    trayIcon = nativeImage.createEmpty();
  }

  tray = new Tray(trayIcon);
  tray.setToolTip("ExifCloak");

  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Open ExifCloak",
      click: () => {
        mainWindow.show();
        mainWindow.focus();
      },
    },
    { type: "separator" },
    {
      label: "Quit",
      click: () => {
        app.quit();
      },
    },
  ]);

  tray.setContextMenu(contextMenu);

  tray.on("double-click", () => {
    mainWindow.show();
    mainWindow.focus();
  });

  // Hide to tray instead of closing
  mainWindow.on("close", (event) => {
    if (!app.isQuitting) {
      event.preventDefault();
      mainWindow.hide();
    }
  });
}

export function destroyTray(): void {
  if (tray) {
    tray.destroy();
    tray = null;
  }
}
