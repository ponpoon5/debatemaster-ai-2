import React from 'react';
import { Bot } from 'lucide-react';

export const ThinkingIndicator: React.FC = () => {
  return (
    <div className="flex items-end gap-3 animate-message-in mb-6 select-none opacity-80">
      <div className="w-8 h-8 rounded-full bg-white border border-slate-200 text-blue-600 flex items-center justify-center shrink-0 shadow-sm animate-pulse">
        <Bot size={18} />
      </div>

      <div className="px-4 py-3 rounded-2xl rounded-bl-none bg-white border border-slate-100 shadow-sm flex items-center gap-1 min-w-[60px] justify-center">
        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></div>
      </div>
      <span className="text-xs text-slate-400 animate-pulse font-medium pb-1">Thinking...</span>
    </div>
  );
};
