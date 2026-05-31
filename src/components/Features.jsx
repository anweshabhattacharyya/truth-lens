import React from 'react';
import { motion } from 'framer-motion';
import { Fingerprint, Zap, Layers, Smartphone, FileText, Globe } from 'lucide-react';

const featuresList = [
  {
    icon: <Fingerprint size={24} />,
    title: "Pattern Detection",
    description: "Identifies sensationalist tone, clickbait structure, and emotional manipulation commonly used in fake news."
  },
  {
    icon: <Zap size={24} />,
    title: "Real-time Analysis",
    description: "Get instant results without waiting. Our optimized engine runs directly in your browser for the MVP."
  },
  {
    icon: <FileText size={24} />,
    title: "Contextual Explanations",
    description: "Doesn't just give a score—explains exactly WHY a piece of text is flagged as credible or suspicious."
  },
  {
    icon: <Globe size={24} />,
    title: "Source Verification",
    description: "Cross-references provided URLs with a database of known credible and untrustworthy domains."
  },
  {
    icon: <Smartphone size={24} />,
    title: "Fully Responsive",
    description: "Verify news on the go. Truth Lens is perfectly optimized for mobile, tablet, and desktop experiences."
  },
  {
    icon: <Layers size={24} />,
    title: "History Tracking",
    description: "Automatically saves your recent analyses locally so you can easily reference or share them later."
  }
];

const Features = () => {
  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-950/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Key Features
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Everything you need to combat misinformation and make informed decisions online.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuresList.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-2xl hover:shadow-xl transition-all hover:-translate-y-1 group"
            >
              <div className="w-12 h-12 bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
