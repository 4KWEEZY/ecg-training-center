import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/landing/Nav";
import { TopBar } from "@/components/landing/TopBar";
import { Footer } from "@/components/landing/Footer";
import { PlusCircle, Wrench, RefreshCw, Terminal, Calendar, Layers, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/version")({
  component: VersionPage,
});

type ChangeType = "add" | "fix" | "update";
type LabelType = "latest" | "stable" | "beta";

interface Change { type: ChangeType; text: string; }
interface Release { version: string; date: string; label: LabelType; notes: string; changes: Change[]; }

const releases: Release[] = [
  {
    version: "v2.0.0",
    date: "19 May 2026",
    label: "latest",
    notes: "Official Version 2.0 release. Complete public landing infrastructure overhaul and automated online student registration systems.",
    changes: [
      { type: "add", text: "Integrated MoMo Payment Flow gateway supporting MTN, Telecel, and AT networks" },
      { type: "add", text: "Added high-impact landing layouts with animated statistics and interactive filters" },
      { type: "update", text: "Connected frontend layout routers to live Cloudflare CDN optimization nodes" },
      { type: "fix", text: "Resolved deep response layout breakages on mobile device viewports" },
    ],
  },
  {
    version: "v1.4.2",
    date: "28 Apr 2026",
    label: "stable",
    notes: "Minor internal platform patch targeting user authentication middleware and quiz grading criteria.",
    changes: [
      { type: "update", text: "Upgraded institutional JWT access and refresh security token lifetimes" },
      { type: "fix", text: "Fixed automatic grading calculation error on multichoice evaluation forms" },
    ],
  },
];

const BADGE: Record<LabelType, string> = {
  latest: "bg-brand-primary/10 text-brand-primary border border-brand-primary/20",
  stable: "bg-accent-green/10 text-accent-green border border-accent-green/20",
  beta: "bg-accent-purple/10 text-accent-purple border border-accent-purple/20",
};

const CHANGE_ICON = {
  add: <PlusCircle className="h-4 w-4 text-accent-green shrink-0 mt-0.5" />,
  fix: <Wrench className="h-4 w-4 text-red-cta shrink-0 mt-0.5" />,
  update: <RefreshCw className="h-4 w-4 text-brand-primary shrink-0 mt-0.5" />,
};

function VersionPage() {
  return (
    <div className="min-h-screen bg-bg">
      <TopBar />
      <Nav />
      
      <main className="mx-auto max-w-5xl px-6 pt-36 pb-20">

        {/* ── Header ── */}
        <div className="rounded-xl border border-border bg-white p-6 md:p-8 shadow-card mb-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-brand-primary flex items-center justify-center text-white shadow-lg">
                <Terminal className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-text-primary tracking-wide uppercase font-display">LMS Release Logs</h1>
                <p className="text-xs text-text-muted uppercase tracking-widest mt-0.5">System Architecture Track</p>
              </div>
            </div>
            <div className="inline-flex self-start md:self-auto items-center gap-2 rounded-lg bg-bg-muted border border-border px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-text-primary">
              Active Build: <span className="text-brand-primary">{releases[0].version}</span>
            </div>
          </div>
        </div>

        {/* ── Metrics ── */}
        <div className="grid grid-cols-2 gap-4 mb-8 lg:grid-cols-4">
          {[
            { label: "Version", value: releases[0].version, icon: Layers },
            { label: "Stack", value: "React + TS", icon: Terminal },
            { label: "Deployment", value: "Cloudflare", icon: ShieldCheck },
            { label: "Pushed", value: releases[0].date, icon: Calendar },
          ].map((m) => (
            <div key={m.label} className="bg-white border border-border rounded-xl p-4 flex flex-col justify-between shadow-card">
              <span className="text-[9px] uppercase tracking-widest text-text-muted block mb-3 font-bold">{m.label}</span>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-text-primary">{m.value}</span>
                <m.icon className="h-3.5 w-3.5 text-brand-light" />
              </div>
            </div>
          ))}
        </div>

        {/* ── Version Stack ── */}
        <div className="space-y-6">
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-4">Deployment History</h2>
          {releases.map((r) => (
            <div key={r.version} className="bg-white border border-border rounded-xl p-6 shadow-card">
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <span className="font-display font-bold text-lg text-text-primary">{r.version}</span>
                  <span className={`text-[9px] uppercase tracking-wider px-3 py-1 rounded-full font-bold ${BADGE[r.label]}`}>
                    {r.label}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-text-muted uppercase">{r.date}</span>
              </div>
              
              <p className="text-sm text-text-body mb-6 leading-relaxed border-l-2 border-brand-light pl-4">{r.notes}</p>
              
              <ul className="flex flex-col gap-3">
                {r.changes.map((c, idx) => (
                  <li key={idx} className="text-xs flex items-start gap-3 text-text-body">
                    {CHANGE_ICON[c.type]}
                    {c.text}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}