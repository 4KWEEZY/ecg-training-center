import { createFileRoute } from '@tanstack/react-router'
import { CheckCircle2, Circle, Clock, Award, BarChart3, Zap } from 'lucide-react'

export const Route = createFileRoute('/progress')({
  component: Progress,
})

const modulesProgress = [
  { name: "Workplace Safety & Compliance", status: "Completed", percent: 100, color: "bg-green-500" },
  { name: "Distribution Operations 101", status: "In Progress", percent: 45, color: "bg-yellow" },
  { name: "Customer Service Essentials", status: "Not Started", percent: 0, color: "bg-white/10" },
  { name: "Metering & Billing Systems", status: "Not Started", percent: 0, color: "bg-white/10" },
  { name: "Network Protection & Faults", status: "Not Started", percent: 0, color: "bg-white/10" },
  { name: "Code of Conduct & Ethics", status: "Not Started", percent: 0, color: "bg-white/10" },
]

function Progress() {
  return (
    <div className="min-h-screen bg-brand-dark text-white p-8 pt-28">
      <main className="mx-auto max-w-5xl space-y-8">
        
        {/* Page Title & Summary Stats */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 pb-6">
          <div>
            <h1 className="font-display text-4xl font-light uppercase tracking-wide text-white">
              Trainee <span className="text-yellow">Progress Tracker</span>
            </h1>
            <p className="mt-1 text-sm text-white/70">
              Monitor your curriculum metrics, lesson runtime tracking, and milestone statuses.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-brand-deep border border-white/10 p-4 rounded-xl shrink-0">
            <div className="relative grid h-14 w-14 place-items-center rounded-full border-4 border-white/10 border-t-yellow">
              <span className="text-xs font-bold">24%</span>
            </div>
            <div>
              <div className="text-sm font-semibold text-white">Total Completion</div>
              <div className="text-[11px] text-white/50 uppercase tracking-wider">1 of 6 Modules Done</div>
            </div>
          </div>
        </div>

        {/* Analytic Metrics Row */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-brand-deep border border-white/10 p-5 rounded-xl flex items-center gap-4">
            <div className="p-3 rounded-lg bg-green-500/10 text-green-400"><CheckCircle2 className="h-5 w-5" /></div>
            <div>
              <div className="text-lg font-bold">14 Lessons</div>
              <div className="text-xs text-white/50 uppercase">Completed</div>
            </div>
          </div>
          <div className="bg-brand-deep border border-white/10 p-5 rounded-xl flex items-center gap-4">
            <div className="p-3 rounded-lg bg-yellow/10 text-yellow"><Clock className="h-5 w-5" /></div>
            <div>
              <div className="text-lg font-bold">4.5 Hours</div>
              <div className="text-xs text-white/50 uppercase">Total Study Time</div>
            </div>
          </div>
          <div className="bg-brand-deep border border-white/10 p-5 rounded-xl flex items-center gap-4">
            <div className="p-3 rounded-lg bg-blue-500/10 text-blue-400"><BarChart3 className="h-5 w-5" /></div>
            <div>
              <div className="text-lg font-bold">88% Avg</div>
              <div className="text-xs text-white/50 uppercase">Quiz Accuracy</div>
            </div>
          </div>
        </section>

        {/* Detailed Modules Progression Map */}
        <section className="bg-brand-deep border border-white/10 rounded-xl p-6 space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-yellow flex items-center gap-2">
            <Zap className="h-4 w-4" /> Curriculum Roadmap Status
          </h2>

          <div className="space-y-5">
            {modulesProgress.map((mod) => (
              <div key={mod.name} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2.5">
                    {mod.status === "Completed" ? (
                      <CheckCircle2 className="h-4 w-4 text-green-400 shrink-0" />
                    ) : mod.status === "In Progress" ? (
                      <div className="h-4 w-4 rounded-full border-2 border-yellow border-t-transparent animate-spin shrink-0" />
                    ) : (
                      <Circle className="h-4 w-4 text-white/20 shrink-0" />
                    )}
                    <span className={`font-medium ${mod.status === "Not Started" ? "text-white/50" : "text-white"}`}>
                      {mod.name}
                    </span>
                  </div>
                  <span className={`text-xs font-semibold ${mod.status === "In Progress" ? "text-yellow" : mod.status === "Completed" ? "text-green-400" : "text-white/30"}`}>
                    {mod.status} {mod.percent > 0 && `(${mod.percent}%)`}
                  </span>
                </div>

                {/* Progress Bar Track */}
                <div className="h-2 w-full rounded-full bg-black/30 overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${mod.color}`}
                    style={{ width: `${mod.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  )
}