import React, { useState } from 'react';
import { Sparkles, FileText, Play, RefreshCw, X, Target, ChevronDown, Zap, CheckCircle } from 'lucide-react';
import { fetchScriptDoctor, ScriptDoctorResponse } from '../services/geminiService';

interface ScriptDoctorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUseTeleprompterLines: (lines: any[]) => void;
}

const AUDIENCE_OPTIONS = [
  { value: 'Investors / VC Pitch', label: 'Investors / VC Pitch', emoji: '💼' },
  { value: 'TED / Conference Keynote', label: 'TED / Conference Keynote', emoji: '🎤' },
  { value: 'Executive Boardroom Presentation', label: 'Executive Boardroom', emoji: '🏢' },
  { value: 'Internal All-Hands / Team Motivation', label: 'All-Hands Meeting', emoji: '🙌' },
  { value: 'Academic / Thesis Defense', label: 'Academic / Thesis Defense', emoji: '🎓' },
  { value: 'General Professional', label: 'General Professional', emoji: '👔' },
];

export const ScriptDoctorModal: React.FC<ScriptDoctorModalProps> = ({
  isOpen,
  onClose,
  onUseTeleprompterLines,
}) => {
  const [rawDraft, setRawDraft] = useState<string>('');
  const [audience, setAudience] = useState<string>('Investors / VC Pitch');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<ScriptDoctorResponse | null>(null);

  if (!isOpen) return null;

  const hasApiKey = !!(
    localStorage.getItem('speakup_gemini_api_key') ||
    localStorage.getItem('aura_gemini_api_key')
  );
  const selectedModel = (
    localStorage.getItem('speakup_gemini_model') ||
    localStorage.getItem('aura_gemini_model') ||
    'gemma-4-e2b'
  );
  const usingCloud = hasApiKey && selectedModel !== 'gemma-4-e2b';

  const selectedAudienceOption = AUDIENCE_OPTIONS.find(o => o.value === audience);

  const handleOptimize = async () => {
    if (!rawDraft.trim()) return;
    setIsLoading(true);
    try {
      const res = await fetchScriptDoctor(rawDraft, audience);
      setResult(res);
    } catch (err: any) {
      console.error('Script Doctor Error:', err);
      const msg = err?.message || 'Could not process script. Check your connection and try again.';
      alert(`Script Doctor Error: ${msg}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyToTeleprompter = () => {
    if (result?.teleprompterLines) {
      onUseTeleprompterLines(result.teleprompterLines);
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/50 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Sheet / Modal */}
      <div className="relative w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[92vh] sm:max-h-[88vh] overflow-hidden">

        {/* Drag handle (mobile only) */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-slate-200" />
        </div>

        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between px-5 pt-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-sm shadow-indigo-200">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base font-bold text-slate-900 leading-tight">Script Rewriter</h2>
                <span className="text-[10px] bg-indigo-600 text-white px-2 py-0.5 rounded-full font-extrabold uppercase tracking-wide">
                  AI
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 leading-tight">
                Transform rough notes into high-impact language
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors flex-shrink-0"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Model indicator */}
        <div className={`flex-shrink-0 flex items-center gap-2 px-5 py-2.5 text-xs font-semibold border-b ${
          usingCloud
            ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
            : 'bg-slate-50 border-slate-100 text-slate-500'
        }`}>
          <Zap className="w-3.5 h-3.5 flex-shrink-0" />
          {usingCloud
            ? `Running on cloud: ${selectedModel}`
            : 'Running locally: Gemma 4 E2B · Add an API key to use cloud models'}
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {!result ? (
            <div className="p-5 space-y-5">
              {/* Audience Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                  Intended Audience
                </label>
                <div className="relative">
                  <select
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                    className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-2xl pl-4 pr-10 py-3.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all cursor-pointer"
                  >
                    {AUDIENCE_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>
                        {opt.emoji}  {opt.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
                {selectedAudienceOption && (
                  <p className="mt-1.5 text-xs text-slate-400 pl-1">
                    Tone will be calibrated for <span className="text-slate-600 font-medium">{selectedAudienceOption.label}</span>
                  </p>
                )}
              </div>

              {/* Script Input */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                  Your Draft or Bullet Points
                </label>
                <textarea
                  value={rawDraft}
                  onChange={(e) => setRawDraft(e.target.value)}
                  rows={7}
                  placeholder={`Paste your draft here…\n\nE.g. "So basically our app helps people speak better using AI and real-time feedback..."`}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-sm text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 font-sans leading-relaxed resize-none transition-all"
                />
                {rawDraft.trim() && (
                  <p className="mt-1.5 text-xs text-slate-400 pl-1 tabular-nums">
                    {rawDraft.trim().split(/\s+/).length} words · ready to optimize
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="p-5 space-y-4">
              {/* Hook Rating Banner */}
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Target className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 mb-0.5">AI Hook Assessment</p>
                  <p className="text-sm font-semibold text-indigo-900 leading-snug">{result.overallHookRating}</p>
                </div>
              </div>

              {/* Teleprompter Lines */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                    Optimized Script — {result.teleprompterLines.length} lines
                  </h3>
                </div>
                <div className="space-y-3">
                  {result.teleprompterLines.map((line, idx) => (
                    <div
                      key={line.id || idx}
                      className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm space-y-2.5"
                    >
                      <div className="flex items-start gap-2">
                        <span className="flex-shrink-0 w-6 h-6 rounded-lg bg-slate-100 text-slate-500 text-[10px] font-bold flex items-center justify-center mt-0.5">
                          {idx + 1}
                        </span>
                        <p className="text-sm font-semibold text-slate-900 leading-relaxed flex-1">
                          "{line.text}"
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-1.5 pl-8">
                        <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100 text-[10px] font-bold uppercase tracking-wide">
                          📢 {line.deliveryCue}
                        </span>
                        {line.rhetoricDevice && (
                          <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 border border-amber-100 text-[10px] font-bold uppercase tracking-wide">
                            ✦ {line.rhetoricDevice}
                          </span>
                        )}
                        {line.stressWords && line.stressWords.length > 0 && (
                          <span className="px-2.5 py-1 rounded-lg bg-slate-50 text-slate-500 border border-slate-100 text-[10px] font-bold uppercase tracking-wide">
                            Stress: {line.stressWords.slice(0, 3).join(', ')}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sticky Footer CTA */}
        <div className="flex-shrink-0 p-4 pt-3 border-t border-slate-100 bg-white/95 backdrop-blur-sm">
          {!result ? (
            <button
              onClick={handleOptimize}
              disabled={isLoading || !rawDraft.trim()}
              className="w-full py-4 rounded-2xl bg-indigo-600 active:bg-indigo-700 hover:bg-indigo-700 text-white font-extrabold text-sm flex items-center justify-center gap-2.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-indigo-200"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Rewriting your script…
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Rewrite & Optimize with AI
                </>
              )}
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={() => setResult(null)}
                className="flex-none px-5 py-3.5 rounded-2xl bg-slate-100 active:bg-slate-200 text-slate-700 font-bold text-sm transition-colors"
              >
                ← Edit
              </button>
              <button
                onClick={handleApplyToTeleprompter}
                className="flex-1 py-3.5 rounded-2xl bg-indigo-600 active:bg-indigo-700 hover:bg-indigo-700 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 transition-all"
              >
                <Play className="w-4 h-4 fill-current" />
                Use as Teleprompter
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
