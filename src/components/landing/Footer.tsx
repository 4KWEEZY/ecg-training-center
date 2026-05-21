import { Link } from "@tanstack/react-router";
import { Facebook, Twitter, Linkedin, Youtube, Phone, Mail, MapPin, Send } from "lucide-react";
import logo from "@/assets/ecg-logo.png";

export function Footer() {
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Newsletter callback handler placeholder
  };

  return (
    <footer className="bg-brand-dark text-white/80 border-t border-white/5">
      {/* Accent Red Line Rule Separator */}
      <div className="h-1 w-full bg-red-cta" />

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-16 md:grid-cols-4">
        {/* Brand Information & Social Handles */}
        <div>
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="ECG logo"
              width={48}
              height={48}
              className="h-12 w-12 object-contain"
            />
            <div className="font-display font-semibold uppercase leading-tight text-white">
              ECG <span className="text-yellow">Training Center</span>
              <div className="text-[10px] uppercase tracking-widest text-white/60">
                LMS System v2.0
              </div>
            </div>
          </div>
          <p className="mt-5 max-w-xs text-xs md:text-sm text-white/60 leading-relaxed">
            The professional learning destination of the Electricity Company of Ghana. Automating
            industrial workflows, evaluations, and core technical certifications.
          </p>
          <div className="mt-5 flex gap-3">
            {[
              { icon: Facebook, href: "https://facebook.com" },
              { icon: Twitter, href: "https://twitter.com" },
              { icon: Linkedin, href: "https://linkedin.com" },
              { icon: Youtube, href: "https://youtube.com" },
            ].map((soc, idx) => {
              const IconComponent = soc.icon;
              return (
                <a
                  key={idx}
                  href={soc.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Social Link Connection"
                  className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-white/70 hover:border-yellow hover:text-yellow transition-colors"
                >
                  <IconComponent className="h-4 w-4" />
                </a>
              );
            })}
          </div>
        </div>

        {/* Dynamic Column Routing Iterators */}
        <div>
          <div className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-yellow">
            Programmes
          </div>
          <ul className="space-y-2.5 text-xs md:text-sm">
            <li>
              <Link to="/courses" className="hover:text-yellow transition-colors">
                Course Catalog
              </Link>
            </li>
            <li>
              <Link to="/library" className="hover:text-yellow transition-colors">
                Resource Archive
              </Link>
            </li>
            <li>
              <Link to="/quizzes" className="hover:text-yellow transition-colors">
                Assessments Engine
              </Link>
            </li>
            <li>
              <Link to="/certificates" className="hover:text-yellow transition-colors">
                Verified Credentials
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <div className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-yellow">
            Trainee Resources
          </div>
          <ul className="space-y-2.5 text-xs md:text-sm">
            <li>
              <Link to="/documents" className="hover:text-yellow transition-colors">
                Orientation Handbooks
              </Link>
            </li>
            <li>
              <Link to="/schedule" className="hover:text-yellow transition-colors">
                Workshop Calendar
              </Link>
            </li>
            <li>
              <Link to="/progress" className="hover:text-yellow transition-colors">
                Performance Tracking
              </Link>
            </li>
            <li>
              <Link to="/version" className="hover:text-yellow transition-colors">
                Release Metrics
              </Link>
            </li>
          </ul>
        </div>

        {/* Institutional Contacts Block */}
        <div>
          <div className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-yellow">
            Training Office
          </div>
          <ul className="space-y-3 text-xs md:text-sm mb-5">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-yellow" />
              <span className="text-white/70">
                ECG Training School, Tema Community 10, Digital Address: GK-008-5683, Ghana
              </span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-yellow" />
              <a
                href="tel:+233302611611"
                className="text-white/70 hover:text-yellow transition-colors"
              >
                +233 (0) 302 611 611
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-yellow" />
              <a
                href="mailto:info@ecgtc.edu.gh"
                className="text-white/70 hover:text-yellow transition-colors"
              >
                info@ecgtc.edu.gh
              </a>
            </li>
          </ul>

          {/* ── Newsletter Email Capture Input Widget [NEW - Section 4.1] ── */}
          <form onSubmit={handleSubscribe} className="relative mt-4 max-w-xs">
            <input
              type="email"
              required
              placeholder="Subscribe to workshop updates..."
              className="w-full bg-brand-deep/80 border border-white/10 rounded px-3 py-2 pr-10 text-xs text-white placeholder-white/30 focus:outline-none focus:border-yellow transition-colors"
            />
            <button
              type="submit"
              aria-label="Submit subscriber item"
              className="absolute right-1 top-1/2 -translate-y-1/2 text-white/50 hover:text-yellow p-1.5 transition-colors"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>
      </div>

      {/* Copy Directive Subbar */}
      <div className="border-t border-white/5 bg-brand-dark/40">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-5 text-[11px] text-white/40 tracking-wide">
          <span>
            © {new Date().getFullYear()} Electricity Company of Ghana Ltd. · ECG Training Centre.
            All Rights Reserved.
          </span>
          <div className="flex gap-4">
            <Link to="/help" className="hover:text-white transition-colors">
              Privacy Charter
            </Link>
            <span>·</span>
            <Link to="/help" className="hover:text-white transition-colors">
              Terms of Use
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
