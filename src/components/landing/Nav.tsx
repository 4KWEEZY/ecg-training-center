import { Link } from "@tanstack/react-router";
import { ChevronDown, Menu, Search } from "lucide-react";
import { useState } from "react";
import logo from "@/assets/ecg-logo.png";

const links = [
  { label: "Dashboard", href: "/dashboard" },
  {
    label: "My Courses",
    href: "/courses",
    submenu: [
      { label: "Course Catalog", href: "/courses" },
      { label: "Progress", href: "/progress" },
      { label: "Certificates", href: "/certificates" },
    ],
  },
  {
    label: "Library",
    href: "/library",
    submenu: [
      { label: "Course Library", href: "/library" },
      { label: "Resources", href: "/resources" },
      { label: "Documents", href: "/documents" },
    ],
  },
  { label: "Quizzes", href: "/quizzes" },
  { label: "Schedule", href: "/schedule" },
  { label: "Help", href: "/help" },
]

export function Nav() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  return (
    <header className="absolute left-0 right-0 top-4 md:top-16 z-30">
      <div className="bg-transparent">
        <div className="mx-auto flex max-w-7xl items-center gap-6 px-6 py-5">
          <Link to="/" className="flex shrink-0 items-center gap-3 text-white">
            <img src={logo} alt="ECG logo" width={56} height={56} className="h-14 w-14 object-contain" />
            <div className="leading-tight">
              <div className="font-display text-base font-semibold uppercase tracking-wide">
                ECG <span className="text-yellow">Training Center</span>
              </div>
              <div className="text-[11px] uppercase tracking-[0.18em] text-white/70">
                Trainee Portal
              </div>
            </div>
          </Link>

          <nav className="hidden flex-1 items-center gap-7 lg:flex">
            {links.map((l) => (
              <div
                key={l.label}
                className="relative"
                onMouseEnter={() => setActiveDropdown(l.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                {l.submenu ? (
                  <Link
                    to={l.href}
                    className="group flex items-center gap-1 text-sm font-medium uppercase tracking-wider text-white/90 transition hover:text-yellow"
                    aria-expanded={activeDropdown === l.label}
                    onClick={() => setActiveDropdown(null)}
                  >
                    {l.label}
                    <ChevronDown className="h-3.5 w-3.5 opacity-70" />
                    <span className="absolute -bottom-1 left-0 h-px w-0 bg-yellow transition-all group-hover:w-full" />
                  </Link>
                ) : (
                  <Link
                    to={l.href}
                    className="group flex items-center gap-1 text-sm font-medium uppercase tracking-wider text-white/90 transition hover:text-yellow"
                  >
                    {l.label}
                    <span className="absolute -bottom-1 left-0 h-px w-0 bg-yellow transition-all group-hover:w-full" />
                  </Link>
                )}

                {l.submenu && (
                  <div
                    className={`absolute left-0 top-full z-50 mt-3 min-w-[180px] overflow-hidden rounded-3xl border border-white/10 bg-brand/95 p-3 shadow-2xl transition-all duration-200 ${
                      activeDropdown === l.label ? 'visible opacity-100 translate-y-0' : 'invisible opacity-0 -translate-y-2'
                    }`}
                  >
                    {l.submenu.map((item) => (
                      <Link
                        key={item.label}
                        to={item.href}
                        className="block rounded-2xl px-4 py-2 text-sm text-white/90 transition hover:bg-white/10 hover:text-white"
                        onClick={() => setActiveDropdown(null)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <Link
              to="/search"
              aria-label="Search"
              className="flex h-10 w-10 items-center justify-center rounded border border-white/20 text-white hover:border-yellow hover:text-yellow"
            >
              <Search className="h-4 w-4" />
            </Link>
            <Link
              to="/login"
              className="inline-flex rounded-sm bg-yellow px-4 py-2 text-xs font-semibold uppercase tracking-wider text-brand-dark transition hover:brightness-110"
            >
              Trainee Sign In
            </Link>
          </div>

          <button aria-label="Menu" className="grid h-10 w-10 place-items-center rounded border border-white/20 text-white lg:hidden">
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}