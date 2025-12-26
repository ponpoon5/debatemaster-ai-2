import React from 'react';
import { RhetoricAnalysis } from '../../core/types';
import { Heart, CheckCircle2 } from 'lucide-react';

interface RhetoricCardProps {
  rhetoric: RhetoricAnalysis;
}

export const RhetoricCard: React.FC<RhetoricCardProps> = React.memo(({ rhetoric }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mt-6">
      <div className="flex items-center gap-3 mb-6 text-slate-800">
        <Heart size={24} className="text-pink-500" />
        <div>
          <h3 className="text-lg font-bold">説得力・心理分析 (Rhetoric & Psychology)</h3>
          <p className="text-xs text-slate-500">
            アリストテレスの弁論術と心理的アプローチによる評価
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Ethos */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center text-sm font-bold text-slate-700">
            <span>Ethos (信頼性)</span>
            <span className="text-indigo-600">{rhetoric.ethos}/10</span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500"
              style={{ width: `${rhetoric.ethos * 10}%` }}
            ></div>
          </div>
          <p className="text-xs text-slate-500">知的正直さと誠実さの印象</p>
        </div>

        {/* Pathos */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center text-sm font-bold text-slate-700">
            <span>Pathos (感情)</span>
            <span className="text-pink-600">{rhetoric.pathos}/10</span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-pink-500" style={{ width: `${rhetoric.pathos * 10}%` }}></div>
          </div>
          <p className="text-xs text-slate-500">共感やストーリーテリングの活用</p>
        </div>

        {/* Logos */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center text-sm font-bold text-slate-700">
            <span>Logos (論理)</span>
            <span className="text-blue-600">{rhetoric.logos}/10</span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500" style={{ width: `${rhetoric.logos * 10}%` }}></div>
          </div>
          <p className="text-xs text-slate-500">論理的整合性と証拠の強さ</p>
        </div>
      </div>

      <div className="border-t border-slate-100 pt-6">
        <div className="flex items-start gap-4">
          <div
            className={`p-3 rounded-xl shrink-0 ${rhetoric.affirmationScore >= 7 ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}
          >
            <CheckCircle2 size={24} />
          </div>
          <div>
            <h4 className="font-bold text-slate-700 mb-1">肯定から入る技術 (Yes-And/Yes-But)</h4>
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`text-xl font-bold ${rhetoric.affirmationScore >= 7 ? 'text-emerald-600' : 'text-amber-600'}`}
              >
                {rhetoric.affirmationScore}/10
              </span>
              <span className="text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-500 font-medium">
                Communication Style
              </span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
              {rhetoric.affirmationComment}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});
