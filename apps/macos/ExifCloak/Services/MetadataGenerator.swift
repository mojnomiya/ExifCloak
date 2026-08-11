import Foundation

/// Engine for auto-generating realistic metadata from word banks and templates.
/// Produces cohesive, plausible metadata profiles rather than random mismatches.
actor MetadataGenerator {

    private let presetManager: PresetManager

    init(presetManager: PresetManager) {
        self.presetManager = presetManager
    }

    // MARK: - Generate Full Metadata Profile

    /// Generate a complete, cohesive metadata profile based on a device type
    func generateProfile(for category: PresetCategory) -> [String: [String: String]] {
        switch category {
        case .phone:
            return generatePhoneProfile()
        case .dslr:
            return generateDSLRProfile()
        case .mirrorless:
            return generateMirrorlessProfile()
        case .privacy, .custom:
            return [:]
        }
    }

    // MARK: - Phone Profile

    private func generatePhoneProfile() -> [String: [String: String]] {
        let isIPhone = Bool.random()
        let profile: PhoneProfile

        if isIPhone {
            profile = generateiPhoneProfile()
        } else {
            profile = generateAndroidProfile()
        }

        let timestamp = generateRealisticTimestamp()

        let exif: [String: String] = [
            "DateTimeOriginal": timestamp,
            "DateTimeDigitized": timestamp,
            "FocalLength": profile.focalLength,
            "FocalLengthIn35mmFilm": profile.focalLength35mm,
            "FNumber": profile.fNumber,
            "ExposureTime": generateExposureTime(forISO: profile.iso),
            "ISOSpeedRatings": profile.iso,
            "ExposureProgram": "2", // Normal program
            "MeteringMode": "5", // Pattern
            "Flash": "16", // No flash
            "WhiteBalance": "0", // Auto
            "ColorSpace": "1", // sRGB
            "ExifVersion": "0232",
            "SceneCaptureType": "0", // Standard
            "LensMake": profile.lensMake,
            "LensModel": profile.lensModel,
        ]

        let tiff: [String: String] = [
            "Make": profile.make,
            "Model": profile.model,
            "Software": profile.software,
            "Orientation": "1", // Normal
            "XResolution": "72",
            "YResolution": "72",
            "ResolutionUnit": "2", // inches
        ]

        var result: [String: [String: String]] = [
            "EXIF": exif,
            "TIFF": tiff,
        ]

        // Optionally add GPS
        if Bool.random() {
            result["GPS"] = generateRandomGPS()
        }

        return result
    }

    private func generateiPhoneProfile() -> PhoneProfile {
        let models = [
            ("iPhone 15 Pro Max", "iPhone 15 Pro Max back triple camera 6.765mm f/1.78", "17.4.1"),
            ("iPhone 15 Pro", "iPhone 15 Pro back triple camera 6.765mm f/1.78", "17.3.1"),
            ("iPhone 15", "iPhone 15 back dual wide camera 6.86mm f/1.6", "17.2"),
            ("iPhone 14 Pro Max", "iPhone 14 Pro Max back triple camera 6.86mm f/1.78", "16.7.1"),
            ("iPhone 14 Pro", "iPhone 14 Pro back triple camera 6.86mm f/1.78", "16.6"),
            ("iPhone 14", "iPhone 14 back dual wide camera 5.7mm f/1.5", "17.1"),
            ("iPhone 13 Pro", "iPhone 13 Pro back triple camera 5.7mm f/1.5", "16.5"),
        ]

        let (model, lens, sw) = models.randomElement()!

        return PhoneProfile(
            make: "Apple",
            model: model,
            software: sw,
            lensMake: "Apple",
            lensModel: lens,
            focalLength: ["5.7", "6.765", "6.86", "2.22", "9.0"].randomElement()!,
            focalLength35mm: ["26", "24", "13", "77"].randomElement()!,
            fNumber: ["1.5", "1.6", "1.78", "2.2", "2.8"].randomElement()!,
            iso: ["32", "50", "64", "100", "125", "200", "400", "640"].randomElement()!
        )
    }

    private func generateAndroidProfile() -> PhoneProfile {
        let isPixel = Bool.random()

        if isPixel {
            let models = ["Pixel 8 Pro", "Pixel 8", "Pixel 7 Pro", "Pixel 7"]
            return PhoneProfile(
                make: "Google",
                model: models.randomElement()!,
                software: "HDR+ \(Int.random(in: 1...3)).\(Int.random(in: 0...9)).\(Int.random(in: 100000...999999))",
                lensMake: "Google",
                lensModel: "Pixel Rear Camera",
                focalLength: ["6.81", "2.35"].randomElement()!,
                focalLength35mm: ["25", "24", "13"].randomElement()!,
                fNumber: ["1.68", "1.85", "2.2"].randomElement()!,
                iso: ["52", "67", "100", "145", "200", "389"].randomElement()!
            )
        } else {
            let models = ["SM-S928B", "SM-S918B", "SM-S908B", "SM-S911B"]
            return PhoneProfile(
                make: "samsung",
                model: models.randomElement()!,
                software: "S928BXXS\(["1A", "2B", "3C", "4D"].randomElement()!)",
                lensMake: "Samsung",
                lensModel: "Samsung Galaxy Rear Camera",
                focalLength: ["6.3", "2.4", "13.0"].randomElement()!,
                focalLength35mm: ["23", "24", "13", "69"].randomElement()!,
                fNumber: ["1.7", "2.2", "2.4", "3.4"].randomElement()!,
                iso: ["50", "80", "100", "200", "320", "500"].randomElement()!
            )
        }
    }

    // MARK: - DSLR Profile

    private func generateDSLRProfile() -> [String: [String: String]] {
        let brand = ["Canon", "Nikon", "Sony"].randomElement()!
        let profile = generateDSLRForBrand(brand)
        let timestamp = generateRealisticTimestamp()

        let exif: [String: String] = [
            "DateTimeOriginal": timestamp,
            "DateTimeDigitized": timestamp,
            "FocalLength": profile.focalLength,
            "FocalLengthIn35mmFilm": profile.focalLength,
            "FNumber": profile.fNumber,
            "ExposureTime": generateExposureTime(forISO: profile.iso),
            "ISOSpeedRatings": profile.iso,
            "ExposureProgram": ["1", "2", "3", "4"].randomElement()!, // M/P/Av/Tv
            "MeteringMode": ["2", "3", "5"].randomElement()!, // CW/Spot/Pattern
            "Flash": ["0", "16"].randomElement()!, // Off or no flash
            "WhiteBalance": "0",
            "ColorSpace": "1",
            "ExifVersion": "0231",
            "LensMake": profile.lensMake,
            "LensModel": profile.lensModel,
            "MaxApertureValue": profile.maxAperture,
        ]

        let tiff: [String: String] = [
            "Make": profile.make,
            "Model": profile.model,
            "Software": profile.software,
            "Orientation": "1",
            "XResolution": "300",
            "YResolution": "300",
            "ResolutionUnit": "2",
        ]

        var result: [String: [String: String]] = [
            "EXIF": exif,
            "TIFF": tiff,
        ]

        if Bool.random() {
            result["GPS"] = generateRandomGPS()
        }

        return result
    }

    private func generateDSLRForBrand(_ brand: String) -> CameraProfile {
        switch brand {
        case "Canon":
            let models = ["Canon EOS R5", "Canon EOS R6 Mark II", "Canon EOS R8", "Canon EOS 5D Mark IV", "Canon EOS 90D"]
            let lenses = [
                ("Canon RF 24-70mm F2.8 L IS USM", "24-70mm", "2.8"),
                ("Canon RF 50mm F1.2 L USM", "50mm", "1.2"),
                ("Canon RF 85mm F1.2 L USM", "85mm", "1.2"),
                ("Canon EF 70-200mm f/2.8L IS III USM", "70-200mm", "2.8"),
                ("Canon RF 35mm F1.8 MACRO IS STM", "35mm", "1.8"),
            ]
            let (lens, _, maxAp) = lenses.randomElement()!
            return CameraProfile(
                make: "Canon",
                model: models.randomElement()!,
                software: ["Adobe Photoshop Lightroom Classic 13.1", "Digital Photo Professional 4.17", "Canon DPP 4.16"].randomElement()!,
                lensMake: "Canon",
                lensModel: lens,
                focalLength: ["24", "35", "50", "70", "85", "135", "200"].randomElement()!,
                fNumber: ["1.4", "1.8", "2.0", "2.8", "4.0", "5.6", "8.0"].randomElement()!,
                iso: ["100", "200", "400", "800", "1600", "3200"].randomElement()!,
                maxAperture: maxAp
            )
        case "Nikon":
            let models = ["NIKON Z8", "NIKON Z6 III", "NIKON Z5", "NIKON D850", "NIKON D780"]
            let lenses = [
                ("NIKKOR Z 24-70mm f/2.8 S", "24-70mm", "2.8"),
                ("NIKKOR Z 50mm f/1.2 S", "50mm", "1.2"),
                ("NIKKOR Z 85mm f/1.2 S", "85mm", "1.2"),
                ("AF-S NIKKOR 70-200mm f/2.8E FL ED VR", "70-200mm", "2.8"),
            ]
            let (lens, _, maxAp) = lenses.randomElement()!
            return CameraProfile(
                make: "NIKON CORPORATION",
                model: models.randomElement()!,
                software: ["NX Studio 1.5", "Adobe Photoshop Lightroom Classic 13.1", "Capture NX-D 1.6"].randomElement()!,
                lensMake: "NIKON",
                lensModel: lens,
                focalLength: ["24", "35", "50", "70", "85", "105", "200"].randomElement()!,
                fNumber: ["1.4", "1.8", "2.8", "4.0", "5.6", "8.0"].randomElement()!,
                iso: ["64", "100", "200", "400", "800", "1600", "3200"].randomElement()!,
                maxAperture: maxAp
            )
        default: // Sony
            let models = ["ILCE-7M4", "ILCE-7RM5", "ILCE-9M3", "ILCE-7CM2"]
            let lenses = [
                ("FE 24-70mm F2.8 GM II", "24-70mm", "2.8"),
                ("FE 50mm F1.2 GM", "50mm", "1.2"),
                ("FE 85mm F1.4 GM", "85mm", "1.4"),
                ("FE 70-200mm F2.8 GM OSS II", "70-200mm", "2.8"),
            ]
            let (lens, _, maxAp) = lenses.randomElement()!
            return CameraProfile(
                make: "SONY",
                model: models.randomElement()!,
                software: ["Adobe Photoshop Lightroom Classic 13.1", "Capture One 23", "Imaging Edge Desktop 3.8"].randomElement()!,
                lensMake: "Sony",
                lensModel: lens,
                focalLength: ["24", "35", "50", "85", "135", "200"].randomElement()!,
                fNumber: ["1.4", "1.8", "2.0", "2.8", "4.0", "5.6"].randomElement()!,
                iso: ["100", "200", "400", "800", "1600", "3200", "6400"].randomElement()!,
                maxAperture: maxAp
            )
        }
    }

    // MARK: - Mirrorless Profile

    private func generateMirrorlessProfile() -> [String: [String: String]] {
        let brand = ["FUJIFILM", "Sony", "Panasonic", "OM Digital Solutions"].randomElement()!
        let timestamp = generateRealisticTimestamp()

        let model: String
        let lensModel: String
        let software: String

        switch brand {
        case "FUJIFILM":
            model = ["X-T5", "X-H2S", "X-H2", "X100VI", "X-S20"].randomElement()!
            lensModel = ["XF23mmF1.4 R LM WR", "XF56mmF1.2 R WR", "XF33mmF1.4 R LM WR", "XF16-55mmF2.8 R LM WR"].randomElement()!
            software = ["Adobe Photoshop Lightroom Classic 13.1", "Capture One 23", "FUJIFILM X RAW STUDIO"].randomElement()!
        case "Panasonic":
            model = ["DC-GH6", "DC-S5M2", "DC-G9M2", "DC-S1R"].randomElement()!
            lensModel = ["LUMIX S 50mm F1.8", "LUMIX S 24-70mm F2.8", "LEICA DG 25mm F1.4 II"].randomElement()!
            software = ["Adobe Photoshop Lightroom Classic 13.1", "SILKYPIX Developer Studio 11"].randomElement()!
        case "OM Digital Solutions":
            model = ["OM-1 Mark II", "OM-5", "E-M1 Mark III"].randomElement()!
            lensModel = ["M.Zuiko Digital ED 25mm F1.2 PRO", "M.Zuiko Digital ED 45mm F1.2 PRO", "M.Zuiko Digital ED 12-40mm F2.8 PRO II"].randomElement()!
            software = ["OM Workspace 2.3", "Adobe Photoshop Lightroom Classic 13.1"].randomElement()!
        default: // Sony mirrorless
            model = ["ILCE-6700", "ZV-E1", "ILCE-7CM2"].randomElement()!
            lensModel = ["E 35mm F1.8 OSS", "FE 50mm F2.5 G", "E 18-135mm F3.5-5.6 OSS"].randomElement()!
            software = ["Adobe Photoshop Lightroom Classic 13.1", "Imaging Edge Desktop 3.8"].randomElement()!
        }

        let exif: [String: String] = [
            "DateTimeOriginal": timestamp,
            "DateTimeDigitized": timestamp,
            "FocalLength": ["23", "25", "33", "35", "50", "56", "85"].randomElement()!,
            "FNumber": ["1.2", "1.4", "1.8", "2.0", "2.8", "4.0"].randomElement()!,
            "ExposureTime": generateExposureTime(forISO: "400"),
            "ISOSpeedRatings": ["160", "200", "400", "800", "1600", "3200"].randomElement()!,
            "ExposureProgram": ["1", "2", "3", "4"].randomElement()!,
            "MeteringMode": ["2", "5"].randomElement()!,
            "Flash": "16",
            "WhiteBalance": "0",
            "ColorSpace": "1",
            "LensMake": brand,
            "LensModel": lensModel,
        ]

        let tiff: [String: String] = [
            "Make": brand,
            "Model": model,
            "Software": software,
            "Orientation": "1",
            "XResolution": "300",
            "YResolution": "300",
            "ResolutionUnit": "2",
        ]

        return ["EXIF": exif, "TIFF": tiff]
    }

    // MARK: - GPS Generation

    /// Generate random but plausible GPS coordinates within a city
    func generateRandomGPS(near city: String? = nil) -> [String: String] {
        let location = generateCityCoordinates(city)

        // Add jitter (±0.01 degrees ≈ ±1.1 km)
        let latJitter = Double.random(in: -0.01...0.01)
        let lonJitter = Double.random(in: -0.01...0.01)

        let lat = location.latitude + latJitter
        let lon = location.longitude + lonJitter

        return [
            "GPSLatitude": String(format: "%.6f", abs(lat)),
            "GPSLatitudeRef": lat >= 0 ? "N" : "S",
            "GPSLongitude": String(format: "%.6f", abs(lon)),
            "GPSLongitudeRef": lon >= 0 ? "E" : "W",
            "GPSAltitude": String(format: "%.1f", Double.random(in: 0...200)),
            "GPSAltitudeRef": "0",
            "GPSTimeStamp": generateGPSTimestamp(),
            "GPSDateStamp": generateGPSDate(),
        ]
    }

    private func generateCityCoordinates(_ city: String?) -> (latitude: Double, longitude: Double) {
        let cities: [(String, Double, Double)] = [
            ("New York", 40.7128, -74.0060),
            ("Los Angeles", 34.0522, -118.2437),
            ("London", 51.5074, -0.1278),
            ("Tokyo", 35.6762, 139.6503),
            ("Paris", 48.8566, 2.3522),
            ("Berlin", 52.5200, 13.4050),
            ("Sydney", -33.8688, 151.2093),
            ("Toronto", 43.6532, -79.3832),
            ("Singapore", 1.3521, 103.8198),
            ("Dubai", 25.2048, 55.2708),
            ("San Francisco", 37.7749, -122.4194),
            ("Dhaka", 23.8103, 90.4125),
            ("Mumbai", 19.0760, 72.8777),
            ("Seoul", 37.5665, 126.9780),
            ("Bangkok", 13.7563, 100.5018),
        ]

        if let cityName = city,
           let match = cities.first(where: { $0.0.lowercased() == cityName.lowercased() }) {
            return (match.1, match.2)
        }

        let random = cities.randomElement()!
        return (random.1, random.2)
    }

    // MARK: - Timestamp Generation

    /// Generate a realistic timestamp within the last 12 months
    func generateRealisticTimestamp() -> String {
        let now = Date()
        let calendar = Calendar.current

        // Random date within last 12 months
        let daysBack = Int.random(in: 1...365)
        guard let randomDate = calendar.date(byAdding: .day, value: -daysBack, to: now) else {
            return formatEXIFDate(now)
        }

        // Bias toward daylight hours (more realistic for photos)
        let hour: Int
        if Bool.random() { // 70% chance daylight
            hour = Int.random(in: 7...19)
        } else {
            hour = Int.random(in: 0...23)
        }

        let minute = Int.random(in: 0...59)
        let second = Int.random(in: 0...59)

        var components = calendar.dateComponents([.year, .month, .day], from: randomDate)
        components.hour = hour
        components.minute = minute
        components.second = second

        let finalDate = calendar.date(from: components) ?? randomDate
        return formatEXIFDate(finalDate)
    }

    private func formatEXIFDate(_ date: Date) -> String {
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy:MM:dd HH:mm:ss"
        return formatter.string(from: date)
    }

    private func generateGPSTimestamp() -> String {
        let hour = Int.random(in: 0...23)
        let minute = Int.random(in: 0...59)
        let second = Int.random(in: 0...59)
        return "\(hour)/1 \(minute)/1 \(second)/1"
    }

    private func generateGPSDate() -> String {
        let now = Date()
        let daysBack = Int.random(in: 1...365)
        let date = Calendar.current.date(byAdding: .day, value: -daysBack, to: now) ?? now
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy:MM:dd"
        return formatter.string(from: date)
    }

    // MARK: - Helpers

    private func generateExposureTime(forISO iso: String) -> String {
        // Higher ISO → shorter exposure (generally)
        let isoValue = Int(iso) ?? 100
        let exposures: [String]

        if isoValue <= 100 {
            exposures = ["0.004", "0.008", "0.017", "0.033", "0.067"]
        } else if isoValue <= 400 {
            exposures = ["0.001", "0.002", "0.004", "0.008", "0.017"]
        } else {
            exposures = ["0.0005", "0.001", "0.002", "0.004"]
        }

        return exposures.randomElement()!
    }
}

// MARK: - Profile Types

private struct PhoneProfile {
    let make: String
    let model: String
    let software: String
    let lensMake: String
    let lensModel: String
    let focalLength: String
    let focalLength35mm: String
    let fNumber: String
    let iso: String
}

private struct CameraProfile {
    let make: String
    let model: String
    let software: String
    let lensMake: String
    let lensModel: String
    let focalLength: String
    let fNumber: String
    let iso: String
    let maxAperture: String
}
