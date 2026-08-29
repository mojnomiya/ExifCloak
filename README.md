# ExifCloak

> See what your photos reveal. Then decide what stays.

Free, open-source image metadata manager. View, edit, strip, and regenerate EXIF/IPTC/XMP/GPS/C2PA metadata. 100% offline.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## Apps

| Platform | Path | Status |
|----------|------|--------|
| **macOS** (native SwiftUI) | [`apps/macos/`](apps/macos/) | v1.0.0 released |
| **Web** (Next.js, client-side) | [`apps/web/`](apps/web/) | Live at [exifcloak.netlify.app](https://exifcloak.netlify.app) |
| **Windows** | — | Planned |

---

## Quick Start

### macOS App

```bash
cd apps/macos
swift build
.build/debug/ExifCloak
```

Build DMG:
```bash
zsh scripts/build-dmg.sh
```

### Web App

```bash
cd apps/web
npm install
npm run dev
# → http://localhost:3000
```

---

## Features

| Feature | macOS | Web |
|---------|:-----:|:---:|
| View metadata (EXIF, IPTC, XMP, GPS) | ✅ | ✅ |
| Edit fields inline | ✅ | — |
| Strip all metadata | ✅ | ✅ |
| Strip AI/C2PA fields | ✅ | ✅ |
| Auto-generate camera profiles | ✅ | ✅ |
| Presets (iPhone, DSLR, Mirrorless) | ✅ | ✅ |
| Batch processing | ✅ | ✅ |
| Batch rename | ✅ | — |
| Menu bar quick-strip | ✅ | — |
| 100% offline | ✅ | ✅ |

---

## Download

- **macOS:** [ExifCloak-1.0.0.dmg](https://github.com/mojnomiya/ExifCloak/releases/download/v1.0.0/ExifCloak-1.0.0.dmg)
- **Web:** [exifcloak.netlify.app/tool](https://exifcloak.netlify.app/tool)

---

## Docs

- [Market Research](docs/MARKET_RESEARCH.md)
- [SRS / Product Spec](docs/SRS_MetadataUtility_macOS.md)
- [Contributing](docs/CONTRIBUTING.md)
- [Code of Conduct](docs/CODE_OF_CONDUCT.md)

---

## License

[MIT](LICENSE)
