import React from 'react';
import { HomeworkTask } from '../../core/types';
import { ListTodo, Presentation, DoorOpen, Loader2, Home, ClipboardList } from 'lucide-react';

interface ChatHeaderProps {
  onBackToTop: () => void;
  onShowHomework: () => void;
  onEndDebate: () => void;
  pendingTasksCount: number;
  isDemoMode: boolean;
  isStudyMode: boolean;
  isDrillMode: boolean;
  isFacilitationMode: boolean;
  summaryState: {
    generate: () => void;
    isGenerating: boolean;
  };
  boardState: {
    generate: () => void;
    isGenerating: boolean;
  };
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  onBackToTop,
  onShowHomework,
  onEndDebate,
  pendingTasksCount,
  isDemoMode,
  isStudyMode,
  isDrillMode,
  isFacilitationMode,
  summaryState,
  boardState,
}) => {
  return (
    <>
      {/* Back to Top Button */}
      <div className="absolute top-4 left-4 z-30">
        <button
          onClick={onBackToTop}
          className="p-2 bg-white/90 backdrop-blur rounded-full shadow-md text-slate-600 hover:text-blue-600 transition-all border border-slate-200"
          title="トップに戻る"
        >
          <Home size={20} />
        </button>
      </div>

      {/* Floating Action Buttons */}
      <div className="absolute top-4 right-4 z-30 flex flex-col gap-2">
        <button
          onClick={onShowHomework}
          className="p-2 bg-white/90 backdrop-blur rounded-full shadow-md text-slate-600 hover:text-indigo-600 transition-all border border-slate-200 relative group"
          title="宿題リスト"
        >
          <ClipboardList size={20} />
          {pendingTasksCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
              {pendingTasksCount}
            </span>
          )}
        </button>

        {!isDemoMode && !isStudyMode && !isDrillMode && (
          <>
            <button
              onClick={summaryState.generate}
              disabled={summaryState.isGenerating}
              className="p-2 bg-white/90 backdrop-blur rounded-full shadow-md text-slate-600 hover:text-blue-600 transition-all border border-slate-200 disabled:opacity-70 disabled:cursor-not-allowed"
              title="議論を要約"
            >
              {summaryState.isGenerating ? (
                <Loader2 size={20} className="animate-spin text-blue-500" />
              ) : (
                <ListTodo size={20} />
              )}
            </button>
            {isFacilitationMode && (
              <button
                onClick={boardState.generate}
                disabled={boardState.isGenerating}
                className="p-2 bg-white/90 backdrop-blur rounded-full shadow-md text-slate-600 hover:text-green-600 transition-all border border-slate-200 disabled:opacity-70 disabled:cursor-not-allowed"
                title="ホワイトボードを表示"
              >
                {boardState.isGenerating ? (
                  <Loader2 size={20} className="animate-spin text-green-500" />
                ) : (
                  <Presentation size={20} />
                )}
              </button>
            )}
          </>
        )}
        <button
          onClick={onEndDebate}
          className="p-2 bg-red-500/90 backdrop-blur rounded-full shadow-md text-white hover:bg-red-600 transition-all border border-red-400"
          title="議論を終了して分析"
        >
          <DoorOpen size={20} />
        </button>
      </div>
    </>
  );
};
