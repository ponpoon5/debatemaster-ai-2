import React from 'react';
import { UtteranceStructureScore, ToulminComponent } from '../../../core/types';
import { GitBranch, HelpCircle, CheckCircle2, AlertCircle, Layers } from 'lucide-react';

interface StructureHeatmapProps {
  score: UtteranceStructureScore;
  variant?: 'compact' | 'detailed';
}

const COMPONENTS: { key: ToulminComponent; label: string; short: string; desc: string }[] = [
  { key: 'CLAIM', label: '主張 (Claim)', short: 'C', desc: '結論・言いたいこと' },
  { key: 'REASON', label: '理由 (Reason)', short: 'R', desc: 'なぜそう思うか' },
  { key: 'EVIDENCE', label: '証拠 (Evidence)', short: 'E', desc: '客観的な事実・データ' },
  { key: 'WARRANT', label: '論拠 (Warrant)', short: 'W', desc: '理由と主張をつなぐ論理' },
  { key: 'BACKING', label: '裏付 (Backing)', short: 'B', desc: '論拠を支える証拠' },
  { key: 'REBUTTAL', label: '考慮 (Rebuttal)', short: 'Re', desc: '反論への想定・譲歩' },
  { key: 'QUALIFICATION', label: '限定 (Qual.)', short: 'Q', desc: '確信度の限定（おそらく等）' },
];

export const StructureHeatmap: React.FC<StructureHeatmapProps> = ({
  score,
  variant = 'compact',
}) => {
  const getColor = (value: number) => {
    if (value < 0.2) return 'bg-slate-100 text-slate-300';
    if (value < 0.5) return 'bg-indigo-100 text-indigo-400';
    if (value < 0.8) return 'bg-indigo-300 text-indigo-700';
    return 'bg-indigo-600 text-white shadow-sm';
  };

  const getWidth = (value: number) => {
    return Math.max(5, value * 100);
  };

  if (variant === 'detailed') {
    return (
      <div className="mt-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm animate-fade-in space-y-6">
        <div>
          <h4 className="text-xs font-black text-slate-400 uppercase mb-3 border-b border-slate-100 pb-2 flex items-center gap-2">
            <Layers size={14} /> 構成要素スコア (Toulmin Components)
          </h4>
          <div className="space-y-3">
            {COMPONENTS.map(comp => {
              const val = score.scores[comp.key] || 0;
              const snippet = score.snippets?.[comp.key];

              return (
                <div key={comp.key} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700 flex items-center gap-2">
                      {comp.label}
                      {val > 0.7 && <span className="text-indigo-600">●</span>}
                    </span>
                    <span className="font-mono text-slate-400">{Math.round(val * 100)}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${getColor(val)}`}
                      style={{ width: `${getWidth(val)}%` }}
                    ></div>
                  </div>
                  {snippet && (
                    <p className="text-[10px] text-slate-500 italic bg-slate-50 p-1.5 rounded border border-slate-100 mt-0.5">
                      "{snippet}"
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {score.scheme && (
          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-xs font-black text-slate-400 uppercase mb-3 flex items-center gap-2">
              <GitBranch size={14} className="text-indigo-500" /> 議論スキームの特定 (Argument
              Scheme)
            </h4>
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3">
              <span className="text-xs font-black text-indigo-700 block mb-1 uppercase tracking-tighter">
                Scheme: {score.scheme.label}
              </span>
              <p className="text-xs text-indigo-900 leading-relaxed">{score.scheme.description}</p>
            </div>
          </div>
        )}

        {score.criticalQuestions && score.criticalQuestions.length > 0 && (
          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-xs font-black text-slate-400 uppercase mb-3 flex items-center gap-2">
              <HelpCircle size={14} className="text-blue-500" /> 批判的質問の検証 (Critical
              Questions)
            </h4>
            <div className="space-y-2">
              {score.criticalQuestions.map((cq, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border text-xs leading-relaxed transition-all ${cq.isAddressed ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'}`}
                >
                  <div className="flex items-start gap-2">
                    {cq.isAddressed ? (
                      <CheckCircle2 size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                    ) : (
                      <AlertCircle size={14} className="text-rose-500 mt-0.5 shrink-0" />
                    )}
                    <div>
                      <p
                        className={`font-bold mb-1 ${cq.isAddressed ? 'text-emerald-800' : 'text-rose-800'}`}
                      >
                        {cq.question}
                      </p>
                      <p className="text-slate-600 opacity-90">{cq.aiComment}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {score.summary && (
          <div className="mt-4 pt-3 border-t border-slate-100">
            <p className="text-xs font-bold text-slate-700 leading-relaxed bg-slate-50 p-2 rounded-lg border border-slate-200">
              <span className="text-blue-600 mr-2 font-black">AI分析概要:</span>
              {score.summary}
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mt-2 animate-fade-in select-none">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
          <GitBranch size={10} /> Logic Mapping
        </span>
        {score.scheme && (
          <span className="text-[8px] bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded font-bold uppercase">
            {score.scheme.label}
          </span>
        )}
      </div>
      <div className="flex gap-0.5 rounded-lg overflow-hidden border border-slate-100 bg-slate-50 p-0.5 w-fit">
        {COMPONENTS.map(comp => {
          const val = score.scores[comp.key] || 0;
          return (
            <div
              key={comp.key}
              className={`w-6 h-6 flex items-center justify-center text-[9px] font-bold rounded-sm transition-colors cursor-help ${getColor(val)}`}
              title={`${comp.label}: ${(val * 100).toFixed(0)}%${score.snippets?.[comp.key] ? `\n"${score.snippets[comp.key]}"` : ''}`}
            >
              {comp.short}
            </div>
          );
        })}
      </div>
      {score.summary && (
        <p className="text-[10px] text-slate-500 mt-1 pl-1 max-w-xs leading-tight opacity-80 font-medium">
          {score.summary}
        </p>
      )}
    </div>
  );
};
