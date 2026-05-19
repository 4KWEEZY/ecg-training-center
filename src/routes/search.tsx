import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { TopBar } from "@/components/landing/TopBar";
import { Nav } from "@/components/landing/Nav";
import { Footer } from "@/components/landing/Footer";
import { Search, BookOpen, HelpCircle, FileText, ClipboardList } from "lucide-react";

export const Route = createFileRoute("/search")({
  component: SearchPage,
});

// Mock portal data pool for high-fidelity search matching
const searchableItems = [
  { title: "Workplace Safety & Compliance Module", category: "Course materials", type: "course", path: "/courses" },
  { title: "Distribution Operations 101 Guide", category: "Course materials", type: "course", path: "/courses" },
  { title: "High Voltage Substation Isolation Live Stream", category: "Live sessions", type: "session", path: "/library" },
  { title: "Safety Assessment Practice Quiz", category: "Quizzes", type: "quiz", path: "/quizzes" },
  { title: "Smart Metering Billing Platform Walkthrough", category: "Course materials", type: "course", path: "/courses" },
  { title: "How to unlock my Training Certificate", category: "Certification", type: "help", path: "/help" },
  { title: "Troubleshooting HD video streaming issues", category: "Help articles", type: "help", path: "/help" },
];

function SearchPage() {
  const [query, setQuery] = useState("");

  // Filters the data array in real-time based on the trainee's search input
  const filteredResults = searchableItems.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-brand text-white flex flex-col justify-between">
      <div>
        <TopBar />
        <Nav />
        
        <main className="mx-auto max-w-4xl px-6 py-40 sm:px-8">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-[0_30px_80px_rgba(0,0,0,0.18)] backdrop-blur-md">
            
            {/* Header Content */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-semibold text-white">Search the Training Center</h1>
                <p className="mt-2 text-sm text-white/70">Find courses, resources, and quizzes across the portal.</p>
              </div>
              <Link
                to="/login"
                className="inline-flex rounded-3xl bg-yellow px-4 py-2 text-xs font-semibold uppercase tracking-wider text-brand-dark transition hover:brightness-110 shrink-0 self-start sm:self-center"
              >
                Sign in to continue
              </Link>
            </div>

            {/* Interactive Search Bar Input */}
            <div className="mt-8">
              <label className="block text-sm text-white/80 font-medium">Search term</label>
              <div className="relative mt-3">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search courses, quizzes, and guides (e.g., safety, substation, metrics)..."
                  className="w-full rounded-3xl border border-white/10 bg-white/5 py-4 pl-12 pr-4 text-white outline-none transition focus:border-yellow text-sm"
                />
              </div>
            </div>

            {/* Clickable Quick Filter Badges */}
            <div className="mt-8">
              <span className="text-xs font-bold uppercase tracking-wider text-white/50 block mb-3">Quick Categories</span>
              <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
                {["Course materials", "Live sessions", "Certification", "Help articles"].map((item) => (
                  <button
                    key={item}
                    onClick={() => setQuery(item)}
                    className={`rounded-xl border text-left px-4 py-3 text-xs font-medium transition focus:outline-none ${
                      query === item 
                        ? "border-yellow bg-yellow/10 text-yellow" 
                        : "border-white/10 bg-white/5 text-white/80 hover:border-white/30"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic Real-Time Results Field */}
            {query.length > 0 && (
              <div className="mt-8 border-t border-white/10 pt-6 space-y-3">
                <div className="flex items-center justify-between text-xs text-white/50 uppercase tracking-wider font-semibold px-1">
                  <span>Search Results</span>
                  <span>{filteredResults.length} Found</span>
                </div>
                
                {filteredResults.length > 0 ? (
                  filteredResults.map((result) => (
                    <Link
                      key={result.title}
                      to={result.path}
                      className="flex items-center justify-between border border-white/5 bg-black/10 hover:bg-white/5 hover:border-yellow/30 p-4 rounded-xl transition group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-md bg-white/5 text-yellow">
                          {result.type === "course" && <BookOpen className="h-4 w-4" />}
                          {result.type === "quiz" && <ClipboardList className="h-4 w-4" />}
                          {result.type === "help" && <HelpCircle className="h-4 w-4" />}
                          {result.type === "session" && <FileText className="h-4 w-4" />}
                        </div>
                        <div>
                          <span className="block text-sm font-medium text-white group-hover:text-yellow transition-colors">{result.title}</span>
                          <span className="text-[11px] text-white/40 uppercase font-medium">{result.category}</span>
                        </div>
                      </div>
                      <span className="text-xs text-yellow opacity-0 group-hover:opacity-100 transition-opacity pr-2 font-medium">View →</span>
                    </Link>
                  )
                )) : (
                  <div className="text-center py-8 border border-dashed border-white/10 rounded-xl bg-white/[0.01]">
                    <p className="text-sm text-white/40">No configuration logs or materials match your query.</p>
                  </div>
                )}
              </div>
            )}

          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
}