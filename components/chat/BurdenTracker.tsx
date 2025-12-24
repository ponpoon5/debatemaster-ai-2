import React, { useState } from 'react';
import { BurdenOfProof, BurdenAnalysis } from '../../core/types';
import {
  Scale,
  User,
  Bot,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Target,
} from 'lucide-react';

interface BurdenTrackerProps {
  burdenAnalysis: BurdenAnalysis | null;
  isVisible: boolean;
  onToggle: () => void;
}

export const BurdenTracker: React.FC<BurdenTrackerProps> = ({
  burdenAnalysis,
  isVisible,
  onToggle,
}) => {
  const [expandedBurdenId, setExpandedBurdenId] = useState<string | null>(null);

  // Show loading state if no analysis yet
  if (!burdenAnalysis) {
    return (
      <div className="bg-white border-l-4 border-indigo-600 rounded-lg shadow-md overflow-hidden">
        <div className="px-4 py-3 flex items-center justify-between bg-gradient-to-r from-indigo-50 to-white">
          <div className="flex items-center gap-3">
            <Scale className="text-indigo-600 animate-pulse" size={20} />
            <div className="text-left">
              <h3 className="text-sm font-bold text-slate-800">立証責任トラッカー</h3>
              <p className="text-[10px] text-slate-500">分析中...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (burdenAnalysis.burdens.length === 0) {
    return null;
  }

  const { burdens, summary } = burdenAnalysis;
  const activeBurdens = burdens.filter(b => b.status === 'active');
  const challengedBurdens = burdens.filter(b => b.status === 'challenged');

  const getBurdenTypeLabel = (type: BurdenOfProof['type']) => {
    switch (type) {
      case 'claim':
        return '主張';
      case 'simple_question':
        return '疑問提起';
      case 'counter_claim':
        return '反証主張';
    }
  };

  const getBurdenTypeColor = (type: BurdenOfProof['type']) => {
    switch (type) {
      case 'claim':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'simple_question':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'counter_claim':
        return 'bg-rose-100 text-rose-700 border-rose-200';
    }
  };

  const getStatusIcon = (status: BurdenOfProof['status']) => {
    switch (status) {
      case 'active':
        return <AlertCircle size={14} className="text-orange-600" />;
      case 'fulfilled':
        return <CheckCircle2 size={14} className="text-emerald-600" />;
      case 'challenged':
        return <HelpCircle size={14} className="text-rose-600" />;
      case 'abandoned':
        return <Target size={14} className="text-slate-400" />;
    }
  };

  const getStatusLabel = (status: BurdenOfProof['status']) => {
    switch (status) {
      case 'active':
        return '未履行';
      case 'fulfilled':
        return '履行済み';
      case 'challenged':
        return '争点化';
      case 'abandoned':
        return '放棄';
    }
  };

  return (
    <div className="bg-white border-l-4 border-indigo-600 rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-center justify-between bg-gradient-to-r from-indigo-50 to-white hover:from-indigo-100 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Scale className="text-indigo-600" size={20} />
          <div className="text-left">
            <h3 className="text-sm font-bold text-slate-800">立証責任トラッカー</h3>
            <p className="text-[10px] text-slate-500">Burden of Proof Tracker</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-2 text-[10px] font-bold">
            <span className="px-2 py-0.5 rounded bg-orange-100 text-orange-700">
              あなた: {summary.userActiveBurdens}
            </span>
            <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700">
              AI: {summary.aiActiveBurdens}
            </span>
          </div>
          {isVisible ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </button>

      {/* Content */}
      {isVisible && (
        <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
          {/* Active Burdens */}
          {activeBurdens.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <AlertCircle size={12} /> 立証義務 (Active)
              </h4>
              {activeBurdens.map(burden => (
                <BurdenCard
                  key={burden.id}
                  burden={burden}
                  isExpanded={expandedBurdenId === burden.id}
                  onToggle={() =>
                    setExpandedBurdenId(expandedBurdenId === burden.id ? null : burden.id)
                  }
                  getBurdenTypeLabel={getBurdenTypeLabel}
                  getBurdenTypeColor={getBurdenTypeColor}
                  getStatusIcon={getStatusIcon}
                  getStatusLabel={getStatusLabel}
                />
              ))}
            </div>
          )}

          {/* Challenged Burdens */}
          {challengedBurdens.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <HelpCircle size={12} /> 争点化された義務
              </h4>
              {challengedBurdens.map(burden => (
                <BurdenCard
                  key={burden.id}
                  burden={burden}
                  isExpanded={expandedBurdenId === burden.id}
                  onToggle={() =>
                    setExpandedBurdenId(expandedBurdenId === burden.id ? null : burden.id)
                  }
                  getBurdenTypeLabel={getBurdenTypeLabel}
                  getBurdenTypeColor={getBurdenTypeColor}
                  getStatusIcon={getStatusIcon}
                  getStatusLabel={getStatusLabel}
                />
              ))}
            </div>
          )}

          {/* Summary Stats */}
          <div className="pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center">
            <div className="bg-slate-50 rounded p-2">
              <div className="text-xl font-bold text-slate-800">{summary.totalResolved}</div>
              <div className="text-[9px] text-slate-500 uppercase font-bold">解決済み</div>
            </div>
            <div className="bg-slate-50 rounded p-2">
              <div className="text-xl font-bold text-slate-800">
                {summary.criticalQuestionsCount}
              </div>
              <div className="text-[9px] text-slate-500 uppercase font-bold">CQ発生</div>
            </div>
            <div className="bg-slate-50 rounded p-2">
              <div className="text-xl font-bold text-slate-800">{burdens.length}</div>
              <div className="text-[9px] text-slate-500 uppercase font-bold">総数</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface BurdenCardProps {
  burden: BurdenOfProof;
  isExpanded: boolean;
  onToggle: () => void;
  getBurdenTypeLabel: (type: BurdenOfProof['type']) => string;
  getBurdenTypeColor: (type: BurdenOfProof['type']) => string;
  getStatusIcon: (status: BurdenOfProof['status']) => React.ReactNode;
  getStatusLabel: (status: BurdenOfProof['status']) => string;
}

const BurdenCard: React.FC<BurdenCardProps> = ({
  burden,
  isExpanded,
  onToggle,
  getBurdenTypeLabel,
  getBurdenTypeColor,
  getStatusIcon,
  getStatusLabel,
}) => {
  return (
    <div
      className={`border rounded-lg overflow-hidden transition-all ${
        burden.status === 'active'
          ? 'border-orange-200 bg-orange-50'
          : burden.status === 'challenged'
            ? 'border-rose-200 bg-rose-50'
            : 'border-slate-200 bg-slate-50'
      }`}
    >
      <button
        onClick={onToggle}
        className="w-full px-3 py-2 flex items-center justify-between hover:bg-white/50 transition-colors"
      >
        <div className="flex items-center gap-2 flex-1 text-left">
          {burden.burdenHolder === 'user' ? (
            <User size={14} className="text-indigo-600" />
          ) : (
            <Bot size={14} className="text-blue-600" />
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${getBurdenTypeColor(burden.type)}`}
              >
                {getBurdenTypeLabel(burden.type)}
              </span>
              <span className="text-[9px] font-bold text-slate-500 flex items-center gap-1">
                {getStatusIcon(burden.status)}
                {getStatusLabel(burden.status)}
              </span>
            </div>
            <p className="text-xs text-slate-700 font-medium truncate">{burden.claimText}</p>
          </div>
        </div>
        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {isExpanded && (
        <div className="px-3 pb-3 pt-1 space-y-2 border-t bg-white/30">
          <div className="text-[10px] space-y-1">
            <div>
              <span className="font-bold text-slate-600">主張者:</span>{' '}
              <span className="text-slate-800">
                {burden.claimant === 'user' ? 'あなた' : 'AI'} (#{burden.claimMessageIndex + 1})
              </span>
            </div>
            <div>
              <span className="font-bold text-slate-600">立証義務:</span>{' '}
              <span className="text-slate-800">
                {burden.burdenHolder === 'user' ? 'あなた' : 'AI'}
              </span>
            </div>
            {burden.isCriticalQuestion && burden.criticalQuestionText && (
              <div className="bg-amber-100 border border-amber-200 rounded p-2 mt-2">
                <span className="font-bold text-amber-800 block mb-1">CQ (Critical Question):</span>
                <p className="text-amber-900 italic">"{burden.criticalQuestionText}"</p>
              </div>
            )}
            <div className="bg-slate-100 rounded p-2 mt-2">
              <span className="font-bold text-slate-600 block mb-1">説明:</span>
              <p className="text-slate-700 leading-relaxed">{burden.explanation}</p>
            </div>
            {burden.assessment && (
              <div className="bg-emerald-100 rounded p-2 mt-2">
                <span className="font-bold text-emerald-800 block mb-1">評価:</span>
                <p className="text-emerald-900 leading-relaxed">{burden.assessment}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
