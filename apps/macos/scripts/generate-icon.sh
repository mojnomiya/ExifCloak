#!/bin/zsh
# Generate ExifCloak app icon as .icns
# Creates a purple/indigo gradient rounded-rect icon with "EC" text
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
ICON_DIR="$PROJECT_DIR/ExifCloak/Resources"
ICONSET_DIR="/tmp/ExifCloak.iconset"

mkdir -p "$ICONSET_DIR"
mkdir -p "$ICON_DIR"

# Generate icon using Python (available on all macOS)
python3 << 'PYTHON'
import subprocess, os, sys

iconset_dir = "/tmp/ExifCloak.iconset"
sizes = [16, 32, 64, 128, 256, 512, 1024]

for size in sizes:
    # Create SVG for each size
    svg = f'''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="{size}" height="{size}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#6366f1"/>
      <stop offset="100%" style="stop-color:#4f46e5"/>
    </linearGradient>
  </defs>
  <rect width="1024" height="1024" rx="220" fill="url(#bg)"/>
  <text x="512" y="580" font-family="-apple-system, SF Pro Display, Helvetica" font-size="420" font-weight="700" fill="white" text-anchor="middle" dominant-baseline="middle">EC</text>
  <rect x="140" y="700" width="744" height="6" rx="3" fill="white" opacity="0.3"/>
</svg>'''

    svg_path = f"/tmp/icon_{size}.svg"
    with open(svg_path, "w") as f:
        f.write(svg)

    # Convert SVG to PNG using sips via a temporary approach
    # Actually use the built-in qlmanage or just write PNGs directly

# Use a simpler approach: generate PNGs with sips from a base image
# First create the largest size, then scale down

base_svg = '''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#6366f1"/>
      <stop offset="100%" style="stop-color:#4f46e5"/>
    </linearGradient>
  </defs>
  <rect width="1024" height="1024" rx="220" fill="url(#bg)"/>
  <text x="512" y="560" font-family="SF Pro Display, -apple-system, Helvetica Neue" font-size="400" font-weight="bold" fill="white" text-anchor="middle">EC</text>
  <rect x="180" y="700" width="664" height="8" rx="4" fill="white" opacity="0.25"/>
</svg>'''

with open("/tmp/icon_base.svg", "w") as f:
    f.write(base_svg)

print("SVG created. Converting...")
PYTHON

# Convert SVG to PNG using the built-in macOS tool
# First try rsvg-convert, fallback to qlmanage
if command -v rsvg-convert &>/dev/null; then
    for size in 16 32 128 256 512; do
        rsvg-convert -w $size -h $size /tmp/icon_base.svg -o "$ICONSET_DIR/icon_${size}x${size}.png"
        rsvg-convert -w $((size*2)) -h $((size*2)) /tmp/icon_base.svg -o "$ICONSET_DIR/icon_${size}x${size}@2x.png"
    done
else
    # Fallback: use sips to create a solid-color icon
    # Create a 1024x1024 base PNG with sips
    echo "rsvg-convert not found. Creating simple icon with sips..."

    # Create a simple colored PNG using Python + CoreGraphics
    python3 << 'PYICON'
import objc
from Quartz import *
from Foundation import *

def create_icon(size, path):
    cs = CGColorSpaceCreateDeviceRGB()
    ctx = CGBitmapContextCreate(None, size, size, 8, size * 4, cs, kCGImageAlphaPremultipliedLast)

    # Background: rounded rect with gradient
    # Simple solid indigo background
    CGContextSetRGBFillColor(ctx, 99/255, 102/255, 241/255, 1.0)

    # Draw rounded rect
    radius = size * 0.215
    rect = CGRectMake(0, 0, size, size)
    path_ref = CGPathCreateMutable()
    CGPathAddRoundedRect(path_ref, None, rect, radius, radius)
    CGContextAddPath(ctx, path_ref)
    CGContextFillPath(ctx)

    # Draw "EC" text
    CGContextSetRGBFillColor(ctx, 1, 1, 1, 1.0)
    font_size = size * 0.4
    font = CTFontCreateWithName("SF Pro Display Bold", font_size, None)
    if not font:
        font = CTFontCreateWithName("Helvetica Bold", font_size, None)

    attrs = {
        str(kCTFontAttributeName): font,
        str(kCTForegroundColorFromContextAttributeName): True,
    }
    attr_string = NSAttributedString.alloc().initWithString_attributes_("EC", attrs)
    line = CTLineCreateWithAttributedString(attr_string)

    # Center the text
    bounds = CTLineGetBoundsWithOptions(line, 0)
    x = (size - bounds.size.width) / 2 - bounds.origin.x
    y = (size - bounds.size.height) / 2 - bounds.origin.y - (size * 0.05)

    CGContextSetTextPosition(ctx, x, y)
    CTLineDraw(line, ctx)

    # Save
    image = CGBitmapContextCreateImage(ctx)
    url = NSURL.fileURLWithPath_(path)
    dest = CGImageDestinationCreateWithURL(url, "public.png", 1, None)
    CGImageDestinationAddImage(dest, image, None)
    CGImageDestinationFinalize(dest)

iconset = "/tmp/ExifCloak.iconset"
sizes = [(16,1), (16,2), (32,1), (32,2), (128,1), (128,2), (256,1), (256,2), (512,1), (512,2)]

for base_size, scale in sizes:
    actual = base_size * scale
    suffix = f"@2x" if scale == 2 else ""
    filename = f"{iconset}/icon_{base_size}x{base_size}{suffix}.png"
    create_icon(actual, filename)
    print(f"  Created {base_size}x{base_size}{suffix} ({actual}px)")

print("Icon PNGs generated.")
PYICON
fi

# Convert iconset to icns
echo "Creating .icns..."
iconutil -c icns "$ICONSET_DIR" -o "$ICON_DIR/AppIcon.icns"

echo "Done: $ICON_DIR/AppIcon.icns"
ls -la "$ICON_DIR/AppIcon.icns"

# Cleanup
rm -rf "$ICONSET_DIR" /tmp/icon_base.svg /tmp/icon_*.svg
