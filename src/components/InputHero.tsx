import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  Camera, 
  FileText, 
  Sparkles, 
  Image as ImageIcon, 
  Trash2, 
  ArrowRight, 
  Layers,
  GraduationCap,
  Smile,
  Zap
} from 'lucide-react';

interface InputHeroProps {
  onProcess: (data: {
    text?: string;
    imageBase64?: string;
    imageMimeType?: string;
    learningStyle?: 'eli5' | 'highschool' | 'storytelling';
  }) => void;
  isLoading: boolean;
  onLoadSample: (sampleId: string) => void;
}

export const InputHero: React.FC<InputHeroProps> = ({
  onProcess,
  isLoading,
  onLoadSample
}) => {
  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState<{ base64: string; mimeType: string } | null>(null);
  const [learningStyle, setLearningStyle] = useState<'eli5' | 'highschool' | 'storytelling'>('highschool');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setSelectedImage({
        base64: result,
        mimeType: file.type
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() && !selectedImage) return;

    onProcess({
      text: inputText.trim() || undefined,
      imageBase64: selectedImage?.base64,
      imageMimeType: selectedImage?.mimeType,
      learningStyle
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      
      {/* Hero Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-100 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 text-xs font-semibold mb-4 border border-brand-200 dark:border-brand-800">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Transform Intimidating Textbooks into Intuitive Knowledge</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Read Less. <span className="bg-gradient-to-r from-brand-600 to-indigo-600 bg-clip-text text-transparent">Understand More.</span>
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400">
          Snap a photo of your textbook or paste messy notes. NeuroBridge turns walls of text into 
          <strong className="text-slate-900 dark:text-slate-200"> Bionic Reading, interactive Mind Maps, audio, and ADHD bite-sized missions.</strong>
        </p>
      </div>

      {/* Input Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-800 p-6 sm:p-8 transition-all">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* File/Photo Dropzone */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-brand-600" />
                <span>Snap or Upload Textbook / Slide Photo</span>
              </label>
              {selectedImage && (
                <button
                  type="button"
                  onClick={() => setSelectedImage(null)}
                  className="text-xs text-rose-600 hover:text-rose-700 font-medium flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Remove Image
                </button>
              )}
            </div>

            {selectedImage ? (
              <div className="relative rounded-xl border border-brand-300 bg-brand-50/50 dark:bg-brand-950/20 p-3 flex items-center gap-4">
                <img
                  src={selectedImage.base64}
                  alt="Uploaded textbook preview"
                  className="w-20 h-20 object-cover rounded-lg border border-slate-300 shadow-sm"
                />
                <div className="flex-1 text-xs">
                  <div className="font-bold text-slate-800 dark:text-slate-200">Image attached ready for Vision AI analysis</div>
                  <div className="text-slate-500 mt-1">NeuroBridge will transcribe handwriting, diagrams, and textbook layouts automatically.</div>
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="group border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-brand-500 dark:hover:border-brand-500 rounded-xl p-6 text-center cursor-pointer transition-all bg-slate-50/50 dark:bg-slate-800/40 hover:bg-brand-50/30"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                <div className="w-12 h-12 rounded-full bg-brand-100 dark:bg-brand-950/60 text-brand-600 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Click to snap a picture or upload textbook page / lecture slide
                </div>
                <div className="text-xs text-slate-500 mt-1">PNG, JPG, or WEBP (supports phone camera photos)</div>
              </div>
            )}
          </div>

          {/* Textarea for Raw Notes */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <FileText className="w-4 h-4 text-brand-600" />
              <span>Or Paste Dense Textbook Text / Notes</span>
            </label>
            <textarea
              rows={4}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste a confusing paragraph, homework question, or syllabus here..."
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Learning Tone Selector */}
          <div>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-2">
              Choose Explanation Style:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setLearningStyle('highschool')}
                className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-medium text-left transition-all ${
                  learningStyle === 'highschool'
                    ? 'bg-brand-50 dark:bg-brand-950/50 border-brand-500 text-brand-900 dark:text-brand-200 font-bold shadow-xs'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <GraduationCap className="w-4 h-4 text-brand-600 shrink-0" />
                <div>
                  <div className="font-bold">High School / AP</div>
                  <div className="text-[10px] text-slate-500">Rigorous but de-jargoned</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setLearningStyle('eli5')}
                className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-medium text-left transition-all ${
                  learningStyle === 'eli5'
                    ? 'bg-brand-50 dark:bg-brand-950/50 border-brand-500 text-brand-900 dark:text-brand-200 font-bold shadow-xs'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <Smile className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <div className="font-bold">Explain Like I'm 5</div>
                  <div className="text-[10px] text-slate-500">Zero jargon, ultra simple</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setLearningStyle('storytelling')}
                className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-medium text-left transition-all ${
                  learningStyle === 'storytelling'
                    ? 'bg-brand-50 dark:bg-brand-950/50 border-brand-500 text-brand-900 dark:text-brand-200 font-bold shadow-xs'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                <div>
                  <div className="font-bold">Analogy & Metaphor</div>
                  <div className="text-[10px] text-slate-500">Everyday mental anchors</div>
                </div>
              </button>
            </div>
          </div>

          {/* Submit Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading || (!inputText.trim() && !selectedImage)}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white font-bold text-sm shadow-lg shadow-brand-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>NeuroBridge AI is synthesizing knowledge...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Transform into Adaptive Study Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

        </form>

        {/* 1-Click Instant Demo Scenarios */}
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Or Try a Pre-Loaded High School Scenario:
            </span>
            <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
              ⚡ Instant 1-Click Test (No typing needed)
            </span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => onLoadSample('sample-biology-cell-respiration')}
              className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 hover:bg-white dark:bg-slate-800/60 dark:hover:bg-slate-800 text-left transition-all hover:border-brand-400 group"
            >
              <div className="font-bold text-xs text-slate-900 dark:text-slate-100 group-hover:text-brand-600 flex items-center justify-between">
                <span>🧬 Biology: Cellular Respiration & ATP</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                Glycolysis, Krebs cycle, and the microscopic ATP turbine dam.
              </div>
            </button>

            <button
              type="button"
              onClick={() => onLoadSample('sample-physics-newtons-laws')}
              className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 hover:bg-white dark:bg-slate-800/60 dark:hover:bg-slate-800 text-left transition-all hover:border-brand-400 group"
            >
              <div className="font-bold text-xs text-slate-900 dark:text-slate-100 group-hover:text-brand-600 flex items-center justify-between">
                <span>🍎 Physics: Newton's 3 Laws of Motion</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                Inertia, F = ma, and equal action-reaction pairs.
              </div>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
