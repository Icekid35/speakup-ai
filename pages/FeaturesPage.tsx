import React from 'react';
import { Link } from '../components/Router';
import { 
  ArrowRight, 
  BarChart3, 
  Mic, 
  Award, 
  FileText, 
  Cpu, 
  Eye, 
  ShieldCheck, 
  Zap, 
  Layers,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export const FeaturesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-20">
          <span className="text-xs font-mono uppercase tracking-widest text-indigo-600 font-semibold">
            Product Capabilities & Architecture
          </span>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-slate-900">
            Features Built for Delivery Excellence
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed font-normal">
            A comprehensive tour of SpeakUp.ai's multimodal analysis, hands-free interview simulation, script doctoring, and on-device privacy engine.
          </p>
        </div>

        {/* Feature 1: Multimodal Diagnostics */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 mb-16 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-mono font-semibold border border-indigo-100">
                <BarChart3 className="w-3.5 h-3.5" /> Stage 01 • Multimodal Diagnostics
              </div>
              <h2 className="text-3xl font-bold text-slate-900">
                Holistic Speech & Visual Evaluation
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                Rather than treating audio and video as isolated channels, SpeakUp.ai evaluates your talk as one continuous narrative. It breaks your presentation into 5 balanced timeline segments, rating Speech Style, Tone & Pace, and Body Posture.
              </p>

              <div className="space-y-3 pt-2 text-sm text-slate-700">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                  <span><strong>Segment Timeline Playlist:</strong> Jump directly to any 5-chapter timeline segment to review what you said.</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                  <span><strong>Script Doctor Rewrites:</strong> Instant professional script doctor rewrites aligned to each segment.</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                  <span><strong>Physical Delivery Cues:</strong> Specific advice on eye contact, hand positioning, and pause timing.</span>
                </div>
              </div>

              <div className="pt-4">
                <Link to="/app" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white font-medium text-sm hover:bg-slate-800 transition-colors">
                  <span>Open Studio Stage</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7 rounded-2xl bg-slate-900/5 p-2 border border-slate-200 overflow-hidden shadow-lg">
              <img
                src="/app-images/17824ce9545d10e66fed9a0ff4e9601c.png"
                alt="SpeakUp.ai Multimodal Diagnostics View"
                className="w-full h-auto rounded-xl object-cover"
              />
            </div>
          </div>
        </div>

        {/* Feature 2: Hands-Free STAR Practice Examiner */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 mb-16 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 order-2 lg:order-1 rounded-2xl bg-slate-900/5 p-2 border border-slate-200 overflow-hidden shadow-lg">
              <img
                src="/app-images/e335a34778d9c0ecb98be94b53472093.png"
                alt="SpeakUp.ai Hands-Free AI Practice Examiner Stage"
                className="w-full h-auto rounded-xl object-cover"
              />
            </div>

            <div className="lg:col-span-5 order-1 lg:order-2 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-mono font-semibold border border-purple-100">
                <Mic className="w-3.5 h-3.5" /> Stage 02 • Hands-Free Examiner
              </div>
              <h2 className="text-3xl font-bold text-slate-900">
                Interactive Mock Interview Simulator
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                Simulate realistic job interviews, final-year project defenses, or investor Q&A panels. The AI speaks out loud to you using neural speech synthesis, listens via microphone, and auto-submits your response when you pause.
              </p>

              <div className="space-y-3 pt-2 text-sm text-slate-700">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                  <span><strong>STAR Method Evaluation:</strong> Analyzes responses for Situation, Task, Action, and Result completeness.</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                  <span><strong>Hands-Free Silence Detection:</strong> Automatic turn-taking without manual button presses.</span>
                </div>
              </div>

              <div className="pt-4">
                <Link to="/app" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 text-white font-medium text-sm hover:bg-purple-700 transition-colors">
                  <span>Launch Practice Examiner</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Feature 3: Examiner Performance Report */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 mb-16 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-mono font-semibold border border-emerald-100">
                <Award className="w-3.5 h-3.5" /> Stage 03 • Performance Reports
              </div>
              <h2 className="text-3xl font-bold text-slate-900">
                Comprehensive Debrief & Spoken Review
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                Upon finishing a session, receive an executive performance scorecard highlighting your overall score, examiner debrief quote, core strengths, and strategic advice for your next talk.
              </p>

              <div className="space-y-3 pt-2 text-sm text-slate-700">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Spoken Examiner Review:</strong> Hear your coach's verbal debrief directly out loud.</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Actionable Strengths & Fixes:</strong> Clear bullet points detailing what went well and what to refine.</span>
                </div>
              </div>

              <div className="pt-4">
                <Link to="/app" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-medium text-sm hover:bg-emerald-700 transition-colors">
                  <span>Test Examiner Reports</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7 rounded-2xl bg-slate-900/5 p-2 border border-slate-200 overflow-hidden shadow-lg">
              <img
                src="/app-images/f4a87c7e4b779aa15ea1d91c3ecc8447.png"
                alt="SpeakUp.ai Performance Report & Spoken Debrief"
                className="w-full h-auto rounded-xl object-cover"
              />
            </div>
          </div>
        </div>

        {/* Feature Grid: Script Rewriter & Model Selector */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm space-y-6">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Script Rewriter & Pitch Calibrator</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Paste rough bullet points or initial presentation drafts. Calibrate tone for VC pitches, academic defenses, or keynotes.
            </p>
            <div className="rounded-xl border border-slate-200 overflow-hidden">
              <img src="/app-images/d0560cec5db2e3d01d51b03506b6bc67.png" alt="Script Rewriter Modal" className="w-full h-auto" />
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm space-y-6">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">On-Device & Cloud Model Routing</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Switch effortlessly between local <strong>Gemma 4 E2B</strong> (LiteRT) for offline privacy, or <strong>Gemma 4 31B IT</strong> on Google Cloud.
            </p>
            <div className="rounded-xl border border-slate-200 overflow-hidden">
              <img src="/app-images/485b2e243ac314b5575acbc11fa0507c.png" alt="AI Model Selection Modal" className="w-full h-auto" />
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="bg-slate-900 rounded-3xl p-10 sm:p-16 text-center text-white space-y-6">
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight">Experience SpeakUp.ai Today</h2>
          <p className="text-slate-400 text-base max-w-xl mx-auto">
            Ready to test your presentation delivery? Jump directly into the application stage.
          </p>
          <div>
            <Link to="/app" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white text-slate-900 font-semibold hover:bg-slate-100 transition-colors">
              <span>Open Application →</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
