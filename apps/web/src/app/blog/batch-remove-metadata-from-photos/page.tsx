import type { Metadata } from "next";
import { DiagramBatch } from "@/components/blog-diagrams";

export const metadata: Metadata = {
  title: "How to Batch Remove Metadata from Hundreds of Photos",
  description: "Strip EXIF, GPS, and AI markers from entire folders at once. Best tools for batch metadata removal in 2026.",
  alternates: { canonical: "https://exifcloak.netlify.app/blog/batch-remove-metadata-from-photos" },
};

export default function Post() {
  return (
    <article className="max-w-[680px] mx-auto px-6 py-24">
      <header className="mb-10">
        <p className="text-[12px] text-[var(--text-tertiary)] mb-2">August 11, 2026 · 5 min read</p>
        <h1 className="text-[28px] font-bold leading-[1.2]">
          How to Batch Remove Metadata from Hundreds of Photos
        </h1>
        <div className="mt-6 flex justify-center p-6 rounded-xl bg-[var(--bg-raised)] border border-[var(--border)]">
          <DiagramBatch />
        </div>
      </header>
      <div className="space-y-6 text-[15px] text-[var(--text-secondary)] leading-[1.8]">
        <p>Removing metadata one photo at a time isn&apos;t practical when you have hundreds or thousands of images. Here are the fastest methods for batch processing.</p>

        <h2 className="text-[20px] font-semibold text-[var(--text)]">ExifCloak (Mac — fastest)</h2>
        <p>Drop an entire folder into ExifCloak. Click Batch → Strip All Metadata. Every file is processed in-place — no export step. 100 typical JPEGs finish in under 2 seconds on Apple Silicon.</p>

        <h2 className="text-[20px] font-semibold text-[var(--text)]">ExifCloak Web Tool (any OS)</h2>
        <p>Select multiple files with the file picker or drag a batch. Click Strip All. Download each cleaned file. Processing happens in your browser — no server involved. Best for smaller batches (10-50 files).</p>

        <h2 className="text-[20px] font-semibold text-[var(--text)]">ExifTool (CLI — most powerful)</h2>
        <p><code className="bg-[var(--bg-raised)] px-1.5 py-0.5 rounded text-[13px]">exiftool -all= /path/to/folder/</code> strips every file in a directory recursively. Add <code className="bg-[var(--bg-raised)] px-1.5 py-0.5 rounded text-[13px]">-r</code> for subdirectories. Extremely fast but no undo.</p>

        <h2 className="text-[20px] font-semibold text-[var(--text)]">Windows (built-in)</h2>
        <p>Select all files → Right-click → Properties → Details → &ldquo;Remove Properties and Personal Information.&rdquo; Works but misses XMP, IPTC, and C2PA data. Not suitable for thorough cleaning.</p>

        <h2 className="text-[20px] font-semibold text-[var(--text)]">Tips for batch processing</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Always verify</strong> — spot-check a few files after stripping to confirm metadata is gone</li>
          <li><strong>Keep originals</strong> — copy the folder before batch stripping if you might need the metadata later</li>
          <li><strong>Check all standards</strong> — some tools only strip EXIF but leave IPTC/XMP/C2PA intact</li>
          <li><strong>Don&apos;t re-encode PNGs</strong> — some tools re-encode which increases file size. ExifCloak&apos;s desktop app surgically removes metadata without re-encoding</li>
        </ul>

        <div className="border border-[var(--border)] rounded-lg p-5 bg-[var(--bg-raised)] mt-8">
          <p className="text-[14px] font-medium text-[var(--text)] mb-2">Recommended approach</p>
          <p className="text-[13px]">For Mac users: <a href="https://github.com/mojnomiya/ExifCloak/releases" className="underline">ExifCloak desktop</a> (batch, one-click, 2s/100 files). For everyone else: <a href="/tool" className="underline">ExifCloak Web Tool</a> (browser-based, no install).</p>
        </div>
      </div>
    </article>
  );
}
