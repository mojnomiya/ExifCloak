import { ipcMain, dialog, BrowserWindow } from "electron";
import * as fs from "fs";
import * as path from "path";

interface ExportConfig {
  namingPattern: "original" | "suffix" | "prefix" | "custom";
  suffix: string;
  prefix: string;
  customPattern: string;
  overwriteOriginals: boolean;
  generateReport: boolean;
  reportFormat: "json" | "csv";
  createZip: boolean;
}

interface ChangeLogEntry {
  originalFile: string;
  outputFile: string;
  action: string;
}

function applyNaming(
  originalName: string,
  config: ExportConfig,
  index: number
): string {
  const ext = path.extname(originalName);
  const base = path.basename(originalName, ext);

  switch (config.namingPattern) {
    case "suffix":
      return `${base}${config.suffix}${ext}`;
    case "prefix":
      return `${config.prefix}${originalName}`;
    case "custom": {
      const date = new Date();
      const dateStr = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
      const name = config.customPattern
        .replace("{original}", base)
        .replace("{date}", dateStr)
        .replace("{index}", String(index + 1).padStart(3, "0"));
      return `${name}${ext}`;
    }
    default:
      return originalName;
  }
}

export function registerExportIPC(): void {
  ipcMain.handle(
    "export:batch",
    async (
      _event,
      filePaths: string[],
      config: ExportConfig
    ): Promise<{
      exported: number;
      errors: number;
      errorFiles: string[];
      changeLog: ChangeLogEntry[];
    }> => {
      const mainWindow = BrowserWindow.getFocusedWindow();

      const result = await dialog.showOpenDialog(mainWindow!, {
        properties: ["openDirectory"],
        title: "Select Export Destination",
      });

      if (result.canceled || result.filePaths.length === 0) {
        return { exported: 0, errors: 0, errorFiles: [], changeLog: [] };
      }

      const destDir = result.filePaths[0];
      let exported = 0;
      let errors = 0;
      const errorFiles: string[] = [];
      const changeLog: ChangeLogEntry[] = [];

      for (let i = 0; i < filePaths.length; i++) {
        const filePath = filePaths[i];
        const originalName = path.basename(filePath);

        try {
          if (config.overwriteOriginals) {
            changeLog.push({
              originalFile: originalName,
              outputFile: originalName,
              action: "modified in place",
            });
          } else {
            const outputName = applyNaming(originalName, config, i);
            const outputPath = path.join(destDir, outputName);

            // Ensure no overwrite
            let finalPath = outputPath;
            if (fs.existsSync(finalPath)) {
              const ext = path.extname(finalPath);
              const base = path.basename(finalPath, ext);
              finalPath = path.join(destDir, `${base}_copy${ext}`);
            }

            fs.copyFileSync(filePath, finalPath);
            changeLog.push({
              originalFile: originalName,
              outputFile: path.basename(finalPath),
              action: "exported",
            });
          }
          exported++;
        } catch {
          errors++;
          errorFiles.push(originalName);
          changeLog.push({
            originalFile: originalName,
            outputFile: "",
            action: "error",
          });
        }
      }

      // Generate report
      if (config.generateReport && changeLog.length > 0) {
        const reportName =
          config.reportFormat === "json"
            ? "exifcloak_report.json"
            : "exifcloak_report.csv";

        if (config.reportFormat === "json") {
          const report = {
            date: new Date().toISOString(),
            totalFiles: changeLog.length,
            entries: changeLog,
          };
          fs.writeFileSync(
            path.join(destDir, reportName),
            JSON.stringify(report, null, 2)
          );
        } else {
          let csv = "Original File,Output File,Action\n";
          for (const entry of changeLog) {
            csv += `"${entry.originalFile}","${entry.outputFile}","${entry.action}"\n`;
          }
          fs.writeFileSync(path.join(destDir, reportName), csv);
        }
      }

      return { exported, errors, errorFiles, changeLog };
    }
  );
}
