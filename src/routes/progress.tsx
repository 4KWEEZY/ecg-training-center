import { createFileRoute } from "@tanstack/react-router";
import {
  CheckCircle2,
  Clock,
  BarChart3,
  Zap,
  Award,
} from "lucide-react";
import { TopBar } from "@/components/landing/TopBar";
import { Nav } from "@/components/landing/Nav";
import { Footer } from "@/components/landing/Footer";

export const Route = createFileRoute("/progress")({
  component: Progress,
});

function Progress() {
  const stored = localStorage.getItem("user_courses");

  const courses = stored ? JSON.parse(stored) : [];

  const completed = courses.filter(
    (c: any) => c.status === "Completed"
  );

  const inProgress = courses.filter(
    (c: any) => c.status !== "Completed"
  );

  const total = courses.length;

  const overallPercent = total
    ? Math.round((completed.length / total) * 100)
    : 0;

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F5FB]">
      <TopBar />
      <Nav />

      <main className="flex-1 mx-auto w-full max-w-6xl px-6 pt-36 pb-20">

        {/* HEADER */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-[#1A1C5C]">
            Learning Progress Dashboard
          </h1>
          <p className="text-sm text-[#8B8DAE] mt-2">
            Track your course completion, performance, and milestones
          </p>
        </div>

        {/* MAIN OVERVIEW CARD */}
        <div className="bg-[#3B3DA6] text-white rounded-3xl p-10 shadow-xl mb-10">
          <div className="flex justify-between items-center">

            <div>
              <p className="text-xs uppercase text-white/60">
                Overall Completion
              </p>
              <h2 className="text-5xl font-bold mt-2">
                {overallPercent}%
              </h2>
              <p className="text-sm text-white/60 mt-1">
                {completed.length} completed · {inProgress.length} active
              </p>
            </div>

            <div className="w-28 h-28 relative">
              <svg className="w-28 h-28 -rotate-90">
                <circle
                  cx="56"
                  cy="56"
                  r="50"
                  stroke="rgba(255,255,255,0.15)"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="56"
                  cy="56"
                  r="50"
                  stroke="#FFD700"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray="314"
                  strokeDashoffset={
                    314 - (314 * overallPercent) / 100
                  }
                  strokeLinecap="round"
                />
              </svg>

              <div className="absolute inset-0 flex items-center justify-center font-bold text-yellow-400">
                {overallPercent}%
              </div>
            </div>
          </div>
        </div>

        {/* FEATURE TILES (BIG SQUARE UI) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">

          <div className="bg-white border rounded-2xl p-8 aspect-square flex flex-col justify-between shadow-sm">
            <CheckCircle2 className="text-green-500 w-7 h-7" />
            <div>
              <h3 className="text-4xl font-bold text-[#1A1C5C]">
                {completed.length}
              </h3>
              <p className="text-sm text-gray-500">
                Completed Courses
              </p>
            </div>
            <span className="text-xs text-green-600 font-bold">
              Certified Progress
            </span>
          </div>

          <div className="bg-white border rounded-2xl p-8 aspect-square flex flex-col justify-between shadow-sm">
            <Clock className="text-blue-500 w-7 h-7" />
            <div>
              <h3 className="text-4xl font-bold text-[#1A1C5C]">
                {inProgress.length}
              </h3>
              <p className="text-sm text-gray-500">
                Active Courses
              </p>
            </div>
            <span className="text-xs text-blue-600 font-bold">
              In Progress
            </span>
          </div>

          <div className="bg-white border rounded-2xl p-8 aspect-square flex flex-col justify-between shadow-sm">
            <BarChart3 className="text-purple-500 w-7 h-7" />
            <div>
              <h3 className="text-4xl font-bold text-[#1A1C5C]">
                {overallPercent}%
              </h3>
              <p className="text-sm text-gray-500">
                Performance Score
              </p>
            </div>
            <span className="text-xs text-purple-600 font-bold">
              Academic Standing
            </span>
          </div>

        </div>

        {/* IN PROGRESS SECTION */}
        <div className="mb-14">
          <h2 className="text-lg font-bold text-[#1A1C5C] mb-4">
            In Progress Courses
          </h2>

          <div className="space-y-4">
            {inProgress.length === 0 && (
              <p className="text-sm text-gray-400">
                No active courses
              </p>
            )}

            {inProgress.map((course: any, i: number) => (
              <div
                key={i}
                className="bg-white border rounded-xl p-5"
              >
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium">
                    {course.name}
                  </span>
                  <span className="text-blue-600">
                    {course.progress}%
                  </span>
                </div>

                <div className="h-2 bg-gray-100 rounded-full">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{
                      width: `${course.progress}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* COMPLETED SECTION (ISOLATED DOWNWARD) */}
        <div className="mt-16">
          <div className="flex items-center gap-2 mb-5">
            <Award className="text-green-600" />
            <h2 className="text-lg font-bold text-[#1A1C5C]">
              Completed Courses
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {completed.length === 0 && (
              <p className="text-sm text-gray-400">
                No completed courses yet
              </p>
            )}

            {completed.map((course: any, i: number) => (
              <div
                key={i}
                className="bg-green-50 border border-green-200 rounded-xl p-5 flex justify-between items-center"
              >
                <div>
                  <p className="font-medium text-[#1A1C5C]">
                    {course.name}
                  </p>
                  <p className="text-xs text-green-600">
                    Completed
                  </p>
                </div>

                <CheckCircle2 className="text-green-600" />
              </div>
            ))}

          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}