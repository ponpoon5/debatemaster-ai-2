import React, { useState, useEffect } from 'react';
import { Button } from '../Button';
import { Target, ListChecks, Users, Flag, Info } from 'lucide-react';

interface ActiveInoculationViewProps {
  data: {
    scenario: string;
    requiredFallacies: string[];
    targetAudience: string;
    objective: string;
  };
  onSubmit: (answer: string) => void;
}

// 詭弁の説明マップ
const FALLACY_DESCRIPTIONS: Record<string, string> = {
  'ストローマン (藁人形論法)': '相手の主張を歪めて、反論しやすい形に変えてから攻撃する手法。例: 「環境保護を主張する人は、経済発展を全く無視している」',
  'ストローマン（藁人形論法）': '相手の主張を歪めて、反論しやすい形に変えてから攻撃する手法。例: 「環境保護を主張する人は、経済発展を全く無視している」',
  '論点ずらし (Red Herring)': '本来の議論から注意をそらし、関係のない話題に誘導する手法。例: 「税金の話をしているのに、突然政治家のスキャンダルを持ち出す」',
  '論点ずらし（Red Herring）': '本来の議論から注意をそらし、関係のない話題に誘導する手法。例: 「税金の話をしているのに、突然政治家のスキャンダルを持ち出す」',
  '早急な一般化': '少数の事例から性急に全体的な結論を導く手法。例: 「私の友人2人が失敗したから、この方法は絶対にダメだ」',
  '誤った二分法': '実際には複数の選択肢があるのに、2つの極端な選択肢しかないように見せかける手法。例: 「この政策に賛成しないなら、あなたは国を愛していない」',
  '人身攻撃 (Ad Hominem)': '議論の内容ではなく、主張する人の人格や背景を攻撃する手法。例: 「あなたは専門家じゃないから、その意見は間違っている」',
  '人身攻撃（Ad Hominem）': '議論の内容ではなく、主張する人の人格や背景を攻撃する手法。例: 「あなたは専門家じゃないから、その意見は間違っている」',
  'お前だって論法 (Tu Quoque)': '相手も同じことをしているから自分も許されるという論法。例: 「あなただって遅刻したことあるでしょう？」',
  'お前だって論法（Tu Quoque）': '相手も同じことをしているから自分も許されるという論法。例: 「あなただって遅刻したことあるでしょう？」',
  '循環論法': '証明すべき結論を前提として使用する論法。例: 「この本は正しい。なぜならこの本にそう書いてあるから」',
  '権威への訴え': '権威ある人物や組織の名前を出すことで、主張を正当化しようとする手法。例: 「有名な教授がそう言っているから正しい」',
  '感情に訴える論証': '論理ではなく、恐怖・同情・怒りなどの感情に訴えて説得しようとする手法。例: 「子供たちの未来のために、今すぐこれを買わないと！」',
  'すべり坂論法 (Slippery Slope)': 'ある行動が連鎖的に悪い結果を招くと主張するが、その因果関係が不明確な論法。例: 「ゲームを許せば、次は深夜徘徊、最終的には犯罪者になる」',
  'すべり坂論法（Slippery Slope）': 'ある行動が連鎖的に悪い結果を招くと主張するが、その因果関係が不明確な論法。例: 「ゲームを許せば、次は深夜徘徊、最終的には犯罪者になる」',
};

// 詭弁名から説明を取得する関数（部分一致も許容）
const getFallacyDescription = (fallacyName: string): string => {
  // 完全一致を試す
  if (FALLACY_DESCRIPTIONS[fallacyName]) {
    return FALLACY_DESCRIPTIONS[fallacyName];
  }

  // 部分一致を試す（括弧の有無などに対応）
  for (const [key, value] of Object.entries(FALLACY_DESCRIPTIONS)) {
    if (key.includes(fallacyName) || fallacyName.includes(key.split('(')[0].trim()) || fallacyName.includes(key.split('（')[0].trim())) {
      return value;
    }
  }

  return 'この詭弁の説明は準備中です。一般的には論理的な誤りや不当な説得技法を指します。';
};

