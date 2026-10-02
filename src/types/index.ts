export interface MindMapNode {
  id: string;
  label: string;
  description: string;
  category: 'core' | 'concept' | 'detail' | 'example';
  parentId?: string;
  color?: string;
}

export interface MindMapEdge {
  from: string;
  to: string;
  relation: string;
}

export interface MindMapData {
  nodes: MindMapNode[];
  edges: MindMapEdge[];
}

export interface MicroTask {
  id: string;
  title: string;
  estimatedMinutes: number;
  explanation: string;
  actionItem: string;
  completed: boolean;
}

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  mnemonicHint: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface JargonTerm {
  term: string;
  simpleDefinition: string;
  realWorldAnalogy: string;
}

export interface ProcessedStudySession {
  id: string;
  title: string;
  createdAt: string;
  originalText?: string;
  imagePreview?: string;
  plainEnglishSummary: string;
  realWorldAnalogy: string;
  bionicFormattedText: string;
  jargonTerms: JargonTerm[];
  mindMap: MindMapData;
  microTasks: MicroTask[];
  flashcards: Flashcard[];
  quiz: QuizQuestion[];
  readingTimeMinutes: number;
}

export type AccessibilityFont = 'default' | 'opendyslexic' | 'lexend';
export type BackgroundTint = 'default' | 'cream' | 'softYellow' | 'softGreen' | 'softBlue' | 'dark';
export type FontSize = 'normal' | 'large' | 'xlarge';
export type LetterSpacing = 'normal' | 'wide' | 'wider';

export interface AccessibilitySettings {
  font: AccessibilityFont;
  tint: BackgroundTint;
  fontSize: FontSize;
  letterSpacing: LetterSpacing;
  bionicReading: boolean;
  readingRuler: boolean;
  highlightKeyTerms: boolean;
  speechRate: number;
}
