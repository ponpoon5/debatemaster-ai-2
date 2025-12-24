import React from 'react';
import { HomeworkTask } from '../../core/types';
import { ClipboardList, X, Trash2, CheckCircle2 } from 'lucide-react';

interface HomeworkModalProps {
  isOpen: boolean;
  onClose: () => void;
  homeworkTasks: HomeworkTask[];
  onCompleteHomework: (id: string, evidence: string) => void;
  onDeleteHomework: (id: string) => void;
}

export const HomeworkModal: React.FC<HomeworkModalProps> = ({
  isOpen,
  onClose,
  homeworkTasks,
  onCompleteHomework,
  onDeleteHomework,
}) => {
  if (!isOpen) return null;

  const pendingTasks = homeworkTasks.filter(t => t.status === 'pending');

  return (
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
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>
        <div className="p-4 overflow-y-auto">
          {pendingTasks.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <ClipboardList size={40} className="mx-auto mb-2 opacity-50" />
              <p>現在、宿題はありません。</p>
              <p className="text-xs mt-1">議論のフィードバックで提案されます。</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingTasks.map(task => (
                <div
                  key={task.id}
                  className="border border-slate-200 rounded-lg p-3 bg-slate-50 hover:bg-white transition-colors group"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase ${
                        task.difficulty === 'hard'
                          ? 'bg-red-50 text-red-600 border-red-100'
                          : task.difficulty === 'normal'
                            ? 'bg-blue-50 text-blue-600 border-blue-100'
                            : 'bg-green-50 text-green-600 border-green-100'
                      }`}
                    >
                      {task.difficulty}
                    </span>
                    <span className="font-bold text-slate-800 text-sm">{task.title}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed mb-2">{task.description}</p>

                  <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onDeleteHomework(task.id)}
                      className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors"
                      title="削除"
                    >
                      <Trash2 size={14} />
                    </button>
                    <button
                      onClick={() => {
                        const evidence = prompt('完了のメモを残しますか?(任意)');
                        onCompleteHomework(task.id, evidence || '');
                      }}
                      className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-lg border border-emerald-200 hover:bg-emerald-100 transition-colors"
                    >
                      <CheckCircle2 size={12} />
                      完了
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
