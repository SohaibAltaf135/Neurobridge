import React, { useState, useRef } from 'react';
import { ProcessedStudySession } from '../types';
import { formatToBionicHtml } from '../utils/bionic';
import { 
  ArrowLeft, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Lightbulb, 
  BookOpen, 
  RotateCw, 
  CheckCircle2, 
  Circle,
  HelpCircle,
  Type
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CleanDashboardProps {
  session: ProcessedStudySession;
  onBack: () => void;
}

export const CleanDashboard: React.FC<CleanDashboardProps> = ({ session, onBack }) => {
  const [bionicMode, setBionicMode] = useState<boolean>(true);
  const [dyslexicFont, setDyslexicFont] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});
  const synthRef = useRef<SpeechSynthesis | null>(
    typeof window !== 'undefined' ? window.speechSynthesis : null
  );

  const toggleSpeech = () => {
    if (!synthRef.current) return;
    if (isPlaying) {
      synthRef.current.cancel();
      setIsPlaying(false);
    } else {
      synthRef.current.cancel();
      const text = `${session.title}. ${session.plainEnglishSummary}. Here is an analogy: ${session.realWorldAnalogy}`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      synthRef.current.speak(utterance);
      setIsPlaying(true);
    }
  };

  const handleTaskCheck = (id: string) => {
    const newVal = !completedTasks[id];
    setCompletedTasks((prev) => ({ ...prev, [id]: newVal }));
    if (newVal) {
      confetti({ particleCount: 30, spread: 60, origin: { y: 0.8 } });
    }
  };

  const toggleCard = (id: string) => {
    setFlippedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className={`max-w-3xl mx-auto px-4 py-8 space-y-6 ${dyslexicFont ? 'font-opendyslexic' : 'font-sans'}`}>
      
      {/* Top Header */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <button
          onClick={() => {
            if (synthRef.current) synthRef.current.cancel();
            onBack();
          }}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-2xs hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Dyslexic font toggle */}
          <button
            onClick={() => setDyslexicFont(!dyslexicFont)}
            className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${
              dyslexicFont
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {dyslexicFont ? 'Dyslexia Font ON' : 'Dyslexia Font'}
          </button>

          {/* Bionic reading toggle */}
          <button
            onClick={() => setBionicMode(!bionicMode)}
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${
              bionicMode
                ? 'bg-amber-100 text-amber-900 border-amber-300 font-bold'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Sparkles className="w-3 h-3 text-amber-600" />
            <span>Bionic Mode: {bionicMode ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </div>

      {/* Title */}
      <div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
          Study Guide
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
          {session.title}
        </h1>
      </div>

      {/* CARD 1: Plain English Explanation */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            What It Means (In Plain English)
          </h2>
          <button
            onClick={toggleSpeech}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              isPlaying
                ? 'bg-amber-500 text-white'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            {isPlaying ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            <span>{isPlaying ? 'Stop Audio' : 'Listen'}</span>
          </button>
        </div>

        <div className="text-slate-800 text-base sm:text-lg leading-relaxed">
          {bionicMode ? (
            <p dangerouslySetInnerHTML={{ __html: formatToBionicHtml(session.plainEnglishSummary) }} />
          ) : (
            <p>{session.plainEnglishSummary}</p>
          )}
        </div>
      </div>

      {/* CARD 2: Real-World Analogy */}
      {session.realWorldAnalogy && (
        <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-start gap-4">
          <div className="p-2 rounded-xl bg-amber-500 text-white shrink-0 mt-0.5">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-amber-900 uppercase tracking-wider">
              Real-World Comparison
            </div>
            <div className="mt-1 text-sm sm:text-base font-medium text-amber-950 leading-relaxed">
              {bionicMode ? (
                <span dangerouslySetInnerHTML={{ __html: formatToBionicHtml(session.realWorldAnalogy) }} />
              ) : (
                <span>{session.realWorldAnalogy}</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CARD 3: Visual Concept Steps */}
      {session.mindMap?.nodes && session.mindMap.nodes.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Concept Map
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {session.mindMap.nodes.map((node) => (
              <div
                key={node.id}
                className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 space-y-1"
              >
                <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <span>{node.label}</span>
                </div>
                <p className="text-xs text-slate-600 leading-normal">
                  {node.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CARD 4: Jargon Terms Demystified */}
      {session.jargonTerms && session.jargonTerms.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Difficult Words Translated
          </h2>
          <div className="space-y-2">
            {session.jargonTerms.map((term, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <div className="font-bold text-blue-700">{term.term}</div>
                <div className="text-slate-700 mt-1">{term.simpleDefinition}</div>
                {term.realWorldAnalogy && (
                  <div className="text-slate-500 mt-1 italic">
                    Example: {term.realWorldAnalogy}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CARD 5: 3-Minute Action Steps */}
      {session.microTasks && session.microTasks.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Quick 3-Minute Steps
          </h2>
          <div className="space-y-2">
            {session.microTasks.map((t) => (
              <div
                key={t.id}
                onClick={() => handleTaskCheck(t.id)}
                className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-colors ${
                  completedTasks[t.id]
                    ? 'bg-emerald-50 border-emerald-200 line-through text-slate-400'
                    : 'bg-white border-slate-200 hover:border-blue-400 text-slate-800'
                }`}
              >
                {completedTasks[t.id] ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-300 shrink-0" />
                )}
                <div className="text-xs font-medium">
                  {t.title}: {t.actionItem}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CARD 6: Quick Flashcards */}
      {session.flashcards && session.flashcards.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Test Yourself (Click to Flip)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {session.flashcards.slice(0, 2).map((fc) => (
              <div
                key={fc.id}
                onClick={() => toggleCard(fc.id)}
                className="p-4 rounded-xl border border-blue-200 bg-blue-50/40 hover:bg-blue-50 cursor-pointer transition-all select-none min-h-[110px] flex flex-col justify-between"
              >
                <div className="text-xs font-bold text-blue-900">
                  {flippedCards[fc.id] ? '💡 Answer:' : '❓ Question:'}
                </div>
                <div className="text-xs font-medium text-slate-800 my-auto">
                  {flippedCards[fc.id] ? fc.answer : fc.question}
                </div>
                <div className="text-[10px] text-blue-600 flex items-center gap-1 mt-2">
                  <RotateCw className="w-3 h-3" />
                  <span>Click to flip</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
