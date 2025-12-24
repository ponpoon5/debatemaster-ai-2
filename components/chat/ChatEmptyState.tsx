import React from 'react';
import { Bot, Swords, Shield, Dices, PenTool } from 'lucide-react';

interface ChatEmptyStateProps {
  isDemoMode: boolean;
  isStandardDebate: boolean;
  isThinkingGymMode: boolean;
  isSending: boolean;
  onAiStart: (stance: 'PRO' | 'CON') => void;
  onSendMessage: (text: string) => void;
  onOpenGymModal: () => void;
}

export const ChatEmptyState: React.FC<ChatEmptyStateProps> = ({
  isDemoMode,
  isStandardDebate,
  isThinkingGymMode,
  isSending,
  onAiStart,
  onSendMessage,
  onOpenGymModal,
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-6">
      <div className="max-w-md w-full text-center space-y-6 animate-fade-in-up">
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bot size={28} />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">
            {isDemoMode ? '模範ディベート視聴' : '議論を開始しましょう'}
          </h3>
          <p className="text-sm text-slate-500 mb-6">
            {isDemoMode
              ? 'AI同士のハイレベルな議論を観戦します。\n自動再生で流れを見るか、自分のペースで進めてください。'
              : 'AIに先攻（立論）を任せるか、\n下の入力欄からあなたが発言して開始してください。'}
          </p>

          {!isDemoMode && isStandardDebate && (
            <div className="grid gap-3">
              <button
                onClick={() => onAiStart('PRO')}
                disabled={isSending}
                className="flex items-center justify-center gap-3 w-full p-4 rounded-xl border-2 border-slate-100 hover:border-blue-500 hover:bg-blue-50 transition-all group text-left disabled:opacity-50"
              >
                <div className="bg-blue-100 text-blue-600 p-2 rounded-lg group-hover:bg-blue-500 group-hover:text-white transition-colors">
                  <Swords size={20} />
                </div>
                <div>
                  <span className="block font-bold text-slate-700 group-hover:text-blue-700">
                    AIが肯定側で開始
                  </span>
                  <span className="text-xs text-slate-400">AIが先攻で立論を行います</span>
                </div>
              </button>

              <button
                onClick={() => onAiStart('CON')}
                disabled={isSending}
                className="flex items-center justify-center gap-3 w-full p-4 rounded-xl border-2 border-slate-100 hover:border-red-500 hover:bg-red-50 transition-all group text-left disabled:opacity-50"
              >
                <div className="bg-red-100 text-red-600 p-2 rounded-lg group-hover:bg-red-500 group-hover:text-white transition-colors">
                  <Shield size={20} />
                </div>
                <div>
                  <span className="block font-bold text-slate-700 group-hover:text-red-700">
                    AIが否定側で開始
                  </span>
                  <span className="text-xs text-slate-400">AIが先攻で立論を行います</span>
                </div>
              </button>
            </div>
          )}

          {isThinkingGymMode && (
            <div className="grid gap-3">
              <button
                onClick={() => onSendMessage('課題の自動作成をお願いします。')}
                disabled={isSending}
                className="flex items-center justify-center gap-3 w-full p-4 rounded-xl border-2 border-indigo-100 hover:border-indigo-500 hover:bg-indigo-50 transition-all group text-left disabled:opacity-50"
              >
                <div className="bg-indigo-100 text-indigo-600 p-2 rounded-lg group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                  <Dices size={20} />
                </div>
                <div>
                  <span className="block font-bold text-slate-700 group-hover:text-indigo-700">
                    AIに課題を出してもらう
                  </span>
                  <span className="text-xs text-slate-400">ランダムなテーマで練習します</span>
                </div>
              </button>

              <button
                onClick={onOpenGymModal}
                disabled={isSending}
                className="flex items-center justify-center gap-3 w-full p-4 rounded-xl border-2 border-slate-100 hover:border-slate-400 hover:bg-slate-50 transition-all group text-left disabled:opacity-50"
              >
                <div className="bg-slate-100 text-slate-500 p-2 rounded-lg group-hover:bg-slate-600 group-hover:text-white transition-colors">
                  <PenTool size={20} />
                </div>
                <div>
                  <span className="block font-bold text-slate-700 group-hover:text-slate-800">
                    自分でテーマを決める
                  </span>
                  <span className="text-xs text-slate-400">好きな課題で分析します</span>
                </div>
              </button>
            </div>
          )}

          {!isDemoMode && !isStandardDebate && !isThinkingGymMode && (
            <p className="text-sm text-slate-400">下の入力欄から開始してください</p>
          )}
        </div>
      </div>
    </div>
  );
};
