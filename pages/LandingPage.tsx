import React from 'react';
import { Link } from '../components/Router';
import { 
  ArrowRight, 
  Play, 
  ShieldCheck, 
  Zap, 
  Cpu, 
  Mic, 
  Video, 
  Eye, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  Lock, 
  Github, 
  ChevronRight,
  TrendingUp,
  Award,
  UserCheck,
  FileText,
  BarChart3,
  MessageSquare
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* ---------------------------------------------------------------- border */}
      {/* HERO SECTION */}
      {/* ---------------------------------------------------------------- */}
      <section className="relative pt-24 pb-16 md:pt-28 md:pb-24 overflow-hidden">
        {/* Subtle grid accent background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f015_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f015_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Headline */}
          <div className="text-center max-w-4xl mx-auto space-y-6">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 leading-[1.08]">
              Master the room <br className="hidden sm:inline" />
              <span className="text-slate-500">before you step into it.</span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
              SpeakUp.ai is an AI communication coach powered by <strong>Google Gemma 4</strong>. It watches how you present—evaluating speech prosody, eye contact, posture, and script structure—to build genuine delivery confidence.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                to="/app"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-base transition-all duration-200 shadow-md hover:shadow-lg group"
              >
                <span>Open Application</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <a
                href="https://github.com/Icekid35/speakup-ai"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-medium text-base transition-all duration-200 shadow-xs"
              >
                <Github className="w-5 h-5 text-slate-800" />
                <span>View Source on GitHub</span>
              </a>
            </div>

            {/* Key Trust Signals */}
            <div className="flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-slate-500 pt-3">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> 100% Free & Open Source
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Runs On-Device via LiteRT
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Zero Account Required
              </span>
            </div>
          </div>

          {/* Hero Application Showcase (Real App Screenshot 197e26026628908ca8aa3d5eb22b758f.png) */}
          <div className="mt-16 sm:mt-20 max-w-6xl mx-auto">
            <div className="relative rounded-2xl bg-slate-900/5 p-2 sm:p-3 ring-1 ring-slate-900/10 shadow-2xl">
              
              {/* Browser Window Header */}
              <div className="bg-white rounded-t-xl px-3 sm:px-4 py-2.5 sm:py-3 border-b border-slate-200/80 flex items-center justify-between gap-2 overflow-hidden">
                <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-slate-300 shrink-0"></div>
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-slate-300 shrink-0"></div>
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-slate-300 shrink-0"></div>
                  <span className="ml-1 sm:ml-2 text-[10px] sm:text-xs font-mono text-slate-400 truncate max-w-[130px] xs:max-w-[200px] sm:max-w-none">speakup-ai.onrender.com/app</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[9px] sm:text-[11px] font-mono text-emerald-600 bg-emerald-50 px-1.5 sm:px-2 py-0.5 rounded border border-emerald-200 font-medium whitespace-nowrap">
                    Studio Stage • Live Evaluation
                  </span>
                </div>
              </div>

              {/* Application Hero Screenshot */}
              <div className="overflow-hidden rounded-b-xl bg-slate-100 relative group">
                <img
                  src="/app-images/197e26026628908ca8aa3d5eb22b758f.png"
                  alt="SpeakUp.ai Studio Stage Video Viewfinder with color-coded delivery timeline"
                  className="w-full h-auto object-cover rounded-b-xl transition-transform duration-500 group-hover:scale-[1.005]"
                  loading="eager"
                />

                {/* Interactive Overlay Badge */}
                <div className="absolute bottom-6 right-6 bg-slate-900/90 backdrop-blur-md text-white px-4 py-2.5 rounded-xl border border-slate-700/60 shadow-lg hidden sm:flex items-center gap-3 text-xs">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Real-time Pace, Posture & Eye Contact Diagnostics</span>
                  <Link to="/app" className="text-indigo-400 font-semibold hover:text-indigo-300 ml-1">
                    Try Live →
                  </Link>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* THE PROBLEM STORY SECTION */}
      {/* ---------------------------------------------------------------- */}
      <section className="py-24 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
            <h2 className="text-xs font-mono uppercase tracking-widest text-indigo-600 font-semibold">
              The Communication Gap
            </h2>
            <h3 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900">
              Most people aren't afraid of failing. <br />
              <span className="text-slate-500 font-normal">They're afraid of being seen failing.</span>
            </h3>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
              Nobody ever taught us how to communicate under pressure. Professional coaches cost hundreds of dollars an hour, practice requires another person, and progress is hard to measure.
            </p>
          </div>

          {/* Real Human Stories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            
            {/* Story 1: Sarah */}
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4 relative flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                  01
                </div>
                <h4 className="text-xl font-semibold text-slate-900">The Final-Year Defense</h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Sarah spent three years building her engineering project. She understood every line of code. But when she walked into the defense room, she spoke faster than her thoughts, avoided eye contact, and said "um" fourteen times in two minutes. The committee gave her a C.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-200 text-xs font-medium text-indigo-600">
                Fixes: Speech prosody & eye contact alignment
              </div>
            </div>

            {/* Story 2: The Founder */}
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4 relative flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                  02
                </div>
                <h4 className="text-xl font-semibold text-slate-900">The Startup Pitch</h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Marcus had strong revenue metrics and a working product. But during investor meetings, he rushed through his pitch deck without pausing for key moments, making his team sound uncertain. Investors passed despite the strong numbers.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-200 text-xs font-medium text-indigo-600">
                Fixes: Script Doctor rewrite & audience calibration
              </div>
            </div>

            {/* Story 3: The Job Candidate */}
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4 relative flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                  03
                </div>
                <h4 className="text-xl font-semibold text-slate-900">The Technical Interview</h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Alex aced every coding test easily. But during behavioral interviews, he struggled to structure his answers using the STAR method, giving rambling explanations that obscured his technical leadership skills.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-200 text-xs font-medium text-indigo-600">
                Fixes: Hands-free STAR Practice Examiner
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* PRODUCT SHOWCASE (APPLE-LEVEL ASYMMETRICAL GRID) */}
      {/* ---------------------------------------------------------------- */}
      <section className="py-24 md:py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-20">
            <span className="text-xs font-mono uppercase tracking-widest text-indigo-600 font-semibold">
              Product Capabilities
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900">
              Built like a precision Instrument. <br />
              <span className="text-slate-500 font-normal">Designed for real growth.</span>
            </h2>
            <p className="text-slate-600 text-base sm:text-lg">
              Explore how SpeakUp.ai combines speech recognition, visual reasoning, and holistic script doctoring into one unified workflow.
            </p>
          </div>

          {/* Grid of Real Application Screenshots */}
          <div className="space-y-16">
            
            {/* Feature Showcase 1: Multimodal Presentation Analysis */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-5">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                  Multimodal Presentation Diagnostics
                </h3>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  Upload any presentation clip. SpeakUp.ai breaks down your talk into continuous timeline segments, evaluating vocal energy, eye contact consistency, posture alignment, and original phrasing against an optimized Script Doctor rewrite.
                </p>

                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-3 text-sm text-slate-700">
                    <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                    <span><strong>Overall Speech Rating:</strong> Segment-level scores across Speech Style, Tone & Pace, and Body Language.</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-slate-700">
                    <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                    <span><strong>Script Doctor Alignment:</strong> Side-by-side comparison of "What You Said" vs "AI Script Rewrite".</span>
                  </div>
                </div>

                <div className="pt-4">
                  <Link to="/app" className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700">
                    <span>Try Speech Analysis Stage</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Real App Screenshot 17824ce9545d10e66fed9a0ff4e9601c.png */}
              <div className="lg:col-span-7 rounded-2xl bg-slate-900/5 p-2 border border-slate-200 overflow-hidden shadow-lg">
                <img
                  src="/app-images/17824ce9545d10e66fed9a0ff4e9601c.png"
                  alt="SpeakUp.ai Speech Diagnostics Dashboard showing overall speech rating, segment playlist, and script doctor rewrites"
                  className="w-full h-auto rounded-xl object-cover"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Feature Showcase 2: Hands-Free STAR Practice Examiner */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Real App Screenshot e335a34778d9c0ecb98be94b53472093.png */}
              <div className="lg:col-span-7 order-2 lg:order-1 rounded-2xl bg-slate-900/5 p-2 border border-slate-200 overflow-hidden shadow-lg">
                <img
                  src="/app-images/e335a34778d9c0ecb98be94b53472093.png"
                  alt="SpeakUp.ai Hands-Free AI Practice Examiner interface with animated voice practice orb"
                  className="w-full h-auto rounded-xl object-cover"
                  loading="lazy"
                />
              </div>

              <div className="lg:col-span-5 order-1 lg:order-2 space-y-5">
                <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
                  <Mic className="w-5 h-5" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                  Hands-Free AI Practice Examiner
                </h3>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  Simulate realistic final-year project defenses, PhD vivas, YC investor pitches, or technical job interviews hands-free. Speaks out loud to you, listens via Web Speech API, and automatically detects when you finish speaking.
                </p>

                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-3 text-sm text-slate-700">
                    <CheckCircle2 className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                    <span><strong>STAR Method Framework:</strong> Evaluates responses for Situation, Task, Action, and Result completeness.</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-slate-700">
                    <CheckCircle2 className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                    <span><strong>Silence Auto-Submit:</strong> No clicking buttons—just speak naturally, pause, and the AI responds.</span>
                  </div>
                </div>

                <div className="pt-4">
                  <Link to="/app" className="inline-flex items-center gap-2 text-sm font-semibold text-purple-600 hover:text-purple-700">
                    <span>Launch AI Examiner Stage</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

            </div>

            {/* Feature Showcase 3: Performance Report & Spoken Debrief */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-5">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                  <Award className="w-5 h-5" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                  Performance Reports & Spoken Debrief
                </h3>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  At the end of your session, SpeakUp.ai synthesizes a complete performance scorecard with strengths, priority improvements, strategic advice, and a spoken debrief delivered out loud by an executive coach.
                </p>

                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-3 text-sm text-slate-700">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>STAR Performance Score:</strong> Clear 0-100 scoring based on domain accuracy and delivery poise.</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-slate-700">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Spoken Examiner Debrief:</strong> Neural speech synthesis delivers verbal coaching directly to your ears.</span>
                  </div>
                </div>

                <div className="pt-4">
                  <Link to="/app" className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 hover:text-emerald-700">
                    <span>View Sample Reports</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Real App Screenshot f4a87c7e4b779aa15ea1d91c3ecc8447.png */}
              <div className="lg:col-span-7 rounded-2xl bg-slate-900/5 p-2 border border-slate-200 overflow-hidden shadow-lg">
                <img
                  src="/app-images/f4a87c7e4b779aa15ea1d91c3ecc8447.png"
                  alt="SpeakUp.ai Performance Report showing 85/100 score, examiner debrief quote, strengths and areas to improve"
                  className="w-full h-auto rounded-xl object-cover"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Feature Showcase 4: Script Rewriter & Model Engine Selector (Side-by-Side Cards) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Card 4A: Script Rewriter (d0560cec5db2e3d01d51b03506b6bc67.png) */}
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                    Audience-Calibrated Script Doctor
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Transform rough bullet points into memorable, persuasive scripts tailored to your specific audience—whether pitching venture capitalists, presenting to a thesis committee, or addressing a keynote audience.
                  </p>
                </div>

                <div className="rounded-xl bg-slate-900/5 p-2 border border-slate-200 overflow-hidden shadow-sm">
                  <img
                    src="/app-images/d0560cec5db2e3d01d51b03506b6bc67.png"
                    alt="SpeakUp.ai Script Rewriter Modal with audience calibration options"
                    className="w-full h-auto rounded-lg object-cover"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Card 4B: Model Selection & On-Device Control (485b2e243ac314b5575acbc11fa0507c.png) */}
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                    On-Device LiteRT & Cloud Model Engine
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Choose between local <strong>Gemma 4 E2B</strong> running on your machine via LiteRT for zero-bandwidth offline privacy, or switch to <strong>Gemma 4 31B IT</strong> on Google Cloud for maximum reasoning depth.
                  </p>
                </div>

                <div className="rounded-xl bg-slate-900/5 p-2 border border-slate-200 overflow-hidden shadow-sm">
                  <img
                    src="/app-images/485b2e243ac314b5575acbc11fa0507c.png"
                    alt="SpeakUp.ai Model Selector Engine Modal featuring local Gemma 4 E2B and cloud Gemma models"
                    className="w-full h-auto rounded-lg object-cover"
                    loading="lazy"
                  />
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* HOW IT WORKS (MINIMAL TIMELINE) */}
      {/* ---------------------------------------------------------------- */}
      <section className="py-24 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-20">
            <span className="text-xs font-mono uppercase tracking-widest text-indigo-600 font-semibold">
              Simple Four-Step Workflow
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900">
              How SpeakUp.ai Works
            </h2>
            <p className="text-slate-600 text-base sm:text-lg">
              From raw presentation video to polished speech delivery in minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative max-w-6xl mx-auto">
            
            {/* Step 1 */}
            <div className="space-y-4 relative">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-mono font-bold text-lg shadow-sm">
                01
              </div>
              <h3 className="text-lg font-bold text-slate-900">Upload or Record</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Record your talk live in the browser webcam stage or upload an existing MP4/MOV presentation video file.
              </p>
            </div>

            {/* Step 2 */}
            <div className="space-y-4 relative">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-mono font-bold text-lg shadow-sm">
                02
              </div>
              <h3 className="text-lg font-bold text-slate-900">Demux & Transcribe</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                FFmpeg extracts 16kHz mono audio and visual frames. Faster-Whisper or Groq Cloud generates a word-for-word transcript.
              </p>
            </div>

            {/* Step 3 */}
            <div className="space-y-4 relative">
              <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-mono font-bold text-lg shadow-sm">
                03
              </div>
              <h3 className="text-lg font-bold text-slate-900">Gemma 4 Multimodal Analysis</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Google Gemma 4 evaluates posture, eye contact, speech prosody, and overall script structure as one continuous narrative.
              </p>
            </div>

            {/* Step 4 */}
            <div className="space-y-4 relative">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-mono font-bold text-lg shadow-sm">
                04
              </div>
              <h3 className="text-lg font-bold text-slate-900">Review & Practice</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Hear spoken debrief feedback out loud, review Script Doctor rewrites, and practice until you feel completely ready.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* WHY GOOGLE GEMMA 4 (TECHNICAL DEEP DIVE) */}
      {/* ---------------------------------------------------------------- */}
      <section className="py-24 md:py-32 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-20">
            <span className="text-xs font-mono uppercase tracking-widest text-indigo-400 font-semibold">
              The AI Reasoning Core
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
              Why We Built Around Google Gemma 4
            </h2>
            <p className="text-slate-400 text-base sm:text-lg">
              The choice of Gemma 4 wasn't incidental. Human communication requires reasoning across spoken words, body posture, and emotional tone simultaneously.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Multimodal Reasoning</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Gemma 4 evaluates speech transcripts alongside compressed video frames in a single context window, preventing fragmented out-of-context comments.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">On-Device Privacy (LiteRT)</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                With <code>gemma-4-e2b</code> running locally on LiteRT, your confidential presentations, pitch decks, and research never leave your laptop.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Holistic Script Doctor</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                First rewrites your speech as one continuous, flowing presentation script, then works backwards to annotate individual timeline segments.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Flexible Cloud Scaling</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Seamlessly scale up to <code>gemma-4-31b-it</code> or <code>gemma-4-26b-a4b-it</code> via Google Cloud API for maximum reasoning depth when connected.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* BUILT FOR EVERYONE (PERSONAS) */}
      {/* ---------------------------------------------------------------- */}
      <section className="py-24 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-indigo-600 font-semibold">
              Versatile Coaching
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900">
              Built for Every High-Stakes Moment
            </h2>
            <p className="text-slate-600 text-base sm:text-lg">
              Whether defending years of research or pitching your first startup, SpeakUp.ai adapts to your context.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <h3 className="text-lg font-bold text-slate-900">Students & Researchers</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Practice capstone project defenses and thesis presentations. Prepare for tough committee Q&A without feeling overwhelmed.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <h3 className="text-lg font-bold text-slate-900">Founders & Entrepreneurs</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Hone investor pitch decks, YC demo day presentations, and customer negotiation talks for maximum clarity and poise.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <h3 className="text-lg font-bold text-slate-900">Job Candidates</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Master STAR behavioral responses and technical explanations. Build confidence before interviews at top technology firms.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <h3 className="text-lg font-bold text-slate-900">Public Speakers & Leaders</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Refine keynote speeches, all-hands addresses, and panel discussions with segment-level vocal energy feedback.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* FINAL CALL TO ACTION */}
      {/* ---------------------------------------------------------------- */}
      <section className="py-24 md:py-32 bg-slate-50 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 space-y-8 relative z-10">
          
          <h2 className="text-4xl sm:text-6xl font-bold tracking-tight text-slate-900 leading-tight">
            Ready to own the room?
          </h2>
          
          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto font-normal">
            Start practicing in your browser right now. No credit card, account registration, or download required.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              to="/app"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-lg transition-all duration-200 shadow-lg hover:shadow-xl group"
            >
              <span>Open Application</span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>

            <a
              href="https://github.com/Icekid35/speakup-ai"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 font-medium text-lg transition-all duration-200 shadow-xs"
            >
              <Github className="w-5 h-5 text-slate-900" />
              <span>Explore GitHub Code</span>
            </a>
          </div>

          <p className="text-xs text-slate-500 pt-2 font-mono">
            SpeakUp.ai • Multimodal Speaking Intelligence & Executive Presence AI
          </p>
        </div>
      </section>

    </div>
  );
};
