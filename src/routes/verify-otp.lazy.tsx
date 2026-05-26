import { createLazyFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ShieldCheck, RotateCcw } from "lucide-react";
import logo from "@/assets/ecg-logo.png";
import heroImg from "@/assets/utility-workers.jpg";
import { useState, useRef, useEffect } from "react";
import axios from "axios";

export const Route = createLazyFileRoute("/verify-otp")({
  component: VerifyOtpPage,
});

function VerifyOtpPage() {
  const navigate = useNavigate();
  const { email } = Route.useSearch() as { email: string };

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(60);
  const [resendSuccess, setResendSuccess] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (resendCountdown <= 0) return;
    const timer = setTimeout(() => setResendCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCountdown]);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError("");
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newOtp = [...otp];
    pasted.split("").forEach((char, i) => {
      newOtp[i] = char;
    });
    setOtp(newOtp);
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) {
      setError("Please enter the complete 6-digit code.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/password-reset/verify-otp/", {
        otp_code: code,
      });
      navigate({
        to: "/reset-password",
        search: { email: response.data.email },
      });
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data) {
        setError(
          err.response.data?.otp_code?.[0] ||
            err.response.data?.non_field_errors?.[0] ||
            err.response.data?.detail ||
            "Invalid or expired code. Please try again.",
        );
      } else {
        setError("Invalid or expired code. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    setResendSuccess(false);
    setError("");
    try {
      await axios.post("http://127.0.0.1:8000/api/password-reset/", { email });
      setResendCountdown(60);
      setResendSuccess(true);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch {
      setError("Failed to resend code. Please try again.");
    } finally {
      setResendLoading(false);
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
              Verification
            </p>
            <h1 className="font-display text-5xl font-light uppercase text-white">
              Enter Your <br />
              <span className="font-bold text-[#FFD700]">OTP Code</span>
            </h1>
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-white/50">
              A 6-digit verification code has been sent to your email address. It expires in 10
              minutes.
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
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#3B3DA6]">
                <ShieldCheck className="h-7 w-7 text-white" />
              </div>
              <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-[#1A1C5C]">
                Verify OTP
              </h2>
              <p className="mt-2 text-sm text-[#8B8DAE]">
                Code sent to{" "}
                <span className="font-semibold text-[#3B3DA6]">{email || "your email"}</span>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="mb-3 block text-center text-xs font-bold uppercase tracking-[0.15em] text-[#3B3DA6]">
                  Enter 6-Digit Code
                </label>
                <div className="flex items-center justify-center gap-2" onPaste={handlePaste}>
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => {
                        inputRefs.current[index] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className={`h-13 w-11 rounded-xl border-2 bg-[#F4F5FB] text-center text-xl font-bold text-[#1A1C5C] outline-none transition
                        ${digit ? "border-[#3B3DA6] bg-[#EAEBF6]" : "border-[#DDDDF0]"}
                        focus:border-[#3B3DA6] focus:ring-2 focus:ring-[#3B3DA6]/10
                        ${error ? "border-red-400" : ""}
                      `}
                    />
                  ))}
                </div>
                {error && <p className="mt-3 text-center text-xs text-red-500">{error}</p>}
                {resendSuccess && (
                  <p className="mt-3 text-center text-xs text-green-600">
                    A new code has been sent to your email.
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || otp.join("").length < 6}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#3B3DA6] py-3.5 text-sm font-bold uppercase tracking-[0.15em] text-white transition hover:bg-[#2B2D8A] disabled:opacity-60"
              >
                {loading ? "Verifying..." : "Verify Code"}
              </button>
            </form>

            <div className="mt-6 text-center">
              {resendCountdown > 0 ? (
                <p className="text-sm text-[#8B8DAE]">
                  Resend code in{" "}
                  <span className="font-semibold text-[#3B3DA6]">{resendCountdown}s</span>
                </p>
              ) : (
                <button
                  onClick={handleResend}
                  disabled={resendLoading}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-[#3B3DA6] transition hover:underline disabled:opacity-60"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  {resendLoading ? "Resending..." : "Resend Code"}
                </button>
              )}
            </div>

            <div className="mt-4 text-center">
              <Link
                to="/forgot-password"
                className="inline-flex items-center gap-2 text-sm font-medium text-[#8B8DAE] transition hover:text-[#3B3DA6]"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
