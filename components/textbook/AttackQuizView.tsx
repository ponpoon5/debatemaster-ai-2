import React from 'react';
import { CheckCircle2, X, ArrowRight } from 'lucide-react';
import { Button } from '../Button';

interface AttackQuizData {
  opponentClaim: string;
  rebuttal: string;
  correctAttackType?: number;
}

interface AttackQuizViewProps {
  data: AttackQuizData;
  evaluationResult: { isCorrect: boolean; feedback: string } | null;
  onAnswer: (index: number) => void;
  onNext: () => void;
}

const ATTACK_TYPES = [
  'Claim攻撃 (結論)',
  'Reason攻撃 (理由)',
  'Evidence攻撃 (証拠)',
  'Warrant攻撃 (論拠)',
  '定義攻撃',
  '比重攻撃 (Weighing)',
  '論点ずらし指摘',
];

export const AttackQuizView: React.FC<AttackQuizViewProps> = React.memo(({
  data,
  evaluationResult,
  onAnswer,
  onNext,
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
        <h4 className="text-xs font-bold text-slate-500 uppercase mb-4">Challenge</h4>
        <div className="bg-white p-4 rounded-lg border border-slate-100 mb-4">
          <span className="text-xs font-bold text-slate-400 block mb-1">相手の主張</span>
          <p className="font-bold text-slate-800">{data.opponentClaim}</p>
        </div>
        <div className="bg-rose-50 p-4 rounded-lg border border-rose-100">
          <span className="text-xs font-bold text-rose-400 block mb-1">反論</span>
          <p className="font-bold text-rose-900">{data.rebuttal}</p>
        </div>
        <p className="mt-4 text-sm font-bold text-slate-600 text-center">この反論はどのタイプ？</p>
      </div>

      {!evaluationResult ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {ATTACK_TYPES.map((type, idx) => (
            <button
              key={idx}
              onClick={() => onAnswer(idx)}
              className="p-4 rounded-xl border border-slate-200 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-800 transition-all font-bold text-left text-slate-600 text-sm"
            >
              {type}
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
});
