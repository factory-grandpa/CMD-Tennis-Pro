
import React from 'react';
import { TabType } from '../types';
import { Terminal, Activity, Crosshair, Globe, Monitor, PlayCircle } from 'lucide-react';

interface TerminalFrameProps {
  children: React.ReactNode;
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const TerminalFrame: React.FC<TerminalFrameProps> = ({ children, activeTab, onTabChange }) => {
  const tabs = [
    { id: 'game' as TabType, label: 'PRO_GAME', icon: PlayCircle },
    { id: 'chat' as TabType, label: 'COACH_CHAT', icon: Terminal },
    { id: 'analyze' as TabType, label: 'STROKE_ANALYZE', icon: Activity },
    { id: 'strategy' as TabType, label: 'STRATEGY_GEN', icon: Crosshair },
    { id: 'news' as TabType, label: 'WORLD_TOUR_FEED', icon: Globe },
  ];

  return (
    <div className="flex flex-col h-full border border-lime-900/50 rounded-lg bg-zinc-950 shadow-[0_0_20px_rgba(163,230,53,0.1)] overflow-hidden">
      {/* Terminal Header */}
      <div className="bg-zinc-900 px-4 py-2 flex items-center justify-between border-b border-lime-900/30">
        <div className="flex items-center gap-2">
          <Monitor size={16} className="text-lime-500" />
          <span className="text-xs font-bold tracking-widest text-lime-500 opacity-80">CMD TENNIS PRO v3.0</span>
        </div>
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/50" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
          <div className="w-3 h-3 rounded-full bg-green-500/50" />
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
        {/* Sidebar Navigation */}
        <div className="w-full md:w-56 bg-zinc-950 border-r border-lime-900/20 p-2 md:p-4 flex md:flex-col gap-1 overflow-x-auto md:overflow-x-visible">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-3 px-3 py-2 rounded transition-all text-sm whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-lime-500/20 text-lime-400 border border-lime-500/30 shadow-[0_0_10px_rgba(163,230,53,0.1)]'
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900'
              }`}
            >
              <tab.icon size={18} />
              <span className="hidden md:inline font-bold tracking-tight">{tab.label}</span>
            </button>
          ))}
          <div className="mt-auto hidden md:block border-t border-lime-900/20 pt-4 opacity-50">
            <div className="text-[10px] text-lime-600 mb-1 font-bold">SYSTEM STATUS</div>
            <div className="flex items-center gap-2 text-[10px]">
              <div className="w-1.5 h-1.5 rounded-full bg-lime-500 animate-pulse"></div>
              <span>ARCADE_MODE_ONLINE</span>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col bg-[#050505] overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
};

export default TerminalFrame;
