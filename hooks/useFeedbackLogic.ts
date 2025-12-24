import { useState } from 'react';
import { FeedbackData } from '../core/types';

export type FeedbackTab = 'summary' | 'review' | 'logic' | 'questioning' | 'exemplars';

export const useFeedbackLogic = (feedback: FeedbackData) => {
  const [activeTab, setActiveTab] = useState<FeedbackTab>('summary');

  // Mode detection based on feedback data structure
  const isFacilitationMode = !!(
    feedback.facilitation && feedback.facilitation.understandingScore > 0
  );
  const isStoryMode = !!(feedback.storyAnalysis && feedback.storyAnalysis.decisionScore > 0);
  const isDemoMode = !!feedback.demoAnalysis;

  // Visibility logic: Show tab if specific data exists OR if it's standard debate mode
  const showReviewTab =
    !isDemoMode || (feedback.detailedReview && feedback.detailedReview.length > 0);

  const showLogicTab =
    !!(feedback.logicAnalysis && feedback.logicAnalysis.length > 0) ||
    (!isFacilitationMode && !isStoryMode && !isDemoMode);

  const showQuestioningTab =
    !!feedback.questioningAnalysis?.stats || (!isFacilitationMode && !isStoryMode && !isDemoMode);

  const showExemplarsTab = !isDemoMode && !!(feedback.exemplars && feedback.exemplars.length > 0);

  return {
    activeTab,
    setActiveTab,
    isFacilitationMode,
    isStoryMode,
    isDemoMode,
    showReviewTab,
    showLogicTab,
    showQuestioningTab,
    showExemplarsTab,
  };
};
