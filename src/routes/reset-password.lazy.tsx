import { createLazyFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Lock, ArrowLeft, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import logo from "@/assets/ecg-logo.png";
import heroImg from "@/assets/utility-workers.jpg";
import { useState } from "react";
import axios from "axios";

export const Route = createLazyFileRoute("/reset-password")({
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const { email } = Route.useSearch() as { email: string }; // removed otp

  const [formData, setFormData] = useState({ password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters.";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match.";
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      await axios.post("http://127.0.0.1:8000/api/password-reset/confirm/", {
        email,
        new_password: formData.password,
        confirm_password: formData.confirmPassword,
      });
      setSuccess(true);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data) {
        const djangoErrors = err.response.data;
        const formatted: Record<string, string> = {};
        Object.keys(djangoErrors).forEach((key) => {
          formatted[key] = Array.isArray(djangoErrors[key])
            ? djangoErrors[key][0]
            : djangoErrors[key];
        });
        setErrors(formatted);
      } else {
        setErrors({ detail: "Something went wrong. Please try again." });
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
              Almost Done
            </p>
            <h1 className="font-display text-5xl font-light uppercase text-white">
              Create New <br />
              <span className="font-bold text-[#FFD700]">Password</span>
            </h1>
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-white/50">
              Choose a strong password with at least 8 characters to secure your ECG Academy
              account.
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
            {success ? (
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle2 className="h-9 w-9 text-green-600" />
                </div>
                <h2 className="mb-2 font-display text-2xl font-bold uppercase tracking-wide text-[#1A1C5C]">
                  Password Reset!
                </h2>
                <p className="mb-8 text-sm text-[#8B8DAE]">
                  Your password has been updated successfully. You can now sign in with your new
                  password.
                </p>
                <button
                  onClick={() => navigate({ to: "/login" })}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#3B3DA6] py-3.5 text-sm font-bold uppercase tracking-[0.15em] text-white transition hover:bg-[#2B2D8A]"
                >
                  Back to Sign In
                </button>
              </div>
            ) : (
              <>
                <div className="mb-8 text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#3B3DA6]">
                    <Lock className="h-7 w-7 text-white" />
                  </div>
                  <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-[#1A1C5C]">
                    Reset Password
                  </h2>
                  <p className="mt-2 text-sm text-[#8B8DAE]">Enter your new password below</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* New Password */}
                  <div>
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-[0.15em] text-[#3B3DA6]">
                      New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#AAAAC8]" />
                      <input
                        required
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="At least 8 characters"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-[#DDDDF0] bg-[#F4F5FB] py-3.5 pl-11 pr-11 text-sm text-[#1A1C5C] outline-none placeholder:text-[#AAAAC8] focus:border-[#3B3DA6] focus:ring-2 focus:ring-[#3B3DA6]/10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#AAAAC8] transition hover:text-[#3B3DA6]"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="mt-1 text-xs text-red-500">{errors.password}</p>
                    )}
                    {errors.new_password && (
                      <p className="mt-1 text-xs text-red-500">{errors.new_password}</p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-[0.15em] text-[#3B3DA6]">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#AAAAC8]" />
                      <input
                        required
                        name="confirmPassword"
                        type={showConfirm ? "text" : "password"}
                        placeholder="Re-enter your password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-[#DDDDF0] bg-[#F4F5FB] py-3.5 pl-11 pr-11 text-sm text-[#1A1C5C] outline-none placeholder:text-[#AAAAC8] focus:border-[#3B3DA6] focus:ring-2 focus:ring-[#3B3DA6]/10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#AAAAC8] transition hover:text-[#3B3DA6]"
                      >
                        {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>
                    )}
                    {errors.confirm_password && (
                      <p className="mt-1 text-xs text-red-500">{errors.confirm_password}</p>
                    )}
                  </div>

                  {errors.detail && (
                    <p className="text-center text-xs text-red-500">{errors.detail}</p>
                  )}
                  {errors.email && (
                    <p className="text-center text-xs text-red-500">{errors.email}</p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#3B3DA6] py-3.5 text-sm font-bold uppercase tracking-[0.15em] text-white transition hover:bg-[#2B2D8A] disabled:opacity-60"
                  >
                    {loading ? "Resetting..." : "Reset Password"}
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
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
