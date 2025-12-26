import React, { useState } from 'react';
import { ExemplarMetricSet, ExemplarItem, Message, MessageReview } from '../../core/types';
import {
  BookOpen,
  User,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  ArrowRightLeft,
  Scale,
} from 'lucide-react';

interface ExemplarSectionProps {
  exemplars: ExemplarMetricSet[];
  messages: Message[];
  detailedReview: MessageReview[];
}

export const ExemplarSection: React.FC<ExemplarSectionProps> = React.memo(({ exemplars, messages, detailedReview }) => {
  const [selectedMetricIndex, setSelectedMetricIndex] = useState(0);
  const [selectedUserMessageIndex, setSelectedUserMessageIndex] = useState<number | null>(null);

  const currentMetric = exemplars[selectedMetricIndex];
  const userMessages = messages.filter(m => m.role === 'user');

  // Get the betterResponse for the selected user message
  const selectedReview = selectedUserMessageIndex !== null
    ? detailedReview.find(r => r.messageIndex === selectedUserMessageIndex)
    : null;

  const getLevelStyle = (level: ExemplarItem['level']) => {
    switch (level) {
      case 'Mastery':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Secure':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Developing':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Error':
        return 'bg-rose-100 text-rose-700 border-rose-200';
    }
  };

  const getLevelIcon = (level: ExemplarItem['level']) => {
    switch (level) {
      case 'Mastery':
        return <Sparkles size={16} />;
      case 'Secure':
        return <CheckCircle2 size={16} />;
      case 'Developing':
        return <Scale size={16} />;
      case 'Error':
        return <AlertTriangle size={16} />;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 mb-4 text-slate-800">
          <BookOpen className="text-blue-600" />
          <div>
            <h3 className="text-lg font-bold">アンカー事例 (Exemplars)</h3>
            <p className="text-xs text-slate-500">
              レベル別の模範例・非模範例を確認し、自分の発言と比較してみましょう。
            </p>
          </div>
        </div>

        {/* Metric Selection */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mb-6 border-b border-slate-100">
          {exemplars.map((m, i) => (
            <button
              key={i}
              onClick={() => setSelectedMetricIndex(i)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap border ${
                selectedMetricIndex === i
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {m.metricLabel}
            </button>
          ))}
        </div>

        {/* Comparison Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Exemplar Column */}
          <div className="space-y-4">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Sparkles size={14} /> レベル別アンカー事例
            </h4>

            <div className="space-y-3">
              {currentMetric.items.map((item, i) => (
                <div
                  key={i}
                  className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden hover:border-blue-300 transition-colors"
                >
                  <div
                    className={`px-3 py-1.5 flex items-center justify-between border-b ${getLevelStyle(item.level)}`}
                  >
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase">
                      {getLevelIcon(item.level)}
                      {item.level}: {item.label}
                    </div>
                    <span className="text-[10px] font-bold">Score: {item.score}/10</span>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-slate-800 leading-relaxed mb-3 font-medium">
                      "{item.text}"
                    </p>
                    <div className="bg-white/60 p-3 rounded-lg text-xs text-slate-600 italic">
                      <span className="font-bold text-slate-400 block mb-1 uppercase text-[9px]">
                        AI Explanation
                      </span>
                      {item.explanation}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* User Comparison Column */}
          <div className="space-y-4">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <ArrowRightLeft size={14} /> あなたの発言と比較 (Calibration)
            </h4>

            <div className="bg-white p-6 rounded-xl border-2 border-dashed border-slate-200 flex flex-col h-full min-h-[400px]">
              <div className="mb-4">
                <label className="text-[10px] font-bold text-slate-500 block mb-2 uppercase">
                  発言を選択してください
                </label>
                <select
                  onChange={e =>
                    setSelectedUserMessageIndex(
                      e.target.value === '' ? null : parseInt(e.target.value)
                    )
                  }
                  className="w-full p-2.5 rounded-lg border border-slate-200 text-sm bg-slate-50 font-medium outline-none focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">-- あなたの発言を選択 --</option>
                  {userMessages.map((m, i) => (
                    <option key={i} value={messages.indexOf(m)}>
                      #{messages.indexOf(m) + 1}: {m.text.substring(0, 30)}...
                    </option>
                  ))}
                </select>
              </div>

              {selectedUserMessageIndex !== null ? (
                <div className="flex-1 flex flex-col gap-6 animate-fade-in">
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 relative">
                    <div className="absolute -top-3 left-4 bg-blue-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <User size={10} /> YOUR TURN
                    </div>
                    <p className="text-sm text-blue-900 leading-relaxed font-medium">
                      "{messages[selectedUserMessageIndex].text}"
                    </p>
                  </div>

                  <div className="flex flex-col items-center justify-center py-2 text-slate-300">
                    <ArrowRightLeft size={24} className="rotate-90" />
                  </div>

                  {/* High Quality Reference Comparison */}
                  <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 relative">
                    <div className="absolute -top-3 left-4 bg-emerald-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Sparkles size={10} /> MASTERY VERSION (理想形)
                    </div>
                    {selectedReview?.betterResponse ? (
                      <>
                        <p className="text-sm text-emerald-900 leading-relaxed italic mb-3">
                          "{selectedReview.betterResponse}"
                        </p>
                        {selectedReview.critique && (
                          <div className="text-[11px] text-emerald-700 leading-relaxed border-t border-emerald-100 pt-2">
                            <span className="font-bold">改善のポイント:</span>
                            <br />
                            {selectedReview.critique}
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <p className="text-sm text-emerald-900 leading-relaxed italic mb-3">
                          "{currentMetric.items.find(it => it.level === 'Mastery')?.text}"
                        </p>
                        <div className="text-[11px] text-emerald-700 leading-relaxed border-t border-emerald-100 pt-2">
                          <span className="font-bold">学びのポイント:</span>
                          <br />
                          {currentMetric.items.find(it => it.level === 'Mastery')?.explanation}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                  <User size={48} className="mb-4 opacity-20" />
                  <p className="text-sm font-medium">
                    自分の発言を選択して、
                    <br />
                    理想的な回答例と並べて比較しましょう。
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
