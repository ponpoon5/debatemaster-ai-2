import React from 'react';
import { CheckCircle2, X, ArrowRight } from 'lucide-react';
import { Button } from '../Button';

interface DefinitionQuizViewProps {
  data: any;
  evaluationResult: { isCorrect: boolean; feedback: string } | null;
  onAnswer: (flawType: string) => void;
  onNext: () => void;
}

const DEFINITION_FLAWS = [
  {
    label: '過包摂 (広すぎる)',
    value: 'Over-inclusive',
    desc: '本来含まれないものまで含んでしまっている',
  },
  {
    label: '過小包摂 (狭すぎる)',
    value: 'Under-inclusive',
    desc: '本来含むべきものを除外してしまっている',
  },
  { label: '循環定義', value: 'Circular', desc: '定義の中にその言葉自体を使ってしまっている' },
];

export const DefinitionQuizView: React.FC<DefinitionQuizViewProps> = ({
  data,
  evaluationResult,
  onAnswer,
  onNext,
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
        <h4 className="text-xs font-bold text-slate-500 uppercase mb-4">定義の弱点を見抜く</h4>
        <div className="space-y-4 mb-4">
          <div className="bg-white p-3 rounded-lg border border-slate-100">
            <span className="font-bold text-indigo-600 block mb-1">言葉</span>
            <p className="font-bold text-slate-800">{data.word}</p>
          </div>
          <div className="bg-white p-3 rounded-lg border border-slate-100">
            <span className="font-bold text-slate-400 block mb-1">提案された定義</span>
            <p className="font-bold text-slate-800">「{data.definition}」</p>
          </div>
          <div className="bg-rose-50 p-3 rounded-lg border border-rose-100">
            <span className="font-bold text-rose-500 block mb-1">反例 (Counter-example)</span>
            <p className="font-bold text-rose-900">{data.counterExample}</p>
          </div>
        </div>
        <p className="text-sm font-bold text-slate-600 text-center">
          この定義には、どのような論理的欠陥がありますか？
        </p>
      </div>

      {!evaluationResult ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {DEFINITION_FLAWS.map(flaw => (
            <button
              key={flaw.value}
              onClick={() => onAnswer(flaw.value)}
              className="p-4 rounded-xl border border-slate-200 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-800 transition-all text-left group"
            >
              <span className="block font-bold text-sm mb-1">{flaw.label}</span>
              <span className="text-[10px] text-slate-400 group-hover:text-indigo-600">
                {flaw.desc}
              </span>
            </button>
          ))}
        </div>
      ) : (
        <div className="animate-pop-in mt-6">
          <div
            className={`p-6 rounded-xl border-2 mb-6 ${evaluationResult.isCorrect ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'}`}
          >
            <div className="flex items-center gap-3 mb-3">
              {evaluationResult.isCorrect ? (
                <div className="bg-emerald-100 p-1 rounded-full text-emerald-600">
                  <CheckCircle2 size={24} />
                </div>
              ) : (
                <div className="bg-rose-100 p-1 rounded-full text-rose-600">
                  <X size={24} />
                </div>
              )}
              <h4
                className={`text-lg font-bold ${evaluationResult.isCorrect ? 'text-emerald-800' : 'text-rose-800'}`}
              >
                {evaluationResult.isCorrect
                  ? '正解！素晴らしい理解です。'
                  : '惜しい！もう一歩です。'}
              </h4>
            </div>
            <p className="text-slate-700 leading-relaxed bg-white/50 p-4 rounded-lg whitespace-pre-wrap">
              {evaluationResult.feedback}
            </p>
          </div>
          <div className="text-center">
            <Button onClick={onNext} className="bg-slate-800 text-white shadow-lg">
              <ArrowRight size={18} className="mr-2" /> 次の問題へ
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
