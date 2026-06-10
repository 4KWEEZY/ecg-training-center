import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
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
  Calendar,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  MessageSquare,
  ArrowRight,
  Menu,
  X,
  Loader,
  Mail,
  TrendingUp,
  Phone,
  UserRound,
  Play,
} from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
});

type UserProfile = {
  id?: number;
  name?: string;
  username?: string;
  email?: string;
  phone_number?: string;
  date_joined?: string;
  is_active?: boolean;
};

type Announcement = {
  id: number;
  title: string;
  description: string;
  tag: string;
  created_at: string;
};

type Session = {
  id: number;
  title: string;
  session_date: string;
  session_time: string;
  venue: string;
};

type Course = {
  id: number;
  title: string;
  code: string;
  modules_count: number;
};

type Progress = {
  id: number;
  course_title: string;
  module_title: string | null;
  lesson_title: string | null;
  percentage: number;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", to: "/dashboard" },
  { icon: BookOpen, label: "Courses", to: "/courses" }, // Connected here
  { icon: Newspaper, label: "News", to: "/news" },
  { icon: Users, label: "My Community", to: "/community" },
  { icon: CalendarDays, label: "Study Planner", to: "/study" },
  { icon: Info, label: "Info Center", to: "/info" },
  { icon: HelpCircle, label: "Help & Contact", to: "/help" },
];

function getStoredUser(): UserProfile {
  try {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : {};
  } catch {
    return {};
  }
}

