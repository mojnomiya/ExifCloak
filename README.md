# ExifCloak

> See what your photos reveal. Then decide what stays.

ExifCloak is a free, open-source macOS utility for viewing, editing, stripping, and regenerating image metadata (EXIF, IPTC, XMP, GPS, C2PA). Built with Swift and SwiftUI, 100% offline.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![macOS 14+](https://img.shields.io/badge/macOS-14%2B-black.svg)]()
[![Swift 5.9](https://img.shields.io/badge/Swift-5.9-orange.svg)]()

---

## Download

**[Download ExifCloak v1.0.0 (.dmg)](https://github.com/mojnomiya/ExifCloak/releases/download/v1.0.0/ExifCloak-1.0.0.dmg)** — macOS desktop app

**[Use ExifCloak Web Tool](https://exifcloak.app/tool)** — browser-based, no install needed

> First launch (macOS): If macOS says the app is "damaged", run `xattr -cr /Applications/ExifCloak.app` in Terminal. This removes the quarantine flag for unsigned downloads.

---

## What it does

| Feature | Desktop | Web |
|---------|:-------:|:---:|
| **View metadata** (EXIF, IPTC, XMP, GPS, TIFF) | ✅ | ✅ |
| **Edit** individual fields inline | ✅ | — |
| **Strip All** metadata | ✅ | ✅ |
| **Strip AI** fields (C2PA, DALL·E, Midjourney, etc.) | ✅ | ✅ |
| **Auto-Generate** realistic camera profiles | ✅ | ✅ |
| **Presets** (iPhone, DSLR, Mirrorless, Privacy) | ✅ | ✅ |
| **Batch** process all files at once | ✅ | ✅ |
| **Batch Rename** (Finder-style) | ✅ | — |
| **Menu Bar** quick-strip | ✅ | — |
| **Download** cleaned files | in-place save | ✅ |
| **100% offline** | ✅ | ✅ (client-side) |

## Supported formats

JPEG, PNG, HEIC/HEIF, TIFF, WebP

---

## Web Tool

ExifCloak also has a browser-based version at **[exifcloak.app/tool](https://exifcloak.app/tool)** — no install, no signup, 100% client-side.

- Drag & drop images
- View all EXIF/IPTC/XMP/GPS metadata
- Strip all metadata or AI fields only
- Apply presets (iPhone, DSLR, Mirrorless)
- Download clean files
- Works on any OS with a modern browser

The web tool is built with Next.js and uses `exifr` for reading and `piexifjs` for writing EXIF data. Source is in the [exifcloak-web](https://github.com/mojnomiya/exifcloak-web) repo.

---

## Build from source (Desktop)

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
