import React, { useState } from 'react';
import { AlertCircle, CheckCircle, HelpCircle } from 'lucide-react';
import {
  WhyStep,
  CauseType,
  Controllability,
  RootCauseSummary,
} from '../../core/types';

interface FiveWhysDetailedInputProps {
  problem: string;
  onSubmit: (whys: [WhyStep, WhyStep, WhyStep, WhyStep, WhyStep], summary?: RootCauseSummary) => void;
}

const CAUSE_TYPE_LABELS: Record<CauseType, string> = {
  [CauseType.PERSON]: '人',
  [CauseType.PROCESS]: 'プロセス',
  [CauseType.TOOL]: 'ツール',
  [CauseType.INFORMATION]: '情報',
  [CauseType.ENVIRONMENT]: '環境',
  [CauseType.MANAGEMENT]: '管理',
};

const CONTROLLABILITY_LABELS: Record<Controllability, string> = {
  [Controllability.HIGH]: '高',
  [Controllability.MEDIUM]: '中',
  [Controllability.LOW]: '低',
};

const createEmptyWhyStep = (): WhyStep => ({
  cause: '',
  mechanism: '',
  evidence: {
    data: '',
    example: '',
    observation: '',
  },
  isHypothesis: false,
  causeType: null,
  confidence: 50,
  controllability: undefined,
});

