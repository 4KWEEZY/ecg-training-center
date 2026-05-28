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
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  FileText,
  HelpCircle,
} from "lucide-react";
import { TopBar } from "@/components/landing/TopBar";
import { Nav } from "@/components/landing/Nav";
import { Footer } from "@/components/landing/Footer";
import { useState } from "react";

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
    desc: "The public registration portal and live verification engine modules are now online.",
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
    day: 22,
    month: 4,
  },
  {
    id: "sess-2",
    title: "High Voltage Safety Refresher",
    date: "May 28, 2026",
    time: "10:00 GMT",
    venue: "Virtual — Zoom",
    instructor: "Ing. K. Mensah",
    day: 28,
    month: 4,
  },
];

const quickLinks = [
  { icon: BookOpen, label: "My Courses", to: "/courses", color: "bg-[#3B3DA6]/10 text-[#3B3DA6]" },
  { icon: FileText, label: "Study Materials", to: "/courses", color: "bg-[#2E9E6B]/10 text-[#2E9E6B]" },
  { icon: TrendingUp, label: "My Progress", to: "/progress", color: "bg-[#FFD700]/15 text-[#B8960C]" },
  { icon: HelpCircle, label: "Help & Support", to: "/help", color: "bg-[#E8534A]/10 text-[#E8534A]" },
];

