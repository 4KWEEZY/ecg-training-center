import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronDown, Menu, Search, X } from "lucide-react";
import { useState, useEffect } from "react";
import logo from "@/assets/ecg-logo.png";

const links = [
  { label: "Dashboard", href: "/dashboard" },
  {
    label: "Programmes",
    href: "/courses",
    submenu: [
      { label: "Course Catalog", href: "/courses" },
      { label: "Search & Filters", href: "/search" },
      { label: "Workshops & Seminars", href: "/schedule" },
      { label: "Professional Consultancy", href: "/help" },
    ],
  },
  {
    label: "Academic Info",
    href: "/progress",
    submenu: [
      { label: "My Progress Tracking", href: "/progress" },
      { label: "Quizzes & Evaluations", href: "/quizzes" },
      { label: "Certificate Verification", href: "/certificates" },
    ],
  },
  {
    label: "Campus Media",
    href: "/library",
    submenu: [
      { label: "Resource Library", href: "/library" },
      { label: "Training Documents", href: "/documents" },
      { label: "Photo Gallery", href: "/resources" },
      { label: "Version Notes", href: "/version" },
    ],
  },
  { label: "About Us", href: "/help" },
];

export function Nav() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  // Shrink nav on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) => currentPath === href;

  return (
    <header className="fixed left-0 right-0 top-0 z-50">

      {/* ── Top accent strip ── */}
      <div className="h-1 w-full bg-gradient-to-r from-[#FFD700] via-[#3B3DA6] to-[#FFD700]" />

      {/* ── Main navbar ── */}
      <div
        className={`w-full transition-all duration-300 ${
          scrolled
            ? "bg-[#3B3DA6] shadow-[0_4px_24px_rgba(59,61,166,0.35)]"
            : "bg-[#3B3DA6]"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2 md:px-6">

          {/* ── Logo ── */}
          <Link to="/" className="flex shrink-0 items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 p-1.5 ring-1 ring-white/20 transition hover:bg-white/20">
              <img
                src={logo}
                alt="ECG logo"
                width={40}
                height={40}
                className="h-9 w-9 object-contain"
              />
            </div>
            <div className="leading-tight">
              <div className="font-display text-base font-bold uppercase tracking-[0.12em] text-white md:text-lg">
                ECG{" "}
                <span className="text-[#FFD700]">Training Center</span>
              </div>
              <div className="text-[9px] uppercase tracking-[0.22em] text-white/60">
                Learning Management Portal
              </div>
            </div>
          </Link>

          {/* ── Desktop Nav ── */}
          <nav className="hidden flex-1 items-center justify-center gap-1 lg:flex">
            {links.map((l) => (
              <div
                key={l.label}
                className="relative"
                onMouseEnter={() => setActiveDropdown(l.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                {l.submenu ? (
                  <button
                    className={`group flex cursor-pointer items-center gap-1 rounded-lg px-3.5 py-2 text-[12px] font-semibold uppercase tracking-[0.12em] outline-none transition-all duration-200 ${
                      activeDropdown === l.label
                        ? "bg-white/15 text-[#FFD700]"
                        : "text-white/90 hover:bg-white/10 hover:text-white"
                    }`}
                    aria-expanded={activeDropdown === l.label}
                  >
                    {l.label}
                    <ChevronDown
                      className={`h-3 w-3 transition-transform duration-200 ${
                        activeDropdown === l.label ? "rotate-180 text-[#FFD700]" : "opacity-60"
                      }`}
                    />
                  </button>
                ) : (
                  <Link
                    to={l.href}
                    className={`flex items-center rounded-lg px-3.5 py-2 text-[12px] font-semibold uppercase tracking-[0.12em] transition-all duration-200 ${
                      isActive(l.href)
                        ? "bg-white/20 text-[#FFD700]"
                        : "text-white/90 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {l.label}
                  </Link>
                )}

                {/* Dropdown panel */}
                {l.submenu && (
                  <div
                    className={`absolute left-0 top-full z-50 mt-2 min-w-[220px] overflow-hidden rounded-xl border border-white/10 bg-[#2B2D8A] shadow-[0_16px_48px_rgba(27,29,92,0.45)] transition-all duration-200 ${
                      activeDropdown === l.label
                        ? "visible translate-y-0 opacity-100"
                        : "invisible -translate-y-2 opacity-0"
                    }`}
                  >
                    {/* Dropdown header accent */}
                    <div className="h-0.5 w-full bg-gradient-to-r from-[#FFD700] to-transparent" />

                    <div className="p-2">
                      {l.submenu.map((item) => (
                        <Link
                          key={item.label}
                          to={item.href}
                          className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.12em] transition-all duration-200 hover:bg-white/10 hover:text-[#FFD700] ${
                            isActive(item.href)
                              ? "bg-white/10 text-[#FFD700]"
                              : "text-white/80"
                          }`}
                          onClick={() => setActiveDropdown(null)}
                        >
                          <span className="h-1 w-1 rounded-full bg-current opacity-50" />
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* ── Desktop Actions ── */}
          <div className="hidden items-center gap-2 lg:flex">
            <Link
              to="/search"
              aria-label="Search"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 bg-white/10 text-white transition hover:bg-white/20 hover:text-[#FFD700]"
            >
              <Search className="h-4 w-4" />
            </Link>

            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-lg bg-[#FFD700] px-5 py-2 text-[11px] font-bold uppercase tracking-[0.15em] text-[#1A1C5C] transition hover:bg-[#E6BE00] hover:shadow-[0_4px_16px_rgba(255,215,0,0.35)]"
            >
              Sign In
            </Link>
          </div>

          {/* ── Mobile Toggle ── */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle Menu"
            className="grid h-9 w-9 place-items-center rounded-lg border border-white/20 bg-white/10 text-white transition hover:bg-white/20 lg:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* ── Mobile Drawer ── */}
      <div
        className={`overflow-hidden transition-all duration-300 lg:hidden ${
          mobileOpen ? "max-h-[100vh] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="border-t border-white/10 bg-[#2B2D8A] px-4 pb-6 pt-4">

          {/* Mobile search */}
          <Link
            to="/search"
            className="mb-4 flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-sm text-white/70 transition hover:text-white"
            onClick={() => setMobileOpen(false)}
          >
            <Search className="h-4 w-4" />
            <span className="text-xs tracking-wider">Search courses…</span>
          </Link>

          {/* Mobile links */}
          <div className="flex flex-col gap-1">
            {links.map((link) => (
              <div key={link.label}>
                {link.submenu ? (
                  <div className="mb-2">
                    <div className="mb-1 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
                      {link.label}
                    </div>
                    <div className="flex flex-col gap-0.5 border-l-2 border-[#FFD700]/30 pl-3">
                      {link.submenu.map((sub) => (
                        <Link
                          key={sub.label}
                          to={sub.href}
                          className={`rounded-lg px-3 py-2.5 text-sm font-medium transition hover:bg-white/10 hover:text-[#FFD700] ${
                            isActive(sub.href) ? "text-[#FFD700]" : "text-white/80"
                          }`}
                          onClick={() => setMobileOpen(false)}
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    to={link.href}
                    className={`block rounded-lg px-3 py-2.5 text-sm font-semibold uppercase tracking-wider transition hover:bg-white/10 hover:text-[#FFD700] ${
                      isActive(link.href) ? "text-[#FFD700]" : "text-white/80"
                    }`}
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Mobile sign in */}
          <div className="mt-4 border-t border-white/10 pt-4">
            <Link
              to="/login"
              className="flex w-full items-center justify-center rounded-xl bg-[#FFD700] py-3 text-sm font-bold uppercase tracking-[0.15em] text-[#1A1C5C]"
              onClick={() => setMobileOpen(false)}
            >
              Sign In to Portal
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}