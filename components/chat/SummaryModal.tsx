import React from 'react';
import { X, ListTodo, Loader2 } from 'lucide-react';

interface SummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  summaryPoints: string[];
  isGenerating: boolean;
}

export const SummaryModal: React.FC<SummaryModalProps> = ({
  isOpen,
  onClose,
  summaryPoints,
  isGenerating,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden animate-pop-in flex flex-col max-h-[80vh]">
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <div className="flex items-center gap-2 font-bold text-slate-800">
            <ListTodo size={20} className="text-blue-600" />
            現在の主な論点
          </div>
          <button onClick={onClose}>
            <X size={20} className="text-slate-400" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          {isGenerating ? (
            <div className="flex flex-col items-center py-8 gap-3 text-slate-400">
              <Loader2 size={32} className="animate-spin text-blue-500" /> 分析中...
            </div>
          ) : (
            <ul className="space-y-3">
              {summaryPoints.map((point, idx) => (
                <li key={idx} className="flex items-start gap-3 text-slate-700">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed font-medium">{point}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