function MiniCalendar({ sessions }: { sessions: Session[] }) {
  const today = new Date();
  const [current, setCurrent] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const year = current.getFullYear();
  const month = current.getMonth();
  const monthName = current.toLocaleString("default", { month: "long" });
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const sessionDays = sessions
    .filter((s) => {
      const sDate = new Date(s.session_date);
      return sDate.getFullYear() === year && sDate.getMonth() === month;
    })
    .map((s) => new Date(s.session_date).getDate());

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

function DashboardPage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);

  const [profile] = useState<UserProfile>(() => getStoredUser());
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [recentCourses, setRecentCourses] = useState<Course[]>([]);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [coursesCount, setCoursesCount] = useState(0);

  const [loading, setLoading] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);

  const displayName = profile?.name || profile?.username || "Trainee";
  const initials = displayName.slice(0, 2).toUpperCase();
  const currentPath = "/dashboard";
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const [announcementsRes, sessionsRes, coursesRes, progressRes, myCoursesRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/announcements/`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_BASE_URL}/api/sessions/`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_BASE_URL}/api/courses/`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_BASE_URL}/api/progress/`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_BASE_URL}/api/my-courses/`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        const announcementsData = await announcementsRes.json();
        const sessionsData = await sessionsRes.json();
        const coursesData = await coursesRes.json();
        const progressData = await progressRes.json();
        const myCoursesData = await myCoursesRes.json();

        setAnnouncements(announcementsData.slice(0, 2));
        setSessions(sessionsData.slice(0, 2));
        setRecentCourses(coursesData.slice(0, 3));
        setProgress(Array.isArray(progressData) ? progressData[0] : null);
        setCoursesCount(Array.isArray(myCoursesData.courses) ? myCoursesData.courses.length : 0);
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setProfileOpen(false);
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate({ to: "/login" });
  };

  const quickLinks = [
    { icon: BookOpen, label: "My Courses", subtitle: `${coursesCount} active`, to: "/my-courses", color: "text-[#3B3DA6]", iconBg: "bg-[#F0F2FB]" },
    { icon: TrendingUp, label: "My Progress", subtitle: "Updated today", to: "/progress", color: "text-[#3B3DA6]", iconBg: "bg-[#F0F2FB]" },
    { icon: HelpCircle, label: "Help", subtitle: "Ask a mentor", to: "/help", color: "text-[#3B3DA6]", iconBg: "bg-[#F0F2FB]" },
  ];

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: "#f0f2fb" }}>
        <Loader className="h-8 w-8 animate-spin text-[#3B3DA6]" />
      </div>
    );
  }

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <div className="flex min-h-screen" style={{ background: "#f0f2fb", fontFamily: "'Inter', sans-serif" }}>

        {/* Desktop sidebar */}
        <aside className="hidden lg:flex w-[220px] min-w-[220px] flex-col border-r border-[#DDDDF0]">
          <SidebarContent displayName={displayName} initials={initials} email={profile?.email || ""} currentPath={currentPath} onLogout={handleLogout} />
        </aside>

        {/* Mobile drawer */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
            <div className="absolute left-0 top-0 h-full w-[260px] shadow-2xl">
              <SidebarContent displayName={displayName} initials={initials} email={profile?.email || ""} currentPath={currentPath} onLogout={handleLogout} onClose={() => setSidebarOpen(false)} />
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
              <div className="relative" ref={profileMenuRef}>
                <button
                  type="button"
                  onClick={() => setProfileOpen((open) => !open)}
                  className="flex items-center gap-2 rounded-lg border border-[#DDDDF0] bg-[#F4F5FB] px-2 py-1.5 transition hover:border-[#3B3DA6]/40 hover:bg-white lg:px-3"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded bg-[#3B3DA6] text-[10px] font-bold text-white">
                    {initials}
                  </div>
                  <span className="hidden max-w-[160px] truncate text-[13px] font-medium text-[#1A1C5C] sm:block">{displayName}</span>
                  <ChevronDown className="h-3.5 w-3.5 text-[#8B8DAE]" />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-11 z-50 w-[320px] rounded-xl border border-[#DDDDF0] bg-white p-4 shadow-xl">
                    <div className="mb-4 flex items-start gap-3 border-b border-[#EAEBF6] pb-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#3B3DA6] text-[13px] font-bold text-white">
                        {initials}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[14px] font-bold text-[#1A1C5C]">{displayName}</p>
                        <p className="truncate text-[12px] text-[#8B8DAE]">@{profile.username || "trainee"}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-[13px] text-[#1A1C5C]">
                        <Mail className="h-4 w-4 text-[#8B8DAE]" />
                        <span className="truncate">{profile.email || "No email"}</span>
                      </div>

                      <div className="flex items-center gap-2 text-[13px] text-[#1A1C5C]">
                        <Phone className="h-4 w-4 text-[#8B8DAE]" />
                        <span>{profile.phone_number || "No phone"}</span>
                      </div>

                      <div className="flex items-center gap-2 text-[13px] text-[#1A1C5C]">
                        <UserRound className="h-4 w-4 text-[#8B8DAE]" />
                        <span>{profile.is_active ? "Active" : "Inactive"}</span>
                      </div>

                      <div className="flex gap-2 border-t border-[#EAEBF6] pt-3">
                        <Link to="/profile" className="flex-1 rounded-lg bg-[#3B3DA6] px-3 py-2 text-center text-[12px] font-bold uppercase tracking-wider text-white transition hover:bg-[#2B2D8A]">
                          View Profile
                        </Link>

                        <button
                          type="button"
                          onClick={handleLogout}
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#F7C1C1] bg-[#FCEBEB] text-[#A32D2D] hover:bg-[#F7C1C1]"
                          title="Logout"
                        >
                          <LogOut className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
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
                  <span className="rounded-full bg-white/10 px-3 py-1 text-[12px] text-white/75">@{profile?.username || "trainee"}</span>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-[12px] text-white/75">{profile?.email || "—"}</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="mb-5 overflow-hidden rounded-2xl border border-[#DDDDF0] bg-white shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#DDDDF0]">
                {quickLinks.map(({ icon: Icon, label, subtitle, to, color, iconBg }) => (
                  <Link
                    key={label}
                    to={to}
                    className="group flex items-center gap-4 px-5 py-4 transition-all hover:bg-[#F8FAFF]"
                  >
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconBg} ${color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-bold text-[#1A1C5C]">{label}</p>
                      <p className="text-[11px] text-[#8B8DAE] mt-1">{subtitle}</p>
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
                {progress && (
                  <div className="relative overflow-hidden rounded-2xl p-5 shadow-lg lg:p-7" style={{ background: "linear-gradient(145deg, #12153D 0%, #1A1D4E 50%, #1E2258 100%)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <div className="relative">
                      <div className="mb-4 flex items-start justify-between gap-4">
                        <div className="flex items-center gap-2">
                          <span className="relative flex h-2.5 w-2.5 shrink-0">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" style={{ backgroundColor: "#34D399" }} />
                            <span className="relative inline-flex h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "#34D399" }} />
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: "#9FA3CC" }}>Currently Studying</span>
                        </div>
                        {/* Dynamic connection fallback if progress exists */}
                        <Link to="/my-courses" className="inline-flex shrink-0 items-center gap-2 rounded-full px-5 py-2.5 text-[12px] font-bold uppercase tracking-wider text-[#1A1C5C] transition active:scale-95 lg:px-6 lg:py-3 lg:text-[13px]" style={{ background: "linear-gradient(135deg, #FFD700 0%, #FFC200 100%)" }}>
                          <Play className="h-3.5 w-3.5 fill-current lg:h-4 lg:w-4" />Resume
                        </Link>
                      </div>
                      <h2 className="text-[24px] font-bold leading-tight tracking-tight text-white lg:text-[32px]">
                        {progress.course_title}
                      </h2>
                      <p className="mt-3 text-[13px] font-medium lg:text-[14px]" style={{ color: "#9FA3CC" }}>
                        {progress.module_title} — {progress.lesson_title}
                      </p>
                      <div className="mt-5">
                        <div className="mb-2 flex items-center justify-between text-[12px] lg:text-[13px]">
                          <span className="font-semibold" style={{ color: "#C8CAEE" }}>Progress</span>
                          <span className="font-bold" style={{ color: "#FFD700" }}>{progress.percentage}%</span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.08)" }}>
                          <div className="h-full rounded-full" style={{ width: `${progress.percentage}%`, background: "linear-gradient(90deg, #4E50C4 0%, #FFD700 100%)" }} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Announcements */}
                <div className="rounded-xl border border-[#DDDDF0] bg-white p-4 lg:p-5">
                  <div className="mb-4 flex items-center justify-between border-b border-[#EAEBF6] pb-3">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4 text-[#3B3DA6]" />
                      <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#AAAAC8]">Announcements</span>
                    </div>
                    <Link to="/news" className="text-[11px] font-bold uppercase tracking-wider text-[#3B3DA6] hover:underline">View All</Link>
                  </div>

                  <div className="space-y-3">
                    {announcements.length > 0 ? (
                      announcements.map((ann) => (
                        <div key={ann.id} className="rounded-lg border border-[#EAEBF6] bg-[#F4F5FB] p-3 transition hover:border-[#3B3DA6]/20">
                          <div className="mb-2 flex items-center justify-between">
                            <span className="rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#E6F1FB] text-[#185FA5] border-[#B5D4F4]">{ann.tag}</span>
                            <span className="text-[11px] text-[#AAAAC8]">{new Date(ann.created_at).toLocaleDateString()}</span>
                          </div>
                          <p className="text-[13px] font-semibold text-[#1A1C5C]">{ann.title}</p>
                          <p className="mt-1 text-[12px] leading-relaxed text-[#8B8DAE]">{ann.description}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-[13px] text-[#8B8DAE]">No announcements yet.</p>
                    )}
                  </div>
                </div>

                {/* Recently Accessed Courses */}
                <div className="rounded-2xl border border-[#DDDDF0] bg-white p-4 shadow-sm lg:p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-[#3B3DA6]" />
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-[#3B3DA6]">Recent Courses</h3>
                    </div>
                    <Link to="/my-courses" className="text-xs font-semibold uppercase tracking-wider text-[#3B3DA6]">View All</Link>
                  </div>
                  <div className="mt-4 space-y-3">
                    {recentCourses.length > 0 ? (
                      recentCourses.map((c) => (
                        <Link key={c.id} to="/my-courses" className="flex items-center gap-3 rounded-xl border border-[#EEF0F6] bg-[#FAFBFD] p-3 transition active:scale-[0.98] lg:p-4">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#E6F1FB] text-[#185FA5] lg:h-11 lg:w-11">
                            <BookOpen className="h-4 w-4 lg:h-5 lg:w-5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-[13px] font-semibold text-[#1A1E3A]">{c.title}</p>
                            <p className="mt-0.5 text-[11px] text-[#6B7090]">{c.code} · {c.modules_count} modules</p>
                          </div>
                        </Link>
                      ))
                    ) : (
                      <p className="text-[13px] text-[#8B8DAE]">No courses enrolled yet.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Right sidebar */}
              <div className="space-y-4">
                <MiniCalendar sessions={sessions} />

                <div className="rounded-xl border border-[#DDDDF0] bg-white p-4">
                  <div className="mb-3 flex items-center justify-between border-b border-[#EAEBF6] pb-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-[#3B3DA6]" />
                      <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#AAAAC8]">Sessions</span>
                    </div>
                    <Link to="/schedule" className="text-[11px] font-bold uppercase tracking-wider text-[#3B3DA6] hover:underline">All</Link>
                  </div>

                  <div className="space-y-2.5">
                    {sessions.length > 0 ? (
                      sessions.map((s) => (
                        <div key={s.id} className="flex items-start gap-3 rounded-lg border border-[#EAEBF6] bg-[#F4F5FB] p-3">
                          <div className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-lg bg-[#3B3DA6] text-white">
                            <span className="text-[13px] font-bold leading-none">{new Date(s.session_date).getDate()}</span>
                            <span className="text-[9px] uppercase leading-none opacity-75">{new Date(s.session_date).toLocaleString("default", { month: "short" })}</span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-[12px] font-semibold leading-snug text-[#1A1C5C]">{s.title}</p>
                            <p className="mt-0.5 text-[11px] text-[#8B8DAE]">{s.session_time} - {s.venue}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-[13px] text-[#8B8DAE]">No upcoming sessions.</p>
                    )}
                  </div>
                </div>

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

export default DashboardPage;