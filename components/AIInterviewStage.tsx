import React, { useState, useEffect, useRef } from 'react';
import {
  Play, Mic, RefreshCw, CheckCircle2, AlertTriangle, UserCheck,
  Bot, Volume2, Square, Award, ArrowRight, RotateCcw, ChevronDown, Sparkles, X, Brain
} from 'lucide-react';
import { fetchInterviewStep, fetchInterviewSummary, InterviewSummaryResponse } from '../services/geminiService';
import { base64ToAudioBlob } from '../services/ttsService';

/** Three bouncing dots — shown while the AI is generating a response */
const ThinkingDots: React.FC = () => (
  <div className="flex items-center gap-1">
    {[0, 1, 2].map(i => (
      <span
        key={i}
        className="w-2 h-2 rounded-full bg-indigo-500"
        style={{ animation: `bounce 1s ${i * 0.18}s infinite` }}
      />
    ))}
    <style>{`@keyframes bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-6px)}}`}</style>
  </div>
);

interface AIInterviewStageProps {
  onExit: () => void;
}

const ROLES = [
  {
    group: 'Academic',
    options: [
      { value: '🎓 Student: Final Year Project Defense Practice', label: 'Final Year Project Defense' },
      { value: '🎓 Student: Thesis & Master\'s Dissertation Defense', label: 'Master\'s Thesis Defense' },
      { value: '🎓 Student: PhD Viva Voce & Research Examination', label: 'PhD Viva Voce' },
      { value: '🎓 Student: Scholarship & University Admissions Interview', label: 'Scholarship Interview' },
      { value: '🎓 Student: Graduate Internship & Entry-Level Role', label: 'Graduate Internship' },
    ],
  },
  {
    group: 'Professional',
    options: [
      { value: 'Senior Product Manager', label: 'Senior Product Manager' },
      { value: 'Software Architect / Staff Engineer', label: 'Software Architect' },
      { value: 'Startup Founder / CEO Pitch', label: 'Startup Founder Pitch' },
      { value: 'Executive Management Consultant', label: 'Management Consultant' },
      { value: 'Behavioral Leadership & HR Interview', label: 'Leadership & HR Interview' },
    ],
  },
];

const PANELS = [
  { value: 'Academic Evaluation Committee & Faculty Panel', label: 'Faculty Panel' },
  { value: 'Strict Defense Examination Board', label: 'Strict Examination Board' },
  { value: 'Tier 1 Tech (FAANG / Unicorn)', label: 'FAANG / Tier 1 Tech' },
  { value: 'Fast-Growing Early Stage Startup', label: 'Early-Stage Startup' },
  { value: 'Fortune 500 Corporate Board', label: 'Fortune 500 Board' },
  { value: 'Venture Capital Pitch Assessment', label: 'VC Pitch Panel' },
];

