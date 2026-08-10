import Foundation

/// Default built-in word/phrase banks for metadata generation
enum BuiltInWordBanks {
    static let all: [WordBank] = [
        cameraMakes,
        phoneModels,
        dslrModels,
        cities,
        software,
    ]

    static let cameraMakes = WordBank(
        name: "Camera Makes",
        category: "Hardware",
        values: [
            "Canon", "Nikon", "Sony", "FUJIFILM", "Panasonic",
            "OM Digital Solutions", "Leica", "Hasselblad",
            "Ricoh", "Pentax", "Samsung", "Apple", "Google"
        ],
        isBuiltIn: true
    )

    static let phoneModels = WordBank(
        name: "Phone Models",
        category: "Hardware",
        values: [
            "iPhone 15 Pro Max", "iPhone 15 Pro", "iPhone 15",
            "iPhone 14 Pro Max", "iPhone 14 Pro", "iPhone 14",
            "iPhone 13 Pro", "iPhone 13",
            "Pixel 8 Pro", "Pixel 8", "Pixel 7 Pro",
            "Samsung Galaxy S24 Ultra", "Samsung Galaxy S24+",
            "Samsung Galaxy S23 Ultra", "Samsung Galaxy S23",
        ],
        isBuiltIn: true
    )

    static let dslrModels = WordBank(
        name: "DSLR/Mirrorless Models",
        category: "Hardware",
        values: [
            "Canon EOS R5", "Canon EOS R6 Mark II", "Canon EOS R8",
            "Canon EOS 5D Mark IV", "Canon EOS 90D",
            "NIKON Z8", "NIKON Z6 III", "NIKON Z5", "NIKON D850",
            "ILCE-7M4", "ILCE-7RM5", "ILCE-7CM2", "ILCE-9M3",
            "X-T5", "X-H2S", "X-H2", "X100VI",
            "DC-GH6", "DC-S5M2", "DC-G9M2",
            "OM-1 Mark II", "OM-5",
            "LEICA Q3", "LEICA M11",
        ],
        isBuiltIn: true
    )

    static let cities = WordBank(
        name: "Common Cities",
        category: "Location",
        values: [
            "New York", "Los Angeles", "London", "Tokyo", "Paris",
            "Berlin", "Sydney", "Toronto", "Singapore", "Dubai",
            "San Francisco", "Chicago", "Barcelona", "Amsterdam",
            "Seoul", "Bangkok", "Mumbai", "Istanbul", "Rome",
            "Melbourne", "Stockholm", "Lisbon", "Vienna", "Prague",
            "Dhaka", "Chittagong", "Sylhet", "Rajshahi", "Khulna"
        ],
        isBuiltIn: true
    )

    static let software = WordBank(
        name: "Photo Software",
        category: "Software",
        values: [
            "Adobe Photoshop Lightroom Classic 13.1",
            "Adobe Photoshop 25.3",
            "Adobe Photoshop Lightroom 7.1",
            "Capture One 23 (16.3.4)",
            "DxO PhotoLab 7.3",
            "Darktable 4.6.0",
            "Affinity Photo 2.3",
            "Luminar Neo 1.16",
            "ON1 Photo RAW 2024",
            "GIMP 2.10.36",
            "Pixelmator Pro 3.5",
            "Photos 9.0",
        ],
        isBuiltIn: true
    )
}
