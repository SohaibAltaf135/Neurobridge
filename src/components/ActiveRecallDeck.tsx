import React, { useState } from 'react';
import { Flashcard, QuizQuestion } from '../types';
import { 
  Sparkles, 
  RotateCw, 
  ChevronLeft, 
  ChevronRight, 
  Lightbulb, 
  CheckCircle2, 
  XCircle, 
  HelpCircle,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ActiveRecallDeckProps {
  flashcards: Flashcard[];
  quiz: QuizQuestion[];
}

export const ActiveRecallDeck: React.FC<ActiveRecallDeckProps> = ({ flashcards, quiz }) => {
  // Flashcard states
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [masteredCards, setMasteredCards] = useState<Record<string, boolean>>({});

  // Quiz states
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [submittedAnswers, setSubmittedAnswers] = useState<Record<string, boolean>>({});

  const card = flashcards[currentCardIndex];

  const handleNextCard = () => {
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev + 1) % flashcards.length);
  };

  const handlePrevCard = () => {
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
  };

  const toggleMastery = (id: string) => {
    setMasteredCards((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleOptionSelect = (qId: string, optionIdx: number) => {
    if (submittedAnswers[qId]) return; // locked once checked
    setSelectedAnswers((prev) => ({ ...prev, [qId]: optionIdx }));
  };

  const checkAnswer = (qId: string, correctIdx: number) => {
    const isCorrect = selectedAnswers[qId] === correctIdx;
    setSubmittedAnswers((prev) => ({ ...prev, [qId]: true }));
    if (isCorrect) {
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.8 }
      });
    }
  };

  return (
    <div className="space-y-10">
      
      {/* SECTION 1: Interactive 3D Flip Flashcards */}
      <div>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-600" />
              <span>Active Recall Flashcards ({flashcards.length})</span>
            </h3>
            <p className="text-xs text-slate-500">
              Flip the card to test memory before reading the answer. Includes mnemonic memory anchors!
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700">
            Card {currentCardIndex + 1} of {flashcards.length}
          </span>
        </div>

        {card ? (
          <div className="max-w-xl mx-auto">
            {/* The 3D Flip Container */}
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="relative min-h-[220px] rounded-2xl border-2 border-slate-200 dark:border-slate-800 hover:border-brand-400 p-6 flex flex-col justify-between cursor-pointer select-none bg-white dark:bg-slate-900 shadow-lg shadow-slate-200/50 dark:shadow-none transition-all duration-300 transform"
            >
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-bold uppercase tracking-wider text-brand-600">
                  {isFlipped ? '💡 Answer & Memory Anchor' : '❓ Question'}
                </span>
                <span className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-600">
                  <RotateCw className="w-3 h-3" />
                  Click to Flip
                </span>
              </div>

              <div className="my-auto py-4">
                {isFlipped ? (
                  <div className="space-y-3 animate-fadeIn">
                    <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
                      {card.answer}
                    </p>
                    {card.mnemonicHint && (
                      <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
                        <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        <div>
                          <strong>Mnemonic Anchor:</strong> {card.mnemonicHint}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 leading-snug text-center">
                    {card.question}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[11px]">
                  {isFlipped ? 'Ready to move to next concept?' : 'Take a moment to recall the answer in your head!'}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleMastery(card.id);
                  }}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors ${
                    masteredCards[card.id]
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  {masteredCards[card.id] ? '✓ Mastered' : '+ Mark Mastered'}
                </button>
              </div>
            </div>

            {/* Nav Arrows */}
            <div className="flex items-center justify-center gap-4 mt-4">
              <button
                onClick={handlePrevCard}
                className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 text-slate-700 dark:text-slate-300 transition-colors shadow-xs"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsFlipped(!isFlipped)}
                className="px-4 py-2 rounded-xl bg-brand-50 hover:bg-brand-100 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 font-bold text-xs border border-brand-200 dark:border-brand-800"
              >
                {isFlipped ? 'Show Question' : 'Flip Card'}
              </button>
              <button
                onClick={handleNextCard}
                className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 text-slate-700 dark:text-slate-300 transition-colors shadow-xs"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {/* SECTION 2: Low-Stress Mastery Quiz */}
      <div className="border-t border-slate-200 dark:border-slate-800 pt-8">
        <div className="mb-6">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-600" />
            <span>Low-Stress Check Quiz ({quiz.length} Questions)</span>
          </h3>
          <p className="text-xs text-slate-500">
            No grades, no stress—just instant feedback with clear explanations to lock the concepts into long-term memory.
          </p>
        </div>

        <div className="space-y-6 max-w-2xl mx-auto">
          {quiz.map((q, qIndex) => {
            const isSubmitted = submittedAnswers[q.id];
            const chosen = selectedAnswers[q.id];
            const isCorrect = chosen === q.correctIndex;

            return (
              <div
                key={q.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4"
              >
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {qIndex + 1}
                  </span>
                  <div className="font-bold text-sm text-slate-900 dark:text-white leading-relaxed">
                    {q.question}
                  </div>
                </div>

                {/* Options List */}
                <div className="grid grid-cols-1 gap-2 pl-9">
                  {q.options.map((opt, optIndex) => {
                    const isSelected = chosen === optIndex;
                    let style = 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-brand-400 text-slate-700 dark:text-slate-300';

                    if (isSubmitted) {
                      if (optIndex === q.correctIndex) {
                        style = 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold';
                      } else if (isSelected) {
                        style = 'bg-rose-50 dark:bg-rose-950/60 border-rose-500 text-rose-900 dark:text-rose-200';
                      } else {
                        style = 'opacity-40 border-slate-200 dark:border-slate-800';
                      }
                    } else if (isSelected) {
                      style = 'bg-brand-50 dark:bg-brand-950 border-brand-500 text-brand-900 dark:text-brand-200 font-bold';
                    }

                    return (
                      <button
                        key={optIndex}
                        type="button"
                        onClick={() => handleOptionSelect(q.id, optIndex)}
                        disabled={isSubmitted}
                        className={`text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between ${style}`}
                      >
                        <span>{opt}</span>
                        {isSubmitted && optIndex === q.correctIndex && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        )}
                        {isSubmitted && isSelected && optIndex !== q.correctIndex && (
                          <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Action button & explanation */}
                <div className="pl-9 pt-1 flex items-center justify-between flex-wrap gap-2">
                  {!isSubmitted ? (
                    <button
                      type="button"
                      disabled={chosen === undefined}
                      onClick={() => checkAnswer(q.id, q.correctIndex)}
                      className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs disabled:opacity-40 transition-all shadow-sm"
                    >
                      Check Answer
                    </button>
                  ) : (
                    <div className={`w-full p-3 rounded-xl text-xs ${isCorrect ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200' : 'bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200'}`}>
                      <div className="font-bold flex items-center gap-1.5 mb-1">
                        {isCorrect ? '🎉 That\'s Correct!' : '🤔 Not quite, here\'s why:'}
                      </div>
                      <p>{q.explanation}</p>
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
