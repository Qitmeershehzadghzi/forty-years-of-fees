import { GoogleGenAI } from '@google/genai';
import { config } from './env.js';

let aiClient = null;

export function getGeminiClient() {
  if (!config.gemini.apiKey) {
    console.warn('[Gemini AI] Warning: GEMINI_API_KEY is not set in environment.');
    return null;
  }

  if (!aiClient) {
    try {
      aiClient = new GoogleGenAI({ apiKey: config.gemini.apiKey });
    } catch (err) {
      console.error('[Gemini AI] Initialization error:', err.message);
      return null;
    }
  }

  return aiClient;
}

export const GEMINI_MODEL = config.gemini.model || 'gemini-3.5-flash-lite';
