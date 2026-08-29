import type { Metadata } from "next";
import { DiagramEXIF } from "@/components/blog-diagrams";

export const metadata: Metadata = {
  title: "What Is EXIF Data? A Complete Guide for 2026",
  description: "EXIF data explained: what it contains, how cameras embed it, privacy risks, and how to view or remove it from photos.",
  alternates: { canonical: "https://exifcloak.netlify.app/blog/what-is-exif-data" },
};

export default function Post() {
  return (
    <article className="max-w-[680px] mx-auto px-6 py-24">
      <header className="mb-10">
        <p className="text-[12px] text-[var(--text-tertiary)] mb-2">August 11, 2026 · 7 min read</p>
        <h1 className="text-[28px] font-bold leading-[1.2]">What Is EXIF Data? A Complete Guide</h1>
        <div className="mt-6 flex justify-center p-6 rounded-xl bg-[var(--bg-raised)] border border-[var(--border)]">
          <DiagramEXIF />
        </div>
      </header>
      <div className="space-y-6 text-[15px] text-[var(--text-secondary)] leading-[1.8]">
        <p>EXIF stands for Exchangeable Image File Format. It&apos;s a metadata standard that cameras and phones write into image files at the moment of capture. Think of it as an invisible label attached to every photo.</p>

        <h2 className="text-[20px] font-semibold text-[var(--text)]">What EXIF contains</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Camera info</strong> — make, model, serial number</li>
          <li><strong>Lens</strong> — focal length, aperture, model name</li>
          <li><strong>Settings</strong> — ISO, shutter speed, white balance, metering mode</li>
          <li><strong>GPS</strong> — latitude, longitude, altitude, direction</li>
          <li><strong>Timestamps</strong> — date/time original, date digitized</li>
          <li><strong>Software</strong> — editing tools used (Photoshop, Lightroom, DALL·E)</li>
          <li><strong>Thumbnail</strong> — small preview image (sometimes of the uncropped original)</li>
        </ul>

        <h2 className="text-[20px] font-semibold text-[var(--text)]">Why EXIF matters for privacy</h2>
        <p>When you share a photo via email, messaging apps, or file-sharing sites, the EXIF data travels with it. Anyone who downloads your image can extract your GPS coordinates (home address, workplace), identify your exact device, and see when the photo was taken.</p>

        <h2 className="text-[20px] font-semibold text-[var(--text)]">EXIF vs IPTC vs XMP</h2>
        <p><strong>EXIF</strong> is camera-generated technical data. <strong>IPTC</strong> is editorial metadata (captions, keywords, copyright) used in publishing. <strong>XMP</strong> is Adobe&apos;s extensible format that can store any key-value data. Most images carry all three.</p>

        <h2 className="text-[20px] font-semibold text-[var(--text)]">How to view EXIF data</h2>
        <p>Use the <a href="/tool" className="underline">ExifCloak Web Tool</a> — drop any image and see all metadata fields grouped by standard. On Mac, right-click → Get Info shows basic data. For full inspection, use ExifCloak or ExifTool.</p>

        <h2 className="text-[20px] font-semibold text-[var(--text)]">How to remove EXIF data</h2>
        <p>See our <a href="/blog/how-to-remove-exif-data-from-photos" className="underline">complete removal guide</a> covering Mac, Windows, and online methods.</p>

        <h2 className="text-[20px] font-semibold text-[var(--text)]">Which file formats support EXIF?</h2>
        <p>JPEG, TIFF, HEIC/HEIF, WebP, and some RAW formats. PNG uses a different metadata system (tEXt/iTXt chunks) but tools like ExifCloak read those too.</p>
      </div>
    </article>
  );
}
