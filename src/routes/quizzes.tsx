import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  HelpCircle,
  ArrowRight,
  Lock,
  Award,
  AlertCircle,
  Timer,
  ChevronRight,
  Check,
} from "lucide-react";
import { TopBar } from "@/components/landing/TopBar";
import { Nav } from "@/components/landing/Nav";
import { Footer } from "@/components/landing/Footer";

export const Route = createFileRoute("/quizzes")({
  component: QuizzesPage,
});

const MOCK_QUIZ_QUESTIONS = [
  {
    id: "q1",
    question:
      "Which type of personal protective clothing must be worn when accessing high voltage feeder zones?",
    options: [
      "Standard cotton overalls and steel-toe boots",
      "Arc-rated clothing (NFPA 70E compliant) and dielectric boots",
      "High-visibility polyester vests and rubber gloves",
      "Anti-static lab coats and industrial helmets",
    ],
    correctIdx: 1,
  },
  {
    id: "q2",
    question:
      "What is the standard clearance protocol requirement before conducting line operations on a standard 11kV grid?",
    options: [
      "Verbal team confirmation statement",
      "Immediate visual trip verification check",
      "Formal permit-to-work isolation verification and earthing installation",
      "Standard circuit breaker auto-reclosure configuration",
    ],
    correctIdx: 2,
  },
];

