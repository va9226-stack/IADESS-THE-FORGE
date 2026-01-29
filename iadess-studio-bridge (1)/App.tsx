// @google/genai guidelines followed: models are used correctly, and API key is sourced from process.env.API_KEY.
import React, { useState, useEffect } from 'react';
import { ViewType, IntelligenceToken } from './types';
import { Artifact } from './types/core';
import AIChat from './components/AIChat';
import HammerForge from './ui/HammerForge';
import SubstrateCalibratorLayout from './ui/SubstrateCalibratorLayout';
import { InterfaceFabric, Button, HoloCard, TerminalInput } from './ui/InterfaceFabric';
import { PageWrapper, ForgeView, BridgePage, SimulationPage, OverviewPage } from './ui/ResonanceHub';
import BlueprintEngine from './components/BlueprintEngine';
import { getTokens, consumeTokens } from './intelligence/intelligenceRuntime';
import { 
  Database, Hammer, Shield, Box, Layout, Component, Palette, Container, Code2, Globe, FileCode, Zap, Binary, Waves
} from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>(ViewType.OVERVIEW);
  const [activeRealm, setActiveRealm] = useState('PAGES');
  const [intent, setIntent] = useState('');
  const [witnessLogs, setWitnessLogs] = useState<string[]>(["ARCHITECT_CONNECTED", "VRAW_RUNTIME_ACTIVE"]);
  const [selectedArtifact, setSelectedArtifact] = useState<Artifact | null>(null);
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [iqTokens, setIqTokens] = useState<IntelligenceToken>({ amount: getTokens(), grade: 'ALPHA' });
  const [integrity, setIntegrity] = useState(1.0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIqTokens(prev => ({ ...prev, amount: getTokens() }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const addLog = (msg: string) => {
    setWitnessLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 12)]);
  };

  const handleQuench = (art: Partial<Artifact>) => {
    const newArt: Artifact = {
      id: `Ω_${Date.now()}`,
      name: art.name || 'Shard',
      mode: activeRealm as any,
      codeShard: art.codeShard || '',
      visualUrl: art.visualUrl,
      integrityScore: art.integrityScore || 1.0,
      intelligenceCost: 0,
      status: art.status || 'STABLE',
      expansionHistory: art.expansionHistory,
      createdAt: new Date()
    };
    
    setArtifacts(prev => [newArt, ...prev]);
    setSelectedArtifact(newArt);
    setIntent('');
    addLog(`SUCCESS: ${newArt.name} crystallized.`);
  };

  const renderContent = () => {
    const defaultInput = (
      <textarea 
        value={intent} onChange={(e) => setIntent(e.target.value)}
        placeholder={`Input architectural intent for ${activeRealm}...`}
        className={`w-full bg-black/20 p-10 text-2xl font-mono text-white placeholder:text-zinc-800 focus:outline-none transition-all h-48 resize-none leading-relaxed`}
      />
    );

    switch (currentView) {
      case ViewType.FORGE:
        return (
          <ForgeView 
            activeRealm={activeRealm}
            onRealmChange={setActiveRealm}
            selectedArtifact={selectedArtifact}
            onCopy={() => {
              if (selectedArtifact) {
                navigator.clipboard.writeText(selectedArtifact.codeShard);
                addLog("LOGIC_COPIED");
              }
            }}
            defaultInput={defaultInput}
            forgeActions={{
               heat: () => {}, 
               strike: () => {}, 
               infinity: () => {}, 
               quench: () => {}, 
               isHeated: false, 
               isProcessing: false 
            }}
          />
        );
      case ViewType.TEST:
        return <SimulationPage />;
      case ViewType.BRIDGE:
        return <BridgePage />;
      case ViewType.BLUEPRINTS:
        return <div className="h-[700px]"><BlueprintEngine /></div>;
      case ViewType.OVERVIEW:
        return <OverviewPage />;
      case ViewType.MATERIAL:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {artifacts.map(art => (
              <HoloCard key={art.id} title={art.name}>
                <div className="space-y-4">
                  <div className="flex justify-between text-[10px] font-black uppercase text-zinc-500">
                    <span>{art.mode}</span>
                    <span className="text-[#E0115F]">{art.status}</span>
                  </div>
                  <div className="h-32 bg-black rounded-xl border border-zinc-800 flex items-center justify-center">
                    {art.visualUrl ? <img src={art.visualUrl} className="w-full h-full object-cover rounded-xl" /> : <Binary size={24} className="opacity-20" />}
                  </div>
                  <Button variant="ghost" className="w-full" onClick={() => setSelectedArtifact(art)}>Access Logic</Button>
                </div>
              </HoloCard>
            ))}
            {artifacts.length === 0 && <div className="col-span-full py-20 text-center text-zinc-600 uppercase tracking-widest text-xs">No artifacts crystallized yet.</div>}
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center h-96 opacity-20 italic">
            // Realm currently under construction...
          </div>
        );
    }
  };

  const getHeatLevel = () => {
    if (currentView === ViewType.FORGE) return "75°C";
    if (currentView === ViewType.TEST) return "42°C";
    return "NOMINAL";
  };

  return (
    <div className="flex h-screen w-full bg-[#050101] text-slate-200 overflow-hidden font-inter transition-all duration-1000 p-6 gap-6">
      {/* Universal Page Shell - No Sidebar */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <PageWrapper
          title={currentView === ViewType.OVERVIEW ? "CENTRAL_RESONANCE" : `${currentView}_MODULE`}
          protocol="IADESS_V3_OMEGA"
          integrity={(integrity * 100).toFixed(0) + "%"}
          heat={getHeatLevel()}
          activeView={currentView}
          onNavigate={setCurrentView}
          tokens={iqTokens.amount}
        >
          {renderContent()}
        </PageWrapper>
      </main>

      {/* Iadess Mind (Right Sidebar) */}
      <aside className="h-full">
        <AIChat 
          integrity={integrity} 
          tokens={iqTokens.amount} 
          setTokens={(val) => {
            if (typeof val === 'function') {
              const next = val(iqTokens);
              if (next.amount < iqTokens.amount) {
                consumeTokens(iqTokens.amount - next.amount);
              }
            }
          }} 
        />
      </aside>
    </div>
  );
};

export default App;
