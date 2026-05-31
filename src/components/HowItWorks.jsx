import React from 'react';
import { motion } from 'framer-motion';
import { ClipboardPaste, BrainCircuit, CheckSquare, Share2 } from 'lucide-react';

const steps = [
  {
    icon: <ClipboardPaste size={28} className="text-cyan-600 dark:text-cyan-400" />,
    title: "1. Enter Content",
    description: "Paste any news article, headline, or claim along with the source URL.",
    color: "bg-cyan-100 dark:bg-cyan-500/10 border-cyan-200 dark:border-cyan-500/20"
  },
  {
    icon: <BrainCircuit size={28} className="text-purple-600 dark:text-purple-400" />,
    title: "2. AI Analysis",
    description: "Our NLP engine scans for emotional wording, credibility signals, and source reputation.",
    color: "bg-purple-100 dark:bg-purple-500/10 border-purple-200 dark:border-purple-500/20"
  },
  {
    icon: <CheckSquare size={28} className="text-blue-600 dark:text-blue-400" />,
    title: "3. Get Prediction",
    description: "Receive a confidence score, risk level, and an explanation of the detected patterns.",
    color: "bg-blue-100 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20"
  },
  {
    icon: <Share2 size={28} className="text-green-600 dark:text-green-400" />,
    title: "4. Share Safely",
    description: "Make an informed decision. Share verified truth and help stop the spread of fake news.",
    color: "bg-green-100 dark:bg-green-500/10 border-green-200 dark:border-green-500/20"
  }
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            How Truth Lens Works
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            A simple, fast, and intelligent workflow to verify information before you share it with others.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="relative"
            >
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 border ${step.color}`}>
                {step.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                {step.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {step.description}
              </p>
              
              {/* Connector line for desktop */}
              {idx < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-[80px] w-[calc(100%-80px)] h-px border-t-2 border-dashed border-slate-200 dark:border-slate-800" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
