import React from 'react';
import { Zap, Bot, Users, BrainCircuit, User, Globe } from 'lucide-react';
import { MessageHighlighter } from './MessageHighlighter';

interface MultiSpeakerMessageProps {
  text: string;
  role: 'model' | 'user';
  isStoryMode: boolean;
  isFacilitationMode: boolean;
  stakeholders?: { name: string }[];
  highlightQuote: string | null;
  detectedFallacy?: string | null;
  onHighlightClick?: () => void;
}

const STORY_COLORS = [
  {
    bg: 'bg-rose-50',
    text: 'text-rose-900',
    border: 'border-rose-200',
    iconColor: 'text-rose-600',
  },
  {
    bg: 'bg-orange-50',
    text: 'text-orange-900',
    border: 'border-orange-200',
    iconColor: 'text-orange-600',
  },
  {
    bg: 'bg-indigo-50',
    text: 'text-indigo-900',
    border: 'border-indigo-200',
    iconColor: 'text-indigo-600',
  },
  {
    bg: 'bg-purple-50',
    text: 'text-purple-900',
    border: 'border-purple-200',
    iconColor: 'text-purple-600',
  },
  {
    bg: 'bg-cyan-50',
    text: 'text-cyan-900',
    border: 'border-cyan-200',
    iconColor: 'text-cyan-600',
  },
  {
    bg: 'bg-lime-50',
    text: 'text-lime-900',
    border: 'border-lime-200',
    iconColor: 'text-lime-600',
  },
  {
    bg: 'bg-fuchsia-50',
    text: 'text-fuchsia-900',
    border: 'border-fuchsia-200',
    iconColor: 'text-fuchsia-600',
  },
  {
    bg: 'bg-emerald-50',
    text: 'text-emerald-900',
    border: 'border-emerald-200',
    iconColor: 'text-emerald-600',
  },
];

const getColorForName = (name: string, stakeholders: { name: string }[] = []) => {
  const index = stakeholders.findIndex(s => name.includes(s.name) || s.name.includes(name));
  if (index !== -1) {
    return STORY_COLORS[index % STORY_COLORS.length];
  }
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return STORY_COLORS[Math.abs(hash) % STORY_COLORS.length];
};

