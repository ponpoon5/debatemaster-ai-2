import React, { useState, useMemo, useCallback } from 'react';
import {
  DebateSettings,
  TokenUsage,
  DebateMode,
  DebateArchive,
  HomeworkTask,
} from '../core/types';
import {
  ClipboardList,
  CheckCircle2,
  Trash2,
} from 'lucide-react';
import { useSetupLogic } from '../hooks/useSetupLogic';

// Sub-components
import { TokenStatus } from './setup/TokenStatus';
import { AppHeader } from './setup/AppHeader';
import { ModeGrid } from './setup/ModeGrid';
import { TopicInput } from './setup/TopicInput';
import { DifficultyCards } from './setup/DifficultyCards';
import { DebateTypeCards } from './setup/DebateTypeCards';
import { ModeSettings } from './setup/ModeSettings';
import { SystemInfoModal } from './setup/SystemInfoModal';
import { SpecificationModal } from './setup/SpecificationModal';
import { SetupModeContent } from './setup/SetupModeContent';

interface SetupScreenProps {
  onStart: (settings: DebateSettings) => void;
  onTokenUpdate: (usage: TokenUsage) => void;
  tokenUsage: TokenUsage;
  archives: DebateArchive[];
  homeworkTasks: HomeworkTask[];
  onCompleteHomework: (id: string, evidence: string) => void;
  onDeleteHomework: (id: string) => void;
  onShowHistory: () => void;
}

