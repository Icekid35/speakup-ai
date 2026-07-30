import React from 'react';
import { Link } from './Router';
import { Github, Sparkles, ExternalLink, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                <svg className="w-4 h-4 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3" fill="currentColor" />
                  <circle cx="12" cy="12" r="7" strokeDasharray="2 2" />
                  <circle cx="12" cy="12" r="10" strokeOpacity="0.4" />
                </svg>
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                speakup<span className="text-indigo-400">.ai</span>
              </span>
            </div>
            <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
              Multimodal speaking intelligence powered by Google Gemma 4. Watches how you communicate—speech, vision, and prosody—to build genuine delivery confidence.
            </p>

            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-3 py-1.5 rounded-full w-fit">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Systems Operational • Gemma 4 Core Active</span>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-200 font-semibold">Product</h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/app" className="hover:text-white transition-colors">
                  Open Application
                </Link>
              </li>
              <li>
                <Link to="/features" className="hover:text-white transition-colors">
                  Features Overview
                </Link>
              </li>
              <li>
                <Link to="/app" className="hover:text-white transition-colors">
                  AI Practice Examiner
                </Link>
              </li>
              <li>
                <Link to="/app" className="hover:text-white transition-colors">
                  Script Rewriter
                </Link>
              </li>
            </ul>
          </div>

          {/* Technology & Architecture */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-200 font-semibold">Architecture</h4>
            <ul className="space-y-2.5">
              <li className="text-slate-400">Google Gemma 4 31B IT</li>
              <li className="text-slate-400">Gemma 4 26B A4B IT</li>
              <li className="text-slate-400">LiteRT On-Device (E2B)</li>
              <li className="text-slate-400">Faster-Whisper ASR</li>
              <li className="text-slate-400">FFmpeg Frame Demuxer</li>
            </ul>
          </div>

          {/* Community & Open Source */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-200 font-semibold">Community</h4>
            <ul className="space-y-2.5">
              <li>
                <a
                  href="https://github.com/Icekid35/speakup-ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
                >
                  <Github className="w-4 h-4" />
                  <span>GitHub Repository</span>
                </a>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About the Project
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact & Feedback
                </Link>
              </li>
              <li>
                <a
                  href="https://kaggle.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-white transition-colors"
                >
                  <span>Google Gemma Hackathon</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} SpeakUp.ai. Crafted for the Google Gemma 4 Hackathon.</p>
          <div className="flex items-center gap-6">
            <Link to="/about" className="hover:text-slate-400 transition-colors">Mission</Link>
            <Link to="/contact" className="hover:text-slate-400 transition-colors">Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
