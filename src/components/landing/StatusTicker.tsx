import { Megaphone } from "lucide-react";

const items = [
  "Welcome Cohort 2026 · Orientation begins Monday, 18 May",
  "Module 1 · Workplace Safety quiz due Friday, 22 May",
  "New video uploaded · Substation Operations 101",
  "Live session · Q&A with Head of HR, Wednesday 14:00 GMT",
  "Reminder · Complete Code of Conduct module before week 3",
  "Certificates for Cohort 2025-B now available in your dashboard",
];

export function StatusTicker() {
  const row = [...items, ...items];
  return (
    <div className="relative bg-red-cta py-3 text-white">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-6">
        <div className="flex shrink-0 items-center gap-2 border-r border-white/30 pr-4 text-xs font-bold uppercase tracking-widest">
          <Megaphone className="h-4 w-4" />
          Announcements
        </div>
        <div className="flex flex-1 overflow-hidden">
          <div className="ticker-track flex shrink-0 gap-10 pr-10 text-sm font-medium whitespace-nowrap">
            {row.map((t, i) => (
              <span key={i} className="flex items-center gap-3">
                <span className="h-1 w-1 rounded-full bg-yellow" />
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
