import React, { useState } from 'react';
import { Button } from '../Button';
import { DefinitionLabResult, TokenUsage } from '../../core/types';
import { FlaskConical, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';
import { challengeDefinition } from '../../services/gemini/index';

interface DefinitionLabProps {
  onTokenUpdate: (usage: TokenUsage) => void;
}

export const DefinitionLab: React.FC<DefinitionLabProps> = ({ onTokenUpdate }) => {
  const [defState, setDefState] = useState({ word: '', definition: '' });
  const [defResult, setDefResult] = useState<DefinitionLabResult | null>(null);
  const [isLabLoading, setIsLabLoading] = useState(false);

  const handleDefinitionCheck = async () => {
    if (!defState.word || !defState.definition) return;
    setIsLabLoading(true);
    try {
      const { result, usage } = await challengeDefinition(defState.word, defState.definition);
      setDefResult(result);
      onTokenUpdate(usage);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLabLoading(false);
    }
  };

  return (
    <div className="bg-indigo-50/50 rounded-2xl p-6 border border-indigo-100">
      <div className="flex items-center gap-2 mb-4 text-indigo-800">
        <FlaskConical size={24} />
        <h3 className="font-bold text-lg">定義の抜け穴チェッカー</h3>
      </div>
      <p className="text-sm text-indigo-900/80 mb-4">
        言葉を定義してみてください。AIが「ソクラテス」となって、その定義に当てはまらない反例（Counter-example）を突きつけます。
      </p>
      <div className="space-y-3">
        <input
          value={defState.word}
          onChange={e => setDefState({ ...defState, word: e.target.value })}
          className="w-full p-2 rounded border border-slate-200 text-sm"
          placeholder="言葉（例：スポーツ）"
        />
        <textarea
          value={defState.definition}
          onChange={e => setDefState({ ...defState, definition: e.target.value })}
          className="w-full p-2 rounded border border-slate-200 text-sm"
          placeholder="あなたの定義（例：体を動かして競い合う競技）"
          rows={2}
        />
      </div>
      <div className="mt-4 text-right">
        <Button
          onClick={handleDefinitionCheck}
          disabled={isLabLoading}
          className="bg-indigo-600 text-white"
        >
          {isLabLoading ? <Loader2 className="animate-spin" /> : '定義をテストする'}
        </Button>
      </div>

      {defResult && (
        <div
          className={`mt-6 bg-white p-4 rounded-xl border animate-pop-in ${defResult.isRobust ? 'border-emerald-200 bg-emerald-50' : 'border-rose-200 bg-rose-50'}`}
        >
          <div className="flex items-center gap-2 mb-2">
            {defResult.isRobust ? (
              <CheckCircle2 className="text-emerald-600" />
            ) : (
              <AlertTriangle className="text-rose-600" />
            )}
            <span
              className={`font-bold ${defResult.isRobust ? 'text-emerald-700' : 'text-rose-700'}`}
            >
              {defResult.isRobust ? '堅牢な定義です！' : '抜け穴が見つかりました'}
            </span>
          </div>
          {!defResult.isRobust && (
            <div className="mb-3 text-slate-800 font-bold bg-white/60 p-2 rounded">
              反例: 「{defResult.counterExample}」
            </div>
          )}
          <p className="text-sm text-slate-600 leading-relaxed">{defResult.explanation}</p>
        </div>
      )}
    </div>
  );
};
