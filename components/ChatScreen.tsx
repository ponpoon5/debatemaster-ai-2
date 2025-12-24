import React, { useRef, useEffect, useState } from 'react';
import {
  Message,
  DebateSettings,
  TokenUsage,
  DebateMode,
  UtteranceStructureScore,
  HomeworkTask,
  BurdenAnalysis,
} from '../core/types';
import { MessageItem } from './chat/MessageItem';
import { InputArea } from './chat/InputArea';
import { SupportPanel } from './chat/SupportPanel';
import { ArgumentBuilderModal } from './chat/ArgumentBuilderModal';
import { ThinkingGymModal } from './chat/ThinkingGymModal';
import { SummaryModal } from './chat/SummaryModal';
import { WhiteboardModal } from './chat/WhiteboardModal';
import { DebatePhaseBar } from './chat/DebatePhaseBar';
import { ThinkingIndicator } from './chat/ThinkingIndicator';
import { BurdenTracker } from './chat/BurdenTracker';
import { useChatTools } from '../hooks/useChatTools';
import { useMessageAnalysis } from '../hooks/useMessageAnalysis';
import { analyzeBurdenOfProofStreaming } from '../services/gemini/analysis/burden';
import {
  ListTodo,
  Presentation,
  DoorOpen,
  Bot,
  Swords,
  Shield,
  Loader2,
  Home,
  Dices,
  PenTool,
  ClipboardList,
  X,
  Trash2,
  CheckCircle2,
  Scale,
} from 'lucide-react';

interface ChatScreenProps {
  messages: Message[];
  settings: DebateSettings;
  isSending: boolean;
  onSendMessage: (text: string) => void;
  onAiStart: (stance: 'PRO' | 'CON') => void;
  onEndDebate: () => void;
  tokenUsage?: TokenUsage;
  onTokenUpdate?: (usage: TokenUsage) => void;
  onBackToTop: () => void;
  onStructureAnalysisComplete?: (messageId: string, analysis: UtteranceStructureScore) => void;
  homeworkTasks: HomeworkTask[];
  onCompleteHomework: (id: string, evidence: string) => void;
  onDeleteHomework: (id: string) => void;
}

