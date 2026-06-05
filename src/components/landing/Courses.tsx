import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  Search,
  Clock,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { TopBar } from "@/components/landing/TopBar";
import { Nav } from "@/components/landing/Nav";

export const Route = createFileRoute("/courses")({
  component: CoursesCatalogPage,
});

const MOCK_COURSES = [
  {
    id: "course-1",
    title: "High Voltage Power Systems Engineering",
    category: "Power Systems",
    level: "Advanced",
    duration: "6 Weeks",
    fee: 1200,
    description:
      "Comprehensive training on sub-station management, network safety protection grids, and high voltage feeder operations.",
  },
  {
    id: "course-2",
    title: "Solar PV Design and Grid Integration",
    category: "Renewable Energy",
    level: "Intermediate",
    duration: "4 Weeks",
    fee: 850,
    description:
      "Technician framework on standard commercial solar installation systems and synchronizing clean grids to main feeds.",
  },
  {
    id: "course-3",
    title: "LMS and Substation Database Administration",
    category: "IT",
    level: "Beginner",
    duration: "3 Weeks",
    fee: 500,
    description:
      "Introduction to digital infrastructure, internal system networking tools, and network diagnostics data setups.",
  },
  {
    id: "course-4",
    title: "Safety Compliance Standards for Independent Contractors",
    category: "Contractors",
    level: "Beginner",
    duration: "2 Weeks",
    fee: 350,
    description:
      "Mandatory personal protective protocols, fall risk controls, and electrical hazard audits required for ECG contract approval.",
  },
  {
    id: "course-5",
    title: "Substation Transformer Diagnostics & Repair",
    category: "Power Systems",
    level: "Advanced",
    duration: "8 Weeks",
    fee: 1500,
    description:
      "Advanced maintenance blueprints covering cooling systems, core winding repairs, and automatic emergency trip configurations.",
  },
];

const CATEGORIES = [
  "All Categories",
  "Power Systems",
  "Renewable Energy",
  "IT",
  "Contractors",
];

const LEVELS = ["All Levels", "Beginner", "Intermediate", "Advanced"];

const LEVEL_COLORS: Record<string, string> = {
  Beginner: "bg-[#2E9E6B]/10 text-[#2E9E6B]",
  Intermediate: "bg-[#3B3DA6]/10 text-[#3B3DA6]",
  Advanced: "bg-[#E8534A]/10 text-[#E8534A]",
};

function CoursesCatalogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedLevel, setSelectedLevel] = useState("All Levels");
  const [enrolledCourseId, setEnrolledCourseId] = useState<string | null>(null);
  const [unenrolledCourseId, setUnenrolledCourseId] = useState<string | null>(null);

  // Load enrolled courses from localStorage
  const [enrolledIds, setEnrolledIds] = useState<string[]>(() => {
    const saved = localStorage.getItem("enrolled_courses");
    return saved ? JSON.parse(saved) : [];
  });

  const filteredCourses = useMemo(
    () =>
      MOCK_COURSES.filter((c) => {
        const matchSearch =
          c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.description.toLowerCase().includes(searchQuery.toLowerCase());

        const matchCategory =
          selectedCategory === "All Categories" ||
          c.category === selectedCategory;

        const matchLevel =
          selectedLevel === "All Levels" || c.level === selectedLevel;

        return matchSearch && matchCategory && matchLevel;
      }),
    [searchQuery, selectedCategory, selectedLevel]
  );

  const handleEnroll = (courseId: string) => {
    if (enrolledIds.includes(courseId)) return;

    const newEnrolled = [...enrolledIds, courseId];
    setEnrolledIds(newEnrolled);
    localStorage.setItem("enrolled_courses", JSON.stringify(newEnrolled));

    setEnrolledCourseId(courseId);
    setTimeout(() => setEnrolledCourseId(null), 2500);
  };

  const handleUnenroll = (courseId: string) => {
    const newEnrolled = enrolledIds.filter((id) => id !== courseId);
    setEnrolledIds(newEnrolled);
    localStorage.setItem("enrolled_courses", JSON.stringify(newEnrolled));

    setUnenrolledCourseId(courseId);
    setTimeout(() => setUnenrolledCourseId(null), 2500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F5FB]">
      <TopBar />
      <Nav />

      <main className="flex-1 mx-auto w-full max-w-7xl px-6 pt-36 pb-20">

        {/* Heading */}
        <div className="mb-10 text-center">
          <h1 className="text-5xl font-bold text-[#1A1C5C]">
            Available Programmes
          </h1>
          <p className="mt-3 text-sm text-[#8B8DAE]">
            Explore certified ECG training courses.
          </p>
        </div>

        {/* Filters (bigger, cleaner, no harsh border) */}
        <div className="mb-10 rounded-3xl bg-white p-6 shadow-lg">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-12">

            <div className="relative md:col-span-5">
              <Search className="absolute left-4 top-4 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl bg-[#F4F5FB] py-3 pl-11 text-sm outline-none"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="md:col-span-4 rounded-2xl bg-[#F4F5FB] px-4 py-3 outline-none"
            >
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>

            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="md:col-span-3 rounded-2xl bg-[#F4F5FB] px-4 py-3 outline-none"
            >
              {LEVELS.map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>

          </div>
        </div>

        {/* Courses GRID (BIG CARDS, NO OUTLINES) */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">

          {filteredCourses.map((course) => (
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

              <p className="mt-3 text-sm text-gray-500 leading-relaxed">
                {course.description}
              </p>

              {enrolledCourseId === course.id && (
                <div className="mt-4 flex items-center gap-2 text-green-600 text-xs font-bold">
                  <CheckCircle2 size={14} />
                  Enrolled successfully!
                </div>
              )}

              {unenrolledCourseId === course.id && (
                <div className="mt-4 flex items-center gap-2 text-amber-600 text-xs font-bold">
                  <CheckCircle2 size={14} />
                  Unenrolled successfully.
                </div>
              )}

              {enrolledIds.includes(course.id) ? (
                <button
                  onClick={() => handleUnenroll(course.id)}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 py-3 text-xs font-bold text-red-600 hover:bg-red-100 transition"
                >
                  Unenroll from Programme
                </button>
              ) : (
                <button
                  onClick={() => handleEnroll(course.id)}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#3B3DA6] py-3 text-xs font-bold text-white hover:bg-[#2B2D8A] transition"
                >
                  Enroll <ArrowRight size={14} />
                </button>
              )}

            </div>
          ))}

        </div>
      </main>
    </div>
  );
}
