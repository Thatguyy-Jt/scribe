"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { formatNgn, getMonthlyNgnWhole } from "@/lib/pricing";

const monthlyNgnLabel = formatNgn(getMonthlyNgnWhole());

const faqs = [
  {
    question: "What is Scribe AI?",
    answer: "Scribe AI is a smart documentation editor that combines a clean, distraction-free writing environment with powerful AI assistance. It allows you to build standard operating procedures, tutorials, and manuals by automatically analyzing your attached knowledge base."
  },
  {
    question: "Is my data used to train the AI?",
    answer: "No. We take data security very seriously. Your documents and knowledge base are never used to train our AI models, and any data processed by our AI partners is deleted within 30 days. We use strict encryption to keep your data private."
  },
  {
    question: "How is Scribe different from Google Docs or Notion?",
    answer: "While Google Docs and Notion are general-purpose tools, Scribe is purpose-built for creating structured guides and SOPs. Our AI doesn't just autocomplete text—it references your specific company knowledge (which you attach to the sidebar) to ensure high-accuracy, context-aware writing assistance."
  },
  {
    question: "Can I export my documents?",
    answer: "Yes, you can easily export your Scribe documents to standard formats like PDF and Markdown to share with team members or clients who don't have a Scribe account."
  },
  {
    question: "How does the free trial and billing work?",
    answer: `You get full access to Scribe for three days at no charge. After the trial, you pay ${monthlyNgnLabel} per month in Nigerian naira through Paystack. You can create unlimited documents and use unrestricted AI assistance while your account is active.`,
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="relative py-16 sm:py-24 z-10 border-t border-border">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">
            Frequently asked questions
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg">
            Everything you need to know about the product and billing.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className={`rounded-2xl border ${openIndex === index ? 'border-blue-500/30 bg-[#1a2035]/50' : 'border-border bg-card'} transition-colors overflow-hidden`}
            >
              <button
                onClick={() => toggleFaq(index)}
                className="flex w-full items-center justify-between p-4 sm:p-6 text-left gap-4"
              >
                <span className="text-sm sm:text-base font-semibold text-white">
                  {faq.question}
                </span>
                <ChevronDown 
                  className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${openIndex === index ? 'rotate-180 text-blue-400' : ''}`}
                />
              </button>
              
              <div 
                className={`grid transition-all duration-300 ease-in-out ${
                  openIndex === index ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                }`}
              >
                <div className="overflow-hidden">
                  <p className="px-4 pb-4 sm:p-6 sm:pt-0 text-muted-foreground text-sm leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}