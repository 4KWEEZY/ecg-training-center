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
  Menu,
  X,
  CheckCircle2,
  TrendingUp,
  Trophy,
  Zap,
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
  {
    icon: BookOpen,
    label: "My Courses",
    subtitle: "6 active",
    to: "/my-courses",
    color: "text-[#3B3DA6]",
    iconBg: "bg-[#F0F2FB]",
  },
  {
    icon: TrendingUp,
    label: "My Progress",
    subtitle: "Updated today",
    to: "/progress",
    color: "text-[#3B3DA6]",
    iconBg: "bg-[#F0F2FB]",
  },
  {
    icon: HelpCircle,
    label: "Help",
    subtitle: "Ask a mentor",
    to: "/help",
    color: "text-[#3B3DA6]",
    iconBg: "bg-[#F0F2FB]",
  },
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


// ── Helpers ───────────────────────────────────────────────────────────────────
function ProgressBar({
  value,
  color,
  accent,
  height = "h-2",
}: {
  value: number;
  color: string;
  accent: string;
  height?: string;
}) {
  return (
    <div className={`w-full overflow-hidden rounded-full bg-[#F0F2FB] ${height}`}>
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{
          width: `${value}%`,
          background: `linear-gradient(90deg, ${color} 0%, ${accent} 100%)`,
          boxShadow: `0 0 8px ${accent}55`,
        }}
      />
    </div>
  );
}


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
    <div className="rounded-xl border border-[#DDDDF0] bg-white p-4">
      <div className="mb-3 flex items-center justify-between border-b border-[#EAEBF6] pb-3">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-[#3B3DA6]" />
          <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#AAAAC8]">Calendar</span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setCurrent(new Date(year, month - 1, 1))} className="flex h-6 w-6 items-center justify-center rounded border border-[#DDDDF0] bg-[#F4F5FB] text-[#8B8DAE]">
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <span className="min-w-[90px] text-center text-[12px] font-semibold text-[#1A1C5C]">{monthName} {year}</span>
          <button onClick={() => setCurrent(new Date(year, month + 1, 1))} className="flex h-6 w-6 items-center justify-center rounded border border-[#DDDDF0] bg-[#F4F5FB] text-[#8B8DAE]">
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
              <div className={`flex h-7 w-7 items-center justify-center rounded-full text-[12px] font-medium ${isToday ? "bg-[#3B3DA6] font-bold text-white" : "text-[#1A1C5C]"}`}>
                {day}
              </div>
              {hasSession && <div className="mt-0.5 h-1 w-1 rounded-full bg-[#E8534A]" />}
            </div>
          );
        })}
      </div>
      <div className="mt-3 flex items-center gap-3 border-t border-[#EAEBF6] pt-2">
        <div className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-[#3B3DA6]" /><span className="text-[11px] text-[#8B8DAE]">Today</span></div>
        <div className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-[#E8534A]" /><span className="text-[11px] text-[#8B8DAE]">Session</span></div>
      </div>
    </div>
  );
}

