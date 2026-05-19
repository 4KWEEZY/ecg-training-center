import { createLazyFileRoute, Link, useNavigate } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/register")({
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate a successful frontend validation and registration save
    alert("Account created successfully! Welcome to the ECG Trainee Portal.");
    
    // Smoothly redirect to the login screen so they can authenticate
    navigate({ to: "/login" });
  };

  return (
    <div className="min-h-screen bg-brand text-white">
      <main className="mx-auto max-w-3xl px-6 py-28 sm:px-8">
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-[0_30px_80px_rgba(0,0,0,0.18)] backdrop-blur-md">
          <h1 className="text-3xl font-semibold text-white">Create a Trainee Account</h1>
          <p className="mt-2 text-sm text-white/70">Register now to access ECG training materials and quizzes.</p>

          <form onSubmit={handleRegisterSubmit} className="mt-10 space-y-6">
            <label className="block text-sm text-white/80">
              Full name
              <input
                required
                type="text"
                placeholder="Your full name"
                className="mt-2 w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-yellow"
              />
            </label>
            <label className="block text-sm text-white/80">
              Email address
              <input
                required
                type="email"
                placeholder="you@ecggh.com"
                className="mt-2 w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-yellow"
              />
            </label>
            <label className="block text-sm text-white/80">
              Password
              <input
                required
                type="password"
                placeholder="Choose a password"
                className="mt-2 w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-yellow"
              />
            </label>
            <button
              type="submit"
              className="w-full rounded-3xl bg-yellow px-6 py-3 text-sm font-semibold uppercase tracking-wider text-brand-dark transition hover:brightness-110"
            >
              Register
            </button>
          </form>

          <div className="mt-6 flex flex-col gap-3 text-sm text-white/70 sm:flex-row sm:items-center sm:justify-between">
            <span>Already have an account?</span>
            <Link
              to="/login"
              className="inline-flex rounded-3xl bg-white/10 px-4 py-2 text-sm text-white transition hover:bg-white/20"
            >
              Sign in instead
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}