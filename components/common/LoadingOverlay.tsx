import React from 'react';
import { ScanSearch, Check, Hourglass, CheckCircle2, Loader2, Lightbulb } from 'lucide-react';

interface LoadingOverlayProps {
  isVisible: boolean;
  progress: number;
  estimatedSeconds: number;
  elapsedSeconds: number;
  currentTip: string;
}

const LOADING_STEPS = [
  { label: '議論ログの解析', threshold: 0 },
  { label: '論理構造の抽出', threshold: 25 },
  { label: 'スコア算出・評価', threshold: 50 },
  { label: 'レポート生成・整形', threshold: 80 },
];

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isVisible,
  progress,
  estimatedSeconds,
  elapsedSeconds,
  currentTip,
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in transition-all duration-500">
      <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center max-w-sm w-full border border-slate-200 animate-pop-in relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-pulse"></div>

        <div className="relative mb-4 mt-2">
          <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-20 duration-1000"></div>
          <div className="bg-gradient-to-br from-white to-blue-50 p-4 rounded-full shadow-md border border-blue-100 relative z-10">
            <ScanSearch size={32} className="text-blue-600 animate-pulse" />
          </div>
        </div>

        <h3 className="font-bold text-slate-800 text-xl mb-1">AI分析を実行中</h3>
        <p className="text-xs text-slate-400 mb-6 font-medium">Gemini 2.5 Flash Model</p>

        <div className="w-full space-y-2 mb-6">
          <div className="flex justify-between text-xs font-bold text-slate-600 px-1">
            <span>Progress</span>
            <span>{Math.floor(progress)}%</span>
          </div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-300 ease-out shadow-sm relative overflow-hidden"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-white/30 animate-[shimmer_2s_infinite] transform -skew-x-12"></div>
            </div>
          </div>
        </div>

        <div className="w-full space-y-3 mb-6">
          {LOADING_STEPS.map((step, i) => {
            const isActive =
              progress >= step.threshold && progress < (LOADING_STEPS[i + 1]?.threshold || 100);
            const isCompleted = progress >= (LOADING_STEPS[i + 1]?.threshold || 100);

            return (
              <div
                key={i}
                className={`flex items-center gap-3 transition-all duration-300 ${isActive ? 'scale-105 opacity-100' : isCompleted ? 'opacity-100 grayscale-0' : 'opacity-40 grayscale'}`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center border-2 shrink-0 transition-colors ${
                    isCompleted
                      ? 'bg-green-500 border-green-500 text-white'
                      : isActive
                        ? 'border-blue-500 text-blue-500 animate-pulse'
                        : 'border-slate-300 text-slate-300 bg-slate-50'
                  }`}
                >
                  {isCompleted ? (
                    <Check size={12} strokeWidth={3} />
                  ) : isActive ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : (
                    <span className="text-[10px]">{i + 1}</span>
                  )}
                </div>
                <span
                  className={`text-xs font-bold ${isCompleted ? 'text-green-700' : isActive ? 'text-blue-700' : 'text-slate-500'}`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        <div className="w-full bg-slate-50 rounded-xl p-3 border border-slate-100 flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            {progress < 95 ? (
              <Hourglass size={14} className="animate-pulse" />
            ) : (
              <CheckCircle2 size={14} className="text-green-500" />
            )}
            <span>{progress < 95 ? '完了見込み:' : 'まもなく完了'}</span>
          </div>
          <div className="text-xs font-mono font-medium text-slate-700">
            {progress < 95 ? (
              <span>あと {Math.max(0, Math.ceil(estimatedSeconds - elapsedSeconds))} 秒</span>
            ) : (
              <span className="text-green-600 animate-pulse">仕上げ中...</span>
            )}
          </div>
        </div>

        <div className="w-full border-t border-slate-100 pt-4 text-center">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2 flex items-center justify-center gap-1">
            <Lightbulb size={12} className="text-yellow-500" /> Debate Tips
          </p>
          <p className="text-xs text-slate-600 font-medium italic animate-fade-in leading-relaxed">
            {currentTip}
          </p>
        </div>
      </div>
    </div>
  );
};