function SidebarContent({ displayName, initials, email, currentPath, onLogout, onClose }: {
  displayName: string; initials: string; email: string; currentPath: string;
  onLogout: () => void; onClose?: () => void;
}) {
  return (
    <div className="flex h-full flex-col bg-[#1e206e]">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
        <div className="flex items-center gap-2.5">
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
        {onClose && (
          <button onClick={onClose} className="rounded p-1 text-white/40 hover:text-white lg:hidden">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-2 py-4">
        <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-widest text-white/30">Main</p>
        {navItems.slice(0, 4).map(({ icon: Icon, label, to }) => {
          const isActive = currentPath === to;
          return (
            <Link key={to} to={to} onClick={onClose}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-all ${isActive ? "bg-white/12 text-white" : "text-white/55 hover:bg-white/7 hover:text-white/85"}`}>
              <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-[#FFD700]" : ""}`} />
              {label}
            </Link>
          );
        })}
        <p className="mb-2 mt-4 px-2 text-[10px] font-bold uppercase tracking-widest text-white/30">Tools</p>
        {navItems.slice(4).map(({ icon: Icon, label, to }) => (
          <Link key={to} to={to} onClick={onClose}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium text-white/55 transition-all hover:bg-white/7 hover:text-white/85">
            <Icon className="h-4 w-4 shrink-0" />{label}
          </Link>
        ))}
      </nav>
      <div className="border-t border-white/10 p-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#3B3DA6] text-[11px] font-bold text-white">{initials}</div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-semibold text-white">{displayName}</p>
            <p className="truncate text-[11px] text-white/40">{email || "—"}</p>
          </div>
          <button onClick={onLogout} className="shrink-0 rounded p-1 text-white/35 transition hover:text-[#E8534A]" title="Logout">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}


// ── Dashboard Page ─────────────────────────────────────────────────────────────
function DashboardPage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <div className="flex min-h-screen" style={{ background: "#f0f2fb", fontFamily: "'Inter', sans-serif" }}>

        {/* Desktop sidebar */}
        <aside className="hidden lg:flex w-[220px] min-w-[220px] flex-col border-r border-[#DDDDF0]">
          <SidebarContent displayName={displayName} initials={initials} email={user?.email} currentPath={currentPath} onLogout={handleLogout} />
        </aside>

        {/* Mobile drawer */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
            <div className="absolute left-0 top-0 h-full w-[260px] shadow-2xl">
              <SidebarContent displayName={displayName} initials={initials} email={user?.email} currentPath={currentPath} onLogout={handleLogout} onClose={() => setSidebarOpen(false)} />
            </div>
          </div>
        )}

        <div className="flex min-w-0 flex-1 flex-col">
          {/* Header */}
          <header className="flex items-center justify-between border-b border-[#DDDDF0] bg-white px-4 py-3 lg:px-6">
            <div className="flex items-center gap-3">
              <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#DDDDF0] bg-[#F4F5FB] text-[#8B8DAE] lg:hidden" onClick={() => setSidebarOpen(true)}>
                <Menu className="h-4 w-4" />
              </button>
              <div>
                <div className="text-[15px] font-semibold text-[#1A1C5C]">Dashboard</div>
                <div className="text-[11px] text-[#AAAAC8]">
                  {new Date().toLocaleDateString("en-GB", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-[#DDDDF0] bg-[#F4F5FB] text-[#8B8DAE]">
                <Bell className="h-4 w-4" />
                <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#E8534A]" />
              </button>
              <div className="flex items-center gap-2 rounded-lg border border-[#DDDDF0] bg-[#F4F5FB] px-2 py-1.5 lg:px-3">
                <div className="flex h-6 w-6 items-center justify-center rounded bg-[#3B3DA6] text-[10px] font-bold text-white">{initials}</div>
                <span className="hidden text-[13px] font-medium text-[#1A1C5C] sm:block">{displayName}</span>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-4 lg:p-6">

            {/* Welcome banner */}
            <div className="relative mb-5 overflow-hidden rounded-xl p-5 lg:p-6" style={{ background: "linear-gradient(135deg, #2B2D8A 0%, #3B3DA6 60%, #4E50C4 100%)" }}>
              <div className="pointer-events-none absolute -right-4 -top-4 h-36 w-36 rounded-full bg-white/5" />
              <div className="pointer-events-none absolute bottom-0 right-16 h-28 w-28 rounded-full bg-white/5" />
              <div className="relative">
                <span className="inline-block rounded-full border border-yellow-400/30 bg-yellow-400/12 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-yellow-400">
                  Active Trainee Profile
                </span>
                <h1 className="mt-2 text-xl font-bold text-white lg:text-2xl">
                  Welcome Back, <span className="text-yellow-400">{displayName}</span>
                </h1>
                <p className="mt-1 text-[12px] text-white/55 lg:text-[13px]">
                  Cohort 2026 · Systems &amp; Technical Network Operations (IT Track)
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-white/10 px-3 py-1 text-[12px] text-white/75">@{user?.username || "trainee"}</span>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-[12px] text-white/75">{user?.email || "—"}</span>
                </div>
              </div>
            </div>

            {/* Joined Quick Links Container */}
            <div className="mb-5 overflow-hidden rounded-2xl border border-[#DDDDF0] bg-white shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#DDDDF0]">
                {quickLinks.map(({ icon: Icon, label, subtitle, to, color, iconBg }) => (
                  <Link
                    key={label}
                    to={to}
                    className="group flex items-center gap-4 px-5 py-4 transition-all hover:bg-[#F8FAFF] active:bg-[#F0F2FB]"
                  >
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconBg} ${color} transition-transform group-hover:scale-110`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-bold text-[#1A1C5C] leading-tight">{label}</p>
                      <p className="text-[11px] text-[#8B8DAE] mt-1 font-medium">{subtitle}</p>
                    </div>
                    <div className="flex h-7 w-7 items-center justify-center rounded-full opacity-0 transition-all group-hover:bg-white group-hover:opacity-100 group-hover:shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
                      <ArrowRight className="h-3.5 w-3.5 text-[#3B3DA6]" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Main 3-col grid */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">

              {/* Left/main col */}
              <div className="space-y-4 lg:col-span-2">

                {/* Currently Studying Card */}
                <div
                  className="relative overflow-hidden rounded-2xl p-5 shadow-lg lg:p-7"
                  style={{ background: "linear-gradient(145deg, #12153D 0%, #1A1D4E 50%, #1E2258 100%)", border: "1px solid rgba(255,255,255,0.07)" }}
                >
                  <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full opacity-20" style={{ background: "radial-gradient(circle, #3B3DA6 0%, transparent 70%)" }} />
                  <div className="pointer-events-none absolute -bottom-8 right-32 h-32 w-32 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #5B5ED6 0%, transparent 70%)" }} />

                  <div className="relative">
                    <div className="mb-4 flex items-start justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <span className="relative flex h-2.5 w-2.5 shrink-0">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" style={{ backgroundColor: "#34D399" }} />
                          <span className="relative inline-flex h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "#34D399" }} />
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: "#9FA3CC" }}>Currently Studying</span>
                      </div>
                      <button type="button"
                        className="inline-flex shrink-0 items-center gap-2 rounded-full px-5 py-2.5 text-[12px] font-bold uppercase tracking-wider text-[#1A1C5C] transition active:scale-95 lg:px-6 lg:py-3 lg:text-[13px]"
                        style={{ background: "linear-gradient(135deg, #FFD700 0%, #FFC200 100%)", boxShadow: "0 8px 28px -6px rgba(255,215,0,0.55)" }}
                      >
                        <Play className="h-3.5 w-3.5 fill-current lg:h-4 lg:w-4" />Resume
                      </button>
                    </div>
                    <p className="mb-1 text-[13px] font-medium" style={{ color: "#7B80C0" }}>Module 02</p>
                    <h2 className="text-[24px] font-bold leading-tight tracking-tight text-white lg:text-[32px]">
                      Workplace Safety &amp;<br />Compliance
                    </h2>
                    <p className="mt-3 text-[13px] font-medium lg:text-[14px]" style={{ color: "#9FA3CC" }}>
                      §2.4 — High Voltage Substation Isolation Protocols
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12px] lg:text-[13px]" style={{ color: "#7B80C0" }}>
                      <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" style={{ color: "#9FA3CC" }} />42 min left</span>
                      <span style={{ color: "#2E3270" }}>·</span>
                      <span>Instructor: K. Mensah</span>
                      <span style={{ color: "#2E3270" }}>·</span>
                      <span>Section 2 of 5</span>
                    </div>
                    <div className="mt-5">
                      <div className="mb-2 flex items-center justify-between text-[12px] lg:text-[13px]">
                        <span className="font-semibold" style={{ color: "#C8CAEE" }}>Module progress</span>
                        <span className="font-bold" style={{ color: "#FFD700" }}>17%</span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.08)" }}>
                        <div className="h-full rounded-full" style={{ width: "17%", background: "linear-gradient(90deg, #4E50C4 0%, #FFD700 100%)", boxShadow: "0 0 8px rgba(255,215,0,0.4)" }} />
                      </div>
                    </div>
                  </div>
                </div>


                {/* Announcements */}
                <div className="rounded-xl border border-[#DDDDF0] bg-white p-4 lg:p-5">
                  <div className="mb-4 flex items-center justify-between border-b border-[#EAEBF6] pb-3">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4 text-[#3B3DA6]" />
                      <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#AAAAC8]">Announcements</span>
                    </div>
                    <Link to="/news" className="text-[11px] font-bold uppercase tracking-wider text-[#3B3DA6]">View All</Link>
                  </div>
                  <div className="space-y-3">
                    {announcements.map((ann) => (
                      <div key={ann.id} className="rounded-lg border border-[#EAEBF6] bg-[#F4F5FB] p-3">
                        <div className="mb-2 flex items-center justify-between">
                          <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${ann.tagStyle}`}>{ann.tag}</span>
                          <span className="text-[11px] text-[#AAAAC8]">{ann.time}</span>
                        </div>
                        <p className="text-[13px] font-semibold text-[#1A1C5C]">{ann.title}</p>
                        <p className="mt-1 text-[12px] leading-relaxed text-[#8B8DAE]">{ann.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recently Accessed Courses */}
                <div className="rounded-2xl border border-[#DDDDF0] bg-white p-4 shadow-sm lg:p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-[#3B3DA6]" />
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-[#3B3DA6]">Recent Courses</h3>
                    </div>
                    <Link to="/courses" className="text-xs font-semibold uppercase tracking-wider text-[#3B3DA6]">View All</Link>
                  </div>
                  <div className="mt-4 space-y-3">
                    {[
                      { title: "Workplace Safety & Compliance", meta: "Module 02 · §2.4", accessed: "Just now" },
                      { title: "Power Systems Fundamentals", meta: "Module 01 · §1.6", accessed: "Yesterday" },
                      { title: "Network Operations Basics", meta: "Module 03 · §3.1", accessed: "3 days ago" },
                    ].map((c) => (
                      <Link key={c.title} to="/courses" className="flex items-center gap-3 rounded-xl border border-[#EEF0F6] bg-[#FAFBFD] p-3 transition active:scale-[0.98] lg:p-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#E6F1FB] text-[#185FA5] lg:h-11 lg:w-11">
                          <BookOpen className="h-4 w-4 lg:h-5 lg:w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[13px] font-semibold text-[#1A1E3A]">{c.title}</p>
                          <p className="mt-0.5 text-[11px] text-[#6B7090]">{c.meta} · {c.accessed}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right sidebar */}
              <div className="space-y-4">
                <MiniCalendar />

                {/* Sessions */}
                <div className="rounded-xl border border-[#DDDDF0] bg-white p-4">
                  <div className="mb-3 flex items-center justify-between border-b border-[#EAEBF6] pb-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-[#3B3DA6]" />
                      <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#AAAAC8]">Sessions</span>
                    </div>
                    <Link to="/schedule" className="text-[11px] font-bold uppercase tracking-wider text-[#3B3DA6]">All</Link>
                  </div>
                  <div className="space-y-2.5">
                    {upcomingSessions.map((s) => (
                      <div key={s.id} className="flex items-start gap-3 rounded-lg border border-[#EAEBF6] bg-[#F4F5FB] p-3">
                        <div className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-lg bg-[#3B3DA6] text-white">
                          <span className="text-[13px] font-bold leading-none">{s.day}</span>
                          <span className="text-[9px] uppercase leading-none opacity-75">{new Date(s.date).toLocaleString("default", { month: "short" })}</span>
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
                    <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#AAAAC8]">Community</span>
                  </div>
                  <p className="mb-3 text-[12px] leading-relaxed text-[#8B8DAE]">
                    Join technical discussions, case threads, and connect with instructors across all cohorts.
                  </p>
                  <Link to="/community" className="flex items-center justify-between rounded-lg bg-[#3B3DA6] px-4 py-2.5 text-[12px] font-bold uppercase tracking-wider text-white transition hover:bg-[#2B2D8A]">
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
