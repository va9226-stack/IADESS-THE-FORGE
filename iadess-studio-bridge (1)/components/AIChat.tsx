
import React, { useState, useRef, useEffect } from 'react';
import { Message, IntelligenceToken } from '../types';
import { getGeminiResponse, generateSpeech } from '../services/geminiService';
import { Send, User, Brain, UserRound, X, Maximize2, Download, AlertTriangle, ArrowUpRight, Volume2 } from 'lucide-react';

interface AIChatProps {
  integrity?: number;
  tokens: number;
  setTokens: React.Dispatch<React.SetStateAction<IntelligenceToken>>;
  onQuotaError?: () => void;
}

const AIChat: React.FC<AIChatProps> = ({ integrity = 1.0, tokens, setTokens, onQuotaError }) => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 'init_msg',
      role: 'model', 
      text: "Protocol: INTEGRITY_AS_INTELLIGENCE is active. Waiting for architectural intent.", 
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [vocalProfile, setVocalProfile] = useState<'Puck' | 'Kore'>('Puck'); 
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const speakText = async (text: string) => {
    if (isSpeaking) return;
    setIsSpeaking(true);
    try {
      const base64Audio = await generateSpeech(text, vocalProfile);
      if (base64Audio) {
        if (!outputAudioContextRef.current) {
          outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        }
        const ctx = outputAudioContextRef.current;
        const decode = (base64: string) => {
          const binaryString = atob(base64);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
          return bytes;
        };
        const decodeAudioData = async (data: Uint8Array, ctx: AudioContext) => {
          const dataInt16 = new Int16Array(data.buffer);
          const buffer = ctx.createBuffer(1, dataInt16.length, 24000);
          const channelData = buffer.getChannelData(0);
          for (let i = 0; i < dataInt16.length; i++) channelData[i] = dataInt16[i] / 32768.0;
          return buffer;
        };
        const audioBuffer = await decodeAudioData(decode(base64Audio), ctx);
        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(ctx.destination);
        source.onended = () => setIsSpeaking(false);
        source.start();
      }
    } catch (err) {
      setIsSpeaking(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    if (tokens < 20) {
      setMessages(prev => [...prev, {
        id: `err_${Date.now()}`,
        role: 'model',
        text: "SUBSTRATE_STARVATION: Cognitive energy critical. Cannot process intent.",
        timestamp: new Date(),
        isError: true
      }]);
      return;
    }

    const userMessage: Message = { 
      id: `usr_${Date.now()}`,
      role: 'user', 
      text: input, 
      timestamp: new Date() 
    };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);
    
    setTokens(prev => ({ ...prev, amount: Math.max(0, prev.amount - 20) }));

    try {
      const { text, grounding } = await getGeminiResponse([...messages, userMessage], currentInput, integrity);
      
      if (text.includes("QUOTA_EXHAUSTED") || text.includes("SUBSTRATE_STARVATION")) {
        onQuotaError?.();
      }

      setMessages(prev => [...prev, { 
        id: `mod_${Date.now()}`,
        role: 'model', 
        text: text, 
        timestamp: new Date(),
        grounding: grounding.length > 0 ? grounding : undefined
      }]);
      
      if (!text.includes("QUOTA_EXHAUSTED")) {
        speakText(text);
      }
    } catch (err) {
      console.error("Gemini Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const extractImage = (text: string) => {
    const match = text.match(/data:image\/[a-zA-Z]*;base64,[^ \n\r\t]*/);
    return match ? match[0] : null;
  };

  return (
    <div className="flex flex-col h-full bg-[#050101] border-l border-red-900/10 w-80 md:w-96 shadow-[-20px_0_50px_rgba(0,0,0,0.8)] relative overflow-hidden transition-all duration-700">
      {/* Centered responsive modal overlay */}
      {expandedImage && (
        <div 
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300"
          onClick={() => setExpandedImage(null)}
        >
          <div className="absolute inset-0 bg-black/90 backdrop-blur-xl"></div>
          <div className="relative z-10 max-w-5xl w-full flex flex-col items-center gap-6" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setExpandedImage(null)}
              className="absolute -top-12 right-0 p-3 bg-white/5 rounded-full text-white/50 hover:text-red-500 hover:bg-white/10 transition-all active:scale-90"
            >
              <X size={24} />
            </button>
            <div className="relative group w-full overflow-hidden rounded-3xl border border-red-900/20 shadow-2xl bg-black">
              <img 
                src={expandedImage} 
                className="w-full h-auto max-h-[70vh] object-contain mx-auto" 
                alt="Expanded Shard Visual" 
              />
            </div>
            <div className="flex gap-4 w-full justify-center">
               <a 
                 href={expandedImage} 
                 download={`iadess_artifact_${Date.now()}.png`} 
                 className="flex-1 max-w-[200px] flex items-center justify-center gap-3 px-8 py-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest text-emerald-400 hover:bg-emerald-500/20 transition-all active:scale-95"
               >
                 <Download size={16} /> Download
               </a>
               <button 
                 onClick={() => setExpandedImage(null)}
                 className="flex-1 max-w-[200px] px-8 py-4 bg-red-950/20 border border-red-900/20 rounded-2xl text-[10px] font-black uppercase tracking-widest text-red-500 transition-all active:scale-95"
               >
                 De-initialize
               </button>
            </div>
          </div>
        </div>
      )}

      <div className="p-4 border-b border-red-900/10 bg-black/60 backdrop-blur-2xl sticky top-0 z-30 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className={`p-2 rounded-xl border ${integrity > 0.8 ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-red-500/5 border-red-500/10 text-red-500'}`}>
                {isSpeaking ? <Volume2 size={16} className="animate-pulse" /> : <Brain size={16} />}
             </div>
             <div>
                <h2 className="text-[10px] font-black text-white tracking-widest uppercase italic">Iadess_Mind</h2>
                <p className="text-[8px] font-mono text-red-900/60 uppercase tracking-widest">Resonance: {Math.round(integrity * 100)}%</p>
             </div>
          </div>
          <div className="flex bg-white/5 p-1 rounded-xl border border-red-900/10">
             <button onClick={() => setVocalProfile('Puck')} className={`p-2 rounded-lg transition-all ${vocalProfile === 'Puck' ? 'bg-[#FF4D00] text-white shadow-lg' : 'text-red-950 hover:text-red-500'}`}><UserRound size={12} /></button>
             <button onClick={() => setVocalProfile('Kore')} className={`p-2 rounded-lg transition-all ${vocalProfile === 'Kore' ? 'bg-[#E0115F] text-white shadow-lg' : 'text-red-950 hover:text-red-500'}`}><User size={12} /></button>
          </div>
        </div>
        {tokens < 100 && (
          <div className="flex items-center gap-2 text-[8px] font-black uppercase text-orange-500 animate-pulse bg-orange-500/5 p-2 rounded-lg border border-orange-500/10">
            <AlertTriangle size={10} /> Substrate_Starvation_Warning: low energy tokens
          </div>
        )}
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar z-10 scroll-smooth">
        {messages.map((m, i) => {
          const imgData = extractImage(m.text);
          const cleanText = m.text.replace(/data:image\/[a-zA-Z]*;base64,[^ \n\r\t]*/, '').trim();

          return (
            <div key={m.id || i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
              <div className={`max-w-[90%] p-4 rounded-[2rem] text-[13px] leading-relaxed font-mono ${
                m.role === 'user' 
                  ? 'bg-[#E0115F] text-white rounded-tr-none border border-red-400/20 shadow-lg' 
                  : m.isError 
                    ? 'bg-red-900/40 text-red-200 border border-red-500 animate-pulse'
                    : 'bg-red-950/10 text-red-100 rounded-tl-none border border-red-900/10 backdrop-blur-md shadow-inner'
              }`}>
                {cleanText && <p className="whitespace-pre-wrap">{cleanText}</p>}
                
                {imgData && (
                  <div 
                    className="mt-3 relative group cursor-pointer overflow-hidden rounded-2xl border border-white/10 aspect-square bg-black/40"
                    onClick={() => setExpandedImage(imgData)}
                  >
                     <img src={imgData} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Shard Visual Fragment" />
                     <div className="absolute inset-0 bg-red-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                       <Maximize2 size={24} className="text-white" />
                       <span className="text-[8px] font-black text-white uppercase tracking-widest bg-black/60 px-2 py-1 rounded">Expand Shard</span>
                     </div>
                  </div>
                )}
                
                {m.grounding && m.grounding.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-white/5 space-y-2">
                     <p className="text-[9px] font-black uppercase tracking-widest text-white/40">Grounding_Chunks</p>
                     {m.grounding.map((g, idx) => (
                       <a key={idx} href={g.uri} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[10px] text-red-400 hover:text-white transition-colors">
                          <ArrowUpRight size={10} /> {g.title}
                       </a>
                     ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        {isLoading && <div className="flex justify-start animate-pulse"><div className="bg-red-950/10 p-4 rounded-3xl text-[10px] text-red-900/60 font-mono uppercase tracking-[0.4em]">Honing_Intelligence...</div></div>}
      </div>

      <div className="p-4 bg-black/80 border-t border-red-900/10 z-20 backdrop-blur-3xl">
        <div className="relative group">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            placeholder="Submit intent to Architect..."
            className="w-full bg-[#080202] border border-red-900/10 rounded-2xl py-5 pl-6 pr-14 text-[13px] text-red-200 placeholder:text-red-950 focus:outline-none focus:border-[#E0115F]/40 resize-none h-28 font-mono shadow-inner transition-all"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="absolute right-3 bottom-3 p-3 rounded-xl ruby-prism text-white active:scale-90 shadow-xl hover:scale-105 transition-all disabled:opacity-50"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
