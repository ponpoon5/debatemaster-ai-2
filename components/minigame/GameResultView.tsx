import React from 'react';
import { Button } from '../Button';
import { Trophy, RotateCcw } from 'lucide-react';

interface GameResultViewProps {
  score: number;
  combo: number;
  rank: string;
  onRetry: () => void;
  onBack: () => void;
}

export const GameResultView: React.FC<GameResultViewProps> = React.memo(({
  score,
  combo,
  rank,
  onRetry,
  onBack,
}) => {
  return (
    <div className="bg-white p-10 rounded-3xl shadow-2xl border border-slate-100 text-center animate-pop-in max-w-2xl w-full mx-auto">
      <div className="mb-6 relative inline-block">
        <div className="absolute inset-0 bg-yellow-50 rounded-full blur-xl opacity-50 animate-pulse"></div>
        <Trophy size={80} className="text-yellow-500 relative z-10 drop-shadow-sm" />
      </div>

      <h2 className="text-3xl font-black text-slate-800 mb-1">GAME FINISHED!</h2>
      <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-8">
        お疲れ様でした
      </p>

      <div className="py-6 border-y border-slate-100 mb-8">
        <div className="flex items-baseline justify-center gap-2 mb-2">
          <span className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600 tracking-tighter">
            {score}
          </span>
          <span className="text-2xl text-slate-400 font-bold">pts</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-10">
        <div className="bg-white p-5 rounded-2xl border-2 border-slate-100 flex flex-col items-center shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Max Combo
          </span>
          <div className="text-3xl font-bold text-slate-800">{combo}</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border-2 border-slate-100 flex flex-col items-center shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Rank
          </span>
          <div
            className={`text-3xl font-black ${rank === 'S' ? 'text-yellow-500' : rank === 'A' ? 'text-pink-500' : 'text-slate-700'}`}
          >
            {rank}
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <Button
          variant="secondary"
          onClick={onBack}
          fullWidth
          className="h-14 text-lg font-bold border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
        >
          終了する
        </Button>
        <Button
          onClick={onRetry}
          fullWidth
          className="h-14 text-lg bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white shadow-lg font-bold"
        >
          <RotateCcw size={20} className="mr-2" /> もう一度
        </Button>
      </div>
    </div>
  );
});
