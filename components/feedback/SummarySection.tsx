import React, { useState } from 'react';
import { FeedbackData, TokenUsage, TrainingRecommendation, MetricRubric } from '../../core/types';
import {
  Calendar,
  Coins,
  ThumbsUp,
  AlertTriangle,
  Lightbulb,
  Activity,
  ArrowRight,
  Dumbbell,
  BookOpen,
  BrainCircuit,
  Joystick,
  ClipboardCheck,
  ChevronDown,
  ChevronUp,
  Scale,
} from 'lucide-react';
import { DemoAnalysisView } from './DemoAnalysisView';
import { FacilitationCard } from './FacilitationCard';
import { StoryAnalysisCard } from './StoryAnalysisCard';
import { MetricsRadarChart } from './MetricsRadarChart';
import { RhetoricCard } from './RhetoricCard';

interface SummarySectionProps {
  feedback: FeedbackData;
  tokenUsage?: TokenUsage;
  isArchiveView?: boolean;
  onNavigate: (rec: TrainingRecommendation) => void;
}

export const SummarySection: React.FC<SummarySectionProps> = React.memo(({
  feedback,
  tokenUsage,
  isArchiveView,
  onNavigate,
}) => {
  const [showRubricDetails, setShowRubricDetails] = useState(false);

  const isFacilitationMode = feedback.facilitation && feedback.facilitation.understandingScore > 0;
  const isStoryMode = feedback.storyAnalysis && feedback.storyAnalysis.decisionScore > 0;
  const isDemoMode = !!feedback.demoAnalysis;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 60) return 'text-blue-600 bg-blue-50 border-blue-200';
    return 'text-amber-600 bg-amber-50 border-amber-200';
  };

  const RecommendationButton: React.FC<{ rec: TrainingRecommendation }> = ({ rec }) => {
    let Icon = Lightbulb;
    let colorClass = 'bg-slate-800 text-white hover:bg-slate-900';

    switch (rec.actionType) {
      case 'start_drill':
        Icon = Dumbbell;
        colorClass = 'bg-orange-600 text-white hover:bg-orange-700';
        break;
      case 'open_textbook':
      case 'start_study':
        Icon = BookOpen;
        colorClass = 'bg-purple-600 text-white hover:bg-purple-700';
        break;
      case 'open_thinking_gym':
        Icon = BrainCircuit;
        colorClass = 'bg-indigo-600 text-white hover:bg-indigo-700';
        break;
      case 'open_minigame':
        Icon = Joystick;
        colorClass = 'bg-pink-600 text-white hover:bg-pink-700';
        break;
    }

    return (
      <button
        onClick={() => onNavigate(rec)}
        className={`w-full flex items-center justify-between p-3 rounded-xl shadow-sm transition-all active:scale-95 ${colorClass}`}
      >
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <Icon size={18} />
          </div>
          <div className="text-left">
            <div className="text-xs font-medium opacity-90 uppercase tracking-wide">
              Recommended Training
            </div>
            <div className="font-bold text-sm">{rec.label}</div>
          </div>
        </div>
        <ArrowRight size={18} className="opacity-80" />
      </button>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Demo Mode View */}
      {isDemoMode && feedback.demoAnalysis ? (
        <DemoAnalysisView demo={feedback.demoAnalysis} />
      ) : (
        /* Standard Summary Card */
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 text-center relative overflow-hidden">
          {isArchiveView && (
            <div className="absolute top-4 left-4 bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
              <Calendar size={12} />
              <span>Archive Mode</span>
            </div>
          )}
          <h2 className="text-2xl font-bold text-slate-800 mb-6">議論の分析結果</h2>

          <div className="flex flex-col items-center justify-center">
            <div
              className={`relative w-40 h-40 rounded-full flex flex-col items-center justify-center border-4 ${getScoreColor(feedback.score)} mb-4`}
            >
              <span className="text-sm font-semibold uppercase tracking-wider opacity-70">
                Score
              </span>
              <span className="text-5xl font-bold">{feedback.score}</span>
            </div>
          </div>
          <p className="text-slate-600 leading-relaxed max-w-xl mx-auto">{feedback.summary}</p>

          {tokenUsage && (
            <div className="absolute top-4 right-4 flex flex-col items-end text-xs text-slate-400">
              <div className="flex items-center gap-1">
                <Coins size={14} />
                <span>Total Tokens</span>
              </div>
              <span className="font-mono font-medium text-slate-500">
                {tokenUsage.totalTokens.toLocaleString()}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Analytical Rubric Section */}
      {!isDemoMode && feedback.rubricDetails && feedback.rubricDetails.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-fade-in">
          <button
            onClick={() => setShowRubricDetails(!showRubricDetails)}
            className="w-full flex items-center justify-between p-5 bg-slate-50 hover:bg-slate-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                <ClipboardCheck size={20} />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-slate-800 text-base">
                  分析的ルーブリック (Analytical Rubric)
                </h3>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">
                  Weighting & Performance Levels
                </p>
              </div>
            </div>
            {showRubricDetails ? (
              <ChevronUp size={20} className="text-slate-400" />
            ) : (
              <ChevronDown size={20} className="text-slate-400" />
            )}
          </button>

          {showRubricDetails && (
            <div className="p-6 space-y-6 animate-fade-in">
              <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 text-xs text-blue-700 leading-relaxed">
                各評価項目の「重み付け（Weight）」と、スコアに対応する具体的なパフォーマンス状態を表示しています。
                透明性の高い評価基準に基づき、どこを重点的に改善すべきかを確認しましょう。
              </div>
              <div className="grid gap-4">
                {feedback.rubricDetails.map((item: MetricRubric) => (
                  <div
                    key={item.key}
                    className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl border border-slate-100 bg-white hover:border-blue-200 transition-colors"
                  >
                    <div className="sm:w-1/3 shrink-0">
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="font-bold text-slate-800 text-sm">{item.label}</span>
                        <span className="text-[10px] font-bold text-slate-400">
                          Weight: {item.weight}%
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-1000 ${item.score >= 8 ? 'bg-blue-600' : item.score >= 5 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                            style={{ width: `${item.score * 10}%` }}
                          ></div>
                        </div>
                        <span className="font-bold text-sm text-slate-700 w-8 text-right">
                          {item.score}/10
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <span className="text-[9px] font-black text-slate-400 uppercase block mb-1">
                        Performance Descriptor
                      </span>
                      <p className="text-xs text-slate-600 leading-relaxed font-medium">
                        {item.descriptor}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Training Recommendations */}
      {feedback.trainingRecommendations && feedback.trainingRecommendations.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {feedback.trainingRecommendations.map(rec => (
            <RecommendationButton key={rec.id} rec={rec} />
          ))}
        </div>
      )}

      {/* Session Metrics */}
      {!isDemoMode && feedback.sessionMetrics && feedback.sessionMetrics.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 mb-4 text-slate-700 border-b border-slate-100 pb-2">
            <Activity size={20} />
            <h3 className="text-lg font-bold">行動メトリクス (Behavior Stats)</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {feedback.sessionMetrics.map(metric => (
              <div
                key={metric.key}
                className="flex flex-col p-3 rounded-xl bg-slate-50 border border-slate-100"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-slate-500">{metric.label}</span>
                  <span className="text-sm font-mono font-bold text-slate-700">
                    {metric.rate.numerator} / {metric.rate.denominator}
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${metric.score >= 80 ? 'bg-emerald-500' : metric.score >= 50 ? 'bg-blue-500' : 'bg-amber-500'}`}
                    style={{
                      width: `${metric.rate.denominator > 0 ? (metric.rate.numerator / metric.rate.denominator) * 100 : 0}%`,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mode Specific Cards */}
      {isFacilitationMode && feedback.facilitation && (
        <FacilitationCard facilitation={feedback.facilitation} />
      )}

      {isStoryMode && feedback.storyAnalysis && (
        <StoryAnalysisCard story={feedback.storyAnalysis} />
      )}

      {!isFacilitationMode && !isStoryMode && !isDemoMode && feedback.metrics && (
        <MetricsRadarChart metrics={feedback.metrics} overallScore={feedback.score} />
      )}

      {!isFacilitationMode && !isStoryMode && !isDemoMode && feedback.rhetoric && (
        <RhetoricCard rhetoric={feedback.rhetoric} />
      )}

      {/* Strengths & Weaknesses */}
      {!isDemoMode && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center gap-3 mb-4 text-emerald-600">
              <ThumbsUp size={24} />
              <h3 className="text-lg font-bold">良かった点</h3>
            </div>
            <ul className="space-y-3">
              {feedback.strengths.map((item, index) => (
                <li key={index} className="flex gap-3 text-slate-700">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2"></span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center gap-3 mb-4 text-amber-600">
              <AlertTriangle size={24} />
              <h3 className="text-lg font-bold">改善点</h3>
            </div>
            <ul className="space-y-3">
              {feedback.weaknesses.map((item, index) => (
                <li key={index} className="flex gap-3 text-slate-700">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-amber-400 mt-2"></span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Advice */}
      {!isDemoMode && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-blue-200 bg-blue-50/50">
          <div className="flex items-center gap-3 mb-4 text-blue-700">
            <Lightbulb size={24} />
            <h3 className="text-lg font-bold">今後のアドバイス</h3>
          </div>
          <p className="text-slate-700 leading-relaxed">{feedback.advice}</p>
        </div>
      )}
    </div>
  );
});
