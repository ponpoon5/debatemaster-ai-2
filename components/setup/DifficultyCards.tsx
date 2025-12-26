import React from 'react';
import { Difficulty } from '../../core/types';
import { Shield, Zap, Swords, Flame } from 'lucide-react';

interface DifficultyCardsProps {
  difficulty: Difficulty;
  setDifficulty: (diff: Difficulty) => void;
}

export const DifficultyCards: React.FC<DifficultyCardsProps> = React.memo(({ difficulty, setDifficulty }) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <label className="text-sm font-bold text-slate-700">難易度設定 (4 Stages)</label>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded">
          Fixed difficulty levels
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          type="button"
          onClick={() => setDifficulty(Difficulty.EASY)}
          className={`group flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-300 active:scale-95 ${
            difficulty === Difficulty.EASY
              ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-lg shadow-emerald-100 transform -translate-y-1'
              : 'border-slate-100 hover:border-emerald-200 text-slate-500 hover:bg-emerald-50/30'
          }`}
        >
          <div
            className={`p-3 rounded-xl mb-2 transition-colors ${difficulty === Difficulty.EASY ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-emerald-100 group-hover:text-emerald-500'}`}
          >
            <Shield size={24} />
          </div>
          <span className="font-bold text-sm">初級</span>
          <span className="text-[10px] mt-1 opacity-80 font-medium text-center leading-tight">
            称賛とコーチング
            <br />
            議論の基礎作り
          </span>
        </button>

        <button
          type="button"
          onClick={() => setDifficulty(Difficulty.NORMAL)}
          className={`group flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-300 active:scale-95 ${
            difficulty === Difficulty.NORMAL
              ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-lg shadow-blue-100 transform -translate-y-1'
              : 'border-slate-100 hover:border-blue-200 text-slate-500 hover:bg-blue-50/30'
          }`}
        >
          <div
            className={`p-3 rounded-xl mb-2 transition-colors ${difficulty === Difficulty.NORMAL ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-500'}`}
          >
            <Zap size={24} />
          </div>
          <span className="font-bold text-sm">中級</span>
          <span className="text-[10px] mt-1 opacity-80 font-medium text-center leading-tight">
            論理的一貫性
            <br />
            標準的な対論
          </span>
        </button>

        <button
          type="button"
          onClick={() => setDifficulty(Difficulty.HARD)}
          className={`group flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-300 active:scale-95 ${
            difficulty === Difficulty.HARD
              ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-lg shadow-orange-100 transform -translate-y-1'
              : 'border-slate-100 hover:border-orange-200 text-slate-500 hover:bg-orange-50/30'
          }`}
        >
          <div
            className={`p-3 rounded-xl mb-2 transition-colors ${difficulty === Difficulty.HARD ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-orange-100 group-hover:text-orange-500'}`}
          >
            <Swords size={24} />
          </div>
          <span className="font-bold text-sm">上級</span>
          <span className="text-[10px] mt-1 opacity-80 font-medium text-center leading-tight">
            鋭い反証と深掘り
            <br />
            競技・大会レベル
          </span>
        </button>

        <button
          type="button"
          onClick={() => setDifficulty(Difficulty.EXTREME)}
          className={`group flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-300 active:scale-95 ${
            difficulty === Difficulty.EXTREME
              ? 'border-purple-600 bg-purple-50 text-purple-800 shadow-lg shadow-purple-100 transform -translate-y-1'
              : 'border-slate-100 hover:border-purple-200 text-slate-500 hover:bg-purple-50/30'
          }`}
        >
          <div
            className={`p-3 rounded-xl mb-2 transition-colors ${difficulty === Difficulty.EXTREME ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-purple-100 group-hover:text-purple-500'}`}
          >
            <Flame size={24} />
          </div>
          <span className="font-bold text-sm">超上級</span>
          <span className="text-[10px] mt-1 opacity-80 font-medium text-center leading-tight">
            詭弁・誘導・心理戦
            <br />
            最強の論客に挑む
          </span>
        </button>
      </div>
    </div>
  );
});
