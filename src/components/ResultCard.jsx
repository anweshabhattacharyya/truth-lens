import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, HelpCircle, Shield, Share2, Download, ExternalLink } from 'lucide-react';
import { cn } from '../utils/cn';

const ResultCard = ({ result, sourceUrl }) => {
  if (!result) return null;

  const { prediction, confidenceScore, riskLevel, explanation, flags, positiveSignals } = result;

  const isFake = prediction === 'Fake';
  const isCredible = prediction === 'Credible';
  const isUncertain = prediction === 'Uncertain';

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

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl"
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8 border-b border-slate-100 dark:border-slate-800 pb-8">
        <div className="flex items-center gap-4">
          <div className={cn("p-3 rounded-xl border", getPredictionColor().split(' ').slice(1).join(' '))}>
            {getIcon()}
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              AI Prediction
            </h3>
            <div className={cn("text-3xl font-bold", getPredictionColor().split(' ')[0])}>
              {prediction}
            </div>
          </div>
        </div>

        <div className="flex gap-8 items-center">
          <div className="text-center">
            <div className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Confidence Score</div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white flex items-center justify-center">
              {confidenceScore}%
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Risk Level</div>
            <div className={cn(
              "text-lg font-bold px-3 py-1 rounded-full",
              riskLevel === 'High' ? "text-red-600 bg-red-100 dark:bg-red-900/30" :
              riskLevel === 'Low' ? "text-green-600 bg-green-100 dark:bg-green-900/30" :
              "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30"
            )}>
              {riskLevel}
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">AI Reasoning</h4>
        <p className="text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
          {explanation}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {flags && flags.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-red-600 dark:text-red-400 mb-3 flex items-center gap-2">
              <AlertTriangle size={16} /> Red Flags Detected
            </h4>
            <ul className="space-y-2">
              {flags.map((flag, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400 bg-red-50 dark:bg-red-500/5 p-2 rounded-lg border border-red-100 dark:border-red-500/10">
                  <span className="text-red-500 mt-0.5">•</span>
                  <span>{flag}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {positiveSignals && positiveSignals.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-green-600 dark:text-green-400 mb-3 flex items-center gap-2">
              <CheckCircle size={16} /> Credibility Signals
            </h4>
            <ul className="space-y-2">
              {positiveSignals.map((signal, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400 bg-green-50 dark:bg-green-500/5 p-2 rounded-lg border border-green-100 dark:border-green-500/10">
                  <span className="text-green-500 mt-0.5">•</span>
                  <span>{signal}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="border-t border-slate-100 dark:border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">
          <Shield size={16} />
          {isCredible ? (
            <span className="text-green-600 dark:text-green-400">Safe to share, but always cross-check.</span>
          ) : isFake ? (
            <span className="text-red-600 dark:text-red-400">High risk of misinformation. Do not share.</span>
          ) : (
            <span className="text-yellow-600 dark:text-yellow-400">Verify from trusted sources before sharing.</span>
          )}
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors">
            <Download size={16} /> Summary
          </button>
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-medium transition-colors">
            <Share2 size={16} /> Share Result
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ResultCard;
