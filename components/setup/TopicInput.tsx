import React from 'react';
import { DebateMode, DebateType } from '../../core/types';
import { Sparkles, RefreshCw, CloudLightning, Loader2, Dices } from 'lucide-react';

interface TopicInputProps {
  topic: string;
  setTopic: (topic: string) => void;
  activeMode: DebateMode;
  debateType: DebateType;
  suggestedTopics: string[];
  isGeneratingRandom: boolean;
  isRefreshingSuggestions: boolean;
  onGenerateRandom: () => void;
  onRefreshSuggestions: () => void;
  onShuffleSuggestions: () => void;
}

export const TopicInput: React.FC<TopicInputProps> = ({
  topic,
  setTopic,
  activeMode,
  debateType,
  suggestedTopics,
  isGeneratingRandom,
  isRefreshingSuggestions,
  onGenerateRandom,
  onRefreshSuggestions,
  onShuffleSuggestions,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="topic" className="block text-sm font-semibold text-slate-700 mb-2">
          {activeMode === DebateMode.FACILITATION
            ? '合意形成のテーマ'
            : activeMode === DebateMode.STORY
              ? '物語のテーマ・設定'
              : '議論のテーマ'}
        </label>
        <div className="flex gap-2">
          <input
            id="topic"
            type="text"
            value={topic}
            onChange={e => setTopic(e.target.value)}
            placeholder={
              activeMode === DebateMode.STORY
                ? '例: パンデミック対策、AIの反乱、宇宙移民'
                : '例: リモートワークは生産性を高めるか？'
            }
            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder-slate-400 hover:border-blue-300 appearance-none"
            required
          />
          <button
            type="button"
            onClick={onGenerateRandom}
            disabled={isGeneratingRandom}
            className="px-4 py-2 rounded-xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 text-slate-700 hover:from-slate-50 hover:to-slate-100 hover:text-blue-600 hover:border-blue-200 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-70 disabled:cursor-wait min-w-[140px] shadow-sm"
            title="選択中の種類に合わせたテーマを自動生成"
          >
            {isGeneratingRandom ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Dices size={20} />
            )}
            <span className="text-sm font-medium">おまかせ</span>
          </button>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <Sparkles size={16} className="text-yellow-500" />
            おすすめのテーマ{' '}
            {activeMode === DebateMode.DEBATE && (
              <span className="text-xs font-normal text-slate-400">
                (
                {debateType === DebateType.POLICY
                  ? '政策'
                  : debateType === DebateType.FACT
                    ? '推定'
                    : '価値'}
                )
              </span>
            )}
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onShuffleSuggestions}
              className="text-slate-500 hover:text-blue-600 transition-colors p-1.5 rounded-md hover:bg-slate-100 flex items-center gap-1 text-xs font-medium"
              title="リストをシャッフル（API不使用）"
            >
              <RefreshCw size={12} />
              <span>入替</span>
            </button>
            <button
              type="button"
              onClick={onRefreshSuggestions}
              disabled={isRefreshingSuggestions}
              className="text-blue-700 bg-gradient-to-b from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 transition-colors py-1 px-2 rounded-md flex items-center gap-1.5 text-xs font-bold disabled:opacity-50"
              title="AIを使って新しいテーマ案を5つ生成する"
            >
              {isRefreshingSuggestions ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <CloudLightning size={12} />
              )}
              <span>AI提案</span>
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 min-h-[80px]">
          {isRefreshingSuggestions ? (
            <div className="w-full flex items-center justify-center h-20 text-slate-400 gap-2 text-sm animate-pulse">
              <Sparkles size={16} />
              新しいテーマを考案中...
            </div>
          ) : (
            suggestedTopics.map((t, idx) => (
              <button
                key={`${t}-${idx}`}
                type="button"
                onClick={() => setTopic(t)}
                className="px-3 py-1.5 rounded-full bg-slate-50 text-slate-600 text-sm hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 border border-slate-200 transition-all active:scale-95 animate-fade-in text-left"
              >
                {t}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
