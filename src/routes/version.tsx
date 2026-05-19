import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/landing/Nav";
import { TopBar } from "@/components/landing/TopBar";
import { Footer } from "@/components/landing/Footer";

export const Route = createFileRoute("/version")({
  component: VersionPage,
});

type ChangeType = "add" | "fix" | "update";
type LabelType = "latest" | "stable" | "beta" | "deprecated";

interface Change {
  type: ChangeType;
  text: string;
}

interface Release {
  version: string;
  date: string;
  label: LabelType;
  notes: string;
  changes: Change[];
}

const releases: Release[] = [
  {
    version: "v2.4.1",
    date: "16 May 2026",
    label: "latest",
    notes: "Hotfix targeting billing API timeout issues and prepaid top-up failures.",
    changes: [
      { type: "fix", text: "Fixed billing API request timeout on high-traffic periods" },
      { type: "fix", text: "Resolved prepaid top-up failure for MTN Mobile Money" },
      { type: "update", text: "Upgraded payment gateway SDK to v4.2.0" },
    ],
  },
  {
    version: "v2.4.0",
    date: "1 May 2026",
    label: "stable",
    notes: "Major update introducing outage reporting and real-time notifications.",
    changes: [
      { type: "add", text: "Added outage reporting and live status map" },
      { type: "add", text: "Real-time SMS/email notifications for supply interruptions" },
      { type: "fix", text: "Fixed meter reading submission on Safari mobile" },
    ],
  },
  {
    version: "v2.3.2",
    date: "10 Apr 2026",
    label: "stable",
    notes: "Patch release with security improvements and accessibility fixes.",
    changes: [
      { type: "fix", text: "Patched XSS vulnerability in account settings form" },
      { type: "update", text: "Improved keyboard navigation across all forms" },
    ],
  },
];

const BADGE: Record<LabelType, string> = {
  latest:     "bg-yellow-100 text-yellow-800",
  stable:     "bg-green-100 text-green-800",
  beta:       "bg-blue-100 text-blue-800",
  deprecated: "bg-red-100 text-red-800",
};

const CHANGE_ICON: Record<ChangeType, string> = {
  add:    "+ ",
  fix:    "✕ ",
  update: "↑ ",
};

const CHANGE_COLOR: Record<ChangeType, string> = {
  add:    "text-green-500",
  fix:    "text-red-400",
  update: "text-blue-400",
};

function VersionPage() {
  return (
    <div className="min-h-screen bg-brand text-white">
      <TopBar />
      <Nav />
      <main className="mx-auto max-w-6xl px-4 pt-28 pb-16 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.25)] backdrop-blur-md">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-[#F5A623] flex items-center justify-center text-2xl">
                ⚡
              </div>
              <div>
                <h1 className="text-2xl font-semibold">ECG Training Center</h1>
                <p className="text-sm text-white/60">Version & Release History</p>
              </div>
            </div>
            <div className="rounded-2xl bg-white/10 px-4 py-2 text-sm text-white/80">
              Latest release: <span className="font-semibold text-white">{releases[0].version}</span>
            </div>
          </div>
        </div>

        {/* Meta cards */}
        <div className="grid grid-cols-1 gap-4 py-8 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Current version", value: "v2.4.1", highlight: true },
            { label: "Build", value: "20240516", highlight: false },
            { label: "Last deploy", value: "16 May 2026", highlight: false },
            { label: "Releases", value: String(releases.length), highlight: false },
          ].map((m) => (
            <div key={m.label} className="bg-white/10 rounded-3xl p-4">
              <p className="text-xs uppercase tracking-widest text-white/50 mb-2">{m.label}</p>
              <p className={`text-xl font-semibold ${m.highlight ? "text-[#F5A623]" : "text-white"}`}>
                {m.value}
              </p>
            </div>
          ))}
        </div>

        {/* Release history */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
          <p className="text-xs uppercase tracking-widest text-white/50 mb-4">Release history</p>
          <div className="flex flex-col gap-4">
          {releases.map((r) => (
            <div key={r.version} className="bg-white/10 border border-white/10 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{r.version}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${BADGE[r.label]}`}>
                    {r.label}
                  </span>
                </div>
                <span className="text-xs text-white/50">{r.date}</span>
              </div>
              <p className="text-sm text-white/70 mb-2">{r.notes}</p>
              <ul className="flex flex-col gap-1">
                {r.changes.map((c, i) => (
                  <li key={i} className="text-sm flex gap-1">
                    <span className={CHANGE_COLOR[c.type]}>{CHANGE_ICON[c.type]}</span>
                    <span className="text-white/80">{c.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          </div>
        </div>

      </main>
      <Footer />
    </div>
  );
}