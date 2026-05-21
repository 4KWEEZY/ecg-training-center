import { createLazyFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { UserPlus, ArrowRight, Mail, Lock, User, Phone } from "lucide-react";
import logo from "@/assets/ecg-logo.png";
import heroImg from "@/assets/utility-workers.jpg";
import { useState } from "react";
import axios from "axios";

export const Route = createLazyFileRoute("/register")({
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    phone_number: "",
    password: "",
    confirm_password: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/register/", formData);

      const { access, refresh, user } = response.data;

      // Store tokens and user
      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);
      localStorage.setItem("user", JSON.stringify(user));

      // Redirect to dashboard
      navigate({ to: "/dashboard" });
    } catch (error: any) {
      if (error.response?.data) {
        const djangoErrors = error.response.data;
        const formatted: Record<string, string> = {};
        Object.keys(djangoErrors).forEach((key) => {
          formatted[key] = Array.isArray(djangoErrors[key])
            ? djangoErrors[key][0]
            : djangoErrors[key];
        });
        setErrors(formatted);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#F4F5FB]">
      {/* ── Left panel ── */}
      <div className="absolute inset-y-0 left-0 hidden w-1/2 lg:block">
        <img src={heroImg} alt="ECG Training" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A1C5C]/95 via-[#3B3DA6]/85 to-[#2B2D8A]/90" />
        <div className="absolute inset-0 flex flex-col justify-between p-12">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 p-1.5 ring-1 ring-white/20">
              <img src={logo} alt="ECG logo" className="h-9 w-9 object-contain" />
            </div>
            <div>
              <div className="font-display text-base font-bold uppercase tracking-[0.12em] text-white">
                ECG <span className="text-[#FFD700]">Training Center</span>
              </div>
            </div>
          </div>
          <h1 className="font-display text-5xl font-light uppercase text-white">
            Join The <br />
            <span className="font-bold text-[#FFD700]">ECG Academy</span>
          </h1>
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/30">
            © 2026 Electricity Company of Ghana
          </p>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="flex min-h-screen items-center justify-center px-6 py-12 lg:ml-[50%]">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-[#DDDDF0] bg-white p-8 shadow-[0_8px_40px_rgba(59,61,166,0.12)] md:p-10">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#3B3DA6]">
                <UserPlus className="h-7 w-7 text-white" />
              </div>
              <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-[#1A1C5C]">
                Create Account
              </h2>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-[0.15em] text-[#3B3DA6]">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#AAAAC8]" />
                  <input
                    required
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-[#DDDDF0] bg-[#F4F5FB] py-3 pl-11 pr-4 text-sm text-[#1A1C5C] outline-none focus:border-[#3B3DA6]"
                  />
                </div>
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
              </div>

              {/* Username */}
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-[0.15em] text-[#3B3DA6]">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#AAAAC8]" />
                  <input
                    required
                    name="username"
                    type="text"
                    placeholder="johndoe123"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-[#DDDDF0] bg-[#F4F5FB] py-3 pl-11 pr-4 text-sm text-[#1A1C5C] outline-none focus:border-[#3B3DA6]"
                  />
                </div>
                {errors.username && <p className="mt-1 text-xs text-red-500">{errors.username}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-[0.15em] text-[#3B3DA6]">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#AAAAC8]" />
                  <input
                    required
                    name="email"
                    type="email"
                    placeholder="you@ecggh.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-[#DDDDF0] bg-[#F4F5FB] py-3 pl-11 pr-4 text-sm text-[#1A1C5C] outline-none focus:border-[#3B3DA6]"
                  />
                </div>
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
              </div>

              {/* Phone Number */}
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-[0.15em] text-[#3B3DA6]">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#AAAAC8]" />
                  <input
                    required
                    name="phone_number"
                    type="text"
                    placeholder="024XXXXXXX"
                    value={formData.phone_number}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-[#DDDDF0] bg-[#F4F5FB] py-3 pl-11 pr-4 text-sm text-[#1A1C5C] outline-none focus:border-[#3B3DA6]"
                  />
                </div>
                {errors.phone_number && (
                  <p className="mt-1 text-xs text-red-500">{errors.phone_number}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-[0.15em] text-[#3B3DA6]">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#AAAAC8]" />
                  <input
                    required
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-[#DDDDF0] bg-[#F4F5FB] py-3 pl-11 pr-4 text-sm text-[#1A1C5C] outline-none focus:border-[#3B3DA6]"
                  />
                </div>
                {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-[0.15em] text-[#3B3DA6]">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#AAAAC8]" />
                  <input
                    required
                    name="confirm_password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirm_password}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-[#DDDDF0] bg-[#F4F5FB] py-3 pl-11 pr-4 text-sm text-[#1A1C5C] outline-none focus:border-[#3B3DA6]"
                  />
                </div>
                {errors.confirm_password && (
                  <p className="mt-1 text-xs text-red-500">{errors.confirm_password}</p>
                )}
              </div>

              {/* General non field errors */}
              {errors.non_field_errors && (
                <p className="text-center text-xs text-red-500">{errors.non_field_errors}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-[#3B3DA6] py-3.5 text-sm font-bold uppercase tracking-[0.15em] text-white transition hover:bg-[#2B2D8A] disabled:opacity-60"
              >
                {loading ? (
                  "Creating Account..."
                ) : (
                  <>
                    Create Account <ArrowRight className="inline h-4 w-4 ml-2" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center border-t pt-6">
              <p className="text-sm text-[#8B8DAE]">Already have an account?</p>
              <Link to="/login" className="font-bold text-[#3B3DA6] hover:underline">
                Sign In instead
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
