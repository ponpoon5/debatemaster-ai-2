import React, { useState } from 'react';
import { CheckCircle2, Sparkles, RefreshCcw } from 'lucide-react';
import { Button } from '../Button';

interface MECEInputFormProps {
  onSubmitAxis: (axis: string) => void;
  onSubmitElements: (axis: string, elements: string[]) => void;
  axisApproved: boolean;
  currentAxis: string | null;
  isRewrite: boolean;
  onRewriteChange: (isRewrite: boolean) => void;
  onResetAxis?: () => void; // 軸リセット用のコールバック
}

type AxisTemplate = {
  name: string;
  label: string;
  description: string;
  example: string;
};

const AXIS_TEMPLATES: AxisTemplate[] = [
  {
    name: '時系列',
    label: '時系列',
    description: '時間の流れで分解',
    example: '過去 / 現在 / 未来',
  },
  {
    name: 'ステークホルダー',
    label: 'ステークホルダー',
    description: '関係者の視点で分解',
    example: '顧客 / 従業員 / 株主 / 社会',
  },
  {
    name: '4P',
    label: '4P',
    description: 'マーケティングの4P',
    example: 'Product / Price / Place / Promotion',
  },
  {
    name: '機能別',
    label: '機能別',
    description: '組織機能で分解',
    example: '開発 / 営業 / 人事 / 財務',
  },
  {
    name: 'チャネル',
    label: 'チャネル',
    description: '接点・経路で分解',
    example: 'オンライン / オフライン / ハイブリッド',
  },
  {
    name: 'カスタム',
    label: 'カスタム',
    description: '自由に軸を設定',
    example: '独自の切り口を入力',
  },
];