export const MultiSpeakerMessage: React.FC<MultiSpeakerMessageProps> = ({
  text,
  role,
  isStoryMode,
  isFacilitationMode,
  stakeholders,
  highlightQuote,
  detectedFallacy,
  onHighlightClick,
}) => {
  // User Message Handling
  if (role === 'user') {
    const bgClass = isFacilitationMode ? 'bg-green-600' : 'bg-teal-600';
    return (
      <div className="flex flex-row-reverse items-end gap-3 animate-message-in mb-6">
        <div
          className={`w-8 h-8 rounded-full ${bgClass} text-white flex items-center justify-center shrink-0 shadow-sm`}
        >
          <User size={18} />
        </div>
        <div
          className={`max-w-[85%] md:max-w-[75%] ${bgClass} text-white p-4 rounded-2xl rounded-br-none shadow-sm text-sm md:text-base leading-relaxed whitespace-pre-wrap`}
        >
          {text}
        </div>
      </div>
    );
  }

  // AI Message Parsing
  const eventMatch = text.match(/^\[EVENT\](.*)/m);
  let eventText = null;
  let cleanTextVal = text;

  if (eventMatch) {
    eventText = eventMatch[1].trim();
    cleanTextVal = text.replace(eventMatch[0], '').trim();
  }

  // If no tags are found, render simply
  if (!cleanTextVal.includes('[') || !cleanTextVal.includes(']')) {
    return (
      <div className="flex items-end gap-3 animate-message-in relative flex-row mb-6">
        <div
          className={`w-8 h-8 rounded-full ${isStoryMode ? 'bg-teal-600' : 'bg-emerald-600'} text-white flex items-center justify-center shrink-0 shadow-sm self-end`}
        >
          {isStoryMode ? <Globe size={18} /> : <Bot size={18} />}
        </div>
        <div className="flex flex-col gap-4 w-full max-w-[85%] md:max-w-[75%]">
          {eventText && (
            <div className="animate-pop-in bg-slate-800 text-yellow-400 p-4 rounded-xl border-l-4 border-yellow-500 shadow-md font-bold text-sm flex items-center gap-3">
              <Zap size={20} className="animate-pulse" />
              <span>{eventText}</span>
            </div>
          )}
          {cleanTextVal && (
            <div className="p-4 bg-white rounded-2xl rounded-bl-none border border-slate-100 text-slate-800 shadow-sm text-sm md:text-base leading-relaxed">
              <MessageHighlighter
                text={cleanTextVal}
                highlightQuote={highlightQuote}
                detectedFallacy={detectedFallacy}
                onHighlightClick={onHighlightClick}
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  // Parse blocks
  const lines = cleanTextVal.split('\n');
  const blocks: { speaker: string; text: string }[] = [];

  let currentSpeaker = 'System';
  let currentBuffer: string[] = [];
  const tagRegex = /^[\s*]*\[([^\]]+)\][:：]?\s*/;

  lines.forEach(line => {
    const match = line.match(tagRegex);
    if (match) {
      if (currentBuffer.length > 0) {
        blocks.push({ speaker: currentSpeaker, text: currentBuffer.join('\n') });
        currentBuffer = [];
      }
      currentSpeaker = match[1];
      currentBuffer.push(line.replace(match[0], '').trim());
    } else {
      currentBuffer.push(line);
    }
  });
  if (currentBuffer.length > 0) {
    blocks.push({ speaker: currentSpeaker, text: currentBuffer.join('\n') });
  }

  return (
    <div className="flex items-end gap-3 animate-message-in relative flex-row mb-6">
      <div
        className={`w-8 h-8 rounded-full ${isStoryMode ? 'bg-teal-600' : 'bg-emerald-600'} text-white flex items-center justify-center shrink-0 shadow-sm self-end`}
      >
        {isStoryMode ? <Globe size={18} /> : <Bot size={18} />}
      </div>
      <div className="flex flex-col gap-3 items-start w-full max-w-[85%] md:max-w-[75%]">
        {eventText && (
          <div className="animate-pop-in bg-slate-800 text-yellow-400 p-3 rounded-xl border-l-4 border-yellow-500 shadow-md font-bold text-sm flex items-center gap-2 w-full mb-2">
            <Zap size={18} className="animate-pulse shrink-0" />
            <span>{eventText}</span>
          </div>
        )}

        {blocks.map((b, idx) => {
          if (!b.text.trim()) return null;

          let bubbleStyle = 'bg-white text-slate-800 border-slate-100';
          const roleLabel = b.speaker;
          let icon = <Bot size={14} className="text-slate-500" />;
          let labelStyle = 'text-slate-500';
          let showHeader = true;

          if (isStoryMode) {
            if (b.speaker === 'System') {
              // In Story Mode, "System" is treated as narration (hide header)
              showHeader = false;
              bubbleStyle = 'bg-slate-50/80 text-slate-600 border-slate-200 italic rounded-bl-none';
            } else if (b.speaker.includes('GM') || b.speaker.includes('Game Master')) {
              bubbleStyle = 'bg-slate-100 text-slate-800 border-slate-300 rounded-bl-none italic';
              icon = <Bot size={14} className="text-slate-600" />;
              labelStyle = 'text-slate-600';
            } else {
              const color = getColorForName(b.speaker, stakeholders);
              bubbleStyle = `${color.bg} ${color.text} ${color.border} rounded-bl-none`;
              icon = <User size={14} className={color.iconColor} />;
              labelStyle = color.iconColor;
            }
          } else if (isFacilitationMode) {
            if (b.speaker.includes('Aさん') || b.speaker.includes('感情')) {
              bubbleStyle = 'bg-red-50 text-red-900 border-red-200 rounded-bl-none';
              icon = <Users size={14} className="text-red-500" />;
              labelStyle = 'text-red-500';
            } else if (b.speaker.includes('Bさん') || b.speaker.includes('論理')) {
              bubbleStyle = 'bg-blue-50 text-blue-900 border-blue-200 rounded-bl-none';
              icon = <BrainCircuit size={14} className="text-blue-500" />;
              labelStyle = 'text-blue-500';
            } else if (b.speaker === 'System') {
              // Hide header for System in facilitation mode too for cleaner look
              showHeader = false;
              bubbleStyle = 'bg-slate-50 text-slate-500 border-slate-100 text-xs';
            }
          }

          return (
            <div key={idx} className="flex flex-col items-start max-w-full">
              {showHeader && (
                <span
                  className={`text-[10px] font-bold mb-1 flex items-center gap-1 ml-1 ${labelStyle}`}
                >
                  {icon} {roleLabel}
                </span>
              )}
              <div
                className={`p-4 rounded-2xl border ${bubbleStyle} shadow-sm whitespace-pre-wrap text-sm md:text-base leading-relaxed`}
              >
                <MessageHighlighter
                  text={b.text}
                  highlightQuote={highlightQuote}
                  detectedFallacy={detectedFallacy}
                  onHighlightClick={onHighlightClick}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
