import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://exifcloak.app"),
  title: {
    default: "ExifCloak — Free Open-Source EXIF & Metadata Editor for macOS",
    template: "%s | ExifCloak",
  },
  description:
    "Free, open-source macOS app to view, edit, strip, and regenerate image metadata. Remove EXIF, GPS, C2PA Content Credentials, AI generation markers. Batch process hundreds of files offline. Native SwiftUI app.",
  keywords: [
    "EXIF remover mac",
    "remove EXIF data",
    "metadata editor macOS",
    "strip image metadata",
    "remove GPS from photos",
    "C2PA remover",
    "content credentials remover",
    "AI metadata cleaner",
    "remove AI label from image",
    "batch EXIF editor",
    "photo metadata stripper",
    "image privacy tool",
    "EXIF editor free",
    "XMP IPTC editor",
    "macOS photo metadata",
    "remove location from photos mac",
    "EXIF viewer mac",
    "batch rename photos mac",
    "strip DALL-E metadata",
    "remove Midjourney metadata",
    "open source EXIF tool",
    "ExifTool alternative mac",
    "ExifCleaner alternative",
    "image metadata manager",
    "photo metadata remover offline",
  ],
  authors: [{ name: "ExifCloak", url: "https://exifcloak.app" }],
  creator: "ExifCloak",
  publisher: "ExifCloak",
  category: "Photography",
  openGraph: {
    title: "ExifCloak — Free EXIF & Metadata Editor for macOS",
    description:
      "View, edit, strip, and regenerate image metadata. Remove GPS, AI markers, C2PA credentials. 100% offline, open-source, native macOS app.",
    type: "website",
    url: "https://exifcloak.app",
    siteName: "ExifCloak",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ExifCloak — Image Metadata Editor for macOS",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ExifCloak — Free EXIF & Metadata Editor for macOS",
    description:
      "Strip EXIF, GPS, AI markers from photos. Batch process. Auto-generate realistic camera profiles. Open-source, 100% offline.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://exifcloak.app",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

// JSON-LD structured data for rich search results
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "ExifCloak",
  applicationCategory: "PhotographyApplication",
  operatingSystem: "macOS 14+",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  description:
    "Free, open-source macOS app to view, edit, strip, and regenerate image metadata (EXIF, IPTC, XMP, GPS, C2PA). Batch process hundreds of files. 100% offline.",
  downloadUrl:
    "https://github.com/mojnomiya/ExifCloak/releases/download/v1.0.0/ExifCloak-1.0.0.dmg",
  softwareVersion: "1.0.0",
  fileSize: "1MB",
  license: "https://opensource.org/licenses/MIT",
  isAccessibleForFree: true,
  screenshot: "https://exifcloak.app/og-image.png",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    ratingCount: "12",
  },
  featureList: [
    "View EXIF, IPTC, XMP, GPS metadata",
    "Strip all metadata from images",
    "Remove AI generation markers and C2PA Content Credentials",
    "Auto-generate realistic camera metadata profiles",
    "Batch process hundreds of files at once",
    "Batch rename with Finder-style patterns",
    "Menu bar quick-strip",
    "100% offline - no data uploaded",
    "Supports JPEG, PNG, HEIC, TIFF, WebP",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
