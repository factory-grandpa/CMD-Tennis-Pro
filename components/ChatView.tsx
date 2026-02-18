
import React, { useState, useRef, useEffect } from 'react';
import { Send, Terminal as TerminalIcon, User } from 'lucide-react';
import { chatWithCoach } from '../services/geminiService';
import { Message } from '../types';

const ChatView: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: '안녕하십니까. "CMD 테니스 프로" 가동 중입니다. 무엇을 도와드릴까요? (예: 서브 연습법, 라켓 추천, 현대 테니스 전술 등)', timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg: Message = { role: 'user', text: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await chatWithCoach(input, messages);
      setMessages(prev => [...prev, { role: 'model', text: response || '오류가 발생했습니다.', timestamp: Date.now() }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', text: 'Error connecting to Gemini API.', timestamp: Date.now() }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full p-4 font-mono">
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2 custom-scrollbar"
      >
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3 rounded-lg border ${
              m.role === 'user' 
                ? 'bg-zinc-900 border-zinc-700 text-zinc-300' 
                : 'bg-lime-950/20 border-lime-900/40 text-lime-400'
            }`}>
              <div className="flex items-center gap-2 mb-1 text-[10px] opacity-60">
                {m.role === 'user' ? <User size={12} /> : <TerminalIcon size={12} />}
                <span>{m.role === 'user' ? 'USER_ID_001' : 'TENNIS_PRO_AI'}</span>
              </div>
              <div className="text-sm leading-relaxed whitespace-pre-wrap">{m.text}</div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-2 text-lime-500 animate-pulse text-xs italic">
            <span>> PRO_COACH_THINKING...</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-lime-500">></div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="ENTER COMMAND OR ASK A QUESTION..."
          className="w-full bg-zinc-950 border border-lime-900/50 rounded-md py-3 pl-8 pr-12 text-lime-400 focus:outline-none focus:border-lime-500 focus:ring-1 focus:ring-lime-500 transition-all text-sm"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-lime-500 hover:text-lime-400 disabled:opacity-30"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default ChatView;
