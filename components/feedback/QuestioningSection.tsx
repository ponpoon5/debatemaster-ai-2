import React from 'react';
import { QuestioningStats, QuestionAnalysis } from '../../core/types';
import { HelpCircle } from 'lucide-react';
import { QuestioningCard } from './QuestioningCard';

interface QuestioningSectionProps {
  questioningAnalysis?: {
    stats: QuestioningStats;
    details: QuestionAnalysis[];
  };
}

export const QuestioningSection: React.FC<QuestioningSectionProps> = ({ questioningAnalysis }) => {
  if (!questioningAnalysis) {
    return (
      <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-300 text-slate-500">
        <HelpCircle size={32} className="mx-auto mb-2 opacity-50" />
        <p>質問力の解析データがありません。</p>
      </div>
    );
  }
  return (
    <QuestioningCard stats={questioningAnalysis.stats} details={questioningAnalysis.details} />
  );
};
