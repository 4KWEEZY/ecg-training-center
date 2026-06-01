import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  LayoutDashboard,
  BookOpen,
  Newspaper,
  Users,
  CalendarDays,
  Info,
  HelpCircle,
  LogOut,
  Bell,
  Clock,
  Play,
  Calendar,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  ArrowRight,
  TrendingUp,
  FileText,
  Award,
  CheckCircle2,
} from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
});

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", to: "/dashboard" },
  { icon: BookOpen, label: "Courses", to: "/courses" },
  { icon: Newspaper, label: "News", to: "/news" },
  { icon: Users, label: "My Community", to: "/community" },
  { icon: CalendarDays, label: "Study Planner", to: "/study" },
  { icon: Info, label: "Info Center", to: "/info" },
  { icon: HelpCircle, label: "Help & Contact", to: "/help" },
];

const quickLinks = [
  { icon: BookOpen, label: "My Courses", to: "/courses", bg: "bg-[#E6F1FB]", color: "text-[#185FA5]" },
  { icon: FileText, label: "Materials", to: "/courses", bg: "bg-[#EAF3DE]", color: "text-[#3B6D11]" },
  { icon: TrendingUp, label: "My Progress", to: "/progress", bg: "bg-[#FAEEDA]", color: "text-[#854F0B]" },
  { icon: HelpCircle, label: "Help", to: "/help", bg: "bg-[#FCEBEB]", color: "text-[#A32D2D]" },
];

const announcements = [
  {
    id: "ann-1",
    tag: "Urgent",
    tagStyle: "bg-[#FCEBEB] text-[#A32D2D] border-[#F7C1C1]",
    title: "Mandatory Safety Assessment Deadline",
    time: "2 hours ago",
    desc: "All Cohort 2026 trainees must clear Section 2.4 evaluation before Friday midnight.",
  },
  {
    id: "ann-2",
    tag: "System",
    tagStyle: "bg-[#E6F1FB] text-[#185FA5] border-[#B5D4F4]",
    title: "LMS Platform Version 2.0 Deployed",
    time: "1 day ago",
    desc: "Registration portal and live verification engine are now online.",
  },
];

const upcomingSessions = [
  { id: "s1", title: "Transformer Grounding Workshop", date: "May 22, 2026", time: "09:00 GMT", venue: "Lab Block B, Tema", day: 22, month: 4 },
  { id: "s2", title: "High Voltage Safety Refresher", date: "May 28, 2026", time: "10:00 GMT", venue: "Virtual — Zoom", day: 28, month: 4 },
];

const inter = { fontFamily: "'Inter', sans-serif" };

