import React from 'react';
import { Link } from '../components/Router';
import { Check, Cpu, ShieldCheck, Zap, Github, ArrowRight, HelpCircle } from 'lucide-react';

export const PricingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-indigo-600 font-semibold">
            Transparent & Open Access
          </span>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-slate-900">
            Free & Open Source. <br />
            <span className="text-slate-500 font-normal">No subscriptions or hidden fees.</span>
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed font-normal">
            SpeakUp.ai was created for the Google Gemma 4 Hackathon with a core mission: democratize high-quality communication coaching for everyone.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-20">
          
          {/* Card 1: On-Device Local Tier */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-10 shadow-sm flex flex-col justify-between space-y-8 relative overflow-hidden">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-mono font-bold">
                  <Cpu className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono font-semibold uppercase px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                  On-Device Privacy
                </span>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-slate-900">Local LiteRT Engine</h2>
                <p className="text-slate-500 text-sm mt-1">Run Google Gemma 4 locally on your machine.</p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-slate-900">$0</span>
                <span className="text-slate-500 text-sm font-medium">/ forever</span>
              </div>

              <div className="space-y-3 border-t border-slate-100 pt-6 text-sm text-slate-700">
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>100% Offline & Confidential</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Runs via Google LiteRT-LM (Gemma 4 E2B)</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Zero video or audio sent to external servers</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Unlimited presentation recordings</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Faster-Whisper local ASR engine</span>
                </div>
              </div>
            </div>

            <div>
              <Link
                to="/app"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm transition-all"
              >
                <span>Launch Local App</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card 2: Cloud API Tier */}
          <div className="bg-white rounded-3xl border-2 border-indigo-600 p-8 sm:p-10 shadow-md flex flex-col justify-between space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[11px] font-mono font-bold uppercase px-4 py-1 rounded-bl-xl tracking-wider">
              Recommended for Web
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-mono font-bold">
                  <Zap className="w-5 h-5" />
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-slate-900">Cloud Gemini API</h2>
                <p className="text-slate-500 text-sm mt-1">High-order reasoning with larger Gemma 4 models.</p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-slate-900">$0</span>
                <span className="text-slate-500 text-sm font-medium">/ free Google AI Studio key</span>
              </div>

              <div className="space-y-3 border-t border-slate-100 pt-6 text-sm text-slate-700">
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-indigo-600 shrink-0" />
                  <span>Gemma 4 31B IT & 26B A4B IT Cloud Access</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-indigo-600 shrink-0" />
                  <span>Zero setup required — works directly in web browser</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-indigo-600 shrink-0" />
                  <span>Sub-second Groq Cloud Whisper API speech recognition</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-indigo-600 shrink-0" />
                  <span>Neural speech synthesis for spoken debriefs</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-indigo-600 shrink-0" />
                  <span>Hands-free STAR Practice Examiner stage</span>
                </div>
              </div>
            </div>

            <div>
              <Link
                to="/app"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition-all shadow-sm"
              >
                <span>Start Web App Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto space-y-8 bg-white p-8 sm:p-12 rounded-3xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-6">
            <HelpCircle className="w-6 h-6 text-indigo-600" />
            <h2 className="text-2xl font-bold text-slate-900">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-6 text-sm">
            <div className="space-y-2">
              <h3 className="font-semibold text-slate-900 text-base">Is SpeakUp.ai completely free to use?</h3>
              <p className="text-slate-600 leading-relaxed">
                Yes! SpeakUp.ai is 100% free and open source. You can run it on your own machine locally via Google LiteRT-LM, or use it on the web using a free Google Gemini API key from Google AI Studio.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-slate-900 text-base">How does on-device privacy work with LiteRT?</h3>
              <p className="text-slate-600 leading-relaxed">
                When running in local mode (<code>NEXT_PUBLIC_APP_MODE=local</code>), the server connects directly to your local LiteRT-LM instance on port 9379. Audio demuxing, frame extraction, speech transcription, and Gemma inference all happen on your laptop. No video or text is sent over the internet.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-slate-900 text-base">Where do I get a free Gemini API Key?</h3>
              <p className="text-slate-600 leading-relaxed">
                You can generate a free API key in seconds at <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 underline">aistudio.google.com</a>. Paste your key in the app's settings modal or add it to your <code>.env</code> file.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-slate-900 text-base">Can I inspect or contribute to the source code?</h3>
              <p className="text-slate-600 leading-relaxed">
                Absolutely! The entire source code is hosted on GitHub under the MIT license at <a href="https://github.com/Icekid35/speakup-ai" target="_blank" rel="noopener noreferrer" className="text-indigo-600 underline">github.com/Icekid35/speakup-ai</a>.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
