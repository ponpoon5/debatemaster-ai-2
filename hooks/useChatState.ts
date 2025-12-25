import { useState } from 'react';

/**
 * チャット画面の状態管理
 * ChatScreenから状態管理を分離し、責任を明確化
 */

export interface ChatState {
  inputText: string;
  setInputText: (text: string) => void;
  showBuilder: boolean;
  setShowBuilder: (show: boolean) => void;
  builderMode: 'builder' | 'rebuttal';
  setBuilderMode: (mode: 'builder' | 'rebuttal') => void;
  showGymModal: boolean;
  setShowGymModal: (show: boolean) => void;
  showHomeworkModal: boolean;
  setShowHomeworkModal: (show: boolean) => void;
  gymInitialTab: 'ai_topic' | 'custom_topic';
  setGymInitialTab: (tab: 'ai_topic' | 'custom_topic') => void;
  isAutoPlaying: boolean;
  setIsAutoPlaying: (playing: boolean) => void;
}

/**
 * チャット画面の状態を管理するカスタムフック
 */
export const useChatState = (): ChatState => {
  const [inputText, setInputText] = useState('');
  const [showBuilder, setShowBuilder] = useState(false);
  const [builderMode, setBuilderMode] = useState<'builder' | 'rebuttal'>('builder');
  const [showGymModal, setShowGymModal] = useState(false);
  const [showHomeworkModal, setShowHomeworkModal] = useState(false);
  const [gymInitialTab, setGymInitialTab] = useState<'ai_topic' | 'custom_topic'>('ai_topic');
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  return {
    inputText,
    setInputText,
    showBuilder,
    setShowBuilder,
    builderMode,
    setBuilderMode,
    showGymModal,
    setShowGymModal,
    showHomeworkModal,
    setShowHomeworkModal,
    gymInitialTab,
    setGymInitialTab,
    isAutoPlaying,
    setIsAutoPlaying,
  };
};
