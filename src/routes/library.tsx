import { createFileRoute } from "@tanstack/react-router";
import { requireAuth } from "../lib/auth";
import { withAuth } from "../components/ProtectedPage";
import { useState } from "react";
import { Play, Video, Clock, Eye, ShieldCheck, Search } from "lucide-react";

export const Route = createFileRoute("/library")({
  beforeLoad: requireAuth,
  component: withAuth(Library),
});

const videoCatalog = [
  {
    id: "vid-1",
    title: "High-Voltage Substation Isolation Best Practices",
    duration: "42:15",
    views: "340",
    category: "Safety",
    instructor: "Ing. Appiah-Kubi",
    thumbnailTag: "Feeder Control",
  },
  {
    id: "vid-2",
    title: "Vesting & Smart Meter Infrastructure Calibration",
    duration: "28:40",
    views: "185",
    category: "Commercial",
    instructor: "Madam E. Osei",
    thumbnailTag: "Prepaid Systems",
  },
  {
    id: "vid-3",
    title: "Emergency Network Fault Isolation Protocols",
    duration: "35:10",
    views: "298",
    category: "Operations",
    instructor: "Ing. F. Mensah",
    thumbnailTag: "Grid Restoration",
  },
  {
    id: "vid-4",
    title: "Customer Engagement Standards & Service Charter Review",
    duration: "18:25",
    views: "142",
    category: "Public Relations",
    instructor: "Mr. J. Boateng",
    thumbnailTag: "Frontline Metrics",
  },
];

function Library() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const filteredVideos =
    selectedCategory === "All"
      ? videoCatalog
      : videoCatalog.filter((v) => v.category === selectedCategory);

  return (
    <div className="min-h-screen bg-bg p-6 pt-32 lg:p-12">
      <main className="mx-auto max-w-6xl space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="font-display text-4xl font-bold uppercase tracking-wide text-brand-primary">
              Video <span className="text-brand-light">Library</span>
            </h1>
            <p className="mt-2 text-text-body max-w-lg">
              Access official technical demonstrations, operational walkthroughs, and safety
              training modules.
            </p>
          </div>

          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-accent-green bg-accent-green/10 border border-accent-green/20 px-4 py-2 rounded-full">
            <ShieldCheck className="h-4 w-4" /> Media Stream Active
          </div>
        </div>

        {/* Filter Nav */}
        <div className="flex flex-wrap items-center gap-2 pb-4">
          {["All", "Safety", "Operations", "Commercial", "Public Relations"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-lg px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.1em] transition-all ${
                selectedCategory === cat
                  ? "bg-brand-primary text-white shadow-card"
                  : "bg-white border border-border text-text-muted hover:border-brand-primary/30"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredVideos.map((video) => (
            <div
              key={video.id}
              className="group flex flex-col overflow-hidden rounded-xl border border-border bg-white shadow-card hover:shadow-card-hover transition-all duration-300"
            >
              {/* Thumbnail */}
              <div className="aspect-video w-full bg-bg-muted relative cursor-pointer overflow-hidden">
                <div className="absolute inset-0 bg-brand-primary/10 group-hover:bg-transparent transition-all" />
                <span className="absolute top-4 left-4 text-[10px] bg-white/90 backdrop-blur text-brand-primary px-3 py-1 rounded-full uppercase tracking-wider font-bold border border-border">
                  {video.thumbnailTag}
                </span>

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="p-4 rounded-full bg-white text-brand-primary scale-90 group-hover:scale-100 shadow-xl transition-transform duration-300">
                    <Play className="h-6 w-6 fill-brand-primary" />
                  </div>
                </div>

                <div className="absolute bottom-4 right-4 flex items-center gap-1.5 bg-brand-dark/80 backdrop-blur px-2.5 py-1 rounded-md text-[10px] font-bold text-white">
                  <Clock className="h-3 w-3 text-yellow" /> {video.duration}
                </div>
              </div>

              {/* Metadata */}
              <div className="p-6 flex flex-col flex-1">
                <span className="text-[10px] font-black text-brand-light uppercase tracking-[0.15em] mb-2">
                  {video.category} Division
                </span>
                <h3 className="text-lg font-bold leading-tight text-text-primary mb-3 group-hover:text-brand-primary transition-colors">
                  {video.title}
                </h3>
                <p className="text-xs text-text-muted mb-6">
                  Presented by:{" "}
                  <span className="font-semibold text-text-primary">{video.instructor}</span>
                </p>

                <div className="mt-auto flex items-center gap-4 text-[11px] font-bold uppercase tracking-wider text-text-muted border-t border-border pt-4">
                  <span className="flex items-center gap-1.5">
                    <Video className="h-3.5 w-3.5" /> HD Stream
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Eye className="h-3.5 w-3.5" /> {video.views} Watched
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
