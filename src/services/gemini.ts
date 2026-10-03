import { ProcessedStudySession, MindMapData, MindMapNode, MindMapEdge, MicroTask, Flashcard, QuizQuestion, JargonTerm } from '../types';
import { formatToBionicHtml, calculateReadingTime } from '../utils/bionic';
import { SAMPLE_SESSIONS } from '../data/sampleSessions';

const GEMINI_MODEL = 'gemini-2.5-flash';

/**
 * Intelligent Dynamic Text Synthesizer
 * Generates custom structured study guides from ANY user text even if no API key is provided
 */
function synthesizeFromText(rawText: string): ProcessedStudySession {
  const lines = rawText.split('\n').map((l) => l.trim()).filter(Boolean);
  const fullText = lines.join(' ');
  const sentences = fullText.match(/[^.!?]+[.!?]+/g) || [fullText];
  const words = fullText.split(/\s+/);

  // 1. Detect or extract Title
  let title = 'Study Guide';
  if (lines.length > 0 && lines[0].length < 60 && !lines[0].endsWith('.')) {
    title = lines[0].replace(/^[#*-]\s*/, '');
  } else {
    // Try to find subject keywords
    const lower = fullText.toLowerCase();
    if (lower.includes('nlp') || lower.includes('natural language processing')) {
      title = 'Natural Language Processing (NLP)';
    } else if (lower.includes('machine learning') || lower.includes('neural')) {
      title = 'Machine Learning & Neural Networks';
    } else if (lower.includes('photosynthesis')) {
      title = 'Photosynthesis & Plant Energy';
    } else if (lower.includes('calculus') || lower.includes('derivative')) {
      title = 'Calculus & Rate of Change';
    } else if (lower.includes('dna') || lower.includes('genetics')) {
      title = 'Genetics & DNA Structure';
    } else {
      // Pick first 3-5 words
      title = words.slice(0, 5).join(' ').replace(/[,;:]/g, '');
      if (title.length > 0) {
        title = title.charAt(0).toUpperCase() + title.slice(1);
      } else {
        title = 'Custom Study Notes';
      }
    }
  }

  // 2. Plain English Summary (Distill the core message)
  const summarySentences = sentences.slice(0, 3).map((s) => s.trim()).join(' ');
  const plainEnglishSummary = summarySentences.length > 20
    ? summarySentences
    : fullText.slice(0, 280) + '...';

  // 3. Dynamic Real-World Analogy
  const lower = fullText.toLowerCase();
  let realWorldAnalogy = 'Think of this system like a postal delivery network: information is packaged, addressed, sorted through hubs, and delivered to the exact recipient without getting lost!';
  if (lower.includes('nlp') || lower.includes('language') || lower.includes('token') || lower.includes('text')) {
    realWorldAnalogy = 'Think of NLP like teaching a calculator to read Shakespeare: computers only understand numbers (0s and 1s), so NLP breaks sentences into Lego blocks (tokens), turns words into GPS coordinates of meaning (embeddings), and predicts the next block!';
  } else if (lower.includes('model') || lower.includes('training') || lower.includes('neural') || lower.includes('learning')) {
    realWorldAnalogy = 'Think of training an AI model like learning to ride a bike: at first it wobbles and falls, but with thousands of practice attempts and instant feedback adjustments, its balance becomes second nature.';
  } else if (lower.includes('gravity') || lower.includes('force') || lower.includes('motion') || lower.includes('physics')) {
    realWorldAnalogy = 'Like pushing an empty shopping cart versus one packed with heavy bricks—the more mass something has, the more effort it takes to change its speed!';
  }

  // 4. Extract Key Jargon Terms
  const potentialTerms: string[] = [];
  const termMatches = fullText.match(/\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*|[A-Z]{2,})\b/g) || [];
  termMatches.forEach((t) => {
    if (t.length > 2 && !['The', 'This', 'That', 'And', 'For', 'With', 'From'].includes(t)) {
      if (!potentialTerms.includes(t)) potentialTerms.push(t);
    }
  });

  const jargonTerms: JargonTerm[] = [];
  if (lower.includes('nlp') || lower.includes('token')) {
    jargonTerms.push(
      {
        term: 'Tokenization',
        simpleDefinition: 'Chopping up a sentence into bite-sized words or sub-words so a computer can process them one by one.',
        realWorldAnalogy: 'Cutting a long sandwich into bite-sized slices.'
      },
      {
        term: 'Embeddings',
        simpleDefinition: 'Converting words into lists of numbers (vectors) where words with similar meanings sit close together in space.',
        realWorldAnalogy: 'A map where "king" and "queen" share the same neighborhood.'
      },
      {
        term: 'Transformer Model',
        simpleDefinition: 'A neural network architecture that looks at all words in a sentence at once using "attention" rather than reading one by one.',
        realWorldAnalogy: 'A spotlight that highlights which words relate to each other.'
      }
    );
  } else {
    // Dynamic fallback terms from user text
    const termsToUse = potentialTerms.slice(0, 3);
    if (termsToUse.length > 0) {
      termsToUse.forEach((term) => {
        jargonTerms.push({
          term,
          simpleDefinition: `A fundamental component in ${title} that defines how elements interact.`,
          realWorldAnalogy: `Like a specialized tool in a toolbox that performs one critical function.`
        });
      });
    } else {
      jargonTerms.push({
        term: title,
        simpleDefinition: 'The main subject analyzed in this study session.',
        realWorldAnalogy: 'The foundation stone of this concept.'
      });
    }
  }

  // 5. Concept Mind Map Nodes
  const nodes: MindMapNode[] = [
    { id: '1', label: title, description: 'The main subject of this study session', category: 'core' }
  ];
  const edges: MindMapEdge[] = [];

  jargonTerms.forEach((jt, idx) => {
    const id = String(idx + 2);
    nodes.push({
      id,
      label: jt.term,
      description: jt.simpleDefinition,
      category: 'concept',
      parentId: '1'
    });
    edges.push({
      from: '1',
      to: id,
      relation: 'includes'
    });
  });

  // 6. Micro-Tasks (ADHD Sprints)
  const microTasks: MicroTask[] = [
    {
      id: 'mt1',
      title: 'Mission 1: The Core Idea',
      estimatedMinutes: 3,
      explanation: `Read the plain English summary and make sure the big picture makes sense.`,
      actionItem: `Explain the real-world analogy out loud in your own words.`,
      completed: false
    },
    {
      id: 'mt2',
      title: 'Mission 2: Decode the Jargon',
      estimatedMinutes: 4,
      explanation: `Review the ${jargonTerms.length} translated terms above so the vocabulary feels natural.`,
      actionItem: `Read the definition of "${jargonTerms[0]?.term || title}".`,
      completed: false
    },
    {
      id: 'mt3',
      title: 'Mission 3: Memory Self-Test',
      estimatedMinutes: 3,
      explanation: `Flip through the active recall flashcards to lock the knowledge into long-term memory.`,
      actionItem: `Answer the flashcards without peeking first!`,
      completed: false
    }
  ];

  // 7. Active Recall Flashcards
  const flashcards: Flashcard[] = [
    {
      id: 'fc1',
      question: `What is the core purpose of ${title}?`,
      answer: plainEnglishSummary.slice(0, 160) + '...',
      mnemonicHint: `Remember the analogy: "${realWorldAnalogy.slice(0, 60)}..."`
    },
    {
      id: 'fc2',
      question: `What does "${jargonTerms[0]?.term || 'the primary mechanism'}" do?`,
      answer: jargonTerms[0]?.simpleDefinition || 'It acts as the core driver for processing information.',
      mnemonicHint: 'Link it to its real-world analogy!'
    }
  ];

  return {
    id: 'session-' + Date.now(),
    title,
    createdAt: new Date().toISOString(),
    originalText: rawText,
    plainEnglishSummary,
    realWorldAnalogy,
    bionicFormattedText: plainEnglishSummary,
    jargonTerms,
    mindMap: { nodes, edges },
    microTasks,
    flashcards,
    quiz: [],
    readingTimeMinutes: calculateReadingTime(plainEnglishSummary)
  };
}

export async function processStudyMaterial(
  apiKey: string | undefined,
  input: {
    text?: string;
    imageBase64?: string;
    imageMimeType?: string;
    learningStyle?: 'eli5' | 'highschool' | 'storytelling';
  }
): Promise<ProcessedStudySession> {
  const rawText = input.text?.trim() || '';

  // If user provided a Gemini API Key, call the live Google Gemini API
  if (apiKey && apiKey.trim() !== '') {
    try {
      const prompt = `You are NeuroBridge, a world-class cognitive assistive AI designed to help neurodivergent students (ADHD, Dyslexia, Executive Dysfunction) understand complex academic material.
Analyze the provided material (text or image of textbook/notes) and produce an adaptive, multi-sensory study breakdown.

Target Learning Style: ${input.learningStyle || 'highschool'}

You MUST respond strictly with valid JSON with this exact schema (no markdown wrappers, no code blocks):
{
  "title": "Short punchy title for this concept",
  "plainEnglishSummary": "A clear, engaging 3-4 sentence explanation free of intimidating jargon. Make it click immediately.",
  "realWorldAnalogy": "A brilliant, memorable real-world analogy.",
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
      { "id": "3", "label": "Key Concept 2", "description": "What it is", "category": "concept", "parentId": "1" }
    ],
    "edges": [
      { "from": "1", "to": "2", "relation": "branches into" },
      { "from": "1", "to": "3", "relation": "leads to" }
    ]
  },
  "microTasks": [
    {
      "id": "t1",
      "title": "Mission 1: The Core Idea",
      "estimatedMinutes": 3,
      "explanation": "Why this matters",
      "actionItem": "A tiny actionable step"
    }
  ],
  "flashcards": [
    {
      "id": "fc1",
      "question": "Engaging active recall question",
      "answer": "Clear concise answer",
      "mnemonicHint": "Fun memory trick"
    }
  ],
  "quiz": []
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

      if (rawText) {
        parts.push({ text: `Source Material Content:\n${rawText}` });
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

      if (response.ok) {
        const data = await response.json();
        const responseText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (responseText) {
          const parsed = JSON.parse(responseText);
          return {
            id: 'session-' + Date.now(),
            title: parsed.title || 'Adaptive Study Session',
            createdAt: new Date().toISOString(),
            originalText: rawText,
            imagePreview: input.imageBase64,
            plainEnglishSummary: parsed.plainEnglishSummary,
            realWorldAnalogy: parsed.realWorldAnalogy,
            bionicFormattedText: parsed.plainEnglishSummary,
            jargonTerms: parsed.jargonTerms || [],
            mindMap: parsed.mindMap || { nodes: [], edges: [] },
            microTasks: (parsed.microTasks || []).map((t: any) => ({ ...t, completed: false })),
            flashcards: parsed.flashcards || [],
            quiz: parsed.quiz || [],
            readingTimeMinutes: calculateReadingTime(parsed.plainEnglishSummary || '')
          };
        }
      }
    } catch (e) {
      console.warn('Gemini live API call failed, falling back to local synthesizer:', e);
    }
  }

  // Fallback: If no API key or API call failed, dynamically synthesize whatever text the user entered!
  await new Promise((r) => setTimeout(r, 600));

  if (rawText.length > 0) {
    return synthesizeFromText(rawText);
  }

  // If user uploaded an image but has no API key / text
  if (input.imageBase64) {
    return {
      id: 'session-' + Date.now(),
      title: 'Image Uploaded — API Key Needed',
      createdAt: new Date().toISOString(),
      originalText: '',
      imagePreview: input.imageBase64,
      plainEnglishSummary:
        'You uploaded a photo, but analyzing images requires a Google Gemini API key. ' +
        'To get one for free: visit https://aistudio.google.com, sign in, and create an API key. ' +
        'Then paste it in the settings panel. Alternatively, you can type or paste the text from your textbook into the text box and we\'ll break it down for you instantly — no API key needed!',
      realWorldAnalogy:
        'It\'s like sending a sealed envelope to a translator — they can only read it if they have the key to open it. ' +
        'Typing the text directly is like reading the letter aloud so anyone can understand it!',
      bionicFormattedText: '',
      jargonTerms: [
        {
          term: 'API Key',
          simpleDefinition: 'A password-like code that lets your app talk to Google\'s AI brain (Gemini) so it can read images and generate smart answers.',
          realWorldAnalogy: 'Like a library card that lets you borrow books — without it, the library won\'t let you in.'
        }
      ],
      mindMap: { nodes: [], edges: [] },
      microTasks: [
        {
          id: 'mt1',
          title: 'Step 1: Get a Free API Key',
          estimatedMinutes: 2,
          explanation: 'Visit https://aistudio.google.com and create a free Gemini API key.',
          actionItem: 'Copy the key and paste it into the NeuroBridge settings.',
          completed: false
        },
        {
          id: 'mt2',
          title: 'Step 2: Or Type Your Notes',
          estimatedMinutes: 1,
          explanation: 'You can always type or paste text directly — no API key required!',
          actionItem: 'Go back and paste the text from your textbook into the text box.',
          completed: false
        }
      ],
      flashcards: [],
      quiz: [],
      readingTimeMinutes: 1
    };
  }

  // If no text was entered and only clicking sample
  return { ...SAMPLE_SESSIONS[0], id: 'session-' + Date.now() };
}

export async function askTutor(
  apiKey: string | undefined,
  sessionContext: ProcessedStudySession,
  question: string,
  chatHistory: { role: 'user' | 'model'; text: string }[]
): Promise<string> {
  if (!apiKey || apiKey.trim() === '') {
    await new Promise((r) => setTimeout(r, 600));
    return `Looking at **${sessionContext.title}**: Remember that ${sessionContext.realWorldAnalogy.slice(0, 100)}... That is the simplest way to visualize how each part connects!`;
  }

  try {
    const systemInstruction = `You are the NeuroBridge AI Tutor helping a student understand ${sessionContext.title}. Answer concisely with friendly analogies.`;
    const contents = [
      { role: 'user', parts: [{ text: systemInstruction }] },
      ...chatHistory.map((m) => ({ role: m.role, parts: [{ text: m.text }] })),
      { role: 'user', parts: [{ text: question }] }
    ];

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents })
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data?.candidates?.[0]?.content?.parts?.[0]?.text || "Let's review the main concept again!";
    }
  } catch (e) {
    // fallback
  }

  return `Great question! In **${sessionContext.title}**, the key idea is to take complex steps and simplify them into everyday analogies.`;
}
