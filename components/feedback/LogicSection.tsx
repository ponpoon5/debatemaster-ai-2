import React from 'react';
import { LogicStructure, UtteranceStructureScore } from '../../core/types';
import { hasStructureAnalysis, AnalyzedMessage } from '../../core/utils/type-guards';
import {
  Network,
  GitBranch,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
} from 'lucide-react';
import { ToulminCard } from './ToulminCard';

interface LogicSectionProps {
  logicAnalysis?: LogicStructure[];
  messages?: {
    id: string;
    text: string;
    role: string;
    structureAnalysis?: UtteranceStructureScore;
  }[];
}

export const LogicSection: React.FC<LogicSectionProps> = ({ logicAnalysis, messages = [] }) => {
  const userEvaluations = messages
    .filter((m): m is AnalyzedMessage => m.role === 'user' && hasStructureAnalysis(m))
    .map(m => m.structureAnalysis);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Info */}
      <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 text-blue-800">
        <div className="flex items-center gap-2 font-black text-lg mb-2">
          <Network size={24} />
          <h3>論理構造と妥当性の詳細分析</h3>
        </div>
        <p className="text-sm opacity-90 leading-relaxed font-medium">
          「主張の型（Toulmin）」だけでなく、どのような「議論スキーム（Walton）」を用いて説得を試みたか、
          そしてその論理の穴を検証する「批判的質問（CQ）」への対応度を可視化しています。
        </p>
      </div>

      {/* Argument Schemes Summary (Dashboard) */}
      {userEvaluations.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-slate-50 px-5 py-4 border-b border-slate-100 flex items-center gap-2">
            <GitBranch size={20} className="text-indigo-500" />
            <h4 className="font-bold text-slate-800">採用された議論スキームと論理の穴</h4>
          </div>
          <div className="divide-y divide-slate-100">
            {userEvaluations.map((evalData, idx) => (
              <div key={idx} className="p-5 hover:bg-slate-50 transition-colors">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Message & Scheme Part */}
                  <div className="md:w-1/2">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Message #{idx + 1}
                      </span>
                      {evalData.scheme && (
                        <span className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                          {evalData.scheme.label}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-700 font-medium line-clamp-3 mb-3 italic">
                      "{messages.find(m => m.id === evalData.messageId)?.text}"
                    </p>
                    <div className="text-xs text-slate-500 bg-white border border-slate-200 p-3 rounded-xl shadow-sm">
                      <span className="font-black text-slate-400 block mb-1 uppercase text-[9px]">
                        Scheme Detail
                      </span>
                      {evalData.scheme?.description}
                    </div>
                  </div>

                  {/* CQ Status Part */}
                  <div className="md:w-1/2">
                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1">
                      <HelpCircle size={12} /> Critical Questions Check
                    </h5>
                    <div className="space-y-2">
                      {evalData.criticalQuestions?.map((cq, cqIdx) => (
                        <div key={cqIdx} className="flex gap-2">
                          {cq.isAddressed ? (
                            <CheckCircle2 size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                          ) : (
                            <AlertCircle size={14} className="text-rose-500 mt-0.5 shrink-0" />
                          )}
                          <div>
                            <p
                              className={`text-xs font-bold ${cq.isAddressed ? 'text-emerald-700' : 'text-rose-700'}`}
                            >
                              {cq.question}
                            </p>
                            {!cq.isAddressed && (
                              <p className="text-[10px] text-slate-500 leading-tight mt-0.5">
                                {cq.aiComment}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Toulmin Maps Section */}
      <div className="space-y-4">
        <h4 className="font-black text-slate-400 text-xs uppercase tracking-[0.2em] flex items-center gap-2 px-1">
          <Network size={16} /> Toulmin Model Visualizations
        </h4>
        {logicAnalysis && logicAnalysis.length > 0 ? (
          logicAnalysis.map((structure, idx) => <ToulminCard key={idx} structure={structure} />)
        ) : (
          <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-slate-300 text-slate-400">
            <Network size={32} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm font-medium">基本構造分析データが不足しています</p>
          </div>
        )}
      </div>
    </div>
  );
};
