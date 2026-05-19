import { Link } from "@tanstack/react-router";
import { ShieldCheck, Zap, Users, Gauge, Network, Scale, PlayCircle, FileText, ClipboardList } from "lucide-react";

const courses = [
  {
    icon: ShieldCheck,
    title: "Workplace Safety & Compliance",
    body: "PPE, working at height, electrical hazards, and emergency response on the job.",
    weeks: 2, lessons: 14, quizzes: 4,
  },
  {
    icon: Zap,
    title: "Distribution Operations 101",
    body: "Substations, feeders, transformers — how ECG's distribution network is structured.",
    weeks: 3, lessons: 22, quizzes: 6,
  },
  {
    icon: Users,
    title: "Customer Service Essentials",
    body: "Front-desk standards, handling complaints, and the ECG service charter.",
    weeks: 2, lessons: 12, quizzes: 3,
  },
  {
    icon: Gauge,
    title: "Metering & Billing Systems",
    body: "Prepaid and postpaid meters, smart metering, and the billing platform walkthrough.",
    weeks: 2, lessons: 16, quizzes: 5,
  },
  {
    icon: Network,
    title: "Network Protection & Faults",
    body: "Fault location, restoration protocols, and outage communication procedures.",
    weeks: 3, lessons: 18, quizzes: 4,
  },
  {
    icon: Scale,
    title: "Code of Conduct & Ethics",
    body: "ECG values, anti-bribery policy, data protection, and disciplinary procedures.",
    weeks: 1, lessons: 8, quizzes: 2,
  },
];

export function Services() {
  return (
    <section id="courses" className="bg-brand py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.3em] text-yellow">Curriculum</div>
            <h2 className="mt-3 font-display text-4xl font-light uppercase text-white sm:text-5xl">
              Orientation Course Tracks
            </h2>
            <p className="mt-4 max-w-xl text-white/70">
              Six required modules every new ECG staff member completes during
              the first six weeks of orientation. Self-paced video lessons,
              downloadable materials, and end-of-module quizzes.
            </p>
          </div>
          <Link 
            to="/courses" 
            className="text-sm font-semibold uppercase tracking-wider text-yellow hover:underline"
          >
            View full catalogue →
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-md bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map(({ icon: Icon, title, body, weeks, lessons, quizzes }) => (
            <Link
              key={title}
              to="/courses"
              className="group relative flex flex-col bg-brand-deep p-8 transition hover:bg-brand-dark"
            >
              <div className="mb-5 flex items-center justify-between">
                <div className="grid h-12 w-12 place-items-center rounded-sm border-2 border-yellow text-yellow transition group-hover:bg-yellow group-hover:text-brand-dark">
                  <Icon className="h-6 w-6" strokeWidth={2.2} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">
                  {weeks} {weeks === 1 ? "week" : "weeks"}
                </span>
              </div>
              <h3 className="font-display text-2xl font-semibold uppercase text-white">{title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-white/70">{body}</p>

              <div className="mt-5 flex items-center gap-5 border-t border-white/10 pt-4 text-xs text-white/60">
                <span className="flex items-center gap-1.5"><PlayCircle className="h-3.5 w-3.5 text-yellow" /> {lessons} lessons</span>
                <span className="flex items-center gap-1.5"><FileText className="h-3.5 w-3.5 text-yellow" /> Notes</span>
                <span className="flex items-center gap-1.5"><ClipboardList className="h-3.5 w-3.5 text-yellow" /> {quizzes} quizzes</span>
              </div>

              <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-red-cta transition-all group-hover:w-full" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}