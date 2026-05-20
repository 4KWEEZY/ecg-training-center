import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  Search, Clock, CreditCard, CheckCircle2,
  ArrowRight, BookOpen, X, Smartphone,
} from "lucide-react";
import { TopBar } from "@/components/landing/TopBar";
import { Nav } from "@/components/landing/Nav";
import { Footer } from "@/components/landing/Footer";

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
    description: "Comprehensive training on sub-station management, network safety protection grids, and high voltage feeder operations.",
  },
  {
    id: "course-2",
    title: "Solar PV Design and Grid Integration",
    category: "Renewable Energy",
    level: "Intermediate",
    duration: "4 Weeks",
    fee: 850,
    description: "Technician framework on standard commercial solar installation systems and synchronizing clean grids to main feeds.",
  },
  {
    id: "course-3",
    title: "LMS and Substation Database Administration",
    category: "IT",
    level: "Beginner",
    duration: "3 Weeks",
    fee: 500,
    description: "Introduction to digital infrastructure, internal system networking tools, and network diagnostics data setups.",
  },
  {
    id: "course-4",
    title: "Safety Compliance Standards for Independent Contractors",
    category: "Contractors",
    level: "Beginner",
    duration: "2 Weeks",
    fee: 350,
    description: "Mandatory personal protective protocols, fall risk controls, and electrical hazard audits required for ECG contract approval.",
  },
  {
    id: "course-5",
    title: "Substation Transformer Diagnostics & Repair",
    category: "Power Systems",
    level: "Advanced",
    duration: "8 Weeks",
    fee: 1500,
    description: "Advanced maintenance blueprints covering cooling systems, core winding repairs, and automatic emergency trip configurations.",
  },
];

const CATEGORIES = ["All Categories", "Power Systems", "Renewable Energy", "IT", "Contractors"];
const LEVELS     = ["All Levels", "Beginner", "Intermediate", "Advanced"];

const LEVEL_COLORS: Record<string, string> = {
  Beginner:     "bg-[#2E9E6B]/10 text-[#2E9E6B]",
  Intermediate: "bg-[#3B3DA6]/10 text-[#3B3DA6]",
  Advanced:     "bg-[#E8534A]/10 text-[#E8534A]",
};

