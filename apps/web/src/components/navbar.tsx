"use client";

import { ThemeToggle } from "./theme-toggle";

export function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav className="mx-auto max-w-[1100px] mt-3 flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--bg)]/80 backdrop-blur-xl px-5 py-2.5">
        <a href="#" className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-[var(--text)] flex items-center justify-center">
            <span className="text-[var(--bg)] text-[10px] font-bold">EC</span>
          </div>
          <span className="text-[15px] font-semibold tracking-tight">ExifCloak</span>
        </a>

        <div className="hidden md:flex items-center gap-7">
          <a href="/tool" className="text-[13px] text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors">Web Tool</a>
          <a href="/blog" className="text-[13px] text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors">Blog</a>
          <a href="#capabilities" className="text-[13px] text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors">Features</a>
          <a href="https://github.com/mojnomiya/ExifCloak" target="_blank" rel="noopener noreferrer" className="text-[13px] text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors">GitHub</a>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <a href="#download" className="text-[13px] font-medium bg-[var(--text)] text-[var(--bg)] px-4 py-1.5 rounded-lg hover:opacity-80 transition-opacity">
            Download
          </a>
        </div>
      </nav>
    </header>
  );
}
