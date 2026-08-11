# Software Requirements Specification (SRS)
## PixelClean — macOS Image Metadata Manager
**Version:** 0.1 (Draft)
**Prepared for:** Kiro spec-driven build
**Date:** August 10, 2026

---

## 1. Purpose

PixelClean is a native macOS utility that lets users **view, edit, strip, and regenerate** image metadata (EXIF/IPTC/XMP) for single files or batches. The primary use case is giving users control over metadata before sharing images on social platforms — e.g. removing or overwriting fields that could reveal the file's origin or generation tool, and optionally replacing them with user-supplied or templated values.

This is a metadata-editing tool, not a tool for misrepresenting image provenance to third parties who rely on metadata for authenticity verification (e.g. journalism, content-authenticity programs). The SRS assumes the app markets itself as a **privacy/metadata-control tool**, similar in spirit to existing utilities like ImageOptim or ExifTool GUIs.

A companion web app is planned as a v2 phase; this SRS covers the macOS-native v1 only.

---

## 2. Scope

### 2.1 In scope (v1)
- View all readable metadata fields (EXIF, IPTC, XMP, GPS, color profile, file-level attributes)
- Edit individual fields manually
- Strip all metadata (one click)
- Auto-generate replacement metadata from user-provided word/phrase banks or templates (e.g. camera make/model pools, random-but-plausible timestamps, location presets)
- Batch processing: drag-and-drop multiple files or folders
- Single-file and batch export/download
- Native macOS UX (SwiftUI, drag-and-drop, Quick Look, menu bar presence)

### 2.2 Out of scope (v1)
- Video metadata
- Cloud sync / accounts
- Web app (planned v2)
- Automated detection-evasion against specific platform algorithms (not guaranteed, not a stated feature)

---

## 3. Target Users
- Content creators/marketers publishing AI-generated or edited images to social media
- Photographers/designers wanting quick metadata cleanup before delivery
- Privacy-conscious users stripping location/device data from personal photos

---

## 4. Functional Requirements

### 4.1 File Input
- FR1: Drag-and-drop single or multiple image files onto the app window or Dock icon
- FR2: Drag-and-drop entire folders (recursive scan for supported image types)
- FR3: Standard "Open File(s)" picker as an alternative to drag-and-drop
- FR4: Supported formats: JPEG, PNG, HEIC/HEIF, TIFF, WebP (minimum); RAW formats as stretch goal

### 4.2 Metadata Viewing
- FR5: Display all metadata grouped by standard (EXIF / IPTC / XMP / GPS / File System) in a clean, searchable, collapsible list
- FR6: Highlight fields that commonly reveal AI-generation tools (e.g. `Software`, `CreatorTool`, `XMP:CreatorTool`, C2PA/Content Credentials blocks if present)
- FR7: Show a thumbnail preview alongside metadata (Quick Look style)

### 4.3 Metadata Editing
- FR8: Inline edit of any writable field
- FR9: One-click "Strip All Metadata" action
- FR10: One-click "Strip Suspicious/AI-related Fields Only" (targeted removal of tool/software signature fields, C2PA manifests, etc.)
- FR11: Manual field entry supports free text, dropdowns for common enumerated fields (e.g. camera make), and date/time pickers

### 4.4 Auto-Generation (Non-AI, Template-Based)
- FR12: User can supply or select a **word/phrase bank** (e.g. plausible camera models, cities, dates) that the app randomly assigns to relevant fields
- FR13: Built-in default presets (e.g. "Generic iPhone Photo," "Generic DSLR Photo") users can pick from
- FR14: Custom preset creation/save/reuse — users build their own metadata templates and apply them repeatedly
- FR15: "Randomize within realistic bounds" option (e.g. timestamp within last 12 months, GPS jitter within a city)

### 4.5 Batch Processing
- FR16: Apply the same action (strip, template, or field edit) across all queued files
- FR17: Per-file override — edit one file differently within a batch without affecting the rest
- FR18: Progress indicator per file and overall batch
- FR19: Batch export to a chosen destination folder, preserving or renaming files per user preference (naming pattern support, e.g. `{original}_clean`)

