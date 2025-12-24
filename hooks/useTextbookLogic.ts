import { useState, useMemo, useEffect } from 'react';
import { TokenUsage } from '../core/types';
import { getChapters } from '../components/textbook/chapters';
import {
  generateTextbookProblem,
  evaluateTextbookAnswer,
  generateAttackPointQuiz,
  generateWeighingQuiz,
  generateDefinitionQuiz,
} from '../services/gemini/index';

const ATTACK_TYPES = [
  'Claim攻撃 (結論)',
  'Reason攻撃 (理由)',
  'Evidence攻撃 (証拠)',
  'Warrant攻撃 (論拠)',
  '定義攻撃',
  '比重攻撃 (Weighing)',
  '論点ずらし指摘',
];

const WEIGHING_CRITERIA = [
  { label: 'Magnitude (大きさ・規模)', value: 'Magnitude' },
  { label: 'Probability (発生確率)', value: 'Probability' },
  { label: 'Timeframe (時間軸)', value: 'Timeframe' },
  { label: 'Reversibility (可逆性)', value: 'Reversibility' },
];

const DEFINITION_FLAWS = [
  {
    label: '過包摂 (広すぎる)',
    value: 'Over-inclusive',
    desc: '本来含まれないものまで含んでしまっている',
  },
  {
    label: '過小包摂 (狭すぎる)',
    value: 'Under-inclusive',
    desc: '本来含むべきものを除外してしまっている',
  },
  { label: '循環定義', value: 'Circular', desc: '定義の中にその言葉自体を使ってしまっている' },
];

export const useTextbookLogic = (
  onTokenUpdate: (usage: TokenUsage) => void,
  initialChapterId?: number
) => {
  const [currentChapterId, setCurrentChapterId] = useState<number | null>(initialChapterId || null);
  const [practiceProblem, setPracticeProblem] = useState<string | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<{
    isCorrect: boolean;
    feedback: string;
  } | null>(null);

  // Quiz State for Specific Chapters
  const [attackQuizData, setAttackQuizData] = useState<any>(null);
  const [weighingQuizData, setWeighingQuizData] = useState<any>(null);
  const [definitionQuizData, setDefinitionQuizData] = useState<any>(null);

  // Interactive State for Chapter 3 content
  const [weighingValue, setWeighingValue] = useState(50);

  // Progress State
  const [readChapters, setReadChapters] = useState<number[]>([]);

  const CHAPTERS = useMemo(
    () => getChapters(onTokenUpdate, weighingValue, setWeighingValue),
    [weighingValue]
  );

  useEffect(() => {
    if (currentChapterId && !readChapters.includes(currentChapterId)) {
      setReadChapters(prev => [...prev, currentChapterId]);
    }
  }, [currentChapterId]);

  // Reset quiz state when chapter changes
  useEffect(() => {
    setPracticeProblem(null);
    setEvaluationResult(null);
    setAttackQuizData(null);
    setWeighingQuizData(null);
    setDefinitionQuizData(null);
    setUserAnswer('');
  }, [currentChapterId]);

  const handleStartPractice = async () => {
    if (!currentChapterId) return;
    setIsGenerating(true);
    setEvaluationResult(null);
    setAttackQuizData(null);
    setWeighingQuizData(null);
    setDefinitionQuizData(null);
    setUserAnswer('');

    const chapter = CHAPTERS.find(c => c.id === currentChapterId);
    if (!chapter) return;

    try {
      if (currentChapterId === 2) {
        const randomTypeIndex = Math.floor(Math.random() * 7);
        const data = await generateAttackPointQuiz(randomTypeIndex);
        setAttackQuizData(data);
        onTokenUpdate(data.usage);
      } else if (currentChapterId === 3) {
        const data = await generateWeighingQuiz();
        setWeighingQuizData(data);
        onTokenUpdate(data.usage);
      } else if (currentChapterId === 4) {
        const data = await generateDefinitionQuiz();
        setDefinitionQuizData(data);
        onTokenUpdate(data.usage);
      } else {
        const { problem, usage } = await generateTextbookProblem(
          chapter.title,
          chapter.description
        );
        setPracticeProblem(problem);
        onTokenUpdate(usage);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAttackQuizAnswer = (selectedIndex: number) => {
    if (!attackQuizData) return;
    const isCorrect = selectedIndex === attackQuizData.correctTypeIndex;
    setEvaluationResult({
      isCorrect,
      feedback: `正解は「${ATTACK_TYPES[attackQuizData.correctTypeIndex]}」です。\n\n${attackQuizData.explanation}`,
    });
  };

  const handleWeighingQuizAnswer = (selectedCriteria: string) => {
    if (!weighingQuizData) return;
    const isCorrect = selectedCriteria === weighingQuizData.correctCriteria;
    const correctLabel = WEIGHING_CRITERIA.find(
      c => c.value === weighingQuizData.correctCriteria
    )?.label;
    setEvaluationResult({
      isCorrect,
      feedback: `正解は「${correctLabel}」です。\n\n${weighingQuizData.explanation}`,
    });
  };

  const handleDefinitionQuizAnswer = (selectedFlaw: string) => {
    if (!definitionQuizData) return;
    const isCorrect = selectedFlaw === definitionQuizData.flawType;
    const correctLabel = DEFINITION_FLAWS.find(f => f.value === definitionQuizData.flawType)?.label;
    setEvaluationResult({
      isCorrect,
      feedback: `正解は「${correctLabel}」です。\n\n${definitionQuizData.explanation}`,
    });
  };

  const handleSubmitStandardAnswer = async () => {
    if (!currentChapterId || !practiceProblem || !userAnswer.trim()) return;
    setIsEvaluating(true);

    const chapter = CHAPTERS.find(c => c.id === currentChapterId);
    if (!chapter) return;

    try {
      const { isCorrect, feedback, usage } = await evaluateTextbookAnswer(
        chapter.title,
        practiceProblem,
        userAnswer
      );
      setEvaluationResult({ isCorrect, feedback });
      onTokenUpdate(usage);
    } catch (e) {
      console.error(e);
    } finally {
      setIsEvaluating(false);
    }
  };

  return {
    currentChapterId,
    setCurrentChapterId,
    chapters: CHAPTERS,
    readChapters,

    // Quiz Data
    practiceProblem,
    setPracticeProblem,
    attackQuizData,
    weighingQuizData,
    definitionQuizData,

    // Interaction State
    userAnswer,
    setUserAnswer,
    isGenerating,
    isEvaluating,
    evaluationResult,

    // Actions
    handleStartPractice,
    handleAttackQuizAnswer,
    handleWeighingQuizAnswer,
    handleDefinitionQuizAnswer,
    handleSubmitStandardAnswer,
  };
};
