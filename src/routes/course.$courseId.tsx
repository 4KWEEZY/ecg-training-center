import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { requireAuth } from "../lib/auth";
import { withAuth } from "../components/ProtectedPage";
import { logout } from "../lib/logout";
import React, { useEffect, useState } from "react";
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
  ChevronRight,
  Play,
  CheckCircle2,
  Clock,
  Loader,
  Mail,
  Phone,
  ArrowLeft,
  BookMarked,
  FileText,
  Video,
  Link2,
  File,
  ExternalLink,
} from "lucide-react";

export const Route = createFileRoute("/course/$courseId")({
  beforeLoad: requireAuth,
  component: withAuth(CourseDetailPage),
});

type UserProfile = {
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

type Lesson = {
  id: number;
  title: string;
  description: string | null;
  order: number;
  duration_minutes: number;
  is_preview: boolean;
  is_published: boolean;
};

type Module = {
  id: number;
  title: string;
  description: string | null;
  order: number;
  is_published: boolean;
};

type Progress = {
  course: number;
  course_title: string;
  current_module: number | null;
  module_title: string | null;
  current_lesson: number | null;
  lesson_title: string | null;
  percentage: number;
};

type Resource = {
  id: number;
  title: string;
  resource_type: string;
  file: string | null;
  video_url: string | null;
  order: number;
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
        <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-widest text-white/30">Main</p>
        {navItems.slice(0, 4).map(({ icon: Icon, label, to }) => (
          <Link key={to} to={to} onClick={onClose}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium text-white/55 transition-all hover:bg-white/7 hover:text-white/85">
            <Icon className="h-4 w-4 shrink-0" />{label}
          </Link>
        ))}
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
          <button onClick={onLogout} className="shrink-0 rounded p-1 text-white/35 transition hover:text-[#E8534A]">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function resourceIcon(type: string) {
  switch (type.toLowerCase()) {
    case "video": return <Video className="h-3.5 w-3.5" />;
    case "pdf": return <FileText className="h-3.5 w-3.5" />;
    case "link": return <Link2 className="h-3.5 w-3.5" />;
    default: return <File className="h-3.5 w-3.5" />;
  }
}

function resourceColors(type: string): { bg: string; text: string } {
  switch (type.toLowerCase()) {
    case "video": return { bg: "bg-[#FEF3C7]", text: "text-[#D97706]" };
    case "pdf":   return { bg: "bg-[#FEE2E2]", text: "text-[#DC2626]" };
    case "link":  return { bg: "bg-[#E0F2FE]", text: "text-[#0284C7]" };
    default:      return { bg: "bg-[#F0F2FB]", text: "text-[#3B3DA6]" };
  }
}

function LessonRow({ lesson, courseId, moduleId, isCurrent, isCompleted: initialCompleted, token, onComplete }: {
  lesson: Lesson;
  courseId: string;
  moduleId: number;
  isCurrent: boolean;
  isCompleted: boolean;
  token: string | null;
  onComplete: (progress: Progress, lessonId: number) => void;
}) {
  const [open, setOpen] = useState(isCurrent);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [completed, setCompleted] = useState(initialCompleted);

  // Sync if parent fetches DB state after mount
  useEffect(() => { setCompleted(initialCompleted); }, [initialCompleted]);

  useEffect(() => {
    if (isCurrent) fetchResources();
  }, []);

  const fetchResources = async () => {
    if (fetched) return;
    setLoading(true);
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/courses/${courseId}/modules/${moduleId}/lessons/${lesson.id}/resources/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      setResources(Array.isArray(data) ? data.sort((a: Resource, b: Resource) => a.order - b.order) : []);
      setFetched(true);
    } catch {
      // keep empty
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = () => {
    if (!open && !fetched) fetchResources();
    setOpen((p) => !p);
  };

  const handleMarkComplete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (completing || completed) return;
    setCompleting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/lesson-completion/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ lesson: lesson.id, completed: true }),
      });
      if (res.ok) {
        const data = await res.json();
        setCompleted(true);
        onComplete(data.progress, lesson.id);
      }
    } catch {
      // silent
    } finally {
      setCompleting(false);
    }
  };

  return (
    <li className={`border-b border-[#F4F5FB] last:border-0 ${isCurrent ? "bg-[#F0F2FB]" : ""}`}>
      {/* Lesson row */}
      <button
        onClick={handleToggle}
        className={`flex w-full items-center gap-3 px-5 py-3.5 text-left transition hover:bg-[#F4F5FB] ${isCurrent ? "bg-[#F0F2FB] hover:bg-[#EAEBF9]" : ""}`}
      >
        <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${isCurrent ? "bg-[#3B3DA6]" : completed ? "bg-emerald-100" : "bg-[#F0F2FB]"}`}>
          {isCurrent
            ? <Play className="h-3 w-3 fill-white text-white" />
            : completed
              ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              : <BookOpen className="h-3 w-3 text-[#AAAAC8]" />}
        </div>

        <div className="min-w-0 flex-1">
          <p className={`truncate text-[13px] ${isCurrent ? "font-semibold text-[#3B3DA6]" : "font-medium text-[#1A1C5C]"}`}>
            {lesson.title}
          </p>
          {lesson.duration_minutes > 0 && (
            <p className="flex items-center gap-1 text-[10px] text-[#AAAAC8]">
              <Clock className="h-3 w-3" />{lesson.duration_minutes} min
            </p>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          {lesson.is_preview && (
            <span className="rounded-full bg-[#E6F1FB] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#185FA5]">
              Preview
            </span>
          )}
          {isCurrent && (
            <span className="rounded-full bg-[#3B3DA6] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
              Now
            </span>
          )}
          <ChevronRight className={`h-3.5 w-3.5 text-[#AAAAC8] transition-transform ${open ? "rotate-90" : ""}`} />
        </div>
      </button>

      {/* Resources panel */}
      {open && (
        <div className="border-t border-[#EAEBF6] bg-[#FAFBFD] px-5 py-3">
          {loading ? (
            <div className="flex items-center gap-2 py-1">
              <Loader className="h-3.5 w-3.5 animate-spin text-[#3B3DA6]" />
              <span className="text-[11px] text-[#8B8DAE]">Loading resources…</span>
            </div>
          ) : resources.length > 0 ? (
            <ul className="space-y-2">
              {resources.map((r) => {
                const colors = resourceColors(r.resource_type);
                const href = r.video_url || (r.file ? `${API_BASE_URL}${r.file}` : null);
                return (
                  <li key={r.id}>
                    {href ? (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-2.5 rounded-lg border border-[#EAEBF6] bg-white px-3 py-2.5 transition hover:border-[#3B3DA6]/30 hover:shadow-sm"
                      >
                        <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${colors.bg} ${colors.text}`}>
                          {resourceIcon(r.resource_type)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[12px] font-semibold text-[#1A1C5C]">{r.title}</p>
                          <p className="text-[10px] uppercase tracking-wider text-[#AAAAC8]">{r.resource_type}</p>
                        </div>
                        <ExternalLink className="h-3.5 w-3.5 shrink-0 text-[#AAAAC8] transition group-hover:text-[#3B3DA6]" />
                      </a>
                    ) : (
                      <div className="flex items-center gap-2.5 rounded-lg border border-[#EAEBF6] bg-white px-3 py-2.5">
                        <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${colors.bg} ${colors.text}`}>
                          {resourceIcon(r.resource_type)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[12px] font-semibold text-[#1A1C5C]">{r.title}</p>
                          <p className="text-[10px] uppercase tracking-wider text-[#AAAAC8]">{r.resource_type}</p>
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-[11px] text-[#AAAAC8]">No resources for this lesson.</p>
          )}

          <button
            onClick={handleMarkComplete}
            disabled={completing || completed}
            className={`mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg px-4 py-2.5 text-[12px] font-bold transition disabled:opacity-60 ${completed ? "bg-emerald-50 text-emerald-700 cursor-default" : "bg-[#3B3DA6] text-white hover:bg-[#2D2F9A]"}`}
          >
            {completing ? (
              <><Loader className="h-3.5 w-3.5 animate-spin" /> Marking…</>
            ) : completed ? (
              <><CheckCircle2 className="h-3.5 w-3.5" /> Completed!</>
            ) : (
              <><CheckCircle2 className="h-3.5 w-3.5" /> Mark Complete</>
            )}
          </button>
        </div>
      )}
    </li>
  );
}

function ModuleAccordion({ module, courseId, currentModuleId, currentLessonId, completedLessonIds, token, defaultOpen, onComplete }: {
  module: Module;
  courseId: string;
  currentModuleId: number | null;
  currentLessonId: number | null;
  completedLessonIds: Set<number>;
  token: string | null;
  defaultOpen: boolean;
  onComplete: (progress: Progress, lessonId: number) => void;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loadingLessons, setLoadingLessons] = useState(false);
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    if (defaultOpen) fetchLessons();
  }, []);

  // Auto-open and fetch when this module becomes the current one after a completion
  useEffect(() => {
    if (module.id === currentModuleId) {
      setOpen(true);
      fetchLessons();
    }
  }, [currentModuleId]);

  const fetchLessons = async () => {
    if (fetched) return;
    setLoadingLessons(true);
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/courses/${courseId}/modules/${module.id}/lessons/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      setLessons(Array.isArray(data) ? data.sort((a: Lesson, b: Lesson) => a.order - b.order) : []);
      setFetched(true);
    } catch {
      // keep empty
    } finally {
      setLoadingLessons(false);
    }
  };

  const handleToggle = () => {
    if (!open && !fetched) fetchLessons();
    setOpen((p) => !p);
  };

  const isCurrentModule = module.id === currentModuleId;

  return (
    <div className={`overflow-hidden rounded-xl border bg-white transition-all ${isCurrentModule ? "border-[#3B3DA6]/40 shadow-md" : "border-[#DDDDF0]"}`}>
      <button
        onClick={handleToggle}
        className="flex w-full items-center justify-between px-5 py-4 text-left transition hover:bg-[#F8FAFF]"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold ${isCurrentModule ? "bg-[#3B3DA6] text-white" : "bg-[#F0F2FB] text-[#3B3DA6]"}`}>
            {module.order}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-[14px] font-semibold text-[#1A1C5C] truncate">{module.title}</p>
              {isCurrentModule && (
                <span className="shrink-0 rounded-full bg-[#3B3DA6] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
                  Current
                </span>
              )}
            </div>
            {module.description && (
              <p className="text-[11px] text-[#8B8DAE] truncate">{module.description}</p>
            )}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2 pl-3">
          {fetched && <span className="text-[11px] text-[#AAAAC8]">{lessons.length} lessons</span>}
          <ChevronRight className={`h-4 w-4 text-[#8B8DAE] transition-transform ${open ? "rotate-90" : ""}`} />
        </div>
      </button>

      {open && (
        <div className="border-t border-[#EAEBF6]">
          {loadingLessons ? (
            <div className="flex items-center justify-center py-6">
              <Loader className="h-5 w-5 animate-spin text-[#3B3DA6]" />
            </div>
          ) : lessons.length > 0 ? (
            <ul>
              {lessons.map((lesson) => (
                <LessonRow
                  key={lesson.id}
                  lesson={lesson}
                  courseId={courseId}
                  moduleId={module.id}
                  isCurrent={lesson.id === currentLessonId}
                  isCompleted={completedLessonIds.has(lesson.id)}
                  token={token}
                  onComplete={onComplete}
                />
              ))}
            </ul>
          ) : (
            <p className="px-5 py-4 text-[13px] text-[#8B8DAE]">No lessons published yet.</p>
          )}
        </div>
      )}
    </div>
  );
}

function CourseDetailPage() {
  const { courseId } = Route.useParams();
  const navigate = useNavigate();

  const [profile] = useState<UserProfile>(() => {
    try {
      const u = localStorage.getItem("user");
      return u ? JSON.parse(u) : {};
    } catch { return {}; }
  });

  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [completedLessonIds, setCompletedLessonIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const token = localStorage.getItem("access_token");
  const displayName = profile?.name || profile?.username || "Trainee";
  const initials = displayName.slice(0, 2).toUpperCase();

  useEffect(() => {
    const fetchData = async () => {
      if (!token) { setLoading(false); return; }
      try {
        const [courseRes, modulesRes, progressRes, completionsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/courses/${courseId}/`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_BASE_URL}/api/courses/${courseId}/modules/`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_BASE_URL}/api/progress/`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_BASE_URL}/api/lesson-completion/?course=${courseId}`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        const courseData = await courseRes.json();
        const modulesData = await modulesRes.json();
        const progressData = await progressRes.json();
        const completionsData = await completionsRes.json();

        setCourse(courseData);
        setModules(Array.isArray(modulesData) ? modulesData.sort((a: Module, b: Module) => a.order - b.order) : []);
        setCompletedLessonIds(new Set<number>(Array.isArray(completionsData) ? completionsData : []));

        if (Array.isArray(progressData)) {
          const match = progressData.find((p: Progress) => p.course === Number(courseId));
          setProgress(match ?? null);
        }
      } catch (err) {
        console.error("Failed to fetch course detail", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [courseId, token]);

  const handleLogout = () => logout(navigate);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: "#f0f2fb" }}>
        <Loader className="h-8 w-8 animate-spin text-[#3B3DA6]" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: "#f0f2fb" }}>
        <div className="text-center">
          <p className="text-[16px] font-semibold text-[#1A1C5C]">Course not found.</p>
          <Link to="/courses" className="mt-3 inline-block text-[13px] text-[#3B3DA6] hover:underline">Back to Courses</Link>
        </div>
      </div>
    );
  }

  const percentage = progress?.percentage ?? 0;

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <div className="flex min-h-screen" style={{ background: "#f0f2fb", fontFamily: "'Inter', sans-serif" }}>

        {/* Desktop sidebar */}
        <aside className="hidden lg:flex w-[220px] min-w-[220px] flex-col border-r border-[#DDDDF0]">
          <SidebarContent displayName={displayName} initials={initials} email={profile?.email || ""} onLogout={handleLogout} />
        </aside>

        {/* Mobile drawer */}
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
                <div className="text-[15px] font-semibold text-[#1A1C5C]">{course.title}</div>
                <div className="text-[11px] text-[#AAAAC8]">{course.code}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#DDDDF0] bg-[#F4F5FB] text-[#8B8DAE]">
                <Bell className="h-4 w-4" />
              </button>
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 rounded-lg border border-[#DDDDF0] bg-[#F4F5FB] px-2 py-1.5 lg:px-3"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded bg-[#3B3DA6] text-[10px] font-bold text-white">{initials}</div>
                  <span className="hidden max-w-[160px] truncate text-[13px] font-medium text-[#1A1C5C] sm:block">{displayName}</span>
                  <ChevronDown className="h-3.5 w-3.5 text-[#8B8DAE]" />
                </button>
                {profileOpen && (
                  <div className="absolute right-0 top-11 z-50 w-[280px] rounded-xl border border-[#DDDDF0] bg-white p-4 shadow-xl">
                    <div className="mb-3 flex items-start gap-3 border-b border-[#EAEBF6] pb-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#3B3DA6] text-[12px] font-bold text-white">{initials}</div>
                      <div>
                        <p className="text-[13px] font-bold text-[#1A1C5C]">{displayName}</p>
                        <p className="text-[11px] text-[#8B8DAE]">@{profile.username || "trainee"}</p>
                      </div>
                    </div>
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center gap-2 text-[12px] text-[#1A1C5C]">
                        <Mail className="h-3.5 w-3.5 text-[#8B8DAE]" /><span className="truncate">{profile.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[12px] text-[#1A1C5C]">
                        <Phone className="h-3.5 w-3.5 text-[#8B8DAE]" /><span>{profile.phone_number || "—"}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 border-t border-[#EAEBF6] pt-3">
                      <Link to="/profile" className="flex-1 rounded-lg bg-[#3B3DA6] px-3 py-2 text-center text-[11px] font-bold text-white">Profile</Link>
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

            {/* Breadcrumb */}
            <div className="mb-5 flex items-center gap-2 text-[12px] text-[#8B8DAE]">
              <Link to="/courses" className="flex items-center gap-1 hover:text-[#3B3DA6] transition">
                <ArrowLeft className="h-3.5 w-3.5" /> Courses
              </Link>
              <span>/</span>
              <span className="font-semibold text-[#1A1C5C]">{course.title}</span>
            </div>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">

              {/* Left: modules accordion */}
              <div className="space-y-3 lg:col-span-2">
                <div className="mb-2 flex items-center gap-2">
                  <BookMarked className="h-4 w-4 text-[#3B3DA6]" />
                  <h2 className="text-[13px] font-bold uppercase tracking-wider text-[#3B3DA6]">Course Modules</h2>
                  <span className="ml-auto text-[11px] text-[#AAAAC8]">{modules.length} modules</span>
                </div>

                {modules.length > 0 ? (
                  modules.map((mod) => (
                    <ModuleAccordion
                      key={mod.id}
                      module={mod}
                      courseId={courseId}
                      currentModuleId={progress?.current_module ?? null}
                      currentLessonId={progress?.current_lesson ?? null}
                      completedLessonIds={completedLessonIds}
                      token={token}
                      defaultOpen={mod.id === progress?.current_module}
                      onComplete={(updatedProgress, lessonId) => {
                        setProgress(updatedProgress);
                        setCompletedLessonIds((prev) => new Set([...prev, lessonId]));
                      }}
                    />
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#DDDDF0] bg-white p-10 text-center">
                    <BookOpen className="mb-3 h-10 w-10 text-[#DDDDF0]" />
                    <p className="text-[13px] font-semibold text-[#8B8DAE]">No modules published yet.</p>
                  </div>
                )}
              </div>

              {/* Right: progress + info */}
              <div className="space-y-4">

                {/* Progress card */}
                <div className="rounded-2xl p-5 text-white" style={{ background: "linear-gradient(145deg, #12153D 0%, #1A1D4E 50%, #1E2258 100%)" }}>
                  <div className="mb-1 flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">Your Progress</span>
                  </div>
                  <p className="mt-3 text-[36px] font-bold leading-none">{percentage}%</p>
                  <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full transition-all" style={{ width: `${percentage}%`, background: "linear-gradient(90deg, #4E50C4 0%, #FFD700 100%)" }} />
                  </div>
                  {progress?.module_title && (
                    <p className="mt-3 text-[11px] text-white/50">
                      Module: <span className="font-semibold text-white/80">{progress.module_title}</span>
                    </p>
                  )}
                  {progress?.lesson_title && (
                    <p className="mt-1 text-[11px] text-white/50">
                      Lesson: <span className="font-semibold text-white/80">{progress.lesson_title}</span>
                    </p>
                  )}
                </div>

                {/* Course info */}
                <div className="rounded-xl border border-[#DDDDF0] bg-white p-4">
                  <span className="inline-block rounded-md bg-[#F0F2FB] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#3B3DA6]">
                    {course.code}
                  </span>
                  <h3 className="mt-2 text-[15px] font-bold text-[#1A1C5C]">{course.title}</h3>
                  <p className="mt-2 text-[12px] leading-relaxed text-[#8B8DAE]">{course.description}</p>
                  <div className="mt-4 space-y-2.5 border-t border-[#EAEBF6] pt-4">
                    <div className="flex items-center justify-between text-[12px]">
                      <span className="text-[#8B8DAE]">Total Modules</span>
                      <span className="font-semibold text-[#1A1C5C]">{course.modules_count}</span>
                    </div>
                    <div className="flex items-center justify-between text-[12px]">
                      <span className="text-[#8B8DAE]">Status</span>
                      <span className={`font-semibold ${course.is_active ? "text-emerald-600" : "text-[#E8534A]"}`}>
                        {course.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-[#DDDDF0] bg-white p-3 text-center">
                    <CheckCircle2 className="mx-auto mb-1 h-5 w-5 text-emerald-500" />
                    <p className="text-[20px] font-bold text-[#1A1C5C]">{percentage === 100 ? modules.length : 0}</p>
                    <p className="text-[10px] font-medium uppercase tracking-wider text-[#AAAAC8]">Done</p>
                  </div>
                  <div className="rounded-xl border border-[#DDDDF0] bg-white p-3 text-center">
                    <BookOpen className="mx-auto mb-1 h-5 w-5 text-[#3B3DA6]" />
                    <p className="text-[20px] font-bold text-[#1A1C5C]">{modules.length}</p>
                    <p className="text-[10px] font-medium uppercase tracking-wider text-[#AAAAC8]">Modules</p>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
