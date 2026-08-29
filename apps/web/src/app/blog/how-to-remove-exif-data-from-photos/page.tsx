import type { Metadata } from "next";
import { DiagramStrip } from "@/components/blog-diagrams";

export const metadata: Metadata = {
  title: "How to Remove EXIF Data from Photos (Mac, Windows, Online) — 2026 Guide",
  description: "Step-by-step guide to removing EXIF metadata from photos on every platform. Strip GPS, camera info, timestamps, and AI markers. Free tools included.",
  alternates: { canonical: "https://exifcloak.netlify.app/blog/how-to-remove-exif-data-from-photos" },
};

export default function Post() {
  return (
    <article className="max-w-[680px] mx-auto px-6 py-24">
      <header className="mb-10">
        <p className="text-[12px] text-[var(--text-tertiary)] mb-2">August 10, 2026 · 8 min read</p>
        <h1 className="text-[28px] font-bold leading-[1.2]">How to Remove EXIF Data from Photos (Mac, Windows, Online)</h1>
        <p className="mt-4 text-[16px] text-[var(--text-secondary)] leading-[1.7]">
          Every photo you take carries hidden metadata — GPS coordinates, device info, timestamps, and software signatures. This guide covers how to remove it completely on every platform.
        </p>
        <div className="mt-6 flex justify-center p-6 rounded-xl bg-[var(--bg-raised)] border border-[var(--border)]">
          <DiagramStrip />
        </div>
      </header>

      <div className="prose-custom space-y-6 text-[15px] text-[var(--text-secondary)] leading-[1.8]">
        <h2 className="text-[20px] font-semibold text-[var(--text)] pt-2">What is EXIF data?</h2>
        <p>
          EXIF (Exchangeable Image File Format) is metadata automatically embedded in photos by cameras and phones. It includes camera make and model, lens, aperture, shutter speed, ISO, focal length, GPS coordinates, date/time, and software used for editing. Most people never see this data, but anyone with the right tool can extract it from your shared photos.
        </p>

        <h2 className="text-[20px] font-semibold text-[var(--text)] pt-2">Why remove EXIF data?</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Privacy</strong> — GPS coordinates reveal where you live, work, and travel</li>
          <li><strong>Security</strong> — device serial numbers and software versions can be used for fingerprinting</li>
          <li><strong>AI labeling</strong> — C2PA Content Credentials mark images as AI-generated, triggering platform labels</li>
          <li><strong>File size</strong> — metadata can add 10-50KB to each file</li>
        </ul>

        <h2 className="text-[20px] font-semibold text-[var(--text)] pt-2">Remove EXIF data on Mac</h2>
        <h3 className="text-[16px] font-semibold text-[var(--text)]">Method 1: ExifCloak (recommended)</h3>
        <p>
          ExifCloak is a free, native macOS app that strips all metadata with one click. Download from <a href="https://github.com/mojnomiya/ExifCloak/releases" className="underline">GitHub Releases</a>, drag your images in, and click &ldquo;Strip All.&rdquo; Supports JPEG, PNG, HEIC, TIFF, and WebP. Batch processes entire folders.
        </p>
        <h3 className="text-[16px] font-semibold text-[var(--text)]">Method 2: Preview app</h3>
        <p>
          Open the image in Preview, go to File → Export, uncheck &ldquo;Include metadata.&rdquo; This works but only handles one file at a time and doesn&apos;t remove all fields reliably.
        </p>
        <h3 className="text-[16px] font-semibold text-[var(--text)]">Method 3: ExifTool (command line)</h3>
        <p>
          Install via Homebrew: <code className="bg-[var(--bg-raised)] px-1.5 py-0.5 rounded text-[13px]">brew install exiftool</code>. Then run <code className="bg-[var(--bg-raised)] px-1.5 py-0.5 rounded text-[13px]">exiftool -all= photo.jpg</code> to strip everything. Powerful but requires terminal comfort.
        </p>

        <h2 className="text-[20px] font-semibold text-[var(--text)] pt-2">Remove EXIF data on Windows</h2>
        <p>
          Right-click the image → Properties → Details tab → &ldquo;Remove Properties and Personal Information.&rdquo; This removes basic EXIF but misses XMP, IPTC, and C2PA data. For thorough removal, use ExifCleaner (Electron app) or ExifTool.
        </p>

        <h2 className="text-[20px] font-semibold text-[var(--text)] pt-2">Remove EXIF data online (no install)</h2>
        <p>
          Use the <a href="/tool" className="underline">ExifCloak Web Tool</a> — it processes images entirely in your browser. No uploads, no server processing. Drop your files, click Strip All, download clean copies.
        </p>

        <h2 className="text-[20px] font-semibold text-[var(--text)] pt-2">How to verify metadata was removed</h2>
        <p>
          After stripping, re-import the file into ExifCloak (or any EXIF viewer). If it shows zero fields or only basic file system info (size, type), the strip was successful. Common mistake: some tools only remove EXIF but leave IPTC and XMP intact — always verify with a tool that reads all standards.
        </p>

        <h2 className="text-[20px] font-semibold text-[var(--text)] pt-2">Batch removal for multiple photos</h2>
        <p>
          For large collections (100+ files), use ExifCloak&apos;s batch mode: drop an entire folder, click Batch → Strip All Metadata. The desktop app processes 100 typical JPEGs in under 2 seconds on Apple Silicon. The web tool handles batch via multiple file selection.
        </p>

        <div className="border border-[var(--border)] rounded-lg p-5 bg-[var(--bg-raised)] mt-8">
          <p className="text-[14px] font-medium text-[var(--text)] mb-2">TL;DR</p>
          <ul className="list-disc pl-5 space-y-1 text-[13px]">
            <li>Mac: <a href="https://github.com/mojnomiya/ExifCloak/releases" className="underline">ExifCloak desktop app</a> (free, batch, one-click)</li>
            <li>Any OS: <a href="/tool" className="underline">ExifCloak Web Tool</a> (browser-based, no upload)</li>
            <li>CLI: <code className="bg-[var(--bg-hover)] px-1 rounded text-[12px]">exiftool -all= *.jpg</code></li>
            <li>Always verify after stripping — some tools miss XMP/IPTC/C2PA</li>
          </ul>
        </div>
      </div>
    </article>
  );
}
