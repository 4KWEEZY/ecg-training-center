import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Circle, Clock, Award, BarChart3, Zap } from "lucide-react";
import { TopBar } from "@/components/landing/TopBar";
import { Nav } from "@/components/landing/Nav";
import { Footer } from "@/components/landing/Footer";

export const Route = createFileRoute("/progress")({
  component: Progress,
});

const modulesProgress = [
  { name: "Workplace Safety & Compliance",  status: "Completed",   percent: 100 },
  { name: "Distribution Operations 101",    status: "In Progress", percent: 45  },
  { name: "Customer Service Essentials",    status: "Not Started", percent: 0   },
  { name: "Metering & Billing Systems",     status: "Not Started", percent: 0   },
  { name: "Network Protection & Faults",    status: "Not Started", percent: 0   },
  { name: "Code of Conduct & Ethics",       status: "Not Started", percent: 0   },
];

const STATUS_STYLES = {
  "Completed":   { bar: "bg-[#2E9E6B]", text: "text-[#2E9E6B]" },
  "In Progress": { bar: "bg-[#3B3DA6]", text: "text-[#3B3DA6]" },
  "Not Started": { bar: "bg-[#DDDDF0]", text: "text-[#AAAAC8]" },
};

function Progress() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F4F5FB]">
      <TopBar />
      <Nav />

      <main className="flex-1 mx-auto w-full max-w-4xl px-6 pt-36 pb-20">

        {/* Page heading */}
        <div className="mb-8 text-center">
          <h1 className="font-display text-3xl font-bold uppercase tracking-wide text-[#1A1C5C] sm:text-4xl">
            Trainee Progress Tracker
          </h1>
          <p className="mt-2 text-sm text-[#8B8DAE]">
            Monitor your curriculum metrics, lesson runtime, and milestone statuses.
          </p>
        </div>

        {/* Overall completion card */}
        <div className="mb-6 rounded-2xl border border-[#DDDDF0] bg-[#3B3DA6] p-6 shadow-[0_4px_24px_rgba(59,61,166,0.25)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">
                Overall Completion
              </span>
              <span className="font-display text-4xl font-bold text-white">24%</span>
              <span className="mt-1 block text-xs text-white/60">1 of 6 Modules Completed</span>
            </div>

            {/* Circular progress visual */}
            <div className="flex items-center gap-5">
              <svg className="h-20 w-20 -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="3" />
                <circle
                  cx="18" cy="18" r="15.9"
                  fill="none"
                  stroke="#FFD700"
                  strokeWidth="3"
                  strokeDasharray="100"
                  strokeDashoffset="76"
                  strokeLinecap="round"
                />
              </svg>
              <div className="text-right">
                <div className="text-[10px] uppercase tracking-wider text-white/50">Target</div>
                <div className="font-display text-lg font-bold text-[#FFD700]">100%</div>
                <div className="text-[10px] text-white/50">by Dec 2026</div>
              </div>
            </div>
          </div>

          {/* Overall progress bar */}
          <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-white/15">
            <div className="h-full w-[24%] rounded-full bg-[#FFD700] transition-all duration-700" />
          </div>
        </div>

        {/* KPI stats */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { icon: CheckCircle2, value: "14 Lessons", label: "Completed",       iconBg: "bg-[#2E9E6B]/10", iconColor: "text-[#2E9E6B]" },
            { icon: Clock,        value: "4.5 Hours",  label: "Total Study Time", iconBg: "bg-[#3B3DA6]/10", iconColor: "text-[#3B3DA6]" },
            { icon: BarChart3,    value: "88% Avg",    label: "Quiz Accuracy",    iconBg: "bg-[#FFD700]/15", iconColor: "text-[#B8960C]" },
          ].map(({ icon: Icon, value, label, iconBg, iconColor }) => (
            <div
              key={label}
              className="flex items-center gap-4 rounded-2xl border border-[#DDDDF0] bg-white p-5 shadow-[0_2px_12px_rgba(59,61,166,0.07)]"
            >
              <div className={`shrink-0 rounded-xl p-3 ${iconBg} ${iconColor}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <div className="font-display text-xl font-bold text-[#1A1C5C]">{value}</div>
                <div className="text-[11px] font-medium uppercase tracking-wider text-[#AAAAC8]">{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Curriculum roadmap */}
        <div className="rounded-2xl border border-[#DDDDF0] bg-white p-6 shadow-[0_2px_12px_rgba(59,61,166,0.07)]">
          <div className="mb-5 flex items-center gap-2 border-b border-[#EAEBF6] pb-4">
            <Zap className="h-4 w-4 text-[#3B3DA6]" />
            <h2 className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#AAAAC8]">
              Curriculum Roadmap Status
            </h2>
          </div>

          <div className="space-y-5">
            {modulesProgress.map((mod, idx) => {
              const styles = STATUS_STYLES[mod.status as keyof typeof STATUS_STYLES];
              return (
                <div key={mod.name} className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {/* Step number / icon */}
                      <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                        mod.status === "Completed"
                          ? "bg-[#2E9E6B]/15 text-[#2E9E6B]"
                          : mod.status === "In Progress"
                          ? "bg-[#3B3DA6]/10 text-[#3B3DA6]"
                          : "bg-[#F4F5FB] text-[#AAAAC8]"
                      }`}>
                        {mod.status === "Completed" ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : mod.status === "In Progress" ? (
                          <div className="h-3 w-3 rounded-full border-2 border-[#3B3DA6] border-t-transparent animate-spin" />
                        ) : (
                          <span>{idx + 1}</span>
                        )}
                      </div>

                      <span className={`text-sm font-medium ${
                        mod.status === "Not Started" ? "text-[#AAAAC8]" : "text-[#1A1C5C]"
                      }`}>
                        {mod.name}
                      </span>
                    </div>

                    <span className={`shrink-0 text-[11px] font-bold ${styles.text}`}>
                      {mod.status}{mod.percent > 0 ? ` · ${mod.percent}%` : ""}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="ml-10 h-1.5 w-full overflow-hidden rounded-full bg-[#EAEBF6]">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${styles.bar}`}
                      style={{ width: `${mod.percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
