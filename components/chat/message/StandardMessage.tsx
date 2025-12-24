import React from 'react';
import { User, Bot, AlertTriangle } from 'lucide-react';
import { ArgumentAnalysis, UtteranceStructureScore } from '../../../core/types';
import { MessageHighlighter } from './MessageHighlighter';
import { StructureHeatmap } from './StructureHeatmap';

interface StandardMessageProps {
  text: string;
  role: 'user' | 'model';
  analysis?: ArgumentAnalysis;
  structureScore?: UtteranceStructureScore;
  highlightQuote: string | null;
  detectedFallacy?: string | null;
  onHighlightClick?: () => void;
}

export const StandardMessage: React.FC<StandardMessageProps> = React.memo(({
  text,
  role,
  analysis,
  structureScore,
  highlightQuote,
  detectedFallacy,
  onHighlightClick,
}) => {
  const isUser = role === 'user';

  const renderAnalyzedText = () => {
    if (!analysis) {
      return (
        <MessageHighlighter
          text={text}
          highlightQuote={highlightQuote}
          detectedFallacy={detectedFallacy}
          onHighlightClick={onHighlightClick}
        />
      );
    }

    return (
      <div className="space-y-2">
        <p className="whitespace-pre-wrap">
          {analysis.segments.map((seg, idx) => (
            <span
              key={idx}
              className={`${
                seg.type === 'fact'
                  ? 'decoration-blue-400/50 decoration-2 underline underline-offset-4'
                  : seg.type === 'opinion'
                    ? 'decoration-orange-400/50 decoration-2 underline underline-offset-4'
                    : ''
              }`}
              title={
                seg.type === 'fact' ? '客観的事実' : seg.type === 'opinion' ? '主観的意見' : ''
              }
            >
              {seg.text}
            </span>
          ))}
        </p>

        {analysis.opinionRatio > 0.8 && analysis.segments.length > 2 && (
          <div className="flex items-center gap-2 text-[10px] bg-orange-100/50 text-orange-800 p-2 rounded-lg border border-orange-100 animate-fade-in">
            <AlertTriangle size={12} className="shrink-0" />
            <span>
              主観的な意見が多いようです。客観的な事実（データ）を補強すると説得力が増します。
            </span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col w-full mb-6">
      <div
        className={`flex items-end gap-3 animate-message-in relative ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
      >
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${isUser ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-blue-600'}`}
        >
          {isUser ? <User size={18} /> : <Bot size={18} />}
        </div>

        <div
          className={`flex flex-col max-w-[85%] md:max-w-[75%] ${isUser ? 'items-end' : 'items-start'}`}
        >
          <div
            className={`p-4 rounded-2xl shadow-sm text-sm md:text-base leading-relaxed whitespace-pre-wrap relative w-full ${isUser ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white border border-slate-100 text-slate-800 rounded-bl-none'}`}
          >
            {isUser ? (
              renderAnalyzedText()
            ) : (
              <MessageHighlighter
                text={text}
                highlightQuote={highlightQuote}
                detectedFallacy={detectedFallacy}
                onHighlightClick={onHighlightClick}
              />
            )}
          </div>

          {/* Structure Heatmap (User Only) */}
          {isUser && structureScore && <StructureHeatmap score={structureScore} />}
        </div>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  // メモ化の比較関数：これらのpropsが変わらない限り再レンダリングしない
  return (
    prevProps.text === nextProps.text &&
    prevProps.role === nextProps.role &&
    prevProps.analysis === nextProps.analysis &&
    prevProps.structureScore === nextProps.structureScore &&
    prevProps.highlightQuote === nextProps.highlightQuote &&
    prevProps.detectedFallacy === nextProps.detectedFallacy
  );
});
