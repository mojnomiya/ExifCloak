# ExifCloak

**Your images, your metadata, your rules.**

ExifCloak is a native macOS utility that gives you complete control over image metadata (EXIF/IPTC/XMP/GPS/C2PA). View, edit, strip, or regenerate metadata for single files or entire batches — all processed locally, nothing ever leaves your device.

---

## Why ExifCloak?

Every photo carries invisible data: GPS coordinates, device fingerprints, AI generation markers, timestamps, and editing history. ExifCloak lets you decide what stays and what goes — before you share.

Unlike basic strippers that just delete everything, ExifCloak also lets you **replace** metadata with plausible alternatives, giving content creators full ownership of their image identity.

---

## Features

### View & Inspect
- View all metadata grouped by standard (EXIF, IPTC, XMP, GPS, TIFF, File System)
- Search and filter fields instantly
- Suspicious/AI-related fields highlighted in orange
- C2PA / Content Credentials detection

### Edit
- Inline edit any writable field
- Remove individual fields or entire groups
- Changes save directly to the file on disk

### Strip
- **Strip All** — Remove every piece of metadata, preserving only pixel data
- **Strip AI Fields** — Target only AI/tool signatures, C2PA manifests, and generation markers
- Confirmation dialogs prevent accidental data loss

### Auto-Generate
- Generate cohesive, realistic camera profiles:
  - iPhone (14/15 Pro, various models)
  - Android (Pixel, Samsung Galaxy)
  - DSLR (Canon, Nikon, Sony with matching lenses)
  - Mirrorless (Fujifilm, Panasonic, OM Digital)
- Randomized but plausible: timestamps biased to daylight hours, GPS jitter within cities, matching ISO/aperture/shutter combinations
- Built-in presets + custom preset creation

### Batch Processing
- Apply any action to all files at once — no manual selection needed
- Batch strip, batch generate, batch apply presets
- Progress indicator with per-file error reporting

### Batch Rename
- Finder-style rename with three modes:
  - **Replace Text** — Find and replace in filenames
  - **Add Text** — Prepend or append text
  - **Format** — Base name + sequential number + separator
- Live preview before applying
- Conflict detection

### Presets & Word Banks
- 4 built-in presets: Generic iPhone, Generic DSLR, Generic Mirrorless, Privacy Strip
- Create, save, import/export custom presets as JSON
- Word banks: camera makes, phone models, DSLR models, cities, software
- Randomization modes: static, random from pool, random in range, remove

### Menu Bar
- Quick-strip: drop an image on the menu bar icon for instant metadata removal
- Access the app without opening the main window

### Privacy & Security
- 100% offline — no network requests, no telemetry, no cloud
- Sandboxed with hardened runtime (ready for notarization)
- Atomic file writes with rollback on failure — never corrupts image data

---

## Supported Formats

| Format | Read | Write |
|--------|------|-------|
| JPEG (.jpg, .jpeg) | ✅ | ✅ |
| PNG (.png) | ✅ | ✅ |
| HEIC/HEIF (.heic, .heif) | ✅ | ✅ |
| TIFF (.tiff, .tif) | ✅ | ✅ |
| WebP (.webp) | ✅ | ✅ |

---

## System Requirements

- macOS 14.0 (Sonoma) or later
- Apple Silicon or Intel Mac
- ~15 MB disk space

---

## Build & Run

```bash
# Clone and build
cd PixelClean
swift build

# Run
.build/debug/ExifCloak
```

For Xcode:
```bash
open PixelClean.xcodeproj
```

---

## Architecture