export const AIInterviewStage: React.FC<AIInterviewStageProps> = ({ onExit }) => {
  const [role, setRole] = useState('🎓 Student: Final Year Project Defense Practice');
  const [companyTier, setCompanyTier] = useState('Academic Evaluation Committee & Faculty Panel');
  const [isStarted, setIsStarted] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isCandidateSpeaking, setIsCandidateSpeaking] = useState(false);
  const [isSpeechEndDetected, setIsSpeechEndDetected] = useState(false);

  const [history, setHistory] = useState<Array<{ question: string; answer: string; evaluation?: any }>>([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [userTranscript, setUserTranscript] = useState('');
  const [lastEvaluation, setLastEvaluation] = useState<any>(null);
  const [coachTip, setCoachTip] = useState('');
  const [summaryReport, setSummaryReport] = useState<InterviewSummaryResponse | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const silenceTimerRef = useRef<any>(null);
  const isEvaluatingRef = useRef(false);
  const isPlayingAudioRef = useRef(false);
  const userTranscriptRef = useRef('');

  useEffect(() => {
    isEvaluatingRef.current = isEvaluating || isGeneratingSummary;
    isPlayingAudioRef.current = isPlayingAudio;
    userTranscriptRef.current = userTranscript;
  }, [isEvaluating, isGeneratingSummary, isPlayingAudio, userTranscript]);

  useEffect(() => {
    return () => {
      if (stream) stream.getTracks().forEach(t => t.stop());
      try { recognitionRef.current?.stop(); } catch (e) {}
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    };
  }, [stream]);

  const initSpeechRecognition = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    try {
      try { recognitionRef.current?.stop(); } catch (e) {}
      const recognition = new SR();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      recognition.onstart = () => setIsCandidateSpeaking(true);
      recognition.onresult = (event: any) => {
        if (isPlayingAudioRef.current || isEvaluatingRef.current) return;
        let text = '';
        for (let i = 0; i < event.results.length; i++) text += event.results[i][0].transcript + ' ';
        const cleaned = text.trim();
        setUserTranscript(cleaned);
        if (cleaned.length > 0) {
          if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
          setIsSpeechEndDetected(false); // reset — user is still speaking
          silenceTimerRef.current = setTimeout(() => {
            if (!isEvaluatingRef.current && !isPlayingAudioRef.current && userTranscriptRef.current.trim().length > 3) {
              setIsSpeechEndDetected(true); // pause detected — show indicator before submit
              handleAutoSubmitAnswer();
            }
          }, 1800);
        }
      };
      recognition.onend = () => {
        setIsCandidateSpeaking(false);
        if (isStarted && !isPlayingAudioRef.current && !isEvaluatingRef.current && !summaryReport) {
          try { recognition.start(); } catch (e) {}
        }
      };
      recognition.start();
      recognitionRef.current = recognition;
    } catch (e) { console.warn('Speech recognition warning:', e); }
  };

  const startInterview = async () => {
    setIsStarted(true);
    setIsEvaluating(true);
    setSummaryReport(null);
    setHistory([]);
    try {
      const userStream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
      setStream(userStream);
      const res = await fetchInterviewStep(role, companyTier, [], 'Start interview with opening question.');
      setCurrentQuestion(res.nextQuestion);
      setCoachTip(res.coachTip);
      if (res.base64Audio) playQuestionAudio(res.base64Audio);
      else { setIsEvaluating(false); initSpeechRecognition(); }
    } catch (err) {
      console.error('Failed to start interview:', err);
      alert('Could not access microphone or fetch initial question.');
      setIsEvaluating(false);
    }
  };

  const playQuestionAudio = (base64Audio: string, onEndedCallback?: () => void) => {
    try {
      try { recognitionRef.current?.stop(); } catch (e) {}
      setIsPlayingAudio(true);

      const blob = base64ToAudioBlob(base64Audio);
      const url = URL.createObjectURL(blob);

      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.play().then(() => {
          audioRef.current!.onended = () => {
            setIsPlayingAudio(false);
            setIsEvaluating(false);
            if (onEndedCallback) onEndedCallback();
            else initSpeechRecognition();
          };
        }).catch((playErr) => {
          console.warn("Audio playback exception, proceeding:", playErr);
          setIsPlayingAudio(false);
          setIsEvaluating(false);
          if (onEndedCallback) onEndedCallback();
          else initSpeechRecognition();
        });
      } else {
        setIsPlayingAudio(false);
        setIsEvaluating(false);
      }
    } catch (e) {
      console.error("Audio error:", e);
      setIsPlayingAudio(false);
      setIsEvaluating(false);
      if (onEndedCallback) onEndedCallback();
      else initSpeechRecognition();
    }
  };

  const handleAutoSubmitAnswer = async () => {
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    try { recognitionRef.current?.stop(); } catch (e) {}
    const answerText = userTranscriptRef.current.trim();
    if (!answerText) return;
    setIsSpeechEndDetected(false);
    setIsEvaluating(true);
    try {
      const updatedHistory = [...history, { question: currentQuestion, answer: answerText, evaluation: lastEvaluation }];
      const res = await fetchInterviewStep(role, companyTier, updatedHistory, answerText);
      setLastEvaluation(res.evaluation); setCoachTip(res.coachTip);
      setCurrentQuestion(res.nextQuestion); setHistory(updatedHistory);
      setUserTranscript(''); setIsSpeechEndDetected(false);
      if (res.base64Audio) playQuestionAudio(res.base64Audio);
      else { setIsEvaluating(false); initSpeechRecognition(); }
    } catch (err) {
      console.error('Error submitting answer:', err);
      setIsEvaluating(false); initSpeechRecognition();
    }
  };

  const handleEndInterview = async () => {
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    try { recognitionRef.current?.stop(); } catch (e) {}
    const finalHistory = [...history];
    if (userTranscript.trim() && currentQuestion) {
      finalHistory.push({ question: currentQuestion, answer: userTranscript.trim(), evaluation: lastEvaluation });
    }
    setIsGeneratingSummary(true); setUserTranscript('');
    try {
      const summary = await fetchInterviewSummary(role, companyTier, finalHistory);
      setSummaryReport(summary); setIsGeneratingSummary(false);
      if (summary.base64Audio) playQuestionAudio(summary.base64Audio, () => setIsPlayingAudio(false));
    } catch (err) {
      console.error('Failed to generate summary:', err);
      alert('Could not generate interview summary report.');
      setIsGeneratingSummary(false);
    }
  };

  // ─── Derived state ───────────────────────────────────────────────────────────
  const statusLabel = isGeneratingSummary
    ? 'Generating report…'
    : isPlayingAudio
    ? 'Examiner speaking…'
    : isEvaluating
    ? 'AI is thinking…'
    : isSpeechEndDetected
    ? 'End of speech detected'
    : isCandidateSpeaking
    ? 'Listening…'
    : 'Ready — speak your answer';

  const orbColor = isPlayingAudio
    ? 'from-emerald-400 to-teal-500 shadow-[0_0_50px_rgba(52,211,153,0.3)]'
    : isEvaluating || isGeneratingSummary
    ? 'from-violet-500 to-indigo-600 shadow-[0_0_50px_rgba(139,92,246,0.35)]'
    : isSpeechEndDetected
    ? 'from-amber-400 to-orange-500 shadow-[0_0_50px_rgba(251,146,60,0.35)]'
    : isCandidateSpeaking
    ? 'from-indigo-400 to-indigo-600 shadow-[0_0_50px_rgba(99,102,241,0.25)]'
    : 'from-slate-200 to-slate-300 shadow-none';

  const orbSpin = false; // no more spinning — too distracting
  const orbPulse = isPlayingAudio || isCandidateSpeaking || isSpeechEndDetected;

  const selectedRoleLabel = ROLES.flatMap(g => g.options).find(o => o.value === role)?.label || role;
  const selectedPanelLabel = PANELS.find(p => p.value === companyTier)?.label || companyTier;

  return (
    <div className="relative w-full max-w-2xl mx-auto flex flex-col min-h-[85vh]">
      <audio ref={audioRef} className="hidden" />

      {/* ── TOP NAV BAR ───────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between py-3 px-1 mb-2 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-bold text-slate-900">Practice Examiner</span>
          <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-bold uppercase border border-indigo-100 hidden sm:block">
            STAR METHOD
          </span>
        </div>
        <button
          onClick={onExit}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold transition-colors"
        >
          <X className="w-3.5 h-3.5" /> Exit
        </button>
      </div>

      {/* ── SETUP SCREEN ──────────────────────────────────────────────────────── */}
      {!isStarted ? (
        <div className="flex-1 flex flex-col justify-center px-1 py-4 space-y-6">
          {/* Icon + title */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200">
              <UserCheck className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Configure your session</h2>
            <p className="text-sm text-slate-400">Choose a role and panel, then go.</p>
          </div>

          {/* Selectors */}
          <div className="space-y-3">
            <div className="relative">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5 pl-1">
                Role / Scenario
              </label>
              <div className="relative">
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full appearance-none bg-white border border-slate-200 rounded-2xl pl-4 pr-10 py-3.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all shadow-sm"
                >
                  {ROLES.map(g => (
                    <optgroup key={g.group} label={g.group}>
                      {g.options.map(o => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div className="relative">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5 pl-1">
                Evaluation Panel
              </label>
              <div className="relative">
                <select
                  value={companyTier}
                  onChange={(e) => setCompanyTier(e.target.value)}
                  className="w-full appearance-none bg-white border border-slate-200 rounded-2xl pl-4 pr-10 py-3.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all shadow-sm"
                >
                  {PANELS.map(p => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Selected context pill */}
          <div className="flex flex-wrap gap-2 justify-center">
            <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-100">
              🎯 {selectedRoleLabel}
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-50 text-slate-600 text-xs font-semibold border border-slate-200">
              🏛 {selectedPanelLabel}
            </span>
          </div>

          <button
            onClick={startInterview}
            className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-extrabold text-sm flex items-center justify-center gap-2.5 transition-all shadow-lg shadow-indigo-200"
          >
            <Play className="w-4 h-4 fill-current" />
            Start Voice Session
          </button>

          <p className="text-center text-xs text-slate-400">
            Microphone access required · Hands-free detection enabled
          </p>
        </div>

      ) : summaryReport ? (
        /* ── SUMMARY / RESULTS SCREEN ─────────────────────────────────────── */
        <div className="flex-1 overflow-y-auto pb-4 space-y-4 animate-fade-in">
          {/* Score Hero */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 text-center shadow-sm">
            <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-indigo-600 mb-3">
              <Award className="w-3.5 h-3.5" /> Performance Report
            </div>
            <div className="text-6xl font-black text-indigo-600 mb-1 tabular-nums">
              {summaryReport.overallScore}
            </div>
            <div className="text-xs text-slate-400 mb-3">out of 100</div>
            <div className="text-lg font-bold text-slate-900">{summaryReport.ratingLabel}</div>
            <p className="text-xs text-slate-400 mt-1">{selectedRoleLabel} · {selectedPanelLabel}</p>
          </div>

          {/* Examiner debrief */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                <Volume2 className={`w-3.5 h-3.5 ${isPlayingAudio ? 'text-indigo-600 animate-bounce' : 'text-slate-400'}`} />
                Examiner Debrief
              </span>
              {summaryReport.base64Audio && (
                <button
                  onClick={() => summaryReport.base64Audio && playQuestionAudio(summaryReport.base64Audio)}
                  className="text-[10px] px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 font-bold transition-colors hover:bg-indigo-100"
                >
                  {isPlayingAudio ? 'Replaying…' : '▶ Replay'}
                </button>
              )}
            </div>
            <p className="text-sm text-slate-700 leading-relaxed italic">
              "{summaryReport.spokenDebrief}"
            </p>
          </div>

          {/* Strengths & Improvements */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-4 space-y-2.5">
              <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Strengths
              </div>
              <ul className="space-y-1.5">
                {summaryReport.strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-xs text-emerald-900 leading-snug">
                    <span className="w-1 h-1 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-amber-50 border border-amber-100 rounded-3xl p-4 space-y-2.5">
              <div className="text-[10px] font-bold uppercase tracking-widest text-amber-600 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Improve
              </div>
              <ul className="space-y-1.5">
                {summaryReport.improvements.map((s, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-xs text-amber-900 leading-snug">
                    <span className="w-1 h-1 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Examiner advice */}
          <div className="bg-indigo-50 border border-indigo-100 rounded-3xl p-4 space-y-1.5">
            <div className="text-[10px] font-bold uppercase tracking-widest text-indigo-500 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" /> Strategic Advice
            </div>
            <p className="text-xs text-indigo-900 leading-relaxed">{summaryReport.examinerAdvice}</p>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => { setSummaryReport(null); setIsStarted(false); setHistory([]); setLastEvaluation(null); }}
              className="flex-1 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm flex items-center justify-center gap-2 transition-colors"
            >
              <RotateCcw className="w-4 h-4" /> Again
            </button>
            <button
              onClick={onExit}
              className="flex-1 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-200"
            >
              Done <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      ) : (
        /* ── ACTIVE VOICE SESSION ─────────────────────────────────────────── */
        <div className="flex-1 flex flex-col gap-4">

          {/* Session context pill */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-semibold border border-slate-200">
              {selectedRoleLabel}
            </span>
            <span className="text-slate-300 text-xs">·</span>
            <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-semibold border border-slate-200">
              Q{history.length + 1}
            </span>
            <span className="text-slate-300 text-xs">·</span>
            <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
              isPlayingAudio
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : isEvaluating || isGeneratingSummary
                ? 'bg-violet-50 text-violet-700 border-violet-200'
                : isSpeechEndDetected
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : isCandidateSpeaking
                ? 'bg-blue-50 text-blue-700 border-blue-200'
                : 'bg-slate-50 text-slate-500 border-slate-200'
            }`}>
              {isEvaluating || isGeneratingSummary
                ? <><Brain className="w-2.5 h-2.5 inline mr-1" />AI thinking…</>
                : isSpeechEndDetected
                ? <>⏎ End detected — submitting…</>
                : statusLabel}
            </span>
          </div>

          {/* ── ORB ─────────────────────────────────────────────────────────── */}
          <div className="flex-1 bg-white border border-slate-100 rounded-3xl shadow-sm flex flex-col items-center justify-center gap-5 py-8 px-6 min-h-[260px]">
            {/* Orb */}
            <div className="relative flex items-center justify-center">
              {/* Outer ping ring */}
              {orbPulse && (
                <div className={`absolute w-28 h-28 rounded-full border-2 animate-ping opacity-20 ${
                  isPlayingAudio ? 'border-emerald-400' :
                  isSpeechEndDetected ? 'border-amber-400' : 'border-indigo-400'
                }`} />
              )}
              {/* Second slower ring for speaking */}
              {isCandidateSpeaking && (
                <div className="absolute w-32 h-32 rounded-full border border-indigo-200 animate-ping opacity-10" style={{ animationDuration: '1.5s' }} />
              )}
              <div
                className={`w-24 h-24 rounded-full bg-gradient-to-br ${orbColor} flex flex-col items-center justify-center transition-all duration-500`}
              >
                {isPlayingAudio ? (
                  <Volume2 className="w-9 h-9 text-white" />
                ) : isEvaluating || isGeneratingSummary ? (
                  <div className="flex flex-col items-center gap-2">
                    <Brain className="w-8 h-8 text-white" />
                    <ThinkingDots />
                  </div>
                ) : isSpeechEndDetected ? (
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-xl">✓</span>
                    <span className="text-[10px] text-white font-bold uppercase tracking-wide">Got it</span>
                  </div>
                ) : isCandidateSpeaking ? (
                  <Mic className="w-9 h-9 text-white" />
                ) : (
                  <Bot className="w-9 h-9 text-slate-400" />
                )}
              </div>
            </div>

            {/* Status text */}
            <div className="text-center space-y-1">
              <p className={`text-sm font-bold ${
                isEvaluating || isGeneratingSummary ? 'text-violet-700'
                : isSpeechEndDetected ? 'text-amber-700'
                : isPlayingAudio ? 'text-emerald-700'
                : 'text-slate-800'
              }`}>{statusLabel}</p>
              <p className="text-xs text-slate-400">
                {isPlayingAudio
                  ? 'Mic is paused while examiner speaks'
                  : isGeneratingSummary
                  ? 'Synthesizing your performance report…'
                  : isEvaluating
                  ? 'Gemma 4 is scoring your response'
                  : isSpeechEndDetected
                  ? 'Pause detected — sending your answer now'
                  : isCandidateSpeaking
                  ? 'Speak freely — auto-submits after your pause'
                  : 'Speak naturally — auto-detects when you pause'}
              </p>
            </div>

            {/* Live transcript */}
            {(userTranscript || isPlayingAudio) && (
              <div className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3">
                <div className="flex items-center justify-between text-[10px] font-bold uppercase text-slate-400 mb-1.5">
                  <span>Live Transcript</span>
                  {userTranscript && <span className="text-indigo-600">● Speaking</span>}
                </div>
                <p className="text-sm text-slate-800 leading-relaxed min-h-[1.5rem]">
                  {userTranscript || (isPlayingAudio ? 'Examiner is speaking…' : '')}
                </p>
              </div>
            )}
          </div>



          {/* ── LAST EVAL MINI-CARD ──────────────────────────────────────────── */}
          {lastEvaluation && (
            <div className="bg-white border border-slate-100 rounded-3xl shadow-sm px-5 py-4 flex items-center justify-between gap-4 animate-fade-in">
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  lastEvaluation.starScore >= 70 ? 'bg-emerald-100' : 'bg-amber-100'
                }`}>
                  {lastEvaluation.starScore >= 70
                    ? <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    : <AlertTriangle className="w-4 h-4 text-amber-600" />}
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Last Response</p>
                  <p className="text-xs text-slate-700 truncate">{lastEvaluation.strengths}</p>
                </div>
              </div>
              <div className="flex-shrink-0 text-right">
                <div className="text-lg font-black text-slate-900 tabular-nums">{lastEvaluation.starScore}</div>
                <div className="text-[10px] text-slate-400">/100</div>
              </div>
            </div>
          )}

          {/* ── END SESSION BUTTON ───────────────────────────────────────────── */}
          <button
            onClick={handleEndInterview}
            disabled={isGeneratingSummary}
            className="w-full py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 active:bg-black text-white font-bold text-sm flex items-center justify-center gap-2.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isGeneratingSummary ? (
              <><RefreshCw className="w-4 h-4 animate-spin" /> Generating Report…</>
            ) : (
              <><Square className="w-4 h-4 fill-current" /> End Session & Get Report</>
            )}
          </button>

        </div>
      )}
    </div>
  );
};
