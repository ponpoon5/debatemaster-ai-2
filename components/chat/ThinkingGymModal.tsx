import React, { useState } from 'react';
import { X, BrainCircuit, Dices, PenTool, ArrowRight, RefreshCcw } from 'lucide-react';
import { Button } from '../Button';
import { ThinkingFramework } from '../../core/types';

interface ThinkingGymModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (text: string) => void;
  framework?: ThinkingFramework;
  initialTab?: 'ai_topic' | 'custom_topic';
}

type Tab = 'ai_topic' | 'custom_topic';

export const ThinkingGymModal: React.FC<ThinkingGymModalProps> = ({
  isOpen,
  onClose,
  onSend,
  framework,
  initialTab,
}) => {
  const [activeTab, setActiveTab] = useState<Tab>(initialTab || 'ai_topic');
  const [gymState, setGymState] = useState<Record<string, string>>({});
  const [customTopic, setCustomTopic] = useState('');
  const [isRewrite, setIsRewrite] = useState(false);

  if (!isOpen) return null;

  const handleRequestAiTopic = () => {
    onSend('課題の自動作成をお願いします。');
    onClose();
  };

  const handleSendAnalysis = () => {
    let finalMessage = '';
    const s = gymState;
    const header = isRewrite ? '[GYM_REWRITE] (再提出)\n' : '';
    const topicHeader =
      activeTab === 'custom_topic' && customTopic ? `【テーマ: ${customTopic}】\n` : '';

    let body = '';

    switch (framework) {
      case ThinkingFramework.SWOT:
        if (!s.swot_s && !s.swot_w && !s.swot_o && !s.swot_t) return;
        body = `【SWOT分析】\n\n[Strengths (強み)]\n${s.swot_s || '-'}\n\n[Weaknesses (弱み)]\n${s.swot_w || '-'}\n\n[Opportunities (機会)]\n${s.swot_o || '-'}\n\n[Threats (脅威)]\n${s.swot_t || '-'}`;
        break;
      case ThinkingFramework.PEST:
        if (!s.pest_p && !s.pest_e && !s.pest_s && !s.pest_t) return;
        body = `【PEST分析】\n\n[Politics (政治)]\n${s.pest_p || '-'}\n\n[Economy (経済)]\n${s.pest_e || '-'}\n\n[Society (社会)]\n${s.pest_s || '-'}\n\n[Technology (技術)]\n${s.pest_t || '-'}`;
        break;
      case ThinkingFramework.FIVE_WHYS:
        if (!s.why_problem) return;
        body = `【なぜなぜ分析】\n\n[問題] ${s.why_problem}\n\n1. Why? ${s.why_1 || ''}\n2. Why? ${s.why_2 || ''}\n3. Why? ${s.why_3 || ''}\n4. Why? ${s.why_4 || ''}\n5. Why? ${s.why_5 || ''}`;
        break;
      case ThinkingFramework.MECE:
        if (!s.mece_axis && !s.mece_1) return;
        body = `【MECE分解】\n\n[テーマ] ${customTopic || '(AI課題)'}\n[切り口・軸] ${s.mece_axis || '-'}\n\n[要素分解]\n・${s.mece_1 || ''}\n・${s.mece_2 || ''}\n・${s.mece_3 || ''}\n・${s.mece_4 || ''}`;
        break;
      case ThinkingFramework.LOGIC_TREE:
        if (!s.tree_root) return;
        body = `【ロジックツリー】\n\n[課題・テーマ] ${s.tree_root}\n\n[分解・解決策]\n├ ${s.tree_1 || ''}\n├ ${s.tree_2 || ''}\n└ ${s.tree_3 || ''}`;
        break;
      case ThinkingFramework.META_COGNITION:
        if (!s.meta_thought) return;
        body = `【メタ認知・バイアスチェック】\n\n[自分の思考・感情] ${s.meta_thought}\n\n[客観的事実] ${s.meta_fact || '-'}\n\n[別の捉え方(リフレーミング)] ${s.meta_reframing || '-'}`;
        break;
      default:
        return;
    }

    finalMessage = header + topicHeader + body;
    onSend(finalMessage);

    if (!isRewrite) {
      setGymState({});
      setCustomTopic('');
    }
    onClose();
  };

  const getFrameworkLabel = () => {
    switch (framework) {
      case ThinkingFramework.SWOT:
        return 'SWOT分析';
      case ThinkingFramework.PEST:
        return 'PEST分析';
      case ThinkingFramework.FIVE_WHYS:
        return 'なぜなぜ分析';
      case ThinkingFramework.MECE:
        return 'MECE';
      case ThinkingFramework.LOGIC_TREE:
        return 'ロジックツリー';
      case ThinkingFramework.META_COGNITION:
        return 'メタ認知';
      default:
        return '';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-pop-in border border-indigo-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-indigo-50 px-6 py-4 flex justify-between items-center border-b border-indigo-100">
          <div>
            <h3 className="font-bold text-indigo-800 flex items-center gap-2 text-lg">
              <BrainCircuit size={24} />
              {getFrameworkLabel()}
            </h3>
            <p className="text-xs text-indigo-600 font-medium">思考の筋トレ・ジム</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-indigo-100 rounded-full text-indigo-400 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* Mode Selection Tabs */}
            <div className="flex bg-slate-100 p-1 rounded-lg mb-6">
              <button
                onClick={() => setActiveTab('ai_topic')}
                className={`flex-1 py-2 text-xs font-bold rounded-md flex items-center justify-center gap-2 transition-all ${activeTab === 'ai_topic' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <Dices size={14} /> AI課題に挑戦
              </button>
              <button
                onClick={() => setActiveTab('custom_topic')}
                className={`flex-1 py-2 text-xs font-bold rounded-md flex items-center justify-center gap-2 transition-all ${activeTab === 'custom_topic' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <PenTool size={14} /> 自分でテーマ設定
              </button>
            </div>

            {activeTab === 'ai_topic' && (
              <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-6 text-center mb-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm text-indigo-500">
                  <Dices size={24} />
                </div>
                <h4 className="font-bold text-slate-800 mb-2">AIが課題を出題します</h4>
                <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                  「{getFrameworkLabel()}」の練習に最適なテーマをランダムに生成します。
                  <br />
                  まずは課題を受け取り、その後に回答を入力しましょう。
                </p>
                <Button
                  onClick={handleRequestAiTopic}
                  fullWidth
                  className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md"
                >
                  AIに課題を自動作成してもらう <ArrowRight size={16} className="ml-2" />
                </Button>
              </div>
            )}

            {activeTab === 'custom_topic' && (
              <div className="mb-6">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  分析するテーマ (Theme)
                </label>
                <input
                  value={customTopic}
                  onChange={e => setCustomTopic(e.target.value)}
                  placeholder="例：自分自身のキャリア、地元の商店街の再生..."
                  className="w-full p-3 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none text-sm bg-white text-slate-900"
                />
              </div>
            )}

            {/* Input Form Area - Always visible regardless of tab */}
            <div className="flex items-center justify-between mb-4 mt-8 border-t border-slate-100 pt-6">
              <span className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <PenTool size={16} className="text-indigo-500" />
                分析・回答入力
              </span>
              <label className="flex items-center gap-2 text-xs font-bold text-indigo-600 cursor-pointer select-none bg-indigo-50 px-3 py-1.5 rounded-full hover:bg-indigo-100 transition-colors">
                <input
                  type="checkbox"
                  checked={isRewrite}
                  onChange={e => setIsRewrite(e.target.checked)}
                  className="accent-indigo-600 rounded"
                />
                <RefreshCcw size={12} />
                2回目(書き直し)として提出
              </label>
            </div>

            <div className="space-y-4">
              {framework === ThinkingFramework.SWOT && (
                <>
                  <div>
                    <label className="text-xs font-bold text-indigo-600 block mb-1">
                      Strengths (強み・内部要因)
                    </label>
                    <input
                      placeholder="他より優れている点、持っている資源..."
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:border-indigo-400 transition-colors text-slate-900"
                      onChange={e => setGymState({ ...gymState, swot_s: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-rose-600 block mb-1">
                      Weaknesses (弱み・内部要因)
                    </label>
                    <input
                      placeholder="不足している点、改善すべき点..."
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:border-rose-400 transition-colors text-slate-900"
                      onChange={e => setGymState({ ...gymState, swot_w: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-emerald-600 block mb-1">
                      Opportunities (機会・外部要因)
                    </label>
                    <input
                      placeholder="活用できるトレンド、市場の変化..."
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:border-emerald-400 transition-colors text-slate-900"
                      onChange={e => setGymState({ ...gymState, swot_o: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-amber-600 block mb-1">
                      Threats (脅威・外部要因)
                    </label>
                    <input
                      placeholder="障害となる競合、環境変化..."
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:border-amber-400 transition-colors text-slate-900"
                      onChange={e => setGymState({ ...gymState, swot_t: e.target.value })}
                    />
                  </div>
                </>
              )}

              {framework === ThinkingFramework.PEST && (
                <>
                  <input
                    placeholder="Politics (政治・法律・規制)"
                    className="w-full p-3 bg-white border border-slate-200 rounded-lg text-sm focus:border-indigo-400 transition-colors text-slate-900"
                    onChange={e => setGymState({ ...gymState, pest_p: e.target.value })}
                  />
                  <input
                    placeholder="Economy (経済・景気・物価)"
                    className="w-full p-3 bg-white border border-slate-200 rounded-lg text-sm focus:border-indigo-400 transition-colors text-slate-900"
                    onChange={e => setGymState({ ...gymState, pest_e: e.target.value })}
                  />
                  <input
                    placeholder="Society (社会・流行・人口)"
                    className="w-full p-3 bg-white border border-slate-200 rounded-lg text-sm focus:border-indigo-400 transition-colors text-slate-900"
                    onChange={e => setGymState({ ...gymState, pest_s: e.target.value })}
                  />
                  <input
                    placeholder="Technology (技術・革新)"
                    className="w-full p-3 bg-white border border-slate-200 rounded-lg text-sm focus:border-indigo-400 transition-colors text-slate-900"
                    onChange={e => setGymState({ ...gymState, pest_t: e.target.value })}
                  />
                </>
              )}

              {framework === ThinkingFramework.FIVE_WHYS && (
                <>
                  <div className="mb-4">
                    <label className="text-xs font-bold text-slate-500 block mb-1">
                      発生している問題 (Problem)
                    </label>
                    <input
                      placeholder="例：工場のラインが停止した"
                      className="w-full p-3 border border-slate-300 rounded-lg text-sm font-bold bg-white text-slate-900"
                      onChange={e => setGymState({ ...gymState, why_problem: e.target.value })}
                    />
                  </div>
                  <div className="space-y-3 pl-2 border-l-2 border-slate-100">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div key={i} className="flex gap-2 items-center">
                        <span className="font-bold text-xs text-indigo-500 w-6 shrink-0 text-right">
                          Why {i}
                        </span>
                        <input
                          placeholder={`なぜ？ (原因 ${i})`}
                          className="w-full p-2 bg-white border border-slate-200 rounded text-sm focus:border-indigo-400 text-slate-900"
                          onChange={e => setGymState({ ...gymState, [`why_${i}`]: e.target.value })}
                        />
                      </div>
                    ))}
                  </div>
                </>
              )}

              {framework === ThinkingFramework.MECE && (
                <>
                  <div>
                    <label className="text-xs font-bold text-indigo-600 block mb-1">
                      切り口・軸 (The Axis)
                    </label>
                    <input
                      placeholder="例：年齢別、地域別、プロセス別..."
                      className="w-full p-2.5 bg-white border border-indigo-200 rounded-lg text-sm font-medium text-slate-900"
                      onChange={e => setGymState({ ...gymState, mece_axis: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 block">
                      分解した要素 (Elements)
                    </label>
                    {[1, 2, 3, 4].map(i => (
                      <input
                        key={i}
                        placeholder={`要素 ${i}`}
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-900"
                        onChange={e => setGymState({ ...gymState, [`mece_${i}`]: e.target.value })}
                      />
                    ))}
                  </div>
                </>
              )}

              {framework === ThinkingFramework.LOGIC_TREE && (
                <>
                  <input
                    placeholder="Root: 解決したい課題・テーマ"
                    className="w-full p-3 border border-slate-300 rounded-lg text-sm font-bold bg-white text-slate-900"
                    onChange={e => setGymState({ ...gymState, tree_root: e.target.value })}
                  />
                  <div className="space-y-2 pl-4 border-l-2 border-indigo-100 ml-2 mt-2">
                    <span className="text-xs text-indigo-400 font-bold">
                      Branches (分解・解決策)
                    </span>
                    {[1, 2, 3].map(i => (
                      <input
                        key={i}
                        placeholder={`分岐 ${i}`}
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-900"
                        onChange={e => setGymState({ ...gymState, [`tree_${i}`]: e.target.value })}
                      />
                    ))}
                  </div>
                </>
              )}

              {framework === ThinkingFramework.META_COGNITION && (
                <>
                  <div>
                    <label className="text-xs font-bold text-rose-600 block mb-1">
                      自分の思考・感情 (Subjective)
                    </label>
                    <input
                      placeholder="「最悪だ」「もう無理だ」等..."
                      className="w-full p-3 bg-white border border-rose-200 rounded-lg text-sm text-slate-900"
                      onChange={e => setGymState({ ...gymState, meta_thought: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">
                      客観的事実 (Objective Fact)
                    </label>
                    <input
                      placeholder="実際に起きていること（数値や事実のみ）"
                      className="w-full p-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-900"
                      onChange={e => setGymState({ ...gymState, meta_fact: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-emerald-600 block mb-1">
                      リフレーミング (New Perspective)
                    </label>
                    <input
                      placeholder="別の捉え方、ポジティブな解釈"
                      className="w-full p-3 bg-white border border-emerald-200 rounded-lg text-sm text-slate-900"
                      onChange={e => setGymState({ ...gymState, meta_reframing: e.target.value })}
                    />
                  </div>
                </>
              )}
            </div>

            <div className="mt-6">
              <Button
                onClick={handleSendAnalysis}
                fullWidth
                className="bg-indigo-600 text-white hover:bg-indigo-700 h-12 text-lg shadow-lg"
              >
                {isRewrite ? '修正案を提出 (Challenge)' : '分析結果を提出'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
