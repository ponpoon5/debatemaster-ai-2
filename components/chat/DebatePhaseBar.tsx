import React from 'react';
import { DebateProgressPhase, PhaseWinCondition } from '../../core/types';
import { ChevronRight, Flag, Scale, Shield, Swords, Target, CheckCircle2, Zap } from 'lucide-react';

interface DebatePhaseBarProps {
  currentPhase: DebateProgressPhase;
  winCondition?: PhaseWinCondition;
}

const PHASES: { id: DebateProgressPhase; label: string; desc: string; icon: any }[] = [
  { id: 'POSITION', label: '立場表明', desc: '自分のスタンスを明確にする', icon: Flag },
  { id: 'GROUNDS', label: '根拠提示', desc: '理由とデータを提示する', icon: Target },
  { id: 'CLASH', label: '論点衝突', desc: '争点が明確になる', icon: Swords },
  { id: 'REBUTTAL', label: '再反論', desc: '反論への防御と反撃', icon: Shield },
  { id: 'WEIGHING', label: '比較', desc: '重要性の比較を行う', icon: Scale },
  { id: 'CLOSING', label: '結論', desc: '議論をまとめる', icon: CheckCircle2 },
];

export const DebatePhaseBar: React.FC<DebatePhaseBarProps> = React.memo(({ currentPhase, winCondition }) => {
  const currentIndex = PHASES.findIndex(p => p.id === currentPhase);

  return (
    <div className="w-full bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm flex flex-col">
      {/* Win Condition Header */}
      {winCondition && (
        <div className="bg-slate-900 text-white px-4 py-2 flex items-center justify-center gap-2 text-xs sm:text-sm animate-fade-in relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-slate-900 to-blue-900 opacity-50"></div>
          <Zap size={14} className="text-yellow-400 fill-yellow-400 animate-pulse relative z-10" />
          <span className="font-bold text-yellow-400 relative z-10 whitespace-nowrap">
            WIN CONDITION:
          </span>
          <span className="font-medium truncate relative z-10">{winCondition.description}</span>
        </div>
      )}

      {/* Progress Bar */}
      <div className="px-4 py-3 overflow-x-auto scrollbar-hide">
        <div className="flex items-center justify-between min-w-[500px] max-w-4xl mx-auto">
          {PHASES.map((phase, index) => {
            const isActive = phase.id === currentPhase;
            const isPast = index < currentIndex;
            const Icon = phase.icon;

            return (
              <div
                key={phase.id}
                className="flex items-center flex-1 last:flex-none group relative"
              >
                <div
                  className={`flex flex-col items-center gap-1 relative z-10 px-2 ${isActive ? 'scale-110 transition-transform' : ''}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 ring-2 ring-blue-100'
                        : isPast
                          ? 'bg-slate-800 text-white'
                          : 'bg-slate-100 text-slate-300'
                    }`}
                  >
                    <Icon size={14} />
                  </div>
                  <span
                    className={`text-[10px] font-bold whitespace-nowrap transition-colors duration-300 ${
                      isActive ? 'text-blue-700' : isPast ? 'text-slate-600' : 'text-slate-300'
                    }`}
                  >
                    {phase.label}
                  </span>

                  {/* Tooltip */}
                  {isActive && (
                    <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded shadow-xl whitespace-nowrap animate-fade-in-up z-20">
                      {phase.desc}
                      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-800 rotate-45"></div>
                    </div>
                  )}
                </div>

                {index < PHASES.length - 1 && (
                  <div className="flex-1 h-0.5 mx-2 bg-slate-100 relative">
                    <div
                      className="absolute top-0 left-0 h-full bg-slate-800 transition-all duration-700 ease-out"
                      style={{ width: isPast ? '100%' : '0%' }}
                    ></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});
