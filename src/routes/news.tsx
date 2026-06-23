import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/news")({
  component: News,
});

function News() {
  return (
    <div className="min-h-screen bg-bg p-6 pt-32">
      <main className="mx-auto max-w-5xl space-y-6">
        <div className="rounded-3xl border border-[#DDDDF0] bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-[#1A1C5C]">Latest News</h1>
          <p className="mt-3 text-sm text-[#6B7090]">
            This section is under construction. Check back soon for announcements, news, and updates from ECG Training.
          </p>
        </div>
      </main>
    </div>
  );
}
