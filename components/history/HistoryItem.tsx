import React from 'react';
import { DebateArchive } from '../../core/types';
import { Button } from '../Button';
import { Calendar, MessageSquare, Trophy, Trash2, ArrowRight } from 'lucide-react';

interface HistoryItemProps {
  archive: DebateArchive;
  onSelect: (archive: DebateArchive) => void;
  onDelete: (id: string) => void;
  style?: React.CSSProperties;
}

export const HistoryItem: React.FC<HistoryItemProps> = ({ archive, onSelect, onDelete, style }) => {
  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return new Intl.DateTimeFormat('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    } catch (e) {
      return isoString;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 60) return 'text-blue-600 bg-blue-50 border-blue-200';
    return 'text-amber-600 bg-amber-50 border-amber-200';
  };

  return (
    <div
      className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 hover:shadow-md transition-all group animate-fade-in-up"
      style={style}
    >
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <Calendar size={12} />
            <span>{formatDate(archive.date)}</span>
            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
            <MessageSquare size={12} />
            <span>{archive.messages.length} turns</span>
          </div>
          <h3 className="text-lg font-bold text-slate-800 truncate pr-4">{archive.topic}</h3>
        </div>

        <div
          className={`px-3 py-1.5 rounded-lg border font-bold text-lg flex items-center gap-1.5 shrink-0 ${getScoreColor(archive.feedback.score)}`}
        >
          <Trophy size={16} />
          {archive.feedback.score}
        </div>
      </div>

      <div className="bg-slate-50 p-3 rounded-xl text-sm text-slate-600 mb-4 line-clamp-2 border border-slate-100">
        <span className="font-bold text-slate-400 text-xs uppercase mr-2">Summary</span>
        {archive.feedback.summary}
      </div>

      <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-2">
        <button
          onClick={e => {
            e.stopPropagation();
            onDelete(archive.id);
          }}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-red-600 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors"
        >
          <Trash2 size={14} />
          削除
        </button>

        <Button
          onClick={() => onSelect(archive)}
          size="sm"
          className="bg-slate-800 hover:bg-slate-900 text-white"
        >
          詳細を見る <ArrowRight size={16} className="ml-1" />
        </Button>
      </div>
    </div>
  );
};
