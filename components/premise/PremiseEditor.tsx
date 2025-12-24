import React from 'react';
import { PremiseData } from '../../core/types';
import { AlertCircle, CheckCircle2, Edit3 } from 'lucide-react';

interface PremiseEditorProps {
  premises: PremiseData;
  setPremises: (data: PremiseData) => void;
  isEditing: boolean;
  onToggleEdit: () => void;
}

export const PremiseEditor: React.FC<PremiseEditorProps> = ({
  premises,
  setPremises,
  isEditing,
  onToggleEdit,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden mb-6">
      <div className="bg-slate-50 border-b border-slate-100 p-4 flex justify-between items-center">
        <span className="font-bold text-slate-700">AIからの提案</span>
        <button
          onClick={onToggleEdit}
          className={`text-xs flex items-center gap-1 px-3 py-1.5 rounded-lg border transition-all ${isEditing ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
        >
          <Edit3 size={14} />
          {isEditing ? '編集を終了' : '前提を修正'}
        </button>
      </div>

      <div className="p-6 space-y-6">
        {/* Definitions Section */}
        <div>
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
            <AlertCircle size={16} /> キーワードの定義
          </h3>
          {isEditing ? (
            <textarea
              value={premises.definitions}
              onChange={e => setPremises({ ...premises, definitions: e.target.value })}
              className="w-full p-3 rounded-xl border border-blue-300 focus:ring-2 focus:ring-blue-100 outline-none text-slate-800 bg-white text-sm leading-relaxed min-h-[100px]"
            />
          ) : (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-slate-800 leading-relaxed text-sm">
              {premises.definitions}
            </div>
          )}
        </div>

        {/* Goal Section */}
        <div>
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
            <CheckCircle2 size={16} /> 議論のゴール
          </h3>
          {isEditing ? (
            <textarea
              value={premises.goal}
              onChange={e => setPremises({ ...premises, goal: e.target.value })}
              className="w-full p-3 rounded-xl border border-blue-300 focus:ring-2 focus:ring-blue-100 outline-none text-slate-800 bg-white text-sm leading-relaxed min-h-[100px]"
            />
          ) : (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-slate-800 leading-relaxed text-sm">
              {premises.goal}
            </div>
          )}
        </div>
      </div>

      {isEditing && (
        <div className="px-6 pb-6 text-xs text-amber-600 flex items-center gap-1.5">
          <AlertCircle size={12} />
          <span>内容を変更すると、AIはこの前提に基づいて議論を行います。</span>
        </div>
      )}
    </div>
  );
};
