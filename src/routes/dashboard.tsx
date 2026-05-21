import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BookOpen,
  Award,
  CheckCircle2,
  Clock,
  Play,
  Calendar,
  Bell,
  Users,
  MessageSquare,
  ArrowRight,
} from "lucide-react";
import { TopBar } from "@/components/landing/TopBar";
import { Nav } from "@/components/landing/Nav";
import { Footer } from "@/components/landing/Footer";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
});

const announcements = [
  {
    id: "ann-1",
    tag: "Urgent",
    tagStyle: "bg-[#E8534A]/10 text-[#E8534A] border-[#E8534A]/20",
    title: "Mandatory Safety Assessment Deadline",
    time: "2 hours ago",
    desc: "All Trainees in Cohort 2026 must clear the Section 2.4 High Voltage Isolation evaluation block before Friday midnight.",
  },
  {
    id: "ann-2",
    tag: "System Update",
    tagStyle: "bg-[#3B3DA6]/10 text-[#3B3DA6] border-[#3B3DA6]/20",
    title: "LMS Platform Version 2.0 Deployment",
    time: "1 day ago",
    desc: "The public registration portal and live verification engine modules are now online. Review the complete release history inside the /version track.",
  },
];

const upcomingSessions = [
  {
    id: "sess-1",
    title: "Practical Transformer Grounding Workshop",
    date: "May 22, 2026",
    time: "09:00 GMT",
    venue: "Lab Block B, Tema Community 10",
    instructor: "Ing. E. Ofori-Atta",
  },
];

function DashboardPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F4F5FB]">
      <TopBar />
      <Nav />

      <main className="flex-1 mx-auto w-full max-w-7xl px-6 pt-36 pb-20">
        {/* ── Welcome Banner ── */}
        <div className="relative mb-6 overflow-hidden rounded-2xl bg-[#3B3DA6] p-6 shadow-[0_4px_24px_rgba(59,61,166,0.25)] md:p-8">
          {/* BG decoration */}
          <div className="pointer-events-none absolute right-6 top-1/2 -translate-y-1/2 opacity-10 hidden md:block">
            <Users className="h-36 w-36 text-white" />
          </div>
          <div className="relative z-10">
            <span className="inline-block rounded-full border border-[#FFD700]/30 bg-[#FFD700]/15 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-[#FFD700]">
              Active Trainee Profile
            </span>
            <h1 className="mt-3 font-display text-2xl font-bold text-white md:text-3xl">
              Welcome Back, <span className="text-[#FFD700]">Trainee</span>
            </h1>
            <p className="mt-1 text-xs text-white/60 md:text-sm">
              Cohort 2026 · Systems &amp; Technical Network Operations Directorate (IT Track)
            </p>
          </div>
        </div>

        {/* ── KPI Stats ── */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            {
              icon: BookOpen,
              value: "1 / 6",
              label: "Modules Initialized",
              iconBg: "bg-[#3B3DA6]/10",
              iconColor: "text-[#3B3DA6]",
            },
            {
              icon: CheckCircle2,
              value: "1 / 3",
              label: "Evaluations Passed",
              iconBg: "bg-[#2E9E6B]/10",
              iconColor: "text-[#2E9E6B]",
            },
            {
              icon: Award,
              value: "1 Milestone",
              label: "Earned Credentials",
              iconBg: "bg-[#FFD700]/15",
              iconColor: "text-[#B8960C]",
            },
          ].map(({ icon: Icon, value, label, iconBg, iconColor }) => (
            <div
              key={label}
              className="flex items-center gap-4 rounded-2xl border border-[#DDDDF0] bg-white p-5 shadow-[0_2px_12px_rgba(59,61,166,0.07)] transition hover:shadow-[0_4px_20px_rgba(59,61,166,0.12)]"
            >
              <div className={`shrink-0 rounded-xl p-3 ${iconBg} ${iconColor}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <div className="font-display text-xl font-bold text-[#1A1C5C]">{value}</div>
                <div className="text-[11px] font-medium uppercase tracking-wider text-[#AAAAC8]">
                  {label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Main 2-col grid ── */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* LEFT — 2/3 */}
          <div className="space-y-6 lg:col-span-2">
            {/* Currently studying */}
            <div className="rounded-2xl border border-[#DDDDF0] bg-white p-6 shadow-[0_2px_12px_rgba(59,61,166,0.07)]">
              <div className="mb-4 flex items-center justify-between border-b border-[#EAEBF6] pb-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-[#3B3DA6]" />
                  <h2 className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#AAAAC8]">
                    Currently Studying
                  </h2>
                </div>
                <span className="rounded-full border border-[#3B3DA6]/20 bg-[#3B3DA6]/10 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#3B3DA6]">
                  In Progress
                </span>
              </div>

              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-base font-semibold text-[#1A1C5C]">
                    Workplace Safety &amp; Compliance
                  </h3>
                  <p className="mt-1 text-xs text-[#8B8DAE]">
                    Active Lesson:{" "}
                    <span className="font-semibold text-[#3B3DA6]">
                      Section 2.4 — High Voltage Substation Isolation Protocols
                    </span>
                  </p>
                  {/* Progress bar */}
                  <div className="mt-3 h-1.5 w-48 rounded-full bg-[#EAEBF6]">
                    <div className="h-1.5 w-1/6 rounded-full bg-[#3B3DA6]" />
                  </div>
                  <p className="mt-1 text-[10px] text-[#AAAAC8]">17% complete</p>
                </div>
                <Link
                  to="/courses"
                  className="inline-flex shrink-0 items-center gap-2 self-start rounded-xl bg-[#E8534A] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow transition hover:bg-[#CC3F37] md:self-auto"
                >
                  Resume <Play className="h-3 w-3 fill-white" />
                </Link>
              </div>
            </div>

            {/* Announcements */}
            <div className="rounded-2xl border border-[#DDDDF0] bg-white p-6 shadow-[0_2px_12px_rgba(59,61,166,0.07)]">
              <div className="mb-4 flex items-center gap-2 border-b border-[#EAEBF6] pb-4">
                <Bell className="h-4 w-4 text-[#3B3DA6]" />
                <h2 className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#AAAAC8]">
                  Institutional Announcements
                </h2>
              </div>

              <div className="flex flex-col gap-3">
                {announcements.map((ann) => (
                  <div key={ann.id} className="rounded-xl border border-[#EAEBF6] bg-[#F4F5FB] p-4">
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <span
                        className={`rounded-full border px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${ann.tagStyle}`}
                      >
                        {ann.tag}
                      </span>
                      <span className="text-[10px] text-[#AAAAC8]">{ann.time}</span>
                    </div>
                    <h4 className="text-sm font-semibold text-[#1A1C5C]">{ann.title}</h4>
                    <p className="mt-1 text-xs leading-relaxed text-[#8B8DAE]">{ann.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT — 1/3 */}
          <div className="space-y-6">
            {/* Upcoming sessions */}
            <div className="rounded-2xl border border-[#DDDDF0] bg-white p-6 shadow-[0_2px_12px_rgba(59,61,166,0.07)]">
              <div className="mb-4 flex items-center gap-2 border-b border-[#EAEBF6] pb-4">
                <Calendar className="h-4 w-4 text-[#3B3DA6]" />
                <h2 className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#AAAAC8]">
                  Upcoming Live Sessions
                </h2>
              </div>

              {upcomingSessions.map((session) => (
                <div key={session.id} className="space-y-3">
                  <div className="rounded-xl border border-[#EAEBF6] bg-[#F4F5FB] p-4">
                    <h4 className="text-xs font-semibold leading-snug text-[#1A1C5C]">
                      {session.title}
                    </h4>
                    <div className="mt-2.5 space-y-1 text-[11px] text-[#8B8DAE]">
                      <p>
                        <span className="font-semibold text-[#3B3DA6]">Date: </span>
                        {session.date} · {session.time}
                      </p>
                      <p>
                        <span className="font-semibold text-[#3B3DA6]">Venue: </span>
                        {session.venue}
                      </p>
                      <p>
                        <span className="font-semibold text-[#3B3DA6]">Lead: </span>
                        {session.instructor}
                      </p>
                    </div>
                  </div>
                  <Link
                    to="/schedule"
                    className="flex w-full items-center justify-center rounded-xl border border-[#3B3DA6]/20 bg-[#3B3DA6]/5 py-2 text-xs font-bold uppercase tracking-wider text-[#3B3DA6] transition hover:bg-[#3B3DA6]/10"
                  >
                    View Full Schedule
                  </Link>
                </div>
              ))}
            </div>

            {/* Community */}
            <div className="rounded-2xl border border-[#DDDDF0] bg-white p-6 shadow-[0_2px_12px_rgba(59,61,166,0.07)]">
              <div className="mb-3 flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-[#3B3DA6]" />
                <h2 className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#AAAAC8]">
                  Alumni &amp; Trainee Circle
                </h2>
              </div>
              <p className="text-xs leading-relaxed text-[#8B8DAE]">
                Engage in technical discussions, resolve engineering topics, and coordinate with
                instructors across all cohorts.
              </p>
              <Link
                to="/dashboard"
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#3B3DA6] transition hover:text-[#2B2D8A]"
              >
                Enter Community Hub <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
