import React from 'react';

// --- UTILITY: GLITCH STYLES ---
const GlitchStyles = () => (
  <style>{`
    @keyframes glitch-anim-1 {
      0% { clip-path: inset(20% 0 80% 0); transform: translate(-2px, 1px); }
      20% { clip-path: inset(60% 0 10% 0); transform: translate(2px, -1px); }
      40% { clip-path: inset(40% 0 50% 0); transform: translate(-2px, 2px); }
      60% { clip-path: inset(80% 0 5% 0); transform: translate(2px, -2px); }
      80% { clip-path: inset(10% 0 70% 0); transform: translate(-1px, 1px); }
      100% { clip-path: inset(30% 0 50% 0); transform: translate(1px, -1px); }
    }
    .glitch-active::before, .glitch-active::after {
      content: attr(data-text);
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: inherit;
    }
    .glitch-active::before {
      left: 2px;
      text-shadow: -1px 0 #ff0000;
      clip-path: inset(0 0 0 0);
      animation: glitch-anim-1 2s infinite linear alternate-reverse;
    }
    .glitch-active::after {
      left: -2px;
      text-shadow: -1px 0 #00ffff;
      clip-path: inset(0 0 0 0);
      animation: glitch-anim-1 2s infinite linear alternate-reverse;
    }
  `}</style>
);

// --- COMPONENT: BUTTON ---
type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  loading?: boolean;
  glitch?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', loading, glitch, children, className, ...props }) => {
  const base = 'relative px-6 py-2 font-mono text-xs uppercase tracking-tighter transition-all duration-150 active:translate-y-[1px] disabled:opacity-40 disabled:pointer-events-none group overflow-hidden';
  const variants = {
    primary: 'bg-red-500/10 border border-red-500/50 text-red-500 hover:bg-red-500 hover:text-black shadow-[0_0_15px_rgba(239,68,68,0.2)]',
    secondary: 'bg-cyan-500/10 border border-cyan-500/50 text-cyan-500 hover:bg-cyan-500 hover:text-black shadow-[0_0_15px_rgba(6,182,212,0.2)]',
    danger: 'bg-red-600 border border-red-600 text-white hover:brightness-125',
    ghost: 'bg-transparent text-neutral-500 hover:text-white border border-transparent hover:border-neutral-700'
  };
  
  return (
    <>
      {glitch && <GlitchStyles />}
      <button 
        {...props} 
        disabled={loading || props.disabled} 
        className={`${base} ${variants[variant]} ${className} ${glitch ? 'glitch-active' : ''}`}
        data-text={typeof children === 'string' ? children : 'ACTION'}
      >
        <div className='absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12' />
        <span className='relative z-10 flex items-center justify-center gap-2'>
          {loading && <span className='animate-spin'>⟳</span>}
          {loading ? 'SYNCING_PROTOCOL' : children}
        </span>
      </button>
    </>
  );
};

// --- COMPONENT: TERMINAL INPUT ---
interface TerminalInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  status?: 'idle' | 'valid' | 'error';
}

export const TerminalInput: React.FC<TerminalInputProps> = ({ label, status = 'idle', className, ...props }) => {
  const statusColors = {
    idle: 'border-neutral-800 text-neutral-400 focus:border-cyan-500/50 focus:text-cyan-400',
    valid: 'border-green-500/50 text-green-400',
    error: 'border-red-500/50 text-red-400'
  };

  return (
    <div className={`flex flex-col gap-1 font-mono ${className}`}>
      {label && <label className='text-[10px] uppercase tracking-widest text-neutral-500'>{label}</label>}
      <div className={`relative flex items-center border-b bg-black/20 transition-colors duration-300 ${statusColors[status]}`}>
        <span className='pl-2 text-xs opacity-50'>$</span>
        <input 
          {...props}
          className='w-full bg-transparent px-2 py-2 text-sm outline-none placeholder:text-neutral-700'
          autoComplete="off"
        />
        <div className='absolute bottom-0 left-0 h-[1px] w-0 bg-current transition-all duration-500 group-focus-within:w-full' />
      </div>
      {status === 'error' && <span className='text-[10px] text-red-500'>>> INVALID_SYNTAX</span>}
    </div>
  );
};

// --- COMPONENT: HOLO CARD ---
export const HoloCard: React.FC<{ children: React.ReactNode; title?: string; className?: string }> = ({ children, title, className }) => (
  <div className={`relative border border-neutral-800 bg-neutral-950/50 p-6 backdrop-blur-sm ${className}`}>
    <div className='absolute -left-[1px] -top-[1px] h-2 w-2 border-l border-t border-red-500' />
    <div className='absolute -right-[1px] -top-[1px] h-2 w-2 border-r border-t border-red-500' />
    <div className='absolute -bottom-[1px] -left-[1px] h-2 w-2 border-b border-l border-red-500' />
    <div className='absolute -bottom-[1px] -right-[1px] h-2 w-2 border-b border-r border-red-500' />
    
    {title && (
      <div className='mb-4 flex items-center gap-2 border-b border-neutral-800 pb-2'>
        <div className='h-1 w-1 bg-red-500' />
        <h4 className='font-mono text-xs font-bold uppercase tracking-widest text-neutral-400'>{title}</h4>
      </div>
    )}
    <div className='relative z-10'>{children}</div>
  </div>
);

// --- COMPONENT: SYSTEM OVERLAY ---
export const SystemOverlay: React.FC = () => (
  <div className='pointer-events-none absolute inset-0 z-50 overflow-hidden rounded-[3rem]'>
    <div className='absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] opacity-20' />
    <div className='absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_50%,rgba(0,0,0,0.4)_100%)]' />
  </div>
);

// --- LAYOUT WRAPPER ---
export const InterfaceFabric: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="relative p-10 bg-[#0a0a0a] border border-red-900/10 rounded-[4rem] overflow-hidden min-h-[600px]">
      <SystemOverlay />
      <div className="relative z-10 space-y-10">
        <header className="flex justify-between items-center border-b border-red-900/10 pb-6">
          <div className="flex flex-col">
            <span className="text-[10px] text-red-700 font-black tracking-widest uppercase">Protocol</span>
            <span className="font-bold text-xl uppercase tracking-tighter text-white">INTERFACE_FABRIC_STRIKE</span>
          </div>
          <div className="bg-red-500/5 px-4 py-2 border border-red-500/20 rounded-xl">
            <span className="text-[10px] text-red-500 font-black uppercase tracking-widest animate-pulse">Visual_Synthesizer_Active</span>
          </div>
        </header>
        {children}
      </div>
    </div>
  );
};
