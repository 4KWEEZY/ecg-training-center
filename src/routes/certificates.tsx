import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Award, Download, Lock, CheckCircle2, Calendar, ShieldCheck, Search, SearchCheck, X } from 'lucide-react'

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
    requirement: "Requires passing score on Distribution Operations 101."
  },
  {
    id: "cert-03",
    title: "Integrated Smart Metering & Customer Service Charter",
    status: "Locked",
    issueDate: null,
    credentialId: null,
    authority: "ECG Commercial Services Training Division",
    isLocked: true,
    requirement: "Requires completion of Customer Service tracks."
  }
]

function Certificates() {
  const [verifyId, setVerifyId] = useState("")
  const [verificationResult, setVerificationResult] = useState<any | null>(null)
  const [hasSearched, setHasSearched] = useState(false)

  const handleVerifyLookup = (e: React.FormEvent) => {
    e.preventDefault()
    setHasSearched(true)
    const matched = mockupCertificates.find(c => c.credentialId === verifyId.trim())
    setVerificationResult(matched || null)
  }

  return (
    <div className="min-h-screen bg-bg p-6 pt-32 lg:p-12">
      <main className="mx-auto max-w-5xl space-y-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border pb-8">
          <div>
            <h1 className="font-display text-4xl font-bold uppercase tracking-wide text-brand-primary">
              Institutional <span className="text-brand-light">Certificates</span>
            </h1>
            <p className="mt-2 text-text-body">
              Review your earned engineering milestones and verify official credential hashes.
            </p>
          </div>
          
          <div className="flex items-center gap-4 bg-white border border-border px-6 py-4 rounded-xl shadow-sm">
            <Award className="h-8 w-8 text-brand-primary" />
            <div>
              <div className="text-sm font-black uppercase tracking-widest text-text-primary">1 Milestone</div>
              <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Earned Track Record</div>
            </div>
          </div>
        </div>

        {/* Verification Hub */}
        <div className="bg-white border border-border rounded-2xl p-8 shadow-sm">
          <h2 className="text-sm font-black uppercase tracking-[0.2em] text-brand-primary mb-2 flex items-center gap-3">
            <SearchCheck className="h-5 w-5" /> Public Verification Gateway
          </h2>
          <p className="text-xs text-text-muted mb-6 max-w-xl">
            Employers or system regulators can run immediate token compliance lookups on credential hashes below.
          </p>
          
          <form onSubmit={handleVerifyLookup} className="flex gap-4 max-w-2xl">
            <input 
              type="text"
              required
              placeholder="Enter Credential ID (e.g. ECG-SAF-2026-8849)"
              value={verifyId}
              onChange={(e) => setVerifyId(e.target.value)}
              className="flex-1 rounded-xl border border-border bg-bg-muted px-4 py-3 text-sm text-text-primary outline-none focus:border-brand-primary transition-all"
            />
            <button type="submit" className="bg-brand-primary text-white rounded-xl px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-brand-dark transition-all">
              Verify
            </button>
          </form>

          {hasSearched && (
            <div className="mt-6">
              {verificationResult ? (
                <div className="p-4 bg-accent-green/10 border border-accent-green/20 text-accent-green rounded-xl text-xs font-bold flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 shrink-0" />
                  Authentic Credential Verified: {verificationResult.title}
                </div>
              ) : (
                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-600 rounded-xl text-xs font-bold flex items-center gap-3">
                  <X className="h-5 w-5 shrink-0" />
                  Invalid Hash: No record matches that ID within our system.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Certificate List */}
        <div className="space-y-4">
          {mockupCertificates.map((cert) => (
            <div key={cert.id} className={`border rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all ${cert.isLocked ? "bg-bg-muted border-border" : "bg-white border-border shadow-sm"}`}>
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${cert.isLocked ? "bg-border text-text-muted" : "bg-brand-primary/10 text-brand-primary"}`}>
                  {cert.isLocked ? <Lock className="h-6 w-6" /> : <Award className="h-6 w-6" />}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded ${cert.isLocked ? "bg-border text-text-muted" : "bg-accent-green/10 text-accent-green"}`}>
                      {cert.status}
                    </span>
                    <span className="text-[10px] font-bold text-text-muted uppercase">{cert.authority}</span>
                  </div>
                  <h3 className={`text-lg font-bold ${cert.isLocked ? "text-text-muted" : "text-text-primary"}`}>{cert.title}</h3>
                  {cert.isLocked ? (
                    <p className="text-xs font-bold text-brand-primary mt-1 italic">{cert.requirement}</p>
                  ) : (
                    <div className="flex gap-4 mt-1 text-[10px] font-bold text-text-muted uppercase tracking-widest">
                      <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> {cert.issueDate}</span>
                      <span className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5" /> {cert.credentialId}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t md:border-t-0 border-border pt-4 md:pt-0">
                {!cert.isLocked && (
                  <button className="w-full md:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-brand-primary px-6 py-3 text-[11px] font-bold uppercase tracking-widest text-white hover:bg-brand-dark transition-all">
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