
import React, { useState, useEffect } from 'react';
import { Hammer, Flame, Droplets, Zap, ShieldAlert, CheckCircle2, Loader2, Binary, Sparkles, Wand2 } from 'lucide-react';
import { refractArtifact, synthesizeArtifactVisual } from '../services/geminiService';
import { OmegaArtifact } from '../types';

interface ForgeState {
  heat: number;
  strikes: number;
  integrity: number;
  flaws: string[];
  infinityMode: boolean;
  isPrepared: boolean;
  draftCode: string;
  isProcessing: boolean;
  forgeProcessLog: string;
}

interface HammerForgeProps {
  intent: string;
  realm: string;
  onQuench: (artifact: Partial<OmegaArtifact>) => void;
  onLog: (msg: string) => void;
}

const HammerForge: React.FC<HammerForgeProps> = ({ intent, realm, onQuench, onLog }) => {
  const [state, setState] = useState<ForgeState>({
    heat: 0,
    strikes: 0,
    integrity: 1.0,
    flaws: [],
    infinityMode: false,
    isPrepared: false,
    draftCode: '',
    isProcessing: false,
    forgeProcessLog: ''
  });

  const [activeAction, setActiveAction] = useState<string | null>(null);

  const applyHeat = () => {
    if (state.isProcessing) return;
    setActiveAction('heat');
    setState(prev => {
      const nextHeat = prev.heat + 20;
      const isPrepared = nextHeat >= 50 && nextHeat <= 95;
      let nextIntegrity = prev.integrity;
      if (nextHeat > 100) nextIntegrity -= 0.05;
      
      return { 
        ...prev, 
        heat: nextHeat, 
        integrity: Math.max(0.1, nextIntegrity),
        isPrepared: isPrepared 
      };
    });
    setTimeout(() => setActiveAction(null), 200);
  };

  // Logic for STRIKE: Generate new code from heat applied
  const strike = async () => {
    if (state.isProcessing || !intent) return;
    setActiveAction('strike');
    
    if (!state.isPrepared && !state.infinityMode) {
      onLog("STRUCTURAL_WARNING: Substrate is brittle. Apply heat before striking.");
      setState(prev => ({ ...prev, integrity: Math.max(0.1, prev.integrity - 0.15) }));
      return;
    }

    setState(prev => ({ ...prev, isProcessing: true, strikes: prev.strikes + 1 }));
    onLog(`FORGE: Striking ${realm} substrate at ${state.heat}°C...`);

    try {
      const heatFactor = state.heat / 100;
      const strikeIntent = `STRIKE_${state.strikes} [HEAT:${state.heat}°C]: ${intent}. ${state.draftCode ? 'Iteratively refine the existing code buffer.' : 'Initialize base logic substrate.'}`;
      
      const result = await refractArtifact(strikeIntent, realm, state.integrity);
      
      setState(prev => ({ 
        ...prev, 
        draftCode: result.codeShard || prev.draftCode,
        isProcessing: false,
        integrity: Math.min(1.0, prev.integrity + 0.05), // Striking while heated aligns logic grains
        forgeProcessLog: prev.forgeProcessLog + `\n[STRIKE_${prev.strikes + 1}]: Crystallized at ${prev.heat}°C`
      }));
      onLog("SYNC: Logic shard densified by kinetic impact.");
    } catch (err) {
      onLog("ERROR: Logic fracture detected.");
      setState(prev => ({ ...prev, isProcessing: false }));
    }
  };

  // Logic for INFINITY: Transmute the code if activated
  const toggleInfinity = async () => {
    if (state.isProcessing) return;
    
    const wasInfinity = state.infinityMode;
    const nextMode = !wasInfinity;

    setActiveAction('infinity');
    
    if (nextMode && state.draftCode) {
      // Immediate transmutation if we have code
      setState(prev => ({ ...prev, isProcessing: true, infinityMode: true }));
      onLog("PROTOCOL: OMEGA_TRANSMUTATION initialized. Ascending logic...");
      
      try {
        const transmuteIntent = `TRANSMUTE_TO_OMEGA: Take this existing code and upgrade it to god-tier, highly optimized, enterprise-grade OMEGA architecture: ${state.draftCode}`;
        const result = await refractArtifact(transmuteIntent, realm, 1.2); // Overdrive integrity
        
        setState(prev => ({ 
          ...prev, 
          draftCode: result.codeShard || prev.draftCode,
          isProcessing: false,
          integrity: 1.0,
          heat: 100,
          forgeProcessLog: prev.forgeProcessLog + `\n[OMEGA_TRANSMUTE]: Substrate elevated to OMEGA grade.`
        }));
        onLog("SUCCESS: Logic successfully transmuted into OMEGA shard.");
      } catch (err) {
        onLog("ERROR: Transmutation relay failure.");
        setState(prev => ({ ...prev, isProcessing: false, infinityMode: false }));
      }
    } else {
      setState(prev => ({ ...prev, infinityMode: nextMode }));
      if (nextMode) onLog("OMEGA_MODE: Handshake pending. Awaiting strike or quench.");
    }
  };

  // Logic for QUENCH: Render image and code of the process
  const handleQuench = async () => {
    if (state.isProcessing || !state.draftCode) {
      onLog("ERROR: No crystallized logic available for quench.");
      return;
    }
    
    setState(prev => ({ ...prev, isProcessing: true }));
    onLog("QUENCH: Finalizing structural integrity and synthesizing visual projection...");

    try {
      const finalIntegrity = state.integrity * (state.infinityMode ? 1.5 : 1.0);
      const visualUrl = await synthesizeArtifactVisual(`${realm}_${finalIntegrity}_SHARD`, finalIntegrity);
      
      onQuench({
        name: `${realm}_${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
        codeShard: state.draftCode,
        imageUrl: visualUrl || undefined,
        status: state.infinityMode ? 'OMEGA_BOUND' : finalIntegrity > 0.9 ? 'MASTERWORK' : 'HONED',
        tags: [realm, state.infinityMode ? 'INFINITY' : 'STABLE', `STRIKES_${state.strikes}`],
        expansionHistory: [state.forgeProcessLog]
      });

      // Reset forge
      setState({ heat: 0, strikes: 0, integrity: 1.0, flaws: [], infinityMode: false, isPrepared: false, draftCode: '', isProcessing: false, forgeProcessLog: '' });
      onLog("SUCCESS: Substrate detached and saved to memory.");
    } catch (err) {
      onLog("CRITICAL: Logic boil-off. Artifact lost.");
      setState(prev => ({ ...prev, isProcessing: false }));
    }
  };

  const isReady = state.draftCode && state.strikes >= 1;

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 bg-black/80 p-12 rounded-[4rem] border transition-all duration-700 relative ${
      state.infinityMode ? 'border-purple-500 shadow-[0_0_80px_rgba(168,85,247,0.15)]' : 
      activeAction === 'heat' ? 'border-orange-500 shadow-[inset_0_0_60px_rgba(255,120,0,0.2)]' : 
      activeAction === 'strike' ? 'border-red-500 shadow-[inset_0_0_80px_rgba(255,0,0,0.25)]' : 
      'border-red-900/10'
    } backdrop-blur-3xl overflow-hidden`}>
      
      {activeAction === 'strike' && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
           <div className="w-full h-full bg-red-500/10 animate-pulse"></div>
           <Sparkles className="text-white absolute animate-ping" size={160} />
        </div>
      )}

      <div className="space-y-8 relative z-10">
        <header className="flex items-center justify-between">
           <h3 className="text-[11px] font-black text-red-700 uppercase tracking-[0.6em] flex items-center gap-3">
             <Hammer size={14} className={activeAction === 'strike' ? 'animate-bounce' : ''} /> Substrate Forge
           </h3>
           {state.isProcessing && <Loader2 className="animate-spin text-red-500" size={14} />}
        </header>

        <div className="grid grid-cols-2 gap-6">
          <button 
            onClick={applyHeat} 
            disabled={state.isProcessing}
            className={`flex flex-col items-center justify-center p-10 rounded-[3rem] border transition-all duration-300 relative overflow-hidden group ${
              activeAction === 'heat' ? 'bg-orange-500 text-white border-orange-400' : 'bg-orange-500/5 border-orange-500/10 text-orange-500 hover:bg-orange-500/20'
            }`}
          >
            <Flame className={`mb-4 transition-transform ${activeAction === 'heat' ? 'scale-150' : 'group-hover:scale-125'}`} />
            <span className="text-[11px] font-black uppercase tracking-widest">Apply Heat</span>
            {state.isPrepared && <div className="absolute top-3 right-3 w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_15px_#10b981]" />}
          </button>

          <button 
            onClick={strike} 
            disabled={state.isProcessing || !intent}
            className={`flex flex-col items-center justify-center p-10 rounded-[3rem] border transition-all duration-300 relative overflow-hidden group ${
              activeAction === 'strike' ? 'bg-red-500 text-white border-red-400' : 'bg-red-500/5 border-red-500/10 text-red-500 hover:bg-red-500/20'
            }`}
          >
            <Hammer className={`mb-4 transition-transform ${activeAction === 'strike' ? 'rotate-45 scale-150' : 'group-hover:rotate-12 group-hover:scale-110'}`} />
            <span className="text-[11px] font-black uppercase tracking-widest">Strike Logic</span>
          </button>

          <button 
            onClick={toggleInfinity} 
            disabled={state.isProcessing}
            className={`flex flex-col items-center justify-center p-10 rounded-[3rem] border transition-all duration-300 active:scale-95 group ${
              state.infinityMode ? 'bg-purple-600 text-white border-purple-400 shadow-2xl' : 'bg-white/5 border-white/5 text-white/30 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Zap className={`mb-4 ${state.infinityMode ? 'animate-pulse scale-125' : 'group-hover:scale-110'}`} />
            <span className="text-[11px] font-black uppercase tracking-widest">{state.infinityMode ? 'Transmuting' : 'Infinity'}</span>
          </button>

          <button 
            onClick={handleQuench} 
            disabled={state.isProcessing || !isReady}
            className={`flex flex-col items-center justify-center p-10 rounded-[3rem] border transition-all duration-300 active:scale-95 group shadow-2xl ${
              isReady ? 'bg-emerald-600 text-white border-emerald-400' : 'bg-white/5 border-white/5 text-white/10 cursor-not-allowed'
            }`}
          >
            <Droplets className={`mb-4 ${isReady ? 'animate-bounce scale-125' : ''}`} />
            <span className="text-[11px] font-black uppercase tracking-widest">Quench</span>
          </button>
        </div>
      </div>

      <div className="space-y-8 font-mono relative z-10 flex flex-col justify-between h-full">
        <div className="space-y-8 bg-black/60 p-10 rounded-[3.5rem] border border-red-900/10 relative overflow-hidden shadow-inner flex-1">
          <div className="absolute inset-0 pointer-events-none transition-opacity duration-1000" style={{ 
            background: `radial-gradient(circle at center, ${state.infinityMode ? 'rgba(168,85,247,0.15)' : `rgba(255,100,0,${Math.min(state.heat / 200, 0.4)})`} 0%, transparent 70%)` 
          }}></div>

          <div className="space-y-4">
            <div className="flex justify-between text-[11px]">
              <span className="text-red-900/40 uppercase tracking-widest">Thermodynamic Prep</span>
              <span className={`${state.isPrepared ? 'text-emerald-400 font-black' : state.heat > 90 ? 'text-red-500' : 'text-orange-500'}`}>{state.heat}°C</span>
            </div>
            <div className="w-full h-2.5 bg-red-950/40 rounded-full overflow-hidden border border-red-900/10">
              <div 
                className={`h-full transition-all duration-500 ${state.isPrepared ? 'bg-emerald-500 shadow-[0_0_20px_#10b981]' : 'bg-orange-500'}`} 
                style={{ width: `${Math.min(state.heat, 100)}%` }}
              ></div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between text-[11px]">
              <span className="text-red-900/40 uppercase tracking-widest">Structural Integrity</span>
              <span className={`${state.integrity < 0.5 ? 'text-red-500 font-black' : 'text-emerald-400 font-black'}`}>{Math.round(state.integrity * 100)}%</span>
            </div>
            <div className="w-full h-2.5 bg-red-950/40 rounded-full overflow-hidden border border-red-900/10">
              <div 
                className={`h-full bg-emerald-500 transition-all duration-500 ${activeAction === 'strike' ? 'brightness-150 scale-y-125' : ''}`} 
                style={{ width: `${Math.min(state.integrity * 100, 100)}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-black/80 border border-red-900/20 rounded-3xl p-6 h-40 overflow-hidden relative shadow-inner">
             <div className="absolute top-3 right-4 text-[8px] text-red-900/30 uppercase tracking-[0.3em] font-black z-10 flex items-center gap-2">
               {state.infinityMode && <Wand2 size={10} className="text-purple-500 animate-pulse" />}
               Logic_Stream_Buffer
             </div>
             <div className="text-[11px] text-orange-400/80 italic leading-relaxed font-mono whitespace-pre-wrap">
               {state.draftCode || "// Awaiting strike sequence..."}
             </div>
             {state.isProcessing && (
               <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-20">
                  <div className="flex flex-col items-center gap-3">
                     <Binary className="text-[#E0115F] animate-spin" size={32} />
                     <span className="text-[9px] font-black text-white uppercase tracking-[0.5em] animate-pulse">Processing_VECTORS</span>
                  </div>
               </div>
             )}
          </div>
        </div>

        <div className="flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            {isReady ? <CheckCircle2 size={18} className="text-emerald-500" /> : <ShieldAlert size={18} className="text-red-900/20" />}
            <p className={`text-[10px] font-black uppercase tracking-[0.3em] ${isReady ? 'text-emerald-500' : 'text-red-900/30'}`}>
              {isReady ? 'READY_FOR_DETACHMENT' : 'AWAITING_CRYSTALLIZATION'}
            </p>
          </div>
          <div className="flex gap-4">
            <span className="text-[10px] text-red-900/40 font-black uppercase">{state.strikes} IMPACTS</span>
            {state.infinityMode && <Zap size={12} className="text-purple-500 animate-pulse" />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HammerForge;
