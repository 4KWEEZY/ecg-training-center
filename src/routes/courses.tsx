import { createFileRoute } from "@tanstack/react-router";
import { PlayCircle, FileText, CheckCircle, Lock } from "lucide-react";

export const Route = createFileRoute("/courses")({
  component: CoursesPage,
});

function CoursesPage() {
  const lessons = [
    { id: 1, title: "Course Introduction & Objectives", duration: "12 mins", done: true },
    { id: 2, title: "Personal Protective Equipment (PPE) Standards", duration: "25 mins", done: true },
    { id: 3, title: "Working at Height & Fall Arrest Systems", duration: "40 mins", done: false },
    { id: 4, title: "Electrical Hazard Identification", duration: "35 mins", done: false },
  ];

  return (
    <div className="min-h-screen bg-brand-dark text-white p-8 pt-28">
      <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Lesson Player Placeholder */}
        <div className="lg:col-span-2 space-y-6">
          <div className="aspect-video w-full rounded-2xl bg-black border border-white/10 flex flex-col items-center justify-center text-center p-6 relative overflow-hidden">
            <PlayCircle className="h-16 w-16 text-yellow opacity-80 mb-4 animate-pulse" />
            <h2 className="text-xl font-medium">Section 2.3: Working at Height & Fall Arrest Systems</h2>
            <p className="text-sm text-white/50 mt-1">Click to stream standard training video</p>
          </div>
          <div>
            <h1 className="text-2xl font-bold">Workplace Safety & Compliance</h1>
            <p className="text-white/75 mt-2">This module outlines critical regulatory safety frames mandatory for field operations across lines, feeder networks, and station zones.</p>
          </div>
        </div>

        {/* Right Column: Curriculum Roadmap List */}
        <div className="rounded-xl border border-white/10 bg-brand-deep p-6 h-fit">
          <h2 className="text-lg font-semibold uppercase tracking-wide text-yellow mb-4">Module Content</h2>
          <div className="space-y-3">
            {lessons.map((lesson) => (
              <div key={lesson.id} className={`flex items-center justify-between p-3 rounded-lg border ${lesson.done ? 'bg-white/5 border-white/10' : 'bg-transparent border-white/5'}`}>
                <div className="flex items-center gap-3">
                  {lesson.done ? <CheckCircle className="h-4 w-4 text-green-400" /> : <PlayCircle className="h-4 w-4 text-white/40" />}
                  <span className={`text-sm ${lesson.done ? 'text-white/90' : 'text-white/60'}`}>{lesson.title}</span>
                </div>
                <span className="text-xs text-white/40">{lesson.duration}</span>
              </div>
            ))}
            <div className="flex items-center justify-between p-3 rounded-lg bg-black/20 border border-dashed border-white/5 opacity-50">
              <div className="flex items-center gap-3"><Lock className="h-4 w-4" /> <span className="text-sm">End of Module Quiz</span></div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}