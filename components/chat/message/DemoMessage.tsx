import React from 'react';
import { DemoTurn } from '../../../core/types';
import { MessageSquare, BrainCircuit, AlertTriangle, Sparkles, Target } from 'lucide-react';

interface DemoMessageProps {
  data: DemoTurn;
}

export const DemoMessage: React.FC<DemoMessageProps> = ({ data }) => {
  const isPro = data.speaker === 'PRO';
  const align = isPro ? 'flex-row' : 'flex-row-reverse';
  const bubbleColor = isPro
    ? 'bg-indigo-50 border-indigo-200 text-indigo-900'
    : 'bg-rose-50 border-rose-200 text-rose-900';
  const avatarColor = isPro ? 'bg-indigo-600' : 'bg-rose-600';
  const name = data.speakerName || (isPro ? 'Alice' : 'Bob');

  return (
    <div className={`flex items-end gap-3 animate-message-in relative ${align} mb-6`}>
      <div
        className={`w-10 h-10 rounded-full flex flex-col items-center justify-center shrink-0 shadow-sm ${avatarColor} text-white relative z-10`}
      >
        {isPro ? (
          <MessageSquare size={18} />
        ) : (
          <MessageSquare size={18} className="transform scale-x-[-1]" />
        )}
        <span className="absolute -bottom-5 text-[10px] font-bold text-slate-500 whitespace-nowrap">
          {name}
        </span>
      </div>

      <div className={`flex flex-col max-w-[85%] md:max-w-[70%] relative gap-2`}>
        <div
          className={`p-4 rounded-2xl border ${bubbleColor} shadow-sm text-sm md:text-base leading-relaxed whitespace-pre-wrap rounded-${isPro ? 'bl' : 'br'}-none`}
        >
          {data.text}
        </div>

        <div
          className={`mt-2 p-3 rounded-xl border-l-4 shadow-sm text-xs bg-white animate-fade-in ${
            data.analysis.type === 'LOGIC'
              ? 'border-l-blue-500'
              : data.analysis.type === 'FALLACY'
                ? 'border-l-red-500'
                : data.analysis.type === 'RHETORIC'
                  ? 'border-l-purple-500'
                  : 'border-l-green-500'
          }`}
        >
          <div className="flex items-center gap-2 mb-1.5 font-bold">
            {data.analysis.type === 'LOGIC' && <BrainCircuit size={14} className="text-blue-500" />}
            {data.analysis.type === 'FALLACY' && (
              <AlertTriangle size={14} className="text-red-500" />
            )}
            {data.analysis.type === 'RHETORIC' && (
              <Sparkles size={14} className="text-purple-500" />
            )}
            {data.analysis.type === 'STRATEGY' && <Target size={14} className="text-green-500" />}

            <span
              className={`uppercase tracking-wider ${
                data.analysis.type === 'LOGIC'
                  ? 'text-blue-700'
                  : data.analysis.type === 'FALLACY'
                    ? 'text-red-700'
                    : data.analysis.type === 'RHETORIC'
                      ? 'text-purple-700'
                      : 'text-green-700'
              }`}
            >
              {data.analysis.highlight}
            </span>
          </div>
          <p className="text-slate-600 leading-relaxed mb-1.5">{data.analysis.comment}</p>
          {data.analysis.score && (
            <div className="flex justify-end">
              <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-500 font-bold border border-slate-200">
                Quality: {data.analysis.score}/10
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
