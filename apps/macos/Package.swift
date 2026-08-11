// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "ExifCloak",
    platforms: [
        .macOS(.v14)
    ],
    products: [
        .executable(name: "ExifCloak", targets: ["ExifCloak"])
    ],
    targets: [
        .executableTarget(
            name: "ExifCloak",
            path: "ExifCloak",
            exclude: [
                "Info.plist",
                "ExifCloak.entitlements",
                "Resources/Assets.xcassets"
            ]
        )
    ]
)
