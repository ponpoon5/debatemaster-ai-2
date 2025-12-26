import React from 'react';
import { TokenUsage } from '../../core/types';
import { Calendar, Coins, DollarSign, Tag, Info, FileText } from 'lucide-react';

interface TokenStatusProps {
  tokenUsage: TokenUsage;
  archivesCount: number;
  onShowHistory: () => void;
  onShowSystemInfo?: () => void;
  onShowSpecification?: () => void;
}

export const TokenStatus: React.FC<TokenStatusProps> = React.memo(({
  tokenUsage,
  archivesCount,
  onShowHistory,
  onShowSystemInfo,
  onShowSpecification,
}) => {
  const calculateEstimatedCost = (usage: TokenUsage) => {
    const inputCost = (usage.inputTokens / 1_000_000) * 0.075;
    const outputCost = (usage.outputTokens / 1_000_000) * 0.3;
    const totalUSD = inputCost + outputCost;
    const totalJPY = totalUSD * 150;

    const totalTokens = usage.totalTokens;
    const ratePer1kUSD = totalTokens > 0 ? (totalUSD / totalTokens) * 1000 : 0;
    const ratePer1kJPY = totalTokens > 0 ? (totalJPY / totalTokens) * 1000 : 0;

    return { usd: totalUSD, jpy: totalJPY, ratePer1kUSD, ratePer1kJPY };
  };

  const cost = calculateEstimatedCost(tokenUsage);

  return (
    <>
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 animate-fade-in z-10 flex gap-2">
        <button
          onClick={onShowHistory}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-slate-600 rounded-lg border border-slate-200 text-xs font-medium shadow-sm transition-all hover:bg-slate-50 hover:text-blue-600"
        >
          <Calendar size={14} className="text-slate-400" />
          <span>履歴 ({archivesCount})</span>
        </button>

        <button
          onClick={onShowSystemInfo}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-slate-600 rounded-lg border border-slate-200 text-xs font-medium shadow-sm transition-all hover:bg-slate-50 hover:text-blue-600"
          title="システム構成を表示"
        >
          <Info size={14} className="text-slate-400" />
          <span className="hidden sm:inline">System</span>
        </button>

        <button
          onClick={onShowSpecification}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-slate-600 rounded-lg border border-slate-200 text-xs font-medium shadow-sm transition-all hover:bg-slate-50 hover:text-indigo-600"
          title="アプリの仕様書を表示"
        >
          <FileText size={14} className="text-slate-400" />
          <span className="hidden sm:inline">仕様書</span>
        </button>
      </div>

      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 animate-fade-in flex flex-col items-end gap-1.5 z-10">
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg border border-slate-200 text-xs font-medium shadow-sm transition-all hover:bg-slate-200"
          title={`Input: ${tokenUsage.inputTokens.toLocaleString()}, Output: ${tokenUsage.outputTokens.toLocaleString()}`}
        >
          <Coins size={14} className="text-slate-400" />
          <span>{tokenUsage.totalTokens.toLocaleString()} tokens</span>
        </div>

        {tokenUsage.totalTokens > 0 && (
          <div className="flex flex-col items-end bg-white/80 backdrop-blur-sm rounded-lg border border-slate-100 shadow-sm p-2 gap-1 transition-all hover:shadow-md">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600">
              <DollarSign size={12} className="text-slate-400" />
              <span>Total: ${cost.usd.toFixed(6)}</span>
              <span className="text-slate-400 border-l border-slate-200 pl-1.5 ml-0.5">
                ({cost.jpy.toFixed(2)}円)
              </span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-slate-400">
              <Tag size={10} />
              <span>@1k tokens: ${cost.ratePer1kUSD.toFixed(6)}</span>
              <span className="border-l border-slate-200 pl-1 ml-1">
                ({cost.ratePer1kJPY.toFixed(4)}円)
              </span>
            </div>
          </div>
        )}
      </div>
    </>
  );
});
