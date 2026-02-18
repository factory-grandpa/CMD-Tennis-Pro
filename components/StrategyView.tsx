
import React, { useState } from 'react';
import { Crosshair, Shield, Sword, Layout, RefreshCw } from 'lucide-react';
import { getTacticalAdvice } from '../services/geminiService';

const StrategyView: React.FC = () => {
  const [playerType, setPlayerType] = useState('Aggressive Baseliner');
  const [surface, setSurface] = useState('Hard Court');
  const [opponentType, setOpponentType] = useState('Counter Puncher');
  const [loading, setLoading] = useState(false);
  const [strategy, setStrategy] = useState('');

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await getTacticalAdvice(playerType, surface, opponentType);
      setStrategy(res || '');
    } catch (err) {
      setStrategy('전술 정보를 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6 custom-scrollbar font-mono text-zinc-300">
      <div className="max-w-3xl mx-auto space-y-8">
        <header className="border-b border-lime-900/30 pb-4">
          <h2 className="text-xl font-bold text-lime-500 flex items-center gap-2">
            <Crosshair size={24} /> TACTICAL_STRATEGY_GEN
          </h2>
          <p className="text-xs text-zinc-500 mt-1">CONFIGURE PARAMETERS TO GENERATE WINNING GAME PLAN</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] text-lime-600 font-bold flex items-center gap-1 uppercase">
              <Sword size={12} /> Your_Style
            </label>
            <select 
              value={playerType}
              onChange={(e) => setPlayerType(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-sm text-lime-400 focus:outline-none focus:border-lime-500"
            >
              <option>Aggressive Baseliner</option>
              <option>Serve & Volleyer</option>
              <option>Counter Puncher</option>
              <option>All-Court Player</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] text-lime-600 font-bold flex items-center gap-1 uppercase">
              <Layout size={12} /> Court_Surface
            </label>
            <select 
              value={surface}
              onChange={(e) => setSurface(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-sm text-lime-400 focus:outline-none focus:border-lime-500"
            >
              <option>Hard Court</option>
              <option>Clay Court</option>
              <option>Grass Court</option>
              <option>Indoor Carpet</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] text-lime-600 font-bold flex items-center gap-1 uppercase">
              <Shield size={12} /> Opponent_Type
            </label>
            <select 
              value={opponentType}
              onChange={(e) => setOpponentType(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-sm text-lime-400 focus:outline-none focus:border-lime-500"
            >
              <option>Counter Puncher</option>
              <option>Big Server</option>
              <option>Moonballer</option>
              <option>Junk Baller</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full bg-lime-500 text-black font-bold py-3 rounded hover:bg-lime-400 transition-colors flex items-center justify-center gap-2 uppercase tracking-widest text-sm"
        >
          {loading ? <RefreshCw className="animate-spin" size={18} /> : 'CALCULATE_WIN_STRATEGY'}
        </button>

        {strategy && (
          <div className="bg-zinc-900 border border-lime-900/20 rounded p-6 shadow-xl animate-in fade-in slide-in-from-bottom-2">
            <div className="text-[10px] text-lime-500 font-bold mb-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-lime-500 animate-pulse"></div>
              GENERATED_INTEL_REPORT
            </div>
            <div className="text-sm leading-relaxed whitespace-pre-wrap text-zinc-300 prose prose-invert prose-lime">
              {strategy}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StrategyView;
