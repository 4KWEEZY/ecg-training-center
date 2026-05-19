import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { HelpCircle, ChevronDown, ChevronUp, ShieldAlert, Phone, Mail, FileText } from 'lucide-react'

export const Route = createFileRoute('/help')({
  component: Help,
})

const faqs = [
  {
    question: "How do I log field training hours for substation orientation?",
    answer: "Field hours are automatically logged once you complete the dynamic video modules and pass the associated end-of-module quiz. If your dashboard progress doesn't update immediately, try a hard refresh (Ctrl + F5)."
  },
  {
    question: "What is the passing score required for the module quizzes?",
    answer: "Every trainee must achieve a minimum score of 80% on all assessment tracks to unlock the formal certificate of orientation for their department."
  },
  {
    question: "I am having issues streaming the high-definition training videos. What should I do?",
    answer: "Ensure your network settings allow media stream connections. If you are operating on a restricted system profile or standard Windows build, check that your device's physical memory isn't throttled by background tasks."
  }
]

function Help() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-brand-dark text-white p-8 pt-28">
      <main className="mx-auto max-w-4xl space-y-10">
        
        {/* Header Section */}
        <div>
          <h1 className="font-display text-4xl font-light uppercase tracking-wide text-white">
            Support & <span className="text-yellow">Help Center</span>
          </h1>
          <p className="mt-2 text-sm text-white/70">
            Welcome to the official ECG orientation support workspace. Find instant answers or contact your coordinator.
          </p>
        </div>

        <hr className="border-white/10" />

        {/* FAQ Section */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-wide text-yellow uppercase flex items-center gap-2">
            <HelpCircle className="h-5 w-5" /> Frequently Asked Questions
          </h2>
          
          <div className="space-y-3 mt-4">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="rounded-xl border border-white/10 bg-brand-deep overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-5 text-left font-medium hover:bg-white/5 transition focus:outline-none"
                >
                  <span className="text-white/90 text-sm md:text-base">{faq.question}</span>
                  {openIndex === index ? <ChevronUp className="text-yellow h-5 w-5 shrink-0 ml-4" /> : <ChevronDown className="text-white/50 h-5 w-5 shrink-0 ml-4" />}
                </button>
                
                {openIndex === index && (
                  <div className="px-5 pb-5 pt-1 text-sm text-white/70 border-t border-white/5 leading-relaxed bg-black/10">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Contact/Escalation Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Training Coordination Desk */}
          <div className="rounded-xl border border-white/10 bg-brand-deep p-6 space-y-4">
            <h3 className="text-lg font-semibold uppercase tracking-wide text-white flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-yellow" /> Training Coordinator Desk
            </h3>
            <p className="text-xs text-white/70 leading-relaxed">
              For issues regarding physical orientation placement, departmental tracks, or assignment evaluation.
            </p>
            <div className="space-y-2 pt-2 text-sm text-white/80">
              <div className="flex items-center gap-3"><Phone className="h-4 w-4 text-yellow" /> +233 (0302) 611 611</div>
              <div className="flex items-center gap-3"><Mail className="h-4 w-4 text-yellow" /> academy@ecggh.com</div>
            </div>
          </div>

          {/* Technical Documentation Support */}
          <div className="rounded-xl border border-white/10 bg-brand-deep p-6 space-y-4">
            <h3 className="text-lg font-semibold uppercase tracking-wide text-white flex items-center gap-2">
              <FileText className="h-5 w-5 text-yellow" /> Portal Documentation
            </h3>
            <p className="text-xs text-white/70 leading-relaxed">
              Access structural setup blueprints, digital trainee profile instructions, or platform system requirements guidebooks.
            </p>
            <button 
              onClick={() => alert("Downloading Trainee Portal Quickstart Blueprint Guide (PDF)...")}
              className="mt-2 inline-flex items-center gap-2 rounded-sm bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-white/20"
            >
              Download User Manual
            </button>
          </div>

        </section>

      </main>
    </div>
  )
}