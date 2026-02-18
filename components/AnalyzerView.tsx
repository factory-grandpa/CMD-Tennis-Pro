
import React, { useState } from 'react';
import { Camera, Upload, RefreshCw, CheckCircle2, ChevronRight } from 'lucide-react';
import { analyzeStroke } from '../services/geminiService';
import { AnalysisResult } from '../types';

const AnalyzerView: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setLoading(true);
    try {
      const data = await analyzeStroke(image);
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6 custom-scrollbar font-mono text-zinc-300">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="border-b border-lime-900/30 pb-4">
          <h2 className="text-xl font-bold text-lime-500 flex items-center gap-2">
            <Camera size={24} /> STROKE_ANALYZER_MODULE
          </h2>
          <p className="text-xs text-zinc-500 mt-1">UPLOAD IMAGE TO ANALYZE BIOMECHANICS & FORM</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Upload Section */}
          <div className="space-y-4">
            <div className={`aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center transition-all overflow-hidden relative ${
              image ? 'border-lime-500/50' : 'border-zinc-800 hover:border-lime-900/50'
            }`}>
              {image ? (
                <>
                  <img src={image} alt="Stroke to analyze" className="w-full h-full object-cover" />
                  <button 
                    onClick={() => setImage(null)}
                    className="absolute top-2 right-2 bg-black/70 p-1 rounded-full hover:bg-black text-red-500"
                  >
                    ×
                  </button>
                </>
              ) : (
                <label className="cursor-pointer flex flex-col items-center p-8 text-center">
                  <Upload size={48} className="text-zinc-700 mb-4" />
                  <span className="text-sm text-zinc-400">SELECT IMAGE FILE</span>
                  <span className="text-[10px] text-zinc-600 mt-2">JPG, PNG, WEBP (MAX 4MB)</span>
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                </label>
              )}
            </div>

            <button
              onClick={handleAnalyze}
              disabled={!image || loading}
              className="w-full bg-lime-500 text-black font-bold py-3 rounded hover:bg-lime-400 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 uppercase tracking-widest text-sm"
            >
              {loading ? <RefreshCw className="animate-spin" size={18} /> : 'RUN_ANALYSIS_CMD'}
            </button>
          </div>

          {/* Result Section */}
          <div className="space-y-4">
            {loading ? (
              <div className="h-full flex flex-col items-center justify-center text-lime-500 space-y-4 animate-pulse">
                <div className="text-2xl font-bold italic tracking-tighter">SCANNING...</div>
                <div className="text-[10px] text-center max-w-xs uppercase">
                  DETECTING JOINT ANGLES // CALCULATING KINETIC CHAIN // IDENTIFYING STROKE PATTERNS
                </div>
              </div>
            ) : result ? (
              <div className="bg-zinc-900/50 border border-lime-900/20 rounded-lg p-5 space-y-5 shadow-inner">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-[10px] text-lime-600 font-bold">DETECTION_TYPE</div>
                    <div className="text-lg font-bold text-lime-400">{result.strokeType}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-lime-600 font-bold">FORM_SCORE</div>
                    <div className="text-3xl font-bold text-lime-500">{result.formScore}</div>
                  </div>
                </div>

                <div>
                  <div className="text-[10px] text-lime-600 font-bold mb-2 uppercase flex items-center gap-1">
                    <CheckCircle2 size={12} /> POSITIVE_METRICS
                  </div>
                  <ul className="space-y-1">
                    {result.strengths.map((s, i) => (
                      <li key={i} className="text-xs flex items-start gap-2 text-zinc-300">
                        <span className="text-lime-500">+</span> {s}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t border-zinc-800 pt-3">
                  <div className="text-[10px] text-red-600 font-bold mb-2 uppercase">REMEDIATION_REQUIRED</div>
                  <ul className="space-y-1">
                    {result.improvements.map((s, i) => (
                      <li key={i} className="text-xs flex items-start gap-2 text-zinc-300">
                        <span className="text-red-500">!</span> {s}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-lime-500/10 p-3 rounded border border-lime-500/20">
                  <div className="text-[10px] text-lime-400 font-bold mb-2">RECOMMENDED_DRILLS</div>
                  {result.drills.map((d, i) => (
                    <div key={i} className="text-[11px] text-lime-200 flex items-center gap-2 mb-1">
                      <ChevronRight size={10} /> {d}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-full border border-zinc-800 rounded-lg flex items-center justify-center text-zinc-600 text-xs italic text-center p-8">
                AWAITING_DATA_INPUT...<br/>SYSTEM_READY
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyzerView;
