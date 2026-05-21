export function Quote() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-28">
      <div className="font-mono text-xs uppercase tracking-[0.3em] text-clay">
        A note from a learner
      </div>
      <blockquote className="mt-8 font-display text-[clamp(1.75rem,3.5vw,3rem)] font-light leading-[1.15] tracking-tight text-ink text-balance">
        <span className="text-clay">"</span>I've taken three platforms' worth of courses. Lumen is
        the only one that felt like reading a great book — quiet, confident, and somehow it changed
        how I work.<span className="text-clay">"</span>
      </blockquote>
      <div className="mt-8 flex items-center gap-4">
        <div className="h-12 w-12 rounded-full bg-paper-deep" />
        <div>
          <div className="font-medium text-ink">Sasha Mendel</div>
          <div className="text-sm text-ink-soft">Senior Designer · Berlin</div>
        </div>
      </div>
    </section>
  );
}
