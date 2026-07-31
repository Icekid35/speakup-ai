import React, { useState, useEffect } from 'react';
import { Key, Shield, Sparkles, X, Check, Cpu, AlertTriangle, Loader2, ExternalLink, Eye, EyeOff } from 'lucide-react';

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
  const [model, setModel] = useState('gemma-4-31b-it');
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [appMode, setAppMode] = useState<'local' | 'production'>('local');
  const [hasEnvApiKey, setHasEnvApiKey] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setErrorMsg(initialMessage || null);
      setSaved(false);
      setIsValidating(false);

      const storedKey = localStorage.getItem('speakup_gemini_api_key') || localStorage.getItem('aura_gemini_api_key') || '';
      setApiKey(storedKey);

      fetch('/api/config')
        .then(res => res.json())
        .then(data => {
          const mode = data.appMode || 'local';
          setAppMode(mode);
          setHasEnvApiKey(!!data.hasEnvApiKey);

          const storedModel = localStorage.getItem('speakup_gemini_model') || localStorage.getItem('aura_gemini_model');
          const validModels = ['gemma-4-e2b', 'gemma-4-31b-it', 'gemma-4-26b-a4b-it'];

          if (storedModel && validModels.includes(storedModel)) {
            if (mode === 'production' && storedModel === 'gemma-4-e2b') {
              setModel('gemma-4-31b-it');
            } else {
              setModel(storedModel);
            }
          } else if (mode === 'production') {
            setModel(data.envModel || 'gemma-4-31b-it');
          } else {
            setModel('gemma-4-e2b');
          }
        })
        .catch(() => {
          const storedModel = localStorage.getItem('speakup_gemini_model') || localStorage.getItem('aura_gemini_model') || 'gemma-4-31b-it';
          setModel(storedModel);
        });
    }
  }, [isOpen, initialMessage]);

  if (!isOpen) return null;

  const isLocalSelectedInProduction = appMode === 'production' && model === 'gemma-4-e2b';

  const handleSave = async () => {
    if (isLocalSelectedInProduction) {
      setErrorMsg('Local Gemma 4 E2B is unavailable in production mode. Please select a cloud Gemma model.');
      return;
    }
    if (!model) {
      setErrorMsg('Please select an AI model before proceeding.');
      return;
    }

    const keyToValidate = apiKey.trim();

    // If cloud model selected, check if we have either a user key or an env key
    if (model !== 'gemma-4-e2b' && !keyToValidate && !hasEnvApiKey) {
      setErrorMsg('Google Gemini API Key is required. Please paste your API key from Google AI Studio.');
      return;
    }

    setIsValidating(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/validate-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model, apiKey: keyToValidate })
      });

      const data = await res.json();

      if (res.ok && data.valid) {
        if (keyToValidate) {
          localStorage.setItem('speakup_gemini_api_key', keyToValidate);
          localStorage.setItem('aura_gemini_api_key', keyToValidate);
        } else {
          localStorage.removeItem('speakup_gemini_api_key');
          localStorage.removeItem('aura_gemini_api_key');
        }

        localStorage.setItem('speakup_gemini_model', model);
        localStorage.setItem('aura_gemini_model', model);

        window.dispatchEvent(new CustomEvent('speakup_api_key_changed', { detail: { apiKey: keyToValidate } }));
        window.dispatchEvent(new CustomEvent('speakup_model_changed', { detail: { model } }));

        setSaved(true);
        onKeySaved();
        onClose();
      } else {
        setErrorMsg(data.error || 'Model verification failed.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to communicate with verification server.');
    } finally {
      setIsValidating(false);
    }
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
                API Key & Model Settings
              </h2>
              <p className="text-xs text-slate-500">
                Environment: <span className="text-indigo-600 font-mono font-bold uppercase">{appMode}</span>
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

        {/* Error Banner */}
        {errorMsg && (
          <div className="mb-5 bg-rose-50 border border-rose-200 rounded-2xl p-3.5 flex items-start gap-3 text-rose-700">
            <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed font-sans">
              <span className="font-bold text-rose-800">Notice: </span>
              {errorMsg}
            </div>
          </div>
        )}

        {/* Local Selected in Production Warning */}
        {isLocalSelectedInProduction && (
          <div className="mb-5 bg-amber-50 border border-amber-200 rounded-2xl p-3.5 flex items-start gap-3 text-amber-800">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed">
              <span className="font-bold text-amber-900">Local Model Unavailable: </span>
              Local Gemma 4 E2B is only available when running locally on your device. Please select a cloud Gemma model for production mode.
            </div>
          </div>
        )}

        {/* Form Body */}
        <div className="space-y-5 mb-6">

          {/* API Key Input Section (shown for cloud models or optional override) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-mono font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-indigo-600" /> Google Gemini API Key
              </label>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-mono text-indigo-600 hover:text-indigo-700 font-semibold hover:underline"
              >
                <span>Get key at AI Studio</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="relative">
              <input
                type={showApiKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => { setApiKey(e.target.value); setErrorMsg(null); }}
                placeholder={hasEnvApiKey ? "Pre-configured in .env (or paste custom key here)" : "Paste your Gemini API key (AIzaSy...)"}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-4 pr-10 py-3 text-xs font-mono text-slate-900 focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-400"
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 transition-colors"
                title={showApiKey ? "Hide API key" : "Show API key"}
              >
                {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5 font-sans leading-normal">
              Your API key is saved securely in your browser's local storage and used directly for Google Gemma AI requests.
            </p>
          </div>

          {/* Model Selection Dropdown */}
          <div>
            <label className="block text-xs font-mono font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-indigo-600" /> Select Active Gemma Model
            </label>
            <select
              value={model}
              onChange={(e) => { setModel(e.target.value); setErrorMsg(null); }}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 font-mono transition-colors"
            >
              <option value="gemma-4-31b-it">Gemma 4 31B IT (Recommended — Cloud API)</option>
              <option value="gemma-4-26b-a4b-it">Gemma 4 26B A4B IT (Cloud API)</option>
              <option value="gemma-4-e2b">Local Gemma 4 E2B (LiteRT Local Server)</option>
            </select>
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
            disabled={isValidating || isLocalSelectedInProduction}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-mono text-xs font-bold hover:bg-indigo-700 transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isValidating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : saved ? (
              <Check className="w-4 h-4" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            {isValidating ? 'Verifying Key...' : saved ? 'Saved!' : 'Save & Verify'}
          </button>
        </div>
      </div>
    </div>
  );
};
