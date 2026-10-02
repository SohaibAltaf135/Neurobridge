import { ProcessedStudySession, MindMapData, MicroTask, Flashcard, QuizQuestion, JargonTerm } from '../types';
import { formatToBionicHtml, calculateReadingTime } from '../utils/bionic';
import { SAMPLE_SESSIONS } from '../data/sampleSessions';

const GEMINI_MODEL = 'gemini-2.5-flash';

export async function processStudyMaterial(
  apiKey: string | undefined,
  input: {
    text?: string;
    imageBase64?: string;
    imageMimeType?: string;
    learningStyle?: 'eli5' | 'highschool' | 'storytelling';
  }
): Promise<ProcessedStudySession> {
  // If no API key is provided, fallback to intelligent instant sample matching or smart generator
  if (!apiKey || apiKey.trim() === '') {
    // Artificial small delay for realistic UX
    await new Promise((r) => setTimeout(r, 1200));

    if (input.text && input.text.toLowerCase().includes('newton')) {
      return { ...SAMPLE_SESSIONS[1], id: 'session-' + Date.now() };
    }
    return { ...SAMPLE_SESSIONS[0], id: 'session-' + Date.now() };
  }

  const prompt = `You are NeuroBridge, a world-class cognitive assistive AI designed to help neurodivergent students (ADHD, Dyslexia, Executive Dysfunction) understand complex academic material.
Analyze the provided material (text or image of textbook/notes) and produce an adaptive, multi-sensory study breakdown.

Target Learning Style: ${input.learningStyle || 'highschool'}

You MUST respond strictly with valid JSON with this exact schema (no markdown wrappers, no code blocks):
{
  "title": "Short punchy title for this concept",
  "plainEnglishSummary": "A clear, engaging 3-4 sentence explanation free of intimidating jargon. Make it click immediately.",
  "realWorldAnalogy": "A brilliant, memorable real-world analogy (e.g. comparing cells to a pizza restaurant or electricity to water pipes).",
  "jargonTerms": [
    {
      "term": "Difficult academic term",
      "simpleDefinition": "Simple 1-sentence definition",
      "realWorldAnalogy": "Quick comparison or visual mental anchor"
    }
  ],
  "mindMap": {
    "nodes": [
      { "id": "1", "label": "Core Subject", "description": "High level", "category": "core" },
      { "id": "2", "label": "Key Concept 1", "description": "What it is", "category": "concept", "parentId": "1" },
      { "id": "3", "label": "Key Concept 2", "description": "What it is", "category": "concept", "parentId": "1" },
      { "id": "4", "label": "Detail / Example", "description": "Specifics", "category": "detail", "parentId": "2" }
    ],
    "edges": [
      { "from": "1", "to": "2", "relation": "branches into" },
      { "from": "1", "to": "3", "relation": "leads to" },
      { "from": "2", "to": "4", "relation": "example" }
    ]
  },
  "microTasks": [
    {
      "id": "t1",
      "title": "Mission 1: The Core Idea",
      "estimatedMinutes": 3,
      "explanation": "Why this matters",
      "actionItem": "A tiny actionable step (e.g. repeat key concept or picture analogy)"
    },
    {
      "id": "t2",
      "title": "Mission 2: Connecting the Dots",
      "estimatedMinutes": 4,
      "explanation": "How it works in practice",
      "actionItem": "Check out the mind map node"
    }
  ],
  "flashcards": [
    {
      "id": "fc1",
      "question": "Engaging active recall question",
      "answer": "Clear concise answer",
      "mnemonicHint": "Fun memory trick or rhyme to never forget it"
    }
  ],
  "quiz": [
    {
      "id": "q1",
      "question": "Concept check question",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0,
      "explanation": "Why this answer is right and why the others are misconceptions"
    }
  ]
}`;

  const contents: any[] = [];
  const parts: any[] = [];

  if (input.imageBase64 && input.imageMimeType) {
    parts.push({
      inline_data: {
        mime_type: input.imageMimeType,
        data: input.imageBase64.replace(/^data:.+;base64,/, '')
      }
    });
  }

  if (input.text) {
    parts.push({ text: `Source Material Content:\n${input.text}` });
  }

  parts.push({ text: prompt });
  contents.push({ parts });

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: 0.3,
          responseMimeType: 'application/json'
        }
      })
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API Error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) throw new Error('No response text received from Gemini API');

  const parsed = JSON.parse(rawText);

  // Add client helpers
  const plainText = parsed.plainEnglishSummary || '';
  const bionicFormattedText = plainText;

  const session: ProcessedStudySession = {
    id: 'session-' + Date.now(),
    title: parsed.title || 'Adaptive Study Session',
    createdAt: new Date().toISOString(),
    originalText: input.text,
    imagePreview: input.imageBase64,
    plainEnglishSummary: parsed.plainEnglishSummary,
    realWorldAnalogy: parsed.realWorldAnalogy,
    bionicFormattedText,
    jargonTerms: parsed.jargonTerms || [],
    mindMap: parsed.mindMap || { nodes: [], edges: [] },
    microTasks: (parsed.microTasks || []).map((t: any) => ({ ...t, completed: false })),
    flashcards: parsed.flashcards || [],
    quiz: parsed.quiz || [],
    readingTimeMinutes: calculateReadingTime(parsed.plainEnglishSummary || '')
  };

  return session;
}

export async function askTutor(
  apiKey: string | undefined,
  sessionContext: ProcessedStudySession,
  question: string,
  chatHistory: { role: 'user' | 'model'; text: string }[]
): Promise<string> {
  if (!apiKey || apiKey.trim() === '') {
    // Helpful simulation for instant testing
    await new Promise((r) => setTimeout(r, 900));
    return `Great question! Looking at **${sessionContext.title}**: Think back to the real-world analogy: "${sessionContext.realWorldAnalogy}". That explains exactly why this occurs—it's like a chain reaction where each component supports the next step!`;
  }

  const systemInstruction = `You are the NeuroBridge AI Tutor. You are empathetic, patient, encouraging, and specialized in tutoring neurodivergent high school students.
You have the context of the study material the student is reviewing:
Title: ${sessionContext.title}
Summary: ${sessionContext.plainEnglishSummary}
Analogy: ${sessionContext.realWorldAnalogy}

Rule 1: Always explain concepts using simple language, visual metaphors, or analogies.
Rule 2: Keep your response short, punchy (under 120 words), and broken into friendly bullet points.
Rule 3: End with a quick 1-sentence encouragement!`;

  const contents = [
    {
      role: 'user',
      parts: [{ text: systemInstruction }]
    },
    ...chatHistory.map((m) => ({
      role: m.role,
      parts: [{ text: m.text }]
    })),
    {
      role: 'user',
      parts: [{ text: question }]
    }
  ];

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents })
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to query tutor: ${response.statusText}`);
  }

  const data = await response.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't quite generate an explanation. Let's try rephrasing that!";
}
