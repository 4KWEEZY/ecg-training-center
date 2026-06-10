import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  BookOpen,
  ArrowRight,
  Play,
  Loader,
  Award,
  BookOpenCheck,
  Flame,
  Star,
  Users,
} from "lucide-react";

export const Route = createFileRoute("/my-courses")({
  component: MyCoursesPage,
});

type Course = {
  id: number;
  title: string;
  code: string;
  modules_count: number;
  description?: string;
};

type Progress = {
  id: number;
  course_title: string;
  module_title: string | null;
  lesson_title: string | null;
  percentage: number;
};

type MyCoursesResponse = {
  courses: Course[];
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

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

function CourseCard({ course, progress, themeIndex }: {
  course: Course;
  progress: Progress | null;
  themeIndex: number;
}) {
  const theme = CARD_THEMES[themeIndex % CARD_THEMES.length];
  const percent = progress?.percentage ?? 0;

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

        <h3 className="mb-1 text-[15px] font-bold leading-snug text-[#1A1C5C] line-clamp-2">
          {course.title}
        </h3>

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

        <div className="mb-5">
          <div className="mb-1.5 flex items-center justify-between text-[11px]">
            <span className="font-bold uppercase tracking-wider text-[#AAAAC8]">Progress</span>
            <span className="font-bold text-[#1A1C5C]">{percent}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-[#F0F2FB]">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${percent}%`, backgroundColor: theme.progress }}
            />
          </div>
        </div>

        <div className="mt-auto">
          {percent === 100 ? (
            <div className="flex items-center justify-center gap-1.5 rounded-xl border border-[#A3E0C9] bg-[#E6F6F0] py-2.5 text-[11px] font-bold uppercase tracking-wider text-[#147D64]">
              <Award className="h-4 w-4" /> Certification Earned
            </div>
          ) : (
            <Link
              to="/my-courses"
              className="group flex w-full items-center justify-between rounded-xl px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-white transition-all hover:opacity-90 active:scale-95"
              style={{ backgroundColor: theme.button }}
            >
              <span className="flex items-center gap-1.5">
                <Play className="h-3.5 w-3.5 fill-current" />
                {percent > 0 ? "Continue" : "Start Learning"}
              </span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

function MyCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [progressList, setProgressList] = useState<Progress[]>([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchCoursesData = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const [myCoursesRes, progressRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/my-courses/`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_BASE_URL}/api/progress/`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        const myCoursesData: MyCoursesResponse = await myCoursesRes.json();
        const progressData: Progress[] = await progressRes.json();

        setCourses(Array.isArray(myCoursesData.courses) ? myCoursesData.courses : []);
        setProgressList(Array.isArray(progressData) ? progressData : []);
      } catch (err) {
        console.error("Failed to fetch courses page data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCoursesData();
  }, [token]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: "#f0f2fb" }}>
        <Loader className="h-8 w-8 animate-spin text-[#3B3DA6]" />
      </div>
    );
  }

  const completedCoursesCount = progressList.filter((p) => p.percentage === 100).length;
  const averageProgress = progressList.length
    ? Math.round(progressList.reduce((acc, curr) => acc + curr.percentage, 0) / progressList.length)
    : 0;

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <div className="min-h-screen p-4 lg:p-8" style={{ background: "#f0f2fb", fontFamily: "'Inter', sans-serif" }}>

        <div className="mb-5 flex items-center gap-2 text-[12px] font-medium text-[#8B8DAE]">
          <Link to="/dashboard" className="hover:text-[#3B3DA6] hover:underline">Dashboard</Link>
          <span>/</span>
          <span className="font-semibold text-[#1A1C5C]">My Courses</span>
        </div>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#1A1C5C] lg:text-3xl">My Enrolled Courses</h1>
          <p className="mt-1 text-sm text-[#8B8DAE]">
            Manage your ongoing learning, track program blocks, and review course certifications.
          </p>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex items-center gap-4 rounded-xl border border-[#DDDDF0] bg-white p-4 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F0F2FB] text-[#3B3DA6]">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#AAAAC8]">Enrolled</p>
              <p className="text-xl font-bold text-[#1A1C5C]">{courses.length} Courses</p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-xl border border-[#DDDDF0] bg-white p-4 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#E6F6F0] text-[#147D64]">
              <BookOpenCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#AAAAC8]">Completed</p>
              <p className="text-xl font-bold text-[#1A1C5C]">{completedCoursesCount} Programs</p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-xl border border-[#DDDDF0] bg-white p-4 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FFF3E0] text-[#E65100]">
              <Flame className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#AAAAC8]">Avg Progress</p>
              <p className="text-xl font-bold text-[#1A1C5C]">{averageProgress}%</p>
            </div>
          </div>
        </div>

        {courses.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course, index) => {
              const progressRecord = progressList.find((p) => p.course_title === course.title);
              return (
                <CourseCard
                  key={course.id}
                  course={course}
                  progress={progressRecord ?? null}
                  themeIndex={index}
                />
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#DDDDF0] bg-white p-12 text-center shadow-sm">
            <BookOpen className="mb-3 h-10 w-10 text-[#AAAAC8]" />
            <h3 className="text-base font-bold text-[#1A1C5C]">No courses enrolled yet</h3>
            <p className="mt-1 max-w-sm text-sm text-[#8B8DAE]">
              Head to the Courses page to browse and enroll in available programs.
            </p>
            <Link
              to="/courses"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#3B3DA6] px-4 py-2 text-[12px] font-bold uppercase tracking-wider text-white hover:bg-[#2B2D8A]"
            >
              Browse Courses <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        )}
      </div>
    </>
  );
}

export default MyCoursesPage;
