import React from 'react';
import { Play, Pause, RotateCcw, ChevronRight, ChevronLeft } from 'lucide-react';
import { PIPELINE_STEPS } from '../constants';

interface ControlsProps {
  currentStepIndex: number;
  isPlaying: boolean;
  onPlayPause: () => void;
  onReset: () => void;
  onNext: () => void;
  onPrev: () => void;
}

const Controls: React.FC<ControlsProps> = ({
  currentStepIndex,
  isPlaying,
  onPlayPause,
  onReset,
  onNext,
  onPrev
}) => {
  const currentStep = PIPELINE_STEPS[currentStepIndex];

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 flex flex-col gap-4 shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
            流水线控制器
          </h2>
          <p className="text-slate-400 text-sm">步骤 {currentStepIndex + 1} / {PIPELINE_STEPS.length}</p>
        </div>
        
        <div className="flex items-center gap-2">
            <button 
                onClick={onPrev}
                disabled={currentStepIndex === 0}
                className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-colors"
            >
                <ChevronLeft size={20} />
            </button>
            
            <button 
                onClick={onPlayPause}
                className={`p-3 rounded-lg flex items-center gap-2 font-semibold transition-all ${
                    isPlaying 
                    ? 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border border-amber-500/50' 
                    : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                }`}
            >
                {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                {isPlaying ? "暂停模拟" : "运行模拟"}
            </button>

            <button 
                onClick={onNext}
                disabled={currentStepIndex === PIPELINE_STEPS.length - 1}
                className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-colors"
            >
                <ChevronRight size={20} />
            </button>

             <button 
                onClick={onReset}
                className="p-2 rounded-lg bg-slate-700 hover:bg-red-500/20 hover:text-red-400 text-slate-300 transition-colors ml-2"
                title="重置"
            >
                <RotateCcw size={20} />
            </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
        <div 
            className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-500 ease-out"
            style={{ width: `${((currentStepIndex) / (PIPELINE_STEPS.length - 1)) * 100}%` }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
         {/* Current Step Info */}
         <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1 block">当前阶段</span>
            <h3 className="text-lg font-semibold text-white mb-2">{currentStep.title}</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
                {currentStep.description}
            </p>
         </div>

         {/* Technical Details */}
         <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
            <span className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-1 block">技术细节</span>
            <div className="font-mono text-sm text-emerald-400/90 break-words">
                {">"} {currentStep.technicalDetails}
            </div>
            {/* Mini Legend */}
            <div className="mt-3 flex flex-wrap gap-2 text-[10px] text-slate-500 uppercase">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span>主机 CPU</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span>显存 (VRAM)</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-500"></span>核心</span>
            </div>
         </div>
      </div>

    </div>
  );
};

export default Controls;