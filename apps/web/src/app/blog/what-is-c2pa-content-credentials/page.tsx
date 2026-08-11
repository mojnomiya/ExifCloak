import type { Metadata } from "next";
import { DiagramC2PA } from "@/components/blog-diagrams";

export const metadata: Metadata = {
  title: "What Are C2PA Content Credentials? How AI Images Get Labeled",
  description: "C2PA Content Credentials explained: what they are, how they mark AI-generated images, which platforms use them, and how to remove them.",
  alternates: { canonical: "https://exifcloak.app/blog/what-is-c2pa-content-credentials" },
};

export default function Post() {
  return (
    <article className="max-w-[680px] mx-auto px-6 py-24">
      <header className="mb-10">
        <p className="text-[12px] text-[var(--text-tertiary)] mb-2">August 10, 2026 · 6 min read</p>
        <h1 className="text-[28px] font-bold leading-[1.2]">What Are C2PA Content Credentials? How AI Images Get Labeled</h1>
        <p className="mt-4 text-[16px] text-[var(--text-secondary)] leading-[1.7]">
          C2PA is the metadata standard that tells platforms an image was made by AI. Here&apos;s how it works and why it matters.
        </p>
        <div className="mt-6 flex justify-center p-6 rounded-xl bg-[var(--bg-raised)] border border-[var(--border)]">
          <DiagramC2PA />
        </div>
      </header>

      <div className="space-y-6 text-[15px] text-[var(--text-secondary)] leading-[1.8]">
        <h2 className="text-[20px] font-semibold text-[var(--text)] pt-2">What is C2PA?</h2>
        <p>
          C2PA stands for Coalition for Content Provenance and Authenticity. It&apos;s a technical standard developed by Adobe, Microsoft, Google, Intel, and others. It embeds a cryptographically signed manifest inside image files that records how the image was created — including whether AI was involved.
        </p>

        <h2 className="text-[20px] font-semibold text-[var(--text)] pt-2">How C2PA works</h2>
        <p>
          When ChatGPT, DALL·E, Midjourney, Adobe Firefly, or Google Gemini generates an image, it embeds a C2PA manifest — a signed JSON-like structure stored in the file&apos;s binary data (specifically in JUMBF boxes for JPEG, or XMP for other formats). This manifest contains:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>The generator tool name (e.g., &ldquo;OpenAI DALL·E 3&rdquo;)</li>
          <li>A timestamp of generation</li>
          <li>A cryptographic signature proving the manifest wasn&apos;t tampered with</li>
          <li>Action history (e.g., &ldquo;c2pa.created&rdquo; with &ldquo;ai_generated&rdquo; flag)</li>
        </ul>

        <h2 className="text-[20px] font-semibold text-[var(--text)] pt-2">Which platforms detect C2PA?</h2>
        <p>
          As of 2026, Instagram, Facebook, Threads, LinkedIn, and X (Twitter) all read C2PA manifests and automatically apply &ldquo;Made with AI&rdquo; labels to flagged content. Google Search also surfaces Content Credential information in image results.
        </p>

        <h2 className="text-[20px] font-semibold text-[var(--text)] pt-2">Can C2PA be removed?</h2>
        <p>
          Yes. C2PA manifests are metadata — they exist in the file&apos;s binary structure, not in the pixels themselves. Tools like ExifCloak strip C2PA manifests along with all other metadata. The image remains visually identical; only the provenance data is removed.
        </p>
        <p>
          Note: pixel-level watermarks (like Google SynthID or invisible steganographic marks) are separate from C2PA and cannot be removed by metadata stripping alone. C2PA is the most common trigger for platform labels, though.
        </p>

        <h2 className="text-[20px] font-semibold text-[var(--text)] pt-2">How to remove C2PA Content Credentials</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>ExifCloak (Mac)</strong> — Click &ldquo;Strip AI&rdquo; to target only C2PA and AI-related fields</li>
          <li><strong>ExifCloak Web Tool</strong> — <a href="/tool" className="underline">Use in browser</a>, click &ldquo;Strip All&rdquo; (removes C2PA along with everything else)</li>
          <li><strong>ExifTool</strong> — <code className="bg-[var(--bg-raised)] px-1.5 py-0.5 rounded text-[13px]">exiftool -all= -jumbf:all= image.jpg</code></li>
        </ul>

        <h2 className="text-[20px] font-semibold text-[var(--text)] pt-2">Should you remove C2PA?</h2>
        <p>
          That depends on context. If you&apos;re a content creator sharing AI-assisted work and don&apos;t want automatic &ldquo;AI generated&rdquo; labels, removing C2PA before uploading is the practical solution. If you&apos;re a journalist or using images in a context where provenance matters, keeping C2PA intact is the right choice.
        </p>

        <div className="border border-[var(--border)] rounded-lg p-5 bg-[var(--bg-raised)] mt-8">
          <p className="text-[14px] font-medium text-[var(--text)] mb-2">Key takeaways</p>
          <ul className="list-disc pl-5 space-y-1 text-[13px]">
            <li>C2PA is metadata, not a pixel watermark — it can be stripped</li>
            <li>It&apos;s the primary trigger for &ldquo;Made with AI&rdquo; labels on social platforms</li>
            <li>Removing it doesn&apos;t alter the image visually</li>
            <li><a href="/tool" className="underline">ExifCloak Web Tool</a> removes it in-browser, no upload needed</li>
          </ul>
        </div>
      </div>
    </article>
  );
}