export const FiveWhysDetailedInput: React.FC<FiveWhysDetailedInputProps> = ({
  problem,
  onSubmit,
}) => {
  const [currentStep, setCurrentStep] = useState(0); // 0-4 (Why1-5), 5 (Summary)
  const [whySteps, setWhySteps] = useState<WhyStep[]>([
    createEmptyWhyStep(),
    createEmptyWhyStep(),
    createEmptyWhyStep(),
    createEmptyWhyStep(),
    createEmptyWhyStep(),
  ]);
  const [summary, setSummary] = useState<RootCauseSummary>({
    rootCause: '',
    oneAction: '',
    successMetric: '',
  });

  const updateWhyStep = (index: number, field: keyof WhyStep, value: any) => {
    const updated = [...whySteps];
    updated[index] = { ...updated[index], [field]: value };
    setWhySteps(updated);
  };

  const updateEvidence = (index: number, evidenceField: 'data' | 'example' | 'observation', value: string) => {
    const updated = [...whySteps];
    updated[index] = {
      ...updated[index],
      evidence: {
        ...updated[index].evidence,
        [evidenceField]: value,
      },
    };
    setWhySteps(updated);
  };

  const getCurrentStepData = () => whySteps[currentStep];

  const hasAnyEvidence = (step: WhyStep) => {
    return !!(step.evidence.data || step.evidence.example || step.evidence.observation);
  };

  const canProceedToNext = () => {
    const step = getCurrentStepData();
    if (!step.cause.trim()) return false;
    if (!step.causeType) return false;
    if (!step.isHypothesis && !hasAnyEvidence(step)) return false;
    if ((currentStep === 3 || currentStep === 4) && !step.controllability) return false;
    return true;
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      // Why5まで完了、Summaryへ
      setCurrentStep(5);
    }
  };

  const handleSubmit = () => {
    onSubmit(whySteps as [WhyStep, WhyStep, WhyStep, WhyStep, WhyStep], summary);
  };

  const renderWhyStepForm = () => {
    const step = getCurrentStepData();
    const whyNumber = currentStep + 1;
    const isWhy4or5 = currentStep >= 3;

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
          <h3 className="text-lg font-bold text-indigo-900">Why {whyNumber}</h3>
          <p className="text-sm text-indigo-700 mt-1">
            {currentStep === 0
              ? `「${problem}」はなぜ起きたのか？`
              : `「${whySteps[currentStep - 1].cause}」はなぜ起きたのか？`}
          </p>
        </div>

        {/* Cause - 必須 */}
        <div>
          <label className="text-sm font-bold text-slate-700 block mb-1">
            Cause（原因文）<span className="text-rose-500">*必須</span>
          </label>
          <input
            type="text"
            placeholder="例：マニュアルが整備されていない"
            value={step.cause}
            onChange={e => updateWhyStep(currentStep, 'cause', e.target.value)}
            className="w-full p-3 border border-slate-300 rounded-lg text-sm bg-white text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
          <p className="text-xs text-slate-500 mt-1">
            1文で、「〜だから/〜のため」の形式で。状態・欠落・不備を記述（対策は書かない）
          </p>
        </div>

        {/* Mechanism - 推奨 */}
        <div>
          <label className="text-sm font-bold text-slate-600 block mb-1">
            Mechanism（因果のつなぎ説明）<span className="text-slate-400">推奨</span>
          </label>
          <input
            type="text"
            placeholder="例：手順が統一されず、各自判断でミスが増える"
            value={step.mechanism}
            onChange={e => updateWhyStep(currentStep, 'mechanism', e.target.value)}
            className="w-full p-3 border border-slate-200 rounded-lg text-sm bg-white text-slate-900"
          />
          <p className="text-xs text-slate-500 mt-1">
            それがなぜ直前の原因を起こすのか、簡潔に
          </p>
        </div>

        {/* Evidence - 必須（仮説OFF時） */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-amber-800">
              Evidence（根拠）
              {!step.isHypothesis && <span className="text-rose-500">*必須</span>}
            </label>
            <label className="flex items-center gap-2 text-xs font-bold text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                checked={step.isHypothesis}
                onChange={e => updateWhyStep(currentStep, 'isHypothesis', e.target.checked)}
                className="accent-amber-600"
              />
              <HelpCircle size={14} />
              仮説（根拠が弱い）
            </label>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1">Data（数値/ログ）</label>
            <input
              type="text"
              placeholder="例：エラーログ23件、返品率5%上昇"
              value={step.evidence.data}
              onChange={e => updateEvidence(currentStep, 'data', e.target.value)}
              className="w-full p-2 border border-amber-200 rounded text-sm bg-white text-slate-900"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1">Example（具体例）</label>
            <input
              type="text"
              placeholder="例：先週A社案件で同じミス3回発生"
              value={step.evidence.example}
              onChange={e => updateEvidence(currentStep, 'example', e.target.value)}
              className="w-full p-2 border border-amber-200 rounded text-sm bg-white text-slate-900"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1">Observation（現場観測）</label>
            <input
              type="text"
              placeholder="例：営業部ヒアリングで全員が指摘"
              value={step.evidence.observation}
              onChange={e => updateEvidence(currentStep, 'observation', e.target.value)}
              className="w-full p-2 border border-amber-200 rounded text-sm bg-white text-slate-900"
            />
          </div>

          {!step.isHypothesis && !hasAnyEvidence(step) && (
            <div className="flex items-center gap-2 text-xs text-rose-600">
              <AlertCircle size={14} />
              <span>根拠を最低1つ入力してください（仮説ONなら任意）</span>
            </div>
          )}
        </div>

        {/* Cause Type - 必須 */}
        <div>
          <label className="text-sm font-bold text-slate-700 block mb-2">
            Cause Type（原因カテゴリ）<span className="text-rose-500">*必須</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(CAUSE_TYPE_LABELS).map(([type, label]) => (
              <button
                key={type}
                type="button"
                onClick={() => updateWhyStep(currentStep, 'causeType', type as CauseType)}
                className={`p-2 rounded-lg text-sm font-bold transition-colors ${
                  step.causeType === type
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Confidence - 必須 */}
        <div>
          <label className="text-sm font-bold text-slate-700 block mb-2">
            Confidence（確信度）<span className="text-rose-500">*必須</span>
            <span className="text-indigo-600 font-bold ml-2">{step.confidence}%</span>
          </label>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={step.confidence}
            onChange={e => updateWhyStep(currentStep, 'confidence', parseInt(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>低い</span>
            <span>中程度</span>
            <span>高い</span>
          </div>
        </div>

        {/* Controllability - Why4/5で必須 */}
        {isWhy4or5 && (
          <div>
            <label className="text-sm font-bold text-slate-700 block mb-2">
              Controllability（制御可能性）<span className="text-rose-500">*必須（Why4/5）</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(CONTROLLABILITY_LABELS).map(([level, label]) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => updateWhyStep(currentStep, 'controllability', level as Controllability)}
                  className={`p-2 rounded-lg text-sm font-bold transition-colors ${
                    step.controllability === level
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            {step.controllability === Controllability.LOW && (
              <div className="flex items-center gap-2 text-xs text-amber-600 mt-2">
                <AlertCircle size={14} />
                <span>制御可能性が低い場合、さらに深掘りを推奨します</span>
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          {currentStep > 0 && (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep - 1)}
              className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-slate-900"
            >
              ← Why {whyNumber - 1}に戻る
            </button>
          )}
          <div className="flex-1" />
          <button
            type="button"
            onClick={handleNext}
            disabled={!canProceedToNext()}
            className={`px-6 py-3 rounded-lg text-sm font-bold ${
              canProceedToNext()
                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            {currentStep === 4 ? '最終まとめへ →' : `Why ${whyNumber + 1}へ →`}
          </button>
        </div>
      </div>
    );
  };

  const renderSummaryForm = () => {
    const canSubmit = summary.rootCause.trim() && summary.oneAction.trim() && summary.successMetric.trim();

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
          <h3 className="text-lg font-bold text-emerald-900 flex items-center gap-2">
            <CheckCircle size={20} />
            最終まとめ（Root Cause Summary）
          </h3>
          <p className="text-sm text-emerald-700 mt-1">
            Why5までの分析を踏まえ、根本原因と対策を整理してください
          </p>
        </div>

        {/* Root Cause - 必須 */}
        <div>
          <label className="text-sm font-bold text-slate-700 block mb-1">
            Root Cause（根本原因の要約）<span className="text-rose-500">*必須</span>
          </label>
          <input
            type="text"
            placeholder="例：作業手順の標準化がなく、属人化している"
            value={summary.rootCause}
            onChange={e => setSummary({ ...summary, rootCause: e.target.value })}
            className="w-full p-3 border border-slate-300 rounded-lg text-sm bg-white text-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
          <p className="text-xs text-slate-500 mt-1">1行で簡潔に</p>
        </div>

        {/* One Action - 必須 */}
        <div>
          <label className="text-sm font-bold text-slate-700 block mb-1">
            One Action（対策を1つだけ）<span className="text-rose-500">*必須</span>
          </label>
          <input
            type="text"
            placeholder="例：作業手順書を作成し、全員に共有・研修を実施"
            value={summary.oneAction}
            onChange={e => setSummary({ ...summary, oneAction: e.target.value })}
            className="w-full p-3 border border-slate-300 rounded-lg text-sm bg-white text-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
          <p className="text-xs text-slate-500 mt-1">
            最も効果的な対策1つに絞る（複数書かない）
          </p>
        </div>

        {/* Success Metric - 必須 */}
        <div>
          <label className="text-sm font-bold text-slate-700 block mb-1">
            Success Metric（検証指標）<span className="text-rose-500">*必須</span>
          </label>
          <input
            type="text"
            placeholder="例：3ヶ月後にミス発生率が50%減少"
            value={summary.successMetric}
            onChange={e => setSummary({ ...summary, successMetric: e.target.value })}
            className="w-full p-3 border border-slate-300 rounded-lg text-sm bg-white text-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
          <p className="text-xs text-slate-500 mt-1">
            何がどうなったら成功か、計測可能な指標で
          </p>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={() => setCurrentStep(4)}
            className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-slate-900"
          >
            ← Why 5に戻る
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={`px-6 py-3 rounded-lg text-sm font-bold ${
              canSubmit
                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            分析結果を提出
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="max-h-[70vh] overflow-y-auto">
      {/* Progress Indicator */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          {[1, 2, 3, 4, 5].map(i => (
            <div
              key={i}
              className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold ${
                i - 1 < currentStep
                  ? 'bg-indigo-600 text-white'
                  : i - 1 === currentStep
                  ? 'bg-indigo-100 text-indigo-600 ring-2 ring-indigo-600'
                  : 'bg-slate-100 text-slate-400'
              }`}
            >
              {i}
            </div>
          ))}
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold ${
              currentStep === 5
                ? 'bg-emerald-600 text-white ring-2 ring-emerald-600'
                : currentStep > 4
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 text-slate-400'
            }`}
          >
            <CheckCircle size={20} />
          </div>
        </div>
        <div className="text-xs text-center text-slate-500">
          {currentStep < 5 ? `Why ${currentStep + 1} / 5` : '最終まとめ'}
        </div>
      </div>

      {/* Form Content */}
      {currentStep < 5 ? renderWhyStepForm() : renderSummaryForm()}
    </div>
  );
};
