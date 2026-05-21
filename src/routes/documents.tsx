import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  FileText,
  Download,
  CheckCircle2,
  Search,
  Briefcase,
  ShieldCheck,
  FileSpreadsheet,
} from "lucide-react";

export const Route = createFileRoute("/documents")({
  component: Documents,
});

const officialDocs = [
  {
    id: "doc-1",
    title: "ECG Trainee Service Charter & Conditions of Service",
    category: "HR & Policy",
    description:
      "Core structural guidelines outlining staff expectations, code of conduct, training benchmarks, and employment frames for the 2026 cohort.",
    updatedAt: "May 2026",
    icon: Briefcase,
  },
  {
    id: "doc-2",
    title: "National Operational Safety Policy Handbook",
    category: "Safety & Compliance",
    description:
      "The mandatory grid protocol manual covering workplace hazard declarations, emergency insulation systems, and field protection routines.",
    updatedAt: "April 2026",
    icon: ShieldCheck,
  },
  {
    id: "doc-3",
    title: "Orientation Evaluation Milestone Matrix",
    category: "Curriculum",
    description:
      "Spreadsheet breakdown of the 6-week module structure, showing lesson sequences, quiz weight distributions, and certificate thresholds.",
    updatedAt: "May 2026",
    icon: FileSpreadsheet,
  },
];

function Documents() {
  const [searchTerm, setSearchTerm] = useState("");
  const [downloadedIds, setDownloadedIds] = useState<string[]>([]);

  const handleDownload = (id: string, title: string) => {
    alert(`Downloading: "${title}"`);
    if (!downloadedIds.includes(id)) {
      setDownloadedIds([...downloadedIds, id]);
    }
  };

  const filteredDocs = officialDocs.filter(
    (doc) =>
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.category.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-bg p-6 pt-32 lg:p-12">
      <main className="mx-auto max-w-5xl space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border pb-8">
          <div>
            <h1 className="font-display text-4xl font-bold uppercase tracking-wide text-brand-primary">
              Official <span className="text-brand-light">Documents</span>
            </h1>
            <p className="mt-2 text-text-body max-w-lg">
              Review and sign off on mandatory corporate documents, policy files, and legal
              frameworks.
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-border bg-white py-3 pl-11 pr-4 text-sm text-text-primary outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Document List */}
        <div className="space-y-4">
          {filteredDocs.length > 0 ? (
            filteredDocs.map((doc) => {
              const Icon = doc.icon;
              const isDownloaded = downloadedIds.includes(doc.id);

              return (
                <div
                  key={doc.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between border border-border bg-white p-6 rounded-xl gap-6 transition hover:shadow-card-hover"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-brand-primary/10 text-brand-primary shrink-0 mt-0.5">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="text-[9px] font-black uppercase tracking-[0.15em] bg-bg-muted text-brand-primary px-2 py-1 rounded">
                          {doc.category}
                        </span>
                        <span className="text-[10px] font-bold text-text-muted uppercase">
                          Updated {doc.updatedAt}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-text-primary">{doc.title}</h3>
                      <p className="text-sm text-text-body mt-1 leading-relaxed max-w-2xl">
                        {doc.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 border-border pt-4 sm:pt-0 shrink-0 gap-2">
                    {isDownloaded ? (
                      <span className="inline-flex items-center gap-1.5 text-[10px] text-accent-green bg-accent-green/10 px-4 py-2 rounded-lg font-bold uppercase tracking-widest">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Reviewed
                      </span>
                    ) : (
                      <button
                        onClick={() => handleDownload(doc.id, doc.title)}
                        className="inline-flex items-center gap-2 rounded-lg bg-brand-primary px-6 py-3 text-[11px] font-bold uppercase tracking-widest text-white transition hover:bg-brand-dark hover:shadow-lg w-full sm:w-auto justify-center"
                      >
                        Access File <Download className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-16 border border-dashed border-border rounded-2xl bg-bg-muted">
              <FileText className="h-10 w-10 text-text-muted mx-auto mb-3" />
              <p className="text-sm font-bold text-text-muted">
                No files found matching "{searchTerm}"
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
