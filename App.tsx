import React, { useState, useEffect, useCallback } from 'react';
import { Cpu, Monitor, Zap, Layers } from 'lucide-react';
import GpuDiagram from './components/GpuDiagram';
import Controls from './components/Controls';
import { PIPELINE_STEPS } from './constants';
import { GpuStage } from './types';

const App: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Auto-advance logic
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= PIPELINE_STEPS.length - 1) {
            setIsPlaying(false); // Stop at end
            return prev;
          }
          return prev + 1;
        });
      }, 3000); // 3 seconds per stage
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handlePlayPause = useCallback(() => {
    // If we are at the end and hit play, restart
    if (!isPlaying && currentStepIndex === PIPELINE_STEPS.length - 1) {
        setCurrentStepIndex(0);
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying, currentStepIndex]);

  const handleReset = useCallback(() => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  }, []);

  const handleNext = useCallback(() => {
    setCurrentStepIndex(prev => Math.min(prev + 1, PIPELINE_STEPS.length - 1));
    setIsPlaying(false);
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentStepIndex(prev => Math.max(prev - 1, 0));
    setIsPlaying(false);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 flex flex-col gap-6">
      
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 mb-2">
            GPU 架构可视化演示
          </h1>
          <p className="text-slate-400 max-w-2xl">
            交互式图形渲染流水线演示。观察数据如何从 CPU 流动，分布到数千个并行核心，并最终合并为图像。
          </p>
        </div>
        <div className="hidden md:flex gap-4">
             <div className="flex flex-col items-center p-3 bg-slate-900 rounded-lg border border-slate-800">
                <Cpu className="text-blue-500 mb-1" size={20} />
                <span className="text-xs text-slate-500 font-mono">串行 (Serial)</span>
             </div>
             <div className="flex flex-col items-center p-3 bg-slate-900 rounded-lg border border-slate-800">
                <Layers className="text-purple-500 mb-1" size={20} />
                <span className="text-xs text-slate-500 font-mono">并行 (Parallel)</span>
             </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Visualizer (Span 2) */}
        <div className="lg:col-span-2 flex flex-col gap-4 min-h-[400px]">
           <GpuDiagram stage={PIPELINE_STEPS[currentStepIndex].id} />
        </div>

        {/* Right Col: Controls & Info (Span 1) */}
        <div className="flex flex-col gap-4">
           <Controls 
              currentStepIndex={currentStepIndex}
              isPlaying={isPlaying}
              onPlayPause={handlePlayPause}
              onReset={handleReset}
              onNext={handleNext}
              onPrev={handlePrev}
           />
           
           {/* Additional Fact Card */}
           <div className="flex-1 bg-gradient-to-br from-indigo-900/20 to-slate-900 rounded-xl border border-indigo-500/20 p-6 relative overflow-hidden">
              <Zap className="absolute top-4 right-4 text-indigo-500/20 w-24 h-24" />
              <h3 className="text-indigo-400 font-bold mb-2 uppercase text-xs tracking-widest">为什么 GPU 如此之快</h3>
              <p className="text-slate-300 text-sm leading-relaxed z-10 relative">
                 CPU 拥有少量专为复杂逻辑处理而设计的强大核心（低延迟），而 GPU 拥有数千个较小的、简单的核心，旨在同时对不同的数据执行相同的数学运算（高吞吐量）。
              </p>
              <div className="mt-4 pt-4 border-t border-indigo-500/10 grid grid-cols-2 gap-4">
                  <div>
                      <span className="block text-2xl font-bold text-white">~4-16</span>
                      <span className="text-xs text-slate-500">CPU 核心</span>
                  </div>
                  <div>
                      <span className="block text-2xl font-bold text-white">~10,000+</span>
                      <span className="text-xs text-slate-500">GPU 核心</span>
                  </div>
              </div>
           </div>
        </div>

      </main>
    </div>
  );
};

export default App;