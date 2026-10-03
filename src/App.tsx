import React, { useState } from 'react';
import { ProcessedStudySession } from './types';
import { SAMPLE_SESSIONS } from './data/sampleSessions';
import { processStudyMaterial } from './services/gemini';
import { CleanInput } from './components/CleanInput';
import { CleanDashboard } from './components/CleanDashboard';
import { ApiKeyModal } from './components/ApiKeyModal';
import { Brain, Key, Award } from 'lucide-react';

export function App() {
  const envKey = import.meta.env.VITE_GEMINI_API_KEY || '';
  const [session, setSession] = useState<ProcessedStudySession | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [apiKey, setApiKey] = useState<string>(() => {
    return localStorage.getItem('neurobridge_gemini_key') || '';
  });
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState<boolean>(false);
  const activeKey = envKey || apiKey;
  const handleProcess = async (data: {
    text?: string;
    imageBase64?: string;
    imageMimeType?: string;
  }) => {
    setIsLoading(true);
    setError(null);
    try {
      const processed = await const processed = await processStudyMaterial(activeKey, {
        ...data,
        learningStyle: 'highschool'
      });
      setSession(processed);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setError(err.message || 'Something went wrong while simplifying.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadSample = (sampleId: string) => {
    const found = SAMPLE_SESSIONS.find((s) => s.id === sampleId);
    if (found) {
      setSession(JSON.parse(JSON.stringify(found)));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      
      {/* Minimal, Simple Navbar */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          
          <div 
            onClick={() => setSession(null)} 
            className="flex items-center gap-2.5 cursor-pointer select-none"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-extrabold text-slate-900 tracking-tight">
                NeuroBridge
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full border border-amber-300">
                ImpactHack 2026
              </span>
            </div>
          </div>

          {!envKey && (
            <button
              onClick={() => setIsApiKeyModalOpen(true)}
              className="..."
             >
              ...keep everything inside the same...
            </button>
          )}

        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1">
        {error && (
          <div className="max-w-2xl mx-auto px-4 mt-6">
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center justify-between">
              <span>{error}</span>
              <button onClick={() => setError(null)} className="font-bold underline ml-2">
                Dismiss
              </button>
            </div>
          </div>
        )}

        {session ? (
          <CleanDashboard
            session={session}
            onBack={() => setSession(null)}
          />
        ) : (
          <CleanInput
            onProcess={handleProcess}
            isLoading={isLoading}
            onLoadSample={handleLoadSample}
          />
        )}
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-400">
        NeuroBridge • Simple & Accessible AI Learning for ImpactHack 2026
      </footer>

      {/* API Key Modal */}
      {!envKey && (
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        apiKey={apiKey}
        onSaveKey={(k) => {
          setApiKey(k);
          localStorage.setItem('neurobridge_gemini_key', k);
        }}
      />
    )}
    </div>
  );
}
