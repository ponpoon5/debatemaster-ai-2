import React, { useState, useRef } from 'react';
import { FeedbackData, Message, SBIModel } from '../../core/types';
import { hasStructureAnalysis } from '../../core/utils/type-guards';
import {
  AlertOctagon,
  User,
  Bot,
  Search,
  AlertTriangle,
  ChevronUp,
  ChevronDown,
  Sparkles,
  Filter,
  Check,
  Eye,
  Target,
  Zap,
} from 'lucide-react';
import { StructureHeatmap } from '../chat/message/StructureHeatmap';
import { ScoreTrendChart } from './ScoreTrendChart';

interface DetailedReviewSectionProps {
  feedback: FeedbackData;
  messages: Message[];
  isDemoMode: boolean;
}

type FilterType = 'ALL' | 'HIGH' | 'LOW' | 'FALLACY';

export const DetailedReviewSection: React.FC<DetailedReviewSectionProps> = React.memo(({
  feedback,
  messages,
  isDemoMode,
}) => {
  const [expandedReviews, setExpandedReviews] = useState<Set<number>>(new Set());
  const [filter, setFilter] = useState<FilterType>('ALL');
  const messageRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  const toggleReview = (index: number) => {
    const newSet = new Set(expandedReviews);
    if (newSet.has(index)) {
      newSet.delete(index);
    } else {
      newSet.add(index);
    }
    setExpandedReviews(newSet);
  };

  const scrollToMessage = (index: number) => {
    setExpandedReviews(prev => {
      const next = new Set(prev);
      next.add(index);
      return next;
    });

    setTimeout(() => {
      const element = messageRefs.current[index];
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.classList.add('ring-2', 'ring-blue-400', 'ring-offset-2');
        setTimeout(
          () => element.classList.remove('ring-2', 'ring-blue-400', 'ring-offset-2'),
          1500
        );
      }
    }, 100);
  };

  const getCleanMessageText = (text: string): string => {
    try {
      if (isDemoMode && (text.trim().startsWith('{') || text.trim().startsWith('```json'))) {
        const clean = text
          .replace(/```json/g, '')
          .replace(/```/g, '')
          .trim();
        const parsed = JSON.parse(clean);
        if (parsed && typeof parsed.text === 'string') {
          return `${parsed.speakerName || parsed.speaker}: ${parsed.text}`;
        }
      }
    } catch {
      // JSON parsing failed, return original text
    }
    return text;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 60) return 'text-blue-600 bg-blue-50 border-blue-200';
    return 'text-amber-600 bg-amber-50 border-amber-200';
  };

  const renderContentWithHighlight = (text: string, quote: string | undefined, isUser: boolean) => {
    const cleanText = getCleanMessageText(text);
    const trimmedQuote = quote?.trim();
    if (!trimmedQuote || !cleanText.includes(trimmedQuote)) return cleanText;

    const parts = cleanText.split(trimmedQuote);

    const highlightClass = isUser
      ? 'bg-red-100 decoration-red-400 decoration-wavy underline decoration-2 underline-offset-4'
      : 'bg-purple-100 decoration-purple-400 decoration-wavy underline decoration-2 underline-offset-4';

    return (
      <>
        {parts.map((part, i) => (
          <React.Fragment key={i}>
            {part}
            {i < parts.length - 1 && (
              <span className={`px-1 rounded mx-0.5 font-medium ${highlightClass}`}>
                {trimmedQuote}
              </span>
            )}
          </React.Fragment>
        ))}
      </>
    );
  };

  const SBICard = ({ sbi }: { sbi: SBIModel }) => (
    <div className="grid grid-cols-1 gap-3 mt-4">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
          {/* Situation */}
          <div className="flex-1 p-3">
            <div className="flex items-center gap-1.5 mb-1.5 text-blue-600">
              <Eye size={14} strokeWidth={2.5} />
              <span className="text-[10px] font-black uppercase tracking-widest">
                Situation (状況)
              </span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">{sbi.situation}</p>
          </div>
          {/* Behavior */}
          <div className="flex-1 p-3 bg-indigo-50/30">
            <div className="flex items-center gap-1.5 mb-1.5 text-indigo-600">
              <Target size={14} strokeWidth={2.5} />
              <span className="text-[10px] font-black uppercase tracking-widest">
                Behavior (行動)
              </span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">{sbi.behavior}</p>
          </div>
          {/* Impact */}
          <div className="flex-1 p-3">
            <div className="flex items-center gap-1.5 mb-1.5 text-purple-600">
              <Zap size={14} strokeWidth={2.5} />
              <span className="text-[10px] font-black uppercase tracking-widest">
                Impact (影響)
              </span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">{sbi.impact}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const highlights =
    feedback.detailedReview
      ?.filter(
        r =>
          (r.fallacy && r.fallacy.toLowerCase() !== 'null' && r.fallacy.trim() !== '') ||
          (r.score !== undefined && r.score < 7)
      )
      .sort((a, b) => a.messageIndex - b.messageIndex) || [];

  const filteredReviews =
    feedback.detailedReview?.filter(r => {
      if (filter === 'HIGH') return (r.score ?? 0) >= 8;
      if (filter === 'LOW') return (r.score ?? 0) > 0 && (r.score ?? 0) <= 6;
      if (filter === 'FALLACY') return r.fallacy && r.fallacy !== 'null';
      return true;
    }) || [];

  return (
    <div className="space-y-6 animate-fade-in">
      {!isDemoMode && feedback.detailedReview && (
        <ScoreTrendChart
          reviews={feedback.detailedReview}
          messages={messages}
          onPointClick={scrollToMessage}
        />
      )}

      {highlights.length > 0 && (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 overflow-hidden">
          <div className="flex items-center justify-between mb-3 text-slate-800 font-bold text-sm">
            <div className="flex items-center gap-2">
              <AlertOctagon size={16} className="text-red-500" />
              <span>重要チェックポイント</span>
            </div>
            <span className="text-xs font-normal text-slate-400">タップして移動</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide snap-x">
            {highlights.map((h, i) => {
              const isUser = messages[h.messageIndex]?.role === 'user';
              const hasFallacy = h.fallacy && h.fallacy.toLowerCase() !== 'null';
              return (
                <button
                  key={i}
                  onClick={() => scrollToMessage(h.messageIndex)}
                  className={`shrink-0 px-3 py-2 rounded-lg text-xs font-bold border flex flex-col items-start gap-1 transition-all hover:shadow-md active:scale-95 min-w-[140px] snap-start text-left ${
                    hasFallacy
                      ? isUser
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : 'bg-purple-50 text-purple-800 border-purple-200'
                      : 'bg-blue-50 text-blue-800 border-blue-200'
                  }`}
                >
                  <span className="opacity-60 text-[10px] uppercase flex items-center gap-1">
                    {isUser ? <User size={10} /> : <Bot size={10} />}#{h.messageIndex + 1}
                  </span>
                  <span className="truncate max-w-full font-bold">
                    {hasFallacy ? `⚠️ ${h.fallacy}` : `⭐ スコア: ${h.score}/10`}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3 text-slate-800">
            <Search size={20} className="text-blue-500" />
            <h3 className="font-bold">詳細レビュー（SBIモデル分析）</h3>
          </div>

          <div className="flex gap-2 bg-slate-100 p-1 rounded-lg">
            {[
              { key: 'ALL', label: '全て' },
              { key: 'HIGH', label: '高評価 (8+)' },
              { key: 'LOW', label: '要改善 (6-)' },
              { key: 'FALLACY', label: '詭弁' },
            ].map(item => (
              <button
                key={item.key}
                onClick={() => setFilter(item.key as FilterType)}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                  filter === item.key
                    ? 'bg-white text-slate-800 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {filteredReviews.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <Filter size={32} className="mx-auto mb-2 opacity-50" />
              <p>該当するレビューはありません</p>
            </div>
          ) : (
            filteredReviews.map((review, idx) => {
              const msg = messages[review.messageIndex];
              if (!msg) return null;

              const isUser = msg.role === 'user';
              const isExpanded = expandedReviews.has(review.messageIndex);
              const displayText = getCleanMessageText(msg.text || '');

              return (
                <div
                  key={idx}
                  ref={el => {
                    messageRefs.current[review.messageIndex] = el;
                  }}
                  className={`rounded-xl border transition-all duration-300 ${isExpanded ? 'bg-white shadow-md border-blue-200' : 'bg-slate-50 border-slate-200 hover:border-blue-200'}`}
                >
                  <button
                    onClick={() => toggleReview(review.messageIndex)}
                    className="w-full flex items-center justify-between p-4 text-left"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <span
                        className={`shrink-0 w-8 h-8 flex items-center justify-center rounded-full text-white ${isUser ? 'bg-blue-600' : 'bg-emerald-600'}`}
                      >
                        {isUser ? <User size={16} /> : <Bot size={16} />}
                      </span>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs uppercase font-bold text-slate-400">
                          Message #{review.messageIndex + 1}
                        </span>
                        <span className="truncate text-sm font-medium text-slate-700 max-w-[200px] sm:max-w-md">
                          {displayText.substring(0, 50)}...
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {review.fallacy && review.fallacy !== 'null' && (
                        <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-[10px] font-bold flex items-center gap-1">
                          <AlertTriangle size={12} /> {review.fallacy}
                        </span>
                      )}
                      {review.score !== undefined && (
                        <div
                          className={`flex flex-col items-end ${getScoreColor(review.score * 10).split(' ')[0]}`}
                        >
                          <span className="text-lg font-bold leading-none">{review.score}</span>
                          <span className="text-[10px]">SCORE</span>
                        </div>
                      )}
                      {isExpanded ? (
                        <ChevronUp size={20} className="text-slate-400" />
                      ) : (
                        <ChevronDown size={20} className="text-slate-400" />
                      )}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-4 border-t border-slate-100 pt-4 animate-fade-in">
                      <div className="mb-4 bg-slate-50 p-3 rounded-lg border border-slate-200/50 text-sm leading-relaxed text-slate-600">
                        {renderContentWithHighlight(msg.text, review.fallacyQuote, isUser)}
                      </div>

                      {isUser && hasStructureAnalysis(msg) && (
                        <div className="mb-4">
                          <StructureHeatmap score={msg.structureAnalysis} variant="detailed" />
                        </div>
                      )}

                      <div className="grid gap-3">
                        {/* SBI Analysis */}
                        {review.sbi ? (
                          <SBICard sbi={review.sbi} />
                        ) : (
                          <div>
                            <span className="text-xs font-bold text-slate-500 block mb-1">
                              評価・コメント
                            </span>
                            <p className="text-sm text-slate-800">{review.critique}</p>
                          </div>
                        )}

                        {review.fallacyExplanation && (
                          <div className="bg-amber-50 p-3 rounded-lg border border-amber-100 mt-2">
                            <span className="text-xs font-bold text-amber-700 block mb-1 flex items-center gap-1">
                              <AlertTriangle size={12} /> 検出された問題点
                            </span>
                            <p className="text-sm text-amber-900">{review.fallacyExplanation}</p>
                          </div>
                        )}

                        {review.betterResponse && (
                          <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 mt-2">
                            <span className="text-xs font-bold text-blue-700 block mb-1 flex items-center gap-1">
                              <Sparkles size={12} /> 改善例・模範解答
                            </span>
                            <p className="text-sm text-blue-900 italic">
                              "{review.betterResponse}"
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
});
