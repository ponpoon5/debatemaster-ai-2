import React from 'react';

interface MessageHighlighterProps {
  text: string;
  highlightQuote: string | null;
  detectedFallacy?: string | null;
  onHighlightClick?: () => void;
}

export const MessageHighlighter: React.FC<MessageHighlighterProps> = ({
  text,
  highlightQuote,
  detectedFallacy,
  onHighlightClick,
}) => {
  const trimmedQuote = highlightQuote?.trim();

  if (!trimmedQuote || !text.includes(trimmedQuote)) {
    return <>{text}</>;
  }

  const parts = text.split(trimmedQuote);

  return (
    <>
      {parts.map((part, i) => (
        <React.Fragment key={i}>
          {part}
          {i < parts.length - 1 && (
            <span
              className="bg-yellow-100 decoration-amber-500 decoration-wavy underline decoration-2 underline-offset-4 px-1 rounded mx-0.5 font-medium animate-pop-in cursor-help transition-colors hover:bg-yellow-200"
              title={`検出された詭弁: ${detectedFallacy}`}
              onClick={e => {
                e.stopPropagation();
                if (onHighlightClick) onHighlightClick();
              }}
            >
              {trimmedQuote}
            </span>
          )}
        </React.Fragment>
      ))}
    </>
  );
};
