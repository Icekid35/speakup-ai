import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, RefreshCw, Upload, Video, Wand2, Volume2, Sparkles, CheckCircle2, ShieldAlert, Radio, ChevronDown } from 'lucide-react';
import { SpeakUpAnalysis, Segment } from '../types';
import { ProblemSpotlight } from './AROverlay';
import { Timeline } from './Timeline';

interface VideoStageProps {
  onVideoReady: (blob: Blob, url: string) => void;
  onTimeUpdate: (time: number) => void;
  videoUrl: string | null;
  onAnalyze: (videoDuration?: number) => void;
  isAnalyzing: boolean;
  analysisProgress: number;
  externalSeekTime: number | null;
  canAnalyze: boolean;
  analysis: SpeakUpAnalysis | null;
  currentTime: number;
  onSeek: (time: number) => void;
  onCoachDebrief: () => void;
  onReset: () => void;
}

export const VideoStage: React.FC<VideoStageProps> = ({
  onVideoReady,
  onTimeUpdate,
  videoUrl,
  onAnalyze,
  isAnalyzing,
  analysisProgress,
  externalSeekTime,
  canAnalyze,
  analysis,
  currentTime,
  onSeek,
  onCoachDebrief,
  onReset,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isLivePractice, setIsLivePractice] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [currentStream, setCurrentStream] = useState<MediaStream | null>(null);
  const [showFirstTimeHint, setShowFirstTimeHint] = useState(false);
  const [previousSegmentId, setPreviousSegmentId] = useState<string | null>(null);
  const [videoAspectRatio, setVideoAspectRatio] = useState<number | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const chunksRef = useRef<Blob[]>([]);

  const currentSegment = analysis?.segments && analysis.segments.length > 0
    ? (analysis.segments.find(s => currentTime >= s.start_time && currentTime < s.end_time) || analysis.segments[0])
    : null;

  // External seek handler
  useEffect(() => {
    if (externalSeekTime !== null && videoRef.current) {
      videoRef.current.currentTime = externalSeekTime;
    }
  }, [externalSeekTime]);

  // Track segment changes
  useEffect(() => {
    if (currentSegment?.id && currentSegment.id !== previousSegmentId) {
      const timer = setTimeout(() => {
        setPreviousSegmentId(currentSegment.id);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [currentSegment?.id]);

  // Reset aspect ratio when video is cleared
  useEffect(() => {
    if (!videoUrl && !isRecording) {
      setVideoAspectRatio(null);
    }
  }, [videoUrl, isRecording]);

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const w = videoRef.current.videoWidth;
      const h = videoRef.current.videoHeight;
      if (w && h && h > 0) {
        setVideoAspectRatio(w / h);
      }
      if (videoRef.current.currentTime === 0) {
        videoRef.current.currentTime = 0.001;
      }
    }
  };

  const startRecordingFixed = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: true,
      });
      setCurrentStream(stream);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true;
        videoRef.current.play().catch(e => console.error(e));
      }

      chunksRef.current = [];
      const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        onVideoReady(blob, url);

        stream.getTracks().forEach(track => track.stop());
        setCurrentStream(null);
        if (videoRef.current) {
          videoRef.current.srcObject = null;
          videoRef.current.src = url;
          videoRef.current.muted = false;
          videoRef.current.controls = false;
          videoRef.current.onloadedmetadata = () => {
            if (videoRef.current) videoRef.current.currentTime = 0.001;
          };
        }
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (err) {
      console.error('Error accessing camera:', err);
      alert('Could not access camera/microphone.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      setIsRecording(false);
      setCurrentStream(null);
    }
  };

  const cancelRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.onstop = null;
      if (mediaRecorder.state !== 'inactive') mediaRecorder.stop();
    }
    chunksRef.current = [];
    if (currentStream) {
      currentStream.getTracks().forEach(track => track.stop());
      setCurrentStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
      videoRef.current.src = '';
    }
    setIsRecording(false);
    onReset();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onVideoReady(file, url);
      if (videoRef.current) {
        videoRef.current.src = url;
        videoRef.current.controls = false;
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) videoRef.current.currentTime = 0.001;
        };
      }
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play().catch(e => {
          if (e.name !== 'AbortError') console.error('Play error:', e);
        });
      } else {
        videoRef.current.pause();
      }
    }
  };

  const handleMainTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    onTimeUpdate(e.currentTarget.currentTime);
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6">
      {/* 1. TOP STATUS & ACTION BAR */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 mb-4 border-b border-slate-200">
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${isRecording ? 'bg-rose-500 animate-ping' : videoUrl ? 'bg-emerald-500' : 'bg-slate-300'}`} />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700">
              {isRecording ? 'LIVE RECORDING' : videoUrl ? 'PRESENTATION READY' : 'STUDIO IDLE'}
            </span>
          </div>

          {videoUrl && !isRecording && (
            <button
              onClick={onReset}
              className="text-[10px] font-mono text-slate-500 hover:text-rose-600 underline transition-colors"
            >
              Reset Video
            </button>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          {canAnalyze && !analysis && (
            <button
              onClick={() => {
                const dur = videoRef.current?.duration || 60;
                onAnalyze(dur);
              }}
              disabled={isAnalyzing}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-mono text-xs font-bold transition-all shadow-md shadow-indigo-100 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Analyzing Video ({analysisProgress}%)...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> Run Multimodal Speech Analysis
                </>
              )}
            </button>
          )}

          {analysis && (
            <button
              onClick={onCoachDebrief}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Volume2 className="w-4 h-4" /> Spoken Feedback Summary
            </button>
          )}
        </div>
      </div>

      {/* 2. MAIN WORKSPACE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Main Viewfinder (lg:col-span-7) */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          <div
            className={`relative rounded-3xl overflow-hidden group flex items-center justify-center transition-all mx-auto ${
              !videoUrl && !isRecording 
                ? 'w-full bg-white border border-slate-200 shadow-md shadow-slate-200/50 p-6 sm:p-10 text-center min-h-[260px] sm:aspect-video' 
                : 'w-full bg-slate-950 border border-slate-800 shadow-2xl p-0'
            } ${!videoAspectRatio && (videoUrl || isRecording) ? 'aspect-video' : ''}`}
            style={{
              aspectRatio: (videoUrl || isRecording) && videoAspectRatio ? `${videoAspectRatio}` : undefined,
              maxHeight: (videoUrl || isRecording) ? '80vh' : undefined,
            }}
          >

            {/* Video Element */}
            <video
              ref={videoRef}
              onLoadedMetadata={handleLoadedMetadata}
              className={`w-full h-full max-h-[80vh] ${isRecording ? 'object-cover -scale-x-1' : 'object-contain'} ${!videoUrl && !isRecording ? 'hidden' : 'block'}`}
              onTimeUpdate={handleMainTimeUpdate}
              playsInline
            />

            {/* Overlay Diagnostics */}
            {analysis && (
              <ProblemSpotlight
                segment={currentSegment}
                currentTime={currentTime}
                previousSegmentId={previousSegmentId}
              />
            )}

            {/* Landing / Idle State - Fills Full Container Directly */}
            {!videoUrl && !isRecording && (
              <div className="flex flex-col items-center justify-center space-y-5 max-w-md w-full my-auto">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm">
                  <Video className="w-7 h-7 sm:w-8 sm:h-8" />
                </div>

                <div className="space-y-1.5 px-4">
                  <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">Upload or Record Presentation</h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-sans max-w-sm mx-auto">
                    Master voice tone, body language, and speech delivery with Google Gemma 4.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-sm pt-1 px-4">
                  <label className="w-full sm:w-1/2 px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-xs cursor-pointer transition-all shadow-md shadow-indigo-200 flex items-center justify-center gap-2 whitespace-nowrap">
                    <Upload className="w-4 h-4 shrink-0" />
                    <span>Import Video</span>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>

                  <button
                    onClick={startRecordingFixed}
                    className="w-full sm:w-1/2 px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 font-bold text-xs transition-all flex items-center justify-center gap-2 border border-slate-200 whitespace-nowrap"
                  >
                    <Video className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>Start Recording</span>
                  </button>
                </div>
              </div>
            )}

            {/* Recording HUD Overlay */}
            {isRecording && (
              <div className="absolute inset-x-0 bottom-6 flex justify-center gap-3 z-30">
                <button
                  onClick={stopRecording}
                  className="px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-mono font-bold text-xs shadow-lg flex items-center gap-2"
                >
                  ■ Stop & Save Recording
                </button>
                <button
                  onClick={cancelRecording}
                  className="px-4 py-3 rounded-2xl bg-slate-800/80 hover:bg-slate-900 text-white font-mono text-xs backdrop-blur-md"
                >
                  Cancel
                </button>
              </div>
            )}

            {/* Video Controls Bar */}
            {videoUrl && !isRecording && (
              <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-slate-950/80 via-slate-950/40 to-transparent flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity z-30">
                <button
                  onClick={togglePlay}
                  className="p-2.5 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white transition-colors"
                >
                  {videoRef.current && !videoRef.current.paused ? (
                    <Pause className="w-5 h-5 fill-current" />
                  ) : (
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Mobile Scroll Hint */}
          {!videoUrl && !isRecording && (
            <div className="flex sm:hidden items-center justify-center gap-1 text-[11px] text-slate-400 font-mono">
              <span>Scroll down for AI tools</span>
              <ChevronDown className="w-3.5 h-3.5 text-indigo-500 animate-bounce" />
            </div>
          )}

          {/* Timeline */}
          {analysis && videoUrl && (
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
              <Timeline
                duration={videoRef.current?.duration || 60}
                segments={analysis.segments}
                currentTime={currentTime}
                onSeek={onSeek}
                selectedSegmentId={currentSegment?.id || null}
              />
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: AI Diagnostics & Script Rewrites Panel (lg:col-span-5) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {analysis && currentSegment ? (
            <>
              {/* Script Doctor & Segment Review Card */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
                {/* Segment Status Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${currentSegment.status === 'congruent' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                    <span className="text-xs font-mono font-semibold uppercase text-slate-700">
                      {currentSegment.status === 'congruent' ? 'IN SYNC' : 'NEEDS WORK'}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-slate-500">Score: {currentSegment.score}/100</span>
                </div>

                {/* Improved Script Phrase */}
                <div className="space-y-1.5">
                  <p className="text-[10px] font-mono text-indigo-600 uppercase tracking-wider font-semibold flex items-center gap-1.5">
                    <Wand2 className="w-3 h-3 text-indigo-600" /> Improved Script
                  </p>
                  <p className="text-base font-semibold text-slate-900 leading-relaxed font-sans">
                    "{currentSegment.better_phrasing || currentSegment.transcript}"
                  </p>
                </div>

                {/* Delivery Cue */}
                <div className="pt-2 border-t border-slate-100">
                  <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Coach Tip</p>
                  <p className="text-xs text-slate-600 leading-relaxed font-sans">
                    {currentSegment.delivery_cue || currentSegment.advice}
                  </p>
                </div>
              </div>

              {/* Vocal & Posture Metrics Card */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
                <h3 className="text-xs font-mono text-slate-500 uppercase tracking-wider font-semibold">Delivery Breakdown</h3>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  {/* Pace */}
                  <div className={`p-3 rounded-xl border flex flex-col justify-between transition-colors ${['good', 'varied'].includes(currentSegment.vocal_analysis?.pace?.toLowerCase() || '')
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                      : 'bg-amber-50 border-amber-200 text-amber-700'
                  }`}>
                    <span className="text-[10px] font-mono opacity-80 uppercase">Pace</span>
                    <span className="font-bold capitalize">{currentSegment.vocal_analysis?.pace || 'Normal'}</span>
                  </div>

                  {/* Energy */}
                  <div className={`p-3 rounded-xl border flex flex-col justify-between transition-colors ${currentSegment.vocal_analysis?.energy_level === 'high' || currentSegment.vocal_analysis?.energy_level === 'medium'
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                      : 'bg-amber-50 border-amber-200 text-amber-700'
                  }`}>
                    <span className="text-[10px] font-mono opacity-80 uppercase">Vocal Energy</span>
                    <span className="font-bold capitalize">{currentSegment.vocal_analysis?.energy_level || 'Balanced'}</span>
                  </div>

                  {/* Eye Contact */}
                  <div className={`p-3 rounded-xl border flex flex-col justify-between transition-colors ${['good', 'excellent'].includes(currentSegment.visual_analysis?.eye_contact?.toLowerCase() || '')
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                      : 'bg-amber-50 border-amber-200 text-amber-700'
                  }`}>
                    <span className="text-[10px] font-mono opacity-80 uppercase">Eye Contact</span>
                    <span className="font-bold capitalize">{currentSegment.visual_analysis?.eye_contact || 'Inconsistent'}</span>
                  </div>

                  {/* Posture */}
                  <div className={`p-3 rounded-xl border flex flex-col justify-between transition-colors ${['upright', 'good', 'strong'].includes(currentSegment.visual_analysis?.posture?.toLowerCase() || '')
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                      : 'bg-amber-50 border-amber-200 text-amber-700'
                  }`}>
                    <span className="text-[10px] font-mono opacity-80 uppercase">Body Posture</span>
                    <span className="font-bold capitalize">{currentSegment.visual_analysis?.posture || 'Upright'}</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center space-y-3 shadow-sm">
              <div className="w-10 h-10 mx-auto rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <p className="text-xs text-slate-500 font-sans">
                Record or import a video presentation to view real-time vocal tone, eye contact, and script rewrites.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};