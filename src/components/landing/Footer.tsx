import { Facebook, Twitter, Instagram, Youtube, Phone, Mail, MapPin } from "lucide-react";
import logo from "@/assets/ecg-logo.png";

export function Footer() {
  return (
    <footer className="bg-brand-dark text-white/80">
      <div className="red-rule" />
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-16 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            <img src={logo} alt="ECG logo" width={48} height={48} className="h-12 w-12 object-contain" />
            <div className="font-display font-semibold uppercase leading-tight text-white">
              ECG <span className="text-yellow">Training Center</span>
              <div className="text-[10px] uppercase tracking-widest text-white/60">Trainee Portal</div>
            </div>
          </div>
          <p className="mt-5 max-w-xs text-sm">
            The official learning platform of the Electricity Company of Ghana
            — course materials, training videos, and quizzes for new staff.
          </p>
          <div className="mt-5 flex gap-3">
            {[Facebook, Twitter, Instagram, Youtube].map((I, i) => (
              <a key={i} href="#" aria-label="social" className="grid h-9 w-9 place-items-center rounded-full border border-white/20 hover:border-yellow hover:text-yellow">
                <I className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {[
          ["Learning", ["My Courses", "Video Library", "Quizzes & Assessments", "Certificates", "Course Catalogue"]],
          ["Trainee Resources", ["Orientation Handbook", "Code of Conduct", "Safety Manual", "HR Policies", "FAQ"]],
        ].map(([t, links]) => (
          <div key={t as string}>
            <div className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-yellow">{t}</div>
            <ul className="space-y-2.5 text-sm">
              {(links as string[]).map((l) => (
                <li key={l}><a href="#" className="hover:text-yellow">{l}</a></li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <div className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-yellow">Training Office</div>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-yellow" /><span>ECG Head Office, Electro-Volta House, Accra</span></li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-yellow" /><span>+233 (0302) 611 611</span></li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-yellow" /><span>academy@ecggh.com</span></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-5 text-xs text-white/60">
          <span>© {new Date().getFullYear()} Electricity Company of Ghana Ltd. · ECG Training Center</span>
          <span>Privacy · Terms · Acceptable Use</span>
        </div>
      </div>
    </footer>
  );
}
