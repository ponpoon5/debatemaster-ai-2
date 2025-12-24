import React from 'react';
import { DebateType } from '../../core/types';
import { Scale, Microscope, Sparkles } from 'lucide-react';

interface DebateTypeCardsProps {
  debateType: DebateType;
  setDebateType: (type: DebateType) => void;
}

export const DebateTypeCards: React.FC<DebateTypeCardsProps> = ({ debateType, setDebateType }) => {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-3">
        論題の種類（Debate Type）
      </label>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <button
          type="button"
          onClick={() => setDebateType(DebateType.POLICY)}
          className={`flex flex-col p-4 rounded-xl border-2 transition-all duration-200 text-left relative overflow-hidden group ${
            debateType === DebateType.POLICY
              ? 'border-blue-500 bg-blue-50/50 text-blue-900 shadow-md'
              : 'border-slate-100 hover:border-blue-200 text-slate-500 hover:bg-slate-50'
          }`}
        >
          <div
            className={`p-2 rounded-lg w-fit mb-2 transition-colors ${debateType === DebateType.POLICY ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500'}`}
          >
            <Scale size={20} />
          </div>
          <span className="font-bold text-sm mb-1">政策論題 (Policy)</span>
          <span className="text-xs opacity-80 leading-tight">
            行動・ルールの是非。
            <br />
            「～すべきか」
          </span>
        </button>

        <button
          type="button"
          onClick={() => setDebateType(DebateType.FACT)}
          className={`flex flex-col p-4 rounded-xl border-2 transition-all duration-200 text-left relative overflow-hidden group ${
            debateType === DebateType.FACT
              ? 'border-indigo-500 bg-indigo-50/50 text-indigo-900 shadow-md'
              : 'border-slate-100 hover:border-indigo-200 text-slate-500 hover:bg-slate-50'
          }`}
        >
          <div
            className={`p-2 rounded-lg w-fit mb-2 transition-colors ${debateType === DebateType.FACT ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500'}`}
          >
            <Microscope size={20} />
          </div>
          <span className="font-bold text-sm mb-1">推定論題 (Fact)</span>
          <span className="text-xs opacity-80 leading-tight">
            事実の真偽や予測。
            <br />
            「～であるか」
          </span>
        </button>

        <button
          type="button"
          onClick={() => setDebateType(DebateType.VALUE)}
          className={`flex flex-col p-4 rounded-xl border-2 transition-all duration-200 text-left relative overflow-hidden group ${
            debateType === DebateType.VALUE
              ? 'border-pink-500 bg-pink-50/50 text-pink-900 shadow-md'
              : 'border-slate-100 hover:border-pink-200 text-slate-500 hover:bg-slate-50'
          }`}
        >
          <div
            className={`p-2 rounded-lg w-fit mb-2 transition-colors ${debateType === DebateType.VALUE ? 'bg-pink-100 text-pink-600' : 'bg-slate-100 text-slate-400 group-hover:bg-pink-50 group-hover:text-pink-500'}`}
          >
            <Sparkles size={20} />
          </div>
          <span className="font-bold text-sm mb-1">価値論題 (Value)</span>
          <span className="text-xs opacity-80 leading-tight">
            価値観の善悪・優劣。
            <br />
            「～は善か」
          </span>
        </button>
      </div>
    </div>
  );
};
