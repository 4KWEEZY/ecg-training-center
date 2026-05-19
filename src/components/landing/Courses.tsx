const courses = [
  {
    cat: "Design",
    title: "Type & Composition",
    teacher: "Mira Tanaka",
    weeks: 6,
    price: "$280",
    color: "bg-paper-deep",
    accent: "text-clay",
  },
  {
    cat: "Engineering",
    title: "Systems Thinking for Builders",
    teacher: "Andrés Vega",
    weeks: 8,
    price: "$340",
    color: "bg-ink",
    accent: "text-lime",
    dark: true,
  },
  {
    cat: "Writing",
    title: "The Essay as a Tool",
    teacher: "Hana Brooks",
    weeks: 4,
    price: "$180",
    color: "bg-lime",
    accent: "text-ink",
  },
  {
    cat: "Product",
    title: "Research that Ships",
    teacher: "Devon Park",
    weeks: 5,
    price: "$220",
    color: "bg-paper-deep",
    accent: "text-clay",
  },
];

export function Courses() {
  return (
    <section id="courses" className="bg-paper py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-clay">Now enrolling</span>
            <h2 className="mt-4 font-display text-5xl font-light tracking-tight text-ink">
              Featured <em className="italic">cohorts</em>
            </h2>
          </div>
          <div className="flex gap-2">
            {["All", "Design", "Engineering", "Writing", "Product", "Business"].map((t, i) => (
              <button
                key={t}
                className={`rounded-full border px-4 py-2 text-xs font-medium transition ${
                  i === 0
                    ? "border-ink bg-ink text-background"
                    : "border-border bg-background text-ink-soft hover:border-ink hover:text-ink"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {courses.map((c) => (
            <article
              key={c.title}
              className={`group flex h-80 flex-col justify-between rounded-2xl p-6 shadow-card transition hover:-translate-y-1 ${c.color} ${c.dark ? "text-background" : "text-ink"}`}
            >
              <div className="flex items-center justify-between">
                <span className={`font-mono text-[10px] uppercase tracking-widest ${c.accent}`}>{c.cat}</span>
                <span className={`text-xs ${c.dark ? "text-background/60" : "text-ink-soft"}`}>{c.weeks} weeks</span>
              </div>

              <h3 className="font-display text-3xl font-medium leading-tight">{c.title}</h3>

              <div className={`flex items-center justify-between border-t pt-4 ${c.dark ? "border-background/15" : "border-ink/10"}`}>
                <div>
                  <div className={`text-[10px] uppercase tracking-widest ${c.dark ? "text-background/50" : "text-ink-soft"}`}>Taught by</div>
                  <div className="text-sm font-medium">{c.teacher}</div>
                </div>
                <div className="font-display text-2xl">{c.price}</div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 text-center">
          <a href="#" className="font-display text-lg italic underline-grow">
            See the full catalog →
          </a>
        </div>
      </div>
    </section>
  );
}
