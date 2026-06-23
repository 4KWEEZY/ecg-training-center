import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/community")({
  component: Community,
});

function Community() {
  return (
    <div className="min-h-screen bg-bg p-6 pt-32">
      <main className="mx-auto max-w-5xl space-y-6">
        <div className="rounded-3xl border border-[#DDDDF0] bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-[#1A1C5C]">Community Hub</h1>
          <p className="mt-3 text-sm text-[#6B7090]">
            This section is under construction. Coming soon: peer discussions, cohort chat, and group support spaces.
          </p>
        </div>
      </main>
    </div>
  );
}
