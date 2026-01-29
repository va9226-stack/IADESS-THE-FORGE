import React from "react";
import { 
  ForgeCategoryGrid, 
  ForgeResultPane, 
  BridgeStatusPanel, 
  BridgeSyncPanel, 
  SimulationRunner 
} from "../components/ForgeModules";
import { ForgeControls } from "../components/ForgeControls";
import { Activity, Cpu, Zap, Layers, Shield, Thermometer, ArrowUpRight, Hammer, Database, TestTube2, Radio, Orbit, Settings, LayoutDashboard } from "lucide-react";
import { ViewType } from "../types";

// --- UI: INTERFACE FABRIC ---

const TechBorder: React.FC<{ children: React.ReactNode; className?: string; label?: string }> = ({ children, className = "", label }) => (
  <div className={`relative group border border-zinc-800 bg-zinc-900/40 backdrop-blur-sm rounded-3xl ${className}`}>
    <div className="absolute -top-px -left-px w-3 h-3 border-t border-l border-zinc-500 rounded-tl-3xl" />
    <div className="absolute -top-px -right-px w-3 h-3 border-t border-r border-zinc-500 rounded-tr-3xl" />
    <div className="absolute -bottom-px -left-px w-3 h-3 border-b border-l border-zinc-500 rounded-bl-3xl" />
    <div className="absolute -bottom-px -right-px w-3 h-3 border-b border-r border-zinc-500 rounded-br-3xl" />
    
    {label && (
      <div className="absolute -top-3 left-6 bg-zinc-950 px-3 py-0.5 text-[9px] font-bold tracking-[0.2em] text-zinc-500 uppercase border border-zinc-800 rounded-full">
        {label}
      </div>
    )}
    {children}
  </div>
);

const MetricBadge: React.FC<{ label: string; value: string; color?: string; icon?: React.ReactNode }> = ({ label, value, color = "text-zinc-100", icon }) => (
  <div className="flex flex-col border-l border-zinc-800 pl-4 py-1">
    <span className="text-[9px] text-zinc-500 uppercase tracking-wider flex items-center gap-2">
      {icon && <span className="w-3 h-3 opacity-50">{icon}</span>}
      {label}
    </span>
    <span className={`font-mono text-sm font-bold ${color}`}>{value}</span>
  </div>
);

// --- LAYOUT: RESONANCE HUB (GLOBAL SHELL) ---

