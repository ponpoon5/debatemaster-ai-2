import React from 'react';
import { DebateSettings, TokenUsage, PremiseData } from '../core/types';
import { Button } from './Button';
import { Brain, ArrowRight } from 'lucide-react';
import { LoadingView } from './premise/LoadingView';
import { PremiseEditor } from './premise/PremiseEditor';
import { usePremiseLogic } from '../hooks/usePremiseLogic';

interface PremiseCheckScreenProps {
  settings: DebateSettings;
  onConfirm: (finalPremises: PremiseData, usage?: TokenUsage) => void;
  onBack: () => void;
  onTokenUpdate: (usage: TokenUsage) => void;
}

export const PremiseCheckScreen: React.FC<PremiseCheckScreenProps> = ({
  settings,
  onConfirm,
  onBack,
  onTokenUpdate,
}) => {
  const { loading, premises, setPremises, isEditing, toggleEdit, handleStart, isStartDisabled } =
    usePremiseLogic(settings, onConfirm, onTokenUpdate);

  if (loading) {
    return <LoadingView />;
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 p-4 md:p-8 animate-fade-in overflow-y-auto">
      <div className="max-w-3xl mx-auto w-full">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center justify-center gap-2">
            <Brain className="text-blue-600" />
            前提の確認 (Premise Check)
          </h2>
          <p className="text-slate-600 mt-2">
            議論を始める前に、「言葉の定義」と「議論のゴール」をすり合わせましょう。
            <br />
            水掛け論（Talking past each other）を防ぎ、建設的な議論を行うための重要なステップです。
          </p>
        </div>

        <PremiseEditor
          premises={premises}
          setPremises={setPremises}
          isEditing={isEditing}
          onToggleEdit={toggleEdit}
        />

        <div className="flex gap-4">
          <Button variant="secondary" onClick={onBack} className="flex-1">
            戻る
          </Button>
          <Button
            onClick={handleStart}
            className="flex-[2] text-lg font-bold shadow-lg"
            disabled={isStartDisabled}
          >
            この前提で議論開始 <ArrowRight size={20} className="ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};