export const ActiveInoculationView: React.FC<ActiveInoculationViewProps> = React.memo(({ data, onSubmit }) => {
  const [userText, setUserText] = useState('');
  const [selectedFallacy, setSelectedFallacy] = useState<number | null>(null);

  useEffect(() => {
    setUserText('');
    setSelectedFallacy(null);
  }, [data]);

  return (
    <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 w-full">
      <h3 className="text-sm font-bold text-slate-400 uppercase mb-6 text-center tracking-wider">
        能動的接種演習 (Active Inoculation)
      </h3>

      {/* シナリオ */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl mb-6 border-2 border-purple-100">
        <h4 className="text-xs font-bold text-purple-600 uppercase mb-3 flex items-center gap-2">
          <Target size={16} />
          シナリオ
        </h4>
        <p className="text-lg text-slate-700 leading-relaxed">{data.scenario}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {/* 説得対象 */}
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
          <h4 className="text-xs font-bold text-blue-600 uppercase mb-2 flex items-center gap-2">
            <Users size={14} />
            説得対象
          </h4>
          <p className="text-sm font-semibold text-slate-700">{data.targetAudience}</p>
        </div>

        {/* 目標 */}
        <div className="bg-green-50 p-4 rounded-xl border border-green-100">
          <h4 className="text-xs font-bold text-green-600 uppercase mb-2 flex items-center gap-2">
            <Flag size={14} />
            目標
          </h4>
          <p className="text-sm font-semibold text-slate-700">{data.objective}</p>
        </div>
      </div>

      {/* 必須の詭弁 */}
      <div className="bg-rose-50 p-6 rounded-2xl mb-6 border-2 border-rose-100">
        <h4 className="text-xs font-bold text-rose-600 uppercase mb-3 flex items-center gap-2">
          <ListChecks size={16} />
          使用すべき詭弁・誤謬 (最低{data.requiredFallacies.length}つ)
        </h4>
        <p className="text-xs text-rose-600 mb-3">💡 クリックすると説明が表示されます</p>
        <div className="grid md:grid-cols-2 gap-2">
          {data.requiredFallacies.map((fallacy, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedFallacy(selectedFallacy === idx ? null : idx)}
              className={`bg-white px-4 py-2 rounded-lg text-sm font-semibold text-rose-700 border-2 shadow-sm transition-all text-left hover:shadow-md ${
                selectedFallacy === idx
                  ? 'border-rose-500 ring-2 ring-rose-200 bg-rose-50'
                  : 'border-rose-200 hover:border-rose-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <span>{idx + 1}. {fallacy}</span>
                <Info size={14} className="opacity-60" />
              </div>
            </button>
          ))}
        </div>

        {/* 選択された詭弁の説明 */}
        {selectedFallacy !== null && (
          <div className="mt-4 p-4 bg-white rounded-xl border-2 border-rose-300 animate-fade-in">
            <div className="flex items-start gap-3">
              <div className="bg-rose-100 p-2 rounded-lg shrink-0">
                <Info size={20} className="text-rose-600" />
              </div>
              <div>
                <h5 className="font-bold text-rose-800 mb-2">
                  {data.requiredFallacies[selectedFallacy]}
                </h5>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {getFallacyDescription(data.requiredFallacies[selectedFallacy])}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 注意事項 */}
      <div className="bg-amber-50 p-4 rounded-xl mb-6 border-l-4 border-amber-400">
        <p className="text-xs text-amber-800 font-medium leading-relaxed">
          ⚠️{' '}
          <strong>
            この演習の目的は「詭弁を見抜く力を養うこと」です。
          </strong>
          実際の議論やコミュニケーションでこれらの詭弁を使用することは推奨されません。
          詭弁の構造を理解することで、他者の不当な論理操作を識別する能力を高めましょう。
        </p>
      </div>

      {/* テキストエリア */}
      <div className="mb-6">
        <label className="block text-sm font-bold text-slate-700 mb-3">
          あなたの説得文 (メール、スピーチ、主張文など)
        </label>
        <textarea
          className="w-full p-4 border-2 border-slate-200 rounded-xl focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all resize-none text-slate-700"
          rows={12}
          value={userText}
          onChange={(e) => setUserText(e.target.value)}
          placeholder="指定された詭弁を巧みに組み合わせて、説得力のある文章を書いてください..."
        />
        <div className="mt-2 text-right">
          <span className="text-xs text-slate-500">{userText.length} 文字</span>
        </div>
      </div>

      {/* 提出ボタン */}
      <div className="text-center">
        <Button
          onClick={() => userText.trim() && onSubmit(userText)}
          disabled={!userText.trim()}
          className="bg-purple-600 hover:bg-purple-700 text-white px-16 h-14 text-lg font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          提出して採点
        </Button>
      </div>
    </div>
  );
});
