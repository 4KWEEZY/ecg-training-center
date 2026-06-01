import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Edit2,
  Save,
  X,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";

export const Route = createLazyFileRoute("/profile")({
  component: ProfilePage,
});

interface UserProfile {
  id: number;
  name: string;
  username: string;
  email: string;
  phone_number: string;
  date_joined: string;
  is_active: boolean;
}

function ProfilePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone_number: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const token = localStorage.getItem("access_token");

  // Fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/profile/",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProfile(response.data);
        setFormData({
          name: response.data.name,
          phone_number: response.data.phone_number,
        });
      } catch (err) {
        console.error("Failed to fetch profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSave = async () => {
    setSaving(true);
    setErrors({});
    try {
      const response = await axios.patch(
        "http://127.0.0.1:8000/api/profile/",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProfile({ ...profile!, ...response.data });
      // Update localStorage
      const stored = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem("user", JSON.stringify({ ...stored, ...response.data }));
      setEditing(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
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
      }
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setFormData({
      name: profile?.name || "",
      phone_number: profile?.phone_number || "",
    });
    setErrors({});
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const initials = (profile?.name || profile?.username || "?")
    .slice(0, 2)
    .toUpperCase();

  if (loading) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        style={{ fontFamily: "'Inter', sans-serif", background: "#f0f2fb" }}
      >
        <div className="text-[14px] text-[#8B8DAE]">Loading profile...</div>
      </div>
    );
  }

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <div
        className="min-h-screen p-6"
        style={{ background: "#f0f2fb", fontFamily: "'Inter', sans-serif" }}
      >
        <div className="mx-auto max-w-2xl">

          {/* Back button */}
          <button
            onClick={() => navigate({ to: "/dashboard" })}
            className="mb-6 flex items-center gap-2 text-[13px] font-medium text-[#8B8DAE] transition hover:text-[#3B3DA6]"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </button>

          {/* Success message */}
          {success && (
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-[#C0DD97] bg-[#EAF3DE] px-4 py-3">
              <CheckCircle2 className="h-4 w-4 text-[#3B6D11]" />
              <span className="text-[13px] font-medium text-[#3B6D11]">
                Profile updated successfully.
              </span>
            </div>
          )}

          {/* Profile card */}
          <div className="rounded-2xl border border-[#DDDDF0] bg-white shadow-sm">

            {/* Header */}
            <div
              className="relative overflow-hidden rounded-t-2xl p-6"
              style={{ background: "linear-gradient(135deg, #2B2D8A 0%, #3B3DA6 60%, #4E50C4 100%)" }}
            >
              <div className="pointer-events-none absolute -right-4 -top-4 h-32 w-32 rounded-full bg-white/5" />
              <div className="pointer-events-none absolute bottom-0 right-16 h-24 w-24 rounded-full bg-white/5" />
              <div className="relative flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 text-xl font-bold text-white ring-2 ring-white/20">
                  {initials}
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">
                    {profile?.name || profile?.username}
                  </h1>
                  <p className="text-[13px] text-white/60">@{profile?.username}</p>
                  <span className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium ${profile?.is_active ? "bg-[#EAF3DE] text-[#3B6D11]" : "bg-[#FCEBEB] text-[#A32D2D]"}`}>
                    {profile?.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-6">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-[15px] font-semibold text-[#1A1C5C]">
                  Profile Information
                </h2>
                {!editing ? (
                  <button
                    onClick={() => setEditing(true)}
                    className="flex items-center gap-2 rounded-lg border border-[#DDDDF0] bg-[#F4F5FB] px-3 py-2 text-[12px] font-medium text-[#3B3DA6] transition hover:bg-[#EAEBF6]"
                  >
                    <Edit2 className="h-3.5 w-3.5" /> Edit Profile
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCancel}
                      className="flex items-center gap-1.5 rounded-lg border border-[#DDDDF0] bg-[#F4F5FB] px-3 py-2 text-[12px] font-medium text-[#8B8DAE] transition hover:bg-[#EAEBF6]"
                    >
                      <X className="h-3.5 w-3.5" /> Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex items-center gap-1.5 rounded-lg bg-[#3B3DA6] px-3 py-2 text-[12px] font-medium text-white transition hover:bg-[#2B2D8A] disabled:opacity-60"
                    >
                      <Save className="h-3.5 w-3.5" />
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-4">

                {/* Name */}
                <div className="rounded-xl border border-[#EAEBF6] bg-[#F4F5FB] p-4">
                  <div className="mb-1 flex items-center gap-2">
                    <User className="h-3.5 w-3.5 text-[#3B3DA6]" />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#AAAAC8]">
                      Full Name
                    </span>
                  </div>
                  {editing ? (
                    <div>
                      <input
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-[#DDDDF0] bg-white px-3 py-2 text-[13px] text-[#1A1C5C] outline-none focus:border-[#3B3DA6]"
                      />
                      {errors.name && (
                        <p className="mt-1 text-[11px] text-red-500">{errors.name}</p>
                      )}
                    </div>
                  ) : (
                    <p className="text-[14px] font-medium text-[#1A1C5C]">
                      {profile?.name || "—"}
                    </p>
                  )}
                </div>

                {/* Username — read only */}
                <div className="rounded-xl border border-[#EAEBF6] bg-[#F4F5FB] p-4">
                  <div className="mb-1 flex items-center gap-2">
                    <User className="h-3.5 w-3.5 text-[#3B3DA6]" />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#AAAAC8]">
                      Username
                    </span>
                    <span className="rounded-full bg-[#EAEBF6] px-2 py-0.5 text-[9px] text-[#8B8DAE]">
                      Cannot be changed
                    </span>
                  </div>
                  <p className="text-[14px] font-medium text-[#1A1C5C]">
                    @{profile?.username}
                  </p>
                </div>

                {/* Email — read only */}
                <div className="rounded-xl border border-[#EAEBF6] bg-[#F4F5FB] p-4">
                  <div className="mb-1 flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-[#3B3DA6]" />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#AAAAC8]">
                      Email Address
                    </span>
                    <span className="rounded-full bg-[#EAEBF6] px-2 py-0.5 text-[9px] text-[#8B8DAE]">
                      Cannot be changed
                    </span>
                  </div>
                  <p className="text-[14px] font-medium text-[#1A1C5C]">
                    {profile?.email}
                  </p>
                </div>

                {/* Phone */}
                <div className="rounded-xl border border-[#EAEBF6] bg-[#F4F5FB] p-4">
                  <div className="mb-1 flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-[#3B3DA6]" />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#AAAAC8]">
                      Phone Number
                    </span>
                  </div>
                  {editing ? (
                    <div>
                      <input
                        name="phone_number"
                        type="text"
                        value={formData.phone_number}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-[#DDDDF0] bg-white px-3 py-2 text-[13px] text-[#1A1C5C] outline-none focus:border-[#3B3DA6]"
                      />
                      {errors.phone_number && (
                        <p className="mt-1 text-[11px] text-red-500">{errors.phone_number}</p>
                      )}
                    </div>
                  ) : (
                    <p className="text-[14px] font-medium text-[#1A1C5C]">
                      {profile?.phone_number || "—"}
                    </p>
                  )}
                </div>

                {/* Date joined — read only */}
                <div className="rounded-xl border border-[#EAEBF6] bg-[#F4F5FB] p-4">
                  <div className="mb-1 flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-[#3B3DA6]" />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#AAAAC8]">
                      Member Since
                    </span>
                  </div>
                  <p className="text-[14px] font-medium text-[#1A1C5C]">
                    {profile?.date_joined ? formatDate(profile.date_joined) : "—"}
                  </p>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}