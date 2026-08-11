import { ShieldCheck } from "@/components/illustrations";

export function CapabilitiesSection() {
  return (
    <section id="capabilities" className="py-16 md:py-24 border-t border-[var(--border-subtle)]">
      <div className="mx-auto max-w-[1100px] px-6">
        <div className="text-center mb-12">
          <h2 className="text-[24px] font-semibold">What ExifCloak does</h2>
          <p className="mt-2 text-[14px] text-[var(--text-secondary)]">More than a stripper. A complete metadata workbench.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
          {/* Generate */}
          <div className="md:col-span-4 rounded-xl border border-[var(--border)] bg-[var(--bg-raised)] p-6">
            <p className="text-[11px] uppercase tracking-wider text-[var(--text-tertiary)] font-medium mb-2">Generate</p>
            <h3 className="text-[15px] font-semibold mb-1.5">Replace with realistic camera profiles</h3>
            <p className="text-[13px] text-[var(--text-secondary)] leading-[1.7] mb-5">
              Empty metadata is itself a signal. ExifCloak generates matching make/model/lens/settings that look indistinguishable from a real camera.
            </p>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-lg bg-[var(--bg)] border border-[var(--border)] p-3">
                <p className="text-[9px] text-[var(--danger)] uppercase tracking-wider mb-1.5 font-medium">Before</p>
                <div className="space-y-0.5 font-mono text-[10px] text-[var(--text-tertiary)]">
                  <p>Make: <span className="text-[var(--warning)]">—empty—</span></p>
                  <p>Model: <span className="text-[var(--warning)]">—empty—</span></p>
                  <p>Lens: <span className="text-[var(--warning)]">—empty—</span></p>
                </div>
              </div>
              <div className="rounded-lg bg-[var(--bg)] border border-[var(--border)] p-3">
                <p className="text-[9px] text-[var(--success)] uppercase tracking-wider mb-1.5 font-medium">After</p>
                <div className="space-y-0.5 font-mono text-[10px]">
                  <p>Make: Canon</p>
                  <p>Model: EOS R5</p>
                  <p>Lens: RF 50mm F1.2 L USM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Batch */}
          <div className="md:col-span-2 rounded-xl border border-[var(--border)] bg-[var(--bg-raised)] p-6 flex flex-col">
            <p className="text-[11px] uppercase tracking-wider text-[var(--text-tertiary)] font-medium mb-2">Batch</p>
            <h3 className="text-[15px] font-semibold mb-1.5">Process hundreds at once</h3>
            <p className="text-[13px] text-[var(--text-secondary)] leading-[1.7]">
              Drop a folder. Strip all. No clicking through files one by one.
            </p>
            <div className="mt-auto pt-5">
              <div className="flex items-center gap-2">
                <div className="h-2 flex-1 bg-[var(--bg-hover)] border border-[var(--border)] rounded-full overflow-hidden">
                  <div className="h-full w-[73%] bg-[var(--text)] rounded-full" />
                </div>
                <span className="text-[10px] text-[var(--text-tertiary)] font-mono">146/200</span>
              </div>
            </div>
          </div>

          {/* AI Detection */}
          <div className="md:col-span-3 rounded-xl border border-[var(--border)] bg-[var(--bg-raised)] p-6">
            <p className="text-[11px] uppercase tracking-wider text-[var(--text-tertiary)] font-medium mb-2">AI Detection</p>
            <h3 className="text-[15px] font-semibold mb-1.5">Detects and removes AI markers</h3>
            <p className="text-[13px] text-[var(--text-secondary)] leading-[1.7] mb-4">
              C2PA, Content Credentials, Stable Diffusion params, DALL·E signatures — identified and removable.
            </p>
            <div className="flex flex-wrap gap-1.5">
              {["C2PA", "DALL·E", "Midjourney", "SD params", "Adobe Firefly", "ChatGPT"].map(tag => (
                <span key={tag} className="text-[10px] px-2 py-0.5 rounded-md border border-[var(--border)] text-[var(--text-secondary)] font-medium">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Rename */}
          <div className="md:col-span-3 rounded-xl border border-[var(--border)] bg-[var(--bg-raised)] p-6">
            <p className="text-[11px] uppercase tracking-wider text-[var(--text-tertiary)] font-medium mb-2">Rename</p>
            <h3 className="text-[15px] font-semibold mb-1.5">Batch rename like Finder</h3>
            <p className="text-[13px] text-[var(--text-secondary)] leading-[1.7] mb-4">
              Replace Text, Add Text, or Format with numbering. Live preview.
            </p>
            <div className="font-mono text-[11px] text-[var(--text-tertiary)] space-y-0.5">
              <p>IMG_4521.jpg → <span className="text-[var(--text)]">vacation-001.jpg</span></p>
              <p>IMG_4522.jpg → <span className="text-[var(--text)]">vacation-002.jpg</span></p>
              <p>IMG_4523.jpg → <span className="text-[var(--text)]">vacation-003.jpg</span></p>
            </div>
          </div>

          {/* Privacy */}
          <div className="md:col-span-6 rounded-xl border border-[var(--border)] bg-[var(--bg-raised)] p-6">
            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-12">
              <div className="flex items-center gap-4">
                <ShieldCheck />
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-[var(--success)] font-medium mb-1">Privacy</p>
                  <h3 className="text-[15px] font-semibold">Never leaves your machine</h3>
                </div>
              </div>
              <div className="flex items-center gap-8 text-[12px] text-[var(--text-secondary)]">
                <div><p className="text-[18px] font-bold text-[var(--text)]">0</p><p className="text-[var(--text-tertiary)]">network requests</p></div>
                <div><p className="text-[18px] font-bold text-[var(--text)]">0</p><p className="text-[var(--text-tertiary)]">accounts needed</p></div>
                <div><p className="text-[18px] font-bold text-[var(--text)]">0</p><p className="text-[var(--text-tertiary)]">data uploaded</p></div>
                <div><p className="text-[18px] font-bold text-[var(--text)]">100%</p><p className="text-[var(--text-tertiary)]">local</p></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
