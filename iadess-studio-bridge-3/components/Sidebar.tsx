
import React, { useState, useEffect } from 'react';
import { ViewType } from '../types';
import { 
  LayoutDashboard, Database, Users, Terminal, Settings, Radio, Orbit, Hammer, Shield, Key, Lock, AlertTriangle, Brain, Zap, TestTube2
} from 'lucide-react';

interface SidebarProps {
  currentView: ViewType;
  setView: (view: ViewType) => void;
  workspaceIntegrity?: number;
  hasQuotaError?: boolean;
  tokens?: number;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, workspaceIntegrity = 1.0, hasQuotaError = false, tokens = 0 }) => {
  const [hasKey, setHasKey] = useState(false);

  useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio?.hasSelectedApiKey) {
        const selected = await window.aistudio.hasSelectedApiKey();
        setHasKey(selected);
      }
    };
    checkKey();
    const interval = setInterval(checkKey, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleKeySelect = async () => {
    if (window.aistudio?.openSelectKey) {
      await window.aistudio.openSelectKey();
      setHasKey(true);
    }
  };

  const navItems = [
    { id: ViewType.OVERVIEW, icon: LayoutDashboard, label: 'Overview' },
    { id: ViewType.FORGE, icon: Hammer, label: 'The Forge' },
    { id: ViewType.TEST, icon: TestTube2, label: 'Simulation' },
    { id: ViewType.FIRESTORE, icon: Database, label: 'Material' },
    { id: ViewType.AUTH, icon: Users, label: 'Collaborators' },
    { id: ViewType.FUNCTIONS, icon: Terminal, label: 'Joinery' },
    { id: ViewType.BRIDGE, icon: Radio, label: 'Bridge' },
    { id: ViewType.ARCHITECTURE, icon: Orbit, label: 'Architecture' },
    { id: ViewType.SETTINGS, icon: Settings, label: 'Workbench' },
  ];

  return (
    <div className="w-72 bg-[#050202] border-r border-red-900/20 flex flex-col hidden lg:flex shadow-[20px_0_50px_rgba(0,0,0,0.5)] z-50">
      <div className="p-10 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="ruby-prism p-3 rounded-2xl shadow-[0_0_25px_rgba(224,17,95,0.4)]">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="font-black text-white text-xl tracking-tighter italic uppercase">Iadess</h1>
              <p className="text-[9px] text-[#E0115F] font-mono font-black uppercase tracking-[0.3em]">Protocol active</p>
            </div>
          </div>
          <button 
            onClick={handleKeySelect}
            className={`p-2 rounded-xl border transition-all ${
              hasQuotaError 
                ? 'bg-red-500 text-white animate-bounce' 
                : hasKey 
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-500' 
                  : 'bg-red-500/10 border-red-500/40 text-red-500 animate-pulse'
            }`}
          >
            {hasQuotaError ? <AlertTriangle size={16} /> : hasKey ? <Lock size={16} /> : <Key size={16} />}
          </button>
        </div>
        
        <div className="bg-red-950/20 p-4 rounded-2xl border border-red-900/20 space-y-3">
           <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-widest">
              <span className="text-red-500/60 flex items-center gap-2"><Zap size={10} /> Intelligence Tokens</span>
              <span className="text-white">{Math.round(tokens)}</span>
           </div>
           <div className="h-0.5 bg-red-900/40 rounded-full overflow-hidden">
              <div className="h-full bg-[#E0115F]" style={{ width: `${Math.min((tokens / 2000) * 100, 100)}%` }}></div>
           </div>
        </div>
      </div>

      <nav className="flex-1 px-6 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-[1.5rem] transition-all group ${
              currentView === item.id ? 'bg-[#E0115F] text-white' : 'text-red-900/40 hover:text-red-500'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-8">
        <div className="bg-red-950/10 rounded-[2rem] p-6 border border-red-900/10">
           <p className="text-[9px] font-black text-red-700 uppercase tracking-widest mb-4 flex justify-between">
            Integrity Status
            <span className={workspaceIntegrity < 0.4 ? 'text-red-500 animate-pulse' : 'text-[#FF4D00]'}>
              {workspaceIntegrity < 0.4 ? 'FRACTURED' : 'CRYSTALLINE'}
            </span>
           </p>
           <div className="grid grid-cols-8 gap-1">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className={`h-1 rounded-full ${i < workspaceIntegrity * 8 ? 'bg-[#FF4D00]' : 'bg-red-950'}`}></div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
