import { createFileRoute } from "@tanstack/react-router";
import { requireAuth } from "../lib/auth";
import { withAuth } from "../components/ProtectedPage";
import { useState } from "react";
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ShieldAlert,
  Phone,
  Mail,
  FileText,
  Download,
} from "lucide-react";

export const Route = createFileRoute("/help")({
  beforeLoad: requireAuth,
  component: withAuth(Help),
});

const faqs = [
  {
    question: "How do I log field training hours for substation orientation?",
    answer:
      "Field hours are automatically logged once you complete the dynamic video modules and pass the associated end-of-module quiz. If your dashboard progress doesn't update immediately, try a hard refresh (Ctrl + F5).",
  },
  {
    question: "What is the passing score required for the module quizzes?",
    answer:
      "Every trainee must achieve a minimum score of 80% on all assessment tracks to unlock the formal certificate of orientation for their department.",
  },
  {
    question: "I am having issues streaming the high-definition training videos. What should I do?",
    answer:
      "Ensure your network settings allow media stream connections. If you are operating on a restricted system profile, check that your device's physical memory isn't throttled by background tasks.",
  },
];

function Help() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-bg p-6 pt-32 lg:p-12">
      <main className="mx-auto max-w-4xl space-y-12">
        {/* Header */}
        <div className="border-b border-border pb-8">
          <h1 className="font-display text-4xl font-bold uppercase tracking-wide text-brand-primary">
            Support & <span className="text-brand-light">Help Center</span>
          </h1>
          <p className="mt-3 text-text-body max-w-xl">
            Welcome to the official ECG orientation support workspace. Find instant answers or
            contact your coordinator.
          </p>
        </div>

        {/* FAQ Section */}
        <section className="space-y-6">
          <h2 className="text-sm font-black uppercase tracking-[0.2em] text-brand-primary flex items-center gap-3">
            <HelpCircle className="h-5 w-5" /> Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="rounded-xl border border-border bg-white shadow-sm overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-6 text-left font-bold transition hover:bg-bg-muted"
                >
                  <span className="text-text-primary text-sm md:text-base">{faq.question}</span>
                  {openIndex === index ? (
                    <ChevronUp className="text-brand-primary h-5 w-5 shrink-0 ml-4" />
                  ) : (
                    <ChevronDown className="text-text-muted h-5 w-5 shrink-0 ml-4" />
                  )}
                </button>

                {openIndex === index && (
                  <div className="px-6 pb-6 pt-0 text-sm text-text-body leading-relaxed border-t border-border bg-bg-muted/50">
                    <p className="pt-4">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Contact/Escalation Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-xl border border-border bg-white p-8 shadow-sm space-y-4">
            <h3 className="font-bold uppercase tracking-widest text-text-primary flex items-center gap-3">
              <ShieldAlert className="h-5 w-5 text-brand-primary" /> Coordinator Desk
            </h3>
            <p className="text-xs text-text-muted leading-relaxed">
              For issues regarding physical orientation placement, departmental tracks, or
              assignment evaluation.
            </p>
            <div className="space-y-3 pt-2 text-sm font-bold text-text-primary">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-brand-primary" /> +233 (0302) 611 611
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-brand-primary" /> academy@ecggh.com
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-white p-8 shadow-sm space-y-4">
            <h3 className="font-bold uppercase tracking-widest text-text-primary flex items-center gap-3">
              <FileText className="h-5 w-5 text-brand-primary" /> Portal Documentation
            </h3>
            <p className="text-xs text-text-muted leading-relaxed">
              Access structural setup blueprints, digital trainee profile instructions, or platform
              system requirements guidebooks.
            </p>
            <button className="mt-2 inline-flex items-center gap-2 rounded-lg bg-brand-primary px-6 py-3 text-[11px] font-bold uppercase tracking-widest text-white transition hover:bg-brand-dark">
              Download User Manual <Download className="h-3.5 w-3.5" />
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
