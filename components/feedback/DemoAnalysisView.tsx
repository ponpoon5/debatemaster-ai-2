import React from 'react';
import { DemoAnalysis } from '../../core/types';
import {
  MonitorPlay,
  Swords,
  Target,
  Search,
  Network,
  ShieldCheck,
  AlertTriangle,
  Scale,
  Sparkles,
  Zap,
  BookOpen,
} from 'lucide-react';

interface DemoAnalysisViewProps {
  demo: DemoAnalysis;
}

export const DemoAnalysisView: React.FC<DemoAnalysisViewProps> = ({ demo }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Summary */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-sky-200">
        <div className="flex items-center gap-3 mb-4 text-sky-700">
          <div className="p-2 bg-sky-100 rounded-lg">
            <MonitorPlay size={24} />
          </div>
          <h2 className="text-xl font-bold">模範ディベート分析</h2>
        </div>
        <p className="text-slate-700 leading-relaxed">{demo.summary}</p>
      </div>

      {/* Clash Analysis (Complete Toulmin Map) */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
            <Swords size={20} />
          </div>
          <div>
            <h3 className="font-bold text-slate-800">論理構造の可視化 (Logic & Clash Map)</h3>
            <p className="text-xs text-slate-500">議論の衝突を「Toulminモデル」で完全構造化</p>
          </div>
        </div>

        <div className="mb-4 text-center">
          <span className="text-xs font-bold uppercase text-slate-400">Current Agenda</span>
          <p className="font-bold text-slate-800 text-lg">{demo.clashAnalysis.agenda}</p>
        </div>

        <div className="flex flex-col md:flex-row gap-6 items-stretch relative">
          {/* Pro Side */}
          <div className="flex-1 p-5 rounded-2xl border-2 border-indigo-100 bg-white relative hover:border-indigo-300 transition-colors">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-indigo-500 rounded-t-xl"></div>
            <div className="flex items-center gap-2 mb-4">
              <span className="font-bold text-indigo-800 text-sm bg-indigo-50 px-3 py-1 rounded-full">
                PRO (肯定側)
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Target size={14} className="text-indigo-500" />
                  <span className="text-[10px] font-bold uppercase text-slate-500">
                    Claim (主張)
                  </span>
                </div>
                <p className="text-sm text-slate-900 font-bold bg-indigo-50/50 p-2 rounded-lg">
                  {demo.clashAnalysis.pro.claim}
                </p>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Search size={14} className="text-indigo-400" />
                    <span className="text-[10px] font-bold uppercase text-slate-500">
                      Data (根拠)
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 h-full">
                    {demo.clashAnalysis.pro.data}
                  </p>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Network size={14} className="text-indigo-400" />
                    <span className="text-[10px] font-bold uppercase text-slate-500">
                      Warrant (論拠)
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 h-full">
                    {demo.clashAnalysis.pro.warrant}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* VS Icon */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-2 border-4 border-slate-100 shadow-sm z-10 hidden md:flex items-center justify-center w-12 h-12">
            <Swords size={20} className="text-slate-400" />
          </div>

          {/* Con Side */}
          <div className="flex-1 p-5 rounded-2xl border-2 border-rose-100 bg-white relative hover:border-rose-300 transition-colors">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-rose-500 rounded-t-xl"></div>
            <div className="flex items-center gap-2 mb-4">
              <span className="font-bold text-rose-800 text-sm bg-rose-50 px-3 py-1 rounded-full">
                CON (否定側)
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <ShieldCheck size={14} className="text-rose-500" />
                  <span className="text-[10px] font-bold uppercase text-slate-500">
                    Counter (反論)
                  </span>
                </div>
                <p className="text-sm text-slate-900 font-bold bg-rose-50/50 p-2 rounded-lg">
                  {demo.clashAnalysis.con.counter}
                </p>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Search size={14} className="text-rose-400" />
                    <span className="text-[10px] font-bold uppercase text-slate-500">
                      Evidence (証拠)
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 h-full">
                    {demo.clashAnalysis.con.evidence}
                  </p>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle size={14} className="text-rose-400" />
                    <span className="text-[10px] font-bold uppercase text-slate-500">
                      Impact (重要性)
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 h-full">
                    {demo.clashAnalysis.con.impact}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gradient-to-r from-slate-50 to-white rounded-xl border border-slate-200">
          <div className="flex items-center gap-2 mb-2 font-bold text-slate-700 text-sm">
            <Scale size={16} /> 議論の衝突・判定 (Synthesis)
          </div>
          <p className="text-sm text-slate-600 leading-relaxed font-medium">
            {demo.clashAnalysis.synthesis}
          </p>
        </div>
      </div>

      {/* Strategy Highlights */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-purple-200">
        <div className="flex items-center gap-2 mb-6 text-purple-700">
          <Sparkles size={20} />
          <h3 className="font-bold">技法のハイライト (Strategy Highlights)</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {demo.highlights.map((highlight, idx) => (
            <div
              key={idx}
              className="flex flex-col p-4 rounded-xl bg-purple-50/50 border border-purple-100 hover:bg-purple-50 transition-colors"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-white p-1.5 rounded-lg text-purple-500 shadow-sm border border-purple-100">
                  <Zap size={16} />
                </div>
                <h4 className="font-bold text-purple-900 text-sm leading-tight">
                  {highlight.technique}
                </h4>
              </div>
              <p className="text-xs text-slate-600 mb-3 flex-1 leading-relaxed">
                {highlight.description}
              </p>
              <div className="text-[10px] text-purple-700 font-bold border-t border-purple-100 pt-2 mt-auto">
                効果: {highlight.effect}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Observer Learning Points */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-200">
        <div className="flex items-center gap-2 mb-6 text-emerald-700">
          <BookOpen size={20} />
          <h3 className="font-bold">観察者としての学び (Observer Learning Points)</h3>
        </div>
        <div className="space-y-3">
          {demo.learningPoints.map((point, idx) => (
            <div
              key={idx}
              className="flex gap-4 p-4 rounded-xl bg-emerald-50/50 border border-emerald-100"
            >
              <div className="shrink-0 w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-sm shadow-sm border border-emerald-200">
                {idx + 1}
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm mb-1">{point.point}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{point.reason}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
