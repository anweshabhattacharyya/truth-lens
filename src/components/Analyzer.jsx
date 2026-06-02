import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Link as LinkIcon, 
  AlertCircle, 
  Clock, 
  Trash2, 
  ArrowRight, 
  Camera, 
  Mic, 
  MicOff, 
  Loader2 
} from 'lucide-react';
import { createWorker } from 'tesseract.js';
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

  // OCR and Speech States
  const [ocrStatus, setOcrStatus] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState('');

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

  const saveToHistory = (newResult, queryText, querySource) => {
    const filteredHistory = history.filter(item => item.text !== queryText);
    const newHistory = [{
      id: Date.now(),
      text: queryText,
      source: querySource || '',
      prediction: newResult.prediction,
      date: new Date().toLocaleDateString(),
      result: newResult
    }, ...filteredHistory].slice(0, 5); // Keep last 5
    
    setHistory(newHistory);
    localStorage.setItem('truthLensHistory', JSON.stringify(newHistory));
  };

  const deleteHistoryItem = (id) => {
    const newHistory = history.filter(item => item.id !== id);
    setHistory(newHistory);
    localStorage.setItem('truthLensHistory', JSON.stringify(newHistory));
  };

  const handleAnalyze = async () => {
    setError('');
    setResult(null);

    if (!text || text.trim().length < 20) {
      setError("Please enter a longer text snippet (at least 20 characters) for accurate analysis.");
      return;
    }

    setIsAnalyzing(true);

    try {
      const analysisResult = await analyzeNews(text, source);
      setResult(analysisResult);
      saveToHistory(analysisResult, text, source);
    } catch (err) {
      setError(err.message || "An error occurred during analysis.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('truthLensHistory');
  };

  // Web Speech API voice typing
  const handleVoiceInput = () => {
    setSpeechError('');
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechError("Speech recognition is not supported in this browser. Please try Google Chrome or Safari.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onerror = (e) => {
      console.error(e);
      setSpeechError("Microphone access was denied or voice recording timed out.");
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setText(prev => prev ? prev + " " + transcript : transcript);
    };

    recognition.start();
  };

  // Client-Side Tesseract OCR parsing
  const handleOcrUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setOcrStatus('Initializing OCR reader...');
    
    try {
      const worker = await createWorker('eng');
      setOcrStatus('Extracting text from image...');
      
      const ret = await worker.recognize(file);
      const extractedText = ret.data.text;
      
      await worker.terminate();
      
      if (extractedText && extractedText.trim().length > 0) {
        setText(prev => prev ? prev + "\n" + extractedText.trim() : extractedText.trim());
        setOcrStatus('');
      } else {
        setOcrStatus('Could not read any text. Please ensure the screenshot contains clear text.');
        setTimeout(() => setOcrStatus(''), 4000);
      }
    } catch (err) {
      console.error(err);
      setOcrStatus('OCR extraction failed: ' + (err.message || 'unknown error'));
      setTimeout(() => setOcrStatus(''), 4000);
    }
  };

  return (
    <section id="analyzer" className="py-20 bg-slate-50 dark:bg-slate-950/50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Try The Analyzer
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Verify a claim, paste an excerpt, scan a screenshot, or type with your voice to crosscheck facts in real-time.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
              
              {/* Header Label and Multi-modal inputs */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2.5">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-350">
                    News Content / Claim text
                  </label>
                  
                  {/* Speech & OCR Input Panel */}
                  <div className="flex gap-2 items-center">
                    
                    {/* Voice Typing */}
                    <button
                      onClick={handleVoiceInput}
                      className={cn(
                        "p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer",
                        isListening 
                          ? "bg-red-500/10 border-red-500/30 text-red-500 animate-pulse" 
                          : "bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-900 border-slate-200 dark:border-slate-855 text-slate-600 dark:text-slate-400"
                      )}
                      title="Speak news claim"
                    >
                      {isListening ? <MicOff size={14} className="animate-spin text-red-500" /> : <Mic size={14} />}
                      <span>{isListening ? "Listening..." : "Speak"}</span>
                    </button>

                    {/* OCR Upload */}
                    <label
                      className="p-2 rounded-xl border bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                      title="Upload news screenshot"
                    >
                      <Camera size={14} />
                      <span>Scan Screenshot</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleOcrUpload} 
                        className="hidden" 
                      />
                    </label>

                  </div>
                </div>

                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Type/Paste your claim, speak, or upload a screenshot..."
                  className="w-full h-40 p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all outline-none resize-none text-slate-900 dark:text-white text-sm"
                />

                {/* Multimodal Progress Indicators */}
                {ocrStatus && (
                  <div className="mt-3 p-3 bg-cyan-500/5 border border-cyan-500/10 rounded-xl flex items-center gap-2 text-xs text-cyan-600 dark:text-cyan-400">
                    <Loader2 size={14} className="animate-spin text-cyan-500" />
                    <span>{ocrStatus}</span>
                  </div>
                )}
                {speechError && (
                  <div className="mt-3 p-3 bg-rose-500/5 border border-rose-500/10 rounded-xl flex items-center gap-2 text-xs text-rose-600 dark:text-rose-400">
                    <AlertCircle size={14} className="text-rose-500" />
                    <span>{speechError}</span>
                  </div>
                )}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-350 mb-2">
                  Source / URL (Optional)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LinkIcon size={16} className="text-slate-400" />
                  </div>
                  <input
                    type="text"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    placeholder="e.g. bbc.com or shocking-news.info"
                    className="w-full pl-10 p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all outline-none text-slate-900 dark:text-white text-sm"
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
                      <Loader2 className="w-5 h-5 animate-spin" />
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
                    <div 
                      key={item.id} 
                      onClick={() => {
                        setText(item.text);
                        setSource(item.source || '');
                        if (item.result) {
                          setResult(item.result);
                        }
                      }}
                      className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-cyan-500/30 transition-colors cursor-pointer group relative"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={cn(
                          "text-xs font-semibold px-2 py-0.5 rounded-full",
                          item.prediction === 'Fake' ? "text-red-600 bg-red-100 dark:bg-red-900/30" :
                          item.prediction === 'Credible' ? "text-green-600 bg-green-100 dark:bg-green-900/30" :
                          "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30"
                        )}>
                          {item.prediction}
                        </span>
                        <span className="text-xs text-slate-400 mr-5">{item.date}</span>
                      </div>
                      <p className="text-sm text-slate-700 dark:text-slate-350 italic mb-2 pr-4">
                        "{item.text.length > 60 ? item.text.substring(0, 60) + "..." : item.text}"
                      </p>
                      <div className="flex items-center text-xs text-cyan-600 dark:text-cyan-400 font-medium group-hover:translate-x-1 transition-transform">
                        View again <ArrowRight size={12} className="ml-1" />
                      </div>
                      
                      {/* Individual delete button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteHistoryItem(item.id);
                        }}
                        className="absolute top-2.5 right-2.5 p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                        title="Delete this analysis"
                        aria-label="Delete analysis"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-8 p-4 bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-100 dark:border-cyan-500/20 rounded-xl">
                <h4 className="text-sm font-semibold text-cyan-800 dark:text-cyan-300 mb-1">AI Verification Panel</h4>
                <p className="text-xs text-cyan-700/80 dark:text-cyan-400/80">
                  This system integrates screenshot OCR text scanning, speech recording transcribe engines, and live Google News APIs to run credibility stance cross-referencing.
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
