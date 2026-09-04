import { autoUpdater } from "electron-updater";
import { log } from "electron";

let updateCheckInterval: ReturnType<typeof setInterval> | null = null;

export function setupAutoUpdater(): void {
  autoUpdater.logger = log;
  autoUpdater.autoDownload = false;
  autoUpdater.autoInstallOnAppQuit = true;

  // Check for updates every 4 hours
  updateCheckInterval = setInterval(
    () => {
      autoUpdater.checkForUpdates().catch(() => {
        // Silently ignore update check failures
      });
    },
    4 * 60 * 60 * 1000
  );

  // Initial check after 30 seconds
  setTimeout(() => {
    autoUpdater.checkForUpdates().catch(() => {});
  }, 30_000);
}

export function stopAutoUpdater(): void {
  if (updateCheckInterval) {
    clearInterval(updateCheckInterval);
    updateCheckInterval = null;
  }
}
