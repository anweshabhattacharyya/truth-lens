import React from 'react';
import { ShieldCheck, Globe, MessageCircle, Briefcase } from 'lucide-react';

const Footer = () => {
  return (
    <footer id="about" className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck size={24} className="text-cyan-500" />
              <span className="text-xl font-bold text-white">Truth Lens</span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed mb-6">
              An AI-assisted platform dedicated to combating misinformation, improving digital literacy, and helping users verify news before they share it online.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-slate-400 hover:text-white transition-colors"><Globe size={20} /></a>
              <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors"><MessageCircle size={20} /></a>
              <a href="#" className="text-slate-400 hover:text-blue-400 transition-colors"><Briefcase size={20} /></a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Future Scope</h4>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-cyan-400 transition-colors cursor-pointer">Real-time Fact Checking API</li>
              <li className="hover:text-cyan-400 transition-colors cursor-pointer">Browser Extension</li>
              <li className="hover:text-cyan-400 transition-colors cursor-pointer">Multilingual Support</li>
              <li className="hover:text-cyan-400 transition-colors cursor-pointer">Image Verification</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-cyan-400 transition-colors cursor-pointer">Media Literacy Guide</li>
              <li className="hover:text-cyan-400 transition-colors cursor-pointer">Trusted News Sources</li>
              <li className="hover:text-cyan-400 transition-colors cursor-pointer">Privacy Policy</li>
              <li className="hover:text-cyan-400 transition-colors cursor-pointer">Terms of Service</li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-800 text-sm text-slate-500 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} Truth Lens MVP. Built for educational purposes.</p>
          <p>Designed with <span className="text-red-500">♥</span> to protect truth.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
