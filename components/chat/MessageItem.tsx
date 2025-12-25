import React from 'react';
import {
  Message,
  DebateSettings,
  ArgumentAnalysis,
  DemoTurn,
  DebateMode,
  UtteranceStructureScore,
} from '../../core/types';
import { DemoMessage } from './message/DemoMessage';
import { MultiSpeakerMessage } from './message/MultiSpeakerMessage';
import { StandardMessage } from './message/StandardMessage';

interface MessageItemProps {
  msg: Message;
  index: number;
  settings: DebateSettings;
  analysis?: ArgumentAnalysis;
  demoParsedData?: DemoTurn;
  structureScore?: UtteranceStructureScore;
  supportMode: boolean;
  detectedFallacy?: string | null;
  highlightQuote?: string | null;
  onHighlightClick?: () => void;
}

export const MessageItem: React.FC<MessageItemProps> = React.memo(({
  msg,
  settings,
  analysis,
  demoParsedData,
  structureScore,
  supportMode,
  detectedFallacy,
  highlightQuote,
  onHighlightClick,
}) => {
  const isDemoMode = settings.mode === DebateMode.DEMO;
  const isStoryMode = settings.mode === DebateMode.STORY;
  const isFacilitationMode = settings.mode === DebateMode.FACILITATION;

  if (isDemoMode) {
    if (msg.role === 'user') return null;
    if (!demoParsedData) return null;
    return <DemoMessage data={demoParsedData} />;
  }

  if (isFacilitationMode || isStoryMode) {
    return (
      <MultiSpeakerMessage
        text={msg.text}
        role={msg.role}
        isStoryMode={isStoryMode}
        isFacilitationMode={isFacilitationMode}
        stakeholders={settings.storyScenario?.stakeholders}
        highlightQuote={highlightQuote}
        detectedFallacy={detectedFallacy}
        onHighlightClick={onHighlightClick}
      />
    );
  }

  return (
    <StandardMessage
      text={msg.text}
      role={msg.role}
      analysis={analysis}
      structureScore={structureScore}
      highlightQuote={highlightQuote}
      detectedFallacy={detectedFallacy}
      onHighlightClick={onHighlightClick}
    />
  );
});
