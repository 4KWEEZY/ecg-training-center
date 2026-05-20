import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ShieldAlert,
  ArrowUpRight,
  Layers,
  Zap,
  Award,
  Terminal,
  Building2,
  Cpu,
  ArrowRight,
  CheckCircle,
  X,
  PlayCircle,
  GraduationCap,
  Users,
  BookOpen,
  Sparkles,
} from "lucide-react";

import { TopBar } from "@/components/landing/TopBar";
import { Nav } from "@/components/landing/Nav";
import { Footer } from "@/components/landing/Footer";
import { News } from "@/components/landing/News";

import heroImage from "@/assets/utility-workers.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "ECG Training Center — Premium Learning Architecture",
      },
      {
        name: "description",
        content:
          "Centralized learning, engineering simulations, and certifications for ECG operations.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const [showAlert, setShowAlert] = useState(true);

  const metrics = [
    {
      value: "4,200+",
      label: "Certified Engineers",
      desc: "Successfully deployed across regional grids.",
    },
    {
      value: "14+",
      label: "Power Labs",
      desc: "Equipped with transformer & breaker simulators.",
    },
    {
      value: "98.6%",
      label: "Assessment Success",
      desc: "Institutional benchmark pass rate.",
    },
    {
      value: "8,500+",
      label: "Staff Trained",
      desc: "Operational workforce evaluations completed.",
    },
  ];

  const trainingCategories = [
    {
      title: "Power Systems Engineering",
      desc:
        "Substation operations, relay protection systems, HV switching procedures, and distribution network diagnostics.",
      count: "12 Modules",
      icon: Zap,
      accent:
        "text-yellow border-yellow/20 bg-yellow/5",
    },
    {
      title: "Renewable Energy Technology",
      desc:
        "Grid-tied solar systems, industrial battery storage, smart inverter systems, and energy optimization.",
      count: "8 Modules",
      icon: Layers,
      accent:
        "text-green-400 border-green-500/20 bg-green-500/5",
    },
    {
      title: "Grid Automation & SCADA",
      desc:
        "Advanced telemetry, smart metering infrastructure, automation systems, and fiber communication diagnostics.",
      count: "16 Modules",
      icon: Cpu,
      accent:
        "text-blue-400 border-blue-500/20 bg-blue-500/5",
    },
    {
      title: "Contractor Certification",
      desc:
        "Electrical wiring regulations, safety compliance, installation standards, and competency assessments.",
      count: "6 Modules",
      icon: Award,
      accent:
        "text-purple-400 border-purple-500/20 bg-purple-500/5",
    },
  ];

  const features = [
    {
      icon: BookOpen,
      title: "Interactive Learning",
      desc:
        "Professional engineering modules with practical grid simulations.",
    },
    {
      icon: PlayCircle,
      title: "Video Demonstrations",
      desc:
        "Real-time operational procedures and field demonstrations.",
    },
    {
      icon: GraduationCap,
      title: "Digital Certification",
      desc:
        "Industry-recognized certifications with secure verification.",
    },
    {
      icon: Users,
      title: "Institutional Training",
      desc:
        "Specialized workforce development for utility operations.",
    },
  ];

  return (
    <div className="min-h-screen bg-brand-dark text-white overflow-x-hidden">

      {/* ───────────────── ALERT BAR ───────────────── */}
      {showAlert && (
        <div className="relative z-[60] border-b border-red-500/20 bg-red-500/10 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-3">
            
            <div className="flex items-center gap-3">
              <div className="rounded bg-red-500/20 p-2 text-red-400">
                <ShieldAlert className="h-4 w-4" />
              </div>

              <p className="text-xs text-white/80 leading-relaxed">
                <span className="font-bold uppercase tracking-wider text-red-400">
                  Official Security Notice:
                </span>{" "}
                ECG Training Center never requests unofficial payments through
                personal contacts or third-party agents.
              </p>
            </div>

            <button
              onClick={() => setShowAlert(false)}
              className="text-white/40 hover:text-white transition"
            >
              <X className="h-4 w-4" />
            </button>

          </div>
        </div>
      )}

      {/* ───────────────── HEADER ───────────────── */}
      <TopBar />
      <Nav />

      <main>

        {/* ───────────────── HERO SECTION ───────────────── */}
        <section className="relative overflow-hidden border-b border-white/5">

          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src={heroImage}
              alt="ECG Utility Operations"
              className="h-full w-full object-cover object-center opacity-20"
            />

            <div className="absolute inset-0 bg-brand-dark/80" />

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,196,0,0.15),transparent_30%)]" />

            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:5rem_5rem]" />
          </div>

          <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 gap-16 px-6 pb-28 pt-44 lg:grid-cols-12 lg:items-center">

            {/* LEFT */}
            <div className="lg:col-span-7 space-y-8">

              <div className="inline-flex items-center gap-2 rounded-full border border-yellow/20 bg-yellow/10 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-yellow backdrop-blur-xl">
                <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                ECG Digital Learning Platform
              </div>

              <div className="space-y-6">

                <h1 className="font-display text-5xl font-light uppercase leading-[1.02] tracking-wide text-white sm:text-6xl lg:text-7xl">
                  Future-Ready
                  <br />
                  <span className="font-normal text-yellow">
                    Power Training
                  </span>
                  <br />
                  Infrastructure
                </h1>

                <p className="max-w-2xl text-sm leading-relaxed text-white/60 sm:text-base">
                  A modern enterprise-grade learning platform powering technical
                  workforce development for the Electricity Company of Ghana.
                  Access engineering programs, certifications, operational
                  simulations, and digital evaluation systems from one unified
                  academy portal.
                </p>

              </div>

              <div className="flex flex-col gap-4 sm:flex-row">

                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-yellow to-amber-400 px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] text-brand-dark shadow-2xl transition-all duration-300 hover:scale-[1.02]"
                >
                  Access Portal
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  to="/courses"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-8 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-xl transition-all duration-300 hover:border-yellow/20 hover:bg-white/10"
                >
                  Explore Programs
                </Link>

              </div>

            </div>

            {/* RIGHT */}
            <div className="lg:col-span-5">

              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.45)]">

                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      Academy Systems
                    </h3>
                    <p className="mt-1 text-xs uppercase tracking-widest text-white/40">
                      Operational Modules
                    </p>
                  </div>

                  <div className="rounded-full bg-green-500/10 px-3 py-1 text-[10px] uppercase tracking-widest text-green-400 border border-green-500/20">
                    Online
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-1 gap-4">

                  {features.map((item, idx) => {
                    const Icon = item.icon;

                    return (
                      <div
                        key={idx}
                        className="group rounded-2xl border border-white/5 bg-brand-dark/40 p-5 transition-all duration-300 hover:border-yellow/20 hover:bg-white/[0.04]"
                      >
                        <div className="flex items-start gap-4">

                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-yellow/20 bg-yellow/10 text-yellow">
                            <Icon className="h-5 w-5" />
                          </div>

                          <div className="space-y-1">
                            <h4 className="text-sm font-semibold text-white group-hover:text-yellow transition-colors">
                              {item.title}
                            </h4>

                            <p className="text-xs leading-relaxed text-white/50">
                              {item.desc}
                            </p>
                          </div>

                        </div>
                      </div>
                    );
                  })}

                </div>

              </div>

            </div>

          </div>
        </section>

        {/* ───────────────── METRICS ───────────────── */}
        <section className="relative z-20 -mt-12 px-6">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 rounded-3xl border border-white/10 bg-brand-deep/60 p-8 backdrop-blur-2xl shadow-2xl md:grid-cols-4">

            {metrics.map((metric, idx) => (
              <div key={idx} className="space-y-2">

                <h3 className="font-display text-4xl font-semibold tracking-tight text-yellow">
                  {metric.value}
                </h3>

                <div>
                  <p className="text-xs uppercase tracking-widest text-white font-medium">
                    {metric.label}
                  </p>

                  <p className="mt-1 text-xs leading-relaxed text-white/40">
                    {metric.desc}
                  </p>
                </div>

              </div>
            ))}

          </div>
        </section>

        {/* ───────────────── PROGRAMS ───────────────── */}
        <section className="mx-auto max-w-7xl px-6 py-28">

          <div className="mb-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">

            <div className="space-y-4">

              <span className="rounded border border-yellow/20 bg-yellow/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-yellow">
                Specialized Engineering Programs
              </span>

              <h2 className="font-display text-4xl font-light uppercase tracking-wide text-white md:text-5xl">
                Technical Training
                <span className="font-normal text-yellow">
                  {" "}Departments
                </span>
              </h2>

            </div>

            <p className="max-w-xl text-sm leading-relaxed text-white/50">
              Institutional engineering modules aligned with ECG operational
              deployment frameworks and utility workforce standards.
            </p>

          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">

            {trainingCategories.map((cat, idx) => {
              const Icon = cat.icon;

              return (
                <div
                  key={idx}
                  className="group rounded-3xl border border-white/5 bg-white/[0.02] p-7 transition-all duration-300 hover:-translate-y-1 hover:border-yellow/20 hover:bg-white/[0.04]"
                >

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border bg-brand-dark/50">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl border ${cat.accent}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">

                    <h3 className="text-lg font-semibold text-white group-hover:text-yellow transition-colors">
                      {cat.title}
                    </h3>

                    <p className="text-sm leading-relaxed text-white/50">
                      {cat.desc}
                    </p>

                  </div>

                  <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-5">

                    <span className="text-xs uppercase tracking-widest text-white/40">
                      {cat.count}
                    </span>

                    <Link
                      to="/courses"
                      className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-yellow transition hover:text-white"
                    >
                      Explore
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>

                  </div>

                </div>
              );
            })}

          </div>

        </section>

        {/* ───────────────── FEATURE STRIP ───────────────── */}
        <section className="border-y border-white/5 bg-brand-deep/20 py-24">

          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 lg:grid-cols-12">

            {/* LEFT */}
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-brand-dark/40 p-10 shadow-2xl lg:col-span-7">

              <div className="absolute -bottom-16 -right-16 opacity-5">
                <Building2 className="h-72 w-72" />
              </div>

              <div className="relative z-10 max-w-xl space-y-5">

                <span className="rounded border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-blue-400">
                  Institutional Consultancy
                </span>

                <h3 className="font-display text-3xl font-medium leading-tight text-white">
                  Enterprise Grid Engineering & Utility Advisory Systems
                </h3>

                <p className="text-sm leading-relaxed text-white/50">
                  ECG Training Center provides strategic engineering consulting,
                  infrastructure planning, SCADA diagnostics, compliance
                  assessments, and utility modernization support for public and
                  private energy institutions.
                </p>

                <button className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] text-white transition-all hover:border-yellow/20 hover:bg-white/10">
                  Request Consultation
                  <ArrowRight className="h-4 w-4 text-yellow" />
                </button>

              </div>

            </div>

            {/* RIGHT */}
            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-brand-deep to-brand-dark p-8 shadow-2xl lg:col-span-5">

              <div className="space-y-5">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-yellow/20 bg-yellow/10 text-yellow">
                  <Terminal className="h-6 w-6" />
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-white">
                    Digital Certificate Verification
                  </h3>

                  <p className="mt-3 text-sm leading-relaxed text-white/50">
                    All institutional certificates are protected with secure
                    audit-grade verification systems to prevent industrial
                    credential fraud.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/5 bg-brand-dark/70 p-5">

                  <div className="flex items-center justify-between">

                    <div className="flex items-center gap-3">

                      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-green-500/20 bg-green-500/10 text-green-400">
                        <CheckCircle className="h-4 w-4" />
                      </div>

                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-white/40">
                          Verification Engine
                        </p>

                        <p className="font-mono text-sm text-white">
                          Status: Operational
                        </p>
                      </div>

                    </div>

                    <Link
                      to="/certificates"
                      className="text-xs font-bold uppercase tracking-widest text-yellow hover:text-white"
                    >
                      Audit →
                    </Link>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>

        {/* ───────────────── NEWS ───────────────── */}
        <section className="border-b border-white/5 bg-brand-dark">
          <News />
        </section>

      </main>

      <Footer />
    </div>
  );
}