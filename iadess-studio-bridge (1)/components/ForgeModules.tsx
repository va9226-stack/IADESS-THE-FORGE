import React from 'react';
import { Layers, Activity, Shield, Cpu, Zap, Radio, Terminal, Search } from 'lucide-react';
import { ForgeControls } from './ForgeControls';

// --- STUB COMPONENTS FOR DATA RESONANCE ---

export const ForgeCategoryGrid: React.FC<{ active: string[], onToggle: (id: string) => void }> = ({ active, onToggle }) => {
  const categories = ['PAGES', 'COMPONENTS', 'UI', 'ENTITIES', 'LAYOUT', 'FUNCTIONS', 'INDEX', 'SRC'];
  return (
    <div className="grid grid-cols-2 gap-3">
      {categories.map(cat => (
        <button
          key={cat}
          onClick={() => onToggle(cat)}
          className={`px-4 py-3 text-[10px] font-black uppercase tracking-widest border transition-all rounded-xl ${
            active.includes(cat) ? 'bg-red-500 border-red-400 text-white shadow-lg' : 'bg-black/40 border-red-900/20 text-red-900/40 hover:text-red-500'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

export const ForgeResultPane: React.FC<{ artifact: any; onCopy: () => void; onTest: () => void }> = ({ artifact, onCopy, onTest }) => {
  if (!artifact) return (
    <div className="h-full flex flex-col items-center justify-center opacity-20">
      <Cpu size={48} className="mb-4" />
      <span className="text-[10px] font-black uppercase tracking-[0.4em]">Awaiting_Projection</span>
    </div>
  );
  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h4 className="text-xl font-black text-white uppercase tracking-tighter">{artifact.name}</h4>
        <div className="flex gap-2">
          <button onClick={onCopy} className="p-3 bg-white/5 border border-white/10 rounded-xl text-red-500 hover:bg-white/10 transition-all"><Layers size={16} /></button>
          <button onClick={onTest} className="p-3 bg-white/5 border border-white/10 rounded-xl text-blue-500 hover:bg-white/10 transition-all"><Activity size={16} /></button>
        </div>
      </div>
      <div className="bg-black/60 rounded-2xl p-6 border border-white/5 h-64 overflow-y-auto custom-scrollbar">
        <pre className="text-xs text-orange-400 font-mono leading-relaxed">{artifact.codeShard}</pre>
      </div>
    </div>
  );
};

export const BridgeStatusPanel: React.FC<{ status: string }> = ({ status }) => (
  <div className="flex flex-col items-center gap-6">
    <div className={`w-32 h-32 rounded-full border-4 flex items-center justify-center transition-all duration-1000 ${
      status === 'SYNCING' ? 'border-blue-500 animate-spin border-t-transparent' : 
      status === 'SYNCED' ? 'border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.2)]' : 'border-zinc-800'
    }`}>
      <Radio className={status === 'SYNCED' ? 'text-emerald-500' : 'text-zinc-600'} size={40} />
    </div>
    <div className="text-center space-y-1">
      <h3 className="text-2xl font-black text-white tracking-tighter uppercase">{status}</h3>
      <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Handshake_Sequence_0x0A</p>
    </div>
  </div>
);

export const BridgeSyncPanel: React.FC<{ projectResonance: string; onResonanceChange: (val: string) => void; onSync: () => void }> = ({ projectResonance, onResonanceChange, onSync }) => (
  <div className="space-y-6">
    <div className="space-y-2">
      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Project Resonance Key</label>
      <input 
        type="text" 
        value={projectResonance} 
        onChange={(e) => onResonanceChange(e.target.value)}
        placeholder="vraw-id-shard-alpha..."
        className="w-full bg-black/40 border border-zinc-800 rounded-xl px-4 py-3 text-sm font-mono text-blue-400 focus:outline-none focus:border-blue-500 transition-all"
      />
    </div>
    <button 
      onClick={onSync}
      className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-blue-900/20"
    >
      Initialize_Sync_Protocol
    </button>
  </div>
);

export const SimulationRunner: React.FC<{ onRun: () => void }> = ({ onRun }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-2 gap-4">
      <div className="p-4 bg-black/40 border border-zinc-800 rounded-xl space-y-1">
        <span className="text-[9px] text-zinc-500 uppercase font-black">Iterations</span>
        <div className="text-xl font-mono text-white">10k</div>
      </div>
      <div className="p-4 bg-black/40 border border-zinc-800 rounded-xl space-y-1">
        <span className="text-[9px] text-zinc-500 uppercase font-black">Thread_Pool</span>
        <div className="text-xl font-mono text-white">OVP</div>
      </div>
    </div>
    <button 
      onClick={onRun}
      className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-3"
    >
      <Zap size={16} /> Run Simulation
    </button>
  </div>
);
