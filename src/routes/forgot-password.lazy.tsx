import { createLazyFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Mail, ArrowRight, ArrowLeft, KeyRound } from "lucide-react";
import logo from "@/assets/ecg-logo.png";
import heroImg from "@/assets/utility-workers.jpg";
import { useState } from "react";
import axios from "axios";

export const Route = createLazyFileRoute("/forgot-password")({
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await axios.post("http://127.0.0.1:8000/api/forgot-password/", { email });
      // Pass email to OTP page via search params
      navigate({ to: "/verify-otp", search: { email } });
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data) {
        setError(
          err.response.data?.email?.[0] ||
          err.response.data?.detail ||
          "Something went wrong. Please try again."
        );
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#F4F5FB]">
      {/* Left Panel */}
      <div className="absolute inset-y-0 left-0 hidden w-1/2 lg:block">
        <img src={heroImg} alt="ECG Training" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A1C5C]/95 via-[#3B3DA6]/85 to-[#2B2D8A]/90" />
        <div className="absolute inset-0 flex flex-col justify-between p-12">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 p-1.5 ring-1 ring-white/20">
              <img src={logo} alt="ECG logo" className="h-9 w-9 object-contain" />
            </div>
            <div className="font-display text-base font-bold uppercase tracking-[0.12em] text-white">
              ECG <span className="text-[#FFD700]">Training Center</span>
            </div>
          </div>
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#FFD700]">
              Account Recovery
            </p>
            <h1 className="font-display text-5xl font-light uppercase text-white">
              Reset Your <br />
              <span className="font-bold text-[#FFD700]">Password</span>
            </h1>
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-white/50">
              Enter your registered email and we'll send you a verification code to get back into your account.
            </p>
          </div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/30">
            © 2026 Electricity Company of Ghana
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex min-h-screen items-center justify-center px-6 py-16 lg:ml-[50%]">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-[#DDDDF0] bg-white p-8 shadow-[0_8px_40px_rgba(59,61,166,0.12)] md:p-10">

            {/* Header */}
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#3B3DA6]">
                <KeyRound className="h-7 w-7 text-white" />
              </div>
              <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-[#1A1C5C]">
                Forgot Password
              </h2>
              <p className="mt-2 text-sm text-[#8B8DAE]">
                We'll send a verification code to your email
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-[0.15em] text-[#3B3DA6]">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#AAAAC8]" />
                  <input
                    required
                    type="email"
                    placeholder="Enter your registered email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(""); }}
                    className="w-full rounded-xl border border-[#DDDDF0] bg-[#F4F5FB] py-3.5 pl-11 pr-4 text-sm text-[#1A1C5C] outline-none placeholder:text-[#AAAAC8] focus:border-[#3B3DA6] focus:ring-2 focus:ring-[#3B3DA6]/10"
                  />
                </div>
                {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#3B3DA6] py-3.5 text-sm font-bold uppercase tracking-[0.15em] text-white transition hover:bg-[#2B2D8A] disabled:opacity-60"
              >
                {loading ? "Sending..." : <> Send Verification Code <ArrowRight className="h-4 w-4" /> </>}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-sm font-medium text-[#8B8DAE] transition hover:text-[#3B3DA6]"
              >
                <ArrowLeft className="h-4 w-4" /> Back to Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
