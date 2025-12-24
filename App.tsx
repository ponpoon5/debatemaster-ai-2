import React, { Suspense, lazy } from 'react';
import { Toaster } from 'react-hot-toast';
import { SetupScreen } from './components/SetupScreen';
import { LoadingOverlay } from './components/common/LoadingOverlay';
import { useDebateApp } from './hooks/useDebateApp';
import { UtteranceStructureScore } from './core/types';

// 遅延ロード: 初期表示に不要な大きいコンポーネント
const ChatScreen = lazy(() =>
  import('./components/ChatScreen').then(module => ({ default: module.ChatScreen }))
);
const FeedbackScreen = lazy(() =>
  import('./components/FeedbackScreen').then(module => ({ default: module.FeedbackScreen }))
);
const PremiseCheckScreen = lazy(() =>
  import('./components/PremiseCheckScreen').then(module => ({
    default: module.PremiseCheckScreen,
  }))
);
const TextbookScreen = lazy(() =>
  import('./components/TextbookScreen').then(module => ({ default: module.TextbookScreen }))
);
const MiniGameScreen = lazy(() =>
  import('./components/MiniGameScreen').then(module => ({ default: module.MiniGameScreen }))
);
const HistoryScreen = lazy(() =>
  import('./components/HistoryScreen').then(module => ({ default: module.HistoryScreen }))
);

export default function App() {
  const {
    screen,
    setScreen,
    settings,
    messages,
    setMessages,
    isSending,
    feedback,
    tokenUsage,
    archives,
    homeworkTasks,
    viewingArchive,
    updateTokenUsage,
    isLoadingFeedback,
    loadingProgress,
    estimatedSeconds,
    elapsedSeconds,
    currentTip,
    handleSetupComplete,
    handlePremiseConfirmed,
    handleSendMessage,
    handleAiStart,
    handleEndDebate,
    handleReset,
    handleSelectArchive,
    handleDeleteArchive,
    handleAddHomework,
    handleCompleteHomework,
    handleDeleteHomework,
    handleExportData,
    handleImportData,
    handleNavigateToTraining,
  } = useDebateApp();

  const handleMessageUpdate = (messageId: string, analysis: UtteranceStructureScore) => {
    setMessages(prev =>
      prev.map(msg => (msg.id === messageId ? { ...msg, structureAnalysis: analysis } : msg))
    );
  };

  return (
    <div className="h-full bg-slate-50">
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 5000,
          style: {
            background: '#fff',
            color: '#1e293b',
            padding: '16px',
            borderRadius: '12px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
            maxWidth: '500px',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
            duration: 7000,
          },
        }}
      />
      {screen === 'setup' && (
        <SetupScreen
          onStart={handleSetupComplete}
          onTokenUpdate={updateTokenUsage}
          tokenUsage={tokenUsage}
          archives={archives}
          homeworkTasks={homeworkTasks}
          onCompleteHomework={handleCompleteHomework}
          onDeleteHomework={handleDeleteHomework}
          onShowHistory={() => setScreen('history')}
        />
      )}
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen bg-slate-50">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-slate-600 font-medium">読み込み中...</p>
            </div>
          </div>
        }
      >
        {screen === 'history' && (
          <HistoryScreen
            archives={archives}
            onSelect={handleSelectArchive}
            onDelete={handleDeleteArchive}
            onBack={() => setScreen('setup')}
            onExport={handleExportData}
            onImport={handleImportData}
          />
        )}
        {screen === 'premise_check' && settings && (
          <PremiseCheckScreen
            settings={settings}
            onConfirm={handlePremiseConfirmed}
            onBack={() => setScreen('setup')}
            onTokenUpdate={updateTokenUsage}
          />
        )}
        {screen === 'textbook' && (
          <TextbookScreen
            onBack={handleReset}
            onTokenUpdate={updateTokenUsage}
            initialChapterId={settings?.textbookChapterId}
          />
        )}
        {screen === 'minigame' && (
          <MiniGameScreen
            miniGameType={settings?.miniGameType}
            onBack={handleReset}
            onTokenUpdate={updateTokenUsage}
          />
        )}
        {screen === 'chat' && settings && (
          <ChatScreen
            messages={messages}
            settings={settings}
            isSending={isSending}
            onSendMessage={handleSendMessage}
            onAiStart={handleAiStart}
            onEndDebate={handleEndDebate}
            tokenUsage={tokenUsage}
            onTokenUpdate={updateTokenUsage}
            onBackToTop={handleReset}
            onStructureAnalysisComplete={handleMessageUpdate}
            homeworkTasks={homeworkTasks}
            onCompleteHomework={handleCompleteHomework}
            onDeleteHomework={handleDeleteHomework}
          />
        )}
        {screen === 'feedback' && feedback && (
          <FeedbackScreen
            feedback={feedback}
            messages={messages}
            onReset={handleReset}
            tokenUsage={tokenUsage}
            isArchiveView={viewingArchive}
            onAddHomework={handleAddHomework}
            onBackToHistory={() => setScreen('history')}
            onNavigate={handleNavigateToTraining}
          />
        )}
      </Suspense>

      <LoadingOverlay
        isVisible={isLoadingFeedback}
        progress={loadingProgress}
        estimatedSeconds={estimatedSeconds}
        elapsedSeconds={elapsedSeconds}
        currentTip={currentTip}
      />
    </div>
  );
}
