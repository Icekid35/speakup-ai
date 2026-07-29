import React, { useState, useRef, useEffect } from 'react';
import { X, RefreshCw, Loader2, ArrowRight, Video, Mic2, Wand2, Target, CheckCircle, ArrowLeft } from 'lucide-react';
import { Segment } from '../types';

interface DrillModalProps {
  isOpen: boolean;
  onClose: () => void;
  segment: Segment;
  onDrillComplete: (newSegment: Segment, videoBlob: Blob) => void;
  analyzeDrill: (blob: Blob, segment: Segment) => Promise<Segment>;
}

export const DrillModal: React.FC<DrillModalProps> = ({ isOpen, onClose, segment, onDrillComplete, analyzeDrill }) => {
  const [step, setStep] = useState<'intro' | 'recording' | 'review' | 'analyzing' | 'success' | 'fail'>('intro');
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [videoBlobUrl, setVideoBlobUrl] = useState<string | null>(null);
  const [newSegment, setNewSegment] = useState<Segment | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const recordingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const videoBlobUrlRef = useRef<string | null>(null);
  
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      setStep('intro');
      setVideoBlob(null);
      if (videoBlobUrlRef.current) {
        URL.revokeObjectURL(videoBlobUrlRef.current);
        videoBlobUrlRef.current = null;
      }
      setVideoBlobUrl(null);
      setNewSegment(null);
      setCountdown(null);
    } else {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      if (recordingTimeoutRef.current) {
        clearTimeout(recordingTimeoutRef.current);
        recordingTimeoutRef.current = null;
      }
      if (videoBlobUrlRef.current) {
        URL.revokeObjectURL(videoBlobUrlRef.current);
        videoBlobUrlRef.current = null;
      }
      setVideoBlobUrl(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (step === 'recording' && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(e => console.error("Video play error:", e));
    }
  }, [step]);

  useEffect(() => {
    if (step === 'review' && videoRef.current && videoBlobUrl) {
      const videoElement = videoRef.current;
      videoElement.srcObject = null;
      videoElement.pause();
      videoElement.removeAttribute('src');
      videoElement.src = videoBlobUrl;
      videoElement.muted = false;
      
      videoElement.onloadedmetadata = () => {
        videoElement.currentTime = 0.001;
      };
      
      videoElement.load();
    }
  }, [step, videoBlobUrl]);

  if (!isOpen) return null;

  const startRecording = async () => {
    try {
      if (videoBlobUrlRef.current) {
        URL.revokeObjectURL(videoBlobUrlRef.current);
        videoBlobUrlRef.current = null;
      }
      setVideoBlobUrl(null);

      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1920 }, 
          height: { ideal: 1080 },
          aspectRatio: { ideal: 16/9 }
        }, 
        audio: true 
      });
      streamRef.current = stream;

      setStep('recording');
      
      setCountdown(3);
      for(let i=3; i>0; i--) {
        setCountdown(i);
        await new Promise(r => setTimeout(r, 1000));
      }
      setCountdown(null);

      const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
      chunksRef.current = [];
      
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setVideoBlob(blob);
        setVideoBlobUrl(url);
        videoBlobUrlRef.current = url;
        
        stream.getTracks().forEach(track => track.stop());
        streamRef.current = null;
        
        setStep('review');
      };

      recorder.start();
      mediaRecorderRef.current = recorder;

      recordingTimeoutRef.current = setTimeout(() => {
        if (recorder.state === 'recording') {
          recorder.stop();
        }
      }, 15000);

    } catch (err) {
      console.error(err);
      alert("Camera error: Please ensure permissions are granted.");
      setStep('intro');
    }
  };

  const stopRecording = () => {
    if (recordingTimeoutRef.current) {
      clearTimeout(recordingTimeoutRef.current);
      recordingTimeoutRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  };

  const submitDrill = async () => {
    if (!videoBlob) return;
    setStep('analyzing');
    try {
      const result = await analyzeDrill(videoBlob, segment);
      setNewSegment(result);
      if (result.score >= 80) {
        setStep('success');
      } else {
        setStep('fail');
      }
    } catch (e) {
      alert("Analysis failed. Try again.");
      setStep('review');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xl p-4 md:p-8 animate-fade-in">
      <div className="relative w-full max-w-4xl h-[85vh] bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col">

        {/* --- HEADER --- */}
        {step !== 'recording' && (
          <div className="relative z-10 px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center shadow-md">
                <Target className="text-white w-5 h-5" />
              </div>
              <div>
                 <h2 className="text-lg font-mono font-bold text-slate-900 tracking-wide">Correction Drill</h2>
                 <p className="text-xs text-slate-400 uppercase tracking-widest font-mono">Targeted Micro-Correction Protocol</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={onClose} 
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-xs border border-slate-200 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 text-indigo-600" /> ← Back to Report
              </button>
              <button 
                onClick={onClose} 
                className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors border border-slate-200"
                title="Close"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
          </div>
        )}

        {/* --- CONTENT AREA --- */}
        <div className={`relative z-10 flex-1 overflow-y-auto flex flex-col ${step !== 'recording' ? 'p-6 md:p-8' : ''}`}>
          
          {/* STEP: INTRO (Pre-recording) */}
          {step === 'intro' && (
            <div className="flex flex-col h-full gap-6">
               
               {/* 1. Comparison Grid */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-5 flex-1">
                  
                  {/* Original Side */}
                  <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 flex flex-col relative overflow-hidden">
                     <p className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest mb-3">Original Take</p>
                     <p className="text-lg text-slate-700 italic font-serif leading-relaxed">"{segment.transcript}"</p>
                     <div className="mt-auto pt-5 border-t border-slate-200">
                       <p className="text-rose-600 text-xs font-mono uppercase mb-1">Detected Issue</p>
                       <p className="text-sm text-slate-500">{segment.observation}</p>
                     </div>
                  </div>

                  {/* Rewrite Side */}
                  <div className="bg-indigo-50/60 rounded-2xl p-6 border border-indigo-200 flex flex-col relative overflow-hidden">
                     <p className="text-xs font-mono font-bold text-indigo-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                       AI Script Rewrite <ArrowRight className="w-3 h-3"/>
                     </p>
                     <p className="text-2xl font-bold text-slate-900 leading-tight mb-5">
                       "{segment.better_phrasing || segment.transcript}"
                     </p>
                     
                     <div className="mt-auto bg-white rounded-xl p-4 border border-indigo-100">
                       <div className="flex items-start gap-3">
                         <div className="mt-1 w-6 h-6 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center shrink-0">
                            <Mic2 className="w-3 h-3 text-indigo-600" />
                         </div>
                         <div>
                           <p className="text-indigo-600 text-xs font-bold uppercase mb-1">Delivery Cues</p>
                           <p className="text-slate-700 text-sm font-medium">{segment.delivery_cue || segment.advice}</p>
                         </div>
                       </div>
                     </div>
                  </div>
               </div>

               {/* Camera Preview / Launch Area */}
               <div className="h-[180px] min-h-[160px] bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-center relative overflow-hidden group cursor-pointer hover:border-indigo-500/50 transition-colors" onClick={startRecording}>
                  <div className="absolute inset-0 bg-gradient-to-t from-indigo-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="flex flex-col items-center gap-3 transition-transform group-hover:scale-105 duration-300">
                    <div className="w-14 h-14 rounded-full bg-rose-600 flex items-center justify-center shadow-lg">
                       <div className="w-5 h-5 bg-white rounded-full"></div>
                    </div>
                    <p className="text-white font-mono font-bold tracking-widest text-sm">Tap to Start Recording</p>
                    <p className="text-white/40 text-xs font-mono">Maximum duration: 15 seconds</p>
                  </div>
               </div>
            </div>
          )}

          {/* STEP: RECORDING */}
          {step === 'recording' && (
             <div className="absolute inset-0 z-50 bg-black flex flex-col">
                <div className="absolute inset-0 z-0">
                   <video 
                     ref={videoRef} 
                     className="w-full h-full object-cover transform scale-x-[-1]" 
                     playsInline
                     autoPlay
                     muted
                   />
                </div>

                <div className="absolute top-0 left-0 right-0 z-10 pt-20 pb-28 px-8 bg-gradient-to-b from-black/90 via-black/40 to-transparent flex items-start justify-center text-center pointer-events-none min-h-[40%]">
                   <p className="text-3xl md:text-4xl font-bold text-white leading-snug drop-shadow-lg">
                     "{segment.better_phrasing || segment.transcript}"
                   </p>
                </div>

                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none">
                   {countdown !== null && (
                     <div className="text-[10rem] font-bold text-white animate-ping drop-shadow-2xl">{countdown}</div>
                   )}

                   {countdown === null && (
                     <div className="absolute bottom-12 pointer-events-auto">
                       <button onClick={stopRecording} className="group relative flex items-center justify-center w-24 h-24">
                         <div className="absolute inset-0 bg-red-600 rounded-full opacity-20 animate-ping"></div>
                         <div className="relative w-24 h-24 rounded-full border-4 border-white flex items-center justify-center bg-red-600/20 backdrop-blur-sm hover:scale-105 transition-transform hover:bg-red-600/40">
                             <div className="w-8 h-8 bg-red-500 rounded-sm shadow-lg"></div>
                         </div>
                         <p className="absolute -bottom-8 text-white/80 font-mono text-xs tracking-widest uppercase">Stop Recording</p>
                       </button>
                     </div>
                   )}
                </div>
             </div>
          )}

          {/* STEP: REVIEW & ANALYZING */}
          {(step === 'review' || step === 'analyzing') && (
            <div className="flex flex-col h-full gap-5 items-center justify-center animate-fade-in">
               <div className="w-full max-w-2xl aspect-video bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-xl relative">
                 <video 
                   ref={videoRef} 
                   className="w-full h-full object-contain" 
                   playsInline
                   controls
                 />
               </div>
               
               <div className="flex gap-4 w-full max-w-lg">
                  <button onClick={startRecording} className="flex-1 py-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-mono font-bold transition-colors">
                    Retry
                  </button>
                  <button onClick={submitDrill} disabled={step === 'analyzing'} className="flex-1 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-mono font-bold transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-60">
                    {step === 'analyzing' ? <Loader2 className="w-5 h-5 animate-spin"/> : <Wand2 className="w-5 h-5"/>}
                    {step === 'analyzing' ? 'Evaluating Your Delivery...' : 'Evaluate This Take'}
                  </button>
               </div>
            </div>
          )}

          {/* STEP: RESULTS */}
          {(step === 'success' || step === 'fail') && newSegment && (
            <div className="flex flex-col h-full items-center justify-center text-center max-w-2xl mx-auto animate-fade-in gap-6">
               <div className={`w-24 h-24 rounded-full flex items-center justify-center shadow-xl ${step === 'success' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>
                  <span className="text-4xl font-bold font-mono">{newSegment.score}</span>
               </div>
               
               <div>
                 <h3 className="text-3xl font-bold text-slate-900 mb-2">{step === 'success' ? 'Excellent Delivery' : 'Still Needs Work'}</h3>
                 <p className="text-slate-500">{step === 'success' ? 'Congruence achieved. Your timeline has been updated.' : 'Your delivery still needs adjustment.'}</p>
               </div>

               <div className="bg-slate-50 rounded-2xl p-6 w-full text-left border border-slate-200">
                 <p className="text-xs text-slate-400 uppercase font-bold mb-2">Analysis</p>
                 <p className="text-slate-900 text-base leading-relaxed">{newSegment.observation}</p>
                 {step === 'fail' && (
                    <div className="mt-4 pt-4 border-t border-slate-200">
                      <p className="text-xs text-indigo-600 uppercase font-bold mb-1">Coach Advice</p>
                      <p className="text-slate-700">{newSegment.advice}</p>
                    </div>
                 )}
               </div>

               {step === 'success' ? (
                 <button onClick={() => { onDrillComplete(newSegment, videoBlob!); onClose(); }} className="w-full py-4 rounded-xl bg-emerald-600 text-white font-bold font-mono hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 shadow-md">
                   <CheckCircle className="w-5 h-5" /> Apply Fix & Close
                 </button>
               ) : (
                 <button onClick={() => setStep('intro')} className="w-full py-4 rounded-xl bg-slate-900 text-white font-bold font-mono hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
                   <RefreshCw className="w-5 h-5" /> Try Again
                 </button>
               )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};