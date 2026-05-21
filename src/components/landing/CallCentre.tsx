import { MessageSquare, Calendar } from "lucide-react";
import callImg from "@/assets/callcentre.jpg";

export function CallCentre() {
  return (
    <section id="help" className="bg-brand-deep">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:gap-16">
        <div className="relative">
          <div className="overflow-hidden rounded-md shadow-card">
            <img
              src={callImg}
              alt="ECG Training Center training coordinator"
              loading="lazy"
              width={1024}
              height={768}
              className="h-[420px] w-full object-cover"
            />
          </div>
          <div className="absolute -bottom-5 -left-5 rounded-md bg-yellow px-5 py-3 font-display font-semibold uppercase tracking-wider text-brand-dark shadow-card">
            <span className="blink mr-2 inline-block h-2 w-2 rounded-full bg-red-cta align-middle" />
            Mentor Online
          </div>
        </div>

        <div className="text-white">
          <div className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-yellow">
            Trainee Support
          </div>
          <h2 className="font-display text-4xl font-light uppercase leading-tight sm:text-5xl">
            Stuck on a module? <br />
            <span className="text-yellow">A trainer is online</span>
          </h2>
          <p className="mt-5 max-w-md text-white/75">
            Every cohort is paired with experienced ECG staff mentors. Ask questions, request
            clarification on any lesson, or book a 1:1 session — Monday to Friday, 8:00–17:00 GMT.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#chat"
              className="inline-flex items-center gap-3 rounded-sm bg-red-cta px-6 py-3.5 text-sm font-semibold uppercase tracking-wider text-white shadow-card transition hover:bg-red-cta-deep"
            >
              <MessageSquare className="h-4 w-4" /> Chat with a Mentor
            </a>
            <a
              href="#book"
              className="inline-flex items-center gap-3 rounded-sm border border-white/30 px-6 py-3.5 text-sm font-semibold uppercase tracking-wider text-white transition hover:border-yellow hover:text-yellow"
            >
              <Calendar className="h-4 w-4" /> Book 1:1 Session
            </a>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-6 border-t border-white/15 pt-6">
            {[
              ["240+", "Trainees onboarded"],
              ["96%", "Completion rate"],
              ["18", "Course modules"],
            ].map(([n, l]) => (
              <div key={l}>
                <div className="font-display text-3xl font-semibold text-yellow">{n}</div>
                <div className="text-xs uppercase tracking-wider text-white/60">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
