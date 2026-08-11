import Foundation

/// Default built-in metadata presets
enum BuiltInPresets {
    static let all: [MetadataPreset] = [
        genericIPhone,
        genericDSLR,
        genericMirrorless,
        privacyStrip,
    ]

    // MARK: - Generic iPhone Photo

    static let genericIPhone = MetadataPreset(
        name: "Generic iPhone Photo",
        description: "Replaces metadata with plausible iPhone camera data",
        category: .phone,
        fields: [
            PresetField(standard: "TIFF", key: "Make", valueMode: .static, staticValue: "Apple"),
            PresetField(standard: "TIFF", key: "Model", valueMode: .randomFromPool, valuePool: [
                "iPhone 14 Pro", "iPhone 14 Pro Max", "iPhone 15",
                "iPhone 15 Pro", "iPhone 15 Pro Max", "iPhone 13",
                "iPhone 13 Pro", "iPhone 12 Pro"
            ]),
            PresetField(standard: "TIFF", key: "Software", valueMode: .randomFromPool, valuePool: [
                "16.6", "16.7.1", "17.0", "17.1.1", "17.2", "17.3.1", "17.4"
            ]),
            PresetField(standard: "EXIF", key: "LensMake", valueMode: .static, staticValue: "Apple"),
            PresetField(standard: "EXIF", key: "LensModel", valueMode: .randomFromPool, valuePool: [
                "iPhone 14 Pro back triple camera 6.86mm f/1.78",
                "iPhone 15 Pro back triple camera 6.765mm f/1.78",
                "iPhone 15 Pro Max back triple camera 6.765mm f/1.78",
            ]),
            PresetField(standard: "EXIF", key: "FocalLength", valueMode: .randomFromPool, valuePool: [
                "6.86", "6.765", "2.22", "9.0"
            ]),
            PresetField(standard: "EXIF", key: "FNumber", valueMode: .randomFromPool, valuePool: [
                "1.78", "2.2", "2.8"
            ]),
            PresetField(standard: "EXIF", key: "ISOSpeedRatings", valueMode: .randomFromPool, valuePool: [
                "50", "64", "100", "125", "200", "400", "800"
            ]),
            PresetField(standard: "EXIF", key: "ExposureTime", valueMode: .randomFromPool, valuePool: [
                "0.001", "0.002", "0.004", "0.008", "0.017", "0.033"
            ]),
            PresetField(standard: "EXIF", key: "DateTimeOriginal", valueMode: .randomInRange),
            PresetField(standard: "EXIF", key: "ColorSpace", valueMode: .static, staticValue: "1"),
            // Remove suspicious fields
            PresetField(standard: "EXIF", key: "UserComment", valueMode: .remove),
            PresetField(standard: "EXIF", key: "MakerNote", valueMode: .remove),
            PresetField(standard: "XMP", key: "CreatorTool", valueMode: .remove),
        ],
        isBuiltIn: true
    )

    // MARK: - Generic DSLR Photo

    static let genericDSLR = MetadataPreset(
        name: "Generic DSLR Photo",
        description: "Replaces metadata with plausible DSLR camera data",
        category: .dslr,
        fields: [
            PresetField(standard: "TIFF", key: "Make", valueMode: .randomFromPool, valuePool: [
                "Canon", "Nikon", "Sony"
            ]),
            PresetField(standard: "TIFF", key: "Model", valueMode: .randomFromPool, valuePool: [
                "Canon EOS R5", "Canon EOS R6 Mark II", "Canon EOS 5D Mark IV",
                "NIKON D850", "NIKON Z6 III", "NIKON D780",
                "ILCE-7M4", "ILCE-7RM5", "ILCE-9M3"
            ]),
            PresetField(standard: "TIFF", key: "Software", valueMode: .randomFromPool, valuePool: [
                "Adobe Photoshop Lightroom Classic 13.1",
                "Adobe Photoshop 25.3",
                "Capture One 23",
                "DxO PhotoLab 7"
            ]),
            PresetField(standard: "EXIF", key: "FocalLength", valueMode: .randomFromPool, valuePool: [
                "24", "35", "50", "70", "85", "105", "135", "200"
            ]),
            PresetField(standard: "EXIF", key: "FNumber", valueMode: .randomFromPool, valuePool: [
                "1.4", "1.8", "2.0", "2.8", "4.0", "5.6", "8.0"
            ]),
            PresetField(standard: "EXIF", key: "ISOSpeedRatings", valueMode: .randomFromPool, valuePool: [
                "100", "200", "400", "800", "1600", "3200"
            ]),
            PresetField(standard: "EXIF", key: "ExposureTime", valueMode: .randomFromPool, valuePool: [
                "0.0005", "0.001", "0.002", "0.004", "0.008", "0.017", "0.033", "0.067"
            ]),
            PresetField(standard: "EXIF", key: "DateTimeOriginal", valueMode: .randomInRange),
            PresetField(standard: "EXIF", key: "UserComment", valueMode: .remove),
            PresetField(standard: "XMP", key: "CreatorTool", valueMode: .remove),
        ],
        isBuiltIn: true
    )

