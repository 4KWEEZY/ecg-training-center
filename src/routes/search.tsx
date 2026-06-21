import { createFileRoute, Link } from "@tanstack/react-router";
import { requireAuth } from "../lib/auth";
import { withAuth } from "../components/ProtectedPage";
import { useState } from "react";
import { TopBar } from "@/components/landing/TopBar";
import { Nav } from "@/components/landing/Nav";
import { Footer } from "@/components/landing/Footer";
import { Search, BookOpen, HelpCircle, FileText, ClipboardList } from "lucide-react";

export const Route = createFileRoute("/search")({
  beforeLoad: requireAuth,
  component: withAuth(SearchPage),
});

const searchableItems = [
  {
    title: "Workplace Safety & Compliance Module",
    category: "Course materials",
    type: "course",
    path: "/courses",
  },
  {
    title: "Distribution Operations 101 Guide",
    category: "Course materials",
    type: "course",
    path: "/courses",
  },
  {
    title: "High Voltage Substation Isolation Live Stream",
    category: "Live sessions",
    type: "session",
    path: "/library",
  },
  { title: "Safety Assessment Practice Quiz", category: "Quizzes", type: "quiz", path: "/quizzes" },
  {
    title: "Smart Metering Billing Platform Walkthrough",
    category: "Course materials",
    type: "course",
    path: "/courses",
  },
  {
    title: "How to unlock my Training Certificate",
    category: "Certification",
    type: "help",
    path: "/help",
  },
  {
    title: "Troubleshooting HD video streaming issues",
    category: "Help articles",
    type: "help",
    path: "/help",
  },
];

function SearchPage() {
  const [query, setQuery] = useState("");

  const filteredResults = searchableItems.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F5FB]">
      <TopBar />
      <Nav />

      <main className="flex-1 mx-auto w-full max-w-3xl px-6 py-36 sm:px-8">
        {/* Page heading */}
        <div className="mb-8 text-center">
          <h1 className="font-display text-3xl font-bold uppercase tracking-wide text-[#1A1C5C] sm:text-4xl">
            Search the Training Center
          </h1>
          <p className="mt-2 text-sm text-[#8B8DAE]">
            Find courses, resources, and quizzes across the portal.
          </p>
        </div>

        {/* Search card */}
        <div className="rounded-2xl border border-[#DDDDF0] bg-white p-8 shadow-[0_4px_24px_rgba(59,61,166,0.08)]">
          {/* Search input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-[0.15em] text-[#3B3DA6]">
              Search term
            </label>
            <div className="relative mt-3">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#AAAAC8]" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search courses, quizzes, guides (e.g. safety, substation)…"
                className="w-full rounded-xl border border-[#DDDDF0] bg-[#F4F5FB] py-3.5 pl-12 pr-4 text-sm text-[#1A1C5C] outline-none transition placeholder:text-[#AAAAC8] focus:border-[#3B3DA6] focus:ring-2 focus:ring-[#3B3DA6]/10"
              />
            </div>
          </div>

          {/* Quick filter badges */}
          <div className="mt-6">
            <span className="mb-3 block text-[10px] font-bold uppercase tracking-[0.2em] text-[#AAAAC8]">
              Quick Categories
            </span>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {["Course materials", "Live sessions", "Certification", "Help articles"].map(
                (item) => (
                  <button
                    key={item}
                    onClick={() => setQuery(query === item ? "" : item)}
                    className={`rounded-lg border px-3 py-2.5 text-left text-xs font-medium transition focus:outline-none ${
                      query === item
                        ? "border-[#3B3DA6] bg-[#3B3DA6] text-white"
                        : "border-[#DDDDF0] bg-[#F4F5FB] text-[#3D3F6E] hover:border-[#3B3DA6]/40 hover:bg-[#EAEBF6]"
                    }`}
                  >
                    {item}
                  </button>
                ),
              )}
            </div>
          </div>

          {/* Results */}
          {query.length > 0 && (
            <div className="mt-6 border-t border-[#DDDDF0] pt-6">
              <div className="mb-3 flex items-center justify-between px-1">
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#AAAAC8]">
                  Results
                </span>
                <span className="rounded-full bg-[#3B3DA6]/10 px-2.5 py-0.5 text-[10px] font-bold text-[#3B3DA6]">
                  {filteredResults.length} found
                </span>
              </div>

              {filteredResults.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {filteredResults.map((result) => (
                    <Link
                      key={result.title}
                      to={result.path}
                      className="group flex items-center justify-between rounded-xl border border-[#DDDDF0] bg-[#F4F5FB] p-4 transition hover:border-[#3B3DA6]/40 hover:bg-[#EAEBF6]"
                    >
                      <div className="flex items-center gap-3">
                        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#3B3DA6]/10 text-[#3B3DA6]">
                          {result.type === "course" && <BookOpen className="h-4 w-4" />}
                          {result.type === "quiz" && <ClipboardList className="h-4 w-4" />}
                          {result.type === "help" && <HelpCircle className="h-4 w-4" />}
                          {result.type === "session" && <FileText className="h-4 w-4" />}
                        </div>
                        <div>
                          <span className="block text-sm font-semibold text-[#1A1C5C] transition group-hover:text-[#3B3DA6]">
                            {result.title}
                          </span>
                          <span className="text-[10px] font-medium uppercase tracking-wider text-[#AAAAC8]">
                            {result.category}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-[#3B3DA6] opacity-0 transition-opacity group-hover:opacity-100">
                        View →
                      </span>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-[#DDDDF0] bg-[#F4F5FB] py-10 text-center">
                  <p className="text-sm text-[#AAAAC8]">No results match your search.</p>
                  <p className="mt-1 text-xs text-[#AAAAC8]">
                    Try a different keyword or browse a category above.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
