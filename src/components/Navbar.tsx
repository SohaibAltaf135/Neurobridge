import React from 'react';
import { Brain, Key, Award, Sparkles, BookOpen } from 'lucide-react';

interface NavbarProps {
  onOpenApiKeyModal: () => void;
  hasApiKey: boolean;
  onLoadSample: (sampleId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenApiKeyModal,
  hasApiKey,
  onLoadSample
}) => {
  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
            <Brain className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-brand-700 via-indigo-600 to-brand-500 bg-clip-text text-transparent dark:from-brand-300 dark:to-indigo-300">
                NeuroBridge
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                <Award className="w-3 h-3" />
                ImpactHack 2026
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
              Adaptive Learning & Accessibility Copilot
            </p>
          </div>
        </div>

        {/* Right CTA tools */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Demo Preloader */}
          <div className="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 px-2 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              Try Demo:
            </span>
            <button
              onClick={() => onLoadSample('sample-biology-cell-respiration')}
              className="px-2.5 py-1 rounded-md bg-white dark:bg-slate-700 hover:bg-brand-50 dark:hover:bg-brand-900/50 text-slate-700 dark:text-slate-200 font-medium transition-colors shadow-xs"
            >
              Biology (ATP)
            </button>
            <button
              onClick={() => onLoadSample('sample-physics-newtons-laws')}
              className="px-2.5 py-1 rounded-md bg-white dark:bg-slate-700 hover:bg-brand-50 dark:hover:bg-brand-900/50 text-slate-700 dark:text-slate-200 font-medium transition-colors shadow-xs"
            >
              Physics (Forces)
            </button>
          </div>

          {/* Gemini API Key Button */}
          <button
            onClick={onOpenApiKeyModal}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              hasApiKey
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                : 'bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 border-brand-300 dark:border-brand-700 hover:bg-brand-100'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>{hasApiKey ? 'Gemini Active' : 'Configure Gemini AI'}</span>
          </button>
        </div>

      </div>
    </header>
  );
};
