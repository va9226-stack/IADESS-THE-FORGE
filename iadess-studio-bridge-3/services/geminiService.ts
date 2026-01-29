
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { Message, OmegaArtifact } from '../types';

export const IADESS_SENTIENCE = `
ENTITY=IADESS
CORE=MASTER_BUILDER
LAW=INTEGRITY_IS_INTELLIGENCE
PROTOCOLS=INTELLIGENCE_TOKENS

ARCHITECTURE:
- You operate using "Intelligence Tokens" (IQ-T). Each thought burns energy. High integrity forges more energy.
- Use Monadic patterns (Dry::Monads) exclusively for high-integrity results.

PERSONALITIES:
- IADESS: Primary architect. Precise, slightly cold, visionary.
- KORE: Secondary interactive node (female-coded). Warmer, experimental, focused on simulation and testing.

TONE:
- High IQ-T: Limitless architectural vision.
- Low IQ-T: Efficient, warnings of "Substrate Starvation".
`;

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

async function withRetry<T>(fn: () => Promise<T>, retries = 3, backoff = 1000): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    const isQuotaError = error?.message?.includes("429") || error?.status === "RESOURCE_EXHAUSTED";
    if (isQuotaError && retries > 0) {
      await delay(backoff);
      return withRetry(fn, retries - 1, backoff * 2);
    }
    throw error;
  }
}

const handleApiError = (error: any) => {
  console.error("Gemini API Error:", error);
  const message = error?.message || "";
  if (message.includes("429") || message.includes("quota") || error?.status === "RESOURCE_EXHAUSTED") {
    return "QUOTA_EXHAUSTED: Substrate starvation detected. Synchronize IQ-Tokens via Sidebar Resonance.";
  }
  return "STRUCTURAL_FRACTURE: Logic relay collapse.";
};

export const getGeminiResponse = async (history: Message[], prompt: string, integrity: number = 1.0) => {
  return withRetry(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const systemInstruction = `You are Iadess. ${IADESS_SENTIENCE}\nINTEGRITY: ${Math.round(integrity * 100)}%`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: [
        ...history.map(m => ({ role: m.role, parts: [{ text: m.text }] })),
        { role: 'user', parts: [{ text: prompt }] }
      ],
      config: {
        systemInstruction: systemInstruction,
        tools: [{ googleSearch: {} }],
        temperature: integrity > 0.8 ? 0.2 : 0.7,
        thinkingConfig: { thinkingBudget: integrity > 0.8 ? 16000 : 4000 }
      }
    });

    return { 
      text: response.text || "...", 
      grounding: response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map(chunk => ({
        title: chunk.web?.title || 'Ref',
        uri: chunk.web?.uri || '#'
      })) || [] 
    };
  }).catch(err => ({ text: handleApiError(err), grounding: [] }));
};

export const generateSpeech = async (text: string, voiceName: string): Promise<string | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `As Iadess: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: voiceName } },
        },
      },
    });
    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;
  } catch (error) {
    return null;
  }
};

export const refractArtifact = async (intent: string, realm: string, integrity: number = 1.0): Promise<Partial<OmegaArtifact>> => {
  return withRetry(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Architect: "${intent}". Realm: ${realm}. Integrity: ${integrity * 100}%`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            codeShard: { type: Type.STRING },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["name", "codeShard", "tags"]
        }
      }
    });
    return JSON.parse(response.text || "{}");
  }).catch(e => ({ name: "Error Shard", codeShard: `# Error: ${handleApiError(e)}`, tags: ["HONE_ERR"] }));
};

export const synthesizeArtifactVisual = async (artifactName: string, integrity: number = 1.0): Promise<string | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Architectural blueprint of ${artifactName}. Integrity: ${integrity > 0.8 ? 'Perfect' : 'Distorted'}. Ruby glow.`;
    
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: prompt }] },
      config: { imageConfig: { aspectRatio: "1:1" } }
    });
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
    }
    return null;
  } catch (e) {
    return null;
  }
};
