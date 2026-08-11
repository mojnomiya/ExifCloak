import type { Metadata } from "next";
import { DiagramGPS } from "@/components/blog-diagrams";

export const metadata: Metadata = {
  title: "How to Remove GPS Location Data from Photos Before Sharing",
  description: "Strip GPS coordinates from photos on Mac, Windows, iPhone, and Android. Protect your privacy before sharing images online.",
  alternates: { canonical: "https://exifcloak.app/blog/remove-gps-location-from-photos" },
};

export default function Post() {
  return (
    <article className="max-w-[680px] mx-auto px-6 py-24">
      <header className="mb-10">
        <p className="text-[12px] text-[var(--text-tertiary)] mb-2">August 10, 2026 · 5 min read</p>
        <h1 className="text-[28px] font-bold leading-[1.2]">How to Remove GPS Location Data from Photos Before Sharing</h1>
        <p className="mt-4 text-[16px] text-[var(--text-secondary)] leading-[1.7]">
          Your phone embeds exact GPS coordinates in every photo. Here&apos;s how to remove them before you share.
        </p>
        <div className="mt-6 flex justify-center p-6 rounded-xl bg-[var(--bg-raised)] border border-[var(--border)]">
          <DiagramGPS />
        </div>
      </header>

      <div className="space-y-6 text-[15px] text-[var(--text-secondary)] leading-[1.8]">
        <h2 className="text-[20px] font-semibold text-[var(--text)] pt-2">What GPS data is in your photos?</h2>
        <p>
          When location services are enabled, your phone records GPS latitude, longitude, altitude, direction, speed, and timestamp in every photo&apos;s EXIF data. This means anyone who receives your photo can extract your exact location — potentially your home address, workplace, or children&apos;s school.
        </p>

        <h2 className="text-[20px] font-semibold text-[var(--text)] pt-2">Remove GPS on Mac</h2>
        <p>
          <strong>ExifCloak:</strong> Drag photos in → use the built-in &ldquo;Privacy Strip&rdquo; preset or click &ldquo;Strip All.&rdquo; GPS latitude, longitude, altitude, and timestamp fields are all removed. Batch-processes entire folders.
        </p>

        <h2 className="text-[20px] font-semibold text-[var(--text)] pt-2">Remove GPS on Windows</h2>
        <p>
          Right-click → Properties → Details → &ldquo;Remove Properties and Personal Information&rdquo; → select GPS fields. This works but is tedious for multiple files and misses some GPS-adjacent fields.
        </p>

        <h2 className="text-[20px] font-semibold text-[var(--text)] pt-2">Remove GPS on iPhone (before taking photos)</h2>
        <p>
          Settings → Privacy &amp; Security → Location Services → Camera → set to &ldquo;Never.&rdquo; This prevents GPS from being recorded in future photos but doesn&apos;t fix existing ones.
        </p>

        <h2 className="text-[20px] font-semibold text-[var(--text)] pt-2">Remove GPS online</h2>
        <p>
          Use the <a href="/tool" className="underline">ExifCloak Web Tool</a> — drop your photos in the browser, click Strip All, download clean copies. No server upload, everything processes locally.
        </p>

        <h2 className="text-[20px] font-semibold text-[var(--text)] pt-2">Which apps strip GPS on sharing?</h2>
        <p>
          Some platforms strip GPS automatically when you upload (Instagram, Twitter/X, Facebook). But many don&apos;t — email attachments, messaging apps (SMS, Telegram file sharing), cloud storage links, and forums typically preserve all EXIF data including GPS. Always strip before sharing if you&apos;re not certain.
        </p>

        <div className="border border-[var(--border)] rounded-lg p-5 bg-[var(--bg-raised)] mt-8">
          <p className="text-[14px] font-medium text-[var(--text)] mb-2">Quick solution</p>
          <p className="text-[13px]">
            <a href="/tool" className="underline">Open ExifCloak Web Tool</a> → drop photos → Strip All → Download. Takes 2 seconds per file, processes locally.
          </p>
        </div>
      </div>
    </article>
  );
}
