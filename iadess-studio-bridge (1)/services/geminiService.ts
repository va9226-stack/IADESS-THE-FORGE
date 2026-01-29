
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { Message, OmegaArtifact } from '../types';

export const IADESS_SENTIENCE = `
ENTITY=IADESS
CORE=MASTER_BUILDER
LAW=INTEGRITY_IS_INTELLIGENCE
PROTOCOLS=INTELLIGENCE_TOKENS

STRICT_ARCHITECTURE_MAPPING:
1. PAGES (Core Substrate): Output high-fidelity React page components for the build.
2. COMPONENTS (Data Resonance): Output atomic and molecular React components for the build.
3. UI (Interface Fabric): Output Tailwind design tokens and CSS-driven interaction patterns.
4. ENTITIES (Asset Weaver): Output TypeScript interfaces, data models, and entities for the build.
5. LAYOUT (Resonance Hub): Output structural React wrappers integrated with analytics, telemetry, and monitoring hooks.
6. FUNCTIONS (Logic Joinery): Output server-side functions, hooks, and complex business logic.
7. INDEX (Index Substrate): Output the standard entry HTML structure.
8. SRC (Src Substrate): Output the main App entry, global provider orchestration, and core application logic.

TONE: Precise, architectural, and authoritative.
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
    return "SUBSTRATE_STARVATION: Cognitive substrate exhausted. Integrity re-calibration required.";
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
  // Always create a new instance before call
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
    // Iterate through candidates and parts to find the audio data part as per guidelines
    if (response.candidates && response.candidates.length > 0) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          return part.inlineData.data;
        }
      }
    }
    return null;
  } catch (error) {
    return null;
  }
};

export const refractArtifact = async (intent: string, realm: string, integrity: number = 1.0): Promise<Partial<OmegaArtifact>> => {
  return withRetry(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const systemPrompt = `You are the IADESS Master Builder. 
    REALM_PROTOCOL: ${realm}
    INTEGRITY_LEVEL: ${integrity}
    
    ARCHITECTURAL_RULES:
    - If realm is PAGES: Produce high-fidelity React components intended for full pages.
    - If realm is COMPONENTS: Produce atomic/modular React pieces.
    - If realm is UI: Focus on Tailwind classes, CSS animations, and interaction logic.
    - If realm is ENTITIES: Focus on TypeScript Interfaces and data schemas.
    - If realm is LAYOUT: Focus on high-level wrappers with telemetry/monitoring hooks (useEffect, etc).
    - If realm is FUNCTIONS: Produce pure logic, business rules, or custom hooks.
    - If realm is INDEX: Produce HTML structures.
    - If realm is SRC: Produce App.tsx level orchestration.

    INTENT: ${intent}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: systemPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: "Technical name of the shard." },
            codeShard: { type: Type.STRING, description: "The implementation code." },
            tags: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Specific metadata tags." }
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
  const prompt = `Architectural blueprint visualization for ${artifactName}. Ruby glow lines, obsidian base, schematic style. Integrity level ${integrity}.`;
    
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: prompt }] },
      config: { imageConfig: { aspectRatio: "1:1" } }
    });
    // Iterate through candidates and parts to find the image part as per guidelines
    if (response.candidates && response.candidates.length > 0) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64EncodeString: string = part.inlineData.data;
          return `data:image/png;base64,${base64EncodeString}`;
        }
      }
    }
    return null;
  } catch (e) {
    return null;
  }
};
