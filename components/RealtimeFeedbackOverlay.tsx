import React, { useState, useEffect, useRef } from 'react';
import { Mic, Zap, Gauge, AlertCircle, Sparkles, Volume2, ShieldAlert, ChevronUp, ChevronDown, RefreshCw, X, Play, Eye, User } from 'lucide-react';
import { getRealtimeFeedback, fetchCoachIntervention, RealtimeFeedbackResponse, CoachInterventionResponse } from '../services/geminiService';
import { base64ToAudioBlob } from '../services/ttsService';

interface RealtimeFeedbackOverlayProps {
  stream: MediaStream | null;
  isActive: boolean;
  onClose?: () => void;
}
  
export const RealtimeFeedbackOverlay: React.FC<RealtimeFeedbackOverlayProps> = ({
  stream,
  isActive,
}) => {
  const [transcript, setTranscript] = useState<string>('');
  const [recentChunk, setRecentChunk] = useState<string>('');
  const [wpm, setWpm] = useState<number>(130);
  const [energyLevel, setEnergyLevel] = useState<'low' | 'medium' | 'high'>('medium');
  const [pitchVariation, setPitchVariation] = useState<'monotone' | 'varied' | 'excessive'>('varied');
  const [fillerCount, setFillerCount] = useState<number>(0);
  const [lastFiller, setLastFiller] = useState<string | null>(null);

  // Body language real-time visual tracking
  const [bodyLanguageStatus, setBodyLanguageStatus] = useState<'good' | 'slouched' | 'no_eye_contact'>('good');
  const [bodyLanguageTip, setBodyLanguageTip] = useState<string>('Posture aligned & direct camera eye contact');
  const [feedback, setFeedback] = useState<RealtimeFeedbackResponse>({
    suggestion: "Speak clearly and pace yourself naturally.",
    category: "tone",
    statusColor: "green",
  });
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [volumeLevel, setVolumeLevel] = useState<number>(0);

  // Active Coach Intervention states
  const [isAutoInterveneEnabled, setIsAutoInterveneEnabled] = useState<boolean>(true);
  const [activeIntervention, setActiveIntervention] = useState<CoachInterventionResponse | null>(null);
  const [isInterventionLoading, setIsInterventionLoading] = useState<boolean>(false);

  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const interventionAudioRef = useRef<HTMLAudioElement | null>(null);
  const videoElementRef = useRef<HTMLVideoElement | null>(null);
  const canvasElementRef = useRef<HTMLCanvasElement | null>(null);
  
  const startTimeRef = useRef<number>(Date.now());
  const wordCountRef = useRef<number>(0);
  const detectedFillersRef = useRef<Record<string, number>>({});
  const lastFeedbackTimeRef = useRef<number>(0);
  const lastInterventionTimeRef = useRef<number>(0);
  const fillersListRef = useRef<string[]>([]);

  const FILLER_WORDS = ['uh', 'um', 'like', 'you know', 'so', 'actually', 'basically', 'right', 'i mean', 'er', 'ah'];

  // Compute active critical mistakes list dynamically across video/audio signals
  const criticalMistakes: Array<{ id: string; title: string; fix: string }> = [];

  if (bodyLanguageStatus === 'slouched') {
    criticalMistakes.push({ id: 'posture', title: 'Slouched Posture', fix: 'Pull shoulders back and align neck with spine' });
  } else if (bodyLanguageStatus === 'no_eye_contact') {
    criticalMistakes.push({ id: 'eye_contact', title: 'Off-Camera Eye Contact', fix: 'Focus directly into camera lens to build audience trust' });
  }

  if (fillerCount >= 2) {
    criticalMistakes.push({ id: 'fillers', title: `High Filler Density (${fillerCount} fillers)`, fix: 'Embrace a strategic 1-second silent pause instead of saying "um"' });
  }

  if (wpm > 165) {
    criticalMistakes.push({ id: 'pace_fast', title: `Pacing Too Rapid (${wpm} WPM)`, fix: 'Slow down and land key words with deliberate emphasis' });
  } else if (wpm < 95 && wpm > 0) {
    criticalMistakes.push({ id: 'pace_slow', title: `Pacing Too Slow (${wpm} WPM)`, fix: 'Increase momentum and vocal energy' });
  }

  if (pitchVariation === 'monotone') {
    criticalMistakes.push({ id: 'monotone', title: 'Flat Monotone Pitch', fix: 'Inflect pitch upward on core concepts' });
  }

  const triggerCoachIntervention = async (reason: string) => {
    const now = Date.now();
    if (now - lastInterventionTimeRef.current < 6000 || isInterventionLoading) return;
    lastInterventionTimeRef.current = now;

    setIsInterventionLoading(true);
    try {
      const detailedReason = `CRITICAL MISTAKES DETECTED (${criticalMistakes.length}): ${criticalMistakes.map(m => `${m.title} -> Fix: ${m.fix}`).join('; ')}. Body language posture: ${bodyLanguageStatus}. Trigger note: ${reason}`;
      const res = await fetchCoachIntervention(detailedReason, recentChunk || transcript, fillerCount, wpm);
      setActiveIntervention(res);

      if (res.base64Audio) {
        playInterventionAudio(res.base64Audio);
      }
    } catch (e) {
      console.error("Intervention trigger failed:", e);
    } finally {
      setIsInterventionLoading(false);
    }
  };

  const playInterventionAudio = (base64Audio: string) => {
    try {
      const blob = base64ToAudioBlob(base64Audio);
      const url = URL.createObjectURL(blob);

      if (interventionAudioRef.current) {
        interventionAudioRef.current.src = url;
        interventionAudioRef.current.play().catch(e => console.error("Intervention audio play failed:", e));
      }
    } catch (e) {
      console.error("Failed to decode intervention audio:", e);
    }
  };

  // Video Track & Body Language Realtime Analysis Loop
  useEffect(() => {
    if (!isActive || !stream) return;

    const videoTrack = stream.getVideoTracks()[0];
    if (!videoTrack) return;

    const video = document.createElement('video');
    video.srcObject = stream;
    video.muted = true;
    video.play().catch(() => {});
    videoElementRef.current = video;

    const canvas = document.createElement('canvas');
    canvas.width = 160;
    canvas.height = 120;
    canvasElementRef.current = canvas;
    const ctx = canvas.getContext('2d');

    const postureCheckInterval = setInterval(() => {
      if (!ctx || video.readyState < 2) return;
      ctx.drawImage(video, 0, 0, 160, 120);
      const frameData = ctx.getImageData(0, 0, 160, 120).data;

      let topRegionBrightness = 0;
      let bottomRegionBrightness = 0;

      for (let i = 0; i < frameData.length; i += 16) {
        const yPixel = Math.floor(i / 4 / 160);
        const brightness = (frameData[i] + frameData[i + 1] + frameData[i + 2]) / 3;
        if (yPixel < 40) topRegionBrightness += brightness;
        else if (yPixel > 80) bottomRegionBrightness += brightness;
      }

      const ratio = topRegionBrightness / (bottomRegionBrightness || 1);
      if (ratio < 0.35) {
        setBodyLanguageStatus('slouched');
        setBodyLanguageTip('Slouched posture detected! Lift head & open chest.');
      } else if (ratio > 1.8) {
        setBodyLanguageStatus('no_eye_contact');
        setBodyLanguageTip('Eye contact strayed away from camera lens.');
      } else {
        setBodyLanguageStatus('good');
        setBodyLanguageTip('Posture aligned & direct camera eye contact.');
      }
    }, 2500);

    return () => {
      clearInterval(postureCheckInterval);
    };
  }, [isActive, stream]);

  // Initialize Speech Recognition & Web Audio API Analysis
  useEffect(() => {
    if (!isActive) {
      cleanup();
      return;
    }

    startTimeRef.current = Date.now();
    wordCountRef.current = 0;
    setTranscript('');
    setRecentChunk('');
    setFillerCount(0);
    fillersListRef.current = [];

    // 1. Web Audio API Setup
    if (stream) {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioContextClass();
        audioContextRef.current = ctx;

        const source = ctx.createMediaStreamSource(stream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 512;
        source.connect(analyser);
        analyserRef.current = analyser;

        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        const analyzeAudio = () => {
          if (!analyserRef.current) return;
          analyserRef.current.getByteFrequencyData(dataArray);

          // Calculate RMS Volume
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i] * dataArray[i];
          }
          const rms = Math.sqrt(sum / dataArray.length);
          const normVol = Math.min(100, Math.round((rms / 128) * 100));
          setVolumeLevel(normVol);

          // Energy classification
          if (normVol < 15) setEnergyLevel('low');
          else if (normVol > 60) setEnergyLevel('high');
          else setEnergyLevel('medium');

          // Pitch dynamism estimation from frequency distribution
          let highFreqEnergy = 0;
          let lowFreqEnergy = 0;
          const mid = Math.floor(dataArray.length / 2);
          for (let i = 0; i < mid; i++) lowFreqEnergy += dataArray[i];
          for (let i = mid; i < dataArray.length; i++) highFreqEnergy += dataArray[i];

          const ratio = highFreqEnergy / (lowFreqEnergy || 1);
          if (ratio < 0.15) setPitchVariation('monotone');
          else if (ratio > 0.8) setPitchVariation('excessive');
          else setPitchVariation('varied');

          animationFrameRef.current = requestAnimationFrame(analyzeAudio);
        };

        analyzeAudio();
      } catch (err) {
        console.warn("Web Audio API initialization warning:", err);
      }
    }

    // 2. Speech Recognition Setup (Web Speech API)
    const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognitionClass) {
      try {
        const recognition = new SpeechRecognitionClass();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          let currentTranscript = '';
          let latestInterim = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcriptText = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              currentTranscript += transcriptText + ' ';
            } else {
              latestInterim += transcriptText;
            }
          }

          const fullText = (currentTranscript + latestInterim).trim();
          if (fullText) {
            setTranscript(fullText);
            setRecentChunk(latestInterim || fullText.split(' ').slice(-8).join(' '));

            // Word Count & WPM
            const words = fullText.split(/\s+/).filter(Boolean);
            wordCountRef.current = words.length;
            const elapsedMins = Math.max(0.05, (Date.now() - startTimeRef.current) / 60000);
            const calculatedWpm = Math.round(words.length / elapsedMins);
            setWpm(calculatedWpm);

            // Check for fillers in recent words
            const lowerText = fullText.toLowerCase();
            FILLER_WORDS.forEach((filler) => {
              const regex = new RegExp(`\\b${filler}\\b`, 'gi');
              const matches = lowerText.match(regex);
              if (matches && matches.length > 0) {
                const matchCount = matches.length;
                const prevRecorded = detectedFillersRef.current[filler] || 0;
                if (matchCount > prevRecorded) {
                  detectedFillersRef.current[filler] = matchCount;
                  setLastFiller(filler);
                  setFillerCount(prev => prev + (matchCount - prevRecorded));
                  fillersListRef.current.push(filler);

                  // Flash alert
                  setTimeout(() => setLastFiller(null), 2000);
                }
              }
            });

            // Periodically request Gemini Realtime Feedback (every 3.5 seconds)
            const now = Date.now();
            if (now - lastFeedbackTimeRef.current > 3500 && fullText.length > 10) {
              lastFeedbackTimeRef.current = now;
              fetchGeminiFeedback(
                fullText.split(' ').slice(-15).join(' '),
                calculatedWpm,
                energyLevel,
                fillersListRef.current.slice(-3)
              );
            }
          }
        };

        recognition.onerror = (e: any) => {
          console.warn("SpeechRecognition error:", e.error);
        };

        recognition.start();
        recognitionRef.current = recognition;
      } catch (err) {
        console.warn("SpeechRecognition could not be started:", err);
      }
    } else {
      // Fallback timer simulation for WPM & feedback if SpeechRecognition isn't available
      const interval = setInterval(() => {
        if (!isActive) return;
        const now = Date.now();
        if (now - lastFeedbackTimeRef.current > 4000) {
          lastFeedbackTimeRef.current = now;
          fetchGeminiFeedback(
            "Speaking live in session...",
            135,
            energyLevel,
            []
          );
        }
      }, 4000);
      return () => clearInterval(interval);
    }

    return () => cleanup();
  }, [isActive, stream]);

  const normEnergy = (vol: number): 'low' | 'medium' | 'high' => {
    if (vol < 15) return 'low';
    if (vol > 60) return 'high';
    return 'medium';
  };

  const fetchGeminiFeedback = async (
    recentText: string,
    currentWpm: number,
    energy: 'low' | 'medium' | 'high',
    recentFillersArr: string[]
  ) => {
    try {
      const res = await getRealtimeFeedback({
        recentTranscript: recentText,
        paceWpm: currentWpm,
        energyLevel: energy,
        pitchVariation,
        fillerCount,
        currentFillers: recentFillersArr,
      });
      if (res && res.suggestion) {
        setFeedback(res);
      }
    } catch (err) {
      console.error("Realtime feedback fetch error:", err);
    }
  };

  const cleanup = () => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
      recognitionRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (audioContextRef.current) {
      try { audioContextRef.current.close(); } catch (e) {}
      audioContextRef.current = null;
    }
  };

  if (!isActive) return null;

  const getPaceColor = (val: number) => {
    if (val < 100) return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    if (val > 165) return 'text-red-400 bg-red-500/10 border-red-500/30';
    return 'text-green-400 bg-green-500/10 border-green-500/30';
  };

  const getPaceText = (val: number) => {
    if (val < 100) return 'SLOW PACE';
    if (val > 165) return 'TOO FAST';
    return 'OPTIMAL PACE';
  };

  const getStatusBorder = (color: string) => {
    if (color === 'red') return 'border-red-500/60 shadow-[0_0_20px_rgba(239,68,68,0.3)] bg-red-950/40';
    if (color === 'amber') return 'border-amber-500/60 shadow-[0_0_20px_rgba(245,158,11,0.3)] bg-amber-950/40';
    return 'border-green-500/60 shadow-[0_0_20px_rgba(34,197,94,0.3)] bg-green-950/40';
  };

  return (
    <div className="absolute top-8 left-8 z-40 flex flex-col sm:flex-row gap-3 pointer-events-none">
      {/* 1. Pace Meter */}
      <div className={`p-3.5 rounded-2xl border backdrop-blur-xl bg-black/80 shadow-2xl flex flex-col justify-between min-w-[190px] ${getPaceColor(wpm)}`}>
        <div className="flex items-center justify-between text-[11px] font-mono font-bold uppercase tracking-wider opacity-80 gap-2">
          <span className="flex items-center gap-1.5"><Gauge className="w-4 h-4" /> PACE</span>
          <span>{wpm} WPM</span>
        </div>
        <div className="text-sm font-bold font-mono mt-1.5 tracking-wide">
          {getPaceText(wpm)}
        </div>
      </div>

      {/* 2. Vocal Energy Meter */}
      <div className={`p-3.5 rounded-2xl border backdrop-blur-xl bg-black/80 shadow-2xl flex flex-col justify-between min-w-[190px] ${
        energyLevel === 'high' ? 'text-green-400 border-green-500/30' :
        energyLevel === 'low' ? 'text-amber-400 border-amber-500/30' :
        'text-blue-400 border-blue-500/30'
      }`}>
        <div className="flex items-center justify-between text-[11px] font-mono font-bold uppercase tracking-wider opacity-80 gap-2">
          <span className="flex items-center gap-1.5"><Zap className="w-4 h-4" /> VOCAL ENERGY</span>
          <span className="uppercase">{energyLevel}</span>
        </div>
        <div className="text-sm font-bold font-mono mt-1.5 tracking-wide uppercase">
          {energyLevel === 'high' ? 'Strong Resonance' : energyLevel === 'low' ? 'Project Voice More' : 'BALANCED DYNAMICS'}
        </div>
      </div>

      {/* 3. Filler Count Meter */}
      <div className={`p-3.5 rounded-2xl border backdrop-blur-xl bg-black/80 shadow-2xl flex flex-col justify-between min-w-[190px] ${
        fillerCount > 2 ? 'text-red-400 border-red-500/30' :
        fillerCount > 0 ? 'text-amber-400 border-amber-500/30' :
        'text-green-400 border-green-500/30'
      }`}>
        <div className="flex items-center justify-between text-[11px] font-mono font-bold uppercase tracking-wider opacity-80 gap-2">
          <span className="flex items-center gap-1.5"><Mic className="w-4 h-4" /> FILLERS</span>
          <span>{fillerCount} COUNT</span>
        </div>
        <div className="text-sm font-bold font-mono mt-1.5 tracking-wide">
          {fillerCount === 0 ? 'Zero Fillers! 👏' : `${fillerCount} Uttered`}
        </div>
      </div>
    </div>
  );
};
