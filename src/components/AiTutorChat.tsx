import React, { useState, useRef, useEffect } from 'react';
import { ProcessedStudySession } from '../types';
import { askTutor } from '../services/gemini';
import { 
  Bot, 
  User, 
  Send, 
  Sparkles, 
  HelpCircle, 
  Smile, 
  Lightbulb, 
  RefreshCw 
} from 'lucide-react';

interface AiTutorChatProps {
  session: ProcessedStudySession;
  apiKey: string | undefined;
}

interface Message {
  role: 'user' | 'model';
  text: string;
}

export const AiTutorChat: React.FC<AiTutorChatProps> = ({ session, apiKey }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      text: `Hi there! 👋 I'm your NeuroBridge tutor. I've reviewed your material on **${session.title}**. Whenever you get stuck or need something explained with a different analogy or simpler words, just ask me!`
    }
  ]);
  const [inputQuestion, setInputQuestion] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || inputQuestion.trim();
    if (!query || isTyping) return;

    const newMessages: Message[] = [...messages, { role: 'user', text: query }];
    setMessages(newMessages);
    setInputQuestion('');
    setIsTyping(true);

    try {
      const response = await askTutor(apiKey, session, query, newMessages);
      setMessages([...newMessages, { role: 'model', text: response }]);
    } catch (err: any) {
      setMessages([
        ...newMessages,
        {
          role: 'model',
          text: `Oops! I couldn't reach the server right now. (${err.message}). Remember: you can always check your Gemini API key in the top settings.`
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-[520px] overflow-hidden">
      
      {/* Tutor Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 text-white flex items-center justify-center shadow-xs">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>NeuroBridge AI Copilot</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>
            <div className="text-[11px] text-slate-500">
              Context: {session.title}
            </div>
          </div>
        </div>

        <button
          onClick={() => setMessages([{
            role: 'model',
            text: `Conversation refreshed! What else can I clarify about ${session.title}?`
          }])}
          className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1 p-1 rounded"
          title="Restart Chat"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 ${
              msg.role === 'user' ? 'flex-row-reverse' : ''
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                msg.role === 'user'
                  ? 'bg-brand-600 text-white'
                  : 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
              }`}
            >
              {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`max-w-[80%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-brand-600 text-white rounded-tr-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-xs shadow-xs'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.text}</div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-2xl rounded-tl-xs flex items-center gap-1.5 text-slate-400 text-xs">
              <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]" />
              <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]" />
              <span className="ml-1 text-[11px]">Thinking of a fun analogy...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-4 py-2 bg-slate-50/60 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto text-[11px]">
        <span className="text-slate-400 shrink-0 font-medium">Quick ask:</span>
        <button
          type="button"
          onClick={() => handleSend("Explain this using a video game analogy!")}
          className="shrink-0 px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-brand-400 text-slate-600 dark:text-slate-300 transition-colors"
        >
          🎮 Video game analogy
        </button>
        <button
          type="button"
          onClick={() => handleSend("What is the single most common mistake students make on exams for this?")}
          className="shrink-0 px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-brand-400 text-slate-600 dark:text-slate-300 transition-colors"
        >
          ⚠️ Common exam trap
        </button>
        <button
          type="button"
          onClick={() => handleSend("Can you explain this like I'm 8 years old?")}
          className="shrink-0 px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-brand-400 text-slate-600 dark:text-slate-300 transition-colors"
        >
          👶 ELI8 version
        </button>
      </div>

      {/* Input Form */}
      <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputQuestion}
            onChange={(e) => setInputQuestion(e.target.value)}
            placeholder="Ask your tutor anything (e.g. 'Can you explain step 2 again?')..."
            className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-brand-500 border border-transparent transition-all"
          />
          <button
            type="submit"
            disabled={!inputQuestion.trim() || isTyping}
            className="p-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white disabled:opacity-40 transition-colors shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
};
