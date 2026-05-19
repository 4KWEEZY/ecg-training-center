import { createFileRoute } from '@tanstack/react-router'
import { Award, Download, Lock, CheckCircle2, Calendar, ShieldCheck } from 'lucide-react'

export const Route = createFileRoute('/certificates')({
  component: Certificates,
})

const mockupCertificates = [
  {
    id: "cert-01",
    title: "Workplace Safety & Compliance Certification",
    status: "Issued",
    issueDate: "May 2026",
    credentialId: "ECG-SAF-2026-8849",
    authority: "ECG Training Academy Safety Council",
    isLocked: false
  },
  {
    id: "cert-02",
    title: "Distribution Operations & Grid Infrastructure",
    status: "Locked",
    issueDate: null,
    credentialId: null,
    authority: "ECG Engineering Operations Directorate",
    isLocked: true,
    requirement: "Requires passing score on Distribution Operations 101 end-of-module quiz."
  },
  {
    id: "cert-03",
    title: "Integrated Smart Metering & Customer Service Charter",
    status: "Locked",
    issueDate: null,
    credentialId: null,
    authority: "ECG Commercial Services Training Division",
    isLocked: true,
    requirement: "Requires completion of Customer Service and Metering tracks."
  }
]

function Certificates() {
  const handleDownloadCertificate = (title: string) => {
    alert(`Generating secure PDF download token for: "${title}"...`);
  }

  return (
    <div className="min-h-screen bg-brand-dark text-white p-8 pt-28">
      <main className="mx-auto max-w-5xl space-y-8">
        
        {/* Top Header Grid Area */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <h1 className="font-display text-4xl font-light uppercase tracking-wide text-white">
              Training <span className="text-yellow">Certificates</span>
            </h1>
            <p className="mt-1 text-sm text-white/70">
              Review your earned milestones and monitor completion tracking criteria for upcoming certifications.
            </p>
          </div>
          
          <div className="flex items-center gap-3 bg-brand-deep border border-white/10 px-4 py-3 rounded-xl shrink-0">
            <Award className="h-6 w-6 text-yellow animate-pulse" />
            <div>
              <div className="text-sm font-bold">1 Milestone</div>
              <div className="text-[10px] text-white/50 uppercase tracking-wider">Earned So Far</div>
            </div>
          </div>
        </div>

        {/* Certificates Dynamic Catalog Layout */}
        <div className="space-y-4">
          {mockupCertificates.map((cert) => (
            <div 
              key={cert.id}
              className={`border p-6 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all ${
                cert.isLocked 
                  ? "bg-black/10 border-white/5 opacity-60" 
                  : "bg-brand-deep border-white/10 hover:border-yellow/20"
              }`}
            >
              {/* Info Frame Block */}
              <div className="flex items-start gap-4">
                <div className={`p-4 rounded-lg shrink-0 mt-0.5 ${
                  cert.isLocked ? "bg-white/5 text-white/30" : "bg-yellow/10 text-yellow"
                }`}>
                  {cert.isLocked ? <Lock className="h-6 w-6" /> : <Award className="h-6 w-6" />}
                </div>

                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm ${
                      cert.isLocked ? "bg-white/5 text-white/50" : "bg-green-500/20 text-green-400 border border-green-500/10"
                    }`}>
                      {cert.status}
                    </span>
                    <span className="text-xs text-white/40">{cert.authority}</span>
                  </div>

                  <h3 className={`text-lg font-semibold ${cert.isLocked ? "text-white/60" : "text-white"}`}>
                    {cert.title}
                  </h3>

                  {/* Conditional Render Elements Based On Locked Status */}
                  {cert.isLocked ? (
                    <p className="text-xs text-yellow/70 italic flex items-center gap-1">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-yellow" /> {cert.requirement}
                    </p>
                  ) : (
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white/60 pt-0.5">
                      <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5 text-yellow" /> Issued: {cert.issueDate}</span>
                      <span className="flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5 text-yellow" /> ID: {cert.credentialId}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Button Section */}
              <div className="shrink-0 flex items-center md:justify-end border-t md:border-t-0 border-white/5 pt-4 md:pt-0">
                {cert.isLocked ? (
                  <span className="text-xs font-bold uppercase tracking-widest text-white/30 border border-white/5 px-4 py-2 rounded-sm cursor-not-allowed bg-white/[0.01]">
                    Locked
                  </span>
                ) : (
                  <button
                    onClick={() => handleDownloadCertificate(cert.title)}
                    className="w-full md:w-auto inline-flex items-center justify-center gap-2 rounded-sm bg-yellow px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-brand-dark transition hover:brightness-110 focus:outline-none"
                  >
                    Download PDF <Download className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

            </div>
          ))}
        </div>

      </main>
    </div>
  )
}