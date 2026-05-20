import { createLazyFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ShieldCheck, ArrowRight, Mail, Lock, User } from "lucide-react";
import logo from "@/assets/ecg-logo.png";
import heroImg from "@/assets/utility-workers.jpg";

export const Route = createLazyFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#F4F5FB]">
      {/* ── Left Panel (Hero) ── */}
      <div className="absolute inset-y-0 left-0 hidden w-1/2 lg:block">
        <img src={heroImg} alt="ECG Training" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A1C5C]/95 via-[#3B3DA6]/85 to-[#2B2D8A]/90" />
        <div className="absolute inset-0 flex flex-col justify-between p-12">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 p-1.5 ring-1 ring-white/20">
              <img src={logo} alt="ECG logo" className="h-9 w-9 object-contain" />
            </div>
            <div>
              <div className="font-display text-base font-bold uppercase tracking-[0.12em] text-white">ECG <span className="text-[#FFD700]">Training Center</span></div>
            </div>
          </div>
          <h1 className="font-display text-5xl font-light uppercase text-white">Welcome To <br /><span className="font-bold text-[#FFD700]">ECG Academy</span></h1>
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/30">© 2026 Electricity Company of Ghana</p>
        </div>
      </div>

      {/* ── Right Panel (Form) ── */}
      <div className="flex min-h-screen items-center justify-center px-6 py-16 lg:ml-[50%]">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-[#DDDDF0] bg-white p-8 shadow-[0_8px_40px_rgba(59,61,166,0.12)] md:p-10">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#3B3DA6]">
                <ShieldCheck className="h-7 w-7 text-white" />
              </div>
              <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-[#1A1C5C]">Trainee Sign In</h2>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-5">
              {/* Username */}
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-[0.15em] text-[#3B3DA6]">Username</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#AAAAC8]" />
                  <input required type="text" placeholder="Enter your username" className="w-full rounded-xl border border-[#DDDDF0] bg-[#F4F5FB] py-3.5 pl-11 pr-4 text-sm text-[#1A1C5C] outline-none placeholder:text-[#AAAAC8] focus:border-[#3B3DA6] focus:ring-2 focus:ring-[#3B3DA6]/10" />
                </div>
              </div>

              {/* Email / Phone */}
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-[0.15em] text-[#3B3DA6]">Email Address / Phone Number</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#AAAAC8]" />
                  <input required type="text" placeholder="you@ecggh.com or 024XXXXXXX" className="w-full rounded-xl border border-[#DDDDF0] bg-[#F4F5FB] py-3.5 pl-11 pr-4 text-sm text-[#1A1C5C] outline-none placeholder:text-[#AAAAC8] focus:border-[#3B3DA6] focus:ring-2 focus:ring-[#3B3DA6]/10" />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-[0.15em] text-[#3B3DA6]">Password</label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#AAAAC8]" />
                  <input required type="password" placeholder="••••••••" className="w-full rounded-xl border border-[#DDDDF0] bg-[#F4F5FB] py-3.5 pl-11 pr-4 text-sm text-[#1A1C5C] outline-none placeholder:text-[#AAAAC8] focus:border-[#3B3DA6] focus:ring-2 focus:ring-[#3B3DA6]/10" />
                </div>
              </div>

              <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#3B3DA6] py-3.5 text-sm font-bold uppercase tracking-[0.15em] text-white transition hover:bg-[#2B2D8A]">
                Sign In <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-[#8B8DAE]">Don't have an account?</p>
              <Link to="/register" className="mt-3 inline-flex w-full items-center justify-center rounded-xl border border-[#DDDDF0] bg-[#F4F5FB] py-3 text-sm font-bold uppercase tracking-wider text-[#3B3DA6] transition hover:bg-[#EAEBF6]">
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}