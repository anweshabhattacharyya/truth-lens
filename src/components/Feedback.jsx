import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Send } from 'lucide-react';
import { cn } from '../utils/cn';

const Feedback = () => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [useful, setUseful] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setRating(0);
      setUseful(null);
    }, 3000);
  };

  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-950/50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-12 shadow-xl border border-slate-200 dark:border-slate-800 text-center">
          
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
            Help Us Improve
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            Your feedback helps us train better models and improve the Truth Lens experience.
          </p>

          {submitted ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-12"
            >
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Thank you for your feedback!</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">We appreciate your contribution to fighting fake news.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="text-left space-y-6 max-w-xl mx-auto">
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 text-center">
                  How would you rate the accuracy of the results?
                </label>
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      onClick={() => setRating(star)}
                      className="p-1 focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star 
                        size={32} 
                        className={cn(
                          "transition-colors",
                          (hoveredRating || rating) >= star 
                            ? "fill-yellow-400 text-yellow-400" 
                            : "text-slate-300 dark:text-slate-700"
                        )} 
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 text-center">
                  Was this tool useful to you?
                </label>
                <div className="flex justify-center gap-4">
                  <button
                    type="button"
                    onClick={() => setUseful(true)}
                    className={cn(
                      "px-6 py-2 rounded-full border text-sm font-medium transition-all",
                      useful === true 
                        ? "bg-cyan-600 border-cyan-600 text-white shadow-md shadow-cyan-500/20" 
                        : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                    )}
                  >
                    Yes, very useful
                  </button>
                  <button
                    type="button"
                    onClick={() => setUseful(false)}
                    className={cn(
                      "px-6 py-2 rounded-full border text-sm font-medium transition-all",
                      useful === false 
                        ? "bg-slate-800 border-slate-800 text-white" 
                        : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                    )}
                  >
                    Not really
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Any suggestions? (Optional)
                </label>
                <textarea
                  className="w-full h-24 p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all outline-none resize-none text-slate-900 dark:text-white"
                  placeholder="Tell us what we can improve..."
                />
              </div>

              <button
                type="submit"
                disabled={rating === 0}
                className="w-full py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Feedback
              </button>

            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default Feedback;
