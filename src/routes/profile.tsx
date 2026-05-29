import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const storedUser = localStorage.getItem("user");

  const user = storedUser
    ? JSON.parse(storedUser)
    : {
        name: "Guest",
        email: "",
        role: "User",
        cohort: "N/A",
      };

  return (
    <div className="min-h-screen bg-slate-50 p-10">
      <div className="max-w-xl bg-white p-8 rounded-2xl shadow-md border border-indigo-100">
        <h1 className="text-2xl font-bold text-[#1a1c5c] mb-6">
          User Profile
        </h1>

        <div className="space-y-3 text-slate-700">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
          <p><strong>Cohort:</strong> {user.cohort}</p>
        </div>
      </div>
    </div>
  );
}