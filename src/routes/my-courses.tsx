import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  BookOpen,
  Clock,
  ArrowRight,
  ArrowLeft,
  Zap,
} from "lucide-react";
import { TopBar } from "@/components/landing/TopBar";
import { Nav } from "@/components/landing/Nav";

export const Route = createFileRoute("/my-courses")({
  component: MyCoursesPage,
});

const MOCK_COURSES = [
  {
    id: "course-1",
    title: "High Voltage Power Systems Engineering",
    category: "Power Systems",
    level: "Advanced",
    duration: "6 Weeks",
    description:
      "Comprehensive training on sub-station management, network safety protection grids, and high voltage feeder operations.",
  },
  {
    id: "course-2",
    title: "Solar PV Design and Grid Integration",
    category: "Renewable Energy",
    level: "Intermediate",
    duration: "4 Weeks",
    description:
      "Technician framework on standard commercial solar installation systems and synchronizing clean grids to main feeds.",
  },
  {
    id: "course-3",
    title: "LMS and Substation Database Administration",
    category: "IT",
    level: "Beginner",
    duration: "3 Weeks",
    description:
      "Introduction to digital infrastructure, internal system networking tools, and network diagnostics data setups.",
  },
  {
    id: "course-4",
    title: "Safety Compliance Standards for Independent Contractors",
    category: "Contractors",
    level: "Beginner",
    duration: "2 Weeks",
    description:
      "Mandatory personal protective protocols, fall risk controls, and electrical hazard audits required for ECG contract approval.",
  },
  {
    id: "course-5",
    title: "Substation Transformer Diagnostics & Repair",
    category: "Power Systems",
    level: "Advanced",
    duration: "8 Weeks",
    description:
      "Advanced maintenance blueprints covering cooling systems, core winding repairs, and automatic emergency trip configurations.",
  },
];

const LEVEL_COLORS: Record<string, string> = {
  Beginner: "bg-[#2E9E6B]/10 text-[#2E9E6B]",
  Intermediate: "bg-[#3B3DA6]/10 text-[#3B3DA6]",
  Advanced: "bg-[#E8534A]/10 text-[#E8534A]",
};

function MyCoursesPage() {
  const [enrolledIds, setEnrolledIds] = useState<string[]>(() => {
    const saved = localStorage.getItem("enrolled_courses");
    return saved ? JSON.parse(saved) : [];
  });

  const handleUnenroll = (courseId: string) => {
    const newEnrolled = enrolledIds.filter((id) => id !== courseId);
    setEnrolledIds(newEnrolled);
    localStorage.setItem("enrolled_courses", JSON.stringify(newEnrolled));
  };

  const enrolledCourses = useMemo(
    () => MOCK_COURSES.filter((c) => enrolledIds.includes(c.id)),
    [enrolledIds]
  );

  const storedUser = localStorage.getItem("user");
  const isLoggedIn = !!storedUser;

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F5FB]">
      {!isLoggedIn && (
        <>
          <TopBar />
          <Nav />
        </>
      )}

      <main className={`flex-1 mx-auto w-full max-w-7xl px-6 pb-20 ${isLoggedIn ? "pt-12" : "pt-36"}`}>
        
        <div className="mb-8">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-[13px] font-medium text-[#8B8DAE] transition hover:text-[#3B3DA6]"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Link>
        </div>

        {/* Heading */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-[#1A1C5C]">
            My Enrolled Courses
          </h1>
          <p className="mt-2 text-sm text-[#8B8DAE]">
            Continue your learning journey with your active programs.
          </p>
        </div>

        {enrolledCourses.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {enrolledCourses.map((course) => (
              <div
                key={course.id}
                className="rounded-3xl bg-white p-8 shadow-xl transition hover:scale-[1.02]"
              >
                <div className="flex justify-between">
                  <span className="text-xs font-bold text-yellow-600">
                    {course.category}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <Clock size={12} /> {course.duration}
                  </span>
                </div>

                <span
                  className={`mt-3 inline-block rounded-full px-3 py-1 text-xs font-bold ${LEVEL_COLORS[course.level]}`}
                >
                  {course.level}
                </span>

                <h3 className="mt-4 text-xl font-bold text-[#1A1C5C]">
                  {course.title}
                </h3>

                <p className="mt-3 text-sm text-gray-500 leading-relaxed line-clamp-2">
                  {course.description}
                </p>

                <div className="mt-8 flex items-center justify-between border-t border-[#F0F2FB] pt-6">
                   <button
                    onClick={() => handleUnenroll(course.id)}
                    className="text-xs font-bold text-red-500 hover:text-red-700 transition"
                   >
                    Leave Programme
                   </button>
                   <Link
                    to={`/courses`}
                    className="flex items-center gap-2 text-sm font-bold text-[#3B3DA6] hover:underline"
                   >
                    Resume <ArrowRight size={14} />
                   </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-3xl bg-white py-20 shadow-xl border border-dashed border-[#DDDDF0]">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F0F2FB] text-[#3B3DA6] mb-6">
              <Zap size={32} />
            </div>
            <h2 className="text-xl font-bold text-[#1A1C5C]">No enrolled courses yet</h2>
            <p className="mt-2 text-sm text-[#8B8DAE] max-w-sm text-center">
              Explore our wide range of engineering and utility programs to start your journey.
            </p>
            <Link
              to="/courses"
              className="mt-8 rounded-2xl bg-[#3B3DA6] px-8 py-3 text-sm font-bold text-white transition hover:bg-[#2B2D8A]"
            >
              Explore Catalog
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
