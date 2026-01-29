
import React, { useState } from 'react';
import { Hammer, Flame, Droplets, Zap, ShieldAlert, CheckCircle2, Loader2, Binary, Sparkles, Wand2 } from 'lucide-react';
import { ForgeItemService } from '../logic/ForgeItemService';
import { Artifact, ForgeMode } from '../types/core';
import { getTokens } from '../intelligence/intelligenceRuntime';
// Fix: Import Result type for explicit usage and better narrowing
import { Result } from '../core/Result';

interface ForgeState {
  heat: number;
  strikes: number;
  integrity: number;
  infinityMode: boolean;
  isPrepared: boolean;
  draftCode: string;
  isProcessing: boolean;
  logBuffer: string;
}

interface HammerForgeProps {
  intent: string;
  realm: string;
  onQuench: (artifact: Partial<Artifact>) => void;
  onLog: (msg: string) => void;
}

const HammerForge: React.FC<HammerForgeProps> = ({ intent, realm, onQuench, onLog }) => {
  const [state, setState] = useState<ForgeState>({
    heat: 0,
    strikes: 0,
    integrity: 1.0,
    infinityMode: false,
    isPrepared: false,
    draftCode: '',
    isProcessing: false,
    logBuffer: ''
  });

  const [activeAction, setActiveAction] = useState<string | null>(null);

  const applyHeat = () => {
    if (state.isProcessing) return;
    setActiveAction('heat');
    setState(prev => {
      const nextHeat = prev.heat + 25;
      const isPrepared = nextHeat >= 60 && nextHeat <= 95;
      return { 
        ...prev, 
        heat: nextHeat, 
        integrity: Math.max(0.1, prev.integrity - (nextHeat > 100 ? 0.05 : 0)),
        isPrepared 
      };
    });
    setTimeout(() => setActiveAction(null), 200);
  };

  const strike = async () => {
    if (state.isProcessing || !intent) return;
    setActiveAction('strike');
    
    if (!state.isPrepared && !state.infinityMode) {
      onLog("STRUCTURAL_WARNING: Substrate cold. Strike logic imprint failed.");
      setState(prev => ({ ...prev, integrity: Math.max(0.1, prev.integrity - 0.1) }));
      return;
    }

    setState(prev => ({ ...prev, isProcessing: true, strikes: prev.strikes + 1 }));
    onLog(`STRIKE_${state.strikes + 1}: Honing ${realm} logic...`);

    // Use current intent and heat to generate new code
    const mode = realm as ForgeMode;
    const result = await ForgeItemService.strike(mode, intent, state.heat, state.draftCode);
    
    // Fix: Using explicit check to assist TypeScript in narrowing the result type (replaces !result.ok)
    if (result.ok === false) {
      onLog(`ERROR: ${result.error}`);
      setState(prev => ({ ...prev, isProcessing: false }));
      return;
    }

    setState(prev => ({ 
      ...prev, 
      draftCode: result.value.code,
      isProcessing: false,
      integrity: result.value.integrity,
      logBuffer: prev.logBuffer + `\n[Impact_${prev.strikes + 1}]: Crystallized ${result.value.cost} IQ-T logic at ${prev.heat}°C.`
    }));
    onLog(`SYNC: Kinetic impact successful. Consumed ${result.value.cost} IQ-T.`);
  };

  const toggleInfinity = async () => {
    if (state.isProcessing) return;
    const nextMode = !state.infinityMode;
    setActiveAction('infinity');

    if (nextMode && state.draftCode) {
      setState(prev => ({ ...prev, isProcessing: true, infinityMode: true }));
      onLog("PROTOCOL: OMEGA_TRANSMUTATION engaged. Restructuring logic...");
      
      const result = await ForgeItemService.transmute(state.draftCode, realm as ForgeMode);
      // Fix: Using explicit check to assist TypeScript in narrowing the result type (replaces !result.ok)
      if (result.ok === false) {
        onLog(`ERROR: ${result.error}`);
        setState(prev => ({ ...prev, isProcessing: false, infinityMode: false }));
        return;
      }

      setState(prev => ({ 
        ...prev, 
        draftCode: result.value,
        isProcessing: false,
        integrity: 1.0,
        heat: 100,
        logBuffer: prev.logBuffer + `\n[OMEGA_SHIFT]: Total logic transmutation achieved.`
      }));
      onLog("SUCCESS: Substrate ascended to OMEGA grade.");
    } else {
      setState(prev => ({ ...prev, infinityMode: nextMode }));
      if (nextMode) onLog("OMEGA_WAIT: Handshake initialized. Awaiting strike to transmute.");
    }
  };

  const handleQuench = async () => {
    if (state.isProcessing || !state.draftCode) return;
    
    setState(prev => ({ ...prev, isProcessing: true }));
    onLog("QUENCH: Crystallizing structural state and rendering visual projection...");

    const visual = await ForgeItemService.synthesizeVisual(`${realm}_${state.integrity}`, state.integrity);
    
    onQuench({
      name: `${realm}_${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
      codeShard: state.draftCode,
      visualUrl: visual || undefined,
      status: state.infinityMode ? 'OMEGA_BOUND' : 'MASTERWORK',
      integrityScore: state.integrity,
      createdAt: new Date(),
      expansionHistory: [state.logBuffer]
    });

    setState({ heat: 0, strikes: 0, integrity: 1.0, infinityMode: false, isPrepared: false, draftCode: '', isProcessing: false, logBuffer: '' });
  };

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-10 bg-black/60 p-12 rounded-[4rem] border transition-all duration-700 relative ${
      state.infinityMode ? 'border-purple-500 shadow-[0_0_80px_rgba(168,85,247,0.2)]' : 
      activeAction === 'heat' ? 'border-orange-500 shadow-[inset_0_0_60px_rgba(255,120,0,0.2)]' : 
      activeAction === 'strike' ? 'border-red-500 shadow-[inset_0_0_80px_rgba(255,0,0,0.25)]' : 
      'border-red-900/10'
    } backdrop-blur-3xl overflow-hidden`}>
      
      <div className="space-y-8 relative z-10">
        <h3 className="text-[11px] font-black text-red-700 uppercase tracking-[0.5em] flex items-center gap-3">
          <Hammer size={16} /> Substrate Fabrication
        </h3>
        <div className="grid grid-cols-2 gap-6">
          <button onClick={applyHeat} className={`flex flex-col items-center justify-center p-10 rounded-[3rem] border transition-all duration-300 relative group ${activeAction === 'heat' ? 'bg-orange-500 text-white' : 'bg-orange-500/5 border-orange-500/10 text-orange-500 hover:bg-orange-500/20'}`}>
            <Flame className="mb-4" />
            <span className="text-[11px] font-black uppercase tracking-widest">Apply Heat</span>
            {state.isPrepared && <div className="absolute top-4 right-4 w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_15px_#10b981]" />}
          </button>
          <button onClick={strike} disabled={state.isProcessing || !intent} className={`flex flex-col items-center justify-center p-10 rounded-[3rem] border transition-all duration-300 group ${activeAction === 'strike' ? 'bg-red-500 text-white' : 'bg-red-500/5 border-red-500/10 text-red-500 hover:bg-red-500/20'}`}>
            {state.isProcessing ? <Loader2 className="animate-spin mb-4" /> : <Hammer className="mb-4" />}
            <span className="text-[11px] font-black uppercase tracking-widest">Strike Logic</span>
          </button>
          <button onClick={toggleInfinity} className={`flex flex-col items-center justify-center p-10 rounded-[3rem] border transition-all duration-300 group ${state.infinityMode ? 'bg-purple-600 text-white' : 'bg-white/5 border-white/5 text-white/30 hover:bg-white/10 hover:text-white'}`}>
            <Zap className={`mb-4 ${state.infinityMode ? 'animate-pulse scale-125' : ''}`} />
            <span className="text-[11px] font-black uppercase tracking-widest">Infinity</span>
          </button>
          <button onClick={handleQuench} disabled={!state.draftCode} className={`flex flex-col items-center justify-center p-10 rounded-[3rem] border transition-all duration-300 ${state.draftCode ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-500/20' : 'bg-white/5 text-white/10 cursor-not-allowed'}`}>
            <Droplets className="mb-4" />
            <span className="text-[11px] font-black uppercase tracking-widest">Quench</span>
          </button>
        </div>
      </div>

      <div className="space-y-8 font-mono relative z-10 flex flex-col justify-between">
        <div className="bg-black/60 p-10 rounded-[3.5rem] border border-red-900/10 relative overflow-hidden flex-1 space-y-8">
          <div className="space-y-3">
             <div className="flex justify-between text-[11px] uppercase tracking-widest text-red-900/40">Thermodynamic Prep <span>{state.heat}°C</span></div>
             <div className="w-full h-2.5 bg-red-950/40 rounded-full overflow-hidden">
                <div className={`h-full transition-all duration-500 ${state.isPrepared ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-orange-500'}`} style={{ width: `${Math.min(state.heat, 100)}%` }}></div>
             </div>
          </div>
          <div className="space-y-3">
             <div className="flex justify-between text-[11px] uppercase tracking-widest text-red-900/40">Integrity <span>{Math.round(state.integrity * 100)}%</span></div>
             <div className="w-full h-2.5 bg-red-950/40 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 transition-all duration-500 shadow-[0_0_10px_#10b981]" style={{ width: `${state.integrity * 100}%` }}></div>
             </div>
          </div>
          <div className="bg-black/80 border border-red-900/20 rounded-3xl p-6 h-40 overflow-hidden relative shadow-inner">
             <div className="absolute top-3 right-5 text-[8px] text-red-900/30 uppercase tracking-[0.3em] font-black z-10 flex items-center gap-2">
               {state.infinityMode && <Wand2 size={10} className="text-purple-500 animate-pulse" />}
               Logic_Stream
             </div>
             <div className="text-[11px] text-orange-400/80 italic leading-relaxed font-mono whitespace-pre-wrap">
               {state.draftCode || "// Awaiting kinetic input..."}
             </div>
             {state.isProcessing && (
               <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-20">
                  <Binary className="text-[#E0115F] animate-spin" size={32} />
               </div>
             )}
          </div>
        </div>
        <div className="flex justify-between items-center px-6">
           <div className="flex items-center gap-4 text-[10px] font-black uppercase text-red-900/30 tracking-[0.4em]">
              <Zap size={12} className="text-yellow-500" /> {getTokens()} IQ-T
           </div>
           <span className="text-[10px] font-black uppercase text-red-900/30 tracking-[0.4em]">{state.strikes} Impacts</span>
        </div>
      </div>
    </div>
  );
};

export default HammerForge;
