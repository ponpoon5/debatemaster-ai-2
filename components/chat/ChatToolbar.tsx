import React from 'react';
import {
  ListTodo,
  Presentation,
  DoorOpen,
  Home,
  Loader2,
  ClipboardList,
  Scale,
} from 'lucide-react';
import type { DebateMode, HomeworkTask } from '../../core/types';

interface ChatToolbarProps {
  onBackToTop: () => void;
  onShowHomework: () => void;
  onEndDebate: () => void;
  onGenerateSummary: () => void;
  onToggleBurdenTracker: () => void;
  onGenerateBoard: () => void;
  pendingTasks: HomeworkTask[];
  isGeneratingSummary: boolean;
  isGeneratingBoard: boolean;
  isAnalyzingBurden: boolean;
  showBurdenTracker: boolean;
  mode: DebateMode;
  messagesCount: number;
}

/**
 * チャット画面のツールバー
 * 戻るボタン、宿題、要約、立証責任、ホワイトボード、終了ボタンを表示
 */
export const ChatToolbar: React.FC<ChatToolbarProps> = React.memo(({
  onBackToTop,
  onShowHomework,
  onEndDebate,
  onGenerateSummary,
  onToggleBurdenTracker,
  onGenerateBoard,
  pendingTasks,
  isGeneratingSummary,
  isGeneratingBoard,
  isAnalyzingBurden,
  showBurdenTracker,
  mode,
  messagesCount,
}) => {
  const isDemoMode = mode === 'DEMO';
  const isStudyMode = mode === 'STUDY';
  const isDrillMode = mode === 'DRILL';
  const isStandardDebate = mode === 'DEBATE';
  const isFacilitationMode = mode === 'FACILITATION';

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
        {/* 宿題リスト */}
        <button
          onClick={onShowHomework}
          className="p-2 bg-white/90 backdrop-blur rounded-full shadow-md text-slate-600 hover:text-indigo-600 transition-all border border-slate-200 relative group"
          title="宿題リスト"
        >
          <ClipboardList size={20} />
          {pendingTasks.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
              {pendingTasks.length}
            </span>
          )}
        </button>

        {!isDemoMode && !isStudyMode && !isDrillMode && (
          <>
            {/* 要約生成 */}
            <button
              onClick={onGenerateSummary}
              disabled={isGeneratingSummary}
              className="p-2 bg-white/90 backdrop-blur rounded-full shadow-md text-slate-600 hover:text-blue-600 transition-all border border-slate-200 disabled:opacity-70 disabled:cursor-not-allowed"
              title="議論を要約"
            >
              {isGeneratingSummary ? (
                <Loader2 size={20} className="animate-spin text-blue-500" />
              ) : (
                <ListTodo size={20} />
              )}
            </button>

            {/* 立証責任トラッカー */}
            {isStandardDebate && (
              <button
                onClick={onToggleBurdenTracker}
                disabled={isAnalyzingBurden || messagesCount < 2}
                className={`p-2 bg-white/90 backdrop-blur rounded-full shadow-md transition-all border border-slate-200 disabled:opacity-70 disabled:cursor-not-allowed ${
                  showBurdenTracker
                    ? 'text-indigo-600 bg-indigo-50 border-indigo-300'
                    : 'text-slate-600 hover:text-indigo-600'
                }`}
                title={showBurdenTracker ? '立証責任トラッカーを閉じる' : '立証責任を分析'}
              >
                {isAnalyzingBurden ? (
                  <Loader2 size={20} className="animate-spin text-indigo-500" />
                ) : (
                  <Scale size={20} />
                )}
              </button>
            )}

            {/* ホワイトボード（ファシリテーションモード） */}
            {isFacilitationMode && (
              <button
                onClick={onGenerateBoard}
                disabled={isGeneratingBoard}
                className="p-2 bg-white/90 backdrop-blur rounded-full shadow-md text-slate-600 hover:text-green-600 transition-all border border-slate-200 disabled:opacity-70 disabled:cursor-not-allowed"
                title="ホワイトボードを表示"
              >
                {isGeneratingBoard ? (
                  <Loader2 size={20} className="animate-spin text-green-500" />
                ) : (
                  <Presentation size={20} />
                )}
              </button>
            )}
          </>
        )}

        {/* 終了ボタン */}
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
});