function CoursesCatalogPage() {
  const [searchQuery,    setSearchQuery]    = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedLevel,    setSelectedLevel]    = useState("All Levels");

  const [selectedCourse, setSelectedCourse] = useState<typeof MOCK_COURSES[0] | null>(null);
  const [paymentMethod,  setPaymentMethod]  = useState<"momo" | "card">("momo");
  const [momoProvider,   setMomoProvider]   = useState("MTN");
  const [phoneNumber,    setPhoneNumber]    = useState("");
  const [isProcessing,   setIsProcessing]   = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const filteredCourses = useMemo(() =>
    MOCK_COURSES.filter((c) => {
      const matchSearch   = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            c.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory = selectedCategory === "All Categories" || c.category === selectedCategory;
      const matchLevel    = selectedLevel    === "All Levels"      || c.level    === selectedLevel;
      return matchSearch && matchCategory && matchLevel;
    }),
    [searchQuery, selectedCategory, selectedLevel]
  );

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => { setIsProcessing(false); setPaymentSuccess(true); }, 2500);
  };

  const closeModal = () => {
    setSelectedCourse(null);
    setPaymentSuccess(false);
    setPhoneNumber("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F5FB]">
      <TopBar />
      <Nav />

      <main className="flex-1 mx-auto w-full max-w-7xl px-6 pt-36 pb-20">

        {/* Page heading */}
        <div className="mb-8 text-center">
          <span className="mb-2 inline-block rounded-full border border-[#3B3DA6]/20 bg-[#3B3DA6]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#3B3DA6]">
            ECG Training Academy
          </span>
          <h1 className="font-display text-3xl font-bold uppercase tracking-wide text-[#1A1C5C] sm:text-4xl">
            Available Programmes
          </h1>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-[#8B8DAE]">
            Explore fully certified electrical engineering, safety compliance, and technology courses.
            Enroll directly online with local payment processing.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 rounded-2xl border border-[#DDDDF0] bg-white p-4 shadow-[0_2px_12px_rgba(59,61,166,0.07)]">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
            {/* Search */}
            <div className="relative md:col-span-5">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#AAAAC8]" />
              <input
                type="text"
                placeholder="Search courses by title or keyword…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-[#DDDDF0] bg-[#F4F5FB] py-2.5 pl-10 pr-4 text-sm text-[#1A1C5C] outline-none placeholder:text-[#AAAAC8] focus:border-[#3B3DA6] focus:ring-2 focus:ring-[#3B3DA6]/10"
              />
            </div>

            {/* Category */}
            <div className="md:col-span-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full rounded-xl border border-[#DDDDF0] bg-[#F4F5FB] px-4 py-2.5 text-sm text-[#3D3F6E] outline-none focus:border-[#3B3DA6]"
              >
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>

            {/* Level */}
            <div className="md:col-span-3">
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full rounded-xl border border-[#DDDDF0] bg-[#F4F5FB] px-4 py-2.5 text-sm text-[#3D3F6E] outline-none focus:border-[#3B3DA6]"
              >
                {LEVELS.map((l) => <option key={l}>{l}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="mb-4 flex items-center justify-between px-1">
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#AAAAC8]">
            Programmes
          </span>
          <span className="rounded-full bg-[#3B3DA6]/10 px-2.5 py-0.5 text-[10px] font-bold text-[#3B3DA6]">
            {filteredCourses.length} found
          </span>
        </div>

        {/* Course grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="group flex flex-col justify-between rounded-2xl border border-[#DDDDF0] bg-white p-6 shadow-[0_2px_12px_rgba(59,61,166,0.07)] transition hover:-translate-y-1 hover:shadow-[0_8px_28px_rgba(59,61,166,0.14)]"
              >
                <div>
                  {/* Category + duration */}
                  <div className="mb-4 flex items-center justify-between gap-2">
                    <span className="rounded-full bg-[#FFD700]/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#B8960C]">
                      {course.category}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-[#AAAAC8]">
                      <Clock className="h-3 w-3" /> {course.duration}
                    </span>
                  </div>

                  {/* Level badge */}
                  <span className={`mb-2 inline-block rounded-lg px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${LEVEL_COLORS[course.level]}`}>
                    {course.level}
                  </span>

                  <h3 className="mt-1 text-base font-semibold leading-snug text-[#1A1C5C] transition group-hover:text-[#3B3DA6] line-clamp-2">
                    {course.title}
                  </h3>

                  <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-[#8B8DAE]">
                    {course.description}
                  </p>
                </div>

                {/* Footer */}
                <div className="mt-5 flex items-center justify-between border-t border-[#EAEBF6] pt-4">
                  <div>
                    <span className="block text-[10px] uppercase tracking-wider text-[#AAAAC8]">
                      Tuition Fee
                    </span>
                    <span className="font-display text-lg font-bold text-[#1A1C5C]">
                      GHS {course.fee.toLocaleString()}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedCourse(course)}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#3B3DA6] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow transition hover:bg-[#2B2D8A]"
                  >
                    Enroll <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[#DDDDF0] bg-white py-20 text-center">
            <BookOpen className="mx-auto mb-4 h-12 w-12 text-[#DDDDF0]" />
            <h3 className="text-base font-semibold text-[#3D3F6E]">No programmes match your filters</h3>
            <p className="mt-1 text-sm text-[#AAAAC8]">Try resetting your search or selecting all categories.</p>
          </div>
        )}
      </main>

      <Footer />

      {/* ── Payment Modal ── */}
      {selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A1C5C]/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl border border-[#DDDDF0] bg-white p-6 shadow-2xl">

            <button
              onClick={closeModal}
              className="absolute right-4 top-4 rounded-lg p-1.5 text-[#AAAAC8] transition hover:bg-[#F4F5FB] hover:text-[#1A1C5C]"
            >
              <X className="h-5 w-5" />
            </button>

            {!paymentSuccess ? (
              <>
                <div className="mb-5">
                  <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-[#3B3DA6]">
                    Instant Registration
                  </span>
                  <h2 className="text-lg font-bold leading-snug text-[#1A1C5C]">
                    {selectedCourse.title}
                  </h2>
                  <p className="mt-1 text-sm text-[#8B8DAE]">
                    Total Fee:{" "}
                    <strong className="font-bold text-[#1A1C5C]">
                      GHS {selectedCourse.fee.toLocaleString()}
                    </strong>
                  </p>
                </div>

                <form onSubmit={handlePaymentSubmit} className="space-y-4">
                  {/* Payment method toggle */}
                  <div>
                    <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-[#AAAAC8]">
                      Payment Method
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {(["momo", "card"] as const).map((method) => (
                        <button
                          key={method}
                          type="button"
                          onClick={() => setPaymentMethod(method)}
                          className={`flex items-center justify-center gap-2 rounded-xl border py-2.5 text-xs font-bold uppercase tracking-wider transition ${
                            paymentMethod === method
                              ? "border-[#3B3DA6] bg-[#3B3DA6]/5 text-[#3B3DA6]"
                              : "border-[#DDDDF0] bg-[#F4F5FB] text-[#8B8DAE] hover:border-[#3B3DA6]/30"
                          }`}
                        >
                          {method === "momo"
                            ? <><Smartphone className="h-4 w-4" /> Mobile Money</>
                            : <><CreditCard  className="h-4 w-4" /> Credit Card</>
                          }
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Mobile money fields */}
                  {paymentMethod === "momo" ? (
                    <div className="space-y-3">
                      <div>
                        <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-[#AAAAC8]">
                          Network Operator
                        </label>
                        <div className="flex gap-4">
                          {["MTN", "Telecel", "AT"].map((net) => (
                            <label key={net} className="flex cursor-pointer items-center gap-2 text-xs font-medium text-[#3D3F6E]">
                              <input
                                type="radio"
                                name="momoProvider"
                                checked={momoProvider === net}
                                onChange={() => setMomoProvider(net)}
                                className="accent-[#3B3DA6]"
                              />
                              {net}
                            </label>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-[#AAAAC8]">
                          Mobile Number
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="e.g. 0244123456"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className="w-full rounded-xl border border-[#DDDDF0] bg-[#F4F5FB] px-4 py-2.5 text-sm text-[#1A1C5C] outline-none placeholder:text-[#AAAAC8] focus:border-[#3B3DA6]"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <input
                        type="text"
                        required
                        placeholder="0000 0000 0000 0000"
                        className="w-full rounded-xl border border-[#DDDDF0] bg-[#F4F5FB] px-4 py-2.5 text-sm text-[#1A1C5C] outline-none placeholder:text-[#AAAAC8] focus:border-[#3B3DA6]"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          required
                          placeholder="MM/YY"
                          className="w-full rounded-xl border border-[#DDDDF0] bg-[#F4F5FB] px-4 py-2.5 text-sm text-[#1A1C5C] outline-none placeholder:text-[#AAAAC8] focus:border-[#3B3DA6]"
                        />
                        <input
                          type="text"
                          required
                          placeholder="CVC"
                          className="w-full rounded-xl border border-[#DDDDF0] bg-[#F4F5FB] px-4 py-2.5 text-sm text-[#1A1C5C] outline-none placeholder:text-[#AAAAC8] focus:border-[#3B3DA6]"
                        />
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#3B3DA6] py-3 text-xs font-bold uppercase tracking-wider text-white shadow transition hover:bg-[#2B2D8A] disabled:opacity-50"
                  >
                    {isProcessing
                      ? "Processing…"
                      : `Pay GHS ${selectedCourse.fee.toLocaleString()}`}
                  </button>
                </form>
              </>
            ) : (
              <div className="py-6 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-[#2E9E6B]/20 bg-[#2E9E6B]/10">
                  <CheckCircle2 className="h-8 w-8 text-[#2E9E6B]" />
                </div>
                <h3 className="font-display text-xl font-bold text-[#1A1C5C]">Enrollment Confirmed!</h3>
                <p className="mx-auto mt-2 max-w-xs px-2 text-sm text-[#8B8DAE]">
                  Payment was successfully processed. Your course workspace is now unlocked.
                  Check your institutional inbox for the enrollment receipt.
                </p>
                <button
                  onClick={closeModal}
                  className="mt-6 inline-flex rounded-xl border border-[#DDDDF0] bg-[#F4F5FB] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-[#3B3DA6] transition hover:bg-[#EAEBF6]"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