// Mini Calendar Component
function MiniCalendar() {
  const today = new Date();
  const [current, setCurrent] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const year = current.getFullYear();
  const month = current.getMonth();

  const monthName = current.toLocaleString("default", { month: "long" });
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Days with sessions
  const sessionDays = upcomingSessions
    .filter((s) => s.month === month)
    .map((s) => s.day);

  const prevMonth = () => setCurrent(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrent(new Date(year, month + 1, 1));

  const days = [];
  // Empty cells before first day
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  return (
    <div className="rounded-2xl border border-[#DDDDF0] bg-white p-5 shadow-[0_2px_12px_rgba(59,61,166,0.07)]">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-[#3B3DA6]" />
          <h2 className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#AAAAC8]">
            Calendar
          </h2>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={prevMonth}
            className="rounded-lg p-1 text-[#AAAAC8] transition hover:bg-[#F4F5FB] hover:text-[#3B3DA6]"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <span className="min-w-[90px] text-center text-[11px] font-semibold text-[#1A1C5C]">
            {monthName} {year}
          </span>
          <button
            onClick={nextMonth}
            className="rounded-lg p-1 text-[#AAAAC8] transition hover:bg-[#F4F5FB] hover:text-[#3B3DA6]"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Day names */}
      <div className="mb-1 grid grid-cols-7 text-center">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <div key={i} className="text-[9px] font-bold uppercase text-[#AAAAC8] py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 text-center">
        {days.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} />;
          const isToday =
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear();
          const hasSession = sessionDays.includes(day);
          return (
            <div key={day} className="relative flex flex-col items-center py-0.5">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-medium transition
                  ${isToday ? "bg-[#3B3DA6] text-white font-bold" : "text-[#1A1C5C] hover:bg-[#F4F5FB]"}
                `}
              >
                {day}
              </div>
              {hasSession && (
                <div className="mt-0.5 h-1 w-1 rounded-full bg-[#E8534A]" />
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-3 flex items-center gap-3 border-t border-[#EAEBF6] pt-3">
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-[#3B3DA6]" />
          <span className="text-[10px] text-[#8B8DAE]">Today</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-[#E8534A]" />
          <span className="text-[10px] text-[#8B8DAE]">Session</span>
        </div>
      </div>
    </div>
  );
}

function DashboardPage() {
  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F5FB]">
      <TopBar />
      <Nav />

      <main className="flex-1 mx-auto w-full max-w-7xl px-6 pt-36 pb-20">

        {/* ── Welcome Banner ── */}
        <div className="relative mb-6 overflow-hidden rounded-2xl bg-gradient-to-br from-[#2B2D8A] via-[#3B3DA6] to-[#4E50C4] p-6 shadow-[0_4px_24px_rgba(59,61,166,0.3)] md:p-8">
          <div className="pointer-events-none absolute -right-8 -top-8 h-48 w-48 rounded-full bg-white/5" />
          <div className="pointer-events-none absolute -bottom-12 right-24 h-40 w-40 rounded-full bg-white/5" />
          <div className="pointer-events-none absolute right-6 top-1/2 -translate-y-1/2 opacity-10 hidden md:block">
            <Users className="h-36 w-36 text-white" />
          </div>
          <div className="relative z-10 flex items-start justify-between">
            <div>
              <span className="inline-block rounded-full border border-[#FFD700]/30 bg-[#FFD700]/15 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-[#FFD700]">
                Active Trainee Profile
              </span>
              <h1 className="mt-3 font-display text-2xl font-bold text-white md:text-3xl">
                Welcome Back,{" "}
                <span className="text-[#FFD700]">{user?.name || "Trainee"}</span>
              </h1>
              <p className="mt-1 text-xs text-white/60 md:text-sm">
                Cohort 2026 · Systems &amp; Technical Network Operations Directorate (IT Track)
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] text-white/80">
                  @{user?.username || "trainee"}
                </span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] text-white/80">
                  {user?.email || "—"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Quick Links ── */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {quickLinks.map(({ icon: Icon, label, to, color }) => (
            <Link
              key={label}
              to={to}
              className="flex items-center gap-3 rounded-xl border border-[#DDDDF0] bg-white px-4 py-3 shadow-[0_2px_8px_rgba(59,61,166,0.06)] transition hover:shadow-[0_4px_16px_rgba(59,61,166,0.12)] hover:-translate-y-0.5"
            >
              <div className={`rounded-lg p-2 ${color}`}>
                <Icon className="h-4 w-4" />
              </div>
              <span className="text-xs font-semibold text-[#1A1C5C]">{label}</span>
            </Link>
          ))}
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
              progress: 17,
              progressColor: "bg-[#3B3DA6]",
            },
            {
              icon: CheckCircle2,
              value: "1 / 3",
              label: "Evaluations Passed",
              iconBg: "bg-[#2E9E6B]/10",
              iconColor: "text-[#2E9E6B]",
              progress: 33,
              progressColor: "bg-[#2E9E6B]",
            },
            {
              icon: Award,
              value: "1 Milestone",
              label: "Earned Credentials",
              iconBg: "bg-[#FFD700]/15",
              iconColor: "text-[#B8960C]",
              progress: 100,
              progressColor: "bg-[#FFD700]",
            },
          ].map(({ icon: Icon, value, label, iconBg, iconColor, progress, progressColor }) => (
            <div
              key={label}
              className="flex flex-col gap-3 rounded-2xl border border-[#DDDDF0] bg-white p-5 shadow-[0_2px_12px_rgba(59,61,166,0.07)] transition hover:shadow-[0_4px_20px_rgba(59,61,166,0.12)]"
            >
              <div className="flex items-center gap-4">
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
              <div className="h-1 w-full rounded-full bg-[#EAEBF6]">
                <div
                  className={`h-1 rounded-full ${progressColor} transition-all`}
                  style={{ width: `${progress}%` }}
                />
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
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-[#1A1C5C]">
                    Workplace Safety &amp; Compliance
                  </h3>
                  <p className="mt-1 text-xs text-[#8B8DAE]">
                    Active Lesson:{" "}
                    <span className="font-semibold text-[#3B3DA6]">
                      Section 2.4 — High Voltage Substation Isolation Protocols
                    </span>
                  </p>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="h-2 flex-1 rounded-full bg-[#EAEBF6]">
                      <div className="h-2 w-[17%] rounded-full bg-[#3B3DA6]" />
                    </div>
                    <span className="text-[11px] font-semibold text-[#3B3DA6]">17%</span>
                  </div>
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
              <div className="mb-4 flex items-center justify-between border-b border-[#EAEBF6] pb-4">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-[#3B3DA6]" />
                  <h2 className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#AAAAC8]">
                    Institutional Announcements
                  </h2>
                </div>
                <Link
                  to="/news"
                  className="text-[10px] font-bold uppercase tracking-wider text-[#3B3DA6] transition hover:underline"
                >
                  View All
                </Link>
              </div>
              <div className="flex flex-col gap-3">
                {announcements.map((ann) => (
                  <div
                    key={ann.id}
                    className="rounded-xl border border-[#EAEBF6] bg-[#F4F5FB] p-4 transition hover:border-[#3B3DA6]/20 hover:bg-[#EAEBF6]/50"
                  >
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

            {/* Mini Calendar */}
            <MiniCalendar />

            {/* Upcoming sessions */}
            <div className="rounded-2xl border border-[#DDDDF0] bg-white p-6 shadow-[0_2px_12px_rgba(59,61,166,0.07)]">
              <div className="mb-4 flex items-center justify-between border-b border-[#EAEBF6] pb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-[#3B3DA6]" />
                  <h2 className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#AAAAC8]">
                    Upcoming Sessions
                  </h2>
                </div>
                <Link
                  to="/schedule"
                  className="text-[10px] font-bold uppercase tracking-wider text-[#3B3DA6] transition hover:underline"
                >
                  All
                </Link>
              </div>
              <div className="space-y-3">
                {upcomingSessions.map((session) => (
                  <div
                    key={session.id}
                    className="rounded-xl border border-[#EAEBF6] bg-[#F4F5FB] p-4 transition hover:border-[#3B3DA6]/20"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-lg bg-[#3B3DA6] text-white">
                        <span className="text-sm font-bold leading-none">{session.day}</span>
                        <span className="text-[8px] uppercase leading-none opacity-80">
                          {new Date(session.date).toLocaleString("default", { month: "short" })}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-semibold leading-snug text-[#1A1C5C]">
                          {session.title}
                        </h4>
                        <p className="mt-1 text-[10px] text-[#8B8DAE]">{session.time} · {session.venue}</p>
                        <p className="text-[10px] font-medium text-[#3B3DA6]">{session.instructor}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Community */}
            <div className="rounded-2xl border border-[#DDDDF0] bg-white p-5 shadow-[0_2px_12px_rgba(59,61,166,0.07)]">
              <div className="mb-3 flex items-center gap-2 border-b border-[#EAEBF6] pb-3">
                <MessageSquare className="h-4 w-4 text-[#3B3DA6]" />
                <h2 className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#AAAAC8]">
                  Community Hub
                </h2>
              </div>
              <p className="text-xs leading-relaxed text-[#8B8DAE]">
                Engage in technical discussions, resolve engineering topics, and coordinate with
                instructors across all cohorts.
              </p>
              <Link
                to="/community"
                className="mt-4 flex items-center justify-between rounded-xl bg-[#3B3DA6]/5 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-[#3B3DA6] transition hover:bg-[#3B3DA6]/10"
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
