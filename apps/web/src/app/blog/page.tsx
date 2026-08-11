import type { Metadata } from "next";
import Link from "next/link";
import { DiagramStrip, DiagramC2PA, DiagramGPS, DiagramGUI, DiagramEXIF, DiagramBatch } from "@/components/blog-diagrams";

export const metadata: Metadata = {
  title: "Blog — Image Metadata, Privacy & EXIF Guides",
  description: "Guides on removing EXIF data, stripping GPS from photos, understanding C2PA Content Credentials, and protecting image privacy.",
};

export default function BlogIndex() {
  return (
    <div className="max-w-[1100px] mx-auto px-6 py-24">
      <div className="mb-12">
        <h1 className="text-[28px] font-bold mb-2">Blog</h1>
        <p className="text-[15px] text-[var(--text-secondary)]">
          Guides on image metadata, privacy, and EXIF management.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <Card
          href="/blog/how-to-remove-exif-data-from-photos"
          title="How to Remove EXIF Data from Photos"
          description="Strip metadata on Mac, Windows, and online. GPS, batch processing, verification."
          date="Aug 10, 2026"
          diagram={<DiagramStrip />}
        />
        <Card
          href="/blog/what-is-c2pa-content-credentials"
          title="What Are C2PA Content Credentials?"
          description="The metadata that labels images as AI-generated. How platforms detect it."
          date="Aug 10, 2026"
          diagram={<DiagramC2PA />}
        />
        <Card
          href="/blog/remove-gps-location-from-photos"
          title="Remove GPS Location from Photos"
          description="Your photos carry exact coordinates. Strip them before sharing."
          date="Aug 10, 2026"
          diagram={<DiagramGPS />}
        />
        <Card
          href="/blog/exiftool-alternative-gui-mac"
          title="ExifTool Alternative with GUI for Mac"
          description="Visual metadata editors that don't need the terminal."
          date="Aug 10, 2026"
          diagram={<DiagramGUI />}
        />
        <Card
          href="/blog/what-is-exif-data"
          title="What Is EXIF Data?"
          description="Camera settings, GPS, timestamps, software — all hidden in your photos."
          date="Aug 11, 2026"
          diagram={<DiagramEXIF />}
        />
        <Card
          href="/blog/batch-remove-metadata-from-photos"
          title="Batch Remove Metadata"
          description="Process hundreds of files at once. Tools for fast, thorough stripping."
          date="Aug 11, 2026"
          diagram={<DiagramBatch />}
        />
      </div>
    </div>
  );
}

function Card({ href, title, description, date, diagram }: {
  href: string; title: string; description: string; date: string; diagram: React.ReactNode;
}) {
  return (
    <Link href={href} className="group block rounded-xl border border-[var(--border)] overflow-hidden hover:border-[var(--text-tertiary)] transition-colors">
      <div className="h-[140px] bg-[var(--bg-raised)] flex items-center justify-center border-b border-[var(--border)] overflow-hidden">
        {diagram}
      </div>
      <div className="p-5">
        <h2 className="text-[15px] font-semibold leading-snug group-hover:underline mb-2">{title}</h2>
        <p className="text-[13px] text-[var(--text-secondary)] leading-[1.5] mb-3">{description}</p>
        <p className="text-[11px] text-[var(--text-tertiary)]">{date}</p>
      </div>
    </Link>
  );
}

