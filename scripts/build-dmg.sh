#!/bin/zsh
# Build ExifCloak as a .app bundle and package it into a DMG
set -e

APP_NAME="ExifCloak"
BUNDLE_ID="com.exifcloak.app"
VERSION="1.0.0"

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
BUILD_DIR="$PROJECT_DIR/.build/app"
APP_DIR="$BUILD_DIR/$APP_NAME.app"
DMG_DIR="$PROJECT_DIR/.build/dmg"
DMG_PATH="$PROJECT_DIR/.build/$APP_NAME-$VERSION.dmg"

echo "=== Building $APP_NAME v$VERSION ==="

# Step 1: Build the executable
echo "[1/4] Compiling..."
cd "$PROJECT_DIR"
swift build -c release 2>&1 | tail -3

EXECUTABLE="$PROJECT_DIR/.build/release/$APP_NAME"
if [ ! -f "$EXECUTABLE" ]; then
    echo "Error: Build failed. Executable not found at $EXECUTABLE"
    exit 1
fi

# Step 2: Create .app bundle structure
echo "[2/4] Creating .app bundle..."
rm -rf "$APP_DIR"
mkdir -p "$APP_DIR/Contents/MacOS"
mkdir -p "$APP_DIR/Contents/Resources"

# Copy executable
cp "$EXECUTABLE" "$APP_DIR/Contents/MacOS/$APP_NAME"

# Create Info.plist
cat > "$APP_DIR/Contents/Info.plist" << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleName</key>
    <string>$APP_NAME</string>
    <key>CFBundleDisplayName</key>
    <string>$APP_NAME</string>
    <key>CFBundleIdentifier</key>
    <string>$BUNDLE_ID</string>
    <key>CFBundleVersion</key>
    <string>$VERSION</string>
    <key>CFBundleShortVersionString</key>
    <string>$VERSION</string>
    <key>CFBundlePackageType</key>
    <string>APPL</string>
    <key>CFBundleExecutable</key>
    <string>$APP_NAME</string>
    <key>LSMinimumSystemVersion</key>
    <string>14.0</string>
    <key>LSApplicationCategoryType</key>
    <string>public.app-category.photography</string>
    <key>NSHighResolutionCapable</key>
    <true/>
    <key>NSHumanReadableCopyright</key>
    <string>Copyright © 2026 ExifCloak. All rights reserved.</string>
    <key>CFBundleDocumentTypes</key>
    <array>
        <dict>
            <key>CFBundleTypeName</key>
            <string>Image</string>
            <key>CFBundleTypeRole</key>
            <string>Editor</string>
            <key>LSHandlerRank</key>
            <string>Alternate</string>
            <key>LSItemContentTypes</key>
            <array>
                <string>public.jpeg</string>
                <string>public.png</string>
                <string>public.heic</string>
                <string>public.tiff</string>
                <string>org.webmproject.webp</string>
            </array>
        </dict>
    </array>
</dict>
</plist>
EOF

# Create PkgInfo
echo -n "APPL????" > "$APP_DIR/Contents/PkgInfo"

# Step 3: Create DMG
echo "[3/4] Creating DMG..."
rm -rf "$DMG_DIR"
mkdir -p "$DMG_DIR"
cp -R "$APP_DIR" "$DMG_DIR/"

# Add a symlink to /Applications for drag-install
ln -s /Applications "$DMG_DIR/Applications"

rm -f "$DMG_PATH"
hdiutil create -volname "$APP_NAME" \
    -srcfolder "$DMG_DIR" \
    -ov -format UDZO \
    "$DMG_PATH" 2>&1 | tail -2

# Step 4: Done
echo "[4/4] Complete!"
echo ""
echo "  .app: $APP_DIR"
echo "  .dmg: $DMG_PATH"
echo "  Size: $(du -h "$DMG_PATH" | cut -f1)"
echo ""
echo "To notarize: xcrun notarytool submit \"$DMG_PATH\" --apple-id YOUR_ID --team-id YOUR_TEAM --password YOUR_APP_SPECIFIC_PASSWORD"
