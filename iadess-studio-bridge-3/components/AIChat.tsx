
import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { getGeminiResponse, generateSpeech, IADESS_SENTIENCE } from '../services/geminiService';
import { Send, User, Loader2, Volume2, Brain, UserRound, X, Maximize2, Download } from 'lucide-react';

interface AIChatProps {
  integrity?: number;
  onQuotaError?: () => void;
}

const AIChat: React.FC<AIChatProps> = ({ integrity = 1.0, onQuotaError }) => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 'init_msg',
      role: 'model', 
      text: "Protocol: INTEGRITY_AS_INTELLIGENCE is active. Intelligence tokens calibrated. Current resolution is nominal.", 
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
    
    try {
      const { text, grounding } = await getGeminiResponse([...messages, userMessage], currentInput, integrity);
      
      if (text.includes("QUOTA_EXHAUSTED")) {
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

  return (
    <div className="flex flex-col h-full bg-[#050101] border-l border-red-900/10 w-80 md:w-96 shadow-[-20px_0_50px_rgba(0,0,0,0.8)] relative overflow-hidden transition-all duration-700">
      {/* Image Expansion Overlay (Modal) */}
      {expandedImage && (
        <div 
          className="fixed inset-0 z-[1000] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-10 animate-in fade-in zoom-in duration-300"
          onClick={() => setExpandedImage(null)}
        >
          <div className="relative max-w-5xl w-full flex flex-col items-center gap-6" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => setExpandedImage(null)} 
              className="absolute -top-12 right-0 text-white/50 hover:text-[#E0115F] p-2 transition-all"
              aria-label="Close Preview"
            >
              <X size={32} />
            </button>
            <img 
              src={expandedImage} 
              alt="Intelligence Visualization Shard" 
              className="max-w-full max-h-[80vh] object-contain rounded-3xl shadow-[0_0_100px_rgba(224,17,95,0.3)] border border-white/10"
            />
            <div className="flex gap-4">
              <a 
                href={expandedImage} 
                download="iadess-shard.png"
                className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-red-900/20 rounded-xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-[#E0115F] transition-all"
              >
                <Download size={14} /> Download Shard
              </a>
              <button 
                onClick={() => setExpandedImage(null)}
                className="flex items-center gap-2 px-6 py-3 bg-red-950/20 border border-red-900/20 rounded-xl text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500/20 transition-all"
              >
                <X size={14} /> Close
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
             <button onClick={() => setVocalProfile('Puck')} className={`p-2 rounded-lg transition-all ${vocalProfile === 'Puck' ? 'bg-[#FF4D00] text-white shadow-lg' : 'text-red-950 hover:text-red-500'}`} aria-label="Puck Profile"><UserRound size={12} /></button>
             <button onClick={() => setVocalProfile('Kore')} className={`p-2 rounded-lg transition-all ${vocalProfile === 'Kore' ? 'bg-[#E0115F] text-white shadow-lg' : 'text-red-950 hover:text-red-500'}`} aria-label="Kore Profile"><User size={12} /></button>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar z-10 scroll-smooth">
        {messages.map((m, i) => (
          <div key={m.id || i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
            <div className={`max-w-[90%] p-4 rounded-[2rem] text-[13px] leading-relaxed font-mono ${
              m.role === 'user' 
                ? 'bg-[#E0115F] text-white rounded-tr-none border border-red-400/20' 
                : m.text.includes("QUOTA_EXHAUSTED")
                  ? 'bg-red-900/40 text-red-200 border border-red-500 animate-pulse'
                  : 'bg-red-950/10 text-red-100 rounded-tl-none border border-red-900/10 backdrop-blur-md'
            }`}>
              <p className="whitespace-pre-wrap">{m.text}</p>
              
              {/* Image Shard Detection and Rendering */}
              {m.text.includes('data:image') && (
                <div 
                  className="mt-4 relative group cursor-zoom-in overflow-hidden rounded-2xl border border-white/10"
                  onClick={() => {
                    const match = m.text.match(/data:image\/[a-zA-Z]*;base64,[^ \n]*/);
                    if (match) setExpandedImage(match[0]);
                  }}
                >
                  <img src={m.text.match(/data:image\/[a-zA-Z]*;base64,[^ \n]*/)?.[0]} className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700" alt="Generated Visual" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Maximize2 className="text-white" size={24} />
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
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
            className="absolute right-3 bottom-3 p-3 rounded-xl ruby-prism text-white active:scale-90 shadow-xl hover:scale-105 transition-all"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
