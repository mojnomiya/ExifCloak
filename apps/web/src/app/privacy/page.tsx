import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "ExifCloak privacy policy. We don't collect data.",
};

export default function PrivacyPage() {
  return (
    <article className="max-w-[680px] mx-auto px-6 py-24">
      <h1 className="text-[28px] font-bold mb-8">Privacy Policy</h1>
      <div className="space-y-5 text-[15px] text-[var(--text-secondary)] leading-[1.8]">
        <p><strong className="text-[var(--text)]">Last updated:</strong> August 11, 2026</p>

        <h2 className="text-[18px] font-semibold text-[var(--text)] pt-4">What we collect</h2>
        <p>Nothing. ExifCloak (both the desktop app and web tool) processes all files locally. We do not collect, transmit, or store any user data, images, metadata, or usage analytics.</p>

        <h2 className="text-[18px] font-semibold text-[var(--text)] pt-4">Desktop app</h2>
        <p>The macOS app makes zero network requests. It has no analytics, no telemetry, no crash reporting, no update checks. Your files never leave your machine.</p>

        <h2 className="text-[18px] font-semibold text-[var(--text)] pt-4">Web tool</h2>
        <p>The browser-based tool at /tool processes images entirely in your browser using JavaScript. No files are uploaded to any server. No data is sent anywhere. The tool works fully offline once loaded.</p>

        <h2 className="text-[18px] font-semibold text-[var(--text)] pt-4">Website</h2>
        <p>This marketing website (exifcloak.netlify.app) may use basic analytics and advertising services (Google AdSense) which set their own cookies. These services are only present on the marketing pages — never on the /tool page where files are processed.</p>

        <h2 className="text-[18px] font-semibold text-[var(--text)] pt-4">Cookies</h2>
        <p>We use a single localStorage key to remember your light/dark theme preference. Third-party advertising services may set cookies on marketing pages in accordance with their own privacy policies.</p>

        <h2 className="text-[18px] font-semibold text-[var(--text)] pt-4">Third-party services</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Google AdSense (advertising on marketing pages only)</li>
          <li>GitHub (source code hosting, release downloads)</li>
          <li>Netlify (website hosting)</li>
        </ul>

        <h2 className="text-[18px] font-semibold text-[var(--text)] pt-4">Contact</h2>
        <p>For privacy questions, open an issue on our <a href="https://github.com/mojnomiya/ExifCloak" className="underline">GitHub repository</a>.</p>
      </div>
    </article>
  );
}
