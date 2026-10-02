import React, { useState, useEffect } from 'react';
import { ProcessedStudySession, AccessibilitySettings, BackgroundTint } from './types';
import { SAMPLE_SESSIONS } from './data/sampleSessions';
import { processStudyMaterial } from './services/gemini';
import { Navbar } from './components/Navbar';
import { AccessibilityBar } from './components/AccessibilityBar';
import { ReadingRuler } from './components/ReadingRuler';
import { InputHero } from './components/InputHero';
import { StudyDashboard } from './components/StudyDashboard';
import { ApiKeyModal } from './components/ApiKeyModal';
import { 
  Heart, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle, 
  Zap, 
  BookOpen, 
  Award, 
  Users, 
  Layers 
} from 'lucide-react';

export function App() {
  const [session, setSession] = useState<ProcessedStudySession | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // API Key state with localStorage persistence
  const [apiKey, setApiKey] = useState<string>(() => {
    return localStorage.getItem('neurobridge_gemini_key') || '';
  });
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState<boolean>(false);

  // Accessibility Suite State
  const [isA11yOpen, setIsA11yOpen] = useState<boolean>(false);
  const [settings, setSettings] = useState<AccessibilitySettings>({
    font: 'lexend',
    tint: 'default',
    fontSize: 'normal',
    letterSpacing: 'normal',
    bionicReading: true,
    readingRuler: false,
    highlightKeyTerms: true,
    speechRate: 1.0
  });

  const handleUpdateSettings = (newSettings: Partial<AccessibilitySettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const handleSaveApiKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem('neurobridge_gemini_key', key);
  };

  const handleLoadSample = (sampleId: string) => {
    const found = SAMPLE_SESSIONS.find((s) => s.id === sampleId);
    if (found) {
      setSession(JSON.parse(JSON.stringify(found)));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleProcessMaterial = async (data: {
    text?: string;
    imageBase64?: string;
    imageMimeType?: string;
    learningStyle?: 'eli5' | 'highschool' | 'storytelling';
  }) => {
    setIsLoading(true);
    setError(null);
    try {
      const processed = await processStudyMaterial(apiKey, data);
      setSession(processed);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during synthesis.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleTask = (taskId: string) => {
    if (!session) return;
    setSession({
      ...session,
      microTasks: session.microTasks.map((t) =>
        t.id === taskId ? { ...t, completed: !t.completed } : t
      )
    });
  };

  // Background tint classes
  const getTintClass = (tint: BackgroundTint) => {
    switch (tint) {
      case 'cream':
        return 'bg-[#FFFDF5] text-amber-950';
      case 'softYellow':
        return 'bg-[#FFF9D2]/70 text-amber-950';
      case 'softGreen':
        return 'bg-[#EDF8F2] text-emerald-950';
      case 'softBlue':
        return 'bg-[#EDF5FC] text-slate-900';
      case 'dark':
        return 'dark bg-slate-950 text-slate-100';
      default:
        return 'bg-slate-50 text-slate-900';
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 flex flex-col ${getTintClass(settings.tint)}`}>
      
      {/* Eye Focus Reading Ruler (ADHD Assist) */}
      <ReadingRuler enabled={settings.readingRuler} />

      {/* Top Navbar */}
      <Navbar
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        hasApiKey={Boolean(apiKey && apiKey.trim() !== '')}
        onLoadSample={handleLoadSample}
      />

      {/* Global Accessibility Bar (Persistent & Configurable) */}
      <AccessibilityBar
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        isOpen={isA11yOpen}
        onToggleOpen={() => setIsA11yOpen(!isA11yOpen)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        
        {/* Error Alert */}
        {error && (
          <div className="max-w-4xl mx-auto px-4 mt-6">
            <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center justify-between">
              <span>{error}</span>
              <button
                onClick={() => setError(null)}
                className="font-bold underline ml-2"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* View Switch: Input Hero vs Dashboard */}
        {session ? (
          <StudyDashboard
            session={session}
            settings={settings}
            apiKey={apiKey}
            onReset={() => setSession(null)}
            onToggleTask={handleToggleTask}
          />
        ) : (
          <div className="space-y-12 pb-16">
            <InputHero
              onProcess={handleProcessMaterial}
              isLoading={isLoading}
              onLoadSample={handleLoadSample}
            />

            {/* Why NeuroBridge Matters Section (For Judges & Students) */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-slate-200 dark:border-slate-800">
              
              <div className="text-center max-w-2xl mx-auto mb-10">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                  Built for Real-World Social Impact
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                  How NeuroBridge Transforms Learning
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-2">
                  1 in 5 students learn differently. Traditional textbooks weren't built for neurodivergent brains—NeuroBridge is.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-3">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">Bionic Reading</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Guides saccadic eye movements by bolding the start of words, reducing visual crowding and reading fatigue.
                  </p>
                </div>

                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-3">
                    <Zap className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">Interactive Mind Maps</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Converts dense paragraphs into visual nodes and connection webs so visual learners grasp structure in seconds.
                  </p>
                </div>

                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">Micro-Missions (ADHD)</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Overcomes executive paralysis by breaking study blocks into 3–5 minute bite-sized sprints with a focus timer.
                  </p>
                </div>

                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                  <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center mb-3">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">Active Recall & Tutor</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Low-stress flip cards, mnemonics, and an empathetic AI tutor ready to answer questions 24/7.
                  </p>
                </div>

              </div>

            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-6 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between flex-wrap gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 dark:text-white">NeuroBridge</span>
            <span>• Built with ❤️ for ImpactHack 2026</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">Targeting: Social Impact • Education • Accessibility • AI</span>
            <button
              onClick={() => setIsApiKeyModalOpen(true)}
              className="text-brand-600 hover:underline font-semibold"
            >
              API Key Settings
            </button>
          </div>
        </div>
      </footer>

      {/* Gemini API Key Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        apiKey={apiKey}
        onSaveKey={handleSaveApiKey}
      />

    </div>
  );
}