export const SetupScreen: React.FC<SetupScreenProps> = ({
  onStart,
  onTokenUpdate,
  tokenUsage,
  archives,
  homeworkTasks,
  onCompleteHomework,
  onDeleteHomework,
  onShowHistory,
}) => {
  const {
    activeMode,
    setActiveMode,
    topic,
    setTopic,
    debateType,
    setDebateType,
    difficulty,
    setDifficulty,
    suggestedTopics,
    aStance,
    setAStance,
    storyScenario,
    setStoryScenario,
    isGeneratingTopic,
    isRefreshingSuggestions,
    isAnalyzingWeakness,
    isGeneratingScenario,
    shuffleTopics,
    handleAiSuggestions,
    handleGenerateScenario,
    handleLuckyTopic,
    handleStartDebate,
    handleStartWithPreset,
    handleStartTraining,
  } = useSetupLogic(onStart, onTokenUpdate, archives);

  const [showSystemInfo, setShowSystemInfo] = useState(false);
  const [showSpecification, setShowSpecification] = useState(false);
  const [expandedHomework, setExpandedHomework] = useState(false);

  // Memoize pendingTasks to avoid re-filtering on every render
  const pendingTasks = useMemo(
    () => homeworkTasks.filter(t => t.status === 'pending'),
    [homeworkTasks]
  );

  // Memoize modal toggle handlers
  const handleShowSystemInfo = useCallback(() => setShowSystemInfo(true), []);
  const handleShowSpecification = useCallback(() => setShowSpecification(true), []);
  const handleToggleHomework = useCallback(() => setExpandedHomework(prev => !prev), []);

  return (
    <div className="h-full w-full overflow-y-auto scrollbar-hide">
      <div className="relative flex flex-col items-center justify-start pt-12 sm:pt-20 p-6 max-w-4xl mx-auto min-h-full">
        <TokenStatus
          tokenUsage={tokenUsage}
          archivesCount={archives.length}
          onShowHistory={onShowHistory}
          onShowSystemInfo={handleShowSystemInfo}
          onShowSpecification={handleShowSpecification}
        />

        <AppHeader activeMode={activeMode} />

        {/* Active Homework Dashboard */}
        {pendingTasks.length > 0 && (
          <div className="w-full mb-8 animate-fade-in-up">
            <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl p-1 shadow-lg">
              <div className="bg-white rounded-xl overflow-hidden">
                <div
                  className="bg-indigo-50 px-4 py-3 flex justify-between items-center cursor-pointer"
                  onClick={handleToggleHomework}
                >
                  <div className="flex items-center gap-2 font-bold text-indigo-800">
                    <ClipboardList size={20} />
                    <span>現在の宿題 (Active Homework)</span>
                    <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">
                      {pendingTasks.length}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-indigo-500">
                    {expandedHomework ? '閉じる' : '表示する'}
                  </span>
                </div>

                {expandedHomework && (
                  <div className="p-4 grid gap-3 max-h-64 overflow-y-auto">
                    {pendingTasks.map(task => (
                      <div
                        key={task.id}
                        className="border border-slate-200 rounded-xl p-3 hover:shadow-sm transition-shadow"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span
                                className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                                  task.difficulty === 'hard'
                                    ? 'bg-red-50 text-red-600 border-red-100'
                                    : task.difficulty === 'normal'
                                      ? 'bg-blue-50 text-blue-600 border-blue-100'
                                      : 'bg-green-50 text-green-600 border-green-100'
                                }`}
                              >
                                {task.difficulty.toUpperCase()}
                              </span>
                              <h4 className="font-bold text-slate-800 text-sm">{task.title}</h4>
                            </div>
                            <p className="text-xs text-slate-600">{task.description}</p>
                          </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-2 pt-2 border-t border-slate-50">
                          <button
                            onClick={() => onDeleteHomework(task.id)}
                            className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors"
                            title="削除"
                          >
                            <Trash2 size={14} />
                          </button>
                          <button
                            onClick={() => {
                              const evidence = prompt('完了のメモを残しますか？（任意）');
                              onCompleteHomework(task.id, evidence || '');
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-200 hover:bg-emerald-100 transition-colors"
                          >
                            <CheckCircle2 size={14} />
                            完了にする
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <ModeGrid activeMode={activeMode} onSelectMode={setActiveMode} />

        {(activeMode === DebateMode.DEBATE ||
          activeMode === DebateMode.FACILITATION ||
          activeMode === DebateMode.STORY ||
          activeMode === DebateMode.DEMO) && (
          <form
            onSubmit={handleStartDebate}
            className="w-full bg-white p-8 rounded-2xl shadow-xl border border-slate-100 space-y-8 animate-fade-in-up delay-200 mb-8"
          >
            <ModeSettings
              activeMode={activeMode}
              aStance={aStance}
              setAStance={setAStance}
              storyScenario={storyScenario}
              setStoryScenario={setStoryScenario}
              isGeneratingScenario={isGeneratingScenario}
              topic={topic}
              onGenerateScenario={handleGenerateScenario}
            />

            {activeMode === DebateMode.DEBATE && (
              <>
                <DebateTypeCards debateType={debateType} setDebateType={setDebateType} />
                <DifficultyCards difficulty={difficulty} setDifficulty={setDifficulty} />
              </>
            )}

            <TopicInput
              topic={topic}
              setTopic={setTopic}
              activeMode={activeMode}
              debateType={debateType}
              suggestedTopics={suggestedTopics}
              isGeneratingRandom={isGeneratingTopic}
              isRefreshingSuggestions={isRefreshingSuggestions}
              onGenerateRandom={handleLuckyTopic}
              onRefreshSuggestions={handleAiSuggestions}
              onShuffleSuggestions={shuffleTopics}
            />

            <div className="flex justify-center mt-6">
              <Button
                type="submit"
                className={`h-12 text-lg px-12 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 min-w-[200px] ${
                  activeMode === DebateMode.STORY
                    ? 'bg-gradient-to-r from-teal-600 to-teal-700'
                    : activeMode === DebateMode.DEMO
                      ? 'bg-gradient-to-r from-sky-600 to-sky-700'
                      : ''
                }`}
                disabled={!topic.trim() || (activeMode === DebateMode.STORY && !storyScenario)}
              >
                {activeMode === DebateMode.FACILITATION
                  ? '合意形成を開始する'
                  : activeMode === DebateMode.STORY
                    ? 'このシナリオで開始'
                    : activeMode === DebateMode.DEMO
                      ? '模範視聴を開始'
                      : '議論を開始する'}
              </Button>
            </div>
          </form>
        )}

        <SetupModeContent
          activeMode={activeMode}
          archives={archives}
          isAnalyzingWeakness={isAnalyzingWeakness}
          onStartWithPreset={handleStartWithPreset}
          onStartTraining={handleStartTraining}
          setActiveMode={setActiveMode}
        />
      </div>

      <SystemInfoModal isOpen={showSystemInfo} onClose={() => setShowSystemInfo(false)} />

      <SpecificationModal isOpen={showSpecification} onClose={() => setShowSpecification(false)} />
    </div>
  );
};
