import React, { useState, useEffect } from 'react';
import { X, Wand2, Swords } from 'lucide-react';
import { Button } from '../Button';
import { RebuttalTemplate } from '../../core/types';

interface ArgumentBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (text: string) => void;
  rebuttalTemplate?: RebuttalTemplate;
  initialMode?: 'builder' | 'rebuttal';
}

export const ArgumentBuilderModal: React.FC<ArgumentBuilderModalProps> = ({
  isOpen,
  onClose,
  onSend,
  rebuttalTemplate,
  initialMode = 'builder',
}) => {
  const [mode, setMode] = useState<'builder' | 'rebuttal'>(initialMode);

  // Standard Builder State
  const [state, setState] = useState({ claim: '', data: '', warrant: '' });

  // Rebuttal Card State
  const [rebuttalState, setRebuttalState] = useState<Record<string, string>>({});

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode, isOpen]);

  useEffect(() => {
    // Prefill rebuttal state if template provided
    if (rebuttalTemplate && mode === 'rebuttal') {
      const initial: Record<string, string> = {};
      rebuttalTemplate.fields.forEach(f => {
        if (f.hint) initial[f.id] = f.hint; // Optional: can be annoying if auto-filled, maybe just placeholder
      });
      // We won't auto-fill value, just use hint as placeholder or helper text
    }
  }, [rebuttalTemplate, mode]);

  if (!isOpen) return null;

  const handleSendStandard = () => {
    if (!state.claim.trim()) return;

    let message = state.claim.trim();
    if (message && !['。', '！', '？', '.', '!', '?'].includes(message.slice(-1))) message += '。';

    if (state.data.trim()) {
      message += `\nその理由は、${state.data.trim()}`;
      if (!['。', '！', '？'].some(end => state.data.trim().endsWith(end))) message += 'からです。';
    }

    if (state.warrant.trim()) {
      message += `\nすなわち、${state.warrant.trim()}`;
      if (!['。', '！', '？'].some(end => state.warrant.trim().endsWith(end)))
        message += 'と言えます。';
    }

    onSend(message);
    setState({ claim: '', data: '', warrant: '' });
    onClose();
  };

  const handleSendRebuttal = () => {
    if (!rebuttalTemplate) return;
    // Simple concatenation for now, can be smarter
    let message = '';
    rebuttalTemplate.fields.forEach((field, i) => {
      const val = rebuttalState[field.id]?.trim();
      if (val) {
        message += val;
        if (!['。', '！', '？', '\n'].includes(val.slice(-1))) message += '。\n';
        else message += '\n';
      }
    });
    if (message.trim()) {
      onSend(message.trim());
      setRebuttalState({});
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 animate-pop-in max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2">
            <button
              onClick={() => setMode('builder')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${mode === 'builder' ? 'bg-blue-100 text-blue-700' : 'text-slate-500 hover:bg-slate-100'}`}
            >
              <Wand2 size={14} className="inline mr-1" />
              論理構築
            </button>
            <button
              onClick={() => setMode('rebuttal')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${mode === 'rebuttal' ? 'bg-pink-100 text-pink-700' : 'text-slate-500 hover:bg-slate-100'}`}
            >
              <Swords size={14} className="inline mr-1" />
              反論カード
            </button>
          </div>
          <button onClick={onClose}>
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        {mode === 'builder' ? (
          <div className="space-y-4">
            <div className="bg-blue-50/50 p-3 rounded-lg text-xs text-slate-600 mb-2 border border-blue-100">
              各項目を入力すると、AIが自動的に接続詞（その理由は～、すなわち～）を補って自然な文章に整形して送信します。
            </div>
            <div>
              <label className="text-xs font-bold text-blue-600 block mb-1">
                Claim (主張・結論)
              </label>
              <input
                value={state.claim}
                onChange={e => setState({ ...state, claim: e.target.value })}
                className="w-full p-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm bg-white text-slate-900"
                placeholder="例：私は、週休3日制を導入すべきだと考えます"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-green-600 block mb-1">
                Data (理由・事実)
              </label>
              <input
                value={state.data}
                onChange={e => setState({ ...state, data: e.target.value })}
                className="w-full p-3 rounded-lg border border-slate-300 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none text-sm bg-white text-slate-900"
                placeholder="例：生産性が40%向上したというデータがある"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-amber-600 block mb-1">
                Warrant (論拠・つなぎ)
              </label>
              <input
                value={state.warrant}
                onChange={e => setState({ ...state, warrant: e.target.value })}
                className="w-full p-3 rounded-lg border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 outline-none text-sm bg-white text-slate-900"
                placeholder="例：十分な休息こそが、質の高い仕事につながる"
              />
            </div>
            <Button
              onClick={handleSendStandard}
              fullWidth
              className="mt-2 h-12 text-lg font-bold shadow-md"
            >
              文章を作成して送信
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {rebuttalTemplate ? (
              <>
                <div className="bg-pink-50/50 p-3 rounded-lg text-xs text-pink-800 mb-2 border border-pink-100">
                  <span className="font-bold block mb-1">🎯 {rebuttalTemplate.title}</span>
                  ヒントを参考に、空欄を埋めて反論を完成させましょう。
                </div>
                {rebuttalTemplate.fields.map(field => (
                  <div key={field.id}>
                    <label className="text-xs font-bold text-slate-600 block mb-1">
                      {field.label}
                    </label>
                    {field.hint && (
                      <div className="text-[10px] text-pink-600 mb-1 flex items-center gap-1">
                        <Wand2 size={10} />
                        <span>Hint: {field.hint}</span>
                      </div>
                    )}
                    <textarea
                      value={rebuttalState[field.id] || ''}
                      onChange={e =>
                        setRebuttalState({ ...rebuttalState, [field.id]: e.target.value })
                      }
                      className="w-full p-3 rounded-lg border border-slate-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-100 outline-none text-sm min-h-[60px] bg-white text-slate-900"
                      placeholder={field.placeholder}
                    />
                  </div>
                ))}
                <Button
                  onClick={handleSendRebuttal}
                  fullWidth
                  className="mt-2 h-12 text-lg font-bold shadow-md bg-gradient-to-r from-pink-600 to-rose-600"
                >
                  反論を送信
                </Button>
              </>
            ) : (
              <div className="text-center py-8 text-slate-400">
                <p>
                  現在、利用可能な反論テンプレートがありません。
                  <br />
                  戦略ナビゲーターを実行してください。
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
