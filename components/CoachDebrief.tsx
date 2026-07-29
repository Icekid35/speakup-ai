import React, { useEffect, useState, useRef } from 'react';
import { X, Volume2, Pause, Play, RotateCcw, Sparkles, Activity, BrainCircuit, ArrowLeft } from 'lucide-react';
import { SpeakUpAnalysis } from '../types';

interface CoachDebriefProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: SpeakUpAnalysis;
  preloadedScript: string | null;
  preloadedAudio: Blob | null;
  onNewPresentation?: () => void;
}

export const CoachDebrief: React.FC<CoachDebriefProps> = ({ 
  isOpen, 
  onClose, 
  analysis,
  preloadedScript,
  preloadedAudio,
  onNewPresentation
}) => {
  const [status, setStatus] = useState<'thinking' | 'speaking' | 'paused' | 'finished' | 'error'>('thinking');
  const [displayedText, setDisplayedText] = useState("");
  const [loadingText, setLoadingText] = useState("ESTABLISHING NEURAL LINK...");
  const [audioLevel, setAudioLevel] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);
  const textIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const loadIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Initialize and watch for props
  useEffect(() => {
    if (!isOpen) return;

    // Reset state on open
    if (status === 'finished' || status === 'error') {
      setStatus('thinking');
      setDisplayedText("");
    }

    // Fun loading sequence (visual only)
    if (!loadIntervalRef.current) {
        const loadingStates = [
            "SCANNING BIOMETRICS...",
            "ANALYZING VOCAL TONALITY...",
            "CORRELATING MICRO-EXPRESSIONS...",
            "FORMULATING COACHING STRATEGY..."
        ];
        let loadIdx = 0;
        loadIntervalRef.current = setInterval(() => {
            if(loadIdx < loadingStates.length) {
            setLoadingText(loadingStates[loadIdx]);
            loadIdx++;
            }
        }, 800);
    }

    // CHECK FOR CONTENT
    if (preloadedScript && preloadedAudio && (status === 'thinking' || status === 'error')) {
        console.log("⚡ ASSETS READY: Starting playback flow");
        initPlayback(preloadedScript, preloadedAudio);
    }

    // Cleanup
    return () => {
       cleanupAudio();
       if (loadIntervalRef.current) {
         clearInterval(loadIntervalRef.current);
         loadIntervalRef.current = null;
       }
    };
  }, [isOpen, preloadedScript, preloadedAudio]);

  const cleanupAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (textIntervalRef.current) {
      clearInterval(textIntervalRef.current);
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  const initPlayback = async (script: string, audioBlob: Blob) => {
    // Stop loading text
    if (loadIntervalRef.current) clearInterval(loadIntervalRef.current);
    setLoadingText("VOICE SYNTHESIS COMPLETE");

    // Create Audio
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    audioRef.current = audio;

    // Setup Web Audio API
    try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioContextClass();
        audioContextRef.current = ctx;
        
        const source = ctx.createMediaElementSource(audio);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 64; 
        analyserRef.current = analyser;
        
        source.connect(analyser);
        analyser.connect(ctx.destination);
    } catch (e) {
        console.warn("WebAudio API not supported or blocked", e);
    }

    // Handlers
    audio.oncanplay = () => {
        // Only try playing if we are effectively ready
        // (Wait for duration to be valid to avoid text glitches)
    };

    audio.onplay = () => {
        setStatus('speaking');
        startVisualizer();
        // Ensure duration is valid before starting text sync
        if (isFinite(audio.duration) && audio.duration > 0) {
            startTextAnimation(script, audio.duration);
        } else {
             // Fallback: Estimate duration or just show text immediately
             setDisplayedText(script);
        }
    };

    audio.onended = () => {
        setStatus('finished');
        setDisplayedText(script); // Ensure full text is shown
        stopVisualizer();
        if (textIntervalRef.current) clearInterval(textIntervalRef.current);
    };

    audio.onerror = (e) => {
        console.error("Audio error", e);
        setStatus('error');
    };

    // Auto-play
    try {
        await audio.play();
    } catch (e) {
        console.warn("Autoplay blocked", e);
        setStatus('paused');
    }
  };

  const startTextAnimation = (script: string, duration: number) => {
    if (textIntervalRef.current) clearInterval(textIntervalRef.current);
    
    // Calculate speed
    const totalChars = script.length;
    // Add a small buffer to ensure it finishes *slightly* before audio
    const safeDuration = duration * 0.95; 
    const msPerChar = (safeDuration * 1000) / totalChars;
    
    let charIndex = 0;
    setDisplayedText("");

    textIntervalRef.current = setInterval(() => {
      charIndex++;
      if (charIndex <= totalChars) {
          // Use slice for deterministic rendering (fixes undefined bug)
          setDisplayedText(script.slice(0, charIndex));
      } else {
          if (textIntervalRef.current) clearInterval(textIntervalRef.current);
      }
    }, msPerChar);
  };

  const startVisualizer = () => {
    const animate = () => {
      if (analyserRef.current) {
        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(dataArray);
        const sum = dataArray.reduce((a, b) => a + b, 0);
        const avg = sum / dataArray.length;
        setAudioLevel(avg);
      }
      animationRef.current = requestAnimationFrame(animate);
    };
    animate();
  };

  const stopVisualizer = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    setAudioLevel(0);
  };

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    
    if (status === 'speaking') {
      audioRef.current.pause();
      setStatus('paused');
      if (textIntervalRef.current) clearInterval(textIntervalRef.current);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    } else if (status === 'paused') {
      audioRef.current.play();
      setStatus('speaking');
    }
  };

  const replay = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    audioRef.current.play();
    setDisplayedText(""); // Reset text to type again
  };

  if (!isOpen) return null;

  // Cinematic Visualizer Logic
  const normalize = (val: number, max: number) => Math.min(val / max, 1);
  const intensity = normalize(audioLevel, 200);
  
  // Dynamic styles
  const coreScale = 1 + intensity * 0.5;
  const ring1Scale = 1 + intensity * 1.2;
  const ring2Scale = 1 + intensity * 2.5;
  const glowOpacity = 0.15 + intensity * 0.6;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/90 backdrop-blur-2xl animate-fade-in">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-400/10 rounded-full blur-[120px] transition-all duration-100 ease-out"
            style={{ opacity: glowOpacity, transform: `translate(-50%, -50%) scale(${1 + intensity * 0.2})` }}
        />
      </div>

      {/* Top Header Navigation Bar */}
      <div className="absolute top-6 left-6 right-6 z-50 flex items-center justify-between pointer-events-auto">
        <button 
          onClick={onClose}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-mono text-xs font-bold transition-all shadow-xl"
        >
          ← Back to Studio
        </button>

        <button 
          onClick={onClose}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-mono text-xs font-bold transition-all shadow-xl"
        >
          <X className="w-4 h-4 text-white/70" /> Close
        </button>
      </div>

      <div className="relative w-full max-w-2xl mx-6 flex flex-col items-center">

        {/* --- MAIN AVATAR --- */}
        <div className="relative w-64 h-64 flex items-center justify-center mb-16">
            
            {/* Loading Spinner Ring */}
            {(status === 'thinking') && (
                <div className="absolute inset-0 border-t border-r border-indigo-400/50 rounded-full animate-spin duration-[2s]"></div>
            )}

            {/* Speaking Rings */}
            {(status === 'speaking' || status === 'paused') && (
                <>
                    <div className="absolute inset-0 border border-indigo-400/20 rounded-full transition-all duration-75 ease-out"
                         style={{ transform: `scale(${ring2Scale})`, opacity: Math.max(0, 0.5 - intensity) }} />
                    <div className="absolute inset-4 border border-indigo-400/40 rounded-full transition-all duration-75 ease-out"
                         style={{ transform: `scale(${ring1Scale})`, opacity: Math.max(0, 0.8 - intensity) }} />
                </>
            )}

            {/* Core Orb */}
            <div className="relative z-10 w-32 h-32 rounded-full bg-gradient-to-b from-indigo-500 to-indigo-700 shadow-[0_0_50px_rgba(99,102,241,0.5)] flex items-center justify-center transition-transform duration-75 ease-out"
                 style={{ transform: `scale(${status === 'speaking' ? coreScale : 1})` }}>
              
              {status === 'thinking' ? (
                 <BrainCircuit className="w-12 h-12 text-white animate-pulse" />
              ) : (
                 <Volume2 className="w-12 h-12 text-white" />
              )}
              
              {/* Shiny reflection */}
              <div className="absolute top-4 right-6 w-6 h-3 bg-white/30 rounded-full blur-[2px] transform rotate-45"></div>
            </div>
        </div>

        {/* --- STATUS TEXT --- */}
        <div className="mb-12 h-8 flex items-center justify-center">
            {status === 'speaking' ? (
                <div className="flex items-center gap-3 bg-indigo-500/20 px-4 py-1.5 rounded-full border border-indigo-400/30">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-400"></span>
                    </span>
                    <span className="text-indigo-200 font-mono text-xs font-bold tracking-[0.2em]">AI COACH SPEAKING</span>
                </div>
            ) : status === 'finished' ? (
                <span className="text-emerald-300 font-mono text-sm tracking-[0.2em] font-bold">COACHING SESSION COMPLETE</span>
            ) : status === 'error' ? (
                <span className="text-rose-400 font-mono text-sm tracking-[0.2em] font-bold">CONNECTION LOST</span>
            ) : (
                <span className="text-white/50 font-mono text-xs tracking-[0.2em] animate-pulse">PREPARING COACHING SESSION...</span>
            )}
        </div>

        {/* --- TRANSCRIPT DISPLAY --- */}
        <div className="w-full min-h-[160px] flex items-start justify-center text-center">
            <p className="text-2xl md:text-3xl font-medium text-white leading-relaxed drop-shadow-lg max-w-3xl">
                {displayedText}
                {(status === 'speaking' || status === 'thinking') && (
                    <span className="inline-block w-2 h-6 ml-1 bg-indigo-400 align-middle animate-pulse"></span>
                )}
            </p>
        </div>

        {/* --- CONTROLS --- */}
        <div className="mt-12 flex items-center gap-4 flex-wrap justify-center">
            {(status === 'speaking' || status === 'paused') && (
                <button onClick={togglePlayPause} className="w-16 h-16 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center transition-all hover:scale-105 backdrop-blur-md">
                    {status === 'paused' ? <Play className="w-6 h-6 text-white ml-1"/> : <Pause className="w-6 h-6 text-white"/>}
                </button>
            )}

            {status === 'finished' && (
                <>
                    <button onClick={replay} className="px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white font-mono text-sm font-bold tracking-wider transition-all hover:scale-105 flex items-center gap-2">
                        <RotateCcw className="w-4 h-4" /> Replay
                    </button>

                    {onNewPresentation && (
                      <button 
                        onClick={() => { onClose(); onNewPresentation(); }}
                        className="px-6 py-3.5 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 text-white font-mono text-sm font-bold tracking-wider transition-all hover:scale-105 flex items-center gap-2"
                      >
                        <RotateCcw className="w-4 h-4 text-indigo-400" /> New Session
                      </button>
                    )}

                    <button onClick={onClose} className="px-6 py-3.5 rounded-full bg-indigo-500 hover:bg-indigo-400 text-white font-mono text-sm font-bold tracking-wider transition-all hover:scale-105 shadow-lg flex items-center gap-2">
                        <Sparkles className="w-4 h-4" /> Apply Coaching Advice
                    </button>
                </>
            )}
        </div>

      </div>
    </div>
  );
};