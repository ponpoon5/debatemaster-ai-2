import React from 'react';
import { CheckCircle2, X, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '../Button';

interface StandardQuizViewProps {
  problem: string;
  userAnswer: string;
  setUserAnswer: (val: string) => void;
  evaluationResult: { isCorrect: boolean; feedback: string } | null;
  isEvaluating: boolean;
  onSubmit: () => void;
  onCancel: () => void;
  onNext: () => void;
}

export const StandardQuizView: React.FC<StandardQuizViewProps> = ({
  problem,
  userAnswer,
  setUserAnswer,
  evaluationResult,
  isEvaluating,
  onSubmit,
  onCancel,
  onNext,
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
        <span className="text-xs font-bold text-slate-500 uppercase block mb-2">Question</span>
        <p className="text-lg font-bold text-slate-800">{problem}</p>
      </div>

      {!evaluationResult ? (
        <div className="space-y-4">
          <textarea
            value={userAnswer}
            onChange={e => setUserAnswer(e.target.value)}
            className="w-full p-4 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-200 outline-none min-h-[100px] bg-white text-slate-800"
            placeholder="回答を入力してください..."
          />
          <div className="flex justify-end gap-3">
            <Button onClick={onCancel} variant="ghost" className="text-slate-500">
              キャンセル
            </Button>
            <Button
              onClick={onSubmit}
              disabled={!userAnswer.trim() || isEvaluating}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {isEvaluating ? <Loader2 className="animate-spin" /> : '回答する'}
            </Button>
          </div>
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
