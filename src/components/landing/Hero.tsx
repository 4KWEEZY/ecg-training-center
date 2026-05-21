import { useEffect, useState, useRef } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  PlayCircle,
  ClipboardCheck,
  Award,
  Users,
  GraduationCap,
  FlaskConical,
  LayoutGrid,
  Activity,
  Zap,
  ShieldCheck,
  BarChart3,
} from "lucide-react";

import heroImg from "@/assets/utility-workers.jpg";

const ROTATING = ["Grid Engineers", "Power Technicians", "Safety Officers", "Utility Contractors"];

const tiles = [
  {
    icon: BookOpen,
    label: "My Courses",
    to: "/courses",
    desc: "Active curriculum blocks",
    badge: "Track Progress",
  },
  {
    icon: PlayCircle,
    label: "Video Library",
    to: "/library",
    desc: "Live field simulations",
    badge: "Stream HD",
  },
  {
    icon: ClipboardCheck,
    label: "Quizzes & Tests",
    to: "/quizzes",
    desc: "Automated evaluations",
    badge: "Verify Marks",
  },
  {
    icon: Award,
    label: "Certificates",
    to: "/certificates",
    desc: "Unique audit keys",
    badge: "LinkedIn Ready",
  },
];

const stats = [
  {
    icon: GraduationCap,
    value: 4200,
    label: "Certified Alumni",
    suffix: "+",
  },
  {
    icon: LayoutGrid,
    value: 42,
    label: "Active Programs",
    suffix: "",
  },
  {
    icon: FlaskConical,
    value: 14,
    label: "Simulators & Labs",
    suffix: "",
  },
  {
    icon: Users,
    value: 8500,
    label: "Staff Evaluated",
    suffix: "+",
  },
];

