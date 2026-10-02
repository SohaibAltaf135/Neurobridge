import React, { useState } from 'react';
import { ProcessedStudySession, AccessibilitySettings } from '../types';
import { AdaptiveReader } from './AdaptiveReader';
import { MindMapVisualizer } from './MindMapVisualizer';
import { AdhdActionPlan } from './AdhdActionPlan';
import { ActiveRecallDeck } from './ActiveRecallDeck';
import { AiTutorChat } from './AiTutorChat';
import { 
  BookOpen, 
  Network, 
  CheckSquare, 
  Sparkles, 
  MessageSquare, 
  ArrowLeft, 
  Download, 
  Share2,
  Clock,
  Layers
} from 'lucide-react';

interface StudyDashboardProps {
  session: ProcessedStudySession;
  settings: AccessibilitySettings;
  apiKey: string | undefined;
  onReset: () => void;
  onToggleTask: (taskId: string) => void;
}

export const StudyDashboard: React.FC<StudyDashboardProps> = ({
  session,
  settings,
  apiKey,
  onReset,
  onToggleTask
}) => {
  const [activeTab, setActiveTab] = useState<'reader' | 'mindmap' | 'adhd' | 'recall' | 'tutor'>('reader');

  const handleExportMarkdown = () => {
    const mdContent = `# ${session.title} (NeuroBridge Adaptive Study Summary)

## Plain English Explanation
${session.plainEnglishSummary}

## Real-World Analogy
${session.realWorldAnalogy}

## Jargon Demystifier
${session.jargonTerms.map((j) => `- **${j.term}**: ${j.simpleDefinition} *(Analogy: ${j.realWorldAnalogy})*`).join('\n')}

## ADHD Action Plan & Micro-Missions
${session.microTasks.map((t) => `- [${t.completed ? 'x' : ' '}] **${t.title}** (~${t.estimatedMinutes}m): ${t.actionItem}`).join('\n')}

## Active Recall Flashcards
${session.flashcards.map((f, i) => `### Card ${i + 1}: ${f.question}\n**Answer**: ${f.answer}\n*Mnemonic Tip*: ${f.mnemonicHint}\n`).join('\n')}

---
*Created with NeuroBridge — Adaptive AI for Neurodivergent Learning (ImpactHack 2026)*
`;

    const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${session.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-study-guide.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      
      {/* Top Header Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 shadow-sm flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onReset}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 transition-colors"
            title="Upload new material"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 dark:bg-brand-950 px-2 py-0.5 rounded">
                Active Study Session
              </span>
              <span className="text-xs text-slate-400">
                • {new Date(session.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
              {session.title}
            </h1>
          </div>
        </div>

        {/* Quick Action Tools */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportMarkdown}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-all shadow-xs"
            title="Download study summary as Markdown"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Notes</span>
          </button>

          <button
            onClick={onReset}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-all shadow-xs"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>New Material</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800">
        
        <button
          onClick={() => setActiveTab('reader')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
            activeTab === 'reader'
              ? 'bg-brand-600 text-white shadow-md shadow-brand-500/25'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>📖 Adaptive Reader</span>
        </button>

        <button
          onClick={() => setActiveTab('mindmap')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
            activeTab === 'mindmap'
              ? 'bg-brand-600 text-white shadow-md shadow-brand-500/25'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <Network className="w-4 h-4" />
          <span>🗺️ Concept Mind Map</span>
        </button>

        <button
          onClick={() => setActiveTab('adhd')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
            activeTab === 'adhd'
              ? 'bg-brand-600 text-white shadow-md shadow-brand-500/25'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <CheckSquare className="w-4 h-4" />
          <span>⏱️ ADHD Action Plan</span>
        </button>

        <button
          onClick={() => setActiveTab('recall')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
            activeTab === 'recall'
              ? 'bg-brand-600 text-white shadow-md shadow-brand-500/25'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>🃏 Active Recall & Quiz</span>
        </button>

        <button
          onClick={() => setActiveTab('tutor')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
            activeTab === 'tutor'
              ? 'bg-brand-600 text-white shadow-md shadow-brand-500/25'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>🤖 AI Tutor Copilot</span>
        </button>

      </div>

      {/* Main Tab Content */}
      <div className="transition-all animate-fadeIn">
        {activeTab === 'reader' && (
          <AdaptiveReader session={session} settings={settings} />
        )}

        {activeTab === 'mindmap' && (
          <MindMapVisualizer data={session.mindMap} topicTitle={session.title} />
        )}

        {activeTab === 'adhd' && (
          <AdhdActionPlan tasks={session.microTasks} onToggleTask={onToggleTask} />
        )}

        {activeTab === 'recall' && (
          <ActiveRecallDeck flashcards={session.flashcards} quiz={session.quiz} />
        )}

        {activeTab === 'tutor' && (
          <AiTutorChat session={session} apiKey={apiKey} />
        )}
      </div>

    </div>
  );
};
