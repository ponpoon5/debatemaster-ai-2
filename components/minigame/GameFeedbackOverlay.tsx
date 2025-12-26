import React from 'react';
import { Button } from '../Button';
import { Zap, ArrowRight } from 'lucide-react';

interface GameFeedbackOverlayProps {
  roundScore: number;
  feedback: string;
  onNext: () => void;
  isNextAvailable: boolean;
}

export const GameFeedbackOverlay: React.FC<GameFeedbackOverlayProps> = React.memo(({
  roundScore,
  feedback,
  onNext,
  isNextAvailable,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in p-4">
      <div className="bg-white p-6 rounded-3xl shadow-2xl max-w-md w-full text-center animate-pop-in border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="shrink-0">
          <div className="text-5xl mb-2">{roundScore > 60 ? '🎉' : '💪'}</div>
          <h3 className="text-xl font-black text-slate-800 mb-1">
            {roundScore > 80 ? 'Excellent!' : roundScore > 40 ? 'Good Job!' : 'Keep Trying!'}
          </h3>
          <div className="text-3xl font-bold text-pink-600 mb-4">+{roundScore} pts</div>
        </div>

        <div className="bg-white p-5 rounded-2xl text-left mb-6 overflow-y-auto flex-1 border border-slate-200 scrollbar-hide shadow-inner">
          <span className="text-xs font-bold text-slate-400 uppercase block mb-2 flex items-center gap-1">
            <Zap size={12} /> AI Feedback
          </span>
          <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">{feedback}</p>
        </div>

        <div className="shrink-0 pt-2">
          <Button
            onClick={onNext}
            fullWidth
            className="bg-pink-600 hover:bg-pink-700 text-white h-14 text-lg font-bold shadow-lg"
          >
            {isNextAvailable ? (
              <>
                次へ進む <ArrowRight size={20} className="ml-2" />
              </>
            ) : (
              '結果を見る'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
});
