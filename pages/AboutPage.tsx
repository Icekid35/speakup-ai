import React from 'react';
import { Link } from '../components/Router';
import { Sparkles, Heart, ShieldCheck, Cpu, Code, ArrowRight, Github, Award } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-20">
          <span className="text-xs font-mono uppercase tracking-widest text-indigo-600 font-semibold">
            Our Mission & Background
          </span>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-slate-900">
            Democratizing Executive Communication Coaching
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed font-normal">
            SpeakUp.ai was designed from the ground up for the Google Gemma 4 Competition to bridge the gap between technical expertise and convincing delivery.
          </p>
        </div>

        {/* Story Section */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-14 max-w-5xl mx-auto shadow-sm space-y-10 mb-16">
          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Why Communication Matters</h2>
            <p className="text-slate-600 leading-relaxed text-base">
              Good communication changes lives. It helps researchers defend years of work with clarity, enables founders to convince investors, helps job seekers land career-defining roles, and lets public speakers inspire movements.
            </p>
            <p className="text-slate-600 leading-relaxed text-base">
              Yet traditional AI assistants only evaluate text—they fix your grammar or rephrase your script, but remain blind to delivery. They cannot tell you if you're breaking eye contact, speaking too quickly, or sounding timid under scrutiny.
            </p>
            <p className="text-slate-600 leading-relaxed text-base">
              SpeakUp.ai solves this by evaluating human delivery holistically: combining speech prosody, visual posture, script structure, and hands-free interactive Q&A.
            </p>
          </div>

          {/* Key Principles */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-slate-100">
            <div className="space-y-2">
              <h3 className="font-bold text-slate-900 text-base">01. Craftsmanship First</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Every interaction, waveform animation, and score breakdown is built with intention and quiet confidence.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-slate-900 text-base">02. On-Device Privacy</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Sensitive pitch decks and research data should never leave your machine. LiteRT enables 100% offline coaching.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-slate-900 text-base">03. Actionable Coaching</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                We don't just point out errors—we explain why they matter and provide exact Script Doctor rewrites.
              </p>
            </div>
          </div>
        </div>

        {/* Technology Architecture Section */}
        <div className="max-w-5xl mx-auto space-y-8 bg-slate-900 text-white p-8 sm:p-14 rounded-3xl shadow-lg mb-16">
          <div className="space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-indigo-400 font-semibold">
              Technical Stack & Engineering
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight">Built on Google Gemma 4</h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Below is the core architecture powering our real-time video demuxing, ASR transcription, and multimodal Gemma 4 reasoning pipeline.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 text-xs font-mono">
            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80 space-y-2">
              <span className="text-indigo-400 font-bold">REASONING ENGINE</span>
              <p className="text-slate-300 text-sm">Google Gemma 4 (31B IT Cloud / 26B A4B IT Cloud / E2B LiteRT Local Server)</p>
            </div>

            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80 space-y-2">
              <span className="text-emerald-400 font-bold">SPEECH RECOGNITION (ASR)</span>
              <p className="text-slate-300 text-sm">Faster-Whisper int8 / Groq Cloud Whisper API (whisper-large-v3-turbo)</p>
            </div>

            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80 space-y-2">
              <span className="text-purple-400 font-bold">MEDIA DEMUXER</span>
              <p className="text-slate-300 text-sm">FFmpeg 16kHz Mono PCM Audio Demuxer & Vision Frame Extractor</p>
            </div>

            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80 space-y-2">
              <span className="text-amber-400 font-bold">SPEECH SYNTHESIS (TTS)</span>
              <p className="text-slate-300 text-sm">Microsoft Edge Neural TTS / Native PCM Audio Synthesizer</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center max-w-xl mx-auto space-y-4">
          <Link
            to="/app"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-slate-900 text-white font-medium hover:bg-slate-800 transition-colors"
          >
            <span>Launch Application Experience</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
};
