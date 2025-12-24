import React, { useState, useEffect } from 'react';
import {
  Difficulty,
  DebateSettings,
  TokenUsage,
  DebateMode,
  DebateArchive,
  DebateType,
  StoryScenario,
  MiniGameType,
} from '../core/types';
import {
  generateRandomTopic,
  generateTopicSuggestions,
  generateStoryScenario,
  generateWeaknessProfile,
} from '../services/gemini/index';
import { TOPIC_POOL } from '../core/config/constants';
import { useToast } from './useToast';

export const useSetupLogic = (
  onStart: (settings: DebateSettings) => void,
  onTokenUpdate: (usage: TokenUsage) => void,
  archives: DebateArchive[]
) => {
  const { showError } = useToast();
  const [activeMode, setActiveMode] = useState<DebateMode>(DebateMode.DEBATE);

  // Topic & Debate Settings
  const [topic, setTopic] = useState('');
  const [debateType, setDebateType] = useState<DebateType>(DebateType.POLICY);
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.NORMAL);
  const [suggestedTopics, setSuggestedTopics] = useState<string[]>([]);

  // Async States
  const [isGeneratingTopic, setIsGeneratingTopic] = useState(false);
  const [isRefreshingSuggestions, setIsRefreshingSuggestions] = useState(false);
  const [isAnalyzingWeakness, setIsAnalyzingWeakness] = useState(false);
  const [isGeneratingScenario, setIsGeneratingScenario] = useState(false);

  // Mode Specific States
  const [aStance, setAStance] = useState<'PRO' | 'CON'>('PRO');
  const [storyScenario, setStoryScenario] = useState<StoryScenario | null>(null);

  useEffect(() => {
    shuffleTopics();
  }, []);

  const shuffleTopics = () => {
    const shuffled = [...TOPIC_POOL].sort(() => 0.5 - Math.random());
    setSuggestedTopics(shuffled.slice(0, 5));
  };

  const handleAiSuggestions = async () => {
    setIsRefreshingSuggestions(true);
    try {
      const { topics, usage } = await generateTopicSuggestions(
        activeMode === DebateMode.DEBATE ? debateType : undefined
      );
      setSuggestedTopics(topics);
      onTokenUpdate(usage);
    } catch (error) {
      console.error(error);
    } finally {
      setIsRefreshingSuggestions(false);
    }
  };

  const handleGenerateScenario = async () => {
    if (!topic.trim()) return;
    setIsGeneratingScenario(true);
    try {
      const { scenario, usage } = await generateStoryScenario(topic);
      setStoryScenario(scenario);
      onTokenUpdate(usage);
    } catch (error) {
      console.error(error);
      showError('シナリオ生成に失敗しました。');
    } finally {
      setIsGeneratingScenario(false);
    }
  };

  const handleLuckyTopic = async () => {
    setIsGeneratingTopic(true);
    try {
      const { topic: randomTopic, usage } = await generateRandomTopic(
        activeMode === DebateMode.DEBATE ? debateType : undefined
      );
      setTopic(randomTopic);
      onTokenUpdate(usage);
    } catch (error) {
      console.error(error);
    } finally {
      setIsGeneratingTopic(false);
    }
  };

  const handleStartDebate = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) {
      onStart({
        topic,
        difficulty,
        mode: activeMode,
        debateType: activeMode === DebateMode.DEBATE ? debateType : undefined,
        facilitationSettings: activeMode === DebateMode.FACILITATION ? { aStance } : undefined,
        storyScenario: activeMode === DebateMode.STORY && storyScenario ? storyScenario : undefined,
      });
    }
  };

  const handleStartWithPreset = (settings: Partial<DebateSettings>) => {
    onStart({
      topic: settings.topic || 'Unknown Topic',
      difficulty: settings.difficulty || Difficulty.NORMAL,
      mode: settings.mode || activeMode,
      thinkingFramework: settings.thinkingFramework,
      miniGameType: settings.miniGameType,
    } as DebateSettings);
  };

  const handleStartTraining = async () => {
    if (archives.length === 0) return;
    setIsAnalyzingWeakness(true);
    try {
      // Generate profile first to handle loading state in UI
      const { profile, usage } = await generateWeaknessProfile(archives);
      onTokenUpdate(usage);

      onStart({
        topic: '弱点克服トレーニング',
        difficulty: Difficulty.HARD,
        mode: DebateMode.TRAINING,
        weaknessProfile: profile,
      });
    } catch (e) {
      console.error(e);
      showError('弱点分析に失敗しました。');
    } finally {
      setIsAnalyzingWeakness(false);
    }
  };

  const handleTopicChange = (newTopic: string) => {
    setTopic(newTopic);
    if (activeMode === DebateMode.STORY) setStoryScenario(null);
  };

  return {
    activeMode,
    setActiveMode,
    topic,
    setTopic: handleTopicChange,
    debateType,
    setDebateType,
    difficulty,
    setDifficulty,
    suggestedTopics,
    aStance,
    setAStance,
    storyScenario,
    setStoryScenario,
    isGeneratingTopic,
    isRefreshingSuggestions,
    isAnalyzingWeakness,
    isGeneratingScenario,
    shuffleTopics,
    handleAiSuggestions,
    handleGenerateScenario,
    handleLuckyTopic,
    handleStartDebate,
    handleStartWithPreset,
    handleStartTraining,
  };
};
