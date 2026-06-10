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

// Custom palette styles to match the Dashboard theme variants
const COURSE_STYLES = [
  { icon: "#3B3DA6", bg: "#F0F2FB", border: "#DDDDF0" },
  { icon: "#185FA5", bg: "#E6F1FB", border: "#B5D4F4" },
  { icon: "#147D64", bg: "#E6F6F0", border: "#A3E0C9" },
];

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

  // Calculate completion stats for the header summary grid
  const completedCoursesCount = progressList.filter((p) => p.percentage === 100).length;
  const averageProgress = progressList.length
    ? Math.round(progressList.reduce((acc, curr) => acc + curr.percentage, 0) / progressList.length)
    : 0;

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <div className="min-h-screen p-4 lg:p-8" style={{ background: "#f0f2fb", fontFamily: "'Inter', sans-serif" }}>
        
        {/* Navigation Breadcrumb back to Dashboard */}
        <div className="mb-5 flex items-center gap-2 text-[12px] font-medium text-[#8B8DAE]">
          <Link to="/dashboard" className="hover:text-[#3B3DA6] hover:underline">Dashboard</Link>
          <span>/</span>
          <span className="text-[#1A1C5C] font-semibold">My Courses</span>
        </div>

        {/* Title Header Section */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#1A1C5C] lg:text-3xl">My Enrolled Courses</h1>
          <p className="mt-1 text-sm text-[#8B8DAE]">
            Manage your ongoing learning, track program blocks, and review course certifications.
          </p>
        </div>

        {/* Analytics Summary Widget Rows */}
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
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#AAAAC8]">Average Speed</p>
              <p className="text-xl font-bold text-[#1A1C5C]">{averageProgress}% Complete</p>
            </div>
          </div>
        </div>

        {/* Courses Matrix Grid */}
        {courses.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course, index) => {
              // Assign a repeating sequential theme palette index
              const style = COURSE_STYLES[index % COURSE_STYLES.length];
              // Match backend code structures by checking corresponding course names
              const progressRecord = progressList.find((p) => p.course_title === course.title);
              const percent = progressRecord ? progressRecord.percentage : 0;

              return (
                <div 
                  key={course.id} 
                  className="flex flex-col justify-between rounded-2xl border bg-white p-5 shadow-sm transition-all hover:shadow-md"
                  style={{ borderColor: style.border }}
                >
                  <div>
                    {/* Top row details */}
                    <div className="mb-4 flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <span className="inline-block rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider" style={{ backgroundColor: style.bg, color: style.icon }}>
                          {course.code}
                        </span>
                        <h3 className="mt-2 text-base font-bold leading-snug text-[#1A1C5C] line-clamp-1">
                          {course.title}
                        </h3>
                      </div>
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: style.bg, color: style.icon }}>
                        <BookOpen className="h-5 w-5" />
                      </div>
                    </div>

                    <p className="text-[12px] leading-relaxed text-[#8B8DAE] line-clamp-2 mb-4">
                      {course.description || "No deep description available for this syllabus module setup block yet."}
                    </p>

                    {/* Progress tracking layout bar */}
                    <div className="mb-5">
                      <div className="mb-1.5 flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-[#6B7090]">
                          {course.modules_count} Syllabus Modules
                        </span>
                        <span className="font-bold text-[#1A1C5C]">{percent}%</span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#FAFBFD]" style={{ border: "1px solid #EAEBF6" }}>
                        <div 
                          className="h-full rounded-full transition-all duration-500" 
                          style={{ width: `${percent}%`, backgroundColor: style.icon }} 
                        />
                      </div>
                    </div>
                  </div>

                  {/* Operational redirection actions */}
                  <div className="mt-2">
                    {percent === 100 ? (
                      <div className="flex items-center justify-center gap-1.5 rounded-lg border border-[#A3E0C9] bg-[#E6F6F0] py-2.5 text-center text-[11px] font-bold uppercase tracking-wider text-[#147D64]">
                        <Award className="h-4 w-4" /> Certification Earned
                      </div>
                    ) : (
                      <Link
                        to="/my-courses" // Links perfectly inside your TanStack workspace context
                        className="group flex w-full items-center justify-between rounded-lg px-4 py-2.5 text-white font-bold uppercase text-[11px] tracking-wider transition-all hover:shadow-md active:scale-95"
                        style={{ backgroundColor: style.icon }}
                      >
                        <span className="flex items-center gap-1.5">
                          <Play className="h-3.5 w-3.5 fill-current" />
                          {percent > 0 ? "Resume Course" : "Start Learning"}
                        </span>
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#DDDDF0] bg-white p-12 text-center shadow-sm">
            <BookOpen className="mb-3 h-10 w-10 text-[#AAAAC8]" />
            <h3 className="text-base font-bold text-[#1A1C5C]">No courses activated</h3>
            <p className="mt-1 text-sm text-[#8B8DAE] max-w-sm">
              Your profile hasn't been mapped to a learning group module block profile yet. Please check in with your systems administrator.
            </p>
          </div>
        )}
      </div>
    </>
  );
}

export default MyCoursesPage;