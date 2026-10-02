import React from 'react';
import { AccessibilitySettings } from '../types';
import { 
  Eye, 
  Type, 
  Sparkles, 
  Sliders, 
  Sun, 
  Moon, 
  Volume2, 
  Compass, 
  AlignJustify 
} from 'lucide-react';

interface AccessibilityBarProps {
  settings: AccessibilitySettings;
  onUpdateSettings: (newSettings: Partial<AccessibilitySettings>) => void;
  isOpen: boolean;
  onToggleOpen: () => void;
}

export const AccessibilityBar: React.FC<AccessibilityBarProps> = ({
  settings,
  onUpdateSettings,
  isOpen,
  onToggleOpen
}) => {
  return (
    <aside 
      aria-label="Accessibility & Neurodivergent Controls"
      className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm transition-all"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-4 flex-wrap">
        
        {/* Left: Quick Indicators & Primary Toggles */}
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
          <button
            onClick={onToggleOpen}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
              isOpen
                ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Accessibility Suite</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">
              {settings.bionicReading || settings.readingRuler || settings.font !== 'default' ? 'Active' : 'Custom'}
            </span>
          </button>

          {/* Quick Toggle 1: Bionic Reading */}
          <button
            onClick={() => onUpdateSettings({ bionicReading: !settings.bionicReading })}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              settings.bionicReading
                ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700 font-bold'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
            title="Bold the first few letters of words to guide eye focus (Bionic Reading)"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Bionic Reading</span>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${settings.bionicReading ? 'bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-100' : 'bg-slate-200 dark:bg-slate-700'}`}>
              {settings.bionicReading ? 'ON' : 'OFF'}
            </span>
          </button>

          {/* Quick Toggle 2: Reading Ruler */}
          <button
            onClick={() => onUpdateSettings({ readingRuler: !settings.readingRuler })}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              settings.readingRuler
                ? 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-200 border border-indigo-300 dark:border-indigo-700 font-bold'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
            title="Focus line overlay that tracks your cursor to avoid line-skipping"
          >
            <Eye className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Reading Ruler</span>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${settings.readingRuler ? 'bg-indigo-200 dark:bg-indigo-900 text-indigo-900 dark:text-indigo-100' : 'bg-slate-200 dark:bg-slate-700'}`}>
              {settings.readingRuler ? 'ON' : 'OFF'}
            </span>
          </button>
        </div>

        {/* Right: Quick Color Tints */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">Color Tint:</span>
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => onUpdateSettings({ tint: 'default' })}
              title="Default Crisp White"
              className={`w-6 h-6 rounded-md bg-white border ${settings.tint === 'default' ? 'ring-2 ring-brand-500 border-transparent' : 'border-slate-300'}`}
            />
            <button
              onClick={() => onUpdateSettings({ tint: 'cream' })}
              title="Warm Cream (Reduces Blue Light Strain)"
              className={`w-6 h-6 rounded-md bg-[#FFFDF5] border ${settings.tint === 'cream' ? 'ring-2 ring-brand-500 border-transparent' : 'border-amber-200'}`}
            />
            <button
              onClick={() => onUpdateSettings({ tint: 'softYellow' })}
              title="Soft Irlen Yellow (Helps visual stress)"
              className={`w-6 h-6 rounded-md bg-[#FFF9D2] border ${settings.tint === 'softYellow' ? 'ring-2 ring-brand-500 border-transparent' : 'border-yellow-200'}`}
            />
            <button
              onClick={() => onUpdateSettings({ tint: 'softGreen' })}
              title="Calming Mint Green"
              className={`w-6 h-6 rounded-md bg-[#EDF8F2] border ${settings.tint === 'softGreen' ? 'ring-2 ring-brand-500 border-transparent' : 'border-emerald-200'}`}
            />
            <button
              onClick={() => onUpdateSettings({ tint: 'softBlue' })}
              title="Serene Pastel Blue"
              className={`w-6 h-6 rounded-md bg-[#EDF5FC] border ${settings.tint === 'softBlue' ? 'ring-2 ring-brand-500 border-transparent' : 'border-blue-200'}`}
            />
            <button
              onClick={() => onUpdateSettings({ tint: 'dark' })}
              title="High Contrast Dark Mode"
              className={`w-6 h-6 rounded-md bg-slate-900 border ${settings.tint === 'dark' ? 'ring-2 ring-brand-500 border-transparent' : 'border-slate-700'}`}
            />
          </div>
        </div>
      </div>

      {/* Expanded Accessibility Customizer Drawer */}
      {isOpen && (
        <div className="bg-slate-50 dark:bg-slate-900/95 border-t border-slate-200 dark:border-slate-800 p-4 sm:p-6 transition-all animate-fadeIn">
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* 1. Typography Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5 text-brand-600" />
                <span>Reading Font</span>
              </label>
              <div className="grid grid-cols-1 gap-1.5">
                <button
                  onClick={() => onUpdateSettings({ font: 'lexend' })}
                  className={`text-left px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                    settings.font === 'lexend'
                      ? 'bg-brand-50 dark:bg-brand-950/50 border-brand-500 text-brand-700 dark:text-brand-300 font-bold'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="font-lexend font-bold">Lexend (Recommended)</div>
                  <div className="text-[11px] text-slate-500">Engineered to improve reading fluency & reduce cognitive strain</div>
                </button>
                <button
                  onClick={() => onUpdateSettings({ font: 'opendyslexic' })}
                  className={`text-left px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                    settings.font === 'opendyslexic'
                      ? 'bg-brand-50 dark:bg-brand-950/50 border-brand-500 text-brand-700 dark:text-brand-300 font-bold'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="font-opendyslexic font-bold">OpenDyslexic</div>
                  <div className="text-[11px] text-slate-500">Weighted bottom letters prevent rotation & confusion</div>
                </button>
                <button
                  onClick={() => onUpdateSettings({ font: 'default' })}
                  className={`text-left px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                    settings.font === 'default'
                      ? 'bg-brand-50 dark:bg-brand-950/50 border-brand-500 text-brand-700 dark:text-brand-300 font-bold'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="font-sans font-bold">Inter / System</div>
                  <div className="text-[11px] text-slate-500">Standard crisp geometric font</div>
                </button>
              </div>
            </div>

            {/* 2. Text Sizing */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <AlignJustify className="w-3.5 h-3.5 text-brand-600" />
                <span>Text Size & Spacing</span>
              </label>
              
              <div className="space-y-3 bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                <div>
                  <span className="text-xs text-slate-500 block mb-1">Font Size:</span>
                  <div className="flex gap-2">
                    {(['normal', 'large', 'xlarge'] as const).map((size) => (
                      <button
                        key={size}
                        onClick={() => onUpdateSettings({ fontSize: size })}
                        className={`flex-1 py-1.5 text-xs rounded border capitalize font-medium ${
                          settings.fontSize === size
                            ? 'bg-brand-600 text-white border-brand-600'
                            : 'bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200'
                        }`}
                      >
                        {size === 'normal' ? 'Standard (16px)' : size === 'large' ? 'Large (18px)' : 'X-Large (22px)'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-xs text-slate-500 block mb-1">Letter Spacing:</span>
                  <div className="flex gap-2">
                    {(['normal', 'wide', 'wider'] as const).map((space) => (
                      <button
                        key={space}
                        onClick={() => onUpdateSettings({ letterSpacing: space })}
                        className={`flex-1 py-1.5 text-xs rounded border capitalize font-medium ${
                          settings.letterSpacing === space
                            ? 'bg-brand-600 text-white border-brand-600'
                            : 'bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200'
                        }`}
                      >
                        {space === 'normal' ? 'Normal' : space === 'wide' ? 'Expanded' : 'Generous'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Audio / Speech Synthesis Control */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-brand-600" />
                <span>Text-to-Speech Speed</span>
              </label>
              <div className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                  <span>Pacing:</span>
                  <span className="font-bold text-brand-600">{settings.speechRate}x speed</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="1.5"
                  step="0.1"
                  value={settings.speechRate}
                  onChange={(e) => onUpdateSettings({ speechRate: parseFloat(e.target.value) })}
                  className="w-full accent-brand-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>0.5x (Gentle)</span>
                  <span>1.0x (Normal)</span>
                  <span>1.5x (Brisk)</span>
                </div>
              </div>
            </div>

            {/* 4. Special Focus Modes */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-brand-600" />
                <span>Cognitive Assists</span>
              </label>
              <div className="space-y-2">
                <button
                  onClick={() => onUpdateSettings({ highlightKeyTerms: !settings.highlightKeyTerms })}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                    settings.highlightKeyTerms
                      ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-400 text-amber-900 dark:text-amber-200 font-bold'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span>Auto-Highlight Jargon Words</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-200 dark:bg-amber-800 text-amber-900 dark:text-amber-100">
                    {settings.highlightKeyTerms ? 'ON' : 'OFF'}
                  </span>
                </button>

                <div className="p-2.5 rounded-lg bg-brand-50 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800 text-[11px] text-brand-900 dark:text-brand-200">
                  💡 <strong>Tip for ADHD:</strong> Turn on <em>Bionic Reading</em> + <em>Reading Ruler</em> to prevent eye wandering across long paragraphs!
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </aside>
  );
};
