import { useState, useRef, useEffect } from 'react';
import { TokenUsage, MiniGameType } from '../core/types';
import { generateMiniGameContent, evaluateMiniGameAnswer } from '../services/gemini/index';

export type GameState = 'menu' | 'loading' | 'playing' | 'feedback' | 'result';

const TOTAL_ROUNDS = 5;

export const useMiniGameLogic = (
  onTokenUpdate: (usage: TokenUsage) => void,
  initialMiniGameType?: MiniGameType
) => {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [activeGameType, setActiveGameType] = useState<MiniGameType | null>(null);
  const [gameData, setGameData] = useState<any>(null);
  const [score, setScore] = useState(0);
  const [roundScore, setRoundScore] = useState(0);
  const [round, setRound] = useState(1);
  const [timeLeft, setTimeLeft] = useState(0);
  const [combo, setCombo] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);

  const timerRef = useRef<any>(null);

  // Initial Load if type is preset
  useEffect(() => {
    if (initialMiniGameType && gameState === 'menu') {
      startGame(initialMiniGameType);
    }
  }, [initialMiniGameType]);

  // Timer Logic
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // For time-based games, finish when time is up
            if (activeGameType === MiniGameType.COMBO_REBUTTAL) {
              finishGame();
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [gameState, timeLeft, activeGameType]);

  const startGame = async (type: MiniGameType) => {
    setActiveGameType(type);
    setGameState('loading');
    setScore(0);
    setCombo(0);
    setRound(1);
    setFeedback(null);

    // Initial Time based on game
    const initialTime = type === MiniGameType.COMBO_REBUTTAL ? 90 : 0;
    setTimeLeft(initialTime);

    try {
      await loadNextRound(type);
    } catch (e) {
      console.error(e);
      setGameState('menu');
    }
  };

  const loadNextRound = async (type: MiniGameType) => {
    setFeedback(null);
    setGameState('loading');

    try {
      const { data, usage } = await generateMiniGameContent(type);
      onTokenUpdate(usage);
      setGameData(data);
      setGameState('playing');
    } catch (e) {
      console.error('Failed to load round', e);
    }
  };

  const submitAnswer = async (userAnswer: string | number) => {
    if (!activeGameType || !gameData) return;
    setGameState('loading');

    try {
      // Self-validation for Fallacy Quiz to save tokens/time if simple
      if (activeGameType === MiniGameType.FALLACY_QUIZ) {
        const isCorrect = gameData.options[userAnswer] === gameData.correctFallacy;
        handleResult({
          score: isCorrect ? 100 : 0,
          feedback: isCorrect
            ? `正解！\n\n${gameData.explanation || ''}`
            : `不正解...\n正解は「${gameData.correctFallacy}」でした。\n\n${gameData.explanation || ''}`,
        });
        return;
      }

      // AI Grading for text-based games
      const {
        score: roundScore,
        feedback,
        usage,
      } = await evaluateMiniGameAnswer(activeGameType, gameData, userAnswer);
      onTokenUpdate(usage);
      handleResult({ score: roundScore, feedback });
    } catch (e) {
      console.error(e);
    }
  };

  const handleResult = (result: { score: number; feedback: string }) => {
    setScore(prev => prev + result.score);
    setRoundScore(result.score);
    setFeedback(result.feedback);

    if (result.score > 60) {
      setCombo(prev => prev + 1);
    } else {
      setCombo(0);
    }

    setGameState('feedback');
  };

  const handleNext = () => {
    if (!activeGameType) return;

    if (activeGameType === MiniGameType.COMBO_REBUTTAL) {
      if (timeLeft > 0) {
        loadNextRound(activeGameType);
      } else {
        finishGame();
      }
    } else {
      if (round < TOTAL_ROUNDS) {
        setRound(prev => prev + 1);
        loadNextRound(activeGameType);
      } else {
        finishGame();
      }
    }
  };

  const finishGame = () => {
    clearInterval(timerRef.current);
    setGameState('result');
  };

  const getGameTitle = () => {
    switch (activeGameType) {
      case MiniGameType.EVIDENCE_FILL:
        return 'Evidence穴埋めチャレンジ';
      case MiniGameType.FALLACY_QUIZ:
        return '誤謬（Fallacy）クイズ';
      case MiniGameType.ISSUE_PUZZLE:
        return '論点整理パズル';
      case MiniGameType.COMBO_REBUTTAL:
        return '反論コンボアタック';
      case MiniGameType.FERMI_ESTIMATION:
        return 'フェルミ推定';
      case MiniGameType.LATERAL_THINKING:
        return '水平思考パズル';
      case MiniGameType.ACTIVE_INOCULATION:
        return '能動的接種演習';
      default:
        return 'ミニゲーム';
    }
  };

  const isTimeBased = activeGameType === MiniGameType.COMBO_REBUTTAL;
  const isNextAvailable = (isTimeBased && timeLeft > 0) || (!isTimeBased && round < TOTAL_ROUNDS);

  return {
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
    finishGame,
    getGameTitle,
    isTimeBased,
    isNextAvailable,
    TOTAL_ROUNDS,
  };
};
