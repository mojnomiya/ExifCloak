export function BottomCta() {
  return (
    <section id="download" className="py-16 md:py-24 border-t border-[var(--border-subtle)]">
      <div className="mx-auto max-w-[500px] px-6 text-center">
        <h2 className="text-[22px] font-semibold">
          Take back control of your images.
        </h2>
        <p className="mt-3 text-[14px] text-[var(--text-secondary)] leading-[1.7]">
          Download ExifCloak. See what data your photos carry. Decide what the world gets to know.
        </p>

        <a
          href="https://github.com/mojnomiya/ExifCloak/releases/download/v1.0.0/ExifCloak-1.0.0.dmg"
          className="inline-flex items-center gap-2 mt-7 bg-[var(--text)] text-[var(--bg)] text-[14px] font-medium px-7 py-3 rounded-lg hover:opacity-80 transition-opacity"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
          Download for macOS
        </a>
        <p className="mt-2.5 text-[11px] text-[var(--text-tertiary)]">
          macOS 14+ · Apple Silicon & Intel · Free
        </p>

        {/* Gatekeeper note */}
        <div className="mt-5 max-w-[400px] mx-auto text-left border border-[var(--border)] rounded-lg p-3 bg-[var(--bg-raised)]">
          <p className="text-[11px] font-medium mb-1">First launch on macOS</p>
          <p className="text-[11px] text-[var(--text-secondary)] leading-[1.6]">
            If macOS says the app is &quot;damaged&quot;, open Terminal and run:
          </p>
          <code className="block mt-1.5 text-[10px] bg-[var(--bg-hover)] text-[var(--text)] px-2 py-1.5 rounded font-mono">
            xattr -cr /Applications/ExifCloak.app
          </code>
          <p className="text-[10px] text-[var(--text-tertiary)] mt-1.5">
            This removes the quarantine flag added by macOS for downloaded apps.
          </p>
        </div>

        <div className="mt-12 pt-8 border-t border-[var(--border-subtle)]">
          <div className="flex items-center justify-center gap-8 text-[12px] text-[var(--text-tertiary)]">
            <div className="text-center">
              <p className="text-[18px] font-bold text-[var(--text)]">100%</p>
              <p>Offline</p>
            </div>
            <div className="h-8 w-px bg-[var(--border)]" />
            <div className="text-center">
              <p className="text-[18px] font-bold text-[var(--text)]">&lt;2s</p>
              <p>Per 100 files</p>
            </div>
            <div className="h-8 w-px bg-[var(--border)]" />
            <div className="text-center">
              <p className="text-[18px] font-bold text-[var(--text)]">5+</p>
              <p>Formats</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