export const ChatScreen: React.FC<ChatScreenProps> = ({
  messages,
  settings,
  isSending,
  onSendMessage,
  onAiStart,
  onEndDebate,
  tokenUsage,
  onTokenUpdate,
  onBackToTop,
  onStructureAnalysisComplete,
  homeworkTasks,
  onCompleteHomework,
  onDeleteHomework,
}) => {
  const [inputText, setInputText] = useState('');
  const [showBuilder, setShowBuilder] = useState(false);
  const [builderMode, setBuilderMode] = useState<'builder' | 'rebuttal'>('builder'); // NEW
  const [showGymModal, setShowGymModal] = useState(false);
  const [showHomeworkModal, setShowHomeworkModal] = useState(false);
  const [gymInitialTab, setGymInitialTab] = useState<'ai_topic' | 'custom_topic'>('ai_topic');
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  // Burden of Proof Tracker state
  const [burdenAnalysis, setBurdenAnalysis] = useState<BurdenAnalysis | null>(null);
  const [showBurdenTracker, setShowBurdenTracker] = useState(false);
  const [isAnalyzingBurden, setIsAnalyzingBurden] = useState(false);

  // Custom Hooks
  const {
    adviceData,
    showAdvicePanel,
    setShowAdvicePanel,
    isGettingAdvice,
    strategyData,
    setStrategyData,
    isGeneratingStrategy,
    getStrategy,
    summaryState,
    boardState,
    getAdvice,
    resetTools,
  } = useChatTools({
    messages,
    settings,
    inputText,
    isSending,
    onTokenUpdate,
  });

  const { analyses, demoParsedMessages, debateFlowState } = useMessageAnalysis({
    messages,
    settings,
    onTokenUpdate,
    onStructureAnalysisComplete,
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastPhaseRef = useRef<string>('POSITION'); // Track debate phase changes

  const isStudyMode = settings.mode === DebateMode.STUDY;
  const isDrillMode = settings.mode === DebateMode.DRILL;
  const isFacilitationMode = settings.mode === DebateMode.FACILITATION;
  const isThinkingGymMode = settings.mode === DebateMode.THINKING_GYM;
  const isDemoMode = settings.mode === DebateMode.DEMO;
  const isStandardDebate = settings.mode === DebateMode.DEBATE;
  const isStoryMode = settings.mode === DebateMode.STORY;

  const showPhaseBar = isStandardDebate || isFacilitationMode || isStoryMode;

  const isGlobalLoading =
    isSending ||
    isGettingAdvice ||
    isGeneratingStrategy ||
    summaryState.isGenerating ||
    boardState.isGenerating;

  const pendingTasks = homeworkTasks.filter(t => t.status === 'pending');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSending]);

  // Re-analyze burden when messages change (if tracker is visible)
  useEffect(() => {
    if (!isStandardDebate || messages.length < 2 || !showBurdenTracker || isAnalyzingBurden || isSending) return;

    const currentPhase = debateFlowState.currentPhase;
    const phaseChanged = currentPhase !== lastPhaseRef.current;

    if (phaseChanged) {
      console.log(`🔄 Debate phase changed from ${lastPhaseRef.current} to ${currentPhase}. Re-analyzing burden...`);
      lastPhaseRef.current = currentPhase;
    } else {
      console.log('🔄 New message detected. Re-analyzing burden...');
    }

    setIsAnalyzingBurden(true);
    analyzeBurdenOfProofStreaming(settings.topic, messages)
      .then(({ data, usage }) => {
        console.log('Burden re-analysis result:', data);
        setBurdenAnalysis(data);
        if (onTokenUpdate && usage) {
          onTokenUpdate(usage);
        }
      })
      .catch(error => {
        console.error('Burden re-analysis failed:', error);
      })
      .finally(() => {
        setIsAnalyzingBurden(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages.length, debateFlowState.currentPhase, isStandardDebate, showBurdenTracker, isSending]);

  // Burden of Proof Analysis (manual trigger with toggle)
  const toggleBurdenTracker = () => {
    // If already showing, just hide it
    if (showBurdenTracker) {
      setShowBurdenTracker(false);
      return;
    }

    // If we have cached analysis, show it
    if (burdenAnalysis) {
      setShowBurdenTracker(true);
      return;
    }

    // Otherwise, analyze first
    if (messages.length < 2 || isAnalyzingBurden) return;

    setIsAnalyzingBurden(true);
    analyzeBurdenOfProofStreaming(settings.topic, messages)
      .then(({ data, usage }) => {
        console.log('Burden analysis result:', data);
        setBurdenAnalysis(data);
        setShowBurdenTracker(true);
        if (onTokenUpdate && usage) {
          onTokenUpdate(usage);
        }
      })
      .catch(error => {
        console.error('Burden analysis failed:', error);
      })
      .finally(() => {
        setIsAnalyzingBurden(false);
      });
  };

  // Auto-play Logic for Demo Mode
  useEffect(() => {
    if (!isDemoMode || !isAutoPlaying) return;

    let timer: ReturnType<typeof setTimeout>;

    if (!isSending && messages.length > 0) {
      timer = setTimeout(() => {
        onSendMessage('次のターンへ');
      }, 4000);
    }

    return () => clearTimeout(timer);
  }, [messages, isDemoMode, isAutoPlaying, isSending, onSendMessage]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim() && !isSending) {
      onSendMessage(inputText);
      setInputText('');
      resetTools();
    }
  };

  const handleUseStrategy = (template: string) => {
    setInputText(template);
  };

  const handleModalSend = (text: string) => {
    onSendMessage(text);
    resetTools();
  };

  const handleOpenRebuttalCard = () => {
    setBuilderMode('rebuttal');
    setShowBuilder(true);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 animate-fade-in relative">
      {isGlobalLoading && (
        <div className="absolute top-0 left-0 w-full h-1 z-50 bg-transparent overflow-hidden pointer-events-none">
          <div className="h-full bg-gradient-to-r from-transparent via-blue-500 to-transparent w-[50%] animate-[shimmer_1.5s_infinite] -translate-x-full"></div>
        </div>
      )}

      {/* Back to Top Button */}
      <div className="absolute top-4 left-4 z-30">
        <button
          onClick={onBackToTop}
          className="p-2 bg-white/90 backdrop-blur rounded-full shadow-md text-slate-600 hover:text-blue-600 transition-all border border-slate-200"
          title="トップに戻る"
        >
          <Home size={20} />
        </button>
      </div>

      {/* Floating Action Buttons */}
      <div className="absolute top-4 right-4 z-30 flex flex-col gap-2">
        <button
          onClick={() => setShowHomeworkModal(true)}
          className="p-2 bg-white/90 backdrop-blur rounded-full shadow-md text-slate-600 hover:text-indigo-600 transition-all border border-slate-200 relative group"
          title="宿題リスト"
        >
          <ClipboardList size={20} />
          {pendingTasks.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
              {pendingTasks.length}
            </span>
          )}
        </button>

        {!isDemoMode && !isStudyMode && !isDrillMode && (
          <>
            <button
              onClick={summaryState.generate}
              disabled={summaryState.isGenerating}
              className="p-2 bg-white/90 backdrop-blur rounded-full shadow-md text-slate-600 hover:text-blue-600 transition-all border border-slate-200 disabled:opacity-70 disabled:cursor-not-allowed"
              title="議論を要約"
            >
              {summaryState.isGenerating ? (
                <Loader2 size={20} className="animate-spin text-blue-500" />
              ) : (
                <ListTodo size={20} />
              )}
            </button>
            {isStandardDebate && (
              <button
                onClick={toggleBurdenTracker}
                disabled={isAnalyzingBurden || messages.length < 2}
                className={`p-2 bg-white/90 backdrop-blur rounded-full shadow-md transition-all border border-slate-200 disabled:opacity-70 disabled:cursor-not-allowed ${
                  showBurdenTracker
                    ? 'text-indigo-600 bg-indigo-50 border-indigo-300'
                    : 'text-slate-600 hover:text-indigo-600'
                }`}
                title={showBurdenTracker ? '立証責任トラッカーを閉じる' : '立証責任を分析'}
              >
                {isAnalyzingBurden ? (
                  <Loader2 size={20} className="animate-spin text-indigo-500" />
                ) : (
                  <Scale size={20} />
                )}
              </button>
            )}
            {isFacilitationMode && (
              <button
                onClick={boardState.generate}
                disabled={boardState.isGenerating}
                className="p-2 bg-white/90 backdrop-blur rounded-full shadow-md text-slate-600 hover:text-green-600 transition-all border border-slate-200 disabled:opacity-70 disabled:cursor-not-allowed"
                title="ホワイトボードを表示"
              >
                {boardState.isGenerating ? (
                  <Loader2 size={20} className="animate-spin text-green-500" />
                ) : (
                  <Presentation size={20} />
                )}
              </button>
            )}
          </>
        )}
        <button
          onClick={onEndDebate}
          className="p-2 bg-red-500/90 backdrop-blur rounded-full shadow-md text-white hover:bg-red-600 transition-all border border-red-400"
          title="議論を終了して分析"
        >
          <DoorOpen size={20} />
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden relative flex-col">
        {showPhaseBar && (
          <DebatePhaseBar
            currentPhase={debateFlowState.currentPhase}
            winCondition={debateFlowState.winCondition}
          />
        )}

        <div className="flex-1 relative w-full overflow-hidden">
          <div className="absolute inset-0 overflow-y-auto p-4 scrollbar-hide pb-32">
            {/* Burden of Proof Tracker */}
            {isStandardDebate && showBurdenTracker && burdenAnalysis && (
              <div className="mb-4 animate-fade-in">
                <BurdenTracker
                  burdenAnalysis={burdenAnalysis}
                  isVisible={showBurdenTracker}
                  onToggle={() => setShowBurdenTracker(!showBurdenTracker)}
                />
              </div>
            )}

            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center min-h-[50vh] p-6">
                <div className="max-w-md w-full text-center space-y-6 animate-fade-in-up">
                  <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Bot size={28} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">
                      {isDemoMode ? '模範ディベート視聴' : '議論を開始しましょう'}
                    </h3>
                    <p className="text-sm text-slate-500 mb-6">
                      {isDemoMode
                        ? 'AI同士のハイレベルな議論を観戦します。\n自動再生で流れを見るか、自分のペースで進めてください。'
                        : 'AIに先攻（立論）を任せるか、\n下の入力欄からあなたが発言して開始してください。'}
                    </p>

                    {!isDemoMode && isStandardDebate && (
                      <div className="grid gap-3">
                        <button
                          onClick={() => onAiStart('PRO')}
                          disabled={isSending}
                          className="flex items-center justify-center gap-3 w-full p-4 rounded-xl border-2 border-slate-100 hover:border-blue-500 hover:bg-blue-50 transition-all group text-left disabled:opacity-50"
                        >
                          <div className="bg-blue-100 text-blue-600 p-2 rounded-lg group-hover:bg-blue-500 group-hover:text-white transition-colors">
                            <Swords size={20} />
                          </div>
                          <div>
                            <span className="block font-bold text-slate-700 group-hover:text-blue-700">
                              AIが肯定側で開始
                            </span>
                            <span className="text-xs text-slate-400">AIが先攻で立論を行います</span>
                          </div>
                        </button>

                        <button
                          onClick={() => onAiStart('CON')}
                          disabled={isSending}
                          className="flex items-center justify-center gap-3 w-full p-4 rounded-xl border-2 border-slate-100 hover:border-red-500 hover:bg-red-50 transition-all group text-left disabled:opacity-50"
                        >
                          <div className="bg-red-100 text-red-600 p-2 rounded-lg group-hover:bg-red-500 group-hover:text-white transition-colors">
                            <Shield size={20} />
                          </div>
                          <div>
                            <span className="block font-bold text-slate-700 group-hover:text-red-700">
                              AIが否定側で開始
                            </span>
                            <span className="text-xs text-slate-400">AIが先攻で立論を行います</span>
                          </div>
                        </button>
                      </div>
                    )}

                    {isThinkingGymMode && (
                      <div className="grid gap-3">
                        <button
                          onClick={() => onSendMessage('課題の自動作成をお願いします。')}
                          disabled={isSending}
                          className="flex items-center justify-center gap-3 w-full p-4 rounded-xl border-2 border-indigo-100 hover:border-indigo-500 hover:bg-indigo-50 transition-all group text-left disabled:opacity-50"
                        >
                          <div className="bg-indigo-100 text-indigo-600 p-2 rounded-lg group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                            <Dices size={20} />
                          </div>
                          <div>
                            <span className="block font-bold text-slate-700 group-hover:text-indigo-700">
                              AIに課題を出してもらう
                            </span>
                            <span className="text-xs text-slate-400">
                              ランダムなテーマで練習します
                            </span>
                          </div>
                        </button>

                        <button
                          onClick={() => {
                            setGymInitialTab('custom_topic');
                            setShowGymModal(true);
                          }}
                          disabled={isSending}
                          className="flex items-center justify-center gap-3 w-full p-4 rounded-xl border-2 border-slate-100 hover:border-slate-400 hover:bg-slate-50 transition-all group text-left disabled:opacity-50"
                        >
                          <div className="bg-slate-100 text-slate-500 p-2 rounded-lg group-hover:bg-slate-600 group-hover:text-white transition-colors">
                            <PenTool size={20} />
                          </div>
                          <div>
                            <span className="block font-bold text-slate-700 group-hover:text-slate-800">
                              自分でテーマを決める
                            </span>
                            <span className="text-xs text-slate-400">好きな課題で分析します</span>
                          </div>
                        </button>
                      </div>
                    )}

                    {!isDemoMode && !isStandardDebate && !isThinkingGymMode && (
                      <p className="text-sm text-slate-400">下の入力欄から開始してください</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {messages.map((msg, index) => (
              <MessageItem
                key={msg.id}
                msg={msg}
                index={index}
                settings={settings}
                analysis={analyses[msg.id]}
                demoParsedData={demoParsedMessages[msg.id]}
                structureScore={msg.structureAnalysis}
                supportMode={true}
                detectedFallacy={adviceData.detectedFallacy}
                highlightQuote={adviceData.fallacyQuote}
                onHighlightClick={() => setShowAdvicePanel(true)}
              />
            ))}

            {isSending && <ThinkingIndicator />}

            <div ref={messagesEndRef} />
          </div>

          {(showAdvicePanel || strategyData) && (
            <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none">
              <div className="pointer-events-auto w-full">
                <SupportPanel
                  advice={adviceData.advice}
                  detectedFallacy={adviceData.detectedFallacy}
                  fallacyExplanation={adviceData.fallacyExplanation}
                  sentimentScore={adviceData.sentimentScore}
                  strategyData={strategyData}
                  onClose={() => {
                    setShowAdvicePanel(false);
                    setStrategyData(null);
                  }}
                  onUseStrategy={handleUseStrategy}
                  onOpenRebuttalCard={handleOpenRebuttalCard}
                />
              </div>
            </div>
          )}
        </div>

        <InputArea
          inputText={inputText}
          setInputText={setInputText}
          isSending={isSending}
          supportMode={true}
          onSendMessage={handleSendMessage}
          onSendText={handleModalSend}
          onGetAdvice={getAdvice}
          isGettingAdvice={isGettingAdvice}
          onGetStrategy={getStrategy}
          isGeneratingStrategy={isGeneratingStrategy}
          onToggleBuilder={() => {
            setBuilderMode('builder');
            setShowBuilder(!showBuilder);
          }}
          onToggleGym={() => {
            setGymInitialTab('ai_topic');
            setShowGymModal(!showGymModal);
          }}
          isThinkingGymMode={isThinkingGymMode}
          isStudyMode={isStudyMode}
          isDrillMode={isDrillMode}
          isDemoMode={isDemoMode}
          hasMessages={messages.length > 0}
          isAutoPlaying={isAutoPlaying}
          onToggleAutoPlay={() => setIsAutoPlaying(!isAutoPlaying)}
          onNextTurn={() => onSendMessage('次のターンへ')}
        />
      </div>

      <ArgumentBuilderModal
        isOpen={showBuilder}
        onClose={() => setShowBuilder(false)}
        onSend={handleModalSend}
        initialMode={builderMode}
        rebuttalTemplate={strategyData?.rebuttalTemplate}
      />

      <ThinkingGymModal
        isOpen={showGymModal}
        onClose={() => setShowGymModal(false)}
        onSend={handleModalSend}
        framework={settings.thinkingFramework}
        initialTab={gymInitialTab}
      />

      <SummaryModal
        isOpen={summaryState.isOpen}
        onClose={() => summaryState.setIsOpen(false)}
        summaryPoints={summaryState.points}
        isGenerating={summaryState.isGenerating}
      />

      <WhiteboardModal
        isOpen={boardState.isOpen}
        onClose={() => boardState.setIsOpen(false)}
        boardData={boardState.data}
        isGenerating={boardState.isGenerating}
      />

      {showHomeworkModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden animate-pop-in flex flex-col max-h-[80vh]">
            <div className="bg-indigo-50 px-4 py-3 flex justify-between items-center border-b border-indigo-100">
              <div className="flex items-center gap-2 font-bold text-indigo-800">
                <ClipboardList size={20} />
                <span>宿題リスト</span>
                <span className="bg-indigo-200 text-indigo-800 text-xs px-2 py-0.5 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                  {pendingTasks.length}
                </span>
              </div>
              <button
                onClick={() => setShowHomeworkModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4 overflow-y-auto">
              {pendingTasks.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <ClipboardList size={40} className="mx-auto mb-2 opacity-50" />
                  <p>現在、宿題はありません。</p>
                  <p className="text-xs mt-1">議論のフィードバックで提案されます。</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingTasks.map(task => (
                    <div
                      key={task.id}
                      className="border border-slate-200 rounded-lg p-3 bg-slate-50 hover:bg-white transition-colors group"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase ${
                            task.difficulty === 'hard'
                              ? 'bg-red-50 text-red-600 border-red-100'
                              : task.difficulty === 'normal'
                                ? 'bg-blue-50 text-blue-600 border-blue-100'
                                : 'bg-green-50 text-green-600 border-green-100'
                          }`}
                        >
                          {task.difficulty}
                        </span>
                        <span className="font-bold text-slate-800 text-sm">{task.title}</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed mb-2">
                        {task.description}
                      </p>

                      <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity">
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
                          className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-lg border border-emerald-200 hover:bg-emerald-100 transition-colors"
                        >
                          <CheckCircle2 size={12} />
                          完了
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
    </div>
  );
};
