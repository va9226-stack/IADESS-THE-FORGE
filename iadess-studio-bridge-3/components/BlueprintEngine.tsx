
import React, { useRef, useEffect, useState } from 'react';

const BlueprintEngine: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [points, setPoints] = useState<{ x: number, y: number }[]>([]);
  const [metadata, setMetadata] = useState<{ clarity: string, motion: string, code: string } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !containerRef.current) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleResize = () => {
      if (containerRef.current && canvas) {
        canvas.width = containerRef.current.clientWidth;
        canvas.height = containerRef.current.clientHeight;
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    let animationFrame: number;
    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      const cx = width / 2;
      const cy = height / 2;
      const time = Date.now() * 0.0005;

      ctx.fillStyle = '#050101';
      ctx.fillRect(0, 0, width, height);

      // Draw Grid
      ctx.strokeStyle = 'rgba(224, 17, 95, 0.05)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
      }

      // Draw Central Hex Shards
      ctx.strokeStyle = 'rgba(224, 17, 95, 0.2)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI * 2 / 6) * i + time;
        const x = cx + Math.cos(angle) * (60 + Math.sin(time * 2) * 10);
        const y = cy + Math.sin(angle) * (60 + Math.sin(time * 2) * 10);
        
        ctx.strokeRect(x - 20, y - 20, 40, 40);
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(x, y);
        ctx.stroke();
      }

      // Draw User Geometry
      if (points.length > 0) {
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#E0115F';
        ctx.strokeStyle = '#E0115F';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i].x, points[i].y);
        }
        if (points.length > 2) ctx.closePath();
        ctx.stroke();
        ctx.shadowBlur = 0;

        ctx.fillStyle = '#fff';
        points.forEach(p => ctx.fillRect(p.x - 2, p.y - 2, 4, 4));
      }

      // Draw Metadata
      if (metadata) {
        ctx.fillStyle = '#E0115F';
        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.fillText(`CLARITY_DEPTH: ${metadata.clarity}`, 30, height - 60);
        ctx.fillText(`MOTION_VECTOR: ${metadata.motion}`, 30, height - 45);
        ctx.fillText(`AI_HASH_LINK: ${metadata.code}`, 30, height - 30);
      } else {
        ctx.fillStyle = 'rgba(224, 17, 95, 0.3)';
        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.fillText('WAITING_FOR_GEOMETRY_INPUT...', 30, height - 30);
      }

      animationFrame = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrame);
    };
  }, [points, metadata]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (points.length > 20) setPoints([]); // Reset if too many points
    setPoints(prev => [...prev, { x, y }]);
    
    // Simulate metadata update on first point
    if (points.length === 0) {
      setMetadata({
        clarity: "OSVRA_ALPHA_9",
        motion: "LINEAR_REFRACTION",
        code: `Ω_${Math.random().toString(16).slice(2, 8).toUpperCase()}`
      });
    }
  };

  return (
    <div ref={containerRef} className="w-full h-full relative bg-[#050101] overflow-hidden rounded-[3rem] border border-red-900/10 shadow-2xl">
      <div className="absolute top-10 left-10 z-20 pointer-events-none">
        <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter thermal-text">Blueprint Engine</h2>
        <p className="text-[10px] font-mono text-red-900/60 uppercase tracking-[0.4em]">Substrate Visualization Layer</p>
      </div>
      
      <div className="absolute top-10 right-10 z-20 flex gap-4 pointer-events-none">
         <div className="bg-black/40 backdrop-blur-md border border-red-900/20 p-4 rounded-2xl flex flex-col gap-1">
            <span className="text-[8px] font-black text-red-700 uppercase tracking-widest">Active Points</span>
            <span className="text-xl font-mono text-white">{points.length}</span>
         </div>
      </div>

      <canvas 
        ref={canvasRef} 
        onMouseDown={handleMouseDown}
        className="cursor-crosshair w-full h-full"
      />

      <div className="absolute bottom-10 right-10 z-20">
        <button 
          onClick={(e) => { e.stopPropagation(); setPoints([]); setMetadata(null); }}
          className="px-6 py-3 bg-red-950/20 hover:bg-red-500/10 border border-red-900/20 text-red-500 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all active:scale-95"
        >
          Clear Substrate
        </button>
      </div>
    </div>
  );
};

export default BlueprintEngine;
