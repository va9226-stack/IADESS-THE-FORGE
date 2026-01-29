
import React, { useState, useEffect } from 'react';
import { Hammer, Flame, Droplets, Zap, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface ForgeState {
  heat: number;
  strikes: number;
  integrity: number;
  flaws: string[];
  infinityMode: boolean;
}

const HammerForge: React.FC<{ onQuench: (result: any) => void }> = ({ onQuench }) => {
  const [state, setState] = useState<ForgeState>({
    heat: 0,
    strikes: 0,
    integrity: 1.0,
    flaws: [],
    infinityMode: false,
  });

  const [activeAction, setActiveAction] = useState<string | null>(null);

  const triggerAction = (action: string, fn: () => void) => {
    setActiveAction(action);
    fn();
    // 200ms momentary visual feedback
    setTimeout(() => setActiveAction(null), 200);
  };

  const applyHeat = () => {
    triggerAction('heat', () => {
      setState(prev => {
        const nextHeat = prev.heat + 10;
        const nextFlaws = [...prev.flaws];
        let nextIntegrity = prev.integrity;
        
        if (nextHeat > 100) {
          nextIntegrity -= 0.05;
          if (!nextFlaws.includes("overheated")) nextFlaws.push("overheated");
        }
        
        return { ...prev, heat: nextHeat, integrity: Math.max(0, nextIntegrity), flaws: nextFlaws };
      });
    });
  };

  const strike = () => {
    triggerAction('strike', () => {
      setState(prev => {
        const nextStrikes = prev.strikes + 1;
        const nextFlaws = [...prev.flaws];
        let nextIntegrity = prev.integrity;

        if (nextStrikes > 50 && !prev.infinityMode) {
          nextIntegrity -= 0.02;
          if (!nextFlaws.includes("overworked")) nextFlaws.push("overworked");
        }

        return { ...prev, strikes: nextStrikes, integrity: Math.max(0, nextIntegrity), flaws: nextFlaws };
      });
    });
  };

  const toggleInfinity = () => {
    setState(prev => ({
      ...prev,
      infinityMode: !prev.infinityMode,
      integrity: 1.0,
      flaws: prev.flaws.filter(f => f !== "overworked")
    }));
  };

  const isReady = state.heat >= 40 && state.heat <= 80 && state.strikes >= 7 && state.integrity >= 0.7;

  const handleQuench = () => {
    if (!isReady) {
      onQuench({ type: "SLAG", quality: "POOR", stats: state });
    } else {
      onQuench({
        type: "MASTER_FORGE",
        quality: "EXQUISITE",
        strength: state.integrity,
        scars: state.flaws,
        strikes: state.strikes,
        heat_signature: state.heat
      });
    }
    setState({ heat: 0, strikes: 0, integrity: 1.0, flaws: [], infinityMode: false });
  };

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 bg-black/40 p-8 rounded-[3rem] border transition-all duration-300 ${
      activeAction === 'heat' ? 'border-orange-500 shadow-[inset_0_0_40px_rgba(255,120,0,0.15)]' : 
      activeAction === 'strike' ? 'border-red-500 shadow-[inset_0_0_50px_rgba(255,0,0,0.2)]' : 
      'border-red-900/10'
    } backdrop-blur-md`}>
      <div className="space-y-4">
        <h3 className="text-[10px] font-black text-red-700 uppercase tracking-[0.4em] mb-4 flex items-center gap-2">
          <Hammer size={12} className={activeAction === 'strike' ? 'animate-bounce' : ''} /> Forge Controls
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={applyHeat} 
            className={`flex flex-col items-center justify-center p-6 rounded-[2rem] border transition-all duration-150 relative overflow-hidden ${
              activeAction === 'heat' ? 'bg-orange-500 text-white border-orange-400 scale-[0.96]' : 'bg-orange-500/10 border-orange-500/20 text-orange-500 hover:bg-orange-500/20'
            }`}
          >
            <Flame className={`mb-2 transition-transform ${activeAction === 'heat' ? 'scale-125' : ''}`} />
            <span className="text-[9px] font-black uppercase tracking-widest">Apply Heat</span>
          </button>
          <button 
            onClick={strike} 
            className={`flex flex-col items-center justify-center p-6 rounded-[2rem] border transition-all duration-150 relative overflow-hidden ${
              activeAction === 'strike' ? 'bg-red-500 text-white border-red-400 scale-[0.96]' : 'bg-red-500/10 border-red-500/20 text-red-500 hover:bg-red-500/20'
            }`}
          >
            <Hammer className={`mb-2 transition-transform ${activeAction === 'strike' ? 'rotate-45 scale-125' : ''}`} />
            <span className="text-[9px] font-black uppercase tracking-widest">Strike</span>
          </button>
          <button onClick={toggleInfinity} className={`flex flex-col items-center justify-center p-6 rounded-[2rem] border transition-all active:scale-95 ${state.infinityMode ? 'bg-purple-500/20 border-purple-500/40 text-purple-400' : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'}`}>
            <Zap className={`mb-2 ${state.infinityMode ? 'animate-pulse' : ''}`} />
            <span className="text-[9px] font-black uppercase tracking-widest">Infinity</span>
          </button>
          <button onClick={handleQuench} className={`flex flex-col items-center justify-center p-6 rounded-[2rem] border transition-all active:scale-95 ${isReady ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400 hover:brightness-125 shadow-lg' : 'bg-white/5 border-white/10 text-white/20 cursor-not-allowed'}`}>
            <Droplets className={`mb-2 ${isReady ? 'animate-bounce' : ''}`} />
            <span className="text-[9px] font-black uppercase tracking-widest">Quench</span>
          </button>
        </div>
      </div>

      <div className="space-y-4 font-mono">
        <h3 className="text-[10px] font-black text-red-700 uppercase tracking-[0.4em] mb-4">Live Telemetry</h3>
        <div className="space-y-4 bg-black/60 p-6 rounded-[2.5rem] border border-red-900/10 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none transition-opacity duration-1000" style={{ 
            background: `radial-gradient(circle at center, rgba(255,100,0,${Math.min(state.heat / 200, 0.2)}) 0%, transparent 70%)` 
          }}></div>

          <div className={`${activeAction === 'heat' ? 'animate-pulse' : ''}`}>
            <div className="flex justify-between text-[11px] mb-2">
              <span className="text-red-900/60 uppercase">Heat Signature</span>
              <span className={`${state.heat > 80 ? 'text-orange-500 font-black' : 'text-red-400'}`}>{state.heat}°C</span>
            </div>
            <div className="w-full h-1.5 bg-red-950 rounded-full overflow-hidden">
              <div 
                className={`h-full bg-orange-500 transition-all duration-300 ${activeAction === 'heat' ? 'brightness-150' : ''}`} 
                style={{ width: `${Math.min(state.heat, 100)}%` }}
              ></div>
            </div>
          </div>

          <div className={`${activeAction === 'strike' ? 'animate-pulse' : ''}`}>
            <div className="flex justify-between text-[11px] mb-2">
              <span className="text-red-900/60 uppercase">Structural Integrity</span>
              <span className={`${state.integrity < 0.4 ? 'text-red-500' : 'text-emerald-400'}`}>{Math.round(state.integrity * 100)}%</span>
            </div>
            <div className="w-full h-1.5 bg-red-950 rounded-full overflow-hidden">
              <div 
                className={`h-full bg-emerald-500 transition-all duration-300 ${activeAction === 'strike' ? 'brightness-150' : ''}`} 
                style={{ width: `${state.integrity * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="pt-4 border-t border-red-900/10 flex flex-wrap gap-2">
            <div className="flex items-center gap-2 mr-auto">
              {isReady ? <CheckCircle2 size={12} className="text-emerald-500" /> : <ShieldAlert size={12} className="text-red-900/40" />}
              <span className={`text-[9px] font-black uppercase tracking-widest ${isReady ? 'text-emerald-500 animate-pulse' : 'text-red-900/40'}`}>
                {isReady ? 'READY_FOR_QUENCH' : 'Tuning_Fabricator...'}
              </span>
            </div>
            <span className="text-[9px] text-red-950 uppercase font-black">{state.strikes} STRIKES</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HammerForge;
