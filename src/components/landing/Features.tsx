const features = [
  {
    n: "01",
    title: "Cohort & self-paced",
    body: "Run synchronous cohorts or open self-paced tracks from one course definition. No duplicate work.",
  },
  {
    n: "02",
    title: "Living lessons",
    body: "Embed code sandboxes, Figma boards, quizzes, and live polls directly inside any lesson.",
  },
  {
    n: "03",
    title: "Adaptive paths",
    body: "Lumen learns where students struggle and quietly reorders practice to build mastery.",
  },
  {
    n: "04",
    title: "Built-in mentorship",
    body: "Office hours, async feedback threads, and 1:1 video — without bolting on three other tools.",
  },
  {
    n: "05",
    title: "Real credentials",
    body: "Issue verifiable certificates and skill badges that students can share to LinkedIn in one click.",
  },
  {
    n: "06",
    title: "Calm by default",
    body: "No streaks, no manipulative gamification. Progress shown honestly, on the learner's terms.",
  },
];

export function Features() {
  return (
    <section id="features" className="mx-auto max-w-7xl px-6 py-28">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-clay">
            The platform
          </span>
          <h2 className="mt-4 font-display text-5xl font-light leading-[1.05] tracking-tight text-ink">
            Everything you need to <em className="italic">teach well</em>. Nothing you don't.
          </h2>
          <p className="mt-6 max-w-sm text-ink-soft">
            We rebuilt the LMS from scratch — for instructors who care about craft and learners who
            care about substance.
          </p>
        </div>

        <div className="lg:col-span-8">
          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2">
            {features.map((f) => (
              <div key={f.n} className="group relative bg-background p-8 transition hover:bg-paper">
                <div className="flex items-baseline justify-between">
                  <span className="font-mono text-xs text-ink-soft">{f.n}</span>
                  <span className="h-2 w-2 rounded-full bg-lime opacity-0 transition group-hover:opacity-100" />
                </div>
                <h3 className="mt-6 font-display text-2xl font-medium text-ink">{f.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
