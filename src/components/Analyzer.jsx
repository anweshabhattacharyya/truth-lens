import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Link as LinkIcon, AlertCircle, Clock, Trash2, ArrowRight } from 'lucide-react';
import { analyzeNews } from '../services/fakeNewsEngine';
import ResultCard from './ResultCard';
import { cn } from '../utils/cn';

const sampleNews = [
  {
    title: "Clickbait Example",
    text: "SHOCKING TRUTH EXPOSED! They don't want you to know about this miracle cure that will destroy the medical industry! Must share before it gets deleted!",
    source: "viraltruth.net"
  },
  {
    title: "Credible Example",
    text: "According to a new study published on May 15, 2023, researchers noted a significant decrease in average global temperatures during the observation period. The official report stated that more evidence is needed.",
    source: "nature.com"
  }
];

const Analyzer = () => {
  const [text, setText] = useState('');
  const [source, setSource] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('truthLensHistory');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history");
      }
    }
  }, []);

  const saveToHistory = (newResult, queryText) => {
    const newHistory = [{
      id: Date.now(),
      text: queryText.substring(0, 60) + "...",
      prediction: newResult.prediction,
      date: new Date().toLocaleDateString()
    }, ...history].slice(0, 5); // Keep last 5
    
    setHistory(newHistory);
    localStorage.setItem('truthLensHistory', JSON.stringify(newHistory));
  };

  const handleAnalyze = () => {
    setError('');
    setResult(null);

    if (!text || text.trim().length < 20) {
      setError("Please enter a longer text snippet (at least 20 characters) for accurate analysis.");
      return;
    }

    setIsAnalyzing(true);

    // Simulate network delay for effect
    setTimeout(() => {
      try {
        const analysisResult = analyzeNews(text, source);
        setResult(analysisResult);
        saveToHistory(analysisResult, text);
      } catch (err) {
        setError(err.message || "An error occurred during analysis.");
      } finally {
        setIsAnalyzing(false);
      }
    }, 1500);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('truthLensHistory');
  };

  return (
    <section id="analyzer" className="py-20 bg-slate-50 dark:bg-slate-950/50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Try The Analyzer
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Paste an article excerpt, headline, or message below. Our AI will analyze the tone, wording, and structure.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  News Content / Headline
                </label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Paste the news text here..."
                  className="w-full h-40 p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all outline-none resize-none text-slate-900 dark:text-white"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Source / URL (Optional)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LinkIcon size={18} className="text-slate-400" />
                  </div>
                  <input
                    type="text"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    placeholder="e.g. bbc.com or shocking-news.info"
                    className="w-full pl-10 p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all outline-none text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex gap-2">
                  {sampleNews.map((sample, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setText(sample.text);
                        setSource(sample.source);
                      }}
                      className="text-xs px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                    >
                      Load {sample.title}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="w-full sm:w-auto px-8 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl font-semibold shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Search size={18} />
                      Analyze Content
                    </>
                  )}
                </button>
              </div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg flex items-start gap-2 text-sm text-red-600 dark:text-red-400"
                >
                  <AlertCircle size={18} className="shrink-0 mt-0.5" />
                  <p>{error}</p>
                </motion.div>
              )}
            </div>

            {/* Analysis Progress Bar */}
            <AnimatePresence>
              {isAnalyzing && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 overflow-hidden"
                >
                  <div className="flex justify-between text-sm mb-2 font-medium text-cyan-600 dark:text-cyan-400">
                    <span>Extracting entities...</span>
                    <span>Scanning patterns...</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 1.5, ease: "linear" }}
                      className="h-full bg-cyan-500"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Result */}
            <AnimatePresence>
              {!isAnalyzing && result && (
                <ResultCard result={result} sourceUrl={source} />
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar: History */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <Clock size={18} className="text-cyan-500" /> Recent Analyses
                </h3>
                {history.length > 0 && (
                  <button 
                    onClick={clearHistory}
                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                    aria-label="Clear history"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

              {history.length === 0 ? (
                <div className="text-center py-8 text-slate-500 dark:text-slate-400 text-sm">
                  No recent analyses. Try checking some news!
                </div>
              ) : (
                <div className="space-y-4">
                  {history.map((item) => (
                    <div key={item.id} className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-cyan-500/30 transition-colors cursor-pointer group">
                      <div className="flex items-center justify-between mb-1">
                        <span className={cn(
                          "text-xs font-semibold px-2 py-0.5 rounded-full",
                          item.prediction === 'Fake' ? "text-red-600 bg-red-100 dark:bg-red-900/30" :
                          item.prediction === 'Credible' ? "text-green-600 bg-green-100 dark:bg-green-900/30" :
                          "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30"
                        )}>
                          {item.prediction}
                        </span>
                        <span className="text-xs text-slate-400">{item.date}</span>
                      </div>
                      <p className="text-sm text-slate-700 dark:text-slate-300 italic mb-2">"{item.text}"</p>
                      <div className="flex items-center text-xs text-cyan-600 dark:text-cyan-400 font-medium group-hover:translate-x-1 transition-transform">
                        View again <ArrowRight size={12} className="ml-1" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-8 p-4 bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-100 dark:border-cyan-500/20 rounded-xl">
                <h4 className="text-sm font-semibold text-cyan-800 dark:text-cyan-300 mb-1">AI Prototype Notice</h4>
                <p className="text-xs text-cyan-700/80 dark:text-cyan-400/80">
                  This MVP currently uses NLP-inspired credibility analysis and pattern detection. Future versions will integrate advanced transformer-based AI models and real-time fact-checking systems.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Analyzer;