export const PageWrapper: React.FC<{ 
  children: React.ReactNode; 
  title: string; 
  protocol: string; 
  integrity: string; 
  heat: string;
  activeView: ViewType;
  onNavigate: (view: ViewType) => void;
  tokens: number;
}> = ({ children, title, protocol, integrity, heat, activeView, onNavigate, tokens }) => {
  const navItems = [
    { id: ViewType.OVERVIEW, icon: LayoutDashboard, label: 'Overview' },
    { id: ViewType.FORGE, icon: Hammer, label: 'The Forge' },
    { id: ViewType.TEST, icon: TestTube2, label: 'Simulation' },
    { id: ViewType.MATERIAL, icon: Database, label: 'Material' },
    { id: ViewType.BRIDGE, icon: Radio, label: 'Bridge' },
    { id: ViewType.BLUEPRINTS, icon: Orbit, label: 'Blueprints' },
    { id: ViewType.WORKBENCH, icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="h-full flex flex-col bg-zinc-950 text-zinc-200 font-mono selection:bg-orange-500/30 selection:text-orange-200 relative overflow-hidden rounded-[4rem] border border-zinc-900/20 shadow-2xl">
      {/* Background Grid Substrate */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_800px_at_50%_-200px,#18181b,transparent)]" />

      {/* Header / Global Command Deck */}
      <header className="relative z-10 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md px-10 pt-10 pb-4">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex justify-between items-start mb-10">
            <div className="space-y-1">
              <div className="flex items-center gap-3 text-[#E0115F]">
                <Shield size={16} className="animate-pulse" />
                <span className="text-[10px] font-black tracking-[0.3em] uppercase italic">Iadess_Forge_Shell_v2.5</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white uppercase flex items-center gap-4 italic">
                {title}
                <span className="text-zinc-800 text-2xl font-normal not-italic">/</span>
                <span className="text-zinc-600 text-lg font-normal tracking-normal not-italic">IQ-T: {tokens}</span>
              </h1>
            </div>
            
            {/* Telemetry Cluster */}
            <div className="flex gap-8 bg-black/40 p-5 border border-zinc-800/50 rounded-[2.5rem] shadow-inner">
              <MetricBadge label="PROTOCOL" value={protocol} icon={<Layers size={12} />} />
              <MetricBadge label="INTEGRITY" value={integrity} color="text-blue-400" icon={<Shield size={12} />} />
              <MetricBadge label="THERMAL" value={heat} color="text-orange-500" icon={<Thermometer size={12} />} />
            </div>
          </div>

          {/* Universal Navigation Tabs */}
          <nav className="flex gap-2 overflow-x-auto custom-scrollbar no-scrollbar">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-8 py-4 text-[10px] font-black tracking-[0.2em] uppercase border transition-all rounded-t-[2.5rem] border-b-0 flex items-center gap-3 whitespace-nowrap ${
                  activeView === item.id 
                    ? 'bg-zinc-900 text-white border-zinc-800 border-t-[#E0115F] shadow-[0_-10px_25px_rgba(224,17,95,0.05)] translate-y-px' 
                    : 'bg-zinc-950/30 text-zinc-600 border-transparent hover:text-zinc-300'
                }`}
              >
                <item.icon size={14} className={activeView === item.id ? 'text-[#E0115F]' : ''} />
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 overflow-y-auto p-10 custom-scrollbar">
        <div className="max-w-[1600px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

// --- PAGES: RE-USABLE MODULES ---

export const ForgeView: React.FC<{ 
  activeRealm: string; 
  onRealmChange: (r: string) => void;
  selectedArtifact: any;
  onCopy: () => void;
  forgeActions: any;
  defaultInput: React.ReactNode;
}> = ({ activeRealm, onRealmChange, selectedArtifact, onCopy, forgeActions, defaultInput }) => {
  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="grid grid-cols-12 gap-10">
        <aside className="col-span-12 lg:col-span-3 flex flex-col gap-10">
          <TechBorder label="REALM_PROTOCOLS" className="p-8 bg-zinc-900/20">
            <ForgeCategoryGrid active={[activeRealm]} onToggle={onRealmChange} />
          </TechBorder>
          
          <div className="p-8 border-l-4 border-[#E0115F] bg-[#E0115F]/5 text-[11px] text-zinc-400 font-mono leading-relaxed rounded-r-[2.5rem] shadow-inner">
            <span className="text-[#E0115F] font-black block mb-2 uppercase tracking-[0.2em]">>> Forge Intelligence</span>
            Current Protocol: {activeRealm}. Strike with kinetic intent to crystallize substrate logic.
          </div>
        </aside>

        <div className="col-span-12 lg:col-span-9 space-y-10">
          <TechBorder label="INTENT_BUFFER" className="p-1 overflow-hidden">
            {defaultInput}
          </TechBorder>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <TechBorder label="CONTROL_DECK" className="p-10 bg-zinc-900/60 shadow-2xl">
              <ForgeControls 
                onHeat={forgeActions.heat} 
                onStrike={forgeActions.strike} 
                onInfinity={forgeActions.infinity} 
                onQuench={forgeActions.quench} 
                isHeated={forgeActions.isHeated}
                isProcessing={forgeActions.isProcessing}
              />
            </TechBorder>

            <TechBorder label="PROJECTION_PLANE" className="flex-1 min-h-[400px] relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#E0115F05,transparent)] pointer-events-none" />
              <ForgeResultPane artifact={selectedArtifact} onCopy={onCopy} onTest={() => {}} />
            </TechBorder>
          </div>
        </div>
      </div>
    </div>
  );
};

// Implement missing BridgePage component to fix export errors
export const BridgePage: React.FC = () => {
  const [status, setStatus] = React.useState('IDLE');
  const [resonance, setResonance] = React.useState('');

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-in fade-in duration-700">
      <TechBorder label="BRIDGE_CORE" className="p-12 flex items-center justify-center bg-zinc-900/40">
        <BridgeStatusPanel status={status} />
      </TechBorder>
      <TechBorder label="SYNC_INTERFACE" className="p-12 bg-zinc-900/20">
        <BridgeSyncPanel 
          projectResonance={resonance} 
          onResonanceChange={setResonance} 
          onSync={() => setStatus('SYNCING')} 
        />
      </TechBorder>
    </div>
  );
};

// Implement missing SimulationPage component to fix export errors
export const SimulationPage: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 animate-in fade-in duration-700">
      <div className="md:col-span-2">
        <TechBorder label="SIMULATION_STREAM" className="h-[500px] bg-black/60 flex items-center justify-center">
           <div className="text-center space-y-4 opacity-30">
             <Orbit size={48} className="mx-auto animate-pulse" />
             <p className="text-[10px] uppercase tracking-[0.5em]">Awaiting_Parameters</p>
           </div>
        </TechBorder>
      </div>
      <aside className="space-y-10">
        <TechBorder label="CALIBRATION" className="p-8">
          <SimulationRunner onRun={() => console.log('Simulating...')} />
        </TechBorder>
        <div className="p-8 border border-zinc-800 rounded-[2rem] bg-zinc-900/20 space-y-4">
           <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Telemetry_Logs</h4>
           <div className="text-[9px] font-mono text-zinc-600 space-y-1">
             <div>[0.00] INIT_SIM_CORE</div>
             <div>[0.04] THREAD_POOL_READY</div>
           </div>
        </div>
      </aside>
    </div>
  );
};

// Implement missing OverviewPage component to fix export errors
export const OverviewPage: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 animate-in fade-in duration-700">
      <TechBorder label="SYSTEM_UPTIME" className="p-8 bg-zinc-900/40">
        <div className="text-4xl font-black text-white italic">99.9%</div>
        <div className="text-[9px] text-zinc-500 uppercase mt-2">Continuity_Rating</div>
      </TechBorder>
      <TechBorder label="CORE_LATENCY" className="p-8 bg-zinc-900/40">
        <div className="text-4xl font-black text-emerald-500 italic">4ms</div>
        <div className="text-[9px] text-zinc-500 uppercase mt-2">Relay_Efficiency</div>
      </TechBorder>
      <TechBorder label="IQ-T_FLUX" className="p-8 bg-zinc-900/40">
        <div className="text-4xl font-black text-[#E0115F] italic">+12</div>
        <div className="text-[9px] text-zinc-500 uppercase mt-2">Generation_Delta</div>
      </TechBorder>
      <TechBorder label="ACTIVE_RESONANCE" className="p-8 bg-zinc-900/40">
        <div className="text-4xl font-black text-blue-500 italic">ALPHA</div>
        <div className="text-[9px] text-zinc-500 uppercase mt-2">Protocol_Grade</div>
      </TechBorder>
      
      <div className="lg:col-span-4 h-64">
        <TechBorder label="RESONANCE_HISTORY" className="w-full h-full flex items-end p-8 gap-1">
           {[...Array(20)].map((_, i) => (
             <div key={i} className="flex-1 bg-red-900/20 hover:bg-[#E0115F]/40 transition-all rounded-t-sm" style={{ height: `${Math.random() * 100}%` }} />
           ))}
        </TechBorder>
      </div>
    </div>
  );
};
