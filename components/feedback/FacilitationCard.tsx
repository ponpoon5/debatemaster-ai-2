import React from 'react';
import { FacilitationAnalysis } from '../../core/types';
import { Handshake, Lightbulb } from 'lucide-react';

interface FacilitationCardProps {
  facilitation: FacilitationAnalysis;
}

export const FacilitationCard: React.FC<FacilitationCardProps> = ({ facilitation }) => {
  // Helper to ensure scores display as 1-10 range (AI sometimes returns out of 100)
  const formatScore = (val: number) => (val > 10 ? (val / 10).toFixed(1) : val);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-green-200 animate-fade-in mb-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-green-100 p-2 rounded-lg text-green-600">
          <Handshake size={24} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-800">ファシリテーション分析</h3>
          <p className="text-xs text-slate-500">合意形成（コンセンサス）に向けた進行の評価</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center text-sm font-bold text-slate-700">
            <span>理解・共感</span>
            <span className="text-green-600">
              {formatScore(facilitation.understandingScore)}/10
            </span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500"
              style={{
                width: `${Math.min(facilitation.understandingScore > 10 ? facilitation.understandingScore : facilitation.understandingScore * 10, 100)}%`,
              }}
            ></div>
          </div>
          <p className="text-xs text-slate-500">双方の意見を正しく理解し、受け止められたか</p>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center text-sm font-bold text-slate-700">
            <span>議論の整理</span>
            <span className="text-blue-600">{formatScore(facilitation.organizingScore)}/10</span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500"
              style={{
                width: `${Math.min(facilitation.organizingScore > 10 ? facilitation.organizingScore : facilitation.organizingScore * 10, 100)}%`,
              }}
            ></div>
          </div>
          <p className="text-xs text-slate-500">論点を明確にし、構造化できたか</p>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center text-sm font-bold text-slate-700">
            <span>合意形成</span>
            <span className="text-amber-600">{formatScore(facilitation.consensusScore)}/10</span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-500"
              style={{
                width: `${Math.min(facilitation.consensusScore > 10 ? facilitation.consensusScore : facilitation.consensusScore * 10, 100)}%`,
              }}
            ></div>
          </div>
          <p className="text-xs text-slate-500">対立を乗り越え、結論へ導けたか</p>
        </div>
      </div>

      <div className="bg-green-50 p-4 rounded-xl border border-green-100 text-green-900 leading-relaxed text-sm">
        <span className="font-bold block mb-2 flex items-center gap-2">
          <Lightbulb size={16} /> フィードバック
        </span>
        {facilitation.feedback}
      </div>
    </div>
  );
};
