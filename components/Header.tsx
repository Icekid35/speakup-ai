import React, { useState, useEffect } from 'react';
import { Presentation, UserCheck, FileText, Key } from 'lucide-react';

interface HeaderProps {
  currentMode: 'presentation' | 'interview';
  onModeChange: (mode: 'presentation' | 'interview') => void;
  onOpenScriptDoctor: () => void;
  onOpenApiKeyModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentMode,
  onModeChange,
  onOpenScriptDoctor,
  onOpenApiKeyModal,
}) => {
  const [modelLabel, setModelLabel] = useState('LOCAL GEMMA 4 E2B');
  const [isConfigured, setIsConfigured] = useState(true);

  const updateModelBadge = () => {
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        const mode = data.appMode || 'local';
        let storedModel = localStorage.getItem('speakup_gemini_model') || localStorage.getItem('aura_gemini_model');

        if (mode === 'production') {
          if (!storedModel || storedModel === 'gemma-4-e2b') {
            storedModel = 'gemma-4-31b-it';
            localStorage.setItem('speakup_gemini_model', 'gemma-4-31b-it');
          }
          setIsConfigured(true);
          formatModelName(storedModel);
        } else {
          // Local Mode
          if (storedModel && storedModel !== 'gemma-4-e2b') {
            setIsConfigured(true);
            formatModelName(storedModel);
          } else {
            setIsConfigured(true);
            localStorage.setItem('speakup_gemini_model', 'gemma-4-e2b');
            setModelLabel('LOCAL GEMMA 4 E2B');
          }
        }
      })
      .catch(() => {
        setIsConfigured(true);
        setModelLabel('GEMMA 4 31B IT');
      });
  };

  const formatModelName = (modelKey: string) => {
    switch (modelKey) {
      case 'gemma-4-e2b':
        setModelLabel('LOCAL GEMMA 4 E2B');
        break;
      case 'gemma-4-31b-it':
        setModelLabel('GEMMA 4 31B IT');
        break;
      case 'gemma-4-26b-a4b-it':
        setModelLabel('GEMMA 4 26B A4B IT');
        break;
      default:
        setModelLabel(modelKey.toUpperCase());
    }
  };

  useEffect(() => {
    updateModelBadge();

    const handleModelChange = () => updateModelBadge();
    window.addEventListener('speakup_model_changed', handleModelChange);
    window.addEventListener('aura_model_changed', handleModelChange);
    window.addEventListener('storage', handleModelChange);

    return () => {
      window.removeEventListener('speakup_model_changed', handleModelChange);
      window.removeEventListener('aura_model_changed', handleModelChange);
      window.removeEventListener('storage', handleModelChange);
    };
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-3 md:px-6 py-2.5 bg-white/90 backdrop-blur-xl border-b border-slate-200 flex justify-between items-center whitespace-nowrap min-w-0">
      {/* Brand Wordmark & Home Link */}
      <a href="/" className="flex items-center gap-2 shrink-0 group hover:opacity-90 transition-opacity">
        <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
          <svg className="w-4 h-4 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" fill="currentColor" />
            <circle cx="12" cy="12" r="7" strokeDasharray="2 2" />
            <circle cx="12" cy="12" r="10" strokeOpacity="0.4" />
          </svg>
        </div>
        <div className="flex flex-col justify-center">
          <h1 className="text-sm font-bold tracking-tight text-slate-900 flex items-center gap-0.5 leading-none">
            speakup<span className="text-indigo-600 font-mono text-xs">.ai</span>
          </h1>
          <p className="hidden sm:block text-[10px] text-slate-400 tracking-wide font-mono mt-0.5 leading-none">← Back to Site</p>
        </div>
      </a>

      {/* Right Nav & Model Status */}
      <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 shrink-0">
        {/* Desktop Navigation Tabs (md:flex) */}
        <div className="hidden md:flex items-center p-1 bg-slate-100 border border-slate-200 rounded-xl">
          <button
            onClick={() => onModeChange('presentation')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentMode === 'presentation'
                ? 'bg-white text-indigo-600 font-semibold shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Presentation className="w-3.5 h-3.5" /> Studio Stage
          </button>

          <button
            onClick={() => onModeChange('interview')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentMode === 'interview'
                ? 'bg-white text-indigo-600 font-semibold shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" /> AI Practice Examiner
          </button>
        </div>

        {/* Script Doctor Button */}
        <button
          onClick={onOpenScriptDoctor}
          className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium transition-all shadow-sm"
          title="Script Rewriter"
        >
          <FileText className="w-3.5 h-3.5 text-indigo-600" />
          <span className="hidden sm:inline">Script Rewriter</span>
        </button>

        {/* Dynamic Model & API Key Badge Button */}
        <button
          onClick={onOpenApiKeyModal}
          className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border text-[11px] sm:text-xs font-mono font-medium tracking-tight transition-all shadow-sm shrink-0 ${
            isConfigured
              ? 'border-slate-200 text-slate-700'
              : 'border-amber-500/50 bg-amber-50/50 text-amber-600 animate-pulse font-bold'
          }`}
          title="Change Model or API Key"
        >
          <Key className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span className="truncate max-w-[130px] sm:max-w-none">{modelLabel}</span>
        </button>
      </div>
    </header>
  );
};
