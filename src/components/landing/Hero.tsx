import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, PlayCircle, ClipboardCheck, Award } from "lucide-react";
import heroImg from "@/assets/utility-workers.jpg";

const ROTATING = ["Engineers", "Technicians", "Officers"];

const tiles = [
  { icon: BookOpen, label: "My Courses", to: "/courses" },
  { icon: PlayCircle, label: "Video Library", to: "/library" },
  { icon: ClipboardCheck, label: "Quizzes", to: "/quizzes" },
  { icon: Award, label: "Certificates", to: "/certificates" },
];

export function Hero() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % ROTATING.length), 2400);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative isolate overflow-hidden">
      <img
        src={heroImg}
        alt="ECG training crew at substation"
        width={1920}
        height={1280}
        className="absolute inset-0 -z-10 h-full w-full object-cover"
      />
      <div className="gradient-hero absolute inset-0 -z-10" />

      <div className="mx-auto max-w-7xl px-6 pb-24 pt-44 lg:pt-56">
        <div className="max-w-3xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-yellow/40 bg-yellow/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-yellow">
            <span className="h-1.5 w-1.5 rounded-full bg-yellow" />
            Cohort 2026 · Orientation Open
          </div>

          <h1 className="font-display text-[clamp(2.75rem,7vw,5.5rem)] font-light leading-[1] text-white text-balance">
            Powering Knowledge for new
            <span className="block">
              <span key={i} className="inline-block text-yellow">
                {ROTATING[i]}
                <span className="blink ml-1 inline-block h-[0.9em] w-[3px] -translate-y-1 bg-yellow align-middle" />
              </span>
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-lg text-white/85">
            The official Electricity Company of Ghana learning portal — course
            materials, training videos, and quizzes to guide every new staff
            member through orientation.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link
              to="/documents"
              className="inline-flex items-center gap-3 rounded-sm bg-red-cta px-7 py-3.5 text-sm font-semibold uppercase tracking-wider text-white shadow-card transition hover:bg-red-cta-deep"
            >
              Start Orientation <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/courses"
              className="inline-flex items-center gap-3 rounded-sm border border-white/30 px-7 py-3.5 text-sm font-semibold uppercase tracking-wider text-white transition hover:border-yellow hover:text-yellow"
            >
              Browse Courses
            </Link>
          </div>
        </div>

        {/* Quick access tiles */}
        <div className="mt-24 grid grid-cols-1 items-end gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 className="font-display text-3xl font-light uppercase leading-tight text-white sm:text-4xl">
              Everything you need <br />
              to <span className="text-yellow">get up to speed</span>
            </h2>
          </div>

          <div className="lg:col-span-8">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {tiles.map(({ icon: Icon, label, to }) => (
                <Link
                  key={label}
                  to={to}
                  className="group flex flex-col items-center gap-3 rounded-md border border-white/10 bg-white/5 p-5 text-center text-white backdrop-blur-sm transition hover:-translate-y-1 hover:border-yellow/50 hover:bg-white/10"
                >
                  <div className="grid h-14 w-14 place-items-center rounded-md bg-yellow text-brand-dark transition group-hover:scale-110">
                    <Icon className="h-7 w-7" strokeWidth={2.5} />
                  </div>
                  <span className="text-sm font-medium uppercase tracking-wide">{label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}