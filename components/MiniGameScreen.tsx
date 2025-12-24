import React from 'react';
import { Button } from './Button';
import { TokenUsage, MiniGameType } from '../core/types';
import { Home, Joystick, Timer, Loader2, Hash } from 'lucide-react';
import { useMiniGameLogic } from '../hooks/useMiniGameLogic';

// Sub-components
import { EvidenceFillView } from './minigame/EvidenceFillView';
import { FallacyQuizView } from './minigame/FallacyQuizView';
import { IssuePuzzleView } from './minigame/IssuePuzzleView';
import { ComboRebuttalView } from './minigame/ComboRebuttalView';
import { FermiEstimationView } from './minigame/FermiEstimationView';
import { LateralThinkingView } from './minigame/LateralThinkingView';
import { ActiveInoculationView } from './minigame/ActiveInoculationView';
import { GameResultView } from './minigame/GameResultView';
import { GameFeedbackOverlay } from './minigame/GameFeedbackOverlay';

interface MiniGameScreenProps {
  miniGameType?: MiniGameType;
  onBack: () => void;
  onTokenUpdate: (usage: TokenUsage) => void;
}

export const MiniGameScreen: React.FC<MiniGameScreenProps> = ({
  miniGameType,
  onBack,
  onTokenUpdate,
}) => {
  const {
    gameState,
    activeGameType,
    gameData,
    score,
    roundScore,
    round,
    timeLeft,
    combo,
    feedback,
    startGame,
    submitAnswer,
    handleNext,
    getGameTitle,
    isTimeBased,
    isNextAvailable,
    TOTAL_ROUNDS,
  } = useMiniGameLogic(onTokenUpdate, miniGameType);

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between z-10 sticky top-0">
        <div className="flex items-center gap-2">
          <Button
            onClick={onBack}
            variant="ghost"
            className="p-2 -ml-2 text-slate-500 hover:bg-slate-50"
          >
            <Home size={20} />
          </Button>
          <h2 className="text-lg font-bold text-pink-600 flex items-center gap-2">
            <Joystick size={20} />
            <span className="hidden sm:inline">{getGameTitle()}</span>
            <span className="sm:hidden">ミニゲーム</span>
          </h2>
        </div>
        {(gameState === 'playing' || gameState === 'feedback') && (
          <div className="flex items-center gap-4">
            {isTimeBased ? (
              <div className="flex items-center gap-1 font-mono text-xl font-bold text-slate-700">
                <Timer
                  size={20}
                  className={timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-slate-400'}
                />
                {timeLeft}s
              </div>
            ) : (
              <div className="flex items-center gap-1 text-sm font-bold text-slate-600 bg-white px-3 py-1 rounded-full border border-slate-200">
                <Hash size={14} className="text-slate-400" />
                Round {round}/{TOTAL_ROUNDS}
              </div>
            )}
            <div className="bg-white px-3 py-1 rounded-full text-sm font-bold text-pink-600 border border-pink-100 shadow-sm">
              Score: {score}
            </div>
          </div>
        )}
      </header>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col items-center justify-center relative bg-white">
        {gameState === 'loading' && (
          <div className="text-center animate-pulse">
            <Loader2 size={48} className="animate-spin text-pink-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-600">
              {feedback
                ? '採点中...'
                : isTimeBased
                  ? '次のターゲットを探索中...'
                  : `Round ${round} 準備中...`}
            </h3>
          </div>
        )}

        {gameState === 'result' && (
          <GameResultView
            score={score}
            combo={combo}
            rank={
              score > (isTimeBased ? 300 : 400)
                ? 'S'
                : score > (isTimeBased ? 200 : 300)
                  ? 'A'
                  : score > (isTimeBased ? 100 : 200)
                    ? 'B'
                    : 'C'
            }
            onRetry={() => activeGameType && startGame(activeGameType)}
            onBack={onBack}
          />
        )}

        {(gameState === 'playing' || gameState === 'feedback') && gameData && (
          <div className="w-full flex justify-center animate-fade-in pb-20">
            {/* Feedback Overlay */}
            {gameState === 'feedback' && feedback && (
              <GameFeedbackOverlay
                roundScore={roundScore}
                feedback={feedback}
                onNext={handleNext}
                isNextAvailable={isNextAvailable}
              />
            )}

            {/* Game Views */}
            <div className="w-full max-w-2xl">
              {activeGameType === MiniGameType.EVIDENCE_FILL && (
                <EvidenceFillView data={gameData} onSubmit={submitAnswer} />
              )}

              {activeGameType === MiniGameType.FALLACY_QUIZ && (
                <FallacyQuizView data={gameData} onSubmit={submitAnswer} />
              )}

              {activeGameType === MiniGameType.ISSUE_PUZZLE && (
                <IssuePuzzleView data={gameData} onSubmit={submitAnswer} />
              )}

              {activeGameType === MiniGameType.COMBO_REBUTTAL && (
                <ComboRebuttalView data={gameData} onSubmit={submitAnswer} />
              )}

              {activeGameType === MiniGameType.FERMI_ESTIMATION && (
                <FermiEstimationView data={gameData} onSubmit={submitAnswer} />
              )}

              {activeGameType === MiniGameType.LATERAL_THINKING && (
                <LateralThinkingView data={gameData} onSubmit={submitAnswer} />
              )}

              {activeGameType === MiniGameType.ACTIVE_INOCULATION && (
                <ActiveInoculationView data={gameData} onSubmit={submitAnswer} />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
