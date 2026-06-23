import { createFileRoute } from "@tanstack/react-router";
import { requireAuth } from "../lib/auth";
import { withAuth } from "../components/ProtectedPage";
import { FileText, Download, Map, HardDrive, ExternalLink } from "lucide-react";

// Using createFileRoute because your file name is exactly resources.tsx
export const Route = createFileRoute("/resources")({
  beforeLoad: requireAuth,
  component: withAuth(Resources),
});

const coreResources = [
  {
    title: "ECG Distribution Grid Maps",
    description:
      "Detailed schematics of high-voltage sub-stations, feeders, and primary distribution lines across regional zones.",
    size: "14.2 MB",
    type: "PDF Document",
    icon: Map,
  },
  {
    title: "Safety Standards & PPE Manual",
    description:
      "Mandatory guidelines regarding field protective gear, isolation protocols, and low/high voltage emergency response frameworks.",
    size: "4.8 MB",
    type: "PDF Document",
    icon: FileText,
  },
  {
    title: "Smart Metering Technical Blueprints",
    description:
      "Engineering documentation walk-through for prepaid, postpaid, and integrated smart metering infrastructure deployment.",
    size: "8.5 MB",
    type: "Technical Specification",
    icon: HardDrive,
  },
];

function Resources() {
  const handleDownload = (title: string) => {
    alert(`Starting simulated frontend download for: "${title}"`);
  };

  return (
    <div className="min-h-screen bg-brand-dark text-white p-8 pt-28">
      <main className="mx-auto max-w-5xl space-y-10">
        {/* Page Title & Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-4xl font-light uppercase tracking-wide text-white">
              Learning <span className="text-yellow">Resources</span>
            </h1>
            <p className="mt-2 text-sm text-white/70">
              Access and download structural documentation, technical manuals, and orientation
              handbooks.
            </p>
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-white/40 border border-white/10 px-3 py-1.5 rounded-sm">
            Cohort 2026 Reference
          </span>
        </div>

        <hr className="border-white/10" />

        {/* Resources Grid List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {coreResources.map((res) => {
            const Icon = res.icon;
            return (
              <div
                key={res.title}
                className="group relative flex flex-col justify-between border border-white/10 bg-brand-deep p-6 rounded-xl hover:border-yellow/30 transition-all"
              >
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <div className="p-3 rounded-lg bg-yellow/10 text-yellow group-hover:bg-yellow group-hover:text-brand-dark transition-all">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-[11px] font-medium tracking-wide text-white/50 uppercase">
                      {res.type}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-white group-hover:text-yellow transition-colors">
                    {res.title}
                  </h3>
                  <p className="mt-2 text-sm text-white/70 leading-relaxed">{res.description}</p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4 text-xs text-white/50">
                  <span>
                    File Size: <strong>{res.size}</strong>
                  </span>
                  <button
                    onClick={() => handleDownload(res.title)}
                    className="inline-flex items-center gap-1.5 font-bold uppercase tracking-wider text-yellow hover:underline focus:outline-none"
                  >
                    Download <Download className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* External Links Section */}
        <section className="rounded-xl border border-dashed border-white/10 p-6 bg-white/[0.02]">
          <h2 className="text-sm font-bold uppercase tracking-wider text-yellow mb-3">
            Quick Reference Portals
          </h2>
          <div className="flex flex-wrap gap-4 text-sm">
            <a
              href="#/"
              onClick={(e) => {
                e.preventDefault();
                alert("Redirecting to external ECG Service Charter layout...");
              }}
              className="inline-flex items-center gap-1.5 text-white/80 hover:text-white hover:underline"
            >
              ECG Corporate Service Charter <ExternalLink className="h-3.5 w-3.5 text-yellow" />
            </a>
            <span className="text-white/20 hidden sm:inline">|</span>
            <a
              href="#/"
              onClick={(e) => {
                e.preventDefault();
                alert("Opening external IT Support Ticket system...");
              }}
              className="inline-flex items-center gap-1.5 text-white/80 hover:text-white hover:underline"
            >
              Staff Internal Knowledge Base <ExternalLink className="h-3.5 w-3.5 text-yellow" />
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
