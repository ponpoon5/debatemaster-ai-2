import React, { useState } from 'react';
import { X } from 'lucide-react';

interface CrossSWOTStrategy {
  name: string;
  rationale: string;
  action: string;
  expectedOutcome: string;
}

interface ApprovedSWOT {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

interface CrossSWOTModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (strategies: { so: CrossSWOTStrategy; wo: CrossSWOTStrategy; st: CrossSWOTStrategy; wt: CrossSWOTStrategy }) => void;
  approvedSWOT: ApprovedSWOT | null;
}

export const CrossSWOTModal: React.FC<CrossSWOTModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  approvedSWOT,
}) => {
  const [so, setSO] = useState<CrossSWOTStrategy>({
    name: '',
    rationale: '',
    action: '',
    expectedOutcome: '',
  });

  const [wo, setWO] = useState<CrossSWOTStrategy>({
    name: '',
    rationale: '',
    action: '',
    expectedOutcome: '',
  });

  const [st, setST] = useState<CrossSWOTStrategy>({
    name: '',
    rationale: '',
    action: '',
    expectedOutcome: '',
  });

  const [wt, setWT] = useState<CrossSWOTStrategy>({
    name: '',
    rationale: '',
    action: '',
    expectedOutcome: '',
  });

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSubmit({ so, wo, st, wt });
    onClose();
  };

  const isFormValid = () => {
    return [so, wo, st, wt].every(
      (strategy) =>
        strategy.name.trim() &&
        strategy.rationale.trim() &&
        strategy.action.trim() &&
        strategy.expectedOutcome.trim()
    );
  };

  const renderStrategyInput = (
    title: string,
    subtitle: string,
    color: string,
    strategy: CrossSWOTStrategy,
    setStrategy: React.Dispatch<React.SetStateAction<CrossSWOTStrategy>>,
    hintType: 'SO' | 'WO' | 'ST' | 'WT'
  ) => {
    // Generate contextual hint based on approved SWOT elements
    const generateHint = (): string => {
      if (!approvedSWOT) return '';

      const hasS = approvedSWOT.strengths.length > 0;
      const hasW = approvedSWOT.weaknesses.length > 0;
      const hasO = approvedSWOT.opportunities.length > 0;
      const hasT = approvedSWOT.threats.length > 0;

      switch (hintType) {
        case 'SO':
          if (hasS && hasO) {
            return `あなたの強み「${approvedSWOT.strengths[0]}」を活かして、機会「${approvedSWOT.opportunities[0]}」をどう掴むか考えましょう。`;
          }
          return '強みと機会を組み合わせて、積極的に攻める戦略を立てましょう。';

        case 'WO':
          if (hasW && hasO) {
            return `弱み「${approvedSWOT.weaknesses[0]}」を克服すれば、機会「${approvedSWOT.opportunities[0]}」を掴めるか考えましょう。`;
          }
          return '弱みを改善することで、新しい機会を活かせる戦略を立てましょう。';

        case 'ST':
          if (hasS && hasT) {
            return `強み「${approvedSWOT.strengths[0]}」を使って、脅威「${approvedSWOT.threats[0]}」をどう回避・無力化できるか考えましょう。`;
          }
          return '強みを活かして脅威を回避する差別化戦略を立てましょう。';

        case 'WT':
          if (hasW && hasT) {
            return `弱み「${approvedSWOT.weaknesses[0]}」と脅威「${approvedSWOT.threats[0]}」が重なる最悪シナリオを避ける方法を考えましょう。`;
          }
          return '弱みと脅威の組み合わせによる最悪の事態を防ぐ防衛策を立てましょう。';
      }
    };

    const hint = generateHint();

    return (
      <div className={`border-2 ${color} rounded-lg p-4 mb-4`}>
        <h3 className="font-bold text-lg mb-2">{title}</h3>
        <p className="text-sm text-slate-600 mb-3">{subtitle}</p>

        {/* Hint Display */}
        {hint && (
          <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs font-bold text-blue-900 mb-1">💡 戦略立案のヒント</p>
            <p className="text-xs text-blue-800">{hint}</p>
          </div>
        )}

        <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium mb-1">戦略名（1行）</label>
          <input
            type="text"
            value={strategy.name}
            onChange={(e) => setStrategy({ ...strategy, name: e.target.value })}
            placeholder="例: 独自技術で新市場に先行参入"
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            根拠（使用するSWOT要素）
          </label>
          <textarea
            value={strategy.rationale}
            onChange={(e) => setStrategy({ ...strategy, rationale: e.target.value })}
            placeholder="例: 独自技術（S）× 市場拡大（O）"
            rows={2}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            具体的なアクション（実行可能な施策）
          </label>
          <textarea
            value={strategy.action}
            onChange={(e) => setStrategy({ ...strategy, action: e.target.value })}
            placeholder="例: 新興国市場向けに製品をカスタマイズし、先行投資で市場シェアを獲得"
            rows={2}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            期待効果（この戦略でどうなるか）
          </label>
          <textarea
            value={strategy.expectedOutcome}
            onChange={(e) =>
              setStrategy({ ...strategy, expectedOutcome: e.target.value })
            }
            placeholder="例: 競合より早く市場シェア30%を確保し、業界スタンダードを確立"
            rows={2}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
    </div>
  );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              クロスSWOT戦略立案
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              承認されたSWOT分析を組み合わせて、4つの戦略を立案してください
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Approved SWOT Display */}
          {approvedSWOT && (
            <div className="bg-slate-50 rounded-lg p-4 mb-6">
              <h3 className="font-bold text-lg mb-3 text-slate-900">
                承認されたSWOT分析（参照用）
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 border border-green-200 rounded p-3">
                  <h4 className="font-semibold text-green-900 mb-2">
                    💪 Strengths（強み）
                  </h4>
                  <ul className="text-sm space-y-1">
                    {approvedSWOT.strengths.map((s, i) => (
                      <li key={i} className="text-green-800">
                        • {s}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                  <h4 className="font-semibold text-yellow-900 mb-2">
                    ⚠️ Weaknesses（弱み）
                  </h4>
                  <ul className="text-sm space-y-1">
                    {approvedSWOT.weaknesses.map((w, i) => (
                      <li key={i} className="text-yellow-800">
                        • {w}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded p-3">
                  <h4 className="font-semibold text-blue-900 mb-2">
                    🌟 Opportunities（機会）
                  </h4>
                  <ul className="text-sm space-y-1">
                    {approvedSWOT.opportunities.map((o, i) => (
                      <li key={i} className="text-blue-800">
                        • {o}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-red-50 border border-red-200 rounded p-3">
                  <h4 className="font-semibold text-red-900 mb-2">
                    ⚡ Threats（脅威）
                  </h4>
                  <ul className="text-sm space-y-1">
                    {approvedSWOT.threats.map((t, i) => (
                      <li key={i} className="text-red-800">
                        • {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Strategy Inputs */}
          <div className="space-y-4">
            {renderStrategyInput(
              'SO戦略（積極戦略）',
              'Strengths × Opportunities - 強みを活かして機会を最大化する攻めの戦略',
              'border-green-300',
              so,
              setSO,
              'SO'
            )}

            {renderStrategyInput(
              'WO戦略（改善戦略）',
              'Weaknesses × Opportunities - 弱みを克服して機会を掴む改善戦略',
              'border-blue-300',
              wo,
              setWO,
              'WO'
            )}

            {renderStrategyInput(
              'ST戦略（差別化戦略）',
              'Strengths × Threats - 強みを活かして脅威を回避・無力化する戦略',
              'border-orange-300',
              st,
              setST,
              'ST'
            )}

            {renderStrategyInput(
              'WT戦略（防衛/撤退戦略）',
              'Weaknesses × Threats - 弱みと脅威の最悪シナリオを回避する防衛策',
              'border-red-300',
              wt,
              setWT,
              'WT'
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex items-center justify-between">
          <p className="text-sm text-slate-600">
            {isFormValid()
              ? '✅ すべての戦略が入力されています'
              : '⚠️ すべての戦略（SO/WO/ST/WT）を入力してください'}
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              キャンセル
            </button>
            <button
              onClick={handleSubmit}
              disabled={!isFormValid()}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              戦略を送信
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
