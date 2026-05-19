import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, Award, CheckCircle2, Clock, Play } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <div className="min-h-screen bg-brand-dark text-white p-8 pt-28">
      <div className="mx-auto max-w-7xl">
        {/* Welcome Banner */}
        <div className="rounded-2xl bg-gradient-to-r border border-white/10 bg-white/5 p-8 mb-8">
          <h1 className="text-3xl font-display font-semibold">Welcome Back, Trainee!</h1>
          <p className="text-white/70 mt-2">Cohort 2026 · Department of Distribution Operations</p>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-10">
          <div className="rounded-xl border border-white/10 bg-brand-deep p-6 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-yellow/10 text-yellow"><BookOpen /></div>
            <div>
              <div className="text-2xl font-bold">1 / 6</div>
              <div className="text-xs text-white/60 uppercase tracking-wider">Modules Started</div>
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-brand-deep p-6 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-green-500/10 text-green-400"><CheckCircle2 /></div>
            <div>
              <div className="text-2xl font-bold">4 / 24</div>
              <div className="text-xs text-white/60 uppercase tracking-wider">Quizzes Passed</div>
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-brand-deep p-6 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-blue-500/10 text-blue-400"><Award /></div>
            <div>
              <div className="text-2xl font-bold">0</div>
              <div className="text-xs text-white/60 uppercase tracking-wider">Certificates Earned</div>
            </div>
          </div>
        </div>

        {/* Current Training Matrix */}
        <div className="rounded-xl border border-white/10 bg-brand-deep p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold uppercase tracking-wide text-yellow">Active Module</h2>
            <span className="text-xs bg-yellow/20 text-yellow px-2.5 py-1 rounded-full font-medium">In Progress</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-medium">Workplace Safety & Compliance</h3>
              <p className="text-sm text-white/70 mt-1">Current Lesson: Section 2.4 - High Voltage Substation Isolation Protocols</p>
            </div>
            <Link to="/courses" className="inline-flex items-center gap-2 rounded-sm bg-red-cta px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-red-cta-deep">
              Resume Lesson <Play className="h-3 w-3 fill-white" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}