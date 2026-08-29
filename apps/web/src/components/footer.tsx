export function Footer() {
  return (
    <footer className="border-t border-[var(--border-subtle)] py-10">
      <div className="mx-auto max-w-[1100px] px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <p className="text-[12px] font-medium mb-3">Product</p>
            <div className="space-y-2 text-[12px] text-[var(--text-tertiary)]">
              <a href="/tool" className="block hover:text-[var(--text-secondary)]">Web Tool</a>
              <a href="https://github.com/mojnomiya/ExifCloak/releases" className="block hover:text-[var(--text-secondary)]">Download Mac App</a>
              <a href="https://github.com/mojnomiya/ExifCloak" className="block hover:text-[var(--text-secondary)]">Source Code</a>
            </div>
          </div>
          <div>
            <p className="text-[12px] font-medium mb-3">Resources</p>
            <div className="space-y-2 text-[12px] text-[var(--text-tertiary)]">
              <a href="/blog" className="block hover:text-[var(--text-secondary)]">Blog</a>
              <a href="/blog/how-to-remove-exif-data-from-photos" className="block hover:text-[var(--text-secondary)]">Remove EXIF Guide</a>
              <a href="/blog/what-is-c2pa-content-credentials" className="block hover:text-[var(--text-secondary)]">C2PA Explained</a>
              <a href="/blog/what-is-exif-data" className="block hover:text-[var(--text-secondary)]">What Is EXIF Data?</a>
            </div>
          </div>
          <div>
            <p className="text-[12px] font-medium mb-3">Company</p>
            <div className="space-y-2 text-[12px] text-[var(--text-tertiary)]">
              <a href="/about" className="block hover:text-[var(--text-secondary)]">About</a>
              <a href="/privacy" className="block hover:text-[var(--text-secondary)]">Privacy Policy</a>
            </div>
          </div>
          <div>
            <p className="text-[12px] font-medium mb-3">Community</p>
            <div className="space-y-2 text-[12px] text-[var(--text-tertiary)]">
              <a href="https://github.com/mojnomiya/ExifCloak" className="block hover:text-[var(--text-secondary)]" rel="noopener noreferrer me">GitHub</a>
              <a href="https://github.com/mojnomiya/ExifCloak/issues" className="block hover:text-[var(--text-secondary)]">Report a Bug</a>
              <a href="https://github.com/mojnomiya/ExifCloak/blob/main/CONTRIBUTING.md" className="block hover:text-[var(--text-secondary)]">Contribute</a>
            </div>
          </div>
        </div>

        <div className="border-t border-[var(--border-subtle)] pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <span className="text-[11px] text-[var(--text-tertiary)]">&copy; 2026 ExifCloak. Open-source under MIT License.</span>
          <span className="text-[11px] text-[var(--text-tertiary)]">Made for people who care about what their photos reveal.</span>
        </div>
      </div>
    </footer>
  );
}
