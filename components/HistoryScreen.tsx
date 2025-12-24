import React, { useRef } from 'react';
import { DebateArchive } from '../core/types';
import { Button } from './Button';
import { Calendar, Home, SearchX, Download, Upload, FileJson } from 'lucide-react';
import { HistoryItem } from './history/HistoryItem';
import { useHistoryLogic } from '../hooks/useHistoryLogic';

interface HistoryScreenProps {
  archives: DebateArchive[];
  onSelect: (archive: DebateArchive) => void;
  onDelete: (id: string) => void;
  onBack: () => void;
  onExport: () => void;
  onImport: (file: File) => Promise<boolean>;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({
  archives,
  onSelect,
  onDelete,
  onBack,
  onExport,
  onImport,
}) => {
  return (
    <HistoryScreenContent
      archives={archives}
      onSelect={onSelect}
      onDelete={onDelete}
      onBack={onBack}
      onExport={onExport}
      onImport={onImport}
    />
  );
};

const HistoryScreenContent: React.FC<HistoryScreenProps> = ({
  archives,
  onSelect,
  onDelete,
  onBack,
  onExport,
  onImport,
}) => {
  const { sortedArchives, isEmpty } = useHistoryLogic(archives);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await onImport(file);
      // Reset value via ref to ensure same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="h-full bg-slate-50 flex flex-col animate-fade-in">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shrink-0 z-10 sticky top-0 shadow-sm">
        <div className="flex items-center gap-2">
          <Button
            onClick={onBack}
            variant="ghost"
            className="p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-full"
          >
            <Home size={20} />
          </Button>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Calendar size={20} className="text-blue-600" />
            <span>議論の履歴</span>
            <span className="text-xs font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
              {archives.length}
            </span>
          </h2>
        </div>

        {/* Backup Actions */}
        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept=".json"
          />
          <button
            onClick={handleImportClick}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 transition-all shadow-sm"
            title="バックアップファイルを読み込む"
          >
            <Upload size={14} />
            <span className="hidden sm:inline">インポート</span>
          </button>
          <button
            onClick={onExport}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-slate-700 border border-slate-700 rounded-lg hover:bg-slate-800 hover:border-slate-800 transition-all shadow-sm"
            title="現在のデータをファイルに保存"
          >
            <Download size={14} />
            <span className="hidden sm:inline">バックアップ保存</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-3xl mx-auto">
          {isEmpty ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <div className="bg-slate-100 p-6 rounded-full mb-4">
                <SearchX size={48} className="opacity-50" />
              </div>
              <h3 className="text-lg font-bold text-slate-600 mb-2">履歴がありません</h3>
              <p className="text-sm mb-6">議論を完了すると、ここに結果が保存されます。</p>
              <div className="flex gap-4">
                <Button onClick={onBack} variant="primary">
                  トップに戻る
                </Button>
                <Button
                  onClick={handleImportClick}
                  variant="secondary"
                  className="flex items-center gap-2"
                >
                  <FileJson size={16} /> 過去のデータを復元
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 pb-20">
              {sortedArchives.map((archive, index) => (
                <HistoryItem
                  key={archive.id}
                  archive={archive}
                  onSelect={onSelect}
                  onDelete={onDelete}
                  style={{ animationDelay: `${index * 50}ms` }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
