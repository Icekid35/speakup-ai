import React, { useState, useEffect } from 'react';
import { Key, Shield, Sparkles, X, Check, Cpu, AlertTriangle, Loader2, Info } from 'lucide-react';

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
    if (isLocalSelectedInProduction) return;
    if (!model) {
      setErrorMsg('Please select an AI model before proceeding.');
      return;
    }

    setIsValidating(true);
    setErrorMsg(null);

    try {
      localStorage.setItem('speakup_gemini_model', model);
      localStorage.setItem('aura_gemini_model', model);

      window.dispatchEvent(new CustomEvent('speakup_model_changed', { detail: { model } }));
      window.dispatchEvent(new CustomEvent('aura_model_changed', { detail: { model } }));

      setSaved(true);
      onKeySaved();
      setTimeout(() => { onClose(); }, 600);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save model configuration.');
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
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-mono font-bold text-slate-900">
                AI Model Selection
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
              <span className="font-bold text-rose-800">Error: </span>
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
          {/* Model Selection Dropdown */}
          <div>
            <label className="block text-xs font-mono font-bold text-indigo-600 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5" /> Select Active Gemma Model
            </label>
            <select
              value={model}
              onChange={(e) => { setModel(e.target.value); setErrorMsg(null); }}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-indigo-400 font-mono transition-colors"
            >
              <option value="gemma-4-31b-it">Gemma 4 31B IT (Recommended — Cloud API)</option>
              <option value="gemma-4-26b-a4b-it">Gemma 4 26B A4B IT (Cloud API)</option>
              <option value="gemma-4-e2b">Local Gemma 4 E2B (LiteRT Local Server)</option>
            </select>
          </div>

          {/* Automatic API Key Status Notice */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 flex items-start gap-3">
            <Shield className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-600 leading-relaxed">
              <span className="font-bold text-slate-800">API Credentials Pre-configured:</span> API authentication is handled automatically via environment configuration (<code className="text-indigo-600">.env</code>).
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
            {isValidating ? 'Saving...' : saved ? 'Saved!' : 'Save & Apply'}
          </button>
        </div>
      </div>
    </div>
  );
};
