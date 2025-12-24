import React, { useState } from 'react';
import {
  FeedbackData,
  Message,
  TokenUsage,
  HomeworkSuggestion,
  HomeworkTask,
  DebateMode,
  TrainingRecommendation,
} from '../core/types';
import { Button } from './Button';
import {
  Trophy,
  RefreshCcw,
  Home,
  ArrowLeft,
  ClipboardList,
  Plus,
  Check,
  FileText,
} from 'lucide-react';
import { useFeedbackLogic } from '../hooks/useFeedbackLogic';

// Sub-components
import { DetailedReviewSection } from './feedback/DetailedReviewSection';
import { SummarySection } from './feedback/SummarySection';
import { LogicSection } from './feedback/LogicSection';
import { QuestioningSection } from './feedback/QuestioningSection';
import { ExemplarSection } from './feedback/ExemplarSection';

interface FeedbackScreenProps {
  feedback: FeedbackData;
  messages: Message[];
  onReset: () => void;
  tokenUsage?: TokenUsage;
  isArchiveView?: boolean;
  onBackToHistory?: () => void;
  onAddHomework: (tasks: HomeworkTask[]) => void;
  onNavigate: (rec: TrainingRecommendation) => void;
}

export const FeedbackScreen: React.FC<FeedbackScreenProps> = ({
  feedback,
  messages,
  onReset,
  tokenUsage,
  isArchiveView,
  onBackToHistory,
  onAddHomework,
  onNavigate,
}) => {
  const {
    activeTab,
    setActiveTab,
    isFacilitationMode,
    isStoryMode,
    isDemoMode,
    showReviewTab,
    showLogicTab,
    showQuestioningTab,
    showExemplarsTab,
  } = useFeedbackLogic(feedback);

  const [assignedHomework, setAssignedHomework] = useState<Set<number>>(new Set());

  const handleAddHomework = (idx: number, suggestion: HomeworkSuggestion) => {
    const newTask: HomeworkTask = {
      id: Date.now().toString() + idx,
      createdAt: new Date().toISOString(),
      title: suggestion.title,
      description: suggestion.description,
      targetSkills: suggestion.targetSkills,
      difficulty: suggestion.difficulty,
      status: 'pending',
      mode: (suggestion.suggestedPracticeModes?.[0] as DebateMode) || DebateMode.DEBATE,
    };
    onAddHomework([newTask]);
    setAssignedHomework(prev => new Set(prev).add(idx));
  };

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shrink-0 z-10">
        <div className="flex items-center gap-2 text-slate-800 font-bold text-lg">
          <Trophy className="text-yellow-500" />
          <span>Debate Result</span>
        </div>
        <div className="flex gap-2">
          {isArchiveView ? (
            <Button
              onClick={onBackToHistory}
              variant="secondary"
              className="flex items-center gap-2 text-sm bg-slate-100 text-slate-700"
            >
              <ArrowLeft size={16} /> 履歴に戻る
            </Button>
          ) : (
            <>
              <Button
                onClick={onReset}
                variant="secondary"
                className="flex items-center gap-2 text-sm"
              >
                <Home size={16} /> トップへ
              </Button>
              <Button
                onClick={onReset}
                className="flex items-center gap-2 text-sm shadow-md bg-gradient-to-r from-blue-600 to-blue-700 text-white"
              >
                <RefreshCcw size={16} /> 新しい議論を始める
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200 px-6 flex items-center gap-6 overflow-x-auto scrollbar-hide shrink-0">
        <button
          onClick={() => setActiveTab('summary')}
          className={`py-3 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${activeTab === 'summary' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          {isDemoMode ? '模範分析' : '総評 & スコア'}
        </button>

        {showReviewTab && (
          <button
            onClick={() => setActiveTab('review')}
            className={`py-3 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${activeTab === 'review' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          >
            会話ごとの詳細レビュー
          </button>
        )}

        {showExemplarsTab && (
          <button
            onClick={() => setActiveTab('exemplars')}
            className={`py-3 text-sm font-bold border-b-2 transition-all whitespace-nowrap flex items-center gap-1.5 ${activeTab === 'exemplars' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          >
            <FileText size={14} /> アンカー事例・比較
          </button>
        )}

        {showLogicTab && (
          <button
            onClick={() => setActiveTab('logic')}
            className={`py-3 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${activeTab === 'logic' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          >
            論理構造 (Toulmin Model)
          </button>
        )}

        {showQuestioningTab && (
          <button
            onClick={() => setActiveTab('questioning')}
            className={`py-3 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${activeTab === 'questioning' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          >
            質問力分析
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          {activeTab === 'summary' && (
            <div className="space-y-8">
              <SummarySection
                feedback={feedback}
                tokenUsage={tokenUsage}
                isArchiveView={isArchiveView}
                onNavigate={onNavigate}
              />

              {/* Homework Suggestion Section - Only visible if not already in archive view and suggestions exist */}
              {!isArchiveView &&
                !isDemoMode &&
                feedback.homeworkSuggestions &&
                feedback.homeworkSuggestions.length > 0 && (
                  <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 animate-fade-in-up">
                    <div className="flex items-center gap-3 mb-4 text-indigo-800">
                      <ClipboardList size={24} />
                      <div>
                        <h3 className="text-lg font-bold">AIからの宿題 (Next Steps)</h3>
                        <p className="text-xs text-indigo-600">
                          今回の弱点を克服するためのタスクを提案します。
                        </p>
                      </div>
                    </div>
                    <div className="grid gap-4">
                      {feedback.homeworkSuggestions.map((suggestion, idx) => {
                        const isAssigned = assignedHomework.has(idx);
                        return (
                          <div
                            key={idx}
                            className="bg-white p-4 rounded-xl border border-indigo-100 shadow-sm flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center"
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                                  {suggestion.difficulty}
                                </span>
                                <h4 className="font-bold text-slate-800">{suggestion.title}</h4>
                              </div>
                              <p className="text-sm text-slate-600 leading-relaxed">
                                {suggestion.description}
                              </p>
                            </div>
                            <button
                              onClick={() => !isAssigned && handleAddHomework(idx, suggestion)}
                              disabled={isAssigned}
                              className={`shrink-0 px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-all ${
                                isAssigned
                                  ? 'bg-emerald-100 text-emerald-700 cursor-default'
                                  : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md active:scale-95'
                              }`}
                            >
                              {isAssigned ? (
                                <>
                                  <Check size={16} /> 追加済み
                                </>
                              ) : (
                                <>
                                  <Plus size={16} /> 宿題リストに追加
                                </>
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
            </div>
          )}
          {activeTab === 'review' && (
            <DetailedReviewSection
              feedback={feedback}
              messages={messages}
              isDemoMode={isDemoMode}
            />
          )}
          {activeTab === 'exemplars' && feedback.exemplars && (
            <ExemplarSection
              exemplars={feedback.exemplars}
              messages={messages}
              detailedReview={feedback.detailedReview || []}
            />
          )}
          {activeTab === 'logic' && (
            <LogicSection logicAnalysis={feedback.logicAnalysis} messages={messages} />
          )}
          {activeTab === 'questioning' && (
            <QuestioningSection questioningAnalysis={feedback.questioningAnalysis} />
          )}
        </div>
      </div>
    </div>
  );
};
