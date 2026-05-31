import React from 'react';
import { motion } from 'framer-motion';
import { AlertOctagon, TrendingUp, SearchCheck, Users } from 'lucide-react';

const cards = [
  {
    icon: <AlertOctagon size={24} className="text-red-500" />,
    title: "What is Fake News?",
    content: "Fake news consists of false narratives or fabricated stories published to deceive readers, generate ad revenue, or push specific agendas. It often mimics the format of legitimate news."
  },
  {
    icon: <TrendingUp size={24} className="text-orange-500" />,
    title: "Why It Spreads Fast",
    content: "Misinformation is designed to trigger strong emotional reactions like anger or fear. Algorithms on social media prioritize high-engagement content, causing fake news to spread 6x faster than truth."
  },
  {
    icon: <SearchCheck size={24} className="text-green-500" />,
    title: "How to Verify Manually",
    content: "Always check the source URL. Look for the author's credentials, verify the date of publication, and see if other reputable news outlets are reporting the same story."
  },
  {
    icon: <Users size={24} className="text-blue-500" />,
    title: "Our Mission",
    content: "Truth Lens aims to improve digital literacy. We provide tools for students, journalists, and everyday users to quickly analyze claims and make informed decisions before hitting 'Share'."
  }
];

const Awareness = () => {
  return (
    <section id="awareness" className="py-20 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <div className="lg:w-1/3">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">
              Digital Literacy & Awareness
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
              Technology alone cannot solve the fake news epidemic. Education and critical thinking are our strongest defenses against digital misinformation.
            </p>
            <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800">
              <h4 className="font-bold text-slate-900 dark:text-white mb-2">Think before you share:</h4>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li className="flex items-center gap-2"><span>•</span> Is the headline overly sensational?</li>
                <li className="flex items-center gap-2"><span>•</span> Are there credible sources cited?</li>
                <li className="flex items-center gap-2"><span>•</span> Is it an old story repurposed?</li>
              </ul>
            </div>
          </div>

          <div className="lg:w-2/3 grid sm:grid-cols-2 gap-6">
            {cards.map((card, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="bg-slate-50 dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800"
              >
                <div className="mb-4 bg-white dark:bg-slate-900 w-12 h-12 rounded-full flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-800">
                  {card.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  {card.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {card.content}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Awareness;
