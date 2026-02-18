
import React, { useState, useEffect } from 'react';
import { Globe, ExternalLink, Search, Loader2 } from 'lucide-react';
import { getTennisNews } from '../services/geminiService';

interface NewsResult {
  text: string;
  links: { uri: string; title: string }[];
}

const NewsView: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<NewsResult | null>(null);

  const fetchNews = async (searchQuery?: string) => {
    setLoading(true);
    try {
      const news = await getTennisNews(searchQuery || "Latest ATP WTA tournament results and ranking updates");
      setResult(news);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchNews(query);
  };

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6 custom-scrollbar font-mono text-zinc-300">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="border-b border-lime-900/30 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-lime-500 flex items-center gap-2">
              <Globe size={24} /> WORLD_TOUR_FEED
            </h2>
            <p className="text-xs text-zinc-500 mt-1">REAL-TIME SEARCH GROUNDED TENNIS INTELLIGENCE</p>
          </div>
          
          <form onSubmit={handleSearch} className="relative flex-1 md:max-w-xs">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="SEARCH TOUR NEWS..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-md py-2 pl-3 pr-10 text-xs text-lime-400 focus:outline-none focus:border-lime-500"
            />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-lime-500">
              <Search size={16} />
            </button>
          </form>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="animate-spin text-lime-500" size={32} />
            <div className="text-xs tracking-widest text-lime-600 animate-pulse">CRAWLING_GLOBAL_SOURCES...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-zinc-900/30 border border-lime-900/10 rounded-lg p-5">
                <div className="text-[10px] text-lime-600 font-bold mb-3 uppercase tracking-tighter">AI_SUMMARY_REPORT</div>
                <div className="text-sm leading-relaxed whitespace-pre-wrap text-zinc-300">
                  {result?.text || '검색 결과를 불러오는 중입니다...'}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="text-[10px] text-lime-600 font-bold uppercase">GROUNDING_SOURCES</div>
              <div className="space-y-2">
                {result?.links && result.links.length > 0 ? (
                  result.links.map((link, i) => (
                    <a
                      key={i}
                      href={link.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-3 rounded bg-zinc-900 border border-zinc-800 hover:border-lime-500/50 transition-colors group"
                    >
                      <div className="flex items-start justify-between">
                        <span className="text-xs text-zinc-300 font-bold group-hover:text-lime-400 transition-colors line-clamp-2">
                          {link.title}
                        </span>
                        <ExternalLink size={14} className="text-zinc-600 mt-1 flex-shrink-0" />
                      </div>
                      <div className="text-[9px] text-zinc-500 mt-1 truncate">{new URL(link.uri).hostname}</div>
                    </a>
                  ))
                ) : (
                  <div className="text-[10px] text-zinc-600 italic">NO_LINKS_FOUND_IN_CONTEXT</div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsView;
