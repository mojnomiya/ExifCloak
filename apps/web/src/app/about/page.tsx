import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About ExifCloak",
  description: "ExifCloak is a free, open-source image metadata editor. View, strip, and regenerate EXIF data locally.",
};

export default function AboutPage() {
  return (
    <article className="max-w-[680px] mx-auto px-6 py-24">
      <h1 className="text-[28px] font-bold mb-8">About ExifCloak</h1>
      <div className="space-y-5 text-[15px] text-[var(--text-secondary)] leading-[1.8]">
        <p>
          ExifCloak is a free, open-source tool for viewing, editing, stripping, and regenerating image metadata. It exists because sharing photos online shouldn&apos;t mean sharing your home address, device fingerprint, or AI tool signatures.
        </p>
        <p>
          The project started as a native macOS app built with Swift and SwiftUI, using Apple&apos;s ImageIO framework for fast, reliable metadata operations. The web version extends the same capabilities to any platform with a modern browser.
        </p>
        <h2 className="text-[18px] font-semibold text-[var(--text)] pt-4">Philosophy</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Privacy first</strong> — all processing happens locally. No servers, no uploads, no accounts.</li>
          <li><strong>Free forever</strong> — no paywalls, no premium tiers, no locked features.</li>
          <li><strong>Open source</strong> — MIT license. Read the code, modify it, distribute it.</li>
          <li><strong>No dependencies</strong> — the macOS app uses only Apple frameworks. Zero third-party libraries.</li>
        </ul>
        <h2 className="text-[18px] font-semibold text-[var(--text)] pt-4">Who makes this</h2>
        <p>
          ExifCloak is built and maintained as an open-source project. Contributions are welcome via <a href="https://github.com/mojnomiya/ExifCloak" className="underline">GitHub</a>.
        </p>
      </div>
    </article>
  );
}
