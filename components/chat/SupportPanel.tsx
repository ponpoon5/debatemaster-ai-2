import React from 'react';
import { StrategyAnalysis, DebatePhase } from '../../core/types';
import {
  X,
  Gauge,
  AlertTriangle,
  Map,
  Target,
  Swords,
  Shield,
  Search,
  Hand,
  Layers,
  Bot,
  ArrowRight,
  Wand2,
} from 'lucide-react';

interface SupportPanelProps {
  advice: string | null;
  detectedFallacy: string | null;
  fallacyExplanation: string | null;
  sentimentScore: number | null;
  strategyData: StrategyAnalysis | null;
  onClose: () => void;
  onUseStrategy: (template: string) => void;
  onOpenRebuttalCard: () => void;
}

const PHASE_CONFIG = {
  [DebatePhase.CLAIM]: { color: 'bg-blue-500', icon: Target, label: '主張' },
  [DebatePhase.EVIDENCE]: { color: 'bg-orange-500', icon: Search, label: '根拠' },
  [DebatePhase.REBUTTAL]: { color: 'bg-red-500', icon: Swords, label: '反論' },
  [DebatePhase.DEFENSE]: { color: 'bg-emerald-500', icon: Shield, label: '防御' },
  [DebatePhase.FALLACY]: { color: 'bg-purple-500', icon: AlertTriangle, label: '誤謬' },
  [DebatePhase.FRAMING]: { color: 'bg-indigo-500', icon: Map, label: '論点' },
  [DebatePhase.CONCESSION]: { color: 'bg-teal-500', icon: Hand, label: '協調' },
  [DebatePhase.SYNTHESIS]: { color: 'bg-slate-500', icon: Layers, label: '整理' },
};

const getMoveStyle = (type: string) => {
  switch (type) {
    case 'logical_attack':
      return {
        label: '論理攻撃',
        badgeBg: 'bg-rose-50',
        badgeText: 'text-rose-700',
        badgeBorder: 'border-rose-200',
        cardBorder: 'border-l-rose-500',
        cardHover: 'hover:bg-rose-50',
      };
    case 'reframing':
      return {
        label: '視点転換',
        badgeBg: 'bg-violet-50',
        badgeText: 'text-violet-700',
        badgeBorder: 'border-violet-200',
        cardBorder: 'border-l-violet-500',
        cardHover: 'hover:bg-violet-50',
      };
    case 'concession':
      return {
        label: '部分同意',
        badgeBg: 'bg-emerald-50',
        badgeText: 'text-emerald-700',
        badgeBorder: 'border-emerald-200',
        cardBorder: 'border-l-emerald-500',
        cardHover: 'hover:bg-emerald-50',
      };
    default:
      return {
        label: type,
        badgeBg: 'bg-slate-50',
        badgeText: 'text-slate-600',
        badgeBorder: 'border-slate-200',
        cardBorder: 'border-l-slate-400',
        cardHover: 'hover:bg-slate-50',
      };
  }
};