### 4.6 Output
- FR20: Export single file (Save/Save As) or full batch (folder export / zipped download)
- FR21: Option to preserve original files (write to copies) vs. in-place overwrite (with confirmation warning)
- FR22: Export report (optional CSV/JSON log of what was changed per file, for the user's own records)

---

## 5. Non-Functional Requirements

- NFR1: **Native feel** — SwiftUI-based, respects macOS HIG, supports Light/Dark mode, Dock/menu bar integration, Quick Look extension
- NFR2: **Performance** — batch of 100 typical JPEGs (≈5MB each) processed in under 15 seconds on Apple Silicon
- NFR3: **Offline-first** — all processing local; no data leaves the device (this is itself a strong privacy/marketing point)
- NFR4: **Reliability** — never corrupt image pixel data while editing metadata; atomic writes with rollback on failure
- NFR5: **Accessibility** — VoiceOver support, keyboard navigation
- NFR6: Sandboxed app, notarized for distribution outside/inside the Mac App Store

---

## 6. Suggested Additional Features (value-add / marketability)

| Feature | Why it helps |
|---|---|
| **Menu bar quick-clean** | Drop an image on the menu bar icon → instantly stripped & copied to clipboard/Downloads. Huge speed win for power users. |
| **Automator/Shortcuts (macOS Shortcuts app) integration** | Let users build automated workflows, e.g. "every screenshot auto-cleaned." |
| **Finder Quick Action / right-click "Clean Metadata"** | Removes need to open the app at all for simple cases. |
| **Preset marketplace/sharing** | Users export/import metadata templates as `.json` — could later become a community library. |
| **Before/After diff view** | Side-by-side comparison of original vs. new metadata, builds user trust. |
| **C2PA / Content Credentials awareness panel** | Explicitly flags and explains AI-provenance metadata blocks (Adobe/Leica/OpenAI content credentials), since this is increasingly the real signal platforms check, not just EXIF `Software` tag. |
| **Batch renaming** | Bundle simple rename patterns with metadata cleaning (common workflow pairing). |
| **iCloud Drive / Photos.app import** | Pull directly from Photos library or iCloud Drive folders. |
| **Undo history** | Since originals may be overwritten, an in-app "recently cleaned" restore log adds safety. |
| **Pro tier: watch folder** | Auto-clean anything dropped into a designated folder — good subscription upsell. |
| **Localization** | Bangla + English UI given target market context. |

---

## 7. Technical Notes for Kiro Build
- Recommended stack: **Swift + SwiftUI**, `ImageIO` / `CGImageMetadata` for reading/writing EXIF/IPTC/XMP (native, no need for ExifTool dependency, though bundling `exiftool` as a fallback for edge-case formats is an option)
- Consider `NSItemProvider` for drag-and-drop, `UniformTypeIdentifiers` for format validation
- App Sandbox + hardened runtime required for notarization
- Local `UserDefaults`/`SwiftData` for storing custom presets

---

## 8. Future (v2 — Web App)
- Same core feature set via browser (upload/process/download)
- Likely trade-off: server-side processing needed unless using WASM/client-side image libraries to preserve the "nothing leaves the device" privacy pitch — worth preserving that guarantee if possible (e.g. WebAssembly-based EXIF processing) since it's a strong differentiator.

---

## 9. Open Questions for Client
1. Should "Strip Suspicious/AI Fields" attempt to detect and remove C2PA/Content Credentials manifests specifically, or only classic EXIF/XMP tool-signature fields?
2. Preferred distribution: Mac App Store (more trust, but sandboxing restricts some file operations) vs. direct notarized download (more flexibility)?
3. Any specific word/phrase banks the client wants pre-loaded, or should defaults be generic (camera models, common cities, etc.)?
4. One-time purchase vs. subscription (relevant given the "watch folder"/Pro tier idea)?


Answers:
1. Yes
2. notarized download
3. pre-loaded with generic and also there will be option to take those from the client who using the app .
4. both