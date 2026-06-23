import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { requireAuth } from "../lib/auth";
import { withAuth } from "../components/ProtectedPage";
import { logout } from "../lib/logout";
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
  Menu,
  X,
  ChevronDown,
  Search,
  Play,
  Lock,
  Star,
  ArrowRight,
  Loader,
  Mail,
  Phone,
  Award,
} from "lucide-react";
import ecgLogo from "../assets/ecg-logo.jpg"; // ← make sure ecg-logo.jpg is in src/assets/

export const Route = createFileRoute("/courses")({
  beforeLoad: requireAuth,
  component: withAuth(CoursesPage),
});

type UserProfile = {
  id?: number;
  name?: string;
  username?: string;
  email?: string;
  phone_number?: string;
  is_active?: boolean;
};

type Course = {
  id: number;
  title: string;
  code: string;
  description: string;
  modules_count: number;
  is_active: boolean;
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
  { icon: BookOpen, label: "Courses", to: "/courses" },
  { icon: Newspaper, label: "News", to: "/news" },
  { icon: Users, label: "My Community", to: "/community" },
  { icon: CalendarDays, label: "Study Planner", to: "/study" },
  { icon: Info, label: "Info Center", to: "/info" },
  { icon: HelpCircle, label: "Help & Contact", to: "/help" },
];

const CARD_THEMES = [
  {
    headerBg: "#1e206e",
    tileMid: "rgba(59,61,166,0.85)",
    tileDark: "rgba(12,14,52,0.9)",
    badge: { bg: "rgba(255,215,0,0.18)", text: "#FFD700", border: "rgba(255,215,0,0.35)" },
    progress: "#FFD700",
    button: "#1e206e",
  },
  {
    headerBg: "#0c4a6e",
    tileMid: "rgba(14,116,144,0.85)",
    tileDark: "rgba(7,28,48,0.9)",
    badge: { bg: "rgba(125,211,252,0.18)", text: "#7DD3FC", border: "rgba(125,211,252,0.35)" },
    progress: "#38BDF8",
    button: "#1e206e",
  },
  {
    headerBg: "#14532d",
    tileMid: "rgba(21,128,61,0.85)",
    tileDark: "rgba(5,30,15,0.9)",
    badge: { bg: "rgba(134,239,172,0.18)", text: "#4ADE80", border: "rgba(134,239,172,0.35)" },
    progress: "#22C55E",
    button: "#1e206e",
  },
  {
    headerBg: "#3b0764",
    tileMid: "rgba(88,28,135,0.85)",
    tileDark: "rgba(24,5,46,0.9)",
    badge: { bg: "rgba(196,181,253,0.18)", text: "#C4B5FD", border: "rgba(196,181,253,0.35)" },
    progress: "#A78BFA",
    button: "#1e206e",
  },
  {
    headerBg: "#7c2d12",
    tileMid: "rgba(194,65,12,0.85)",
    tileDark: "rgba(60,15,5,0.9)",
    badge: { bg: "rgba(253,186,116,0.18)", text: "#FDB97A", border: "rgba(253,186,116,0.35)" },
    progress: "#FB923C",
    button: "#1e206e",
  },
];

