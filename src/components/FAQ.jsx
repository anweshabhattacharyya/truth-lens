import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown, ChevronUp, ShieldAlert, Award, FileText, Phone, Settings } from 'lucide-react';
import { cn } from '../utils/cn';

const faqData = [
  {
    question: "How does Truth Lens verify news claims?",
    answer: "Truth Lens scans active global news databases, fact-checking registries (like Snopes), and reputable news outlets in real-time. It analyzes the content's tone, wording patterns, publishing indicators, and cross-references it with live search consensus to output an evidence-backed credibility stance.",
    icon: Award
  },
  {
    question: "What is the difference between Credible, Fake, and Uncertain predictions?",
    answer: "A 'Credible' rating means the claim has strong corroboration from reputable news outlets with standard journalistic tones. 'Fake' indicates active debunking by verified fact-checkers or dense emotional/manipulative writing patterns. 'Uncertain' is returned when live coverage is thin, mixed, or holds border-line consensus, urging user caution.",
    icon: ShieldAlert
  },
  {
    question: "What do the Confidence and Fake Probability scores represent?",
    answer: "The Confidence Score indicates the AI's structural certainty in its assessment (based on evidence strength and linguistic indicators). The Fake Probability Score represents the likelihood that the analyzed text is deliberate misinformation, calculated by analyzing opposing sources and emotional manipulation levels.",
    icon: FileText
  },
  {
    question: "How does the screenshot OCR reader work?",
    answer: "When you upload a news screenshot, Truth Lens runs client-side Optical Character Recognition (OCR) via Tesseract.js directly inside your browser. Your images are processed entirely locally and are never uploaded to any remote server, securing 100% data privacy.",
    icon: Settings
  },
  {
    question: "Can I use the Voice Speak input on any browser?",
    answer: "The voice typing system integrates the native Web Speech API supported in Google Chrome, Apple Safari, Microsoft Edge, and mobile browsers. Just click 'Speak', grant microphone permissions, and start talking to record your claim in real-time.",
    icon: Phone
  }
];

const FAQItem = ({ item, isOpen, onClick }) => {
  const IconComponent = item.icon;

  return (
    <div className="border-b border-slate-100 dark:border-slate-800 last:border-none">
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between py-5 text-left text-slate-800 dark:text-slate-200 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors font-semibold group cursor-pointer focus:outline-none"
      >
        <div className="flex items-center gap-3.5">
          <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80 text-cyan-500 shrink-0 group-hover:scale-105 transition-transform">
            <IconComponent size={16} />
          </div>
          <span className="text-sm md:text-md tracking-tight leading-snug">{item.question}</span>
        </div>
        <div className="text-slate-400 group-hover:text-cyan-500 transition-colors pl-4 shrink-0">
          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pb-5 pl-14 pr-4 text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-3xl">
              {item.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 bg-slate-50 dark:bg-slate-950/20 border-t border-slate-100 dark:border-slate-900/60 relative">
      {/* Dynamic Background Orbs */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 text-xs font-bold uppercase tracking-wider mb-3">
            <HelpCircle size={12} />
            <span>F.A.Q.</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-sm md:text-md text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            Learn more about Truth Lens diagnostic models, client-side scanning OCR modules, and real-time news indexing systems.
          </p>
        </div>

        {/* Accordion container */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden backdrop-blur-md">
          {faqData.map((faq, i) => (
            <FAQItem
              key={i}
              item={faq}
              isOpen={openIndex === i}
              onClick={() => toggleFAQ(i)}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default FAQ;
