import React from 'react';
import { StoryAnalysis } from '../../core/types';
import { Globe, TrendingUp, Target } from 'lucide-react';

interface StoryAnalysisCardProps {
  story: StoryAnalysis;
}

export const StoryAnalysisCard: React.FC<StoryAnalysisCardProps> = React.memo(({ story }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-teal-200 animate-fade-in mb-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-teal-100 p-2 rounded-lg text-teal-600">
          <Globe size={24} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-800">ストーリー分析</h3>
          <p className="text-xs text-slate-500">意思決定の質と、それが世界に与えた影響の評価</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-xl border border-slate-100">
          <span className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-2">
            決定の妥当性
          </span>
          <span className="text-4xl font-bold text-teal-600">{story.decisionScore}</span>
        </div>
        <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-xl border border-slate-100">
          <span className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-2">
            関係者の納得度
          </span>
          <span className="text-4xl font-bold text-blue-600">{story.consensusScore}</span>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-teal-50 p-4 rounded-xl border border-teal-100">
          <h4 className="flex items-center gap-2 font-bold text-teal-800 mb-2">
            <TrendingUp size={18} /> 物語の結末 (Outcome)
          </h4>
          <p className="text-sm text-teal-900 leading-relaxed">{story.outcome}</p>
        </div>

        <div>
          <h4 className="font-bold text-slate-700 mb-3 border-b border-slate-100 pb-2">
            社会的影響評価
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-slate-50 rounded-lg text-xs leading-relaxed border border-slate-100">
              <span className="font-bold block mb-1 text-slate-500">経済</span>
              {story.socialImpact.economic}
            </div>
            <div className="p-3 bg-slate-50 rounded-lg text-xs leading-relaxed border border-slate-100">
              <span className="font-bold block mb-1 text-slate-500">世論</span>
              {story.socialImpact.publicSentiment}
            </div>
            <div className="p-3 bg-slate-50 rounded-lg text-xs leading-relaxed border border-slate-100">
              <span className="font-bold block mb-1 text-slate-500">倫理</span>
              {story.socialImpact.ethical}
            </div>
          </div>
        </div>

        <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 border-dashed">
          <h4 className="flex items-center gap-2 font-bold text-indigo-800 mb-2 text-sm">
            <Target size={16} /> IFシナリオ: もし別の選択をしていたら...
          </h4>
          <p className="text-sm text-indigo-900 leading-relaxed italic">
            "{story.alternativeScenario}"
          </p>
        </div>
      </div>
    </div>
  );
});
