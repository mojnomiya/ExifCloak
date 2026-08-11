export function ProblemSection() {
  return (
    <section className="py-16 md:py-24 border-t border-[var(--border-subtle)]">
      <div className="mx-auto max-w-[1100px] px-6">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div>
            <p className="text-[12px] uppercase tracking-widest text-[var(--danger)] mb-3 font-medium">Hidden data</p>
            <h2 className="text-[24px] font-semibold leading-[1.3]">
              Your images carry more than pixels.
            </h2>
            <p className="mt-4 text-[14px] text-[var(--text-secondary)] leading-[1.8]">
              A single photo from your phone embeds 40+ metadata fields. Home address via GPS. Your exact device. The software that processed it. The precise second it was taken.
            </p>
            <p className="mt-3 text-[14px] text-[var(--text-secondary)] leading-[1.8]">
              AI-generated images now include <span className="text-[var(--warning)] font-medium">C2PA Content Credentials</span> — cryptographic proof an AI made them. Platforms flag these automatically.
            </p>
          </div>

          <div className="app-window">
            <div className="app-titlebar">
              <div className="app-dot bg-[#ff5f57]" />
              <div className="app-dot bg-[#febc2e]" />
              <div className="app-dot bg-[#28c840]" />
              <span className="ml-3 text-[11px] text-[var(--text-tertiary)]">vacation_photo.jpg</span>
            </div>
            <div className="p-3 space-y-0.5">
              <Row label="GPS Latitude" value="23.8103° N" suspicious />
              <Row label="GPS Longitude" value="90.4125° E" suspicious />
              <Row label="Device Model" value="iPhone 15 Pro Max" />
              <Row label="Software" value="Adobe Photoshop 25.3" suspicious />
              <Row label="DateTime" value="2026:08:09 14:23:51" />
              <Row label="CreatorTool" value="DALL·E 3" suspicious />
              <Row label="C2PA Manifest" value="[signed, 2.4 KB]" suspicious />
              <Row label="Serial Number" value="DNQXJ3K1HG" suspicious />
              <Row label="Lens" value="iPhone 15 Pro back camera 6.765mm" />
              <Row label="ISO" value="64" />
              <div className="pt-2 mt-2 border-t border-[var(--border-subtle)]">
                <p className="text-[10px] text-[var(--warning)] font-medium">
                  6 fields may reveal location, identity, or AI origin
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Row({ label, value, suspicious = false }: { label: string; value: string; suspicious?: boolean }) {
  return (
    <div className={`metadata-row ${suspicious ? "suspicious" : ""}`}>
      <span className={`w-[120px] flex-shrink-0 text-[11px] ${suspicious ? "text-[var(--warning)]" : "text-[var(--text-tertiary)]"}`}>
        {label}
      </span>
      <span className="text-[11px] text-[var(--text-secondary)]">{value}</span>
      {suspicious && (
        <span className="ml-auto text-[9px] text-[var(--warning)] bg-[var(--warning)]/10 px-1.5 py-0.5 rounded font-medium">
          risk
        </span>
      )}
    </div>
  );
}
