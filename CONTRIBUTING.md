# Contributing to ExifCloak

Thanks for your interest in contributing. ExifCloak is a native macOS app built with Swift and SwiftUI, and we welcome contributions of all kinds — bug fixes, new features, documentation improvements, and translations.

## Getting Started

### Prerequisites

- macOS 14 Sonoma or later
- Xcode 15+ (for IDE support) or just the Swift toolchain
- Swift 5.9+

### Build from source

```bash
git clone https://github.com/mojnomiya/ExifCloak.git
cd ExifCloak
swift build
```

Run the app:
```bash
.build/debug/ExifCloak
```

Build a release DMG:
```bash
zsh scripts/build-dmg.sh
```

### Project structure

```
ExifCloak/
├── ExifCloak/           # Source code
│   ├── App/             # App entry point, AppDelegate, AppState
│   ├── Models/          # Data models (ImageFileItem, MetadataPreset, etc.)
│   ├── Services/        # Core logic (MetadataService, MetadataGenerator, etc.)
│   ├── Views/           # SwiftUI views
│   ├── Presets/         # Built-in presets and word banks
│   ├── Extensions/      # Utilities and helpers
│   └── Resources/       # App icon, asset catalogs
├── scripts/             # Build and icon generation scripts
├── Package.swift        # Swift Package Manager manifest
└── README.md
```

## How to Contribute

### Reporting bugs

Open an issue with:
- macOS version
- Steps to reproduce
- What you expected vs. what happened
- Image format involved (if relevant)

### Suggesting features

Open an issue with the `enhancement` label. Describe the use case, not just the solution.

### Submitting code

1. Fork the repo
2. Create a branch: `git checkout -b fix/your-fix` or `feature/your-feature`
3. Make your changes
4. Test locally: `swift build && .build/debug/ExifCloak`
5. Commit with a clear message
6. Push and open a Pull Request

### Code style

- Follow existing patterns in the codebase
- Use Swift naming conventions (camelCase for vars/funcs, PascalCase for types)
- Keep views small — extract components into their own files
- Services should be stateless where possible
- No third-party dependencies unless absolutely necessary (we use only Apple frameworks)

### Areas where help is needed

- **Windows port** — researching Swift cross-compilation or native Windows UI
- **RAW format support** — extending MetadataService for CR2, NEF, ARW, DNG
- **Localization** — translating the UI (Bangla, Spanish, Japanese, etc.)
- **Accessibility** — improving VoiceOver support
- **Tests** — unit tests for MetadataService, PresetManager
- **Finder Quick Action** — implementing the extension
- **App icon** — a proper designed icon (currently programmatically generated)

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you agree to uphold it.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
