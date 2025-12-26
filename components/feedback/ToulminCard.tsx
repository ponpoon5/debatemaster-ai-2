import React from 'react';
import { LogicStructure, ToulminElement } from '../../core/types';
import { Crown, AlertTriangle, ArrowRight, ArrowDown } from 'lucide-react';

interface ToulminCardProps {
  structure: LogicStructure;
}

export const ToulminCard: React.FC<ToulminCardProps> = React.memo(({ structure }) => {
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'strong':
        return 'bg-emerald-50 border-emerald-200 text-emerald-800';
      case 'weak':
        return 'bg-amber-50 border-amber-200 text-amber-800 border-dashed';
      case 'missing':
        return 'bg-red-50 border-red-200 text-red-800 border-dashed';
      default:
        return 'bg-slate-50 border-slate-200';
    }
  };

  const ElementBox = ({ title, el }: { title: string; el: ToulminElement }) => (
    <div
      className={`p-3 rounded-lg border ${getStatusStyle(el.status)} flex-1 flex flex-col relative min-h-[100px]`}
    >
      <div className="flex justify-between items-center mb-1">
        <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">{title}</span>
        {el.status === 'missing' && (
          <span className="text-[10px] font-bold bg-white/50 px-1.5 rounded">欠落</span>
        )}
        {el.status === 'weak' && (
          <span className="text-[10px] font-bold bg-white/50 px-1.5 rounded">弱い</span>
        )}
      </div>
      <p className="text-sm font-medium leading-snug flex-1">
        {el.text || <span className="italic opacity-50">（記述なし）</span>}
      </p>
      {el.comment && (
        <div className="mt-2 pt-2 border-t border-black/10 text-xs opacity-90">💡 {el.comment}</div>
      )}
    </div>
  );

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-6">
      <div className="flex items-center gap-2 mb-4">
        {structure.type === 'best' ? (
          <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1">
            <Crown size={12} /> BEST ARGUMENT
          </span>
        ) : (
          <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1">
            <AlertTriangle size={12} /> NEEDS IMPROVEMENT
          </span>
        )}
        <h4 className="font-bold text-slate-700 text-sm truncate flex-1">{structure.summary}</h4>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-4 relative">
          <ElementBox title="Data（事実・根拠）" el={structure.data} />

          {/* Warrant Bridge */}
          <div className="hidden md:flex flex-col items-center justify-center text-slate-400 z-10">
            <ArrowRight size={20} />
          </div>

          <ElementBox title="Warrant（論拠・つなぎ）" el={structure.warrant} />
        </div>

        <div className="flex items-center justify-center text-slate-400 -my-2 z-0 relative">
          <ArrowDown size={20} />
          {/* Horizontal line connector for desktop visuals */}
          <div className="absolute top-1/2 left-1/4 right-1/4 h-px bg-slate-200 -z-10 hidden md:block"></div>
        </div>

        <div className="flex justify-center">
          <div
            className={`w-full md:w-2/3 p-4 rounded-xl border ${getStatusStyle(structure.claim.status)} text-center`}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider opacity-70 block mb-1">
              Claim（主張・結論）
            </span>
            <p className="text-base font-bold">{structure.claim.text}</p>
            {structure.claim.comment && (
              <p className="mt-1 text-xs opacity-80">{structure.claim.comment}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});
