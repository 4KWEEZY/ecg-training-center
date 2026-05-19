import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/landing/TopBar";
import { Nav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/Hero";
import { StatusTicker } from "@/components/landing/StatusTicker";
import { CallCentre } from "@/components/landing/CallCentre";
import { Services } from "@/components/landing/Services";
import { News } from "@/components/landing/News";
import { Footer } from "@/components/landing/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ECG Training Center — Trainee Portal" },
      { name: "description", content: "The official Electricity Company of Ghana training platform: course materials, training videos and quizzes to guide every new staff member through their professional development." },
      { property: "og:title", content: "ECG Training Center — Trainee Portal" },
      { property: "og:description", content: "Course materials, training videos and quizzes for new ECG staff." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-brand text-white">
      <TopBar />
      <Nav />
      <main>
        <Hero />
        <StatusTicker />
        <CallCentre />
        <Services />
        <News />
      </main>
      <Footer />
    </div>
  );
}
