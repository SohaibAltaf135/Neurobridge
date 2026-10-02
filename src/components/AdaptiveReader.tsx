import React, { useState, useEffect, useRef } from 'react';
import { ProcessedStudySession, AccessibilitySettings } from '../types';
import { formatToBionicHtml } from '../utils/bionic';
import { 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  RotateCcw, 
  BookOpen, 
  Lightbulb, 
  HelpCircle, 
  Clock, 
  Sparkles,
  ExternalLink 
} from 'lucide-react';

interface AdaptiveReaderProps {
  session: ProcessedStudySession;
  settings: AccessibilitySettings;
}

export const AdaptiveReader: React.FC<AdaptiveReaderProps> = ({ session, settings }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activeSentenceIndex, setActiveSentenceIndex] = useState<number>(-1);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Split text into sentences for spoken tracking
  const textToRead = `${session.plainEnglishSummary} Let's look at the real world analogy: ${session.realWorldAnalogy}`;
  const sentences = textToRead.match(/[^.!?]+[.!?]+/g) || [textToRead];

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const toggleSpeech = () => {
    if (!synthRef.current) return;

    if (isPlaying) {
      synthRef.current.cancel();
      setIsPlaying(false);
      setActiveSentenceIndex(-1);
    } else {
      synthRef.current.cancel();
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = settings.speechRate || 1.0;
      utterance.pitch = 1.0;

      utterance.onend = () => {
        setIsPlaying(false);
        setActiveSentenceIndex(-1);
      };

      utterance.onerror = () => {
        setIsPlaying(false);
        setActiveSentenceIndex(-1);
      };

      utteranceRef.current = utterance;
      synthRef.current.speak(utterance);
      setIsPlaying(true);
    }
  };

  const stopSpeech = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsPlaying(false);
      setActiveSentenceIndex(-1);
    }
  };

  // Font sizing styles
  const fontClass = 
    settings.font === 'opendyslexic' 
      ? 'font-opendyslexic' 
      : settings.font === 'lexend' 
      ? 'font-lexend' 
      : 'font-sans';

  const sizeClass = 
    settings.fontSize === 'xlarge' 
      ? 'text-xl sm:text-2xl leading-relaxed' 
      : settings.fontSize === 'large' 
      ? 'text-lg sm:text-xl leading-relaxed' 
      : 'text-base sm:text-lg leading-relaxed';

  const spacingClass = 
    settings.letterSpacing === 'wider' 
      ? 'tracking-wider' 
      : settings.letterSpacing === 'wide' 
      ? 'tracking-wide' 
      : 'tracking-normal';

  return (
    <div className={`space-y-8 ${fontClass} ${spacingClass}`}>
      
      {/* Top Controls: Audio Narration & Reading Stats */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 flex items-center justify-between flex-wrap gap-4 shadow-xs">
        
        {/* Left: Narration Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleSpeech}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
              isPlaying
                ? 'bg-amber-500 hover:bg-amber-600 text-white animate-pulse'
                : 'bg-brand-600 hover:bg-brand-700 text-white shadow-brand-500/20'
            }`}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
            <span>{isPlaying ? 'Pause Narration' : 'Read Aloud (Voice)'}</span>
          </button>

          {isPlaying && (
            <button
              onClick={stopSpeech}
              title="Stop Narration"
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}

          <span className="text-xs text-slate-500 hidden sm:inline ml-2">
            Pacing: {settings.speechRate}x
          </span>
        </div>

        {/* Right: Reading time estimate */}
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1 font-medium bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700">
            <Clock className="w-3.5 h-3.5 text-brand-600" />
            <span>~{session.readingTimeMinutes} min quick read</span>
          </span>
          <span className="font-semibold text-brand-600 dark:text-brand-400">
            {settings.bionicReading ? 'Bionic Reading Active' : 'Standard Text'}
          </span>
        </div>

      </div>

      {/* Main Reading Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
        
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="p-1 rounded-md bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300">
              <Sparkles className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Plain English Breakdown
            </span>
          </div>

          {/* Formatted Text Box */}
          <div className={`${sizeClass} text-slate-800 dark:text-slate-200 leading-relaxed font-normal`}>
            {settings.bionicReading ? (
              <p
                dangerouslySetInnerHTML={{
                  __html: formatToBionicHtml(session.plainEnglishSummary)
                }}
              />
            ) : (
              <p>{session.plainEnglishSummary}</p>
            )}
          </div>
        </div>

        {/* Real-World Analogy Card (Visual Anchor) */}
        {session.realWorldAnalogy && (
          <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-brand-500/10 to-indigo-500/10 border border-amber-200 dark:border-amber-900/60 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300">
                Mental Anchor: Real-World Analogy
              </div>
              <div className="mt-1 text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
                {settings.bionicReading ? (
                  <span
                    dangerouslySetInnerHTML={{
                      __html: formatToBionicHtml(session.realWorldAnalogy)
                    }}
                  />
                ) : (
                  <span>{session.realWorldAnalogy}</span>
                )}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Jargon Translation Cards (Demystifying Dense Terms) */}
      {session.jargonTerms && session.jargonTerms.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-brand-600" />
              <span>Jargon Demystifier ({session.jargonTerms.length} Terms)</span>
            </h3>
            <span className="text-xs text-slate-500">
              Stiff textbook words translated into plain English
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {session.jargonTerms.map((jargon, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 hover:border-brand-300 transition-all shadow-xs"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-bold text-brand-700 dark:text-brand-300">
                    {jargon.term}
                  </span>
                  <span className="text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded">
                    Concept
                  </span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 mt-2 font-medium">
                  {jargon.simpleDefinition}
                </p>
                {jargon.realWorldAnalogy && (
                  <div className="mt-2.5 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/80 text-[11px] text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-slate-800 flex items-start gap-1.5">
                    <span className="text-amber-500 shrink-0">💡</span>
                    <span><strong>Like:</strong> {jargon.realWorldAnalogy}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Original Source Reference Drawer (Collapsible) */}
      {session.originalText && (
        <details className="group bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 p-4 transition-all">
          <summary className="text-xs font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer list-none flex items-center justify-between">
            <span>📄 View Original Unedited Textbook / Source Excerpt</span>
            <span className="text-brand-600 text-[11px] font-bold group-open:rotate-180 transition-transform">
              ▼
            </span>
          </summary>
          <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 leading-relaxed font-mono">
            {session.originalText}
          </div>
        </details>
      )}

    </div>
  );
};
