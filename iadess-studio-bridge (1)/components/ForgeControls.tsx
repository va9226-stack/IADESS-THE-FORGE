import React from 'react';
import { Button } from '../ui/InterfaceFabric';
import { Hammer, Flame, Droplets, Infinity, Activity } from 'lucide-react';

interface ForgeControlsProps {
  onHeat: () => void;
  onStrike: () => void;
  onQuench: () => void;
  onInfinity: () => void;
  isHeated?: boolean;
  isProcessing?: boolean;
  className?: string;
}

// Utility for clean class merging without external dependencies
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

export const ForgeControls: React.FC<ForgeControlsProps> = ({
  onHeat,
  onStrike,
  onQuench,
  onInfinity,
  isHeated = false,
  isProcessing = false,
  className,
}) => {
  // Determine system status for the LED indicator
  const getStatusColor = () => {
    if (isProcessing) return 'bg-yellow-500 animate-pulse shadow-[0_0_12px_rgba(234,179,8,0.8)]';
    if (isHeated) return 'bg-orange-500 shadow-[0_0_12px_rgba(249,115,22,0.8)]';
    return 'bg-slate-700';
  };

  const getStatusText = () => {
    if (isProcessing) return 'PROCESSING';
    if (isHeated) return 'READY TO STRIKE';
    return 'IDLE';
  };

  return (
    <div
      className={cn(
        'relative flex flex-col gap-5 p-8 rounded-[2.5rem]',
        'bg-slate-950 border border-slate-800',
        'shadow-2xl shadow-black/50 backdrop-blur-md',
        className
      )}
      role="group"
      aria-label="Forge Control Deck"
    >
      {/* Status Rail */}
      <div className="flex items-center justify-between px-2 mb-2">
        <div className="flex items-center gap-3">
          <div className={cn('w-2.5 h-2.5 rounded-full transition-all duration-500', getStatusColor())} />
          <span className="text-[10px] font-mono font-black tracking-[0.3em] text-slate-500 uppercase">
            {getStatusText()}
          </span>
        </div>
        {isProcessing && <Activity className="w-3.5 h-3.5 text-slate-500 animate-spin" />}
      </div>

      {/* Primary Operations Grid */}
      <div className="grid grid-cols-2 gap-4">
        <Button
          onClick={onHeat}
          disabled={isProcessing}
          className={cn(
            'h-16 relative overflow-hidden group border-0 rounded-3xl',
            'bg-gradient-to-br from-orange-700 to-red-900',
            'hover:from-orange-600 hover:to-red-800',
            'text-orange-50 shadow-lg shadow-orange-900/30',
            'transition-all duration-300 active:scale-[0.96]'
          )}
        >
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
          <span className="relative flex items-center justify-center z-10 font-black text-[11px] uppercase tracking-widest">
            <Flame className={cn('w-5 h-5 mr-3 transition-transform group-hover:scale-125', isHeated && 'fill-orange-200 animate-pulse')} />
            Ignite
          </span>
        </Button>

        <Button
          onClick={onStrike}
          disabled={!isHeated || isProcessing}
          className={cn(
            'h-16 border border-slate-700 rounded-3xl',
            'bg-gradient-to-b from-slate-800 to-slate-900',
            'hover:from-slate-700 hover:to-slate-800',
            'text-slate-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]',
            'disabled:opacity-20 disabled:cursor-not-allowed disabled:bg-slate-900',
            'transition-all duration-300 active:translate-y-1'
          )}
        >
          <span className="relative flex items-center justify-center font-black text-[11px] uppercase tracking-widest">
            <Hammer className="w-5 h-5 mr-3 text-slate-400 group-hover:rotate-12 transition-transform" />
            Strike
          </span>
        </Button>
      </div>

      {/* Secondary Operations */}
      <div className="grid grid-cols-2 gap-4 mt-2">
        <Button
          onClick={onInfinity}
          variant="secondary"
          disabled={isProcessing}
          className={cn(
            'h-14 bg-indigo-950/20 border border-indigo-500/20 text-indigo-400 rounded-2xl',
            'hover:bg-indigo-900/30 hover:border-indigo-400/40 hover:text-indigo-300',
            'transition-all duration-300 font-black text-[10px] uppercase tracking-[0.2em]'
          )}
        >
          <Infinity className="w-4 h-4 mr-2" />
          Resonate
        </Button>

        <Button
          onClick={onQuench}
          variant="ghost"
          disabled={isProcessing}
          className={cn(
            'h-14 bg-cyan-950/10 border border-cyan-900/10 text-cyan-600 rounded-2xl',
            'hover:bg-cyan-900/20 hover:border-cyan-800/40 hover:text-cyan-400',
            'transition-all duration-300 font-black text-[10px] uppercase tracking-[0.2em]'
          )}
        >
          <Droplets className="w-4 h-4 mr-2" />
          Quench
        </Button>
      </div>

      {/* Aesthetic Detail */}
      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-slate-800 to-transparent"></div>
    </div>
  );
};