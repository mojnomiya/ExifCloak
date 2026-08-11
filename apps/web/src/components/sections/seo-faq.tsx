// FAQ section optimized for search — targets question-based queries
// Each Q maps to a real search query people type into Google

const faqs = [
  {
    q: "How do I remove EXIF data from photos on Mac?",
    a: "Open ExifCloak, drag your photos in, and click 'Strip All'. All EXIF, IPTC, XMP, and GPS metadata is removed instantly. The file saves in place — no export step needed. Works with JPEG, PNG, HEIC, TIFF, and WebP.",
  },
  {
    q: "Can ExifCloak remove GPS location data from images?",
    a: "Yes. ExifCloak detects and removes GPS latitude, longitude, altitude, and timestamp fields. You can strip only GPS while keeping other metadata intact, or remove everything at once.",
  },
  {
    q: "How do I remove AI-generated image metadata and C2PA Content Credentials?",
    a: "ExifCloak specifically detects C2PA manifests, Content Credentials, DALL·E signatures, Midjourney parameters, Stable Diffusion generation data, and Adobe Firefly markers. Click 'Strip AI' to remove only these fields while preserving normal camera data.",
  },
  {
    q: "Is ExifCloak free?",
    a: "Yes. ExifCloak is completely free and open-source under the MIT license. Every feature is available — no paywalls, no premium tier, no account required.",
  },
  {
    q: "Does ExifCloak work offline?",
    a: "100% offline. ExifCloak makes zero network requests. Your images are processed locally using Apple's native ImageIO framework. Nothing is ever uploaded anywhere.",
  },
  {
    q: "Can I batch remove metadata from multiple photos at once?",
    a: "Yes. Drop an entire folder into ExifCloak or select multiple files. Use the Batch menu to strip all metadata, strip AI fields, apply a preset, or auto-generate camera profiles across all files simultaneously.",
  },
  {
    q: "What is the best ExifTool alternative for Mac with a GUI?",
    a: "ExifCloak is a native macOS app (SwiftUI) that provides the same metadata viewing and editing capabilities as ExifTool but with a visual interface. It supports reading, editing, removing, and generating EXIF/IPTC/XMP metadata without needing the command line.",
  },
  {
    q: "Can ExifCloak generate fake but realistic camera metadata?",
    a: "Yes. ExifCloak can auto-generate cohesive camera profiles that match real devices — iPhone, Google Pixel, Canon, Nikon, Sony, Fujifilm. It creates matching combinations of make, model, lens, focal length, aperture, ISO, and timestamps that look authentic.",
  },
  {
    q: "What image formats does ExifCloak support?",
    a: "JPEG (.jpg, .jpeg), PNG, HEIC/HEIF, TIFF (.tiff, .tif), and WebP. RAW format support is planned for a future update.",
  },
  {
    q: "Is there a Windows version of ExifCloak?",
    a: "Not yet. ExifCloak is currently macOS-only (requires macOS 14 Sonoma or later). A Windows version is on the roadmap. The project is open-source, so community contributions toward a Windows port are welcome.",
  },
];

// JSON-LD FAQ schema for rich results in Google
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.a,
    },
  })),
};

export function SeoFaqSection() {
  return (
    <section className="py-16 md:py-24 border-t border-[var(--border-subtle)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="mx-auto max-w-[700px] px-6">
        <div className="text-center mb-10">
          <h2 className="text-[24px] font-semibold">Frequently asked questions</h2>
          <p className="mt-2 text-[14px] text-[var(--text-secondary)]">Common questions about removing and editing image metadata.</p>
        </div>

        <div className="divide-y divide-[var(--border-subtle)]">
          {faqs.map((faq, i) => (
            <details key={i} className="group py-4">
              <summary className="flex items-center justify-between cursor-pointer list-none">
                <h3 className="text-[14px] font-medium pr-4">{faq.q}</h3>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[var(--text-tertiary)] flex-shrink-0 group-open:rotate-45 transition-transform">
                  <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </summary>
              <p className="mt-3 text-[13px] text-[var(--text-secondary)] leading-[1.7]">{faq.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
