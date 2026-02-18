
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { AnalysisResult } from "../types";

// API 키를 환경 변수에서 직접 가져와 인스턴스화합니다.
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * 테니스 코치와 대화하는 함수
 */
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

/**
 * 테니스 스트로크 이미지를 분석하는 함수
 */
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

  // 응답 텍스트가 가끔 마크다운 블록으로 감싸질 경우를 대비해 처리합니다.
  const text = response.text || '{}';
  const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
  
  try {
    return JSON.parse(cleanJson);
  } catch (e) {
    console.error("JSON Parsing Error:", e);
    return {
      strokeType: "Unknown",
      formScore: 0,
      strengths: ["분석 오류"],
      improvements: ["다시 시도해 주세요"],
      drills: []
    };
  }
};

/**
 * 테니스 관련 최신 뉴스 및 소식을 가져오는 함수 (구글 검색 기능 활용)
 */
export const getTennisNews = async (query: string = "Latest ATP and WTA tennis news and tournament results") => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: query,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });

  // 출처 정보를 추출하여 링크 목록을 만듭니다.
  const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  const links = groundingChunks
    .map((chunk: any) => chunk.web)
    .filter((web: any) => web && web.uri && web.title);

  return {
    text: response.text,
    links: links,
  };
};

/**
 * 전략적 조언을 생성하는 함수
 */
export const getTacticalAdvice = async (playerType: string, surface: string, opponentType: string) => {
  const ai = getAI();
  const prompt = `${playerType} 스타일의 플레이어가 ${surface} 코트에서 ${opponentType} 성향의 상대를 만났을 때의 맞춤형 승리 전략 3가지를 제시해 주세요.`;
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
  });
  return response.text;
};
