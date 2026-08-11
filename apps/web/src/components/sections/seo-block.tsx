// SEO content block — targets informational queries with natural keyword density
// Not flashy UI — just clean, scannable, keyword-rich content that search engines love

export function SeoBlock() {
  return (
    <section className="py-16 md:py-24 bg-[var(--bg-raised)] border-t border-[var(--border-subtle)]">
      <div className="mx-auto max-w-[800px] px-6">
        <article>
          <h2 className="text-[22px] font-semibold mb-6">
            The free metadata editor users have been missing
          </h2>

          <div className="space-y-4 text-[14px] text-[var(--text-secondary)] leading-[1.8]">
            <p>
              <strong className="text-[var(--text)]">ExifCloak is a free, open-source EXIF metadata editor for macOS</strong> that
              lets you view, edit, strip, and regenerate image metadata without uploading anything to the cloud. It handles
              EXIF, IPTC, XMP, GPS, and TIFF metadata across JPEG, PNG, HEIC, TIFF, and WebP files.
            </p>

            <p>
              Unlike command-line tools like ExifTool, ExifCloak provides a native macOS interface built with SwiftUI.
              Unlike web-based strippers, your files never leave your device. Unlike Electron-based alternatives
              like ExifCleaner, it&apos;s a proper native app — fast, lightweight (under 1 MB), and integrated with macOS.
            </p>

            <h3 className="text-[16px] font-semibold pt-4">Remove AI generation markers</h3>
            <p>
              If you work with AI-generated images from ChatGPT, DALL·E, Midjourney, Stable Diffusion, or Adobe Firefly,
              your images contain embedded metadata that identifies them as AI-generated. This includes C2PA Content
              Credentials, generation parameters, model signatures, and prompt data. Social media platforms increasingly
              use these markers to label content as AI-generated. ExifCloak detects and removes these markers specifically.
            </p>

            <h3 className="text-[16px] font-semibold pt-4">Remove GPS and location data from photos</h3>
            <p>
              Every photo taken on a phone includes GPS coordinates — your exact location when the photo was captured.
              Sharing these photos online can expose your home address, workplace, or daily routine. ExifCloak strips
              GPS latitude, longitude, altitude, and timestamps with one click, or you can selectively remove location
              while keeping other camera data intact.
            </p>

            <h3 className="text-[16px] font-semibold pt-4">Batch process entire folders</h3>
            <p>
              Drop a folder containing hundreds of images. Apply the same action to all files at once — strip metadata,
              remove AI markers, apply a preset, or auto-generate realistic camera profiles. ExifCloak processes 100
              typical JPEGs in under 2 seconds on Apple Silicon.
            </p>

            <h3 className="text-[16px] font-semibold pt-4">Works on macOS 14 Sonoma and later</h3>
            <p>
              ExifCloak requires macOS 14 (Sonoma) or later and runs natively on both Apple Silicon (M1, M2, M3, M4)
              and Intel Macs. It uses Apple&apos;s ImageIO framework for metadata operations — no external dependencies,
              no runtime installations, no brew packages required.
            </p>
          </div>
        </article>
      </div>
    </section>
  );
}
