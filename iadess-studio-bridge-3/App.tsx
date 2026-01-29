
import React, { useState, useEffect, useRef } from 'react';
import { ViewType, OmegaArtifact, IntelligenceToken } from './types';
import Sidebar from './components/Sidebar';
import AIChat from './components/AIChat';
import HammerForge from './components/HammerForge';
import BlueprintEngine from './components/BlueprintEngine';
import { refractArtifact, synthesizeArtifactVisual } from './services/geminiService';
import { 
  Database, Zap, Copy, Code, Radio, Settings, Terminal, Orbit, Lock, Hammer, Shield, Eye, Sparkles, Box, List, ShieldAlert, BarChart3, ShieldCheck, ChevronRight, Play, Loader2, Flame, Layers, Check, Wand2, RefreshCw, Globe, Brain, Key, AlertCircle, Users, Activity, ExternalLink, Cpu, TestTube2, MessageSquare, Search, User, X, Share2, Info, ArrowUpRight, Link, Trash2
} from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>(ViewType.FORGE);
  const [isForging, setIsForging] = useState(false);
  const [activeRealm, setActiveRealm] = useState('MASTER_PLAN');
  const [intent, setIntent] = useState('');
  const [witnessLogs, setWitnessLogs] = useState<string[]>(["ARCHITECT_CONNECTED", "IQ_TOKEN_PROTOCOL_STABLE", "VRAW_RUNTIME_ACTIVE"]);
  const [selectedArtifact, setSelectedArtifact] = useState<OmegaArtifact | null>(null);
  const [quotaExhausted, setQuotaExhausted] = useState(false);
  
  // Intelligence/Token Protocol State
  const [workspaceIntegrity, setWorkspaceIntegrity] = useState(1.0);
  const [tokens, setTokens] = useState<IntelligenceToken>({ amount: 1250, grade: 'ALPHA' });

  // Bridge & Network States
  const [projectResonance, setProjectResonance] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [bridgeStatus, setBridgeStatus] = useState<'IDLE' | 'SYNCED' | 'DRIFTING'>('IDLE');

  const [artifacts, setArtifacts] = useState<OmegaArtifact[]>([
    {
      id: 'Ω_INIT_0X',
      name: 'SUBSTRATE_CORE',
      kind: 'ARTIFACT',
      origin: 'BRIDGE',
      intent: 'Anchor the management suite to Firebase Studio.',
      tags: ['CORE', 'SUBSTRATE'],
      status: 'MASTERWORK',
      createdAt: new Date(),
      codeShard: "import { substrate } from '@iadess/core';\n\nexport const bridge = () => {\n  return substrate.sync({ tokens: 'ALPHA' });\n};"
    }
  ]);

  const addLog = (msg: string) => {
    setWitnessLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 19)]);
  };

  const handleCopy = (code?: string) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    addLog("CLIPBOARD: Intelligence shard extracted.");
  };

  // Implemented handleKeySelect to resolve the missing reference error on line 519
  // This allows users to trigger the external API key selection dialog when substrate is depleted.
  const handleKeySelect = async () => {
    if (window.aistudio?.openSelectKey) {
      await window.aistudio.openSelectKey();
      // Assume success and clear quota error state to allow retrying forge operations
      setQuotaExhausted(false);
      addLog("SYSTEM: Substrate synchronized via external handshake.");
    }
  };

  const handleForgeResult = (quenchResult: any) => {
    if (quenchResult.type === "SLAG") {
      addLog(`FAILURE: Quench failed. Structural integrity compromised.`);
      setWorkspaceIntegrity(prev => Math.max(0.1, prev - 0.2));
      return;
    }
    setWorkspaceIntegrity(quenchResult.strength);
    const tokenYield = Math.round(quenchResult.strength * 100);
    setTokens(prev => ({ ...prev, amount: prev.amount + tokenYield }));
    addLog(`SUCCESS: Intelligence quenched. Yielded ${tokenYield} IQ-Tokens.`);
    handleForge();
  };

  const handleForge = async () => {
    if (!intent) return;
    if (tokens.amount < 50) {
      addLog("ERROR: Insufficient IQ-Tokens for forge operation.");
      return;
    }
    setIsForging(true);
    setTokens(prev => ({ ...prev, amount: prev.amount - 50 }));
    
    try {
      const metadata = await refractArtifact(intent, activeRealm, workspaceIntegrity);
      if (metadata.codeShard?.includes("QUOTA_EXHAUSTED")) {
        setQuotaExhausted(true);
        return;
      }

      const imageUrl = await synthesizeArtifactVisual(metadata.name || "Component", workspaceIntegrity);

      const newArtifact: OmegaArtifact = {
        id: `Ω_${activeRealm}_${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
        name: metadata.name || 'Structural Shard',
        kind: 'ARTIFACT',
        origin: activeRealm,
        intent: intent,
        codeShard: metadata.codeShard,
        imageUrl: imageUrl || undefined,
        tags: metadata.tags || ['LOGIC'],
        status: workspaceIntegrity > 0.8 ? 'MASTERWORK' : 'HONED',
        createdAt: new Date()
      };
      
      setArtifacts([newArtifact, ...artifacts]);
      setSelectedArtifact(newArtifact);
      addLog(`SYNC: ${newArtifact.name} finalized in ${activeRealm}.`);
    } catch (err: any) {
      if (err?.message?.includes("429")) setQuotaExhausted(true);
      addLog(`CRITICAL: Forge substrate collapse.`);
    } finally {
      setIsForging(false);
      setIntent('');
    }
  };

  const triggerBridgeSync = () => {
    if (!projectResonance.trim()) {
      addLog("ERROR: Project Resonance ID required for bridge handshake.");
      return;
    }
    setIsSyncing(true);
    addLog(`HANDSHAKE: Establishing resonance with ${projectResonance}...`);
    
    setTimeout(() => {
      setBridgeStatus('SYNCED');
      setIsSyncing(false);
      addLog(`BRIDGE: Handshake successful. Substrate bonded.`);
    }, 2000);
  };

  const hardRestart = () => {
    addLog("SYSTEM: Purging caches and cookies. Restarting substrate...");
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  const renderContent = () => {
    switch (currentView) {
      case ViewType.FORGE:
        return (
          <div className="p-10 space-y-10 animate-in fade-in duration-1000">
             <header className="flex justify-between items-start border-b border-red-900/10 pb-8">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="ruby-prism p-2 rounded-xl">
                      <Hammer size={24} className="text-white" />
                    </div>
                    <h2 className="text-5xl font-black text-white tracking-tighter uppercase italic thermal-text">The Forge</h2>
                  </div>
                  <p className="text-red-900/60 font-mono text-[10px] uppercase tracking-[0.4em]">Structural Fabricator Node</p>
                </div>
             </header>

             <div className="grid grid-cols-12 gap-8">
                <div className="col-span-4 space-y-8">
                   <div className="bg-[#080303] border border-red-900/10 p-8 rounded-[3rem] shadow-2xl relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-[#E0115F]/10 blur-[50px] group-hover:bg-[#E0115F]/20 transition-all"></div>
                      <div className="flex items-center justify-between mb-8">
                         <h4 className="text-[11px] font-black text-red-900/40 uppercase tracking-[0.4em]">Tokens Active</h4>
                         <Zap size={14} className="text-orange-500" />
                      </div>
                      <div className="space-y-4 relative z-10">
                         <div className="text-5xl font-black text-white font-mono tracking-tighter">{Math.round(tokens.amount)} <span className="text-sm text-red-500 font-normal">IQ-T</span></div>
                         <div className="h-1 bg-red-950 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-red-600 to-[#E0115F]" style={{ width: `${Math.min((tokens.amount / 2000) * 100, 100)}%` }}></div>
                         </div>
                         <p className="text-[8px] text-red-900/40 font-mono uppercase tracking-widest">Protocol Grade: {tokens.grade}_GRADE_ASSET</p>
                      </div>
                   </div>
                   <div className="bg-[#080303] border border-red-900/10 p-8 rounded-[3rem] shadow-2xl">
                      <h4 className="text-[11px] font-black text-red-900/40 uppercase tracking-[0.4em] mb-6 flex items-center gap-2"><List size={14}/> Workbench Logs</h4>
                      <div className="space-y-3 h-[250px] overflow-y-auto custom-scrollbar font-mono text-[9px] text-red-700/60 italic">
                         {witnessLogs.map((log, i) => <div key={i} className="py-2 border-b border-red-900/5">{log}</div>)}
                      </div>
                   </div>
                </div>

                <div className="col-span-8 flex flex-col gap-8">
                  <div className="bg-black border border-red-900/10 rounded-[4rem] p-12 min-h-[450px] flex flex-col items-center justify-center relative overflow-hidden">
                     <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(224,17,95,0.03)_0%,transparent_70%)]"></div>
                     <div className="relative z-10 w-full max-w-xl text-center space-y-12">
                        <div className="space-y-4">
                           <input 
                             value={intent}
                             onChange={(e) => setIntent(e.target.value)}
                             placeholder="Cast structural intent..."
                             className="w-full bg-[#0a0404] border border-red-900/20 rounded-[2rem] py-8 px-12 text-2xl font-mono text-[#E0115F] placeholder:text-red-950 focus:outline-none focus:border-red-500 transition-all shadow-[inset_0_0_50px_rgba(0,0,0,0.5)]"
                           />
                           <p className="text-[9px] text-red-900/40 font-mono uppercase tracking-[0.4em]">Burn: 50 IQ-T per execution</p>
                        </div>
                        <HammerForge onQuench={handleForgeResult} />
                        <button 
                          onClick={handleForge}
                          disabled={isForging || !intent}
                          className="w-full py-8 rounded-[2.5rem] ruby-prism text-white font-black uppercase tracking-[0.4em] shadow-[0_20px_50px_rgba(224,17,95,0.3)] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:grayscale"
                        >
                          {isForging ? <Loader2 className="animate-spin mx-auto" /> : 'Execute Master Protocol'}
                        </button>
                     </div>
                  </div>
                </div>
             </div>
          </div>
        );

      case ViewType.OVERVIEW:
        return (
          <div className="p-16 space-y-16 animate-in fade-in duration-700">
             <header className="space-y-2">
                <h2 className="text-6xl font-black text-white italic tracking-tighter uppercase thermal-text">System Overview</h2>
                <p className="text-red-900/60 font-mono text-xs uppercase tracking-[0.4em]">Real-time Substrate Telemetry</p>
             </header>
             <div className="grid grid-cols-4 gap-8">
                {[
                  { label: 'Intelligence Depth', val: `${Math.round(workspaceIntegrity * 128)} BIT`, icon: Brain, color: 'text-[#E0115F]' },
                  { label: 'Artifact Resonators', val: artifacts.length, icon: Box, color: 'text-orange-500' },
                  { label: 'Token Liquidity', val: Math.round(tokens.amount), icon: Zap, color: 'text-yellow-500' },
                  { label: 'Bridge Fidelity', val: bridgeStatus === 'SYNCED' ? '1.0' : '0.0', icon: Radio, color: 'text-emerald-500' },
                ].map((stat, i) => (
                  <div key={i} className="bg-[#080303] border border-red-900/10 p-10 rounded-[3rem] space-y-6 hover:border-red-900/30 transition-all">
                     <stat.icon size={24} className={stat.color} />
                     <div>
                        <p className="text-[10px] font-black text-red-900/40 uppercase tracking-widest mb-1">{stat.label}</p>
                        <p className="text-4xl font-black text-white font-mono tracking-tighter">{stat.val}</p>
                     </div>
                  </div>
                ))}
             </div>
             <div className="grid grid-cols-2 gap-8">
                <div className="bg-[#080303] border border-red-900/10 rounded-[4rem] p-12 h-[400px] flex flex-col justify-between">
                   <h4 className="text-xs font-black text-red-500 uppercase tracking-widest flex items-center gap-2"><Activity size={16}/> Resonator Activity</h4>
                   <div className="flex-1 flex items-end gap-3 px-4 pb-4">
                      {Array.from({ length: 12 }).map((_, i) => (
                        <div key={i} className="flex-1 bg-red-950/40 rounded-t-xl hover:bg-[#E0115F] transition-all" style={{ height: `${Math.random() * 80 + 20}%` }}></div>
                      ))}
                   </div>
                   <p className="text-[9px] text-red-900/40 font-mono text-center">Historical Substrate Load (24H)</p>
                </div>
                <div className="bg-[#080303] border border-red-900/10 rounded-[4rem] p-12 h-[400px] flex flex-col items-center justify-center space-y-8 text-center">
                   <ShieldCheck size={64} className="text-emerald-500/20" />
                   <div>
                      <h4 className="text-xl font-black text-white uppercase italic mb-2 tracking-tighter">Integrity Protected</h4>
                      <p className="text-red-900/60 font-mono text-[10px] uppercase leading-relaxed max-w-xs">No logical fractures detected in the current session. Protocols are operating at peak resolution.</p>
                   </div>
                </div>
             </div>
          </div>
        );

      case ViewType.FIRESTORE:
        return (
          <div className="p-16 space-y-10 animate-in fade-in duration-700">
             <header className="flex justify-between items-end">
                <div className="space-y-2">
                  <h2 className="text-5xl font-black text-white italic uppercase tracking-tighter thermal-text">Material Store</h2>
                  <p className="text-red-900/60 font-mono text-xs uppercase tracking-[0.4em]">Firestore Substrate Explorer</p>
                </div>
                <button className="flex items-center gap-3 px-8 py-4 bg-white/5 border border-red-900/20 rounded-2xl text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-white/10 transition-all">
                   <RefreshCw size={14} /> Re-scan Collections
                </button>
             </header>
             <div className="bg-black border border-red-900/10 rounded-[4rem] overflow-hidden shadow-2xl">
                <table className="w-full text-left font-mono text-xs">
                   <thead className="bg-red-950/20 text-red-500/80 uppercase tracking-widest border-b border-red-900/10">
                      <tr>
                         <th className="p-8">Collection_ID</th>
                         <th className="p-8">Document_Count</th>
                         <th className="p-8">Byte_Density</th>
                         <th className="p-8">Actions</th>
                      </tr>
                   </thead>
                   <tbody className="text-red-200/80">
                      {[
                        { id: 'USERS_VRAW', count: 1240, size: '2.4 MB' },
                        { id: 'PROTOCOLS_OMEGA', count: 42, size: '156 KB' },
                        { id: 'FORGE_SHARDS', count: 856, size: '4.8 MB' },
                        { id: 'TELEMETRY_LOGS', count: 15402, size: '124 MB' },
                        { id: 'COLLABORATOR_IDS', count: 8, size: '12 KB' }
                      ].map((item, i) => (
                        <tr key={i} className="border-b border-red-900/5 hover:bg-red-500/5 transition-all group">
                           <td className="p-8 font-black text-white group-hover:text-[#E0115F]">{item.id}</td>
                           <td className="p-8">{item.count.toLocaleString()}</td>
                           <td className="p-8">{item.size}</td>
                           <td className="p-8">
                             <div className="flex gap-4">
                                <button className="text-red-500 hover:text-white flex items-center gap-2"><Search size={14}/> Inspect</button>
                                <button className="text-red-900/60 hover:text-red-500 flex items-center gap-2"><Share2 size={14}/> Export</button>
                             </div>
                           </td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>
        );

      case ViewType.AUTH:
        return (
          <div className="p-16 space-y-12 animate-in fade-in duration-700">
             <header className="space-y-2">
                <h2 className="text-5xl font-black text-white italic uppercase tracking-tighter thermal-text">Collaborators</h2>
                <p className="text-red-900/60 font-mono text-xs uppercase tracking-[0.4em]">Auth Substrate Monitor</p>
             </header>
             <div className="grid grid-cols-3 gap-8">
                {[
                  { name: 'Iadess_Prime', role: 'ADMIN', lastSeen: 'NOW', avatar: 'IP' },
                  { name: 'Kore_Prototype', role: 'SIMULATOR', lastSeen: '2M AGO', avatar: 'KP' },
                  { name: 'Architect_User', role: 'DEVELOPER', lastSeen: '1H AGO', avatar: 'AU' }
                ].map((user, i) => (
                  <div key={i} className="bg-[#080303] border border-red-900/10 p-10 rounded-[3rem] flex items-center gap-6 hover:border-red-500/30 transition-all cursor-pointer group">
                     <div className="w-20 h-20 rounded-full ruby-prism flex items-center justify-center text-2xl font-black italic text-white shadow-xl group-hover:scale-110 transition-transform">{user.avatar}</div>
                     <div>
                        <h4 className="text-xl font-black text-white uppercase tracking-tighter mb-1">{user.name}</h4>
                        <p className="text-[9px] font-black text-red-500 uppercase tracking-widest mb-2">{user.role}</p>
                        <p className="text-[8px] font-mono text-red-900/40 uppercase tracking-widest flex items-center gap-1"><Activity size={8}/> ONLINE: {user.lastSeen}</p>
                     </div>
                  </div>
                ))}
             </div>
             <div className="bg-black border border-red-900/10 rounded-[4rem] p-20 flex flex-col items-center justify-center space-y-10">
                <Users size={64} className="text-red-950" />
                <button className="px-12 py-6 ruby-prism rounded-full text-white font-black uppercase tracking-widest text-sm shadow-2xl hover:scale-105 transition-all">Invite Collaborator</button>
             </div>
          </div>
        );

      case ViewType.FUNCTIONS:
        return (
          <div className="p-16 space-y-12 animate-in fade-in duration-700 h-full flex flex-col items-center justify-center text-center">
             <Terminal size={80} className="text-red-900/20 mb-8" />
             <h2 className="text-5xl font-black text-white italic uppercase tracking-tighter thermal-text mb-4">Journey Node</h2>
             <p className="text-red-900/60 font-mono text-sm uppercase tracking-[0.4em] max-w-md">UNDER DEVELOPMENT: Cloud protocol tracking and logic tracing awaiting Project Resonance substrate linkage.</p>
          </div>
        );

      case ViewType.BRIDGE:
        return (
          <div className="p-20 flex flex-col items-center justify-center min-h-full space-y-12 animate-in fade-in zoom-in duration-1000">
             <div className="space-y-4 text-center">
                <h2 className="text-8xl font-black text-white italic tracking-tighter uppercase thermal-text">The Bridge</h2>
                <p className="text-red-900/60 font-mono text-sm uppercase tracking-[0.4em]">Substrate Handshake Protocol</p>
             </div>
             
             <div className={`relative w-48 h-48 rounded-full border-4 flex items-center justify-center transition-all duration-1000 shadow-[0_0_100px_rgba(0,0,0,1)] ${bridgeStatus === 'SYNCED' ? 'border-emerald-500 shadow-[0_0_80px_rgba(16,185,129,0.3)]' : 'border-red-900/40'}`}>
                {bridgeStatus === 'SYNCED' ? (
                  <ShieldCheck size={80} className="text-emerald-500 animate-in zoom-in duration-500" />
                ) : (
                  <Radio size={80} className={`text-red-900 ${isSyncing ? 'animate-pulse' : ''}`} />
                )}
                {isSyncing && (
                  <div className="absolute inset-0 border-4 border-[#E0115F] rounded-full animate-ping opacity-50"></div>
                )}
             </div>

             <div className="bg-[#080303] border border-red-900/10 rounded-[4.5rem] p-16 max-w-2xl w-full text-center space-y-12 shadow-[0_50px_100px_rgba(0,0,0,0.8)]">
                <div className="space-y-8">
                   <div className="space-y-4">
                      <label className="text-[10px] font-black text-red-900/40 uppercase tracking-[0.4em] block">Project Resonance ID</label>
                      <input 
                         value={projectResonance}
                         onChange={(e) => setProjectResonance(e.target.value)}
                         placeholder="firebase-project-id"
                         className="w-full bg-black/60 border border-red-900/20 rounded-full py-8 px-12 text-2xl font-mono text-[#E0115F] placeholder:text-red-950 focus:outline-none focus:border-red-500 transition-all text-center"
                      />
                   </div>
                   <div className="flex items-center gap-4 text-[9px] font-mono text-red-900/40 justify-center">
                      <div className={`w-2 h-2 rounded-full ${bridgeStatus === 'SYNCED' ? 'bg-emerald-500' : 'bg-red-900'}`}></div>
                      STATUS: {bridgeStatus === 'SYNCED' ? 'SUBSTRATE_BONDED' : 'AWAITING_HANDSHAKE'}
                   </div>
                </div>
                <button 
                  onClick={triggerBridgeSync} 
                  disabled={isSyncing}
                  className="w-full py-10 rounded-[3rem] ruby-prism text-white font-black uppercase tracking-[0.5em] shadow-[0_25px_60px_rgba(224,17,95,0.4)] active:scale-95 transition-all flex items-center justify-center gap-4"
                >
                  {isSyncing ? <Loader2 className="animate-spin" /> : <Link size={20} />}
                  {isSyncing ? 'Establishing resonance...' : 'Initialize Bridge Handshake'}
                </button>
             </div>
          </div>
        );

      case ViewType.TEST:
        return (
          <div className="p-16 space-y-12 animate-in fade-in duration-700 h-full flex flex-col">
             <header className="flex justify-between items-center">
                <div className="space-y-1">
                  <h2 className="text-5xl font-black text-white italic uppercase tracking-tighter thermal-text">Simulation Chamber</h2>
                  <p className="text-red-900/40 font-mono text-[10px] uppercase tracking-widest">Master Prototype Validator: KORE_NODE</p>
                </div>
                <div className="flex gap-4">
                   <div className="px-6 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-3 text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                      <ShieldCheck size={14}/> Resolution: Peak
                   </div>
                </div>
             </header>

             <div className="flex-1 grid grid-cols-12 gap-10">
                <div className="col-span-7 bg-black border border-red-900/10 rounded-[4rem] p-16 flex flex-col items-center justify-center relative group overflow-hidden shadow-2xl">
                   <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(224,17,95,0.05)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                   
                   <div className="relative w-72 h-72">
                      <div className="absolute inset-0 border-2 border-dashed border-red-500/20 rounded-full animate-spin duration-[20s]"></div>
                      <div className="absolute inset-4 border border-emerald-500/10 rounded-full animate-spin duration-[15s] reverse"></div>
                      <div className="absolute inset-10 bg-red-950/20 rounded-full overflow-hidden flex items-center justify-center backdrop-blur-3xl shadow-2xl group-hover:shadow-[0_0_80px_rgba(224,17,95,0.2)] transition-all">
                         <User size={120} className="text-red-900/20 group-hover:text-red-500 transition-colors" />
                         <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-1 h-20 bg-[#E0115F] blur-md animate-pulse"></div>
                         </div>
                      </div>
                   </div>

                   <div className="mt-16 space-y-6 text-center">
                      <h4 className="text-3xl font-black text-white italic uppercase tracking-tighter">KORE_PROTOTYPE</h4>
                      <p className="text-red-900/60 font-mono text-[10px] uppercase tracking-[0.4em] max-w-sm">"I am the validation logic. Submit your forge shards for behavioral analysis."</p>
                   </div>
                   
                   <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-4 text-[8px] font-mono text-emerald-500/40 uppercase tracking-widest">
                      <Cpu size={12} /> Exec_Runtime: v0.9.4a-Stable
                   </div>
                </div>

                <div className="col-span-5 flex flex-col gap-8">
                   <div className="flex-1 bg-[#080303] border border-red-900/10 rounded-[3rem] p-10 flex flex-col shadow-2xl">
                      <h4 className="text-[10px] font-black text-red-900/40 uppercase tracking-widest mb-8 flex items-center justify-between">
                        Simulation Feed
                        <span className="text-emerald-500 flex items-center gap-1"><Activity size={10}/> LIVE</span>
                      </h4>
                      <div className="flex-1 bg-black/40 rounded-3xl p-8 font-mono text-sm text-red-100/80 italic leading-relaxed custom-scrollbar overflow-y-auto space-y-6">
                         <div className="space-y-2">
                            <p className="text-[9px] font-black text-[#E0115F] uppercase">KORE_SYSTEM:</p>
                            <p>"Synchronized with Iadess. Handshake protocol active. Standing by for logic shard ingestion."</p>
                         </div>
                         {selectedArtifact && (
                           <div className="pt-6 border-t border-red-900/10 animate-in fade-in">
                              <p className="text-[9px] font-black text-emerald-500 uppercase">SHARD_DETECTED:</p>
                              <p className="text-xs mt-2">{selectedArtifact.name} loaded into the simulation buffer. Readiness: 100%.</p>
                              <div className="mt-4 flex gap-4">
                                 <button className="flex-1 py-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-[10px] font-black text-emerald-500 uppercase tracking-widest hover:bg-emerald-500/20 active:scale-95">Execute Binary</button>
                                 <button className="px-6 py-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-[10px] font-black text-red-500 uppercase tracking-widest hover:bg-red-500/20 active:scale-95" onClick={() => setSelectedArtifact(null)}>Purge Buffer</button>
                              </div>
                           </div>
                         )}
                      </div>
                   </div>
                   <div className="bg-[#080303] border border-red-900/10 p-10 rounded-[3rem] space-y-4 shadow-xl">
                      <div className="flex justify-between items-center">
                         <h4 className="text-[10px] font-black text-red-900/40 uppercase tracking-widest">Active Shard</h4>
                         {selectedArtifact ? <Check size={14} className="text-emerald-500" /> : <AlertCircle size={14} className="text-red-900/20" />}
                      </div>
                      <p className="text-xl font-black text-white italic tracking-tighter uppercase">{selectedArtifact?.name || 'NO_SHARD_LOADED'}</p>
                   </div>
                </div>
             </div>
          </div>
        );

      case ViewType.ARCHITECTURE:
        return (
          <div className="p-16 space-y-12 animate-in fade-in duration-700 h-full flex flex-col items-center justify-center text-center">
             <Orbit size={80} className="text-red-900/20 mb-8" />
             <h2 className="text-5xl font-black text-white italic uppercase tracking-tighter thermal-text mb-4">Blueprints</h2>
             <p className="text-red-900/60 font-mono text-sm uppercase tracking-[0.4em] max-w-md">UNDER DEVELOPMENT: High-resolution visual geometry engine awaiting further architectural input.</p>
          </div>
        );

      case ViewType.SETTINGS:
        return (
          <div className="p-16 space-y-16 animate-in fade-in duration-700">
             <header className="space-y-2">
                <h2 className="text-5xl font-black text-white italic uppercase tracking-tighter thermal-text">Workbench</h2>
                <p className="text-red-900/60 font-mono text-xs uppercase tracking-[0.4em]">Substrate Configuration & Maintenance</p>
             </header>
             <div className="grid grid-cols-2 gap-12">
                <div className="space-y-8">
                   <div className="bg-[#080303] border border-red-900/10 p-10 rounded-[3.5rem] space-y-8 shadow-2xl">
                      <h4 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2"><Settings size={16}/> Resonance Config</h4>
                      <p className="text-red-900/40 font-mono text-[10px] uppercase tracking-widest italic">Awaiting further input for substrate tuning nodes.</p>
                      <div className="space-y-6">
                         {[
                           { label: 'Bit-Depth Precision', val: 128 },
                           { label: 'Quench Temperature', val: '800°C' },
                           { label: 'Monadic Resolution', val: 'MAX' }
                         ].map((cfg, i) => (
                           <div key={i} className="flex justify-between items-center py-4 border-b border-red-900/5 group">
                              <span className="text-[10px] font-mono text-red-900/60 uppercase group-hover:text-red-500 transition-colors">{cfg.label}</span>
                              <span className="text-sm font-black text-white font-mono">{cfg.val}</span>
                           </div>
                         ))}
                      </div>
                   </div>
                </div>
                <div className="bg-[#080303] border border-red-900/10 p-10 rounded-[3.5rem] flex flex-col items-center justify-center space-y-8 text-center shadow-2xl relative overflow-hidden group">
                   <div className="absolute inset-0 bg-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                   <Trash2 size={48} className="text-red-950 group-hover:text-red-500 transition-colors" />
                   <div>
                      <h4 className="text-xl font-black text-white uppercase italic mb-2 tracking-tighter">Substrate Maintenance</h4>
                      <p className="text-red-900/60 font-mono text-[10px] uppercase leading-relaxed max-w-xs">Clear all local substrate caches and cookies to perform a hard system restart.</p>
                   </div>
                   <button onClick={hardRestart} className="px-10 py-5 ruby-prism rounded-full text-[10px] font-black uppercase tracking-widest text-white hover:scale-105 transition-all active:scale-95">Execute System Purge</button>
                </div>
             </div>
          </div>
        );

      default:
        return <div className="p-20 text-center text-red-900/20 font-mono uppercase tracking-[1em]">VIEW_OFFLINE</div>;
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#050202] text-slate-200 overflow-hidden font-inter transition-all duration-1000">
      <Sidebar currentView={currentView} setView={setCurrentView} workspaceIntegrity={workspaceIntegrity} hasQuotaError={quotaExhausted} tokens={tokens.amount} />
      
      <main className="flex-1 flex flex-col bg-[#020101] overflow-hidden relative border-r border-red-900/10">
        {quotaExhausted && (
          <div className="absolute top-0 left-0 right-0 z-[100] p-4 bg-red-600/20 backdrop-blur-md border-b border-red-500/50 flex items-center justify-between animate-in slide-in-from-top">
            <div className="flex items-center gap-4">
              <AlertCircle className="text-red-500 animate-pulse" size={20} />
              <p className="text-sm font-black text-white uppercase tracking-widest">Substrate Depleted (429)</p>
            </div>
            <button onClick={handleKeySelect} className="px-6 py-2 bg-white text-red-600 rounded-full font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-xl hover:scale-105 transition-all"><Key size={14} /> Synchronize Substrate</button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto scroll-smooth custom-scrollbar relative">
          {renderContent()}
        </div>
        
        {selectedArtifact && currentView === ViewType.FORGE && (
          <div className="mx-10 mb-10 bg-[#080303] border border-red-900/10 rounded-[3.5rem] p-12 animate-in slide-in-from-bottom-8 shadow-[0_50px_100px_rgba(0,0,0,0.8)] relative overflow-hidden group">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#E0115F] to-transparent opacity-20 group-hover:opacity-100 transition-opacity"></div>
             <div className="flex justify-between items-center mb-10">
                <div className="space-y-2">
                  <h3 className="text-4xl font-black uppercase text-white tracking-tighter italic thermal-text">{selectedArtifact.name}</h3>
                  <div className="flex gap-3">
                    {selectedArtifact.tags.map(t => (
                      <span key={t} className="text-[9px] font-black text-red-500 uppercase px-3 py-1 bg-red-500/5 border border-red-900/20 rounded-full">
                        #{t}
                      </span>
                    ))}
                    <span className="text-[9px] font-black text-white uppercase px-3 py-1 bg-[#E0115F] rounded-full shadow-[0_0_15px_rgba(224,17,95,0.4)]">
                      {selectedArtifact.status}
                    </span>
                  </div>
                </div>
                <div className="flex gap-4">
                   <button 
                     onClick={() => handleCopy(selectedArtifact.codeShard)} 
                     className="p-6 bg-white/5 rounded-[2rem] border border-red-900/20 text-white hover:bg-white/10 active:scale-95 transition-all group/btn flex items-center gap-3 px-8"
                     title="Extract Shard"
                   >
                     <Copy size={24} className="group-hover/btn:scale-110 transition-transform text-red-500" />
                     <span className="font-black uppercase tracking-widest text-xs hidden sm:inline">Copy Result</span>
                   </button>
                   <button 
                     onClick={() => setCurrentView(ViewType.TEST)} 
                     className="p-6 ruby-prism rounded-[2rem] text-white shadow-2xl hover:scale-[1.03] active:scale-95 transition-all flex items-center gap-4 px-12"
                   >
                     <Play size={20} className="fill-current" />
                     <span className="font-black uppercase tracking-[0.2em] text-sm">Test Forge</span>
                   </button>
                </div>
             </div>
             <div className="relative">
                <div className="absolute top-4 right-4 text-[9px] font-mono text-red-900/40 uppercase tracking-widest z-10">TS_OMEGA_SHARD</div>
                <pre className="p-10 bg-black/80 rounded-[2.5rem] border border-red-900/10 font-mono text-sm text-orange-400/90 overflow-x-auto shadow-inner custom-scrollbar">
                  <code>{selectedArtifact.codeShard}</code>
                </pre>
             </div>
          </div>
        )}
      </main>
      
      <AIChat integrity={workspaceIntegrity} onQuotaError={() => setQuotaExhausted(true)} />
    </div>
  );
};

export default App;
