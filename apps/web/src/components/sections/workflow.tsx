export function WorkflowSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-[800px] px-6">
        <div className="text-center mb-10">
          <h2 className="text-[24px] font-semibold">Three ways to use it</h2>
        </div>

        <div className="space-y-3">
          <Card num="1" title="Full app" desc="Open ExifCloak, drop files, inspect every field, edit or strip what you choose." />
          <Card num="2" title="Menu bar" desc="Drop an image on the menu bar icon. Stripped in under a second. No window needed." />
          <Card num="3" title="Batch" desc="Import a folder. Apply an action to all files at once. Rename them. Ship." />
        </div>
      </div>
    </section>
  );
}

function Card({ num, title, desc }: { num: string; title: string; desc: string }) {
  return (
    <div className="flex gap-4 items-start p-5 rounded-xl border border-[var(--border)] bg-[var(--bg-raised)]">
      <span className="text-[24px] font-bold text-[var(--border)] leading-none w-[30px] flex-shrink-0">{num}</span>
      <div>
        <h3 className="text-[14px] font-semibold">{title}</h3>
        <p className="text-[13px] text-[var(--text-secondary)] mt-0.5">{desc}</p>
      </div>
    </div>
  );
}