function TileHeader({ theme }: { theme: (typeof CARD_THEMES)[0] }) {
  return (
    <div
      className="h-[120px] w-full"
      style={{
        backgroundColor: theme.headerBg,
        backgroundImage: `
          linear-gradient(30deg, ${theme.tileDark} 12%, transparent 12.5%, transparent 87%, ${theme.tileDark} 87.5%, ${theme.tileDark}),
          linear-gradient(150deg, ${theme.tileDark} 12%, transparent 12.5%, transparent 87%, ${theme.tileDark} 87.5%, ${theme.tileDark}),
          linear-gradient(30deg, ${theme.tileDark} 12%, transparent 12.5%, transparent 87%, ${theme.tileDark} 87.5%, ${theme.tileDark}),
          linear-gradient(150deg, ${theme.tileDark} 12%, transparent 12.5%, transparent 87%, ${theme.tileDark} 87.5%, ${theme.tileDark}),
          linear-gradient(60deg, ${theme.tileMid} 25%, transparent 25.5%, transparent 75%, ${theme.tileMid} 75%, ${theme.tileMid}),
          linear-gradient(60deg, ${theme.tileMid} 25%, transparent 25.5%, transparent 75%, ${theme.tileMid} 75%, ${theme.tileMid})
        `,
        backgroundSize: "36px 62px",
        backgroundPosition: "0 0, 0 0, 18px 31px, 18px 31px, 0 0, 18px 31px",
      }}
    />
  );
}

function CourseCard({ course, progress, enrolled, colorIndex, onEnroll, enrolling }: {
  course: Course;
  progress: Progress | null;
  enrolled: boolean;
  colorIndex: number;
  onEnroll: (courseId: number) => void;
  enrolling: boolean;
}) {
  const theme = CARD_THEMES[colorIndex % CARD_THEMES.length];
  const percentage = progress?.percentage ?? 0;

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-[#DDDDF0] bg-white shadow-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
      <TileHeader theme={theme} />

      <div className="flex flex-1 flex-col p-5">
        <span
          className="mb-3 inline-block self-start rounded-md px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
          style={{ backgroundColor: theme.badge.bg, color: theme.badge.text, border: `1px solid ${theme.badge.border}` }}
        >
          {course.code}
        </span>

        <h3 className="mb-1 text-[15px] font-bold leading-snug text-[#1A1C5C] line-clamp-2">{course.title}</h3>

        <p className="mb-3 text-[11px] text-[#8B8DAE]">
          {course.description
            ? course.description.slice(0, 50) + (course.description.length > 50 ? "…" : "")
            : "ECG Training Center"}
        </p>

        <div className="mb-4 flex items-center gap-3 border-b border-[#EAEBF6] pb-4">
          <div className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5" style={{ fill: "#FFD700", color: "#FFD700" }} />
            <span className="text-[12px] font-semibold text-[#1A1C5C]">4.8</span>
          </div>
          <span className="text-[#DDDDF0]">·</span>
          <div className="flex items-center gap-1 text-[12px] text-[#8B8DAE]">
            <Users className="h-3.5 w-3.5" />
            <span>142</span>
          </div>
          <span className="text-[#DDDDF0]">·</span>
          <span className="text-[12px] font-medium text-[#8B8DAE]">{course.modules_count} mod</span>
        </div>

        {enrolled && (
          <div className="mb-4">
            <div className="mb-1.5 flex items-center justify-between text-[11px]">
              <span className="font-bold uppercase tracking-wider text-[#AAAAC8]">
                {percentage === 100 ? "Completed" : "Progress"}
              </span>
              <span className="font-bold text-[#1A1C5C]">{percentage}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-[#F0F2FB]">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${percentage}%`, backgroundColor: theme.progress }}
              />
            </div>
            {progress?.lesson_title && (
              <p className="mt-2 text-[11px] text-[#8B8DAE] line-clamp-1">
                <span className="font-bold text-[#1A1C5C]">Next:</span> {progress.lesson_title}
              </p>
            )}
          </div>
        )}

        <div className="mt-auto">
          {enrolled && percentage === 100 ? (
            <div className="flex items-center justify-center gap-1.5 rounded-xl border border-[#A3E0C9] bg-[#E6F6F0] py-2.5 text-[11px] font-bold uppercase tracking-wider text-[#147D64]">
              <Award className="h-4 w-4" /> Certification Earned
            </div>
          ) : (
            <button
              onClick={() => onEnroll(course.id)}
              disabled={enrolling}
              className="group flex w-full items-center justify-between rounded-xl px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-50"
              style={{ backgroundColor: theme.button }}
            >
              {enrolled ? (
                <>
                  <span className="flex items-center gap-1.5">
                    <Play className="h-3.5 w-3.5 fill-current" />
                    Continue
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </>
              ) : (
                <>
                  <span className="flex items-center gap-1.5">
                    {enrolling ? <Loader className="h-3.5 w-3.5 animate-spin" /> : <Lock className="h-3.5 w-3.5" />}
                    {enrolling ? "Enrolling..." : "Enroll Now"}
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function SidebarContent({ displayName, initials, email, onLogout, onClose }: {
  displayName: string; initials: string; email: string;
  onLogout: () => void; onClose?: () => void;
}) {
  return (
    <div className="flex h-full flex-col bg-[#1e206e]">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
        <div className="flex items-center gap-2.5">
          {/* ECG Official Logo */}
          <img
            src={ecgLogo}
            alt="ECG Logo"
            className="h-10 w-10 rounded-md object-contain bg-white p-0.5"
          />
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
        <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-widest text-white/30">Navigation</p>
        {navItems.map(({ icon: Icon, label, to }) => (
          <Link key={to} to={to} onClick={onClose}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-all ${to === "/courses" ? "bg-white/12 text-white" : "text-white/55 hover:bg-white/7 hover:text-white/85"}`}>
            <Icon className={`h-4 w-4 shrink-0 ${to === "/courses" ? "text-[#FFD700]" : ""}`} />
            {label}
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
          <button onClick={onLogout} className="shrink-0 rounded p-1 text-white/35 transition hover:text-[#E8534A]">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function CoursesPage() {
  const navigate = useNavigate();
  const profileMenuRef = useRef<HTMLDivElement | null>(null);

  const [profile] = useState<UserProfile>(() => {
    try {
      const user = localStorage.getItem("user");
      return user ? JSON.parse(user) : {};
    } catch {
      return {};
    }
  });

  const [courses, setCourses] = useState<Course[]>([]);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<Set<number>>(new Set());
  const [progressMap, setProgressMap] = useState<Map<number, Progress>>(new Map());
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [enrollModal, setEnrollModal] = useState<Course | null>(null);
  const [confirming, setConfirming] = useState(false);
  const token = localStorage.getItem("access_token");

  const displayName = profile?.name || profile?.username || "Trainee";
  const initials = displayName.slice(0, 2).toUpperCase();

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const [coursesRes, myCoursesRes, progressRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/courses/`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_BASE_URL}/api/my-courses/`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_BASE_URL}/api/progress/`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        const coursesData = await coursesRes.json();
        const myCoursesData = await myCoursesRes.json();
        const progressData = await progressRes.json();

        setCourses(coursesData);

        const enrolledIds = new Set<number>(
          Array.isArray(myCoursesData.courses) ? myCoursesData.courses.map((e: any) => Number(e.id)) : []
        );
        setEnrolledCourseIds(enrolledIds);

        const pMap = new Map<number, Progress>();
        if (Array.isArray(progressData)) {
          progressData.forEach((p: Progress) => {
            const courseId = coursesData.find((c: Course) => c.title === p.course_title)?.id;
            if (courseId) pMap.set(courseId, p);
          });
        }
        setProgressMap(pMap);
      } catch (err) {
        console.error("Failed to fetch data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setProfileOpen(false);
    logout(navigate);
  };

  const handleEnroll = (courseId: number) => {
    if (enrolledCourseIds.has(courseId)) {
      navigate({ to: `/course/${courseId}` });
      return;
    }
    const course = courses.find(c => c.id === courseId);
    setEnrollModal(course || null);
  };

  const handleConfirmEnroll = async () => {
    if (!enrollModal) return;
    setConfirming(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/enroll/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ course: enrollModal.id, status: "active" }),
      });

      const body = await res.json().catch(() => null);

      if (res.ok) {
        setEnrolledCourseIds(new Set([...enrolledCourseIds, enrollModal.id]));
        setEnrollModal(null);
        navigate({ to: "/my-courses" });
      } else {
        console.error("Enrollment error:", res.status, body);
      }
    } catch (err) {
      console.error("Enrollment failed", err);
    } finally {
      setConfirming(false);
    }
  };

  const filteredCourses = courses.filter(
    (c) => c.title.toLowerCase().includes(searchTerm.toLowerCase()) || c.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const enrolledCourses = filteredCourses.filter((c) => enrolledCourseIds.has(c.id));
  const availableCourses = filteredCourses.filter((c) => !enrolledCourseIds.has(c.id));

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

        <aside className="hidden lg:flex w-[220px] min-w-[220px] flex-col border-r border-[#DDDDF0]">
          <SidebarContent displayName={displayName} initials={initials} email={profile?.email || ""} onLogout={handleLogout} />
        </aside>

        {sidebarOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
            <div className="absolute left-0 top-0 h-full w-[260px] shadow-2xl">
              <SidebarContent displayName={displayName} initials={initials} email={profile?.email || ""} onLogout={handleLogout} onClose={() => setSidebarOpen(false)} />
            </div>
          </div>
        )}

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex items-center justify-between border-b border-[#DDDDF0] bg-white px-4 py-3 lg:px-6">
            <div className="flex items-center gap-3">
              <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#DDDDF0] bg-[#F4F5FB] text-[#8B8DAE] lg:hidden" onClick={() => setSidebarOpen(true)}>
                <Menu className="h-4 w-4" />
              </button>
              <div>
                <div className="text-[15px] font-semibold text-[#1A1C5C]">Courses</div>
                <div className="text-[11px] text-[#AAAAC8]">{courses.length} courses available</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#DDDDF0] bg-[#F4F5FB] text-[#8B8DAE]">
                <Bell className="h-4 w-4" />
              </button>
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 rounded-lg border border-[#DDDDF0] bg-[#F4F5FB] px-2 py-1.5 lg:px-3"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded bg-[#3B3DA6] text-[10px] font-bold text-white">
                    {initials}
                  </div>
                  <span className="hidden max-w-[160px] truncate text-[13px] font-medium text-[#1A1C5C] sm:block">{displayName}</span>
                  <ChevronDown className="h-3.5 w-3.5 text-[#8B8DAE]" />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-11 z-50 w-[300px] rounded-xl border border-[#DDDDF0] bg-white p-4 shadow-xl">
                    <div className="flex items-start gap-3 border-b border-[#EAEBF6] pb-4 mb-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#3B3DA6] text-[13px] font-bold text-white">
                        {initials}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[14px] font-bold text-[#1A1C5C]">{displayName}</p>
                        <p className="text-[12px] text-[#8B8DAE]">@{profile.username || "trainee"}</p>
                      </div>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-[13px] text-[#1A1C5C]">
                        <Mail className="h-4 w-4 text-[#8B8DAE]" />
                        <span className="truncate">{profile.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[13px] text-[#1A1C5C]">
                        <Phone className="h-4 w-4 text-[#8B8DAE]" />
                        <span>{profile.phone_number || "—"}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 border-t border-[#EAEBF6] pt-3">
                      <Link to="/profile" className="flex-1 rounded-lg bg-[#3B3DA6] px-3 py-2 text-center text-[12px] font-bold text-white">
                        Profile
                      </Link>
                      <button onClick={handleLogout} className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#F7C1C1] bg-[#FCEBEB] text-[#A32D2D]">
                        <LogOut className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-4 lg:p-6">

            <div className="relative mb-6 overflow-hidden rounded-xl p-5 lg:p-6" style={{ background: "linear-gradient(135deg, #2B2D8A 0%, #3B3DA6 60%, #4E50C4 100%)" }}>
              <div className="pointer-events-none absolute -right-4 -top-4 h-32 w-32 rounded-full bg-white/5" />
              <div className="relative">
                <h1 className="text-2xl font-bold text-white mb-1">Explore & Learn</h1>
                <p className="text-white/70 text-sm">Continue your learning journey with our world-class courses</p>
              </div>
            </div>

            <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
              <div className="col-span-1 md:col-span-2">
                <div className="relative flex items-center">
                  <Search className="absolute left-3 h-4 w-4 text-[#AAAAC8] pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search courses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white border border-[#DDDDF0] rounded-xl pl-10 pr-4 py-2.5 text-[13px] focus:outline-none focus:border-[#3B3DA6]"
                  />
                </div>
              </div>

              <div className="rounded-xl border border-[#DDDDF0] bg-white p-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#AAAAC8] mb-1">My Courses</p>
                <p className="text-[20px] font-bold text-[#1A1C5C]">{enrolledCourses.length}</p>
              </div>

              <div className="rounded-xl border border-[#DDDDF0] bg-white p-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#AAAAC8] mb-1">Available</p>
                <p className="text-[20px] font-bold text-[#1A1C5C]">{availableCourses.length}</p>
              </div>
            </div>

            {enrolledCourses.length > 0 && (
              <div className="mb-10">
                <div className="mb-4">
                  <h2 className="text-[18px] font-bold text-[#1A1C5C]">MY COURSES</h2>
                  <p className="text-[12px] text-[#8B8DAE]" style={{ fontFamily: "'Inter', sans-serif", fontVariant: "small-caps" }}>Continue where you left off</p>
                </div>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {enrolledCourses.map((course, idx) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      progress={progressMap.get(course.id) || null}
                      enrolled={true}
                      colorIndex={idx}
                      onEnroll={handleEnroll}
                      enrolling={false}
                    />
                  ))}
                </div>
              </div>
            )}

            {availableCourses.length > 0 && (
              <div>
                <div className="mb-4">
                  <h2 className="text-[18px] font-bold text-[#1A1C5C]">AVAILABLE COURSES</h2>
                  <p className="text-[12px] text-[#8B8DAE]" style={{ fontFamily: "'Inter', sans-serif", fontVariant: "small-caps" }}>Start a new learning journey</p>
                </div>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {availableCourses.map((course, idx) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      progress={null}
                      enrolled={false}
                      colorIndex={idx + enrolledCourses.length}
                      onEnroll={handleEnroll}
                      enrolling={false}
                    />
                  ))}
                </div>
              </div>
            )}

            {filteredCourses.length === 0 && (
              <div className="flex h-96 items-center justify-center rounded-2xl border-2 border-dashed border-[#DDDDF0] bg-white">
                <div className="text-center">
                  <BookOpen className="mx-auto h-16 w-16 text-[#DDDDF0] mb-4" />
                  <p className="text-lg font-semibold text-[#8B8DAE]">No courses found</p>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {enrollModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-[#1A1C5C] mb-2">{enrollModal.title}</h2>
            <p className="text-sm text-[#8B8DAE] mb-1">{enrollModal.code}</p>
            <p className="text-sm text-[#8B8DAE] mb-4">{enrollModal.modules_count} modules</p>

            <p className="text-sm text-[#6B7090] mb-6 line-clamp-3">{enrollModal.description}</p>

            <div className="flex gap-3">
              <button
                onClick={() => setEnrollModal(null)}
                className="flex-1 border border-[#DDDDF0] rounded-lg px-4 py-2.5 text-[#1A1C5C] font-bold hover:bg-[#F4F5FB]"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmEnroll}
                disabled={confirming}
                className="flex-1 bg-[#3B3DA6] rounded-lg px-4 py-2.5 text-white font-bold hover:bg-[#2B2D8A] disabled:opacity-50"
              >
                {confirming ? "Confirming..." : "Confirm Enroll"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CoursesPage;