function QuizzesPage() {
  const [quizzes, setQuizzes] = useState([
    {
      id: "q-01",
      title: "Safety & Compliance Assessment",
      questions: 20,
      status: "Passed",
      score: 90,
      duration: "30 mins",
    },
    {
      id: "q-02",
      title: "Distribution Network Fundamentals",
      questions: 15,
      status: "Available",
      score: null,
      duration: "25 mins",
    },
    {
      id: "q-03",
      title: "Customer Service Code Quiz",
      questions: 10,
      status: "Locked",
      score: null,
      duration: "15 mins",
    },
  ]);

  const [activeQuiz, setActiveQuiz] = useState<any | null>(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  const handleStartQuiz = (quiz: any) => {
    setActiveQuiz(quiz);
    setCurrentQuestionIdx(0);
    setSelectedAnswers({});
    setExamSubmitted(false);
  };

  const handleSelectOption = (idx: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [currentQuestionIdx]: idx }));
  };

  const handleSubmit = () => {
    let correct = 0;
    MOCK_QUIZ_QUESTIONS.forEach((q, i) => {
      if (selectedAnswers[i] === q.correctIdx) correct++;
    });
    const score = Math.round((correct / MOCK_QUIZ_QUESTIONS.length) * 100);
    setFinalScore(score);
    setExamSubmitted(true);
    setQuizzes((prev) =>
      prev.map((item) =>
        item.id === activeQuiz.id
          ? { ...item, status: score >= 70 ? "Passed" : "Available", score }
          : item,
      ),
    );
  };

  const handleExit = () => {
    setActiveQuiz(null);
    setExamSubmitted(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F5FB]">
      <TopBar />
      <Nav />

      <main className="flex-1 mx-auto w-full max-w-4xl px-6 pt-36 pb-20">
        {/* ── Active Quiz Workspace ── */}
        {activeQuiz ? (
          <div className="rounded-2xl border border-[#DDDDF0] bg-white p-6 shadow-[0_4px_24px_rgba(59,61,166,0.10)] md:p-8">
            {/* Quiz header */}
            <div className="mb-6 flex items-center justify-between border-b border-[#EAEBF6] pb-4">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-bold uppercase tracking-wider text-[#3B3DA6]">
                  {activeQuiz.title}
                </span>
                <span className="text-[#AAAAC8]">·</span>
                <span className="text-[#8B8DAE]">
                  Question {currentQuestionIdx + 1} of {MOCK_QUIZ_QUESTIONS.length}
                </span>
              </div>
              <button
                onClick={handleExit}
                className="rounded-lg border border-[#DDDDF0] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#8B8DAE] transition hover:border-[#3B3DA6]/30 hover:text-[#3B3DA6]"
              >
                Exit
              </button>
            </div>

            {/* Progress bar */}
            <div className="mb-6 h-1.5 w-full rounded-full bg-[#EAEBF6]">
              <div
                className="h-1.5 rounded-full bg-[#3B3DA6] transition-all duration-300"
                style={{
                  width: `${((currentQuestionIdx + 1) / MOCK_QUIZ_QUESTIONS.length) * 100}%`,
                }}
              />
            </div>

            {!examSubmitted ? (
              <div className="space-y-6">
                <h2 className="text-base font-semibold leading-relaxed text-[#1A1C5C] md:text-lg">
                  {MOCK_QUIZ_QUESTIONS[currentQuestionIdx].question}
                </h2>

                <div className="flex flex-col gap-3">
                  {MOCK_QUIZ_QUESTIONS[currentQuestionIdx].options.map((option, idx) => {
                    const selected = selectedAnswers[currentQuestionIdx] === idx;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectOption(idx)}
                        className={`flex w-full items-center justify-between rounded-xl border p-4 text-left text-sm transition-all ${
                          selected
                            ? "border-[#3B3DA6] bg-[#3B3DA6]/5 text-[#1A1C5C]"
                            : "border-[#DDDDF0] bg-[#F4F5FB] text-[#3D3F6E] hover:border-[#3B3DA6]/30 hover:bg-[#EAEBF6]"
                        }`}
                      >
                        <span>{option}</span>
                        <div
                          className={`ml-4 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${selected ? "border-[#3B3DA6] bg-[#3B3DA6]" : "border-[#AAAAC8]"}`}
                        >
                          {selected && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between border-t border-[#EAEBF6] pt-4">
                  <span className="flex items-center gap-1.5 text-[11px] text-[#AAAAC8]">
                    <Timer className="h-3.5 w-3.5" /> Pass threshold: 70%
                  </span>

                  {currentQuestionIdx < MOCK_QUIZ_QUESTIONS.length - 1 ? (
                    <button
                      disabled={selectedAnswers[currentQuestionIdx] === undefined}
                      onClick={() => setCurrentQuestionIdx((p) => p + 1)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-[#3B3DA6]/20 bg-[#3B3DA6]/5 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#3B3DA6] transition hover:bg-[#3B3DA6]/10 disabled:opacity-30"
                    >
                      Next <ChevronRight className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      disabled={selectedAnswers[currentQuestionIdx] === undefined}
                      onClick={handleSubmit}
                      className="rounded-xl bg-[#3B3DA6] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow transition hover:bg-[#2B2D8A] disabled:opacity-30"
                    >
                      Submit Assessment
                    </button>
                  )}
                </div>
              </div>
            ) : (
              /* Results screen */
              <div className="space-y-5 py-6 text-center">
                <div
                  className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full border ${
                    finalScore >= 70
                      ? "border-[#2E9E6B]/20 bg-[#2E9E6B]/10 text-[#2E9E6B]"
                      : "border-[#E8534A]/20 bg-[#E8534A]/10 text-[#E8534A]"
                  }`}
                >
                  {finalScore >= 70 ? (
                    <Award className="h-8 w-8" />
                  ) : (
                    <AlertCircle className="h-8 w-8" />
                  )}
                </div>

                <div>
                  <h3 className="font-display text-xl font-bold text-[#1A1C5C]">
                    Assessment Complete
                  </h3>
                  <p className="mt-1 text-[10px] uppercase tracking-widest text-[#AAAAC8]">
                    Automated Score Summary
                  </p>
                </div>

                <div className="inline-block rounded-2xl border border-[#DDDDF0] bg-[#F4F5FB] px-12 py-5">
                  <span className="block text-[10px] uppercase tracking-wider text-[#AAAAC8]">
                    Your Score
                  </span>
                  <span
                    className={`font-display text-4xl font-bold ${finalScore >= 70 ? "text-[#2E9E6B]" : "text-[#E8534A]"}`}
                  >
                    {finalScore}%
                  </span>
                </div>

                <p className="mx-auto max-w-md text-sm leading-relaxed text-[#8B8DAE]">
                  {finalScore >= 70
                    ? "Congratulations! You have met the performance threshold and unlocked the corresponding credential badge."
                    : "Your score is below the required benchmark. Review your course materials and try again."}
                </p>

                <button
                  onClick={handleExit}
                  className="rounded-xl border border-[#DDDDF0] bg-white px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-[#3B3DA6] shadow-sm transition hover:bg-[#EAEBF6]"
                >
                  Back to Assessments
                </button>
              </div>
            )}
          </div>
        ) : (
          /* ── Quiz List ── */
          <div className="space-y-6">
            {/* Page heading */}
            <div className="mb-2 text-center">
              <h1 className="font-display text-3xl font-bold uppercase tracking-wide text-[#1A1C5C] sm:text-4xl">
                Assessments &amp; Quizzes
              </h1>
              <p className="mt-2 text-sm text-[#8B8DAE]">
                Complete the mandatory technical evaluation tracks for your modules.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {quizzes.map((quiz) => {
                const locked = quiz.status === "Locked";
                return (
                  <div
                    key={quiz.id}
                    className={`flex flex-col gap-4 rounded-2xl border bg-white p-5 shadow-[0_2px_12px_rgba(59,61,166,0.07)] transition sm:flex-row sm:items-center sm:justify-between ${
                      locked ? "opacity-50" : "hover:shadow-[0_4px_20px_rgba(59,61,166,0.12)]"
                    } border-[#DDDDF0]`}
                  >
                    {/* Left */}
                    <div className="flex items-start gap-4">
                      <div
                        className={`mt-0.5 shrink-0 rounded-xl p-3 ${locked ? "bg-[#F4F5FB] text-[#AAAAC8]" : "bg-[#3B3DA6]/10 text-[#3B3DA6]"}`}
                      >
                        {locked ? <Lock className="h-5 w-5" /> : <HelpCircle className="h-5 w-5" />}
                      </div>
                      <div>
                        <h3
                          className={`text-base font-semibold ${locked ? "text-[#AAAAC8]" : "text-[#1A1C5C]"}`}
                        >
                          {quiz.title}
                        </h3>
                        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[#AAAAC8]">
                          <span>{quiz.questions} questions</span>
                          <span>·</span>
                          <span>{quiz.duration}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right */}
                    <div className="flex items-center gap-3 border-t border-[#EAEBF6] pt-3 sm:border-t-0 sm:pt-0">
                      {quiz.score !== null && (
                        <span
                          className={`rounded-lg px-3 py-1 text-xs font-bold ${
                            quiz.score >= 70
                              ? "bg-[#2E9E6B]/10 text-[#2E9E6B]"
                              : "bg-[#E8534A]/10 text-[#E8534A]"
                          }`}
                        >
                          Score: {quiz.score}%
                        </span>
                      )}

                      {quiz.status === "Available" && (
                        <button
                          onClick={() => handleStartQuiz(quiz)}
                          className="inline-flex items-center gap-2 rounded-xl bg-[#3B3DA6] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow transition hover:bg-[#2B2D8A]"
                        >
                          Start <ArrowRight className="h-3 w-3" />
                        </button>
                      )}

                      {quiz.status === "Locked" && (
                        <span className="rounded-lg border border-[#DDDDF0] bg-[#F4F5FB] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#AAAAC8]">
                          Locked
                        </span>
                      )}

                      {quiz.status === "Passed" && (
                        <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#2E9E6B]/20 bg-[#2E9E6B]/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#2E9E6B]">
                          <Check className="h-3 w-3" strokeWidth={3} /> Passed
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
