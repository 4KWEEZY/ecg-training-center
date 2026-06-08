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
  Menu,
  X,
  ChevronDown,
  Search,
  Filter,
  Play,
  Lock,
  Star,
  ArrowRight,
  Loader,
  Mail,
  Phone,
  UserRound,
  TrendingUp,
} from "lucide-react";

export const Route = createFileRoute("/courses")({
  component: CoursesPage,
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

const courseColors = [
  { bg: "from-[#6B5B95] to-[#5A4A84]", accent: "#FFD700", icon: "#7C6BA8" },
  { bg: "from-[#7B6BA8] to-[#6B5B95]", accent: "#E8D5FF", icon: "#8B7BB8" },
  { bg: "from-[#5A4A84] to-[#4A3A74]", accent: "#FFD700", icon: "#6B5B95" },
  { bg: "from-[#8B7BB8] to-[#7B6BA8]", accent: "#FFD700", icon: "#9B8BC8" },
  { bg: "from-[#4A3A74] to-[#3A2A64]", accent: "#E8D5FF", icon: "#5A4A84" },
];

function CourseCard({ course, progress, enrolled, colorIndex }: {
  course: Course;
  progress: Progress | null;
  enrolled: boolean;
  colorIndex: number;
}) {
  const color = courseColors[colorIndex % courseColors.length];
  const percentage = progress?.percentage || 0;

  return (
    <div className="group">
      <div className="relative overflow-hidden rounded-2xl border border-[#DDDDF0] bg-white shadow-lg transition-all duration-300 hover:shadow-2xl hover:border-[#3B3DA6]/40 hover:scale-105">
        {/* Gradient Header */}
        <div className={`h-20 bg-gradient-to-r ${color.bg} relative overflow-hidden`}>
          <div className="absolute -right-16 -top-16 w-40 h-40 rounded-full opacity-20" style={{ background: `radial-gradient(circle, ${color.accent} 0%, transparent 70%)` }} />
          <div className="relative h-full flex items-center px-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg text-white text-lg font-bold" style={{ backgroundColor: color.icon }}>
              {course.code.split('·')[0].trim().charAt(0)}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: color.accent === "#E8D5FF" ? "#8B7BB8" : color.accent }}>
            {course.code}
          </p>
          <h3 className="text-[16px] font-bold text-[#1A1C5C] mb-3 leading-tight">{course.title}</h3>

          {/* Stats */}
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-[#EAEBF6]">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4" style={{ fill: "#FFD700", color: "#FFD700" }} />
              <span className="text-[12px] font-semibold text-[#1A1C5C]">4.8</span>
            </div>
            <span className="text-[#DDDDF0]">·</span>
            <div className="flex items-center gap-1 text-[12px] text-[#8B8DAE]">
              <Users className="h-4 w-4" />
              142
            </div>
            <span className="text-[#DDDDF0]">·</span>
            <span className="text-[12px] text-[#8B8DAE] font-medium">{course.modules_count} mod</span>
          </div>

          {/* Progress or Description */}
          {enrolled ? (
            <>
              <div className="mb-3">
                <div className="flex justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#AAAAC8]">
                    {percentage === 100 ? "Completed" : "Progress"}
                  </span>
                  <span className="text-[12px] font-bold" style={{ color: color.icon }}>
                    {percentage}%
                  </span>
                </div>
                <div className="h-2 w-full bg-[#F0F2FB] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${percentage}%`,
                      background: `linear-gradient(90deg, ${color.icon} 0%, ${color.accent === "#E8D5FF" ? "#9B8BC8" : color.accent} 100%)`,
                    }}
                  />
                </div>
              </div>
              {progress?.lesson_title && (
                <p className="text-[12px] text-[#8B8DAE] mb-4 line-clamp-1">
                  <span className="font-bold text-[#1A1C5C]">Next:</span> {progress.lesson_title}
                </p>
              )}
            </>
          ) : (
            <p className="text-[13px] text-[#8B8DAE] mb-4 line-clamp-2">{course.description}</p>
          )}

          {/* Button */}
          <button
            style={{ backgroundColor: color.icon }}
            className="w-full flex items-center justify-between rounded-lg px-4 py-2.5 text-white font-bold uppercase text-[11px] tracking-wider transition-all hover:shadow-lg active:scale-95"
          >
            {enrolled ? (
              <>
                <span className="flex items-center gap-1.5">
                  <Play className="h-3.5 w-3.5 fill-current" />
                  Continue
                </span>
                <ArrowRight className="h-3.5 w-3.5" />
              </>
            ) : (
              <>
                <span className="flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5" />
                  Enroll
                </span>
                <ArrowRight className="h-3.5 w-3.5" />
              </>
            )}
          </button>
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

  const [profile, setProfile] = useState<UserProfile>(() => {
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

        const enrolledIds = new Set(
          Array.isArray(myCoursesData.courses) ? myCoursesData.courses.map((e: any) => e.course) : []
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
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate({ to: "/login" });
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

        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex w-[220px] min-w-[220px] flex-col border-r border-[#DDDDF0]">
          <SidebarContent displayName={displayName} initials={initials} email={profile?.email || ""} onLogout={handleLogout} />
        </aside>

        {/* Mobile Sidebar */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
            <div className="absolute left-0 top-0 h-full w-[260px] shadow-2xl">
              <SidebarContent displayName={displayName} initials={initials} email={profile?.email || ""} onLogout={handleLogout} onClose={() => setSidebarOpen(false)} />
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

            {/* Welcome Banner */}
            <div className="relative mb-6 overflow-hidden rounded-xl p-5 lg:p-6" style={{ background: "linear-gradient(135deg, #2B2D8A 0%, #3B3DA6 60%, #4E50C4 100%)" }}>
              <div className="pointer-events-none absolute -right-4 -top-4 h-32 w-32 rounded-full bg-white/5" />
              <div className="relative">
                <h1 className="text-2xl font-bold text-white mb-1">
                  Explore & Learn
                </h1>
                <p className="text-white/70 text-sm">Continue your learning journey with our world-class courses</p>
              </div>
            </div>

            {/* Search & Stats */}
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

            {/* My Courses */}
            {enrolledCourses.length > 0 && (
              <div className="mb-10">
                <div className="mb-4">
                  <h2 className="text-[18px] font-bold text-[#1A1C5C]">My Courses</h2>
                  <p className="text-[12px] text-[#8B8DAE]">Continue where you left off</p>
                </div>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {enrolledCourses.map((course, idx) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      progress={progressMap.get(course.id) || null}
                      enrolled={true}
                      colorIndex={idx}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Available Courses */}
            {availableCourses.length > 0 && (
              <div>
                <div className="mb-4">
                  <h2 className="text-[18px] font-bold text-[#1A1C5C]">Available Courses</h2>
                  <p className="text-[12px] text-[#8B8DAE]">Start a new learning journey</p>
                </div>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {availableCourses.map((course, idx) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      progress={null}
                      enrolled={false}
                      colorIndex={idx + enrolledCourses.length}
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
    </>
  );
}

export default CoursesPage;
