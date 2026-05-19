import { createFileRoute } from "@tanstack/react-router";
import { HelpCircle, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/quizzes")({
  component: QuizzesPage,
});

function QuizzesPage() {
  const quizzes = [
    { title: "Safety & Compliance Assessment", questions: 20, status: "Passed", score: "90%" },
    { title: "Distribution Network Fundamentals", questions: 15, status: "Available", score: null },
    { title: "Customer Service Code Quiz", questions: 10, status: "Locked", score: null },
  ];

  return (
    <div className="min-h-screen bg-brand-dark text-white p-8 pt-28">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-display font-light uppercase text-white mb-2">Assessments</h1>
        <p className="text-white/70 mb-8">Complete the mandatory evaluation after finishing each core track module.</p>

        <div className="space-y-4">
          {quizzes.map((quiz) => (
            <div key={quiz.title} className="flex flex-col sm:flex-row sm:items-center justify-between border border-white/10 bg-brand-deep p-6 rounded-xl gap-4">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-yellow/10 text-yellow mt-0.5"><HelpCircle className="h-5 w-5" /></div>
                <div>
                  <h3 className="text-lg font-semibold">{quiz.title}</h3>
                  <p className="text-sm text-white/60">{quiz.questions} Multiple Choice Questions</p>
                </div>
              </div>
              <div className="flex items-center gap-4 justify-between sm:justify-end">
                {quiz.score && <span className="text-sm font-semibold text-green-400 bg-green-500/10 px-3 py-1 rounded-md">Score: {quiz.score}</span>}
                {quiz.status === "Available" && (
                  <button className="inline-flex items-center gap-2 rounded-sm bg-yellow px-4 py-2 text-xs font-bold uppercase tracking-wider text-brand-dark transition hover:brightness-110">
                    Start Test <ArrowRight className="h-3 w-3" />
                  </button>
                )}
                {quiz.status === "Locked" && <span className="text-xs text-white/40 border border-white/10 px-3 py-1 rounded-md uppercase">Locked</span>}
                {quiz.status === "Passed" && <span className="text-xs text-green-400 border border-green-500/20 px-3 py-1 rounded-md uppercase font-semibold">Passed</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}