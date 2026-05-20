import { createFileRoute } from '@tanstack/react-router'
import { Calendar, Clock, MapPin, CheckCircle2 } from 'lucide-react'

export const Route = createFileRoute('/schedule')({
  component: Schedule,
})

const scheduleItems = [
  {
    id: 1,
    title: "Substation Field Inspection",
    date: "May 22, 2026",
    time: "09:00 AM",
    location: "Achimota Main Substation",
    status: "Confirmed"
  },
  {
    id: 2,
    title: "Distribution Operations Seminar",
    date: "May 25, 2026",
    time: "02:00 PM",
    location: "Accra Training Academy - Hall B",
    status: "Upcoming"
  },
  {
    id: 3,
    title: "Safety Compliance Certification Exam",
    date: "May 28, 2026",
    time: "10:00 AM",
    location: "Virtual Testing Center",
    status: "Pending"
  }
]

function Schedule() {
  return (
    <div className="min-h-screen bg-bg p-6 pt-32 lg:p-12">
      <main className="mx-auto max-w-4xl space-y-12">
        
        {/* Header */}
        <div className="border-b border-border pb-8">
          <h1 className="font-display text-4xl font-bold uppercase tracking-wide text-brand-primary">
            Orientation <span className="text-brand-light">Schedule</span>
          </h1>
          <p className="mt-2 text-text-body">
            Stay on track with your upcoming field inspections, seminars, and certification deadlines.
          </p>
        </div>

        {/* Schedule List */}
        <div className="space-y-4">
          {scheduleItems.map((item) => (
            <div 
              key={item.id} 
              className="group flex flex-col md:flex-row md:items-center justify-between border border-border bg-white p-6 rounded-xl hover:shadow-card-hover transition-all"
            >
              <div className="flex gap-4">
                <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-bg-muted text-brand-primary w-20 h-20 shrink-0">
                  <span className="text-[10px] font-black uppercase tracking-widest">{item.date.split(' ')[0]}</span>
                  <span className="text-xl font-bold">{item.date.split(' ')[1].replace(',', '')}</span>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-text-primary group-hover:text-brand-primary transition-colors">
                    {item.title}
                  </h3>
                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-[11px] font-bold text-text-muted uppercase tracking-widest">
                    <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-brand-primary" /> {item.time}</span>
                    <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-brand-primary" /> {item.location}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-border md:border-l border-border md:pl-6 flex items-center justify-between md:justify-center">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded text-[9px] font-black uppercase tracking-widest ${
                  item.status === "Confirmed" ? "bg-accent-green/10 text-accent-green" : "bg-bg-muted text-text-muted"
                }`}>
                  {item.status === "Confirmed" && <CheckCircle2 className="h-3 w-3" />}
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}