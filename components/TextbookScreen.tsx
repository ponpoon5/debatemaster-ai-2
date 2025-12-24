import React from 'react';
import { Button } from './Button';
import { TokenUsage } from '../core/types';
import {
  Home,
  BookOpen,
  ChevronRight,
  CheckCircle2,
  HelpCircle,
  Loader2,
  ArrowRight,
  Target,
} from 'lucide-react';
import { useTextbookLogic } from '../hooks/useTextbookLogic';
import { AttackQuizView } from './textbook/AttackQuizView';
import { WeighingQuizView } from './textbook/WeighingQuizView';
import { DefinitionQuizView } from './textbook/DefinitionQuizView';
import { StandardQuizView } from './textbook/StandardQuizView';

interface TextbookScreenProps {
  onBack: () => void;
  onTokenUpdate: (usage: TokenUsage) => void;
  initialChapterId?: number;
}

export const TextbookScreen: React.FC<TextbookScreenProps> = ({
  onBack,
  onTokenUpdate,
  initialChapterId,
}) => {
  const {
    currentChapterId,
    setCurrentChapterId,
    chapters,
    readChapters,
    practiceProblem,
    attackQuizData,
    weighingQuizData,
    definitionQuizData,
    userAnswer,
    setUserAnswer,
    isGenerating,
    isEvaluating,
    evaluationResult,
    handleStartPractice,
    handleAttackQuizAnswer,
    handleWeighingQuizAnswer,
    handleDefinitionQuizAnswer,
    handleSubmitStandardAnswer,
    setPracticeProblem: setPracticeProblemState, // For cancel action
  } = useTextbookLogic(onTokenUpdate, initialChapterId);

  const currentChapter = chapters.find(c => c.id === currentChapterId);

  return (
    <div className="h-full bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm z-10 shrink-0">
        <div className="flex items-center gap-4">
          <Button
            onClick={onBack}
            variant="secondary"
            size="sm"
            className="flex items-center gap-2 text-slate-600"
          >
            <Home size={16} />
            <span className="hidden sm:inline">トップへ</span>
          </Button>
          <h2 className="text-lg font-bold text-emerald-800 flex items-center gap-2">
            <BookOpen size={20} />
            議論教科書
          </h2>
        </div>
        {/* Progress Bar */}
        <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-slate-500">
          <span>Progress:</span>
          <div className="flex gap-1">
            {chapters.map(c => (
              <div
                key={c.id}
                className={`w-8 h-2 rounded-full transition-colors ${readChapters.includes(c.id) ? 'bg-emerald-500' : 'bg-slate-200'}`}
                title={c.title}
              />
            ))}
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-hidden relative flex">
        {/* Chapter List (Desktop Sidebar) */}
        <div className="hidden lg:block w-72 bg-white border-r border-slate-200 overflow-y-auto p-4 shrink-0">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-2">
            Chapters
          </h3>
          <div className="space-y-2">
            {chapters.map(chapter => (
              <button
                key={chapter.id}
                onClick={() => setCurrentChapterId(chapter.id)}
                className={`w-full text-left p-3 rounded-lg text-sm transition-all flex items-start gap-3 ${
                  currentChapterId === chapter.id
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-100 font-bold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span
                  className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] border ${
                    readChapters.includes(chapter.id)
                      ? 'bg-emerald-500 border-emerald-500 text-white'
                      : 'bg-white border-slate-300 text-slate-400'
                  }`}
                >
                  {readChapters.includes(chapter.id) ? <CheckCircle2 size={12} /> : chapter.id}
                </span>
                <span className="line-clamp-2">{chapter.title.split('：')[1]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-hide">
          <div className="max-w-3xl mx-auto pb-20">
            {!currentChapter ? (
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl p-8 text-white shadow-lg mb-8">
                  <h1 className="text-3xl font-bold mb-4">Master the Art of Debate</h1>
                  <p className="opacity-90 leading-relaxed max-w-lg">
                    理論を学び、AIとの実験（ラボ）で試し、クイズで定着させる。
                    <br />
                    最強の学習サイクルで、一生使える論理的思考力を手に入れましょう。
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
                  {chapters.map(chapter => (
                    <button
                      key={chapter.id}
                      onClick={() => setCurrentChapterId(chapter.id)}
                      className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all text-left group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className={`text-xs font-bold px-2 py-1 rounded-full ${readChapters.includes(chapter.id) ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}
                        >
                          Chapter {chapter.id}
                        </span>
                        <ChevronRight className="text-slate-300 group-hover:text-emerald-500 transition-colors" />
                      </div>
                      <h3 className="font-bold text-slate-800 text-lg mb-2">
                        {chapter.title.split('：')[1]}
                      </h3>
                      <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">
                        {chapter.description}
                      </p>
                    </button>
                  ))}
                </div>
                <div className="hidden lg:flex flex-col items-center justify-center text-slate-400 py-20">
                  <ArrowRight size={48} className="mb-4 opacity-20" />
                  <p>左側のメニューから章を選択して学習を開始してください</p>
                </div>
              </div>
            ) : (
              <div className="space-y-8 animate-fade-in">
                <button
                  onClick={() => setCurrentChapterId(null)}
                  className="lg:hidden text-sm text-slate-500 hover:text-emerald-600 flex items-center gap-1 font-bold px-2 py-1 rounded hover:bg-slate-100 transition-colors mb-4"
                >
                  <ChevronRight className="rotate-180" size={16} /> 章一覧に戻る
                </button>
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-emerald-100">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">
                      Chapter {currentChapter.id}
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">
                    {currentChapter.title.split('：')[1]}
                  </h2>
                  {currentChapter.content}
                </div>
                {/* Interactive Lab Section (If available) */}
                {currentChapter.lab && (
                  <div className="animate-fade-in-up delay-100">{currentChapter.lab}</div>
                )}
                {/* Quiz Section */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 animate-fade-in-up delay-200">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600">
                      <HelpCircle size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-800">理解度チェック</h3>
                      <p className="text-sm text-slate-500">
                        AIが生成する練習問題で定着を確認しましょう。
                      </p>
                    </div>
                  </div>

                  {!practiceProblem &&
                  !attackQuizData &&
                  !weighingQuizData &&
                  !definitionQuizData ? (
                    <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                      <Target size={40} className="mx-auto mb-4 text-slate-300" />
                      <p className="text-slate-500 mb-6">学習内容に基づいたクイズを生成します</p>
                      <Button
                        onClick={handleStartPractice}
                        disabled={isGenerating}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg px-8 py-3 text-lg"
                      >
                        {isGenerating ? (
                          <>
                            <Loader2 className="animate-spin mr-2" /> 生成中...
                          </>
                        ) : (
                          '問題を生成して挑戦'
                        )}
                      </Button>
                    </div>
                  ) : (
                    <div className="animate-fade-in">
                      {attackQuizData && (
                        <AttackQuizView
                          data={attackQuizData}
                          evaluationResult={evaluationResult}
                          onAnswer={handleAttackQuizAnswer}
                          onNext={handleStartPractice}
                        />
                      )}

                      {weighingQuizData && (
                        <WeighingQuizView
                          data={weighingQuizData}
                          evaluationResult={evaluationResult}
                          onAnswer={handleWeighingQuizAnswer}
                          onNext={handleStartPractice}
                        />
                      )}

                      {definitionQuizData && (
                        <DefinitionQuizView
                          data={definitionQuizData}
                          evaluationResult={evaluationResult}
                          onAnswer={handleDefinitionQuizAnswer}
                          onNext={handleStartPractice}
                        />
                      )}

                      {practiceProblem && (
                        <StandardQuizView
                          problem={practiceProblem}
                          userAnswer={userAnswer}
                          setUserAnswer={setUserAnswer}
                          evaluationResult={evaluationResult}
                          isEvaluating={isEvaluating}
                          onSubmit={handleSubmitStandardAnswer}
                          onCancel={() => setPracticeProblemState(null)}
                          onNext={handleStartPractice}
                        />
                      )}
                    </div>
                  )}
                </div>
                <div className="h-10"></div> {/* Spacer */}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
