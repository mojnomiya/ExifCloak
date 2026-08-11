export function DemoSection() {
  return (
    <section id="demo" className="py-16 md:py-24 bg-[var(--bg-raised)]">
      <div className="mx-auto max-w-[1100px] px-6">
        <div className="text-center mb-10">
          <h2 className="text-[24px] font-semibold">The app, up close</h2>
          <p className="mt-2 text-[14px] text-[var(--text-secondary)]">
            Drop files in, inspect metadata, take action.
          </p>
        </div>
        <div className="app-window max-w-[860px] mx-auto">
          <div className="app-titlebar justify-between">
            <div className="flex items-center gap-[7px]">
              <div className="app-dot bg-[#ff5f57]" />
              <div className="app-dot bg-[#febc2e]" />
              <div className="app-dot bg-[#28c840]" />
            </div>
            <span className="text-[11px] text-[var(--text-secondary)] font-medium">ExifCloak</span>
            <div className="flex gap-1.5">
              <Pill>+</Pill>
              <Pill>Batch</Pill>
            </div>
          </div>
          <div className="flex min-h-[380px]">
            <Sidebar />
            <Detail />
          </div>
        </div>
        <p className="text-center text-[12px] text-[var(--text-tertiary)] mt-5">Actual app interface.</p>
      </div>
    </section>
  );
}

function Sidebar() {
  return (
    <div className="w-[180px] border-r border-[var(--border)] bg-[var(--bg-raised)] p-2.5 flex flex-col gap-0.5">
      <FileItem name="fabric 2026-08-09 at 18.04..." size="344 KB" active />
      <FileItem name="fabric 2026-08-09 at 18.04..." size="345 KB" />
      <FileItem name="fabric 2026-08-09 at 14.35..." size="86 KB" done />
      <FileItem name="fabric 2026-08-09 at 14.35..." size="65 KB" done />
      <FileItem name="fabric 2026-08-09 at 14.35..." size="69 KB" />
      <div className="mt-auto pt-2 border-t border-[var(--border)]">
        <p className="text-[10px] text-[var(--text-tertiary)] px-1.5">5 files · 2 cleaned</p>
      </div>
    </div>
  );
}

function Detail() {
  return (
    <div className="flex-1 flex flex-col">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border)]">
        <div className="w-9 h-9 rounded-md bg-[var(--bg-hover)] border border-[var(--border)]" />
        <div>
          <p className="text-[12px] font-medium">fabric 2026-08-09 at 18.04.43.jpeg</p>
          <p className="text-[10px] text-[var(--text-tertiary)]">344 KB · JPEG · 10 fields</p>
        </div>
        <div className="ml-auto flex gap-1.5">
          <Pill>Strip All</Pill>
          <Pill>Strip AI</Pill>
          <Pill>↻</Pill>
        </div>
      </div>
      <div className="flex-1 p-3">
        <div className="flex items-center gap-2 mb-3 px-1">
          <span className="text-[12px] text-[var(--text-secondary)] font-medium">File System</span>
          <span className="text-[11px] text-[var(--text-tertiary)]">(10)</span>
        </div>
        <Row label="Depth" value="8" />
        <Row label="PixelWidth" value="1204" />
        <Row label="ColorModel" value="RGB" />
        <Row label="ProfileName" value="sRGB IEC61966-2.1" />
        <Row label="PixelHeight" value="1600" />
        <Row label="FileSize" value="344 KB" />
        <Row label="DateCreated" value="9 Aug, 2026 at 6:06:06 PM" />
        <Row label="DateModified" value="9 Aug, 2026 at 6:06:06 PM" />
        <Row label="FileName" value="fabric 2026-08-09 at 18.04.43.jpeg" />
        <Row label="FileType" value="JPEG" />
      </div>
    </div>
  );
}

function FileItem({ name, size, active = false, done = false }:
  { name: string; size: string; active?: boolean; done?: boolean }) {
  return (
    <div className={`flex items-center gap-2 px-2 py-[5px] rounded-md ${active ? "bg-[var(--text)] text-[var(--bg)]" : ""}`}>
      <div className={`w-7 h-7 rounded flex-shrink-0 ${active ? "bg-[var(--bg)]/20" : "bg-[var(--bg-hover)] border border-[var(--border)]"}`} />
      <div className="min-w-0 flex-1">
        <p className={`text-[11px] truncate ${active ? "font-medium" : "text-[var(--text-secondary)]"}`}>{name}</p>
        <p className={`text-[10px] ${active ? "opacity-70" : "text-[var(--text-tertiary)]"}`}>{size}</p>
      </div>
      {done && <span className="text-[var(--success)] text-[9px]">✓</span>}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="metadata-row">
      <span className="w-[130px] flex-shrink-0 text-[12px] text-[var(--text-tertiary)] text-right pr-4">{label}</span>
      <span className="text-[12px]">{value}</span>
    </div>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return <span className="text-[10px] text-[var(--text-secondary)] px-2 py-0.5 rounded border border-[var(--border)] bg-[var(--bg)]">{children}</span>;
}