```
PixelClean/
├── App/
│   ├── ExifCloakApp.swift      # @main App entry, scenes, menu commands
│   ├── AppDelegate.swift       # NSApplicationDelegate, activation policy
│   └── AppState.swift          # Central ObservableObject state manager
├── Models/
│   ├── ImageFileItem.swift     # File queue item (URL, thumbnail, metadata)
│   ├── ImageMetadata.swift     # Metadata fields, standards, suspicious keys
│   ├── MetadataPreset.swift    # Preset/template system, word banks
│   └── BatchProgress.swift     # Progress tracking, export configuration
├── Services/
│   ├── MetadataService.swift   # Core ImageIO read/write/strip engine
│   ├── MetadataGenerator.swift # Auto-generate realistic camera profiles
│   ├── PresetManager.swift     # CRUD for presets + word banks (UserDefaults)
│   ├── ExportService.swift     # Batch export, zip, CSV/JSON reports
│   └── UndoManager.swift       # File change history with restore
├── Views/
│   ├── ContentView.swift       # Main NavigationSplitView + toolbar
│   ├── SidebarView.swift       # File queue list with rename support
│   ├── MetadataDetailView.swift # Inspector: metadata grouped by standard
│   ├── MetadataFieldRow.swift  # Single field: key-value with edit/delete
│   ├── EmptyStateView.swift    # Welcome screen
│   ├── MenuBarView.swift       # Menu bar extra with quick-strip
│   ├── PresetPickerSheet.swift # Choose/apply presets
│   ├── PresetEditorView.swift  # Create/edit custom presets
│   ├── GeneratorSheet.swift    # Auto-generation configuration
│   ├── BatchRenameSheet.swift  # Finder-style batch rename
│   ├── BatchProgressView.swift # Progress overlay
│   ├── SettingsView.swift      # Preferences (General, Presets, Word Banks)
│   └── MetadataDiffView.swift  # Before/after comparison
├── Presets/
│   ├── BuiltInPresets.swift    # Default presets (iPhone, DSLR, etc.)
│   └── BuiltInWordBanks.swift  # Default word banks (cameras, cities, etc.)
├── Extensions/
│   ├── SupportedTypes.swift    # UTType definitions
│   ├── KeyboardShortcuts.swift # Keyboard shortcut constants
│   └── DropDelegate+Images.swift # Drag-and-drop utilities
└── Resources/
    └── Assets.xcassets/        # App icon, accent color
```

### Key Technical Decisions

| Decision | Rationale |
|----------|-----------|
| Swift + SwiftUI | Native performance, HIG compliance, future-proof |
| ImageIO/CGImageMetadata | Apple's native framework — fast, no third-party dependencies |
| Synchronous MetadataService | Avoids actor serialization bottleneck; background via Task.detached |
| Struct-based models | Value semantics for safe concurrency |
| UserDefaults for presets | Simple persistence, no database overhead for small data |
| NSOpenPanel (not fileImporter) | More reliable file/folder picking on macOS |
| NSApp.setActivationPolicy(.regular) | Required for keyboard input when running from terminal |

---

## Roadmap

### v1.0 (Current — macOS)
- [x] View/edit/strip all metadata
- [x] AI/C2PA field detection and targeted removal
- [x] Auto-generation with realistic camera profiles
- [x] Batch processing (strip, generate, presets)
- [x] Batch rename (Finder-style)
- [x] Menu bar quick-strip
- [x] Custom presets with import/export
- [x] Confirmation dialogs for destructive actions

### v1.1 (Planned)
- [ ] Finder Quick Action integration (right-click → "Clean Metadata")
- [ ] macOS Shortcuts app support
- [ ] Watch folder (auto-clean anything dropped in a designated folder)
- [ ] Undo history with restore
- [ ] Localization (Bangla + English)

### v2.0 (Windows)
- [ ] Native Windows version (WinUI 3 or cross-platform Swift)
- [ ] Feature parity with macOS
- [ ] Shared preset format (.json)

### v3.0 (Web)
- [ ] Browser-based processing (WebAssembly)
- [ ] Client-side only — maintain privacy guarantee

---

## Distribution

- **Primary:** Notarized direct download (DMG)
- **Secondary:** Mac App Store (if sandbox constraints are acceptable)
- **Pricing:** Freemium — free for single files, Pro for batch + presets + watch folder

---

## License

Copyright © 2026 ExifCloak. All rights reserved.

---

## Tech Stack

| Component | Technology |
|-----------|------------|
| Language | Swift 5.9 |
| UI Framework | SwiftUI (macOS 14+) |
| Metadata Engine | ImageIO, CGImageMetadata, CoreGraphics |
| Persistence | UserDefaults, JSON codable |
| File Handling | NSOpenPanel, NSItemProvider, UTType |
| Build | Swift Package Manager + Xcode |
| Target | macOS 14+ (Apple Silicon + Intel) |
