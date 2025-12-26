import React from 'react';
import { QuestioningStats, QuestionAnalysis } from '../../core/types';
import { MessageCircleQuestion, Lightbulb } from 'lucide-react';

interface QuestioningCardProps {
  stats: QuestioningStats;
  details: QuestionAnalysis[];
}

export const QuestioningCard: React.FC<QuestioningCardProps> = React.memo(({ stats, details }) => {
  // スコアを10点満点にクリップ
  const clampedScore = Math.min(Math.max(stats.score, 0), 10);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-violet-100 p-2 rounded-lg text-violet-600">
          <MessageCircleQuestion size={24} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-800">質問力分析 (Questioning Skills)</h3>
          <p className="text-xs text-slate-500">相手の思考を深め、議論を展開させる質問の質を評価</p>
        </div>
      </div>

      {/* Overall Score & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Main Score */}
        <div className="bg-violet-50 rounded-xl p-5 border border-violet-100 flex flex-col items-center justify-center text-center">
          <span className="text-xs font-bold uppercase text-violet-600 tracking-wider mb-2">
            Questioning Score
          </span>
          <span className="text-4xl font-bold text-slate-800 mb-2">{clampedScore}/10</span>
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${i < clampedScore / 2 ? 'bg-violet-500' : 'bg-violet-200'}`}
              />
            ))}
          </div>
        </div>

        {/* Type Counts */}
        <div className="lg:col-span-2 grid grid-cols-3 gap-3">
          <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-blue-600 mb-1">{stats.openCount}</span>
            <span className="text-[10px] font-bold text-slate-500 uppercase">Open</span>
            <span className="text-[9px] text-slate-400">思考を広げる</span>
          </div>
          <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-slate-600 mb-1">{stats.closedCount}</span>
            <span className="text-[10px] font-bold text-slate-500 uppercase">Closed</span>
            <span className="text-[9px] text-slate-400">事実確認・決断</span>
          </div>
          <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-pink-600 mb-1">{stats.subtleCount}</span>
            <span className="text-[10px] font-bold text-slate-500 uppercase">Subtle</span>
            <span className="text-[9px] text-slate-400">誘導・本音探索</span>
          </div>
        </div>
      </div>

      {/* Advice */}
      <div className="mb-8 bg-slate-50 border-l-4 border-violet-500 p-4 rounded-r-lg">
        <h4 className="text-sm font-bold text-violet-700 mb-1 flex items-center gap-2">
          <Lightbulb size={16} /> コーチからのアドバイス
        </h4>
        <p className="text-sm text-slate-700 leading-relaxed">{stats.advice}</p>
      </div>

      {/* Detailed List */}
      <div className="space-y-4">
        <h4 className="text-sm font-bold text-slate-700 border-b border-slate-100 pb-2">
          検出された質問リスト
        </h4>

        {details.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-4">
            今回の議論では明確な質問が検出されませんでした。
          </p>
        ) : (
          details.map((q, idx) => (
            <div key={idx} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <div className="flex items-start justify-between mb-2">
                <div className="flex gap-2">
                  {q.type === 'OPEN' && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700">
                      OPEN
                    </span>
                  )}
                  {q.type === 'CLOSED' && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600">
                      CLOSED
                    </span>
                  )}
                  {q.type === 'SUBTLE' && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-pink-100 text-pink-700">
                      SUBTLE
                    </span>
                  )}
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-violet-50 text-violet-600">
                    効果: {q.effectiveness}/10
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">#{q.messageIndex + 1}</span>
              </div>

              <p className="text-slate-800 font-medium text-sm mb-3">"{q.questionText}"</p>

              <div className="text-xs bg-slate-50 p-2 rounded text-slate-600 leading-relaxed">
                <span className="font-bold text-slate-500 mr-1">評価:</span>
                {q.comment}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
});
