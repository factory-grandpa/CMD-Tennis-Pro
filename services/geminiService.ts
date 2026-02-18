
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { AnalysisResult } from "../types";

// Always use new GoogleGenAI({ apiKey: process.env.API_KEY }) directly.
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const chatWithCoach = async (message: string, history: any[]) => {
  const ai = getAI();
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: '당신은 "CMD 테니스 프로"라는 전문 테니스 코치입니다. 기술적 분석, 전술적 조언, 장비 추천을 전문으로 합니다. 어조는 전문적이고 고무적이며, 테니스 전문 용어를 적절히 사용합니다. 한국어로 답변하세요.',
    },
  });

  const response = await chat.sendMessage({ message });
  return response.text;
};

export const analyzeStroke = async (base64Image: string): Promise<AnalysisResult> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: base64Image.split(',')[1],
          },
        },
        {
          text: '이 테니스 자세를 분석해 주세요. 스트로크 종류, 폼 점수 (100점 만점), 장점, 개선점, 그리고 추천 연습법을 JSON 형식으로 반환해 주세요.',
        },
      ],
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          strokeType: { type: Type.STRING },
          formScore: { type: Type.NUMBER },
          strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
          improvements: { type: Type.ARRAY, items: { type: Type.STRING } },
          drills: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["strokeType", "formScore", "strengths", "improvements", "drills"],
      },
    },
  });

  return JSON.parse(response.text || '{}');
};

export const getTennisNews = async (query: string = "Latest ATP and WTA tennis news and tournament results") => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: query,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });

  const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  const links = groundingChunks
    .map((chunk: any) => chunk.web)
    .filter((web: any) => web && web.uri && web.title);

  return {
    text: response.text,
    links: links,
  };
};

export const getTacticalAdvice = async (playerType: string, surface: string, opponentType: string) => {
  const ai = getAI();
  const prompt = `${playerType} 스타일의 플레이어가 ${surface} 코트에서 ${opponentType} 성향의 상대를 만났을 때의 맞춤형 승리 전략 3가지를 제시해 주세요.`;
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
  });
  return response.text;
};