export const MECEInputForm: React.FC<MECEInputFormProps> = ({
  onSubmitAxis,
  onSubmitElements,
  axisApproved,
  currentAxis,
  isRewrite,
  onRewriteChange,
  onResetAxis,
}) => {
  const [axisInput, setAxisInput] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [elements, setElements] = useState<string[]>(['', '', '', '']);

  console.log('🎯 MECEInputForm State - axisApproved:', axisApproved, 'currentAxis:', currentAxis);

  const handleTemplateSelect = (template: AxisTemplate) => {
    setSelectedTemplate(template.name);
    if (template.name !== 'カスタム') {
      setAxisInput(template.name);
    }
  };

  const handleAxisSubmit = () => {
    if (!axisInput.trim()) return;
    onSubmitAxis(axisInput.trim());
  };

  const handleElementsSubmit = () => {
    const filledElements = elements.filter(e => e.trim() !== '');
    if (filledElements.length === 0) return;
    onSubmitElements(currentAxis || axisInput, filledElements);
  };

  const handleResetAxis = () => {
    setAxisInput('');
    setSelectedTemplate(null);
    setElements(['', '', '', '']);
    onRewriteChange(false);
    onResetAxis?.(); // 親コンポーネントの状態もリセット
  };

  return (
    <div className="space-y-4">
      {/* Rewrite Checkbox */}
      <div className="flex items-center justify-end">
        <label className="flex items-center gap-2 text-xs font-bold text-indigo-600 cursor-pointer select-none bg-indigo-50 px-3 py-1.5 rounded-full hover:bg-indigo-100 transition-colors">
          <input
            type="checkbox"
            checked={isRewrite}
            onChange={e => onRewriteChange(e.target.checked)}
            className="accent-indigo-600 rounded"
          />
          <RefreshCcw size={12} />
          2回目(書き直し)として提出
        </label>
      </div>

      {!axisApproved ? (
        /* Phase 1: Axis Selection and Input */
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-2">
              <Sparkles size={16} className="text-amber-600 mt-0.5 shrink-0" />
              <div className="text-xs text-amber-800">
                <p className="font-bold mb-1">まずは「軸」を1つに固定しよう！</p>
                <p className="text-amber-700">
                  MECEの肝は「切り口（軸）の明確さ」。下のテンプレートから選ぶか、独自の軸を入力してください。
                </p>
              </div>
            </div>
          </div>

          {/* Axis Templates */}
          <div>
            <label className="text-xs font-bold text-slate-600 block mb-2">
              軸テンプレートを選択 (Template)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {AXIS_TEMPLATES.map(template => (
                <button
                  key={template.name}
                  onClick={() => handleTemplateSelect(template)}
                  className={`p-3 rounded-lg border-2 text-left transition-all ${
                    selectedTemplate === template.name
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-slate-200 bg-white hover:border-indigo-300'
                  }`}
                >
                  <div className="font-bold text-sm text-slate-800 mb-0.5">{template.label}</div>
                  <div className="text-xs text-slate-500 mb-1">{template.description}</div>
                  <div className="text-xs text-indigo-600 font-mono">{template.example}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Axis Input Field */}
          <div>
            <label className="text-xs font-bold text-indigo-600 block mb-1">
              切り口・軸 (The Axis) <span className="text-rose-500">*必須</span>
            </label>
            <input
              value={axisInput}
              onChange={e => setAxisInput(e.target.value)}
              placeholder="例：獲得チャネル、年齢層、プロセス、地域別..."
              className="w-full p-3 bg-white border-2 border-indigo-300 rounded-lg text-sm font-bold text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
            />
            <p className="text-xs text-slate-500 mt-1">
              ヒント: 「名詞1語 + 観点ラベル」で統一すると明確になります
            </p>
          </div>

          {/* Submit Axis Button */}
          <Button
            onClick={handleAxisSubmit}
            disabled={!axisInput.trim()}
            fullWidth
            className="bg-amber-600 text-white hover:bg-amber-700 h-12 text-base shadow-md disabled:bg-slate-300 disabled:cursor-not-allowed"
          >
            <CheckCircle2 size={18} className="mr-2" />
            軸をチェックしてもらう
          </Button>

          <div className="text-xs text-slate-500 text-center">
            軸が承認されたら、次のステップで要素を入力できます
          </div>
        </div>
      ) : (
        /* Phase 2: Elements Input (after axis approval) */
        <div className="space-y-4">
          {/* Approved Axis Display */}
          <div className="bg-emerald-50 border-2 border-emerald-300 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 size={18} className="text-emerald-600" />
              <span className="text-xs font-bold text-emerald-800">軸が承認されました！</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xs text-emerald-700">承認された軸:</span>
              <span className="text-base font-bold text-emerald-900">{currentAxis}</span>
            </div>
            <button
              onClick={handleResetAxis}
              className="mt-2 text-xs text-emerald-700 hover:text-emerald-900 underline"
            >
              軸を変更する（最初からやり直す）
            </button>
          </div>

          {/* Elements Input */}
          <div>
            <label className="text-xs font-bold text-slate-600 block mb-2">
              「{currentAxis}」の軸で分解した要素 (Elements)
            </label>
            <div className="space-y-2">
              {elements.map((element, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-xs font-bold text-indigo-500 w-6 shrink-0">
                    {index + 1}.
                  </span>
                  <input
                    value={element}
                    onChange={e => {
                      const newElements = [...elements];
                      newElements[index] = e.target.value;
                      setElements(newElements);
                    }}
                    placeholder={`要素 ${index + 1}${index === 0 ? ' (最低1つは必須)' : ''}`}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none"
                  />
                </div>
              ))}
            </div>
            <button
              onClick={() => setElements([...elements, ''])}
              className="mt-2 text-xs text-indigo-600 hover:text-indigo-800 font-bold"
            >
              + 要素を追加
            </button>
          </div>

          {/* Submit Elements Button */}
          <Button
            onClick={handleElementsSubmit}
            disabled={elements.filter(e => e.trim() !== '').length === 0}
            fullWidth
            className="bg-indigo-600 text-white hover:bg-indigo-700 h-12 text-lg shadow-lg disabled:bg-slate-300 disabled:cursor-not-allowed"
          >
            {isRewrite ? '修正案を提出 (Challenge)' : '分析結果を提出'}
          </Button>
        </div>
      )}
    </div>
  );
};
