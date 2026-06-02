import React from 'react';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, 
  CheckCircle, 
  HelpCircle, 
  Shield, 
  Share2, 
  Download, 
  ExternalLink, 
  Link2, 
  Calendar, 
  ShieldCheck, 
  Globe 
} from 'lucide-react';
import { cn } from '../utils/cn';

// Reusable progress meter with gorgeous micro-animations and glowing indicators
const ProgressMeter = ({ label, value, colorClass, icon: Icon }) => (
  <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden group hover:border-cyan-500/20 transition-all duration-300 shadow-sm">
    <div className="flex items-center justify-between mb-3">
      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{label}</span>
      {Icon && <Icon className={cn("opacity-70 group-hover:scale-110 transition-transform duration-300", colorClass.text)} size={18} />}
    </div>
    <div className="flex items-baseline gap-1.5 mb-4">
      <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{value}%</span>
    </div>
    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800/80 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className={cn("h-full rounded-full shadow-inner", colorClass.bg)}
      />
    </div>
  </div>
);

// Reusable article card displaying actual news reporting details
const ArticleCard = ({ src }) => {
  const stanceColors = {
    support: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    supporting: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    oppose: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    opposing: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    mixed: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    neutral: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    unrelated: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20"
  };

  const getStanceLabel = (stance) => {
    if (stance === "support" || stance === "supporting") return "Supporting";
    if (stance === "oppose" || stance === "opposing") return "Opposing";
    if (stance === "mixed" || stance === "neutral") return "Mixed";
    return "Related";
  };

  return (
    <motion.li 
      whileHover={{ y: -4, scale: 1.01 }}
      className="bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/80 rounded-xl p-5 hover:shadow-lg dark:hover:bg-slate-900/80 transition-all duration-300 flex flex-col justify-between gap-4 h-full list-none"
    >
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between gap-2">
          <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <Globe size={12} className="text-cyan-500" /> {src.domain}
          </span>
          {src.stance && (
            <span className={cn("text-[9px] uppercase font-extrabold px-2 py-0.5 rounded-full border tracking-wide", stanceColors[src.stance] || stanceColors.unrelated)}>
              {getStanceLabel(src.stance)}
            </span>
          )}
        </div>
        <a 
          href={src.url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="group/link text-sm font-bold text-slate-800 dark:text-slate-100 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors line-clamp-2 flex items-start gap-1"
        >
          <span>{src.title}</span>
          <ExternalLink size={14} className="shrink-0 mt-0.5 opacity-0 group-hover/link:opacity-100 transition-opacity duration-300 text-cyan-500" />
        </a>
        {src.snippet && (
          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed mt-1 italic pl-2 border-l-2 border-slate-100 dark:border-slate-800">
            "{src.snippet}"
          </p>
        )}
      </div>
      
      {src.publishedAt && (
        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 dark:text-slate-500 border-t border-slate-50 dark:border-slate-800/60 pt-3">
          <Calendar size={11} className="text-slate-400" />
          <span>Published: {src.publishedAt}</span>
        </div>
      )}
    </motion.li>
  );
};

const ResultCard = ({ result, sourceUrl }) => {
  if (!result) return null;

  const { 
    prediction, 
    confidenceScore, 
    fakeProbability, 
    riskLevel, 
    explanation, 
    flags, 
    positiveSignals, 
    relatedSources 
  } = result;

  const isFake = prediction === 'Fake';
  const isCredible = prediction === 'Credible';

  const getPredictionColor = () => {
    if (isFake) return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-500/10 border-red-200 dark:border-red-500/20';
    if (isCredible) return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-500/10 border-green-200 dark:border-green-500/20';
    return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-500/10 border-yellow-200 dark:border-yellow-500/20';
  };

  const getIcon = () => {
    if (isFake) return <AlertTriangle size={32} className="text-red-500" />;
    if (isCredible) return <CheckCircle size={32} className="text-green-500" />;
    return <HelpCircle size={32} className="text-yellow-500" />;
  };
  const allArticles = [];
  if (relatedSources) {
    if (relatedSources.supporting) {
      relatedSources.supporting.forEach(src => allArticles.push({ ...src, stance: src.stance || 'support' }));
    }
    if (relatedSources.opposing) {
      relatedSources.opposing.forEach(src => allArticles.push({ ...src, stance: src.stance || 'oppose' }));
    }
    if (relatedSources.mixed) {
      relatedSources.mixed.forEach(src => allArticles.push({ ...src, stance: src.stance || 'mixed' }));
    }
  }

  const hasSources = allArticles.length > 0;

  const supportingCount = allArticles.filter(src => src.stance === 'support' || src.stance === 'supporting').length;
  const opposingCount = allArticles.filter(src => src.stance === 'oppose' || src.stance === 'opposing').length;
  const mixedCount = allArticles.filter(src => src.stance === 'mixed' || src.stance === 'neutral' || src.stance === 'unrelated').length;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl relative overflow-hidden"
    >
      {/* Decorative top glass border */}
      <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-cyan-500 via-emerald-500 to-rose-500" />

      {/* Row 1: AI Prediction & Dual Metric Meters */}
      <div className="grid lg:grid-cols-12 gap-6 items-start border-b border-slate-100 dark:border-slate-800 pb-8 mb-8">
        
        {/* Prediction Display */}
        <div className="lg:col-span-4 flex items-center gap-4">
          <div className={cn("p-4 rounded-2xl border shrink-0", getPredictionColor().split(' ').slice(1).join(' '))}>
            {getIcon()}
          </div>
          <div>
            <h3 className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">
              AI Prediction
            </h3>
            <div className={cn("text-3xl font-black tracking-tight", getPredictionColor().split(' ')[0])}>
              {prediction}
            </div>
          </div>
        </div>

        {/* Dual Metric dashboard */}
        <div className="lg:col-span-8 grid sm:grid-cols-3 gap-4 w-full">
          
          <ProgressMeter 
            label="Confidence Score" 
            value={confidenceScore} 
            colorClass={{
              text: "text-cyan-500",
              bg: "bg-gradient-to-r from-cyan-500 to-emerald-500"
            }}
            icon={ShieldCheck}
          />

          <ProgressMeter 
            label="Fake Probability" 
            value={fakeProbability} 
            colorClass={{
              text: "text-rose-500",
              bg: "bg-gradient-to-r from-rose-500 to-orange-500"
            }}
            icon={AlertTriangle}
          />

          {/* Risk Level Badge */}
          <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden group hover:border-cyan-500/20 transition-all duration-300 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Risk Level</span>
              <Shield className="text-slate-400 opacity-70 group-hover:rotate-12 transition-transform duration-300" size={18} />
            </div>
            <div className="flex items-baseline mb-4">
              <span className={cn(
                "text-sm font-bold px-3 py-1 rounded-full border tracking-wide",
                riskLevel === 'High' ? "text-red-500 bg-red-500/10 border-red-500/20" :
                riskLevel === 'Low' ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" :
                "text-amber-500 bg-amber-500/10 border-amber-500/20"
              )}>
                {riskLevel} Risk
              </span>
            </div>
            <div className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-semibold">
              {riskLevel === 'High' ? "High misinformation alert" : riskLevel === 'Low' ? "Sources corroborate claim" : "Verify neutral coverage"}
            </div>
          </div>

        </div>
      </div>

      {/* Row 2: AI Reasoning */}
      <div className="mb-8">
        <h4 className="text-md font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
          <Shield size={18} className="text-cyan-500" /> AI Diagnostic Reasoning
        </h4>
        <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed bg-slate-50 dark:bg-slate-950/60 p-4 rounded-xl border border-slate-100 dark:border-slate-800/80">
          {explanation}
        </p>
      </div>

      {/* Row 3: Web Cross-Reference Analysis (Actual Clickable Articles Side-by-Side) */}
      {hasSources && (
        <div className="mb-8">
          <h4 className="text-md font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <Link2 size={18} className="text-cyan-500" /> Live Web Evidence & Cross-References
          </h4>
          
          {/* Dynamic Stance Summary Statistics */}
          <div className="flex flex-wrap gap-4 items-center mb-6 bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800 p-4 rounded-xl shadow-sm">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mr-2">Evidence Summary:</span>
            <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-3 py-1.5 rounded-xl text-xs font-bold">
              <CheckCircle size={14} />
              <span>Supporting: {supportingCount}</span>
            </div>
            <div className="flex items-center gap-2 bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 px-3 py-1.5 rounded-xl text-xs font-bold">
              <AlertTriangle size={14} />
              <span>Opposing: {opposingCount}</span>
            </div>
            <div className="flex items-center gap-2 bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 px-3 py-1.5 rounded-xl text-xs font-bold">
              <HelpCircle size={14} />
              <span>Mixed/Neutral: {mixedCount}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allArticles.map((src, i) => (
              <ArticleCard key={i} src={src} />
            ))}
          </div>
        </div>
      )}

      {/* Row 4: Signals and Red Flags Grid */}
      <div className="grid md:grid-cols-2 gap-6 mb-8 border-t border-slate-100 dark:border-slate-800 pt-8">
        {flags && flags.length > 0 && (
          <div>
            <h4 className="text-xs font-extrabold text-red-500 dark:text-red-400 mb-3 flex items-center gap-2 uppercase tracking-wider">
              <AlertTriangle size={15} /> Linguistic Red Flags
            </h4>
            <ul className="space-y-2 p-0">
              {flags.map((flag, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400 bg-red-500/5 p-3 rounded-xl border border-red-500/10 list-none">
                  <span className="text-red-500 mt-0.5 font-bold">•</span>
                  <span>{flag}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {positiveSignals && positiveSignals.length > 0 && (
          <div>
            <h4 className="text-xs font-extrabold text-green-500 dark:text-green-400 mb-3 flex items-center gap-2 uppercase tracking-wider">
              <CheckCircle size={15} /> Credibility Signals
            </h4>
            <ul className="space-y-2 p-0">
              {positiveSignals.map((signal, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400 bg-emerald-500/5 p-3 rounded-xl border border-emerald-500/10 list-none">
                  <span className="text-green-500 mt-0.5 font-bold">•</span>
                  <span>{signal}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Row 5: Action Actions */}
      <div className="border-t border-slate-100 dark:border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <ShieldCheck size={16} className="text-cyan-500 animate-pulse" />
          {isCredible ? (
            <span className="text-emerald-500">Credible reporting verified. Safe to share.</span>
          ) : isFake ? (
            <span className="text-rose-500">High risk of misinformation. Think twice before sharing.</span>
          ) : (
            <span className="text-amber-500">Mixed consensus. Crosscheck using live links before sharing.</span>
          )}
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors shadow-sm">
            <Download size={14} /> Summary Report
          </button>
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/20 hover:-translate-y-0.5">
            <Share2 size={14} /> Share Analysis
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ResultCard;
