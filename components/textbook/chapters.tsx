import React from 'react';
import { ArrowRight, Scale } from 'lucide-react';
import { ToulminLab } from './ToulminLab';
import { DefinitionLab } from './DefinitionLab';
import { TokenUsage } from '../../core/types';

export interface Chapter {
  id: number;
  title: string;
  description: string;
  content: React.ReactNode;
  lab?: React.ReactNode;
}

export const getChapters = (
  onTokenUpdate: (usage: TokenUsage) => void,
  weighingValue: number,
  setWeighingValue: (v: number) => void
): Chapter[] => [
  {
    id: 1,
    title: '第1章：主張の構造（Toulmin Model）',
    description: '論理的な主張を構成する基本要素（Claim, Data, Warrant）を学びます。',
    content: (
      <div className="space-y-6">
        <p className="text-slate-700 leading-relaxed">
          論理的な主張には「型」があります。Stephen
          Toulminが提唱した「トゥールミンモデル」は、説得力のある議論を組み立てるための世界標準のフレームワークです。
        </p>
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 overflow-hidden">
          <h4 className="font-bold text-slate-800 mb-6 text-center">Toulmin Modelの基本構造</h4>
          <div className="relative flex flex-col items-center gap-4">
            <div className="flex flex-col md:flex-row gap-8 items-center justify-center w-full">
              <div className="p-4 bg-white border-2 border-emerald-200 rounded-lg shadow-sm w-full md:w-1/3">
                <span className="text-xs font-bold text-emerald-600 block mb-1">DATA (事実)</span>
                <p className="text-sm">客観的な証拠、データ、事実。</p>
              </div>
              <ArrowRight className="text-slate-400 rotate-90 md:rotate-0" />
              <div className="p-4 bg-white border-2 border-blue-200 rounded-lg shadow-sm w-full md:w-1/3">
                <span className="text-xs font-bold text-blue-600 block mb-1">CLAIM (主張)</span>
                <p className="text-sm">結論、言いたいこと。</p>
              </div>
            </div>
            <div className="relative h-12 w-full flex justify-center">
              <div className="absolute top-0 h-full w-0.5 bg-slate-300"></div>
            </div>
            <div className="p-4 bg-white border-2 border-amber-200 rounded-lg shadow-sm w-full md:w-2/3 z-10">
              <span className="text-xs font-bold text-amber-600 block mb-1">WARRANT (論拠)</span>
              <p className="text-sm">
                データと主張をつなぐ理由付け。なぜそのデータからその結論が言えるのか？
              </p>
            </div>
          </div>
        </div>
      </div>
    ),
    lab: <ToulminLab onTokenUpdate={onTokenUpdate} />,
  },
  {
    id: 2,
    title: '第2章：反論の型（7 Attack Points）',
    description: '相手の主張を崩すための7つの攻撃ポイントを学びます。',
    content: (
      <div className="space-y-6">
        <p className="text-slate-700 leading-relaxed">
          効果的な反論を行うには、「なんとなく反対」するのではなく、論理の構造的な弱点を突く必要があります。
        </p>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: '1. Claim攻撃', desc: '結論そのものを否定する' },
            { name: '2. Reason攻撃', desc: '理由が結論を支えていないことを突く' },
            { name: '3. Evidence攻撃', desc: 'データの信憑性や古さを疑う' },
            { name: '4. Warrant攻撃', desc: '論理の飛躍（隠れた前提）を突く' },
            { name: '5. 定義攻撃', desc: '言葉の定義の曖昧さを突く' },
            { name: '6. 比重攻撃', desc: 'メリットよりデメリットが大きいと主張' },
            { name: '7. 論点ずらし指摘', desc: '相手が話題を逸らしたことを指摘' },
          ].map((item, i) => (
            <li
              key={i}
              className="p-3 bg-white border border-slate-200 rounded-lg text-sm transition-transform hover:scale-[1.02] cursor-default"
            >
              <span className="font-bold text-slate-800 block">{item.name}</span>
              <span className="text-slate-500 text-xs">{item.desc}</span>
            </li>
          ))}
        </ul>
      </div>
    ),
  },
  {
    id: 3,
    title: '第3章：重み付け技術（Weighing）',
    description: '価値が衝突した際に、どちらを優先すべきかを判断する技術です。',
    content: (
      <div className="space-y-6">
        <p className="text-slate-700 leading-relaxed">
          議論の最終局面では、双方の主張が正しい（メリットがある）場合があります。その際、「どちらがより重要か」を比較・評価する技術がWeighingです。
        </p>

        {/* Interactive Slider Demo */}
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
          <h4 className="font-bold text-slate-800 mb-4 text-center flex items-center justify-center gap-2">
            <Scale size={20} /> 重み付けシミュレーター
          </h4>
          <div className="space-y-6">
            <div className="flex justify-between items-end text-sm font-bold">
              <span
                className={`${weighingValue < 40 ? 'text-emerald-600 scale-110' : 'text-slate-500'} transition-all`}
              >
                環境保護 (Environment)
              </span>
              <span
                className={`${weighingValue > 60 ? 'text-blue-600 scale-110' : 'text-slate-500'} transition-all`}
              >
                経済成長 (Economy)
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={weighingValue}
              onChange={e => setWeighingValue(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-600"
            />
            <div className="text-center text-xs text-slate-600 bg-white p-3 rounded-lg border border-slate-100 min-h-[60px] flex items-center justify-center">
              {weighingValue < 40
                ? '「環境は一度破壊されると不可逆（Reversibility）であるため、経済より優先されるべきです。」'
                : weighingValue > 60
                  ? '「現在の貧困解決（Magnitude/Probability）が最優先であり、経済基盤なしに環境保護は不可能です。」'
                  : '「環境と経済のバランス（Balance）を取る、持続可能な発展モデルを模索します。」'}
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-100">
          <h4 className="font-bold text-slate-800 mb-2 text-sm">比較の4基準（Criteria）</h4>
          <ul className="list-disc pl-5 space-y-2 text-xs text-slate-700">
            <li>
              <strong>Magnitude (大きさ):</strong> 影響を受ける人数や金額の規模。
            </li>
            <li>
              <strong>Probability (確率):</strong> その事象が起きる可能性の高さ。
            </li>
            <li>
              <strong>Timeframe (時間軸):</strong> 短期的な利益か、長期的な持続性か。
            </li>
            <li>
              <strong>Reversibility (可逆性):</strong> 失敗したときに取り返しがつくか。
            </li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: 4,
    title: '第4章：定義闘争（Definition Battle）',
    description: '言葉の定義を制する者が議論を制します。',
    content: (
      <div className="space-y-6">
        <p className="text-slate-700 leading-relaxed">
          「自由」「正義」「成功」といった抽象的な言葉は、人によって解釈が異なります。自分の主張に有利な定義を設定し、相手に認めさせることが勝利への近道です。
        </p>
        <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
          <span className="font-bold text-yellow-800 block mb-1">ポイント</span>
          <p className="text-sm text-yellow-900">
            良い定義は「明確(Clear)」で、「中立的(Neutral)に見え」つつ、「測定可能(Measurable)」であるべきです。
          </p>
        </div>
      </div>
    ),
    lab: <DefinitionLab onTokenUpdate={onTokenUpdate} />,
  },
  {
    id: 5,
    title: '第5章：ソクラテス式質問法',
    description: '質問によって相手の矛盾を露呈させる技術です。',
    content: (
      <div className="space-y-6">
        <p className="text-slate-700 leading-relaxed">
          直接反論するのではなく、質問を繰り返すことで相手に自ら矛盾を気づかせたり、無知を露呈させる高度なテクニックです。
        </p>
        <div className="grid gap-3">
          <div className="p-3 bg-white border border-slate-200 rounded-lg">
            <span className="font-bold text-slate-700 text-sm">1. 明確化の質問</span>
            <p className="text-xs text-slate-500">「具体的にはどういう意味ですか？」</p>
          </div>
          <div className="p-3 bg-white border border-slate-200 rounded-lg">
            <span className="font-bold text-slate-700 text-sm">2. 前提を疑う質問</span>
            <p className="text-xs text-slate-500">
              「その主張は〇〇という前提に基づいていますか？」
            </p>
          </div>
          <div className="p-3 bg-white border border-slate-200 rounded-lg">
            <span className="font-bold text-slate-700 text-sm">3. 含意を問う質問</span>
            <p className="text-xs text-slate-500">
              「もしそうだとすると、〇〇という結果になりませんか？」
            </p>
          </div>
        </div>
      </div>
    ),
  },
];
