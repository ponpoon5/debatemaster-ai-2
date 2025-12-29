import React from 'react';
import { ArgumentBuilderModal } from './ArgumentBuilderModal';
import { ThinkingGymModal } from './ThinkingGymModal';
import { FiveWhysModal } from './FiveWhysModal';
import { SummaryModal } from './SummaryModal';
import { WhiteboardModal } from './WhiteboardModal';
import { HomeworkTask, ThinkingFramework } from '../../core/types';
import { ClipboardList, X, CheckCircle2, Trash2 } from 'lucide-react';

interface ChatModalsProps {
  // ArgumentBuilder
  showBuilder: boolean;
  setShowBuilder: (show: boolean) => void;
  builderMode: 'claim' | 'rebuttal';
  onSend: (text: string) => void;
  rebuttalTemplate?: string;

  // ThinkingGym
  showGymModal: boolean;
  setShowGymModal: (show: boolean) => void;
  framework?: ThinkingFramework;
  gymInitialTab: 'caq' | 'comparison';
  lastAiMessage?: string; // MECE軸承認判定用

  // FiveWhys
  showFiveWhysModal: boolean;
  setShowFiveWhysModal: (show: boolean) => void;

  // Summary
  summaryState: {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    points: string[];
    isGenerating: boolean;
  };

  // Whiteboard
  boardState: {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    data: string | null;
    isGenerating: boolean;
  };

  // Homework
  showHomeworkModal: boolean;
  setShowHomeworkModal: (show: boolean) => void;
  pendingTasks: HomeworkTask[];
  onCompleteHomework: (id: string, evidence: string) => void;
  onDeleteHomework: (id: string) => void;
}

export const ChatModals: React.FC<ChatModalsProps> = React.memo(({
  showBuilder,
  setShowBuilder,
  builderMode,
  onSend,
  rebuttalTemplate,
  showGymModal,
  setShowGymModal,
  framework,
  gymInitialTab,
  lastAiMessage,
  showFiveWhysModal,
  setShowFiveWhysModal,
  summaryState,
  boardState,
  showHomeworkModal,
  setShowHomeworkModal,
  pendingTasks,
  onCompleteHomework,
  onDeleteHomework,
}) => {
  const [homeworkEvidence, setHomeworkEvidence] = React.useState<{ [id: string]: string }>({});

  const handleHomeworkInput = (id: string, value: string) => {
    setHomeworkEvidence(prev => ({ ...prev, [id]: value }));
  };

  const handleCompleteHomework = (id: string) => {
    const evidence = homeworkEvidence[id] || '';
    if (evidence.trim()) {
      onCompleteHomework(id, evidence);
      setHomeworkEvidence(prev => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
    }
  };

  return (
    <>
      <ArgumentBuilderModal
        isOpen={showBuilder}
        onClose={() => setShowBuilder(false)}
        onSend={onSend}
        initialMode={builderMode}
        rebuttalTemplate={rebuttalTemplate}
      />

      <ThinkingGymModal
        isOpen={showGymModal}
        onClose={() => setShowGymModal(false)}
        onSend={onSend}
        framework={framework}
        initialTab={gymInitialTab}
        lastAiMessage={lastAiMessage}
      />

      <FiveWhysModal
        isOpen={showFiveWhysModal}
        onClose={() => setShowFiveWhysModal(false)}
        onSend={onSend}
      />

      <SummaryModal
        isOpen={summaryState.isOpen}
        onClose={() => summaryState.setIsOpen(false)}
        summaryPoints={summaryState.points}
        isGenerating={summaryState.isGenerating}
      />

      <WhiteboardModal
        isOpen={boardState.isOpen}
        onClose={() => boardState.setIsOpen(false)}
        boardData={boardState.data}
        isGenerating={boardState.isGenerating}
      />

      {showHomeworkModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden animate-pop-in flex flex-col max-h-[80vh]">
            <div className="bg-indigo-50 px-4 py-3 flex justify-between items-center border-b border-indigo-100">
              <div className="flex items-center gap-2 font-bold text-indigo-800">
                <ClipboardList size={20} />
                <span>宿題リスト</span>
                <span className="bg-indigo-200 text-indigo-800 text-xs px-2 py-0.5 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                  {pendingTasks.length}
                </span>
              </div>
              <button
                onClick={() => setShowHomeworkModal(false)}
                className="text-indigo-400 hover:text-indigo-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="overflow-y-auto flex-1">
              {pendingTasks.length === 0 ? (
                <div className="p-8 text-center text-slate-400">宿題なし</div>
              ) : (
                <div className="p-4 space-y-3">
                  {pendingTasks.map(task => (
                    <div
                      key={task.id}
                      className="bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-2"
                    >
                      <p className="text-sm font-bold text-slate-700">{task.description}</p>
                      <textarea
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        placeholder="証拠・事例を記入"
                        rows={2}
                        value={homeworkEvidence[task.id] || ''}
                        onChange={e => handleHomeworkInput(task.id, e.target.value)}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleCompleteHomework(task.id)}
                          className="flex-1 bg-emerald-500 text-white px-3 py-2 rounded-lg font-bold text-xs hover:bg-emerald-600 transition-colors flex items-center justify-center gap-1.5"
                          disabled={!homeworkEvidence[task.id]?.trim()}
                        >
                          <CheckCircle2 size={14} />
                          完了
                        </button>
                        <button
                          onClick={() => onDeleteHomework(task.id)}
                          className="bg-rose-50 text-rose-600 px-3 py-2 rounded-lg font-bold text-xs hover:bg-rose-100 transition-colors flex items-center gap-1"
                        >
                          <Trash2 size={14} />
                          削除
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
});

ChatModals.displayName = 'ChatModals';
