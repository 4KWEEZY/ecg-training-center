import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { FileText, Download, CheckCircle2, Search, Briefcase, ShieldCheck, FileSpreadsheet } from 'lucide-react'

export const Route = createFileRoute('/documents')({
  component: Documents,
})

const officialDocs = [
  {
    id: "doc-1",
    title: "ECG Trainee Service Charter & Conditions of Service",
    category: "HR & Policy",
    description: "Core structural guidelines outlining staff expectations, code of conduct, training benchmarks, and employment frames for the 2026 cohort.",
    updatedAt: "May 2026",
    icon: Briefcase
  },
  {
    id: "doc-2",
    title: "National Operational Safety Policy Handbook",
    category: "Safety & Compliance",
    description: "The mandatory grid protocol manual covering workplace hazard declarations, emergency insulation systems, and field protection routines.",
    updatedAt: "April 2026",
    icon: ShieldCheck
  },
  {
    id: "doc-3",
    title: "Orientation Evaluation Milestone Matrix",
    category: "Curriculum",
    description: "Spreadsheet breakdown of the 6-week module structure, showing lesson sequences, quiz weight distributions, and certificate thresholds.",
    updatedAt: "May 2026",
    icon: FileSpreadsheet
  }
]

function Documents() {
  const [searchTerm, setSearchTerm] = useState('')
  const [downloadedIds, setDownloadedIds] = useState<string[]>([])

  const handleDownload = (id: string, title: string) => {
    alert(`Downloading: "${title}" (Simulated Frontend Action)`);
    if (!downloadedIds.includes(id)) {
      setDownloadedIds([...downloadedIds, id]);
    }
  }

  const filteredDocs = officialDocs.filter(doc => 
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-brand-dark text-white p-8 pt-28">
      <main className="mx-auto max-w-5xl space-y-8">
        
        {/* Page Title Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <h1 className="font-display text-4xl font-light uppercase tracking-wide text-white">
              Official <span className="text-yellow">Documents</span>
            </h1>
            <p className="mt-1 text-sm text-white/70">
              Review and sign off on mandatory corporate documents, policy files, and legal frameworks.
            </p>
          </div>

          {/* Real-time frontend filter field */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="Filter onboarding files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-md border border-white/10 bg-brand-deep py-2 pl-10 pr-4 text-sm text-white outline-none transition focus:border-yellow"
            />
          </div>
        </div>

        {/* Dynamic Documents List Layout */}
        <div className="space-y-4">
          {filteredDocs.length > 0 ? (
            filteredDocs.map((doc) => {
              const Icon = doc.icon;
              const isDownloaded = downloadedIds.includes(doc.id);

              return (
                <div 
                  key={doc.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between border border-white/10 bg-brand-deep p-6 rounded-xl gap-4 transition hover:bg-brand/40"
                >
                  <div className="flex items-start gap-4 max-w-3xl">
                    <div className="p-3 rounded-lg bg-yellow/10 text-yellow shrink-0 mt-0.5">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-white/10 text-white/80 px-2 py-0.5 rounded-sm">
                          {doc.category}
                        </span>
                        <span className="text-xs text-white/40">Updated {doc.updatedAt}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-white mt-1.5">{doc.title}</h3>
                      <p className="text-sm text-white/70 mt-1 leading-relaxed">{doc.description}</p>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 border-white/5 pt-4 sm:pt-0 shrink-0 gap-2">
                    {isDownloaded ? (
                      <span className="inline-flex items-center gap-1.5 text-xs text-green-400 bg-green-500/10 px-3 py-1.5 rounded-sm font-semibold uppercase tracking-wider">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Reviewed
                      </span>
                    ) : (
                      <button 
                        onClick={() => handleDownload(doc.id, doc.title)}
                        className="inline-flex items-center gap-2 rounded-sm bg-yellow px-4 py-2 text-xs font-bold uppercase tracking-wider text-brand-dark transition hover:brightness-110 focus:outline-none w-full sm:w-auto justify-center"
                      >
                        Access File <Download className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              )
            })
          ) : (
            <div className="text-center py-12 border border-dashed border-white/10 rounded-xl bg-white/[0.01]">
              <FileText className="h-12 w-12 text-white/20 mx-auto mb-3" />
              <p className="text-sm text-white/50">No files found matching "{searchTerm}"</p>
            </div>
          )}
        </div>

      </main>
    </div>
  )
}