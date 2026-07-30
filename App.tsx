import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { VideoStage } from './components/VideoStage';
import { CoachDebrief } from './components/CoachDebrief';
import { AIInterviewStage } from './components/AIInterviewStage';
import { ScriptDoctorModal } from './components/ScriptDoctorModal';
import { ApiKeyModal } from './components/ApiKeyModal';
import { analyzeVideo, generateDebriefScript } from './services/geminiService';
import { generateCoachSpeech } from './services/ttsService';
import { SpeakUpAnalysis, Segment } from './types';
import { AnalysisView } from './components/AnalysisView';
import { ChevronDown, Video, UserCheck, FileText, Settings } from 'lucide-react';

function App() {
  const [appMode, setAppMode] = useState<'presentation' | 'interview'>('presentation');
  const [isScriptDoctorOpen, setIsScriptDoctorOpen] = useState<boolean>(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState<boolean>(false);

  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<SpeakUpAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [selectedSegmentId, setSelectedSegmentId] = useState<string | null>(null);
  const [seekTime, setSeekTime] = useState<number | null>(null);
  const [isCoachOpen, setIsCoachOpen] = useState(false);
  const [showFullReport, setShowFullReport] = useState(false);

  const [coachScript, setCoachScript] = useState<string | null>(null);
  const [coachAudio, setCoachAudio] = useState<Blob | null>(null);

  useEffect(() => {
    if (analysis && analysis.segments && !seekTime) {
      const activeSegment = analysis.segments.find(
        s => currentTime >= s.start_time && currentTime < s.end_time
      );
      if (activeSegment && activeSegment.id !== selectedSegmentId) {
        setSelectedSegmentId(activeSegment.id);
      }
    }
  }, [currentTime, analysis, seekTime, selectedSegmentId]);

  const handleVideoReady = (blob: Blob, url: string) => {
    setVideoBlob(blob);
    setVideoUrl(url);
    setAnalysis(null);
    setCoachScript(null);
    setCoachAudio(null);
    setCurrentTime(0);
    setShowFullReport(false);
    setAnalysisProgress(0);
  };

  const handleReset = () => {
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
    }
    setVideoBlob(null);
    setVideoUrl(null);
    setAnalysis(null);
    setIsAnalyzing(false);
    setAnalysisProgress(0);
    setCurrentTime(0);
    setSelectedSegmentId(null);
    setSeekTime(null);
    setShowFullReport(false);
    setCoachScript(null);
    setCoachAudio(null);
  };

  const [apiKeyModalNotice, setApiKeyModalNotice] = useState<string | null>(null);

  const handleAnalyze = async (videoDuration?: number) => {
    if (!videoBlob) return;

    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setCoachScript(null);
    setCoachAudio(null);

    const progressInterval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        const increment = prev < 30 ? 5 : prev < 60 ? 3 : prev < 80 ? 2 : 1;
        return Math.min(90, prev + increment);
      });
    }, 800);

    try {
      const dur = videoDuration && !isNaN(videoDuration) && videoDuration > 0 ? Math.round(videoDuration) : 60;
      const result = await analyzeVideo(videoBlob, 'full', null, dur);
      
      clearInterval(progressInterval);
      setAnalysisProgress(100);
      
      await new Promise(r => setTimeout(r, 500));

      const initializedResult = {
        ...result,
        segments: result.segments.map(s => ({
          ...s,
          useDrillVersion: false
        }))
      };
      
      setAnalysis(initializedResult);
      if (initializedResult.segments.length > 0) {
        setSelectedSegmentId(initializedResult.segments[0].id);
      }
      setIsAnalyzing(false);
      setAnalysisProgress(0);

      generateDebriefScript(initializedResult).then(async (script) => {
        setCoachScript(script);
        try {
          const audioBlob = await generateCoachSpeech(script);
          setCoachAudio(audioBlob);
        } catch (e) {
          console.error("Audio gen failed in background", e);
        }
      }).catch(e => console.error("Coach background gen failed", e));

    } catch (error) {
      clearInterval(progressInterval);
      alert("Analysis failed. See console for details.");
      setIsAnalyzing(false);
      setAnalysisProgress(0);
    }
  };

  const handleSeek = (time: number) => {
    setSeekTime(time);
    if (analysis) {
      const seg = analysis.segments.find(s => time >= s.start_time && time < s.end_time);
      if (seg) setSelectedSegmentId(seg.id);
    }
    setTimeout(() => setSeekTime(null), 100);
  };

  const handleSegmentSelect = (segment: Segment) => {
    setSelectedSegmentId(segment.id);
    setSeekTime(segment.start_time);
    setTimeout(() => setSeekTime(null), 100);
  };

  const handleReplaySegment = () => {
    if (analysis && selectedSegmentId) {
      const seg = analysis.segments.find(s => s.id === selectedSegmentId);
      if (seg) {
        setSeekTime(seg.start_time);
        setTimeout(() => setSeekTime(null), 100);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 overflow-x-hidden selection:bg-indigo-100 selection:text-indigo-900 flex flex-col justify-between">
      <div>
        <Header 
          currentMode={appMode}
          onModeChange={setAppMode}
          onOpenScriptDoctor={() => setIsScriptDoctorOpen(true)}
          onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        />

        <ApiKeyModal
          isOpen={isApiKeyModalOpen}
          onClose={() => setIsApiKeyModalOpen(false)}
          onKeySaved={() => {
            console.log("API Key configuration updated");
          }}
        />
        
        <main className="relative z-10 pt-16 md:pt-20 pb-24 md:pb-8">
          {appMode === 'interview' ? (
            <AIInterviewStage onExit={() => setAppMode('presentation')} />
          ) : (
            <>
              {/* Presentation Stage */}
              <VideoStage 
                onVideoReady={handleVideoReady}
                onTimeUpdate={setCurrentTime}
                videoUrl={videoUrl}
                onAnalyze={handleAnalyze}
                isAnalyzing={isAnalyzing}
                analysisProgress={analysisProgress}
                externalSeekTime={seekTime}
                canAnalyze={!!videoBlob}
                analysis={analysis}
                currentTime={currentTime}
                onSeek={handleSeek}
                onCoachDebrief={() => setIsCoachOpen(true)}
                onReset={handleReset}
              />

              {/* Toggle Full Diagnostics Report */}
              {analysis && (
                <div className="flex justify-center mt-6 pb-6">
                  <button 
                    onClick={() => setShowFullReport(!showFullReport)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-slate-200 text-slate-700 hover:text-slate-900 hover:border-slate-300 transition-all font-mono text-xs font-semibold shadow-sm"
                  >
                    <span>{showFullReport ? 'Hide Diagnostic Breakdown' : 'View Complete Diagnostic Report'}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showFullReport ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              )}

              {/* Detailed Analysis Panel */}
              {analysis && showFullReport && (
                <div className="max-w-6xl mx-auto px-4 md:px-6 animate-fade-in pb-20">
                  <AnalysisView 
                    analysis={analysis}
                    selectedSegmentId={selectedSegmentId}
                    onSegmentSelect={handleSegmentSelect}
                    onReplaySegment={handleReplaySegment}
                    onNewPresentation={handleReset}
                  />
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* --- NATIVE MOBILE BOTTOM NAVIGATION BAR (md:hidden) --- */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-slate-200 px-4 py-2 flex items-center justify-around shadow-lg">
        <button
          onClick={() => setAppMode('presentation')}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] font-medium transition-colors ${
            appMode === 'presentation' ? 'text-indigo-600 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Video className="w-5 h-5" />
          <span>Studio</span>
        </button>

        <button
          onClick={() => setAppMode('interview')}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] font-medium transition-colors ${
            appMode === 'interview' ? 'text-indigo-600 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <UserCheck className="w-5 h-5" />
          <span>Practice</span>
        </button>

        <button
          onClick={() => setIsScriptDoctorOpen(true)}
          className="flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] font-medium text-slate-500 hover:text-slate-800 transition-colors"
        >
          <FileText className="w-5 h-5" />
          <span>Rewriter</span>
        </button>

        <button
          onClick={() => setIsApiKeyModalOpen(true)}
          className="flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] font-medium text-slate-500 hover:text-slate-800 transition-colors"
        >
          <Settings className="w-5 h-5" />
          <span>Config</span>
        </button>
      </nav>

      <ScriptDoctorModal
        isOpen={isScriptDoctorOpen}
        onClose={() => setIsScriptDoctorOpen(false)}
        onUseTeleprompterLines={(lines) => {
          console.log("Teleprompter lines loaded:", lines);
        }}
      />

      {isCoachOpen && analysis && (
        <CoachDebrief 
          isOpen={isCoachOpen}
          onClose={() => setIsCoachOpen(false)}
          analysis={analysis}
          preloadedScript={coachScript}
          preloadedAudio={coachAudio}
          onNewPresentation={handleReset}
        />
      )}

      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => {
          setIsApiKeyModalOpen(false);
          setApiKeyModalNotice(null);
        }}
        initialMessage={apiKeyModalNotice}
        onKeySaved={() => {
          setApiKeyModalNotice(null);
        }}
      />
    </div>
  );
}

export default App;