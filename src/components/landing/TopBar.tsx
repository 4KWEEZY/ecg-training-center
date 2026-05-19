import { Facebook, Twitter, Instagram, Phone, Mail } from "lucide-react";

export function TopBar() {
  return (
    <div className="hidden bg-brand-deep/60 text-xs text-white/80 md:block">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2.5">
        <div className="flex items-center gap-4">
          <a href="#" aria-label="Facebook" className="hover:text-yellow"><Facebook className="h-4 w-4" /></a>
          <a href="#" aria-label="Twitter" className="hover:text-yellow"><Twitter className="h-4 w-4" /></a>
          <a href="#" aria-label="Instagram" className="hover:text-yellow"><Instagram className="h-4 w-4" /></a>
        </div>
        <div className="flex items-center gap-6">
          <a href="tel:+2330302611611" className="flex items-center gap-2 hover:text-yellow">
            <Phone className="h-3.5 w-3.5" />
            <span>+233 (0302) 611 611</span>
          </a>
          <a href="mailto:help@ecggh.com" className="flex items-center gap-2 hover:text-yellow">
            <Mail className="h-3.5 w-3.5" />
            <span>help@ecggh.com</span>
          </a>
        </div>
      </div>
    </div>
  );
}
