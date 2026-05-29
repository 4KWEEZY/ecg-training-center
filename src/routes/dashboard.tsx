import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  BookOpen,
  TrendingUp,
  Calendar as CalendarIcon,
  Bell,
  Clock,
  ChevronLeft,
  ChevronRight,
  User,
  LogOut, // ✅ ADDED
} from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());

  // ✅ USER FROM STORAGE
  const storedUser = localStorage.getItem("user");

  const user = storedUser
    ? JSON.parse(storedUser)
    : {
        name: "Guest",
        role: "User",
        cohort: "N/A",
      };

  const navItems = [
    { label: "Overview", to: "/dashboard", icon: BookOpen },
    { label: "My Courses", to: "/courses", icon: BookOpen },
    { label: "My Progress", to: "/progress", icon: TrendingUp },
  ];

  const changeMonth = (direction: number) => {
    setCurrentDate(
      new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + direction,
        1
      )
    );
  };

  const getDaysInMonth = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

  const daysArray = Array.from(
    { length: getDaysInMonth(currentDate) },
    (_, i) => i + 1
  );

  // 🔥 LOGOUT FUNCTION
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    navigate({ to: "/login" });
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside
        className="w-72 shrink-0 p-8 text-white flex flex-col justify-between"
        style={{
          background:
            "linear-gradient(180deg, rgba(26, 28, 92, 0.95) 0%, rgba(59, 61, 166, 0.8) 100%)",
        }}
      >
        {/* NAV ITEMS */}
        <div>
          <h2 className="text-2xl font-bold mb-10">Dashboard</h2>

          <div className="space-y-4">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => navigate({ to: item.to })}
                className="w-full flex items-center gap-4 p-5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/20 transition-all text-white font-medium"
              >
                <item.icon size={24} /> {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* 🔥 LOGOUT BUTTON */}
        <button
          onClick={handleLogout}
          className="mt-10 flex items-center justify-center gap-2 rounded-xl bg-red-500/20 border border-red-400/30 px-4 py-3 text-sm font-bold text-red-200 hover:bg-red-500/30 transition"
        >
          <LogOut size={18} />
          Logout
        </button>
      </aside>

      <main className="flex-1 p-10">
        {/* Profile Banner */}
        <div
          className="rounded-2xl p-10 text-white mb-10 shadow-xl flex justify-between items-center"
          style={{
            background:
              "linear-gradient(90deg, rgba(26, 28, 92, 0.95) 0%, rgba(59, 61, 166, 0.8) 100%)",
          }}
        >
          <div>
            <h1 className="text-4xl font-bold mb-2">
              <span className="text-white">Welcome Back, </span>
              <span className="text-yellow-400">{user.name}</span>
            </h1>

            <p className="text-indigo-100">
              Cohort {user.cohort} | {user.role}
            </p>
          </div>

          {/* Profile Card */}
          <div className="flex items-center gap-4 bg-white/10 px-4 py-3 rounded-2xl backdrop-blur-md border border-white/20">
            <div className="w-12 h-12 rounded-full bg-yellow-400 text-[#1a1c5c] flex items-center justify-center font-bold text-lg">
              {user.name?.charAt(0)?.toUpperCase()}
            </div>

            <div className="text-left">
              <p className="font-semibold text-white leading-4">
                {user.name}
              </p>
              <p className="text-xs text-indigo-100">{user.role}</p>
            </div>

            <User size={18} className="text-white/80" />
          </div>
        </div>

        {/* Rest stays unchanged */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-2 gap-6">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => navigate({ to: item.to })}
                  className="border-2 border-indigo-100 bg-white p-8 rounded-2xl shadow-sm hover:border-indigo-600 transition-all text-left"
                >
                  <item.icon size={40} className="text-[#1a1c5c] mb-4" />
                  <h3 className="text-xl font-bold text-slate-900">
                    {item.label}
                  </h3>
                </button>
              ))}
            </div>

            <div className="bg-white p-8 rounded-2xl border-2 border-indigo-100 shadow-sm">
              <h3 className="font-bold text-xl text-[#1a1c5c] mb-6 flex items-center gap-2">
                <Bell /> Institutional Announcements
              </h3>

              <div className="p-4 bg-slate-50 rounded-xl border-l-4 border-amber-500">
                <p className="font-bold text-sm text-amber-700">URGENT</p>
                <p className="text-slate-800">
                  Mandatory Safety Assessment Deadline: Friday Midnight.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white border-2 border-indigo-100 rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <CalendarIcon />
                  {currentDate.toLocaleString("default", {
                    month: "long",
                    year: "numeric",
                  })}
                </h3>

                <div className="flex gap-2">
                  <button onClick={() => changeMonth(-1)}>
                    <ChevronLeft size={20} />
                  </button>
                  <button onClick={() => changeMonth(1)}>
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-2 text-center text-xs">
                {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
                  <div key={d} className="font-bold text-slate-400">
                    {d}
                  </div>
                ))}

                {daysArray.map((d) => (
                  <div
                    key={d}
                    className={`p-2 rounded ${
                      d === 29 && currentDate.getMonth() === 4
                        ? "bg-[#1a1c5c] text-white"
                        : ""
                    }`}
                  >
                    {d}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border-2 border-indigo-100 rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Clock /> Upcoming Sessions
              </h3>

              <p className="text-sm font-bold text-slate-700">
                Practical Transformer Workshop
              </p>
              <p className="text-xs text-slate-500">
                09:00 GMT · Lab Block B
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}