import React, { useState, useEffect } from 'react';
import { Key, Shield, Sparkles, X, Check, Trash2, Cpu, AlertTriangle, Loader2 } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeySaved: () => void;
  initialMessage?: string | null;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  onKeySaved,
  initialMessage
}) => {
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('');
  const [appMode, setAppMode] = useState<'local' | 'production'>('local');
  const [isValidating, setIsValidating] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setErrorMsg(initialMessage || null);
      setSaved(false);
      setIsValidating(false);

      fetch('/api/config')
        .then(res => res.json())
        .then(data => {
          const mode = data.appMode || 'local';
          setAppMode(mode);

          const storedKey = localStorage.getItem('speakup_gemini_api_key') || localStorage.getItem('aura_gemini_api_key') || data.envApiKey || '';
          const storedModel = localStorage.getItem('speakup_gemini_model') || localStorage.getItem('aura_gemini_model') || data.envModel;
          const validModels = ['gemma-4-e2b', 'gemma-4-31b-it', 'gemma-4-26b-a4b-it'];

          setApiKey(storedKey);
          if (storedModel && validModels.includes(storedModel)) {
            setModel(storedModel);
          } else if (mode === 'production') {
            setModel(data.envModel || '');
          } else {
            setModel('gemma-4-e2b');
          }
        })
        .catch(() => {
          const storedKey = localStorage.getItem('speakup_gemini_api_key') || localStorage.getItem('aura_gemini_api_key') || '';
          const storedModel = localStorage.getItem('speakup_gemini_model') || localStorage.getItem('aura_gemini_model') || 'gemma-4-e2b';
          setApiKey(storedKey);
          setModel(storedModel);
        });
    }
  }, [isOpen, initialMessage]);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!model) {
      setErrorMsg('Please select an AI model before proceeding.');
      return;
    }

    if (model !== 'gemma-4-e2b' && !apiKey.trim()) {
      setErrorMsg('API Key is required for cloud models.');
      return;
    }

    setIsValidating(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/validate-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: apiKey.trim(), model })
      });

      const data = await res.json();

      if (res.ok && data.valid) {
        if (apiKey.trim()) {
          localStorage.setItem('speakup_gemini_api_key', apiKey.trim());
          localStorage.setItem('aura_gemini_api_key', apiKey.trim());
        } else {
          localStorage.removeItem('speakup_gemini_api_key');
          localStorage.removeItem('aura_gemini_api_key');
        }
        localStorage.setItem('speakup_gemini_model', model);
        localStorage.setItem('aura_gemini_model', model);

        window.dispatchEvent(new CustomEvent('speakup_model_changed', { detail: { model, apiKey: apiKey.trim() } }));
        window.dispatchEvent(new CustomEvent('aura_model_changed', { detail: { model, apiKey: apiKey.trim() } }));
        
        setSaved(true);
        onKeySaved();
        setTimeout(() => { onClose(); }, 800);
      } else {
        setErrorMsg(data.error || 'Validation failed. Please verify your credentials.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Validation request failed. Check your network connection.');
    } finally {
      setIsValidating(false);
    }
  };

  const handleClear = () => {
    localStorage.removeItem('speakup_gemini_api_key');
    localStorage.removeItem('aura_gemini_api_key');
    setApiKey('');
    setErrorMsg(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-fade-in">
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-mono font-bold text-slate-900">
                AI Model Configuration
              </h2>
              <p className="text-xs text-slate-500">
                Mode: <span className="text-indigo-600 font-mono font-bold uppercase">{appMode}</span> — Choose & Verify Your Model
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Validation Error Banner */}
        {errorMsg && (
          <div className="mb-5 bg-rose-50 border border-rose-200 rounded-2xl p-3.5 flex items-start gap-3 text-rose-700">
            <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed font-sans">
              <span className="font-bold text-rose-800">Error: </span>
              {errorMsg}
            </div>
          </div>
        )}

        {/* Mode Info Notice */}
        {appMode === 'production' && !localStorage.getItem('speakup_gemini_model') && !localStorage.getItem('aura_gemini_model') && !errorMsg && (
          <div className="mb-5 bg-amber-50 border border-amber-200 rounded-2xl p-3.5 flex items-start gap-3 text-amber-700">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed">
              <span className="font-bold text-amber-800">No Model Selected:</span> Production mode requires an AI model and API key before running analysis.
            </div>
          </div>
        )}

        {/* Form Body */}
        <div className="space-y-5 mb-6">
          {/* Model Selection */}
          <div>
            <label className="block text-xs font-mono font-bold text-indigo-600 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5" /> Choose AI Model
            </label>
            <select
              value={model}
              onChange={(e) => { setModel(e.target.value); setErrorMsg(null); }}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-indigo-400 font-mono transition-colors"
            >
              <option value="" disabled>-- Select Gemma Model --</option>
              <option value="gemma-4-e2b">Local Gemma 4 E2B (LiteRT Local Server)</option>
              <option value="gemma-4-31b-it">Gemma 4 31B IT (Google Cloud API)</option>
              <option value="gemma-4-26b-a4b-it">Gemma 4 26B A4B IT (Google Cloud API)</option>
            </select>
          </div>

          {/* API Key Input */}
          <div>
            <label className="block text-xs font-mono font-bold text-indigo-600 uppercase tracking-wider mb-2 flex justify-between">
              <span>Google Gemini API Key {model === 'gemma-4-e2b' ? '(Optional for Local)' : '(Required)'}</span>
              {apiKey && <span className="text-emerald-600 font-sans text-[11px] font-normal">Key Active</span>}
            </label>
            <div className="relative">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => { setApiKey(e.target.value); setErrorMsg(null); }}
                placeholder={model === 'gemma-4-e2b' ? 'Not required for Local Gemma 4 E2B' : 'AIzaSy...'}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-400 font-mono transition-colors"
              />
              {apiKey && (
                <button 
                  onClick={handleClear}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-rose-500 transition-colors"
                  title="Clear Key"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5">
              Validated before saving. Stored only in your browser's <code className="text-indigo-600">localStorage</code>.
            </p>
          </div>

          {/* Info Banner */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 flex items-start gap-3">
            <Shield className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-600 leading-relaxed">
              <span className="font-bold text-slate-800">Secure Validation:</span> Clicking <code className="text-indigo-600">SAVE & APPLY</code> runs a quick verification ping before saving your credentials.
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
          <button
            onClick={onClose}
            disabled={isValidating}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isValidating}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-mono text-xs font-bold hover:bg-indigo-700 transition-all shadow-sm disabled:opacity-50"
          >
            {isValidating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : saved ? (
              <Check className="w-4 h-4" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            {isValidating ? 'Verifying...' : saved ? 'Saved Successfully!' : 'Save & Apply'}
          </button>
        </div>
      </div>
    </div>
  );
};