function useCountUp(target: number, duration = 1800, active = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;

    let start = 0;
    const step = target / (duration / 16);

    const timer = setInterval(() => {
      start += step;

      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [target, duration, active]);

  return count;
}

function StatCard({
  icon: Icon,
  value,
  label,
  suffix,
  active,
}: (typeof stats)[0] & { active: boolean }) {
  const count = useCountUp(value, 1800, active);

  return (
    <div className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-yellow/30 hover:bg-white/[0.05] hover:shadow-[0_0_40px_rgba(255,204,0,0.08)] backdrop-blur-md">
      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-yellow/15 text-yellow">
        <Icon className="h-5 w-5" strokeWidth={1.5} />
      </div>

      <div>
        <span className="block font-display text-2xl sm:text-3xl font-semibold tracking-tight text-white">
          {count.toLocaleString()}
          {suffix}
        </span>

        <span className="mt-0.5 block text-[10px] font-bold uppercase tracking-widest text-white/40">
          {label}
        </span>
      </div>
    </div>
  );
}

export function Hero() {
  const [i, setI] = useState(0);
  const [statsVisible, setStatsVisible] = useState(false);

  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % ROTATING.length), 2600);

    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setStatsVisible(true);
      },
      { threshold: 0.1 },
    );

    if (statsRef.current) observer.observe(statsRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative isolate min-h-[90vh] overflow-hidden border-b border-white/5 bg-brand-dark">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-brand-dark">
        <img
          src={heroImg}
          alt="ECG training crew at substation grid"
          width={1920}
          height={1280}
          className="h-full w-full object-cover object-center opacity-30 scale-110 blur-[1px]"
          loading="eager"
        />

        {/* Cinematic Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-dark via-[#102544]/90 to-[#091524]/95" />

        {/* Glow Effects */}
        <div className="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-yellow/10 blur-3xl" />

        <div className="absolute right-0 top-0 h-[300px] w-[300px] rounded-full bg-blue-500/10 blur-3xl" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,204,0,0.08),transparent_35%)]" />
      </div>

      <div className="relative z-20 mx-auto flex w-full max-w-7xl flex-col justify-between gap-16 px-6 pt-24 pb-16">
        {/* Main Grid */}
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-12 lg:gap-10">
          {/* Left Content */}
          <div className="space-y-8 lg:col-span-7">
            {/* Live Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-yellow/20 bg-yellow/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.25em] text-yellow shadow-inner backdrop-blur-md">
              <Zap className="h-3.5 w-3.5 animate-pulse" />
              ECG Academy Cohort 2026 Registry Live
            </div>

            {/* Main Heading */}
            <h1 className="font-display text-5xl sm:text-6xl lg:text-8xl font-light uppercase tracking-wide leading-[0.95] text-white drop-shadow-[0_5px_30px_rgba(0,0,0,0.5)]">
              Powering Knowledge
              <br />
              For Specialized
              <br />
              <span className="relative mt-2 inline-block h-[1.1em] font-normal text-yellow">
                <span
                  key={i}
                  className="absolute left-0 top-0 inline-flex items-center whitespace-nowrap animate-fade-in"
                >
                  {ROTATING[i]}

                  <span className="ml-2 h-8 w-1.5 shrink-0 bg-yellow md:h-12 animate-blink" />
                </span>
              </span>
            </h1>

            {/* Description */}
            <p className="max-w-2xl text-sm leading-relaxed text-white/65 md:text-base">
              The centralized digital learning infrastructure for the Electricity Company of Ghana —
              synchronizing curriculum management, compliance tracking, certification verification,
              and operational workforce development through a modern enterprise-grade LMS ecosystem.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-4 pt-2 sm:flex-row">
              <Link
                to="/courses"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-yellow to-amber-400 px-8 py-4 text-xs font-bold uppercase tracking-[0.18em] text-brand-dark shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-yellow/20"
              >
                Access Registry
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                to="/library"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-8 py-4 text-xs font-bold uppercase tracking-[0.18em] text-white transition-all duration-300 hover:border-yellow/30 hover:bg-white/[0.05]"
              >
                Explore Media
              </Link>
            </div>

            {/* Mini Metrics */}
            <div className="grid grid-cols-2 gap-4 pt-4 sm:grid-cols-4">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-md">
                <ShieldCheck className="mb-2 h-5 w-5 text-yellow" />
                <div className="text-xl font-bold text-white">99.9%</div>
                <div className="text-[10px] uppercase tracking-widest text-white/40">
                  System Uptime
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-md">
                <BarChart3 className="mb-2 h-5 w-5 text-yellow" />
                <div className="text-xl font-bold text-white">24/7</div>
                <div className="text-[10px] uppercase tracking-widest text-white/40">
                  Monitoring
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-md">
                <Activity className="mb-2 h-5 w-5 text-yellow" />
                <div className="text-xl font-bold text-white">AI</div>
                <div className="text-[10px] uppercase tracking-widest text-white/40">
                  Smart Tracking
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-md">
                <Zap className="mb-2 h-5 w-5 text-yellow" />
                <div className="text-xl font-bold text-white">Secure</div>
                <div className="text-[10px] uppercase tracking-widest text-white/40">
                  Cloud Access
                </div>
              </div>
            </div>
          </div>

          {/* Right Dashboard Panel */}
          <div className="space-y-6 lg:col-span-5">
            {/* Quick Access */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-7 shadow-[0_20px_60px_rgba(0,0,0,0.4)] backdrop-blur-2xl">
              <div className="mb-6 flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-yellow" />

                  <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-white/50">
                    Quick Access
                  </h2>
                </div>

                <div className="h-2.5 w-2.5 rounded-full bg-green-400 animate-pulse" />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {tiles.map((tile, idx) => (
                  <Link
                    key={tile.label}
                    to={tile.to}
                    className="group relative overflow-hidden rounded-2xl border border-white/10 bg-brand-dark/50 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-yellow/30 hover:bg-white/[0.04] hover:shadow-[0_0_40px_rgba(255,204,0,0.08)]"
                  >
                    <span className="absolute right-3 top-1 font-display text-5xl font-black text-white/[0.03]">
                      0{idx + 1}
                    </span>

                    <div className="space-y-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-yellow">
                        <tile.icon className="h-5 w-5" />
                      </div>

                      <div>
                        <span className="block text-xs font-semibold uppercase tracking-wide text-white">
                          {tile.label}
                        </span>

                        <span className="mt-1 block text-[10px] text-white/40">{tile.desc}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div ref={statsRef} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <StatCard key={s.label} {...s} active={statsVisible} />
          ))}
        </div>
      </div>
    </section>
  );
}
