import React from 'react';
import { CheckCircle2, X, ArrowRight } from 'lucide-react';
import { Button } from '../Button';

interface WeighingQuizViewProps {
  data: any;
  evaluationResult: { isCorrect: boolean; feedback: string } | null;
  onAnswer: (criteria: string) => void;
  onNext: () => void;
}

const WEIGHING_CRITERIA = [
  { label: 'Magnitude (大きさ・規模)', value: 'Magnitude' },
  { label: 'Probability (発生確率)', value: 'Probability' },
  { label: 'Timeframe (時間軸)', value: 'Timeframe' },
  { label: 'Reversibility (可逆性)', value: 'Reversibility' },
];

export const WeighingQuizView: React.FC<WeighingQuizViewProps> = ({
  data,
  evaluationResult,
  onAnswer,
  onNext,
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
        <h4 className="text-xs font-bold text-slate-500 uppercase mb-4">Weighing Scenario</h4>
        <p className="text-slate-800 font-medium mb-6 leading-relaxed">{data.scenario}</p>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-white p-3 rounded-lg border border-slate-100">
            <span className="font-bold text-blue-600 block mb-1">選択肢 A</span>
            {data.optionA}
          </div>
          <div className="bg-white p-3 rounded-lg border border-slate-100">
            <span className="font-bold text-emerald-600 block mb-1">選択肢 B</span>
            {data.optionB}
          </div>
        </div>
        <p className="mt-4 text-sm font-bold text-slate-600 text-center">
          この対立を解決するのに最適な基準は？
        </p>
      </div>

      {!evaluationResult ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {WEIGHING_CRITERIA.map(c => (
            <button
              key={c.value}
              onClick={() => onAnswer(c.value)}
              className="p-4 rounded-xl border border-slate-200 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-800 transition-all font-bold text-center text-slate-600 text-sm"
            >
              {c.label}
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
