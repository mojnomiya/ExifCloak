import { MetadataStrip } from "@/components/illustrations";

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-10 md:pt-44 md:pb-16">
      <div className="mx-auto max-w-[1100px] px-6">
        <div className="grid md:grid-cols-[1fr_420px] gap-8 items-center">
          <div className="max-w-[560px]">
            <p className="text-[13px] text-[var(--text-tertiary)] mb-5">
              Free and open-source image metadata control
            </p>

            <h1 className="text-[clamp(2rem,4.5vw,3rem)] font-bold leading-[1.15] tracking-tight">
              See what your photos reveal.
              <br />
              Then decide what stays.
            </h1>

            <p className="mt-6 text-[15px] leading-[1.8] text-[var(--text-secondary)] max-w-[460px]">
              Every image carries hidden metadata — GPS, device info, AI markers, timestamps. ExifCloak lets you view, strip, edit, or replace it. Everything stays on your machine.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="https://github.com/mojnomiya/ExifCloak/releases/download/v1.0.0/ExifCloak-1.0.0.dmg"
                className="inline-flex items-center gap-2 bg-[var(--text)] text-[var(--bg)] text-[14px] font-medium px-6 py-2.5 rounded-lg hover:opacity-80 transition-opacity"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                Download for Mac
              </a>
              <a
                href="https://github.com/mojnomiya/ExifCloak"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-[var(--border)] text-[var(--text-secondary)] text-[14px] font-medium px-5 py-2.5 rounded-lg hover:text-[var(--text)] hover:border-[var(--text-tertiary)] transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                View Source
              </a>
            </div>
            <p className="mt-3 text-[12px] text-[var(--text-tertiary)]">Free · Open Source · MIT License · macOS 14+</p>
          </div>

          {/* Playful illustration */}
          <div className="hidden md:block">
            <MetadataStrip />
          </div>
        </div>
      </div>
    </section>
  );
}
