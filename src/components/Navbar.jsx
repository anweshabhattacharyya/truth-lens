import React from 'react';
import { Search, Moon, Sun, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = ({ darkMode, toggleTheme }) => {
  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2">
            <motion.div 
              whileHover={{ rotate: 15 }}
              className="p-2 bg-cyan-500/10 rounded-lg text-cyan-600 dark:text-cyan-400"
            >
              <ShieldCheck size={24} />
            </motion.div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
              Truth Lens
            </span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600 dark:text-slate-300">
            <a href="#analyzer" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Analyzer Tool</a>
            <a href="#how-it-works" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">How It Works</a>
            <a href="#awareness" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Awareness</a>
            <a href="#about" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">About</a>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <a 
              href="#analyzer"
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg font-medium hover:bg-slate-800 dark:hover:bg-slate-100 transition-all active:scale-95"
            >
              <Search size={16} />
              Try Now
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
