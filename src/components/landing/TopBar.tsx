import { useState } from "react";
import {
  Facebook,
  Twitter,
  Linkedin,
  Phone,
  Mail,
  AlertTriangle,
  X,
  ShieldCheck,
  Globe,
} from "lucide-react";

type Social = {
  icon: React.ElementType;
  label: string;
  href: string;
};

const socials: Social[] = [
  { icon: Facebook, label: "Facebook", href: "https://facebook.com" },
  { icon: Twitter, label: "Twitter", href: "https://twitter.com" },
  { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com" },
];

export function TopBar() {
  const [showNotice, setShowNotice] = useState(true);

  return (
    <div className="hidden md:block w-full relative z-50">
      {/* Fraud Alert Bar */}
      {showNotice && (
        <div className="bg-[#E8534A]">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-2">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-white" />
              <p className="text-[11px] leading-relaxed text-white">
                <span className="font-bold uppercase tracking-widest">Fraud Notice:&nbsp;</span>
                ECG Training Centre will NEVER request payments through personal mobile money
                numbers or unofficial agents. Report suspicious activity immediately.
              </p>
            </div>
            <button
              onClick={() => setShowNotice(false)}
              aria-label="Dismiss notice"
              className="shrink-0 rounded-full p-1 text-white/70 transition hover:bg-white/20 hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Top Bar */}
      <div className="border-b border-white/10 bg-[#2B2D8A]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2">
          {/* Left: badge + socials */}
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-1.5 rounded-full border border-[#FFD700]/30 bg-[#FFD700]/10 px-3 py-1">
              <ShieldCheck className="h-3 w-3 text-[#FFD700]" />
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#FFD700]">
                Official ECG Portal
              </span>
            </div>

            <div className="h-4 w-px bg-white/15" />

            <div className="flex items-center gap-2">
              {socials.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-white/60 transition hover:bg-white/20 hover:text-white"
                >
                  <Icon className="h-3 w-3" />
                </a>
              ))}
            </div>
          </div>

          {/* Right: contact links */}
          <div className="flex items-center gap-5">
            <a
              href="https://www.ecgtc.edu.gh"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[11px] text-white/60 transition hover:text-[#FFD700]"
            >
              <Globe className="h-3 w-3 text-[#FFD700]" />
              www.ecgtc.edu.gh
            </a>

            <div className="h-4 w-px bg-white/15" />

            <a
              href="tel:+233302611611"
              className="flex items-center gap-1.5 text-[11px] text-white/60 transition hover:text-[#FFD700]"
            >
              <Phone className="h-3 w-3 text-[#FFD700]" />
              +233 (0) 302 611 611
            </a>

            <div className="h-4 w-px bg-white/15" />

            <a
              href="mailto:info@ecgtc.edu.gh"
              className="flex items-center gap-1.5 text-[11px] text-white/60 transition hover:text-[#FFD700]"
            >
              <Mail className="h-3 w-3 text-[#FFD700]" />
              info@ecgtc.edu.gh
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
