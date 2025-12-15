
import { GoogleGenAI, Type } from "@google/genai";
import { Article, Language } from "../types";

// Helper to check if API key exists
export const hasApiKey = (): boolean => !!import.meta.env.VITE_GEMINI_API_KEY;

// iFlow Provider Configuration
const IFLOW_CONFIG = {
  url: 'https://apis.iflow.cn/v1/chat/completions',
  apiKey: 'sk-7790a6c571412858f216e024b4e67c9d',
  model: 'glm-4.6'
};

// Initialize Gemini Client
const getClient = () => {
  if (!import.meta.env.VITE_GEMINI_API_KEY) {
    throw new Error("API Key is missing.");
  }
  return new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
};

/**
 * Helper function to call iFlow API (OpenAI Compatible)
 */
const callIFlow = async (prompt: string, systemInstruction: string = ""): Promise<string> => {
  try {
    const response = await fetch(IFLOW_CONFIG.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${IFLOW_CONFIG.apiKey}`
      },
      body: JSON.stringify({
        model: IFLOW_CONFIG.model,
        messages: [
          { role: 'system', content: systemInstruction },
          { role: 'user', content: prompt }
        ],
        stream: false
      })
    });

    if (!response.ok) {
        console.error(`iFlow API error: ${response.status} ${response.statusText}`);
        return "";
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "";
  } catch (error) {
    console.error("iFlow Call Failed:", error);
    return "";
  }
};

/**
 * Simulates a crawler by using Gemini with Google Search Grounding to find news.
 * We continue to use Gemini here because iFlow/GLM-4.6 via this endpoint does not natively support 
 * the Google Search Grounding tool structure required for live URL retrieval.
 */
export const crawlNewsByKeyword = async (keyword: string, languages: Language[]): Promise<Article[]> => {
  try {
    const client = getClient();
    const langString = languages.join(", ");
    
    // We use the search tool to get real-world grounded data
    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Find 5 recent **global and international** news articles about "${keyword}" in these languages: ${langString}. 
      Ensure the results cover a diverse range of sources, including major international publications outside of Mainland China if possible.
      Return the result as a strictly formatted JSON array. Do not include markdown formatting or backticks.
      Each item in the array must be an object with these properties:
      - title: string
      - source: string
      - publishedAt: string (YYYY-MM-DD format)
      - content: string (A comprehensive summary or detailed content if available, at least 2-3 sentences)
      - language: string
      - sentiment: string (one of: 'positive', 'neutral', 'negative')`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    let text = response.text || "[]";
    // Remove markdown code blocks if present
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();
    
    let rawData = [];
    try {
        rawData = JSON.parse(text);
        if (!Array.isArray(rawData)) rawData = [];
    } catch (e) {
        console.warn("Failed to parse JSON from Gemini response, falling back to empty array.", e);
    }

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return rawData.map((item: any, index: number) => {
      // Try to find a relevant URL from grounding chunks if available
      const relevantChunk = groundingChunks.find((c: any) => c.web?.title?.includes(item.title) || c.web?.uri);
      const url = relevantChunk?.web?.uri || `https://google.com/search?q=${encodeURIComponent(item.title)}`;
      
      return {
        id: `gen-${Date.now()}-${index}`,
        title: item.title,
        source: item.source,
        publishedAt: item.publishedAt || new Date().toISOString(),
        url: url,
        content: item.content,
        language: item.language || languages[0],
        category: 'General',
        sentiment: item.sentiment || 'neutral',
        imageUrl: `https://picsum.photos/800/600?random=${index + Math.floor(Math.random() * 1000)}` 
      } as Article;
    });

  } catch (error) {
    console.error("Gemini Crawl Error:", error);
    // Return mock data if API fails or key missing
    return [
      {
        id: 'mock-1',
        title: `Simulated News: Update on ${keyword}`,
        source: 'Global News Network',
        publishedAt: new Date().toISOString(),
        url: '#',
        content: `This is a simulated article content. The system could not reach the live API. It discusses ${keyword}.`,
        language: languages[0],
        category: 'Technology',
        sentiment: 'positive',
        imageUrl: 'https://picsum.photos/800/600'
      }
    ];
  }
};

/**
 * Expands article content using iFlow (GLM-4.6)
 */
export const expandArticleContent = async (title: string, currentContent: string, language: string): Promise<string> => {
  const system = "You are a news aggregator assistant. Write a comprehensive, multi-paragraph news article based on the following title and snippet. The output should look like a full journalistic article. Do not make up facts if possible, but expand logically on the provided premise.";
  const prompt = `Title: "${title}"\nSnippet: "${currentContent}"\nLanguage: ${language}`;
  
  const result = await callIFlow(prompt, system);
  return result || currentContent;
};

/**
 * Summarizes a specific article text using iFlow (GLM-4.6)
 */
export const summarizeArticleContent = async (text: string): Promise<string> => {
  const system = "You are a helpful assistant.";
  const prompt = `Provide a concise 3-bullet point summary of the following news text:\n\n${text}`;
  
  const result = await callIFlow(prompt, system);
  return result || "Could not generate summary.";
};

/**
 * Translates text using iFlow (GLM-4.6)
 */
export const translateArticleText = async (text: string, targetLanguage: string): Promise<string> => {
  const system = "You are a professional translator.";
  const prompt = `Translate the following text into ${targetLanguage}. Maintain the original tone and context:\n\n${text}`;
  
  const result = await callIFlow(prompt, system);
  return result || "Could not translate text.";
};
