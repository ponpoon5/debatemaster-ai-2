import React, { useRef, useEffect } from 'react';
import { Button } from '../Button';
import {
  Send,
  PenTool,
  Loader2,
  Wand2,
  BrainCircuit,
  Map,
  Play,
  Pause,
  SkipForward,
  ArrowRight,
} from 'lucide-react';

interface InputAreaProps {
  inputText: string;
  setInputText: (text: string) => void;
  isSending: boolean;
  supportMode: boolean;
  onSendMessage: (e: React.FormEvent) => void;
  onSendText?: (text: string) => void;
  onGetAdvice: () => void;
  isGettingAdvice: boolean;
  onGetStrategy: () => void;
  isGeneratingStrategy: boolean;
  onToggleBuilder: () => void;
  onToggleGym: () => void;
  isThinkingGymMode: boolean;
  isStudyMode: boolean;
  isDrillMode: boolean;
  isDemoMode?: boolean;
  hasMessages?: boolean;
  isAutoPlaying?: boolean;
  onToggleAutoPlay?: () => void;
  onNextTurn?: () => void;
}

export const InputArea: React.FC<InputAreaProps> = React.memo(({
  inputText,
  setInputText,
  isSending,
  supportMode,
  onSendMessage,
  onSendText,
  onGetAdvice,
  isGettingAdvice,
  onGetStrategy,
  isGeneratingStrategy,
  onToggleBuilder,
  onToggleGym,
  isThinkingGymMode,
  isStudyMode,
  isDrillMode,
  isDemoMode,
  hasMessages,
  isAutoPlaying,
  onToggleAutoPlay,
  onNextTurn,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isDemoMode) {
      inputRef.current?.focus();
    }
  }, [isDemoMode]);

  // Special Input Area for Demo Mode
  if (isDemoMode) {
    return (
      <div className="p-4 bg-white border-t border-slate-200 relative z-20">
        <div className="max-w-xl mx-auto flex items-center justify-center gap-4">
          <button
            onClick={onToggleAutoPlay}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all shadow-md ${
              isAutoPlaying
                ? 'bg-amber-100 text-amber-700 border-2 border-amber-300 hover:bg-amber-200'
                : 'bg-emerald-600 text-white hover:bg-emerald-700'
            }`}
          >
            {isAutoPlaying ? (
              <Pause size={20} fill="currentColor" />
            ) : (
              <Play size={20} fill="currentColor" />
            )}
            <span>{isAutoPlaying ? '一時停止' : '自動再生'}</span>
          </button>

          <button
            onClick={onNextTurn}
            disabled={isSending || isAutoPlaying}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-white border-2 border-slate-200 text-slate-700 font-bold hover:border-blue-400 hover:text-blue-600 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSending ? <Loader2 size={20} className="animate-spin" /> : <SkipForward size={20} />}
            <span>次の発言</span>
          </button>
        </div>
        <div className="text-center mt-2 text-xs text-slate-400">
          {isAutoPlaying ? '自動再生中...' : '自分のペースで進めることができます'}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white border-t border-slate-200 relative z-20">
      <div className="max-w-4xl mx-auto">
        {isStudyMode && (
          <div className="flex gap-2 mb-2 overflow-x-auto scrollbar-hide pb-1">
            <button
              type="button"
              onClick={() => onSendText?.('理解しました、次のステップへ進んでください。')}
              disabled={isSending}
              className="whitespace-nowrap px-4 py-2 bg-purple-600 text-white rounded-full text-xs font-bold hover:bg-purple-700 transition-colors disabled:opacity-50 shadow-sm flex items-center gap-1 shrink-0"
            >
              理解しました <ArrowRight size={12} />
            </button>
            <button
              type="button"
              onClick={() => onSendText?.('具体例をもっと教えてください。')}
              disabled={isSending}
              className="whitespace-nowrap px-4 py-2 bg-white text-purple-600 rounded-full text-xs font-bold hover:bg-purple-50 transition-colors disabled:opacity-50 border border-purple-200 shadow-sm shrink-0"
            >
              具体例をもっと
            </button>
            <button
              type="button"
              onClick={() => onSendText?.('なぜそうなるのですか？詳しく教えてください。')}
              disabled={isSending}
              className="whitespace-nowrap px-4 py-2 bg-white text-purple-600 rounded-full text-xs font-bold hover:bg-purple-50 transition-colors disabled:opacity-50 border border-purple-200 shadow-sm shrink-0"
            >
              詳しく理由を
            </button>
          </div>
        )}

        <form onSubmit={onSendMessage} className="relative flex gap-2 items-center">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder="メッセージを入力..."
              className="w-full pl-4 pr-20 py-3.5 rounded-2xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all shadow-sm text-base bg-white text-slate-900 placeholder:text-slate-400"
              disabled={isSending}
            />

            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              {supportMode && (
                <button
                  type="button"
                  onClick={onGetAdvice}
                  disabled={isGettingAdvice}
                  className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all relative group disabled:opacity-70 disabled:cursor-wait"
                  title="AI添削・分析を実行"
                >
                  {isGettingAdvice ? (
                    <Loader2 size={18} className="animate-spin text-blue-500" />
                  ) : (
                    <PenTool size={18} />
                  )}
                  {!isGettingAdvice && (
                    <span className="absolute bottom-full right-0 mb-2 w-max px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      AI添削
                    </span>
                  )}
                </button>
              )}
            </div>
          </div>

          {!isStudyMode && !isDrillMode && !isThinkingGymMode && (
            <>
              <button
                type="button"
                onClick={onGetStrategy}
                disabled={isGeneratingStrategy || !hasMessages}
                className="p-3.5 rounded-2xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:text-indigo-700 transition-all border border-indigo-200 shadow-sm flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                title="戦略ナビゲーター"
              >
                {isGeneratingStrategy ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <Map size={20} />
                )}
              </button>

              <button
                type="button"
                onClick={onToggleBuilder}
                className="p-3.5 rounded-2xl bg-slate-100 text-slate-600 hover:bg-blue-100 hover:text-blue-600 transition-all border border-slate-200 shadow-sm flex-shrink-0"
                title="論理構築ビルダーを開く"
              >
                <Wand2 size={20} />
              </button>
            </>
          )}

          {isThinkingGymMode && (
            <button
              type="button"
              onClick={onToggleGym}
              className="p-3.5 rounded-2xl bg-indigo-100 text-indigo-600 hover:bg-indigo-200 transition-all border border-indigo-200 shadow-sm flex-shrink-0 animate-pulse"
              title="思考フレームワーク入力"
            >
              <BrainCircuit size={20} />
            </button>
          )}

          <Button
            type="submit"
            disabled={!inputText.trim() || isSending}
            className={`rounded-2xl w-14 h-14 flex items-center justify-center shadow-lg transition-all flex-shrink-0 ${!inputText.trim() ? 'bg-slate-300' : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:scale-105 active:scale-95'}`}
          >
            {isSending ? (
              <Loader2 size={24} className="animate-spin" />
            ) : (
              <Send size={24} className="ml-0.5" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
});