export const SupportPanel: React.FC<SupportPanelProps> = React.memo(({
  advice,
  detectedFallacy,
  fallacyExplanation,
  sentimentScore,
  strategyData,
  onClose,
  onUseStrategy,
  onOpenRebuttalCard,
}) => {
  const renderSentimentMeter = (score: number) => {
    const percentage = ((score + 1) / 2) * 100;

    let colorClass = 'bg-slate-400';
    let label = '中立';

    if (score < -0.4) {
      colorClass = 'bg-red-500';
      label = '攻撃的/ネガティブ';
    } else if (score > 0.4) {
      colorClass = 'bg-emerald-500';
      label = '建設的/ポジティブ';
    } else {
      colorClass = 'bg-blue-400';
      label = '冷静/論理的';
    }

    return (
      <div className="mt-3 p-3 bg-white/60 rounded-lg border border-blue-100">
        <div className="flex justify-between items-center mb-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
            <Gauge size={14} />
            <span>感情・トーン分析</span>
          </div>
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full text-white ${colorClass}`}
          >
            {label} ({score > 0 ? '+' : ''}
            {score.toFixed(1)})
          </span>
        </div>
        <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden relative">
          <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-white z-10"></div>
          <div
            className={`h-full transition-all duration-500 ease-out ${colorClass}`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full bg-gradient-to-b from-blue-50/95 to-white/95 backdrop-blur-md border-t border-blue-200 shadow-2xl animate-fade-in-up max-h-[60vh] overflow-y-auto">
      <div className="w-full p-4 flex items-start gap-4">
        <div className="shrink-0 mt-1 hidden sm:block">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-blue-100 shadow-sm text-blue-600">
            <Bot size={24} />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-blue-900 flex items-center gap-2 text-sm">
              <span className="sm:hidden">
                <Bot size={16} />
              </span>
              AIコーチング
            </h3>
            <button
              onClick={onClose}
              className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          <div className="space-y-4">
            {detectedFallacy && (
              <div className="bg-red-50 border border-red-100 rounded-xl p-3 animate-pop-in">
                <div className="flex items-center gap-2 font-bold text-red-700 text-sm mb-1">
                  <AlertTriangle size={16} />
                  <span className="break-words">詭弁を検出: {detectedFallacy}</span>
                </div>
                <p className="text-xs text-red-800 leading-relaxed bg-white/50 p-2 rounded-lg break-words whitespace-pre-wrap">
                  {fallacyExplanation}
                </p>
              </div>
            )}

            {strategyData ? (
              <div className="space-y-3">
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm w-full">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    {(() => {
                      const conf =
                        PHASE_CONFIG[strategyData.currentPhase] || PHASE_CONFIG[DebatePhase.CLAIM];
                      const Icon = conf.icon;
                      return (
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold text-white ${conf.color} flex items-center gap-1`}
                        >
                          <Icon size={10} /> {conf.label}
                        </span>
                      );
                    })()}
                    <span className="text-xs font-bold text-slate-700">現在のフェーズ</span>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <span className="text-[10px] text-slate-400 block mb-0.5">相手の狙い</span>
                      <p className="text-xs text-slate-700 font-medium leading-relaxed break-words whitespace-pre-wrap">
                        {strategyData.analysis.claim_summary}
                      </p>
                    </div>
                    <div className="bg-red-50 p-2 rounded border border-red-100">
                      <span className="text-[10px] text-red-400 block mb-0.5 font-bold">
                        弱点・攻めどころ
                      </span>
                      <p className="text-xs text-red-800 leading-relaxed break-words whitespace-pre-wrap">
                        {strategyData.analysis.weak_point}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Rebuttal Card Action */}
                {strategyData.rebuttalTemplate && (
                  <button
                    onClick={onOpenRebuttalCard}
                    className="w-full py-3 px-4 bg-gradient-to-r from-pink-600 to-rose-500 text-white rounded-xl shadow-md flex items-center justify-between hover:from-pink-700 hover:to-rose-600 transition-all group"
                  >
                    <span className="font-bold flex items-center gap-2 text-sm">
                      <Wand2 size={18} />
                      反論カードを作成
                    </span>
                    <span className="bg-white/20 px-2 py-1 rounded text-[10px] font-medium group-hover:bg-white/30">
                      AIヒント付き
                    </span>
                  </button>
                )}

                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mt-2">
                  <Map size={14} /> Recommended Moves
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {strategyData.moves.map((move, idx) => {
                    const style = getMoveStyle(move.type);

                    return (
                      <button
                        key={idx}
                        onClick={() => onUseStrategy(move.template)}
                        className={`w-full text-left bg-white border border-slate-200 p-3 rounded-xl transition-all shadow-sm group active:scale-95 border-l-4 ${style.cardBorder} ${style.cardHover} flex flex-col h-full`}
                      >
                        <div className="flex items-start gap-2 mb-2 flex-wrap">
                          <span
                            className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-md border ${style.badgeBg} ${style.badgeText} ${style.badgeBorder}`}
                          >
                            {style.label}
                          </span>
                          <span className="font-bold text-slate-800 text-xs group-hover:text-blue-700 leading-tight break-words">
                            {move.title}
                          </span>
                        </div>

                        {/* Reason for move */}
                        {move.reason && (
                          <div className="mb-2 text-[10px] bg-slate-50 p-1.5 rounded border border-slate-100 text-slate-600 leading-tight">
                            <span className="font-bold text-slate-400 block mb-0.5 text-[9px]">
                              WHY?
                            </span>
                            {move.reason}
                          </div>
                        )}

                        <div className="text-[10px] text-blue-600 font-mono bg-blue-50/50 p-2 rounded border border-blue-100 group-hover:bg-blue-100/50 w-full break-words whitespace-pre-wrap mt-auto">
                          <span className="opacity-50">"</span>
                          {move.template}...<span className="opacity-50">"</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              advice && (
                <div className="bg-white rounded-xl p-4 shadow-sm border border-blue-200 relative w-full">
                  <p className="text-sm text-slate-700 leading-relaxed font-medium break-words whitespace-pre-wrap w-full">
                    {advice}
                  </p>
                  {sentimentScore !== null && renderSentimentMeter(sentimentScore)}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
});
