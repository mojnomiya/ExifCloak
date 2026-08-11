# ExifCloak

> See what your photos reveal. Then decide what stays.

ExifCloak is a free, open-source macOS utility for viewing, editing, stripping, and regenerating image metadata (EXIF, IPTC, XMP, GPS, C2PA). Built with Swift and SwiftUI, 100% offline.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![macOS 14+](https://img.shields.io/badge/macOS-14%2B-black.svg)]()
[![Swift 5.9](https://img.shields.io/badge/Swift-5.9-orange.svg)]()

---

## Download

**[Download ExifCloak v1.0.0 (.dmg)](https://github.com/mojnomiya/ExifCloak/releases/download/v1.0.0/ExifCloak-1.0.0.dmg)**

> First launch: If macOS says the app is "damaged", run `xattr -cr /Applications/ExifCloak.app` in Terminal. This removes the quarantine flag for unsigned downloads.

---

## What it does

| Feature | Description |
|---------|-------------|
| **View** | Inspect all metadata grouped by standard (EXIF, IPTC, XMP, GPS, TIFF, File) |
| **Edit** | Inline edit any writable field — changes save directly to disk |
| **Strip All** | Remove every piece of metadata in one click |
| **Strip AI** | Target only AI/tool signatures, C2PA Content Credentials, generation markers |
| **Auto-Generate** | Replace metadata with realistic camera profiles (iPhone, Canon, Nikon, Sony, Fuji) |
| **Batch** | Apply any action to all files at once — no file-by-file clicking |
| **Rename** | Finder-style batch rename (Replace Text, Add Text, Format) |
| **Menu Bar** | Drop image on menu bar icon for instant strip |
| **Presets** | Built-in + custom presets with import/export |
| **Privacy** | 100% offline — zero network requests, no telemetry, no accounts |

## Supported formats

JPEG, PNG, HEIC/HEIF, TIFF, WebP

---

## Build from source

```bash
git clone https://github.com/mojnomiya/ExifCloak.git
cd ExifCloak
swift build
.build/debug/ExifCloak
```

Build release DMG:
```bash
zsh scripts/build-dmg.sh
```

### Requirements

- macOS 14 Sonoma+
- Swift 5.9+
- No third-party dependencies (uses Apple's ImageIO framework)

---

## Architecture

```
ExifCloak/
├── App/             # Entry point, AppDelegate, AppState (ObservableObject)
├── Models/          # ImageFileItem, ImageMetadata, MetadataPreset, BatchProgress
├── Services/        # MetadataService (ImageIO), MetadataGenerator, PresetManager
├── Views/           # SwiftUI views (sidebar, detail, sheets, menu bar)
├── Presets/         # Built-in presets and word banks
└── Extensions/      # UTType definitions, keyboard shortcuts, drop delegates
```

### Key decisions

- **No dependencies** — only Apple frameworks (ImageIO, CoreGraphics, SwiftUI)
- **Synchronous metadata I/O** — reads metadata via `CGImageSourceCopyPropertiesAtIndex`, writes via `CGImageDestinationAddImageFromSource`. Background threading via `Task.detached`.
- **Struct models** — value semantics for safe concurrency
- **Atomic writes** — backup → write → replace pattern, never corrupts pixel data

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for build instructions, code style, and PR guidelines.

Areas where help is welcome:
- Windows port
- RAW format support (CR2, NEF, ARW, DNG)
- Localization (Bangla, Spanish, Japanese, etc.)
- Unit tests
- App icon design
- Finder Quick Action extension

---

## Roadmap

- [x] View/edit/strip metadata
- [x] AI/C2PA detection and removal
- [x] Auto-generate realistic camera profiles
- [x] Batch processing
- [x] Batch rename
- [x] Menu bar quick-strip
- [x] Custom presets
- [ ] Finder Quick Action
- [ ] macOS Shortcuts integration
- [ ] Watch folder (auto-clean)
- [ ] RAW format support
- [ ] Windows version
- [ ] Localization

---

## License

[MIT](LICENSE) — free to use, modify, and distribute.
