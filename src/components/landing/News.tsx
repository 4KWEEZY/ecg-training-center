import { Clock, Video, ClipboardCheck } from "lucide-react";

const items = [
  {
    date: "18 May 2026",
    cat: "Live Session",
    icon: Video,
    title: "Welcome briefing with the Director of Human Resources",
    meta: "10:00 GMT · Microsoft Teams · 60 min",
  },
  {
    date: "22 May 2026",
    cat: "Quiz Deadline",
    icon: ClipboardCheck,
    title: "Module 1 — Workplace Safety end-of-module assessment",
    meta: "Submit by 23:59 GMT · 30 questions · 2 attempts",
  },
  {
    date: "25 May 2026",
    cat: "Workshop",
    icon: Clock,
    title: "Hands-on: Reading prepaid meters and resolving common faults",
    meta: "Substation Training Yard, Achimota · 09:00–13:00",
  },
];

export function News() {
  return (
    <section id="schedule" className="bg-brand-deep py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="text-xs font-bold uppercase tracking-[0.3em] text-yellow">
              This week
            </div>
            <h2 className="mt-3 font-display text-4xl font-light uppercase text-white sm:text-5xl">
              Upcoming <br /> Sessions
            </h2>
            <p className="mt-5 max-w-sm text-white/70">
              Live training, workshops, and quiz deadlines for the active orientation cohort. Add
              events to your calendar from the trainee dashboard.
            </p>
            <a
              href="#"
              className="mt-8 inline-block text-sm font-semibold uppercase tracking-wider text-yellow hover:underline"
            >
              Full schedule →
            </a>
          </div>

          <div className="lg:col-span-8">
            <ul className="divide-y divide-white/10 border-y border-white/10">
              {items.map(({ date, cat, icon: Icon, title, meta }) => (
                <li key={title}>
                  <a
                    href="#"
                    className="group grid grid-cols-12 items-center gap-6 py-7 transition hover:bg-white/[0.03]"
                  >
                    <div className="col-span-3 sm:col-span-2">
                      <div className="font-display text-2xl font-semibold text-yellow">
                        {date.split(" ")[0]}
                      </div>
                      <div className="text-xs uppercase tracking-wider text-white/60">
                        {date.split(" ").slice(1).join(" ")}
                      </div>
                    </div>
                    <div className="col-span-9 sm:col-span-10">
                      <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.25em] text-red-cta">
                        <Icon className="h-3.5 w-3.5" /> {cat}
                      </div>
                      <h3 className="mt-1 font-display text-xl font-medium text-white transition group-hover:text-yellow sm:text-2xl">
                        {title}
                      </h3>
                      <div className="mt-1 text-xs text-white/55">{meta}</div>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
