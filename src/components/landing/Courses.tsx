import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { BookOpen, Clock, ArrowRight, ShieldCheck, Zap, Layers, Cpu } from "lucide-react";
import { TopBar } from "@/components/landing/TopBar";
import { Nav } from "@/components/landing/Nav";
import { Footer } from "@/components/landing/Footer";

export const Route = createFileRoute("/courses")({
  component: CoursesPage,
});

// Real Operational ECG Training School Catalog Data (Payment Options Removed)
const ECG_CATALOG_DATA = [
  {
    id: "crs-01",
    cat: "Safety",
    title: "High Voltage Substation Safety & Isolation Protocols",
    instructor: "Ing. Emmanuel Ofori-Atta",
    durationWeeks: 6,
    description:
      "Mandatory safety certifications covering arc-rated clothing compliance, grounding installation, and lockout/tagout operations.",
    icon: ShieldCheck,
  },
  {
    id: "crs-02",
    cat: "Engineering",
    title: "Distribution Operations & Grid Infrastructure II",
    instructor: "Ing. Kwabena Mensah",
    durationWeeks: 8,
    description:
      "Deep dive into 11kV/33kV distribution feeder designs, substation load balancing, and automated circuit breaker protection schemes.",
    icon: Zap,
  },
  {
    id: "crs-03",
    cat: "Metering",
    title: "Integrated Smart Metering & AMI Architectures",
    instructor: "Mrs. Akua Appiah",
    durationWeeks: 4,
    description:
      "Hands-on implementation paths for advanced smart meters, cryptographic vending protocols, and split-unit remote data sync.",
    icon: Cpu,
  },
  {
    id: "crs-04",
    cat: "Commercial",
    title: "Utility Customer Service Charter & Loss Reduction",
    instructor: "Mr. David Owusu-Ansah",
    durationWeeks: 5,
    description:
      "Strategies for mitigating commercial losses, detecting energy theft, and implementing the regulatory customer response framework.",
    icon: Layers,
  },
];

const CATEGORIES = ["All", "Safety", "Engineering", "Metering", "Commercial"];

function CoursesPage() {
  // Client-Side Category Filter State
  const [activeFilter, setActiveFilter] = useState("All");

  // Filtered Computed Array
  const filteredCourses =
    activeFilter === "All"
      ? ECG_CATALOG_DATA
      : ECG_CATALOG_DATA.filter((course) => course.cat === activeFilter);

  return (
    <div className="min-h-screen bg-brand-dark text-white selection:bg-yellow selection:text-brand-dark">
      <TopBar />
      <Nav />

      {/* Main Container Core */}
      <main className="mx-auto max-w-7xl px-6 pt-36 pb-20">
        {/* Header Grid Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-white/10 pb-8 mb-12">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-yellow bg-yellow/10 border border-yellow/20 px-2.5 py-1 rounded">
              Institutional Training Registry
            </span>
            <h1 className="mt-4 font-display text-3xl md:text-5xl font-light uppercase tracking-wide text-white">
              Course <span className="text-yellow font-normal">Catalog</span>
            </h1>
            <p className="mt-2 text-xs md:text-sm text-white/60 max-w-2xl leading-relaxed">
              Explore professional engineering milestones and technical certifications offered by
              the Electricity Company of Ghana Training Academy. Select a track to view module
              criteria.
            </p>
          </div>

          {/* Dynamic Filter Buttons Container */}
          <div className="flex flex-wrap gap-2 self-start lg:self-auto">
            {CATEGORIES.map((cat) => {
              const isSelected = activeFilter === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveFilter(cat)}
                  className={`rounded px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all border ${
                    isSelected
                      ? "border-yellow bg-yellow text-brand-dark shadow-md"
                      : "border-white/10 bg-brand-deep/40 text-white/60 hover:border-white/20 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Catalog Cards Loop Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {filteredCourses.map((c) => {
            const IconComp = c.icon;
            return (
              <article
                key={c.id}
                className="group flex flex-col justify-between rounded-xl border border-white/5 bg-brand-deep/30 p-6 shadow-xl backdrop-blur-sm transition-all duration-300 hover:border-yellow/20 hover:-translate-y-0.5"
              >
                {/* Top Metabar Block */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-yellow bg-yellow/5 border border-yellow/10 px-2 py-0.5 rounded">
                      <IconComp className="h-3 w-3" /> {c.cat}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-white/40 font-medium">
                      <Clock className="h-3.5 w-3.5 text-white/30" /> {c.durationWeeks} Weeks
                    </span>
                  </div>

                  {/* Text Structure Content Frame */}
                  <div className="space-y-2">
                    <h3 className="font-display text-xl font-medium tracking-wide text-white leading-snug group-hover:text-yellow transition-colors">
                      {c.title}
                    </h3>
                    <p className="text-xs text-white/50 leading-relaxed max-w-xl">
                      {c.description}
                    </p>
                  </div>
                </div>

                {/* Footer Meta Section Component */}
                <div className="mt-6 border-t border-white/5 pt-4 flex items-center justify-between gap-4">
                  <div>
                    <div className="text-[9px] uppercase tracking-widest text-white/40 font-bold">
                      Lead Facilitator
                    </div>
                    <div className="text-xs font-medium text-white/80 mt-0.5">{c.instructor}</div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-white/40 group-hover:text-yellow transition-colors font-semibold uppercase tracking-wider text-[11px] mr-2">
                      View Module
                    </span>
                    <Link
                      to="/dashboard"
                      className="inline-flex h-9 w-9 items-center justify-center rounded bg-white/5 border border-white/10 group-hover:bg-red-cta group-hover:border-red-cta text-white transition-all shadow"
                      aria-label={`Open training node ${c.title}`}
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Empty Catalog Fallback Prompt */}
        {filteredCourses.length === 0 && (
          <div className="text-center py-20 border border-dashed border-white/10 rounded-xl bg-brand-deep/10">
            <BookOpen className="mx-auto h-8 w-8 text-white/20 mb-3" />
            <p className="text-sm text-white/40 font-medium">
              No specialized programs currently matching that search parameter tier.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
