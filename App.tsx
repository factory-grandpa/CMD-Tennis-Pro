
import React, { useState, useEffect } from 'react';
import TerminalFrame from './components/TerminalFrame';
import ChatView from './components/ChatView';
import AnalyzerView from './components/AnalyzerView';
import StrategyView from './components/StrategyView';
import NewsView from './components/NewsView';
import GameView from './components/GameView';
import { TabType } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('game');
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setBooting(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (booting) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-black text-lime-400 font-mono">
        <div className="animate-pulse text-2xl mb-4">> INITIALIZING CMD_TENNIS_PRO_OS...</div>
        <div className="w-64 h-2 bg-gray-800 rounded overflow-hidden">
          <div className="h-full bg-lime-500 animate-[loading_1.5s_ease-in-out]"></div>
        </div>
        <style>{`
          @keyframes loading {
            0% { width: 0%; }
            100% { width: 100%; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="h-screen w-full p-2 md:p-6 flex flex-col overflow-hidden">
      <TerminalFrame activeTab={activeTab} onTabChange={setActiveTab}>
        <div className="flex-1 overflow-hidden relative">
          {activeTab === 'game' && <GameView />}
          {activeTab === 'chat' && <ChatView />}
          {activeTab === 'analyze' && <AnalyzerView />}
          {activeTab === 'strategy' && <StrategyView />}
          {activeTab === 'news' && <NewsView />}
        </div>
      </TerminalFrame>
    </div>
  );
};

export default App;
