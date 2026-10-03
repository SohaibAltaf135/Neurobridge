import React, { useState, useRef } from 'react';
import { Camera, FileText, Sparkles, ArrowRight, Upload, X } from 'lucide-react';

interface CleanInputProps {
  onProcess: (data: { text?: string; imageBase64?: string; imageMimeType?: string }) => void;
  isLoading: boolean;
  onLoadSample: (sampleId: string) => void;
}

export const CleanInput: React.FC<CleanInputProps> = ({
  onProcess,
  isLoading,
  onLoadSample
}) => {
  const [text, setText] = useState('');
  const [image, setImage] = useState<{ base64: string; mimeType: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImage({ base64: reader.result as string, mimeType: file.type });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() && !image) return;
    onProcess({
      text: text.trim() || undefined,
      imageBase64: image?.base64,
      imageMimeType: image?.mimeType
    });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 sm:py-16">
      
      {/* Title */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Simple Study Assistant</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Understand Any Complex Topic in Seconds
        </h1>
        <p className="mt-2 text-slate-500 text-sm">
          Paste your notes or upload a photo of your textbook. We'll turn it into plain English, real-world analogies, and a quick visual guide.
        </p>
      </div>

      {/* Main Clean Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Text input area */}
          <div>
            <textarea
              rows={4}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste confusing notes, textbook paragraphs, or questions here..."
              className="w-full rounded-xl border border-slate-200 p-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
            />
          </div>

          {/* Image preview or upload button */}
          {image ? (
            <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50 border border-blue-200">
              <div className="flex items-center gap-3">
                <img
                  src={image.base64}
                  alt="Uploaded preview"
                  className="w-12 h-12 rounded-lg object-cover border border-blue-200"
                />
                <div>
                  <div className="text-xs font-bold text-slate-800">Photo attached</div>
                  <div className="text-[11px] text-slate-500">Ready for AI analysis</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setImage(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors"
              >
                <Camera className="w-4 h-4" />
                <span>Upload textbook photo</span>
              </button>
              <input
                type="file"
                ref={fileRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
            </div>
          )}

          {/* Action button */}
          <button
            type="submit"
            disabled={isLoading || (!text.trim() && !image)}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-xs disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Simplifying...</span>
              </>
            ) : (
              <>
                <span>Explain in Plain English</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* 1-Click quick try */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-center gap-2 flex-wrap text-xs text-slate-500">
          <span>Or try a sample:</span>
          <button
            type="button"
            onClick={() => onLoadSample('sample-biology-cell-respiration')}
            className="px-3 py-1 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-blue-700 font-medium transition-colors"
          >
            🧬 Biology (Cell Energy)
          </button>
          <button
            type="button"
            onClick={() => onLoadSample('sample-physics-newtons-laws')}
            className="px-3 py-1 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-blue-700 font-medium transition-colors"
          >
            🍎 Physics (Forces)
          </button>
        </div>

      </div>

    </div>
  );
};