    // MARK: - Generic Mirrorless

    static let genericMirrorless = MetadataPreset(
        name: "Generic Mirrorless Photo",
        description: "Replaces metadata with plausible mirrorless camera data",
        category: .mirrorless,
        fields: [
            PresetField(standard: "TIFF", key: "Make", valueMode: .randomFromPool, valuePool: [
                "FUJIFILM", "Sony", "Panasonic", "OM Digital Solutions"
            ]),
            PresetField(standard: "TIFF", key: "Model", valueMode: .randomFromPool, valuePool: [
                "X-T5", "X-H2S", "X100VI",
                "ILCE-7CM2", "ILCE-6700", "ZV-E1",
                "DC-GH6", "DC-S5M2", "DC-G9M2",
                "OM-1 Mark II", "OM-5"
            ]),
            PresetField(standard: "EXIF", key: "FocalLength", valueMode: .randomFromPool, valuePool: [
                "23", "33", "35", "50", "56", "85", "90"
            ]),
            PresetField(standard: "EXIF", key: "FNumber", valueMode: .randomFromPool, valuePool: [
                "1.4", "2.0", "2.8", "4.0"
            ]),
            PresetField(standard: "EXIF", key: "ISOSpeedRatings", valueMode: .randomFromPool, valuePool: [
                "160", "200", "400", "800", "1600", "3200"
            ]),
            PresetField(standard: "EXIF", key: "DateTimeOriginal", valueMode: .randomInRange),
            PresetField(standard: "EXIF", key: "UserComment", valueMode: .remove),
            PresetField(standard: "XMP", key: "CreatorTool", valueMode: .remove),
        ],
        isBuiltIn: true
    )

    // MARK: - Privacy Strip

    static let privacyStrip = MetadataPreset(
        name: "Privacy Strip",
        description: "Removes GPS, device info, and personal data while keeping basic photo info",
        category: .privacy,
        fields: [
            PresetField(standard: "GPS", key: "GPSLatitude", valueMode: .remove),
            PresetField(standard: "GPS", key: "GPSLongitude", valueMode: .remove),
            PresetField(standard: "GPS", key: "GPSAltitude", valueMode: .remove),
            PresetField(standard: "GPS", key: "GPSLatitudeRef", valueMode: .remove),
            PresetField(standard: "GPS", key: "GPSLongitudeRef", valueMode: .remove),
            PresetField(standard: "TIFF", key: "Make", valueMode: .remove),
            PresetField(standard: "TIFF", key: "Model", valueMode: .remove),
            PresetField(standard: "EXIF", key: "LensMake", valueMode: .remove),
            PresetField(standard: "EXIF", key: "LensModel", valueMode: .remove),
            PresetField(standard: "EXIF", key: "SerialNumber", valueMode: .remove),
            PresetField(standard: "EXIF", key: "CameraOwnerName", valueMode: .remove),
            PresetField(standard: "EXIF", key: "UserComment", valueMode: .remove),
            PresetField(standard: "EXIF", key: "MakerNote", valueMode: .remove),
            PresetField(standard: "IPTC", key: "City", valueMode: .remove),
            PresetField(standard: "IPTC", key: "SubLocation", valueMode: .remove),
            PresetField(standard: "IPTC", key: "ProvinceState", valueMode: .remove),
            PresetField(standard: "IPTC", key: "CountryPrimaryLocationName", valueMode: .remove),
            PresetField(standard: "XMP", key: "CreatorTool", valueMode: .remove),
        ],
        isBuiltIn: true
    )
}
