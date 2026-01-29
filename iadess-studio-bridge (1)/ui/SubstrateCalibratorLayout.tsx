import React, { useEffect } from 'react';

interface SubstrateCalibratorLayoutProps {
  children: React.ReactNode;
  integrityLevel?: number;
}

const SubstrateCalibratorLayout: React.FC<SubstrateCalibratorLayoutProps> = ({ children, integrityLevel = 0.95 }) => {
  useEffect(() => {
    const startTime = performance.now();
    console.log(`[IADESS] Initializing LAYOUT Protocol. Integrity: ${integrityLevel}`);
    const monitor = setInterval(() => {
      if (Math.random() > integrityLevel) {
        console.warn('[IADESS] Substrate flicker detected. Re-calibrating...');
      }
    }, 5000);
    return () => {
      clearInterval(monitor);
      const duration = performance.now() - startTime;
      console.log(`[IADESS] Substrate session finalized. Uptime: ${duration.toFixed(2)}ms`);
    };
  }, [integrityLevel]);

  return (
    <div className="min-h-[600px] bg-black text-cyan-400 font-mono flex flex-col p-8 border-2 border-cyan-900 rounded-[3rem] overflow-hidden relative shadow-[0_0_50px_rgba(6,182,212,0.1)]">
      <header className="flex justify-between items-center border-b border-cyan-900 pb-4 mb-8">
        <div className="flex flex-col">
          <span className="text-[10px] text-cyan-700 font-black tracking-widest uppercase">Protocol</span>
          <span className="font-bold text-lg uppercase tracking-tighter">LAYOUT_REFINEMENT_STRIKE</span>
        </div>
        <div className="text-right flex flex-col items-end">
          <span className="text-[10px] text-cyan-700 font-black block uppercase tracking-widest">Heat_Index</span>
          <span className="text-orange-500 animate-pulse font-black text-lg">75°C</span>
        </div>
      </header>
      <main className="flex-grow relative overflow-hidden backdrop-blur-sm bg-cyan-950/5 p-8 rounded-[2rem] border border-cyan-500/20">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-30 animate-[scan_4s_linear_infinite] pointer-events-none"></div>
        {children}
      </main>
      <footer className="mt-8 flex justify-between text-[10px] opacity-40 uppercase tracking-[0.4em] font-black">
        <span>Refining substrate...</span>
        <span>Integrity Check: {(integrityLevel * 100).toFixed(1)}%</span>
      </footer>
    </div>
  );
};

export default SubstrateCalibratorLayout;