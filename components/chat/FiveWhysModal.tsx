import React, { useState } from 'react';
import { X, BrainCircuit, Dices } from 'lucide-react';
import { Button } from '../Button';
import { FiveWhysDetailedInput } from '../thinking-gym/FiveWhysDetailedInput';
import {
  WhyStep,
  RootCauseSummary,
  CauseType,
  Controllability,
} from '../../core/types';

interface FiveWhysModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (text: string) => void;
  lastAiMessage?: string; // AI生成問題の検出用
}

type Tab = 'ai_topic' | 'custom_topic';

const CAUSE_TYPE_LABELS: Record<CauseType, string> = {
  [CauseType.PERSON]: '人',
  [CauseType.PROCESS]: 'プロセス',
  [CauseType.TOOL]: 'ツール',
  [CauseType.INFORMATION]: '情報',
  [CauseType.ENVIRONMENT]: '環境',
  [CauseType.MANAGEMENT]: '管理',
};

const CONTROLLABILITY_LABELS: Record<Controllability, string> = {
  [Controllability.HIGH]: '高',
  [Controllability.MEDIUM]: '中',
  [Controllability.LOW]: '低',
};

export const FiveWhysModal: React.FC<FiveWhysModalProps> = ({
  isOpen,
  onClose,
  onSend,
  lastAiMessage,
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('ai_topic');
  const [customProblem, setCustomProblem] = useState('');
  const [showDetailedInput, setShowDetailedInput] = useState(false);
  const [currentProblem, setCurrentProblem] = useState('');
  const [waitingForAiProblem, setWaitingForAiProblem] = useState(false);

  // AI生成問題の検出と自動遷移
  React.useEffect(() => {
    if (waitingForAiProblem && lastAiMessage) {
      // [Problem] を抽出
      const problemMatch = lastAiMessage.match(/\[Problem\]\s*(.+?)(?:\n|$)/i);
      if (problemMatch) {
        const extractedProblem = problemMatch[1].trim();
        setCurrentProblem(extractedProblem);
        setShowDetailedInput(true);
        setWaitingForAiProblem(false);
      }
    }
  }, [lastAiMessage, waitingForAiProblem]);

  if (!isOpen) return null;

  const handleRequestAiTopic = () => {
    setWaitingForAiProblem(true);
    onSend('課題の自動作成をお願いします。');
    // モーダルは閉じない！
  };

  const handleStartCustomProblem = () => {
    if (!customProblem.trim()) return;
    setCurrentProblem(customProblem);
    setShowDetailedInput(true);
  };

  const formatEvidence = (evidence: WhyStep['evidence']): string => {
    const parts: string[] = [];
    if (evidence.data) parts.push(`[Data] ${evidence.data}`);
    if (evidence.example) parts.push(`[Example] ${evidence.example}`);
    if (evidence.observation) parts.push(`[Observation] ${evidence.observation}`);
    return parts.length > 0 ? parts.join(' / ') : '-';
  };

  const handleSubmitAnalysis = (
    whys: [WhyStep, WhyStep, WhyStep, WhyStep, WhyStep],
    summary?: RootCauseSummary
  ) => {
    // Format detailed Why data for AI
    let message = `【なぜなぜ分析（詳細版）】\n\n`;
    message += `[Problem] ${currentProblem}\n\n`;

    whys.forEach((why, index) => {
      message += `━━━ Why ${index + 1} ━━━\n`;
      message += `[Cause] ${why.cause}\n`;
      if (why.mechanism) {
        message += `[Mechanism] ${why.mechanism}\n`;
      }
      message += `[Evidence] ${formatEvidence(why.evidence)}${why.isHypothesis ? ' (仮説)' : ''}\n`;
      message += `[Type] ${CAUSE_TYPE_LABELS[why.causeType!]}\n`;
      message += `[Confidence] ${why.confidence}%\n`;
      if (why.controllability) {
        message += `[Controllability] ${CONTROLLABILITY_LABELS[why.controllability]}\n`;
      }
      message += `\n`;
    });

    if (summary) {
      message += `━━━ 最終まとめ ━━━\n`;
      message += `[Root Cause] ${summary.rootCause}\n`;
      message += `[One Action] ${summary.oneAction}\n`;
      message += `[Success Metric] ${summary.successMetric}\n`;
    }

    onSend(message);

    // Reset state
    setShowDetailedInput(false);
    setCustomProblem('');
    setCurrentProblem('');
    setWaitingForAiProblem(false);
    setActiveTab('ai_topic');

    onClose();
  };

  const handleBack = () => {
    setShowDetailedInput(false);
    setCurrentProblem('');
  };

  const handleClose = () => {
    // 状態をリセット
    setShowDetailedInput(false);
    setCustomProblem('');
    setCurrentProblem('');
    setWaitingForAiProblem(false);
    setActiveTab('ai_topic');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <BrainCircuit size={24} className="text-amber-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">5 Whys (なぜなぜ分析)</h2>
              <p className="text-sm text-slate-500">根本原因を深く掘り下げる</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X size={24} className="text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {waitingForAiProblem ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
              <p className="text-slate-600 font-bold">AIが課題を生成中...</p>
              <p className="text-sm text-slate-400 mt-2">問題が生成されたら自動的に入力フォームに進みます</p>
            </div>
          ) : !showDetailedInput ? (
            <>
              {/* Tab Selection */}
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => setActiveTab('ai_topic')}
                  className={`flex-1 px-4 py-3 rounded-lg font-bold text-sm transition-colors ${
                    activeTab === 'ai_topic'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Dices size={16} className="inline mr-2" />
                  AI課題を生成
                </button>
                <button
                  onClick={() => setActiveTab('custom_topic')}
                  className={`flex-1 px-4 py-3 rounded-lg font-bold text-sm transition-colors ${
                    activeTab === 'custom_topic'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  自分で問題を入力
                </button>
              </div>

              {/* Tab Content */}
              {activeTab === 'ai_topic' ? (
                <div className="space-y-4">
                  <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                    <p className="text-sm text-indigo-900">
                      AIが5 Whysに適したビジネス課題を生成し、問題定義ブロック（Impact/Scope/Timeframe/Evidence）も自動で補完します。
                    </p>
                  </div>
                  <Button
                    onClick={handleRequestAiTopic}
                    fullWidth
                    className="bg-indigo-600 text-white hover:bg-indigo-700 h-12"
                  >
                    AI課題を生成する
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <p className="text-sm text-amber-900 mb-3">
                      分析したい問題を入力してください。AIが問題定義ブロック（Impact/Scope/Timeframe/Evidence）を補完します。
                    </p>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Problem（問題文）<span className="text-rose-500">*必須</span>
                    </label>
                    <input
                      type="text"
                      placeholder="例：出荷ミスが増えている"
                      value={customProblem}
                      onChange={e => setCustomProblem(e.target.value)}
                      className="w-full p-3 border border-amber-300 rounded-lg text-sm bg-white text-slate-900 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 outline-none"
                    />
                  </div>
                  <Button
                    onClick={handleStartCustomProblem}
                    disabled={!customProblem.trim()}
                    fullWidth
                    className={`h-12 ${
                      customProblem.trim()
                        ? 'bg-amber-600 text-white hover:bg-amber-700'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    Why分析を開始
                  </Button>
                </div>
              )}
            </>
          ) : (
            <>
              {/* Back Button */}
              <button
                onClick={handleBack}
                className="mb-4 text-sm font-bold text-slate-600 hover:text-slate-900"
              >
                ← 問題選択に戻る
              </button>

              {/* Detailed Input Form */}
              <FiveWhysDetailedInput
                problem={currentProblem}
                onSubmit={handleSubmitAnalysis}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
