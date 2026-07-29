import React from 'react';
import { SpeakUpAnalysis, Segment } from '../types';
import { CheckCircle2, AlertTriangle, Lightbulb, Play, Quote, Wand2, Mic2, Compass, Sparkles, ShieldAlert } from 'lucide-react';

interface AnalysisViewProps {
  analysis: SpeakUpAnalysis;
  selectedSegmentId: string | null;
  onSegmentSelect: (segment: Segment) => void;
  onReplaySegment: () => void;
  onNewPresentation?: () => void;
}

export const AnalysisView: React.FC<AnalysisViewProps> = ({ 
  analysis, 
  selectedSegmentId, 
  onSegmentSelect,
  onReplaySegment,
  onNewPresentation
}) => {
  const selectedSegment = analysis.segments.find(s => s.id === selectedSegmentId) || analysis.segments[0];
  
  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const score = analysis.overall.congruence_score;
  const isHighScore = score >= 75;
  const isMidScore = score >= 50 && score < 75;
  
  const scoreColorClass = isHighScore 
    ? 'text-emerald-600 bg-emerald-50 border-emerald-100' 
    : isMidScore 
    ? 'text-amber-600 bg-amber-50 border-amber-100' 
    : 'text-rose-600 bg-rose-50 border-rose-100';

  return (
    <div className="mt-8 space-y-8 animate-fade-in">
      
      {/* 1. EXECUTIVE PERFORMANCE OVERVIEW HERO BANNER */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Panel A: Overall Score & Metrics */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">Overall Speech Rating</span>
            <span className="text-[9px] font-mono text-slate-400">Gemma Evaluation</span>
          </div>
          <div className="flex items-center gap-5">
            <div className={`w-24 h-24 rounded-full flex flex-col items-center justify-center shrink-0 border-2 shadow-inner ${scoreColorClass}`}>
              <span className="text-3xl font-mono font-extrabold">{score}</span>
              <span className="text-[8px] font-mono uppercase tracking-widest opacity-80 -mt-1">Overall</span>
            </div>
            <div className="flex-1 space-y-2.5">
              <div>
                <div className="flex justify-between text-[10px] font-mono text-slate-500 mb-0.5">
                  <span>SPEECH STYLE</span>
                  <span className="text-slate-900 font-bold">{analysis.overall.verbal_score}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${analysis.overall.verbal_score}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[10px] font-mono text-slate-500 mb-0.5">
                  <span>TONE & PACE</span>
                  <span className="text-slate-900 font-bold">{analysis.overall.vocal_score}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${analysis.overall.vocal_score}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[10px] font-mono text-slate-500 mb-0.5">
                  <span>BODY LANGUAGE</span>
                  <span className="text-slate-900 font-bold">{analysis.overall.visual_score}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: `${analysis.overall.visual_score}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Panel B: Speech Context & Goal */}
        {analysis.global_context && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
            <div className="flex items-center gap-1.5 text-slate-500 border-b border-slate-100 pb-3 mb-3">
              <Compass className="w-4 h-4 text-indigo-600" />
              <span className="text-[10px] font-mono uppercase tracking-wider font-bold">Speech Context & Goal</span>
            </div>
            <div className="flex-1 flex flex-col justify-center">
              <h3 className="text-base font-semibold text-slate-900 leading-snug">
                "{analysis.global_context.detected_intent}"
              </h3>
              <p className="text-xs text-slate-500 italic mt-2 line-clamp-3">
                {analysis.global_context.overall_tone_critique}
              </p>
            </div>
          </div>
        )}

        {/* Panel C: Key Takeaways */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-slate-500 border-b border-slate-100 pb-3 mb-3">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span className="text-[10px] font-mono uppercase tracking-wider font-bold">Key Takeaways</span>
          </div>
          <div className="grid grid-cols-2 gap-4 flex-1">
            <div className="space-y-1">
              <span className="text-[9px] font-mono text-emerald-600 uppercase font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Core Strength
              </span>
              <p className="text-[11px] text-slate-700 leading-tight">
                {analysis.overall.strengths[0] || "Clear voice projection"}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-[9px] font-mono text-amber-600 uppercase font-bold flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Priority Fix
              </span>
              <p className="text-[11px] text-slate-700 leading-tight">
                {analysis.overall.improvements[0] || "Reduce filler density"}
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* 2. DIAGNOSTIC WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Sidebar: Segment Playlist */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-bold">Segment Playlist</span>
            <span className="text-[9px] font-mono text-slate-400">{analysis.segments.length} Chapters</span>
          </div>

          <div className="space-y-2.5 overflow-y-auto max-h-[500px] pr-1">
            {analysis.segments.map((seg, idx) => {
              const isSelected = seg.id === selectedSegment.id;
              const isCongruent = seg.status === 'congruent';
              return (
                <button
                  key={seg.id}
                  onClick={() => onSegmentSelect(seg)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                    isSelected
                      ? 'bg-slate-900 border-slate-900 text-white shadow-lg scale-[1.01]'
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${isSelected ? 'text-indigo-300' : 'text-indigo-600'}`}>
                        SEGMENT {idx + 1}
                      </span>
                      <span className={`text-[9px] font-mono opacity-80 ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                        {formatTime(seg.start_time)} - {formatTime(seg.end_time)}
                      </span>
                    </div>
                    <p className={`text-xs truncate max-w-[200px] ${isSelected ? 'text-slate-200' : 'text-slate-500'}`}>
                      "{seg.transcript}"
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-1.5">
                    <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                      isCongruent
                        ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                    }`}>
                      {isCongruent ? 'IN SYNC' : 'NEEDS WORK'}
                    </span>
                    <span className={`text-[10px] font-mono font-bold ${isSelected ? 'text-indigo-300' : 'text-slate-700'}`}>
                      {seg.score}/100
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Workspace: Active Segment Details */}
        <div className="lg:col-span-8">
          {selectedSegment && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
              
              {/* Header block */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block mb-0.5">CURRENT DIAGNOSIS</span>
                  <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    Segment {formatTime(selectedSegment.start_time)} – {formatTime(selectedSegment.end_time)}
                    <span className="text-xs font-mono font-normal text-slate-400">({selectedSegment.category} segment)</span>
                  </h4>
                </div>
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/50 rounded-2xl px-4 py-2">
                  <span className="text-[10px] font-mono text-slate-500">Segment Score:</span>
                  <span className="text-sm font-mono font-bold text-slate-900">{selectedSegment.score}/100</span>
                </div>
              </div>

              {/* Speech Comparison Block */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Left: Original Speech */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-[9px] font-mono uppercase text-slate-400 font-bold tracking-wider flex items-center gap-1.5">
                      <Quote className="w-3.5 h-3.5" /> What You Said
                    </span>
                    <p className="text-slate-700 text-sm italic font-serif leading-relaxed">
                      "{selectedSegment.transcript}"
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center gap-1.5 text-rose-500 font-mono text-[10px]">
                    <ShieldAlert className="w-3.5 h-3.5" /> Detected {selectedSegment.category} issue
                  </div>
                </div>

                {/* Right: Optimized Rewrite */}
                {selectedSegment.better_phrasing ? (
                  <div className="bg-indigo-50/60 border border-indigo-200 rounded-2xl p-5 flex flex-col justify-between">
                    <div className="space-y-2">
                      <span className="text-[9px] font-mono uppercase text-indigo-600 font-bold tracking-wider flex items-center gap-1.5">
                        <Wand2 className="w-3.5 h-3.5" /> AI Script Rewrite
                      </span>
                      <p className="text-slate-900 text-base font-bold leading-snug">
                        "{selectedSegment.better_phrasing}"
                      </p>
                    </div>
                    {selectedSegment.rewrite_reason && (
                      <p className="text-indigo-600 text-xs italic mt-4">
                        Reason: {selectedSegment.rewrite_reason}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-5 flex flex-col justify-between">
                    <div className="space-y-2">
                      <span className="text-[9px] font-mono uppercase text-emerald-600 font-bold tracking-wider flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Delivery Optimal
                      </span>
                      <p className="text-slate-800 text-sm italic leading-relaxed">
                        Speech structure is clear and effective. Keep this delivery style.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Feedback & Action Cues */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                <span className="text-[9px] font-mono uppercase text-indigo-600 font-bold tracking-wider flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5" /> Coach Feedback & Advice
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed">
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block">Observation</span>
                    <p className="text-slate-600">{selectedSegment.observation}</p>
                    <p className="text-slate-950 font-semibold mt-1">{selectedSegment.advice}</p>
                  </div>

                  {selectedSegment.delivery_cue && (
                    <div className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-1 self-start">
                      <span className="text-[9px] font-mono text-emerald-600 uppercase font-bold flex items-center gap-1">
                        <Mic2 className="w-3 h-3" /> Delivery Cue
                      </span>
                      <p className="text-slate-700 text-xs font-semibold">
                        {selectedSegment.delivery_cue}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Actions Row */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-slate-100">
                <button 
                  onClick={onReplaySegment}
                  className="w-full bg-white hover:bg-slate-50 text-slate-700 font-mono text-xs font-bold py-3.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 border border-slate-200 shadow-sm"
                >
                  <Play className="w-4 h-4 fill-current" /> Replay Segment
                </button>
              </div>

            </div>
          )}
        </div>

      </div> 

      {onNewPresentation && (
        <div className="flex justify-center mt-6">
          <button
            onClick={onNewPresentation}
            className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-mono text-xs font-bold transition-all flex items-center gap-2 shadow-sm"
          >
            <Compass className="w-4 h-4 text-indigo-600" /> Begin New Studio Recording
          </button>
        </div>
      )}

    </div>
  );
};