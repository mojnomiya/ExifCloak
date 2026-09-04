# ExifCloak — Windows

A native Windows desktop app for viewing, editing, stripping, and regenerating image metadata.

Built with **Electron + React + TypeScript + Tailwind CSS**.

## Features

- **View metadata** — EXIF, IPTC, XMP, GPS, TIFF, C2PA/Content Credentials
- **Strip all metadata** — One-click removal of all embedded metadata
- **Strip AI/suspicious fields** — Targeted removal of AI markers, C2PA, software signatures
- **Apply presets** — Generic iPhone, DSLR, Mirrorless, Privacy Strip
- **Batch processing** — Process entire folders at once
- **System tray** — Minimize to tray, quick access
- **File associations** — Double-click .jpg/.png/.heic/.tiff/.webp to open
- **100% offline** — Your images never leave your device

## Tech Stack

- **Electron 33** — Desktop shell
- **React 19** — UI components (adapted from web app)
- **TypeScript 5** — Type safety
- **Tailwind CSS 3** — Styling
- **sharp** — High-quality image re-encoding (metadata stripping)
- **exifr** — EXIF/metadata reading
- **piexifjs** — EXIF injection for JPEG presets
- **electron-builder** — NSIS installer packaging
- **electron-updater** — Auto-updates via GitHub releases

## Prerequisites

- Node.js 20+
- npm 10+

## Development

```bash
# Install dependencies
npm install

# Start development (renderer + main process)
npm run dev

# Type-check
npm run typecheck

# Lint
npm run lint
```

## Build

```bash
# Build for production
npm run build

# Package as Windows installer
npm run package

# Package as portable executable
npm run package:dir
```

Output will be in the `release/` directory.

## Project Structure

```
src/
├── main/                       # Electron main process
│   ├── index.ts                # App entry, window, menu, IPC
│   ├── preload.ts              # Context bridge
│   ├── metadata-handlers.ts    # IPC for sharp metadata ops
│   ├── preset-manager.ts       # Preset/word bank persistence
│   ├── export-service.ts       # Batch export with reports
│   ├── tray.ts                 # System tray
│   └── updater.ts              # Auto-updater
└── renderer/                   # React frontend
    ├── index.html              # HTML shell
    ├── main.tsx                # React entry
    ├── app.tsx                 # Root component
    ├── types.ts                # Shared types
    └── components/
        ├── metadata-engine.ts  # Read metadata via exifr
        ├── strip-engine.ts     # IPC calls for strip/apply
        ├── presets.ts          # EXIF preset definitions
        ├── tool-header.tsx     # App header
        ├── drop-zone.tsx       # Drag-and-drop zone
        ├── file-list.tsx       # Sidebar file list
        └── metadata-panel.tsx  # Metadata inspector
```

## License

MIT