function MiniCalendar() {
  const today = new Date();
  const [current, setCurrent] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const year = current.getFullYear();
  const month = current.getMonth();
  const monthName = current.toLocaleString("default", { month: "long" });
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const sessionDays = upcomingSessions.filter((s) => s.month === month).map((s) => s.day);
  const days: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  return (
    <div className="rounded-xl border border-[#DDDDF0] bg-white p-4" style={inter}>
      <div className="mb-3 flex items-center justify-between border-b border-[#EAEBF6] pb-3">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-[#3B3DA6]" />
          <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#AAAAC8]">Calendar</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrent(new Date(year, month - 1, 1))}
            className="flex h-6 w-6 items-center justify-center rounded border border-[#DDDDF0] bg-[#F4F5FB] text-[#8B8DAE] hover:text-[#3B3DA6]"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <span className="min-w-[90px] text-center text-[12px] font-semibold text-[#1A1C5C]">
            {monthName} {year}
          </span>
          <button
            onClick={() => setCurrent(new Date(year, month + 1, 1))}
            className="flex h-6 w-6 items-center justify-center rounded border border-[#DDDDF0] bg-[#F4F5FB] text-[#8B8DAE] hover:text-[#3B3DA6]"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      <div className="mb-1 grid grid-cols-7 text-center">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <div key={i} className="py-1 text-[10px] font-bold uppercase text-[#AAAAC8]">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 text-center">
        {days.map((day, i) => {
          if (!day) return <div key={`e-${i}`} />;
          const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
          const hasSession = sessionDays.includes(day);
          return (
            <div key={day} className="flex flex-col items-center py-0.5">
              <div className={`flex h-7 w-7 items-center justify-center rounded-full text-[12px] font-medium ${isToday ? "bg-[#3B3DA6] font-bold text-white" : "text-[#1A1C5C] hover:bg-[#F4F5FB]"}`}>
                {day}
              </div>
              {hasSession && <div className="mt-0.5 h-1 w-1 rounded-full bg-[#E8534A]" />}
            </div>
          );
        })}
      </div>
      <div className="mt-3 flex items-center gap-3 border-t border-[#EAEBF6] pt-2">
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-[#3B3DA6]" />
          <span className="text-[11px] text-[#8B8DAE]">Today</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-[#E8534A]" />
          <span className="text-[11px] text-[#8B8DAE]">Session</span>
        </div>
      </div>
    </div>
  );
}

function DashboardPage() {
  const navigate = useNavigate();
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : { name: "", username: "Guest", email: "" };
  const displayName = user?.name || user?.username || "Trainee";
  const initials = displayName.slice(0, 2).toUpperCase();
  const currentPath = "/dashboard";

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate({ to: "/login" });
  };

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <div
        className="flex min-h-screen"
        style={{ background: "#f0f2fb", fontFamily: "'Inter', sans-serif" }}
      >
        {/* ── Sidebar ── */}
        <aside className="flex w-[220px] min-w-[220px] flex-col border-r border-[#DDDDF0] bg-[#1e206e]">

          {/* Logo */}
          <div className="flex items-center gap-2.5 border-b border-white/10 px-4 py-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#FFD700]">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <polyline points="1,8 3,8 4.5,3 6.5,13 8,5.5 10,10 11.5,8 15,8" stroke="#1e206e" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <div className="text-[13px] font-bold text-white">ECG Training</div>
              <div className="text-[10px] uppercase tracking-wider text-white/40">Learning Portal</div>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 space-y-0.5 overflow-y-auto px-2 py-4">
            <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-widest text-white/30">Main</p>
            {navItems.slice(0, 4).map(({ icon: Icon, label, to }) => {
              const isActive = currentPath === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-all
                    ${isActive ? "bg-white/12 text-white" : "text-white/55 hover:bg-white/7 hover:text-white/85"}`}
                >
                  <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-[#FFD700]" : ""}`} />
                  {label}
                </Link>
              );
            })}
            <p className="mb-2 mt-4 px-2 text-[10px] font-bold uppercase tracking-widest text-white/30">Tools</p>
            {navItems.slice(4).map(({ icon: Icon, label, to }) => (
              <Link
                key={to}
                to={to}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium text-white/55 transition-all hover:bg-white/7 hover:text-white/85"
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </Link>
            ))}
          </nav>

          {/* User footer */}
          <div className="border-t border-white/10 p-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#3B3DA6] text-[11px] font-bold text-white">
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-semibold text-white">{displayName}</p>
                <p className="truncate text-[11px] text-white/40">{user?.email || "—"}</p>
              </div>
              <button
                onClick={handleLogout}
                className="shrink-0 rounded p-1 text-white/35 transition hover:text-[#E8534A]"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </aside>

        {/* ── Main ── */}
        <div className="flex min-w-0 flex-1 flex-col">

          {/* Topbar */}
          <header className="flex items-center justify-between border-b border-[#DDDDF0] bg-white px-6 py-3">
            <div>
              <div className="text-[15px] font-semibold text-[#1A1C5C]">Dashboard</div>
              <div className="text-[11px] text-[#AAAAC8]">
                {new Date().toLocaleDateString("en-GB", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-[#DDDDF0] bg-[#F4F5FB] text-[#8B8DAE] hover:text-[#3B3DA6]">
                <Bell className="h-4 w-4" />
                <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#E8534A]" />
              </button>
              <div className="flex items-center gap-2 rounded-lg border border-[#DDDDF0] bg-[#F4F5FB] px-3 py-1.5">
                <div className="flex h-6 w-6 items-center justify-center rounded bg-[#3B3DA6] text-[10px] font-bold text-white">
                  {initials}
                </div>
                <span className="text-[13px] font-medium text-[#1A1C5C]">{displayName}</span>
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 overflow-y-auto p-6">

            {/* Banner */}
            <div
              className="relative mb-6 overflow-hidden rounded-xl p-6"
              style={{ background: "linear-gradient(135deg, #2B2D8A 0%, #3B3DA6 60%, #4E50C4 100%)" }}
            >
              <div className="pointer-events-none absolute -right-4 -top-4 h-36 w-36 rounded-full bg-white/5" />
              <div className="pointer-events-none absolute bottom-0 right-16 h-28 w-28 rounded-full bg-white/5" />
              <div className="relative">
                <span className="inline-block rounded-full border border-yellow-400/30 bg-yellow-400/12 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-yellow-400">
                  Active Trainee Profile
                </span>
                <h1 className="mt-2 text-2xl font-bold text-white">
                  Welcome Back, <span className="text-yellow-400">{displayName}</span>
                </h1>
                <p className="mt-1 text-[13px] text-white/55">
                  Cohort 2026 · Systems &amp; Technical Network Operations (IT Track)
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-white/10 px-3 py-1 text-[12px] text-white/75">
                    @{user?.username || "trainee"}
                  </span>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-[12px] text-white/75">
                    {user?.email || "—"}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="mb-5 grid grid-cols-4 gap-3">
              {quickLinks.map(({ icon: Icon, label, to, bg, color }) => (
                <Link
                  key={label}
                  to={to}
                  className="flex items-center gap-3 rounded-xl border border-[#DDDDF0] bg-white px-4 py-3 transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${bg} ${color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-[13px] font-semibold text-[#1A1C5C]">{label}</span>
                </Link>
              ))}
            </div>

            {/* KPI */}
            <div className="mb-5 grid grid-cols-3 gap-4">
              {[
                { icon: BookOpen, value: "1 / 6", label: "Modules", bg: "bg-[#E6F1FB]", color: "text-[#185FA5]", prog: 17, progColor: "bg-[#3B3DA6]" },
                { icon: CheckCircle2, value: "1 / 3", label: "Evaluations", bg: "bg-[#EAF3DE]", color: "text-[#3B6D11]", prog: 33, progColor: "bg-[#3B6D11]" },
                { icon: Award, value: "1 Badge", label: "Credentials", bg: "bg-[#FAEEDA]", color: "text-[#854F0B]", prog: 100, progColor: "bg-[#EF9F27]" },
              ].map(({ icon: Icon, value, label, bg, color, prog, progColor }) => (
                <div key={label} className="rounded-xl border border-[#DDDDF0] bg-white p-4">
                  <div className="mb-3 flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${bg} ${color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-lg font-bold text-[#1A1C5C]">{value}</div>
                      <div className="text-[11px] uppercase tracking-wider text-[#AAAAC8]">{label}</div>
                    </div>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-[#EAEBF6]">
                    <div className={`h-1.5 rounded-full ${progColor}`} style={{ width: `${prog}%` }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Two col grid */}
            <div className="grid grid-cols-3 gap-4">

              {/* Left 2/3 */}
              <div className="col-span-2 space-y-4">

                {/* Currently studying */}
                <div className="rounded-xl border border-[#DDDDF0] bg-white p-5">
                  <div className="mb-4 flex items-center justify-between border-b border-[#EAEBF6] pb-3">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-[#3B3DA6]" />
                      <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#AAAAC8]">
                        Currently Studying
                      </span>
                    </div>
                    <span className="rounded-full border border-[#B5D4F4] bg-[#E6F1FB] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#185FA5]">
                      In Progress
                    </span>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-[#1A1C5C]">
                        Workplace Safety &amp; Compliance
                      </h3>
                      <p className="mt-1 text-[13px] text-[#8B8DAE]">
                        Active:{" "}
                        <span className="font-semibold text-[#3B3DA6]">
                          Section 2.4 — High Voltage Substation Isolation Protocols
                        </span>
                      </p>
                      <div className="mt-3 flex items-center gap-2">
                        <div className="h-2 flex-1 rounded-full bg-[#EAEBF6]">
                          <div className="h-2 rounded-full bg-[#3B3DA6]" style={{ width: "17%" }} />
                        </div>
                        <span className="text-[12px] font-semibold text-[#3B3DA6]">17%</span>
                      </div>
                    </div>
                    <Link
                      to="/courses"
                      className="flex shrink-0 items-center gap-2 rounded-lg bg-[#E8534A] px-4 py-2.5 text-[12px] font-bold uppercase tracking-wider text-white transition hover:bg-[#CC3F37]"
                    >
                      Resume <Play className="h-3.5 w-3.5 fill-white" />
                    </Link>
                  </div>
                </div>

                {/* Announcements */}
                <div className="rounded-xl border border-[#DDDDF0] bg-white p-5">
                  <div className="mb-4 flex items-center justify-between border-b border-[#EAEBF6] pb-3">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4 text-[#3B3DA6]" />
                      <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#AAAAC8]">
                        Announcements
                      </span>
                    </div>
                    <Link
                      to="/news"
                      className="text-[11px] font-bold uppercase tracking-wider text-[#3B3DA6] hover:underline"
                    >
                      View All
                    </Link>
                  </div>
                  <div className="space-y-3">
                    {announcements.map((ann) => (
                      <div
                        key={ann.id}
                        className="rounded-lg border border-[#EAEBF6] bg-[#F4F5FB] p-3 transition hover:border-[#3B3DA6]/20"
                      >
                        <div className="mb-2 flex items-center justify-between">
                          <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${ann.tagStyle}`}>
                            {ann.tag}
                          </span>
                          <span className="text-[11px] text-[#AAAAC8]">{ann.time}</span>
                        </div>
                        <p className="text-[13px] font-semibold text-[#1A1C5C]">{ann.title}</p>
                        <p className="mt-1 text-[12px] leading-relaxed text-[#8B8DAE]">{ann.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right 1/3 */}
              <div className="space-y-4">
                <MiniCalendar />

                {/* Sessions */}
                <div className="rounded-xl border border-[#DDDDF0] bg-white p-4">
                  <div className="mb-3 flex items-center justify-between border-b border-[#EAEBF6] pb-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-[#3B3DA6]" />
                      <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#AAAAC8]">
                        Sessions
                      </span>
                    </div>
                    <Link
                      to="/schedule"
                      className="text-[11px] font-bold uppercase tracking-wider text-[#3B3DA6] hover:underline"
                    >
                      All
                    </Link>
                  </div>
                  <div className="space-y-2.5">
                    {upcomingSessions.map((s) => (
                      <div
                        key={s.id}
                        className="flex items-start gap-3 rounded-lg border border-[#EAEBF6] bg-[#F4F5FB] p-3"
                      >
                        <div className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-lg bg-[#3B3DA6] text-white">
                          <span className="text-[13px] font-bold leading-none">{s.day}</span>
                          <span className="text-[9px] uppercase leading-none opacity-75">
                            {new Date(s.date).toLocaleString("default", { month: "short" })}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-[12px] font-semibold leading-snug text-[#1A1C5C]">{s.title}</p>
                          <p className="mt-0.5 text-[11px] text-[#8B8DAE]">{s.time} · {s.venue}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Community */}
                <div className="rounded-xl border border-[#DDDDF0] bg-white p-4">
                  <div className="mb-3 flex items-center gap-2 border-b border-[#EAEBF6] pb-3">
                    <MessageSquare className="h-4 w-4 text-[#3B3DA6]" />
                    <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#AAAAC8]">
                      Community
                    </span>
                  </div>
                  <p className="mb-3 text-[12px] leading-relaxed text-[#8B8DAE]">
                    Join technical discussions, case threads, and connect with instructors across all cohorts.
                  </p>
                  <Link
                    to="/community"
                    className="flex items-center justify-between rounded-lg bg-[#3B3DA6] px-4 py-2.5 text-[12px] font-bold uppercase tracking-wider text-white transition hover:bg-[#2B2D8A]"
                  >
                    Enter Community Hub <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}