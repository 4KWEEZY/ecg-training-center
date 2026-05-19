import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Play, Search, Video, Clock, Eye, Layers, ShieldCheck } from 'lucide-react'

export const Route = createFileRoute('/library')({
  component: Library,
})

const videoCatalog = [
  {
    id: "vid-1",
    title: "High-Voltage Substation Isolation Best Practices",
    duration: "42:15",
    views: "340",
    category: "Safety",
    instructor: "Ing. Appiah-Kubi",
    thumbnailTag: "Feeder Control"
  },
  {
    id: "vid-2",
    title: "Vesting & Smart Meter Infrastructure Calibration",
    duration: "28:40",
    views: "185",
    category: "Commercial",
    instructor: "Madam E. Osei",
    thumbnailTag: "Prepaid Systems"
  },
  {
    id: "vid-3",
    title: "Emergency Network Fault Isolation Protocols",
    duration: "35:10",
    views: "298",
    category: "Operations",
    instructor: "Ing. F. Mensah",
    thumbnailTag: "Grid Restoration"
  },
  {
    id: "vid-4",
    title: "Customer Engagement Standards & Service Charter Review",
    duration: "18:25",
    views: "142",
    category: "Public Relations",
    instructor: "Mr. J. Boateng",
    thumbnailTag: "Frontline Metrics"
  }
]

function Library() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All")

  const filteredVideos = selectedCategory === "All" 
    ? videoCatalog 
    : videoCatalog.filter(v => v.category === selectedCategory)

  const handlePlayVideo = (title: string) => {
    alert(`Streaming Media Node initialized for: "${title}"\n(Simulated Video Framework Player Ready)`);
  }

  return (
    <div className="min-h-screen bg-brand-dark text-white p-8 pt-28">
      <main className="mx-auto max-w-5xl space-y-8">
        
        {/* Header Block Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <h1 className="font-display text-4xl font-light uppercase tracking-wide text-white">
              Video <span className="text-yellow">Library</span>
            </h1>
            <p className="mt-1 text-sm text-white/70">
              Stream on-demand technical demonstrations, operations walkthroughs, and safety briefs.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-green-400 bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-sm">
            <ShieldCheck className="h-4 w-4" /> Media Stream Active
          </div>
        </div>

        {/* Dynamic Category Horizontal Filter Nav */}
        <div className="flex flex-wrap items-center gap-2 border-b border-white/5 pb-4">
          {["All", "Safety", "Operations", "Commercial", "Public Relations"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-4 py-1.5 text-xs font-medium uppercase tracking-wider transition focus:outline-none ${
                selectedCategory === cat 
                  ? "bg-yellow text-brand-dark font-bold" 
                  : "bg-white/5 border border-white/10 text-white/70 hover:border-white/30 hover:bg-white/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Video Catalog Responsive Grid Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredVideos.map((video) => (
            <div 
              key={video.id}
              className="group flex flex-col justify-between overflow-hidden rounded-xl border border-white/10 bg-brand-deep hover:border-yellow/30 transition-all"
            >
              {/* Pseudo Video Content Card Cover Frame */}
              <div 
                onClick={() => handlePlayVideo(video.title)}
                className="aspect-video w-full bg-black/40 border-b border-white/5 flex flex-col items-center justify-center relative cursor-pointer group-hover:bg-black/60 transition-all"
              >
                {/* Custom Label tag on Thumbnail corner */}
                <span className="absolute top-3 left-3 text-[10px] bg-brand-dark/80 text-white border border-white/10 px-2 py-0.5 rounded-sm uppercase tracking-wide font-medium">
                  {video.thumbnailTag}
                </span>

                {/* Floating center play bubble element layout */}
                <div className="p-4 rounded-full bg-yellow text-brand-dark scale-100 group-hover:scale-110 shadow-card transition-transform duration-300">
                  <Play className="h-5 w-5 fill-brand-dark translate-x-0.5" />
                </div>

                <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-black/70 px-2 py-1 rounded-md text-xs text-white/90">
                  <Clock className="h-3 w-3 text-yellow" /> {video.duration}
                </div>
              </div>

              {/* Text Description Block metadata details footer */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-yellow uppercase tracking-wider block">
                    {video.category} Module Division
                  </span>
                  <h3 className="text-base font-semibold leading-snug text-white group-hover:text-yellow transition-colors">
                    {video.title}
                  </h3>
                  <p className="text-xs text-white/50">
                    Presented by: <strong className="text-white/70 font-medium">{video.instructor}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-4 text-xs text-white/40 border-t border-white/5 pt-3">
                  <span className="flex items-center gap-1"><Video className="h-3.5 w-3.5" /> Stream HD</span>
                  <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" /> {video.views} trainees watched</span>
                </div>
              </div>

            </div>
          ))}
        </div>

      </main>
    </div>
  )
}