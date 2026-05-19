export function Marquee() {
  const items = [
    "MIT", "Figma", "Stripe", "Notion", "Linear", "Pixar",
    "RISD", "Harvard", "Vercel", "Penguin", "The New Yorker",
  ];
  const row = [...items, ...items];
  return (
    <section className="border-y border-border bg-paper py-6">
      <div className="mb-3 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-ink-soft">
        Trusted by teams & faculty at
      </div>
      <div className="flex overflow-hidden">
        <div className="marquee-track flex shrink-0 gap-14 pr-14 font-display text-2xl text-ink-soft">
          {row.map((it, i) => (
            <span key={i} className="whitespace-nowrap italic">{it}</span>
          ))}
        </div>
        <div className="marquee-track flex shrink-0 gap-14 pr-14 font-display text-2xl text-ink-soft" aria-hidden>
          {row.map((it, i) => (
            <span key={i} className="whitespace-nowrap italic">{it}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
