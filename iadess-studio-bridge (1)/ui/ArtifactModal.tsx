
import React from 'react';
import { X, Download, Maximize2, Eye } from 'lucide-react';

interface ArtifactModalProps {
  image: string;
  onClose: () => void;
}

const ArtifactModal: React.FC<ArtifactModalProps> = ({ image, onClose }) => {
  return (
    <div 
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/95 backdrop-blur-2xl"></div>
      <div className="relative z-10 max-w-5xl w-full flex flex-col items-center gap-8" onClick={e => e.stopPropagation()}>
        <button 
          onClick={onClose}
          className="absolute -top-14 right-0 p-4 bg-white/5 rounded-full text-white/40 hover:text-red-500 hover:bg-white/10 transition-all active:scale-90"
        >
          <X size={28} />
        </button>
        <div className="relative group w-full overflow-hidden rounded-[3rem] border border-red-900/20 shadow-2xl bg-black/50">
          <img 
            src={image} 
            className="w-full h-auto max-h-[75vh] object-contain mx-auto transition-transform duration-1000 group-hover:scale-105" 
            alt="Expanded Shard Projection" 
          />
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/60 to-transparent"></div>
        </div>
        <div className="flex gap-6 w-full justify-center">
           <a 
             href={image} 
             download={`iadess_artifact_${Date.now()}.png`} 
             className="flex-1 max-w-[240px] flex items-center justify-center gap-4 px-10 py-5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] text-emerald-400 hover:bg-emerald-500/20 transition-all active:scale-95 shadow-lg shadow-emerald-500/5"
           >
             <Download size={18} /> Download projection
           </a>
           <button 
             onClick={onClose}
             className="flex-1 max-w-[240px] px-10 py-5 bg-red-950/20 border border-red-900/20 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] text-red-500 transition-all active:scale-95"
           >
             De-initialize
           </button>
        </div>
      </div>
    </div>
  );
};

export default ArtifactModal;
