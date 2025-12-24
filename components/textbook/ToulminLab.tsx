import React, { useState } from 'react';
import { Button } from '../Button';
import { ToulminLabResult, TokenUsage } from '../../core/types';
import { Beaker, Loader2 } from 'lucide-react';
import { analyzeToulminConstruction } from '../../services/gemini/index';

interface ToulminLabProps {
  onTokenUpdate: (usage: TokenUsage) => void;
}

export const ToulminLab: React.FC<ToulminLabProps> = ({ onTokenUpdate }) => {
  const [toulminState, setToulminState] = useState({ claim: '', data: '', warrant: '' });
  const [toulminResult, setToulminResult] = useState<ToulminLabResult | null>(null);
  const [isLabLoading, setIsLabLoading] = useState(false);

  const handleToulminCheck = async () => {
    if (!toulminState.claim || !toulminState.data || !toulminState.warrant) return;
    setIsLabLoading(true);
    try {
      const { result, usage } = await analyzeToulminConstruction(
        toulminState.claim,
        toulminState.data,
        toulminState.warrant
      );
      setToulminResult(result);
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
        <Beaker size={24} />
        <h3 className="font-bold text-lg">ロジック構築ラボ</h3>
      </div>
      <p className="text-sm text-indigo-900/80 mb-4">
        実際に3つの要素を入力し、AIに論理の「強固さ」を判定してもらいましょう。
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-xs font-bold text-emerald-600 uppercase">Data (事実)</label>
          <input
            value={toulminState.data}
            onChange={e => setToulminState({ ...toulminState, data: e.target.value })}
            className="w-full p-2 rounded border border-slate-200 text-sm"
            placeholder="例：指紋が見つかった"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-blue-600 uppercase">Claim (主張)</label>
          <input
            value={toulminState.claim}
            onChange={e => setToulminState({ ...toulminState, claim: e.target.value })}
            className="w-full p-2 rounded border border-slate-200 text-sm"
            placeholder="例：彼は有罪だ"
          />
        </div>
        <div className="md:col-span-2">
          <label className="text-xs font-bold text-amber-600 uppercase">Warrant (論拠)</label>
          <input
            value={toulminState.warrant}
            onChange={e => setToulminState({ ...toulminState, warrant: e.target.value })}
            className="w-full p-2 rounded border border-slate-200 text-sm"
            placeholder="例：指紋がある＝犯人である確率が高い"
          />
        </div>
      </div>
      <div className="mt-4 text-right">
        <Button
          onClick={handleToulminCheck}
          disabled={isLabLoading}
          className="bg-indigo-600 text-white"
        >
          {isLabLoading ? <Loader2 className="animate-spin" /> : '論理をテストする'}
        </Button>
      </div>

      {toulminResult && (
        <div className="mt-6 bg-white p-4 rounded-xl border border-indigo-200 animate-pop-in">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-slate-700">診断結果</span>
            <span className="text-xl font-black text-indigo-600">
              {toulminResult.score}
              <span className="text-sm text-slate-400">/100</span>
            </span>
          </div>
          <p className="text-sm text-slate-600 mb-3">{toulminResult.critique}</p>
          <div className="bg-amber-50 p-3 rounded-lg border border-amber-100 text-xs">
            <span className="font-bold text-amber-700 block mb-1">💡 Warrant改善案</span>
            {toulminResult.warrantImprovement}
          </div>
        </div>
      )}
    </div>
  );
};
