export function TeachCTA() {
  return (
    <section id="instructors" className="mx-auto max-w-7xl px-6 pb-28">
      <div className="relative overflow-hidden rounded-3xl bg-ink p-10 text-background sm:p-16">
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(var(--accent-lime) 1px, transparent 1px), linear-gradient(90deg, var(--accent-lime) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="relative grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-lime">
              For instructors
            </span>
            <h2 className="mt-4 font-display text-[clamp(2.5rem,5vw,4.5rem)] font-light leading-[1] tracking-tight">
              Teach what only <em className="italic text-lime">you</em> can teach.
            </h2>
            <p className="mt-6 max-w-xl text-background/70">
              Bring your craft to thousands of motivated learners. Keep 80% of revenue, own your
              audience, and get a producer who actually answers your messages.
            </p>
          </div>
          <div className="lg:col-span-5">
            <div className="grid gap-3">
              {[
                ["80%", "average instructor revenue share"],
                ["$48k", "median first-cohort earnings"],
                ["7 days", "from idea to launch with our team"],
              ].map(([n, l]) => (
                <div
                  key={l}
                  className="flex items-baseline justify-between border-b border-background/15 pb-3"
                >
                  <div className="font-display text-3xl">{n}</div>
                  <div className="text-sm text-background/60">{l}</div>
                </div>
              ))}
              <button className="mt-4 inline-flex items-center justify-center gap-2 rounded-md bg-lime px-6 py-3.5 font-medium text-ink transition hover:bg-lime/90">
                Apply to teach →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
