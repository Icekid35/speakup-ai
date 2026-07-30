import React, { useState, useEffect } from 'react';
import { Sparkles, Brain, Cpu, Zap, Activity, Award, Trophy, Gamepad2, Volume2, ShieldCheck, Flame } from 'lucide-react';

interface VideoProcessingModalProps {
  isAnalyzing: boolean;
  progress: number;
}

export const VideoProcessingModal: React.FC<VideoProcessingModalProps> = ({
  isAnalyzing,
  progress,
}) => {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [activeTab, setActiveTab] = useState<'game' | 'trivia'>('game');

  // Micro-Game State (Pacing Rhythm Tap Game)
  const [gameScore, setGameScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [orbPosition, setOrbPosition] = useState(0); // 0 to 100
  const [orbDirection, setOrbDirection] = useState<1 | -1>(1);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // Trivia State
  const [triviaIndex, setTriviaIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [triviaScore, setTriviaScore] = useState(0);

  const triviaQuestions = [
    {
      q: "What is the optimal speaking pace for executive presentations?",
      options: ["90 - 110 WPM", "130 - 160 WPM", "190 - 220 WPM", "Over 250 WPM"],
      correct: 1,
      explanation: "130-160 WPM allows listeners to digest complex ideas without feeling rushed."
    },
    {
      q: "What percentage of non-verbal communication is driven by body posture & eye contact?",
      options: ["Around 15%", "Around 35%", "Over 55%", "100%"],
      correct: 2,
      explanation: "Body language and visual presence account for over half of perceived authority."
    },
    {
      q: "What is the best way to handle a sudden memory lapse during a pitch?",
      options: ["Apologize immediately", "Pause confidently for 2 seconds", "Start talking faster", "Look down at notes"],
      correct: 1,
      explanation: "A deliberate 2-second pause sounds intentional and gives you command of the room."
    },
    {
      q: "What is the primary goal of the Script Doctor in SpeakUp.ai?",
      options: ["Fix basic typos", "Transform passive phrasing into decisive executive language", "Make text longer", "Remove all technical terms"],
      correct: 1,
      explanation: "It elevates passive phrases ('We tried to improve') into active authority ('We engineered')."
    }
  ];

  // Timer Effect
  useEffect(() => {
    if (!isAnalyzing) {
      setElapsedSeconds(0);
      return;
    }

    const timer = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isAnalyzing]);

  // Micro-game Animation Loop
  useEffect(() => {
    if (!isAnalyzing || activeTab !== 'game') return;

    const gameLoop = setInterval(() => {
      setOrbPosition(prev => {
        let next = prev + orbDirection * 3;
        if (next >= 95) {
          setOrbDirection(-1);
          next = 95;
        } else if (next <= 5) {
          setOrbDirection(1);
          next = 5;
        }
        return next;
      });
    }, 30);

    return () => clearInterval(gameLoop);
  }, [isAnalyzing, activeTab, orbDirection]);

  // Handle Tap in Game
  const handleTapRhythm = () => {
    // Green Perfect Pace Zone is between position 40 and 60
    if (orbPosition >= 40 && orbPosition <= 60) {
      const addedScore = 100 * (combo + 1);
      setGameScore(prev => prev + addedScore);
      setCombo(prev => prev + 1);
      setFeedbackMsg(`🔥 PERFECT PACE! +${addedScore}`);
    } else {
      setCombo(0);
      setFeedbackMsg("⚡ Off-Pace! Tap when in the green zone");
    }

    setTimeout(() => setFeedbackMsg(null), 1200);
  };

  if (!isAnalyzing) return null;

  // Compute Dynamic Processing Stage Based on Elapsed Seconds
  const getProcessingStage = () => {
    if (elapsedSeconds < 8) {
      return {
        stage: "Stage 1/4: Video Demuxing & Audio Extraction",
        detail: "Extracting PCM audio stream & vision keyframes via FFmpeg...",
        icon: Cpu,
        color: "text-indigo-400"
      };
    } else if (elapsedSeconds < 24) {
      return {
        stage: "Stage 2/4: Faster-Whisper ASR Speech Recognition",
        detail: "Generating word-level timestamp transcript & detecting vocal pauses...",
        icon: Volume2,
        color: "text-blue-400"
      };
    } else if (elapsedSeconds < 45) {
      return {
        stage: "Stage 3/4: Vision & Posture Keyframe Analysis",
        detail: "Evaluating eye contact alignment, posture stability & hand gestures...",
        icon: Activity,
        color: "text-emerald-400"
      };
    } else if (elapsedSeconds < 75) {
      return {
        stage: "Stage 4/4: Google Gemma 4 Multimodal Reasoning Engine",
        detail: "Gemma 4 is synthesizing transcript + visual cues into executive coaching feedback...",
        icon: Brain,
        color: "text-purple-400"
      };
    } else {
      return {
        stage: "Stage 4/4 (Deep Reasoning): Refining Script Doctor Rewrites",
        detail: "Gemma 4 is executing deep analysis on your presentation. Please hold on, almost ready!",
        icon: Sparkles,
        color: "text-amber-400"
      };
    }
  };

  const currentStageInfo = getProcessingStage();
  const StageIcon = currentStageInfo.icon;

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/85 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fade-in">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-white space-y-6 relative overflow-hidden my-auto">
        
        {/* Glowing Background Radial Accents */}
        <div className="absolute -top-24 -left-24 w-60 h-60 rounded-full bg-indigo-600/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-60 h-60 rounded-full bg-emerald-600/20 blur-3xl pointer-events-none" />

        {/* Top Header & Active Time Pill */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
              <StageIcon className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                <span>AI Video Analysis Active</span>
                <span className="inline-flex items-center gap-1 text-[10px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> Live
                </span>
              </h2>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Powered by Google Gemma 4 Engine
              </p>
            </div>
          </div>

          {/* Elapsed Timer Pill */}
          <div className="flex items-center gap-2 bg-slate-800/90 border border-slate-700/80 px-3.5 py-1.5 rounded-xl font-mono text-xs text-slate-300 shrink-0">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Time: <strong className="text-white">{formatTime(elapsedSeconds)}</strong></span>
          </div>
        </div>

        {/* Progress Bar & Stage Info */}
        <div className="space-y-3 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className={`font-semibold flex items-center gap-1.5 ${currentStageInfo.color}`}>
              <StageIcon className="w-4 h-4" />
              {currentStageInfo.stage}
            </span>
            <span className="text-indigo-400 font-bold">{Math.min(99, Math.max(progress, Math.floor(elapsedSeconds * 1.5)))}%</span>
          </div>

          {/* Smooth Gradient Progress Track */}
          <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden p-0.5 border border-slate-700/50">
            <div
              className="bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(99, Math.max(progress, Math.floor(elapsedSeconds * 1.5)))}%` }}
            />
          </div>

          <p className="text-xs text-slate-400 leading-relaxed font-sans flex items-center justify-between">
            <span>{currentStageInfo.detail}</span>
            {elapsedSeconds > 30 && (
              <span className="text-[10px] font-mono text-emerald-400 shrink-0 hidden sm:inline">
                🟢 AI Working Hard...
              </span>
            )}
          </p>
        </div>

        {/* Interactive Waiting Tab Selector */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider font-semibold">
              While You Wait: Play & Practice
            </span>
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setActiveTab('game')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all ${
                  activeTab === 'game'
                    ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Gamepad2 className="w-3.5 h-3.5" /> Pacing Tap Game
              </button>
              <button
                onClick={() => setActiveTab('trivia')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all ${
                  activeTab === 'trivia'
                    ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Trophy className="w-3.5 h-3.5" /> Speaking Trivia
              </button>
            </div>
          </div>

          {/* TAB 1: Pacing Rhythm Tap Game */}
          {activeTab === 'game' && (
            <div className="bg-slate-950/80 rounded-2xl p-5 border border-slate-800 space-y-5 text-center relative overflow-hidden">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400 flex items-center gap-1">
                  <Trophy className="w-3.5 h-3.5 text-amber-400" /> Score: <strong className="text-white text-sm">{gameScore}</strong>
                </span>
                {combo > 1 && (
                  <span className="text-amber-400 font-bold flex items-center gap-1 animate-bounce">
                    <Flame className="w-3.5 h-3.5" /> {combo}x Combo Multiplier!
                  </span>
                )}
              </div>

              {/* Rhythm Track Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] font-mono text-slate-500 px-2 uppercase">
                  <span>Too Slow</span>
                  <span className="text-emerald-400 font-bold">130-160 WPM (PERFECT PACE ZONE)</span>
                  <span>Too Fast</span>
                </div>

                {/* Track Frame */}
                <div className="relative w-full h-12 bg-slate-900 rounded-xl border border-slate-800 overflow-hidden flex items-center">
                  {/* Perfect Pace Green Zone in middle 40% -> 60% */}
                  <div className="absolute left-[40%] right-[40%] top-0 bottom-0 bg-emerald-500/20 border-x-2 border-emerald-500/50 flex items-center justify-center">
                    <span className="text-[9px] font-mono text-emerald-300 font-bold uppercase tracking-widest hidden sm:inline">TARGET</span>
                  </div>

                  {/* Moving Orb */}
                  <div
                    className="absolute w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-500 to-emerald-400 shadow-lg shadow-indigo-500/50 border-2 border-white transition-all duration-75 flex items-center justify-center"
                    style={{ left: `calc(${orbPosition}% - 14px)` }}
                  >
                    <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                  </div>
                </div>
              </div>

              {/* Tap Button */}
              <div className="space-y-2">
                <button
                  onClick={handleTapRhythm}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-sm transition-all shadow-lg shadow-indigo-600/30 active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4 text-amber-300" />
                  <span>TAP WHEN ORB HITS GREEN ZONE</span>
                </button>
                {feedbackMsg && (
                  <p className="text-xs font-mono font-bold text-emerald-400 animate-pulse">
                    {feedbackMsg}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: Speaking Trivia */}
          {activeTab === 'trivia' && (
            <div className="bg-slate-950/80 rounded-2xl p-5 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between text-xs font-mono border-b border-slate-800 pb-2">
                <span className="text-indigo-400 font-bold">Question {triviaIndex + 1} of {triviaQuestions.length}</span>
                <span className="text-slate-400">Trivia Points: <strong className="text-white">{triviaScore}</strong></span>
              </div>

              <h4 className="text-sm font-semibold text-white leading-relaxed">
                {triviaQuestions[triviaIndex].q}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {triviaQuestions[triviaIndex].options.map((opt, i) => {
                  const isSelected = selectedAnswer === i;
                  const isCorrect = i === triviaQuestions[triviaIndex].correct;
                  let btnStyle = "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800";
                  if (selectedAnswer !== null) {
                    if (isCorrect) btnStyle = "bg-emerald-950 border-emerald-600 text-emerald-300 font-bold";
                    else if (isSelected) btnStyle = "bg-rose-950 border-rose-600 text-rose-300";
                  }

                  return (
                    <button
                      key={i}
                      disabled={selectedAnswer !== null}
                      onClick={() => {
                        setSelectedAnswer(i);
                        if (i === triviaQuestions[triviaIndex].correct) setTriviaScore(prev => prev + 100);
                      }}
                      className={`p-3 rounded-xl border text-left transition-all ${btnStyle}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {selectedAnswer !== null && (
                <div className="pt-2 flex items-center justify-between text-xs">
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    💡 {triviaQuestions[triviaIndex].explanation}
                  </p>
                  <button
                    onClick={() => {
                      setSelectedAnswer(null);
                      setTriviaIndex((prev) => (prev + 1) % triviaQuestions.length);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-500 shrink-0 ml-2"
                  >
                    Next →
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Reassurance */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-500">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Safe & Private Analysis
          </span>
          <span>Please keep this window open while Gemma 4 processes.</span>
        </div>

      </div>
    </div>
  );
};
