import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GpuStage } from '../types';
import { CORE_COUNT } from '../constants';

interface GpuDiagramProps {
  stage: GpuStage;
}

const GpuDiagram: React.FC<GpuDiagramProps> = ({ stage }) => {
  // --- Animation States ---
  const [activePackets, setActivePackets] = useState<number[]>([]);

  useEffect(() => {
    // Reset packets when stage changes to trigger new animations
    setActivePackets([]);
    const timeout = setTimeout(() => {
        // Create a burst of packets
        setActivePackets(Array.from({ length: 8 }, (_, i) => i));
    }, 100);
    return () => clearTimeout(timeout);
  }, [stage]);

  // --- Helper to determine active visual elements ---
  const isCpuActive = stage === GpuStage.CPU_SEND;
  const isBusActive = stage === GpuStage.CPU_SEND;
  const isVramActive = stage === GpuStage.MEMORY_LOAD || stage === GpuStage.CORE_DISTRIBUTION;
  const isSchedulerActive = stage === GpuStage.CORE_DISTRIBUTION;
  const isCoresActive = stage === GpuStage.PARALLEL_PROCESSING;
  const isOutputActive = stage === GpuStage.RASTER_MERGE || stage === GpuStage.DISPLAY;

  // --- Paths Configuration ---
  // We define SVG paths for particles to follow
  const cpuToVramPath = "M 100 100 L 250 100 L 250 200";
  const vramToSchedulerPath = "M 280 250 L 350 250";
  const schedulerToCoresPath = (index: number) => {
    // Fan out from scheduler (380, 250) to core grid
    const row = Math.floor(index / 4);
    const col = index % 4;
    const targetX = 420 + col * 40;
    const targetY = 150 + row * 40;
    return `M 380 250 L ${targetX} ${targetY}`;
  };
  const coresToBufferPath = (index: number) => {
    const row = Math.floor(index / 4);
    const col = index % 4;
    const startX = 420 + col * 40;
    const startY = 150 + row * 40;
    return `M ${startX} ${startY} L 600 250`;
  };
  const bufferToScreenPath = "M 650 250 L 750 250";

  return (
    <div className="w-full h-full flex items-center justify-center bg-slate-900 rounded-xl border border-slate-700 shadow-2xl overflow-hidden relative">
      <svg viewBox="0 0 850 500" className="w-full h-auto max-w-5xl">
        <defs>
          <linearGradient id="pcbGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
           <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
          </pattern>
        </defs>

        {/* Background Grid */}
        <rect width="850" height="500" fill="url(#grid)" />

        {/* --- PCIe Bus --- */}
        <path 
            d="M 140 100 L 220 100 L 220 400" 
            fill="none" 
            stroke={isBusActive ? "#38bdf8" : "#334155"} 
            strokeWidth="8" 
            strokeLinecap="round"
            className="transition-colors duration-500"
        />
        <text x="160" y="85" fill="#94a3b8" fontSize="10" className="uppercase tracking-widest">PCIe 总线</text>

        {/* --- CPU --- */}
        <g transform="translate(40, 60)">
          <rect 
            width="100" height="80" rx="8" 
            fill={isCpuActive ? "#3b82f6" : "#1e293b"} 
            stroke={isCpuActive ? "#60a5fa" : "#475569"} 
            strokeWidth="2"
            className="transition-colors duration-300"
          />
          <text x="50" y="45" textAnchor="middle" fill="white" fontWeight="bold">CPU</text>
          <text x="50" y="65" textAnchor="middle" fill="#93c5fd" fontSize="10">主机 (Host)</text>
          
          {/* CPU Pulse */}
          {isCpuActive && (
             <motion.rect
                width="100" height="80" rx="8"
                fill="none" stroke="#60a5fa" strokeWidth="4"
                initial={{ opacity: 1, scale: 1 }}
                animate={{ opacity: 0, scale: 1.2 }}
                transition={{ repeat: Infinity, duration: 1.5 }}
             />
          )}
        </g>

        {/* --- GPU PCB Board --- */}
        <g transform="translate(250, 50)">
          <rect 
            width="450" height="400" rx="16" 
            fill="url(#pcbGradient)" 
            stroke="#334155" 
            strokeWidth="2" 
          />
          <text x="225" y="30" textAnchor="middle" fill="#64748b" fontSize="14" fontWeight="bold" letterSpacing="0.1em">图形处理单元 (GPU)</text>

          {/* VRAM Blocks */}
          <g transform="translate(30, 150)">
            <rect 
                width="40" height="120" rx="4" 
                fill={isVramActive ? "#10b981" : "#1e293b"}
                stroke={isVramActive ? "#34d399" : "#475569"}
                className="transition-colors duration-300"
            />
             <text x="20" y="65" textAnchor="middle" fill="white" fontSize="10" style={{writingMode: "vertical-rl"}}>显存 (VRAM)</text>
          </g>

          {/* Scheduler / Gigathread Engine */}
          <g transform="translate(100, 180)">
             <path 
                d="M 0 30 L 30 0 L 30 60 Z" 
                fill={isSchedulerActive ? "#fbbf24" : "#1e293b"} 
                stroke={isSchedulerActive ? "#fcd34d" : "#475569"}
                className="transition-colors duration-300"
             />
             <text x="15" y="75" textAnchor="middle" fill="#94a3b8" fontSize="10">调度器</text>
          </g>

          {/* Cores Grid (SMs) */}
          <g transform="translate(170, 100)">
            <rect 
                width="180" height="180" rx="8" 
                fill="#0f172a" 
                stroke="#334155" 
                strokeDasharray="4 4"
            />
            {Array.from({ length: CORE_COUNT }).map((_, i) => {
                const row = Math.floor(i / 4);
                const col = i % 4;
                const isActive = isCoresActive; // Simple uniform activation for demo
                
                return (
                    <motion.rect
                        key={`core-${i}`}
                        x={10 + col * 40}
                        y={10 + row * 40}
                        width="30"
                        height="30"
                        rx="2"
                        fill={isActive ? "#a855f7" : "#1e293b"}
                        stroke={isActive ? "#c084fc" : "#475569"}
                        animate={{
                            scale: isActive ? [1, 1.1, 1] : 1,
                            fill: isActive ? ["#a855f7", "#d8b4fe", "#a855f7"] : "#1e293b"
                        }}
                        transition={{ 
                            duration: 0.5, 
                            repeat: isActive ? Infinity : 0, 
                            delay: i * 0.05 
                        }}
                    />
                );
            })}
             <text x="90" y="-15" textAnchor="middle" fill="#94a3b8" fontSize="10">计算核心 (SMs)</text>
          </g>

          {/* Output / ROPs / L2 Cache Area */}
          <g transform="translate(370, 150)">
            <rect 
                width="40" height="120" rx="4" 
                fill={isOutputActive ? "#f43f5e" : "#1e293b"}
                stroke={isOutputActive ? "#fda4af" : "#475569"}
                className="transition-colors duration-300"
            />
             <text x="20" y="65" textAnchor="middle" fill="white" fontSize="10" style={{writingMode: "vertical-rl"}}>帧缓冲区</text>
          </g>
        </g>

        {/* --- Monitor --- */}
        <g transform="translate(720, 150)">
             {/* Stand */}
            <path d="M 50 160 L 50 180 L 20 180 L 80 180" stroke="#334155" strokeWidth="4" fill="none" />
            {/* Screen Bezel */}
            <rect width="100" height="160" rx="4" fill="#1e293b" stroke="#475569" strokeWidth="4" />
            {/* Screen Content */}
            <rect 
                x="5" y="5" width="90" height="150" 
                fill={stage === GpuStage.DISPLAY ? "#10b981" : "#000000"} 
                className="transition-colors duration-1000"
            />
            {stage === GpuStage.DISPLAY && (
                 <image href="https://picsum.photos/200/300" x="5" y="5" width="90" height="150" preserveAspectRatio="none" opacity="0.8" />
            )}
             <text x="50" y="195" textAnchor="middle" fill="#94a3b8" fontSize="10">显示器</text>
        </g>

        {/* --- Particles Animation --- */}
        <AnimatePresence>
            {/* Phase 1: CPU -> VRAM */}
            {stage === GpuStage.CPU_SEND && activePackets.map((i) => (
                <motion.circle
                    key={`p1-${i}`}
                    r="4"
                    fill="#60a5fa"
                    filter="url(#glow)"
                    initial={{ offsetDistance: "0%" }}
                    animate={{ offsetDistance: "100%" }}
                    transition={{ duration: 1.5, ease: "linear", delay: i * 0.2, repeat: Infinity }}
                    style={{ offsetPath: `path("${cpuToVramPath}")` }}
                />
            ))}

            {/* Phase 2: VRAM -> Scheduler */}
            {(stage === GpuStage.MEMORY_LOAD) && activePackets.map((i) => (
                 <motion.circle
                    key={`p2-${i}`}
                    r="4"
                    fill="#34d399"
                    initial={{ offsetDistance: "0%" }}
                    animate={{ offsetDistance: "100%" }}
                    transition={{ duration: 0.8, ease: "easeInOut", delay: i * 0.1, repeat: Infinity }}
                    style={{ offsetPath: `path("${vramToSchedulerPath}")` }}
                />
            ))}

             {/* Phase 3: Scheduler -> Cores (The Splitting) */}
            {(stage === GpuStage.CORE_DISTRIBUTION) && activePackets.map((i) => {
                 // Create more particles visually
                 const targets = [0, 5, 10, 15]; // sample targets
                 return targets.map((t, idx) => (
                    <motion.circle
                        key={`p3-${i}-${t}`}
                        r="3"
                        fill="#fcd34d"
                        initial={{ offsetDistance: "0%" }}
                        animate={{ offsetDistance: "100%" }}
                        transition={{ duration: 0.6, ease: "easeOut", delay: i * 0.1 }}
                        style={{ offsetPath: `path("${schedulerToCoresPath(t)}")` }}
                    />
                 ))
            })}

             {/* Phase 4: Cores -> Frame Buffer (Merge) */}
            {(stage === GpuStage.RASTER_MERGE) && activePackets.map((i) => {
                 const targets = [0, 5, 10, 15];
                 return targets.map((t) => (
                    <motion.circle
                        key={`p4-${i}-${t}`}
                        r="3"
                        fill="#c084fc"
                        initial={{ offsetDistance: "0%" }}
                        animate={{ offsetDistance: "100%" }}
                        transition={{ duration: 0.8, ease: "easeIn", delay: i * 0.1 }}
                        style={{ offsetPath: `path("${coresToBufferPath(t)}")` }}
                    />
                 ))
            })}

             {/* Phase 5: Buffer -> Screen */}
            {(stage === GpuStage.DISPLAY) && activePackets.map((i) => (
                <motion.circle
                    key={`p5-${i}`}
                    r="5"
                    fill="#f43f5e"
                    initial={{ offsetDistance: "0%" }}
                    animate={{ offsetDistance: "100%" }}
                    transition={{ duration: 1, ease: "linear", delay: i * 0.2, repeat: Infinity }}
                    style={{ offsetPath: `path("${bufferToScreenPath}")` }}
                />
            ))}
        </AnimatePresence>

      </svg>
    </div>
  );
};

export default GpuDiagram;