
export type TabType = 'game' | 'chat' | 'analyze' | 'strategy' | 'news';

export interface Message {
  role: 'user' | 'model';
  text: string;
  image?: string;
  timestamp: number;
}

export interface AnalysisResult {
  strokeType: string;
  formScore: number;
  strengths: string[];
  improvements: string[];
  drills: string[];
}

export interface NewsItem {
  title: string;
  uri: string;
}
