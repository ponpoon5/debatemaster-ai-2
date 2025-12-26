import React from 'react';
import { DebateMode, MiniGameType, Difficulty, DebateArchive } from '../../core/types';
import { Button } from '../Button';
import { FALLACY_LIST, DRILL_LIST, FRAMEWORK_LIST } from '../../core/config/constants';
import {
  Book,
  Joystick,
  BrainCircuit,
  Target,
  GraduationCap,
  Gavel,
  Search,
  ShieldAlert,
  LayoutList,
  Swords,
  Loader2,
  Calculator,
  Lightbulb,
} from 'lucide-react';

interface SetupModeContentProps {
  activeMode: DebateMode;
  archives: DebateArchive[];
  isAnalyzingWeakness: boolean;
  onStartWithPreset: (params: any) => void;
  onStartTraining: () => void;
  setActiveMode: (mode: DebateMode) => void;
}

export const SetupModeContent: React.FC<SetupModeContentProps> = React.memo(({
  activeMode,
  archives,
  isAnalyzingWeakness,
  onStartWithPreset,
  onStartTraining,
  setActiveMode,
}) => {
  // Textbook Mode
  if (activeMode === DebateMode.TEXTBOOK) {
    return (
      <div className="w-full bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-slate-100 animate-fade-in-up delay-200 mb-8">
        <div className="mb-6 flex items-start gap-4 p-4 bg-emerald-50 rounded-xl border border-emerald-100 text-emerald-800">
          <div className="bg-white p-2 rounded-lg shadow-sm text-emerald-600">
            <Book size={24} />
          </div>
          <div>
            <h3 className="font-bold text-lg mb-1">議論教科書モード</h3>
            <p className="text-sm opacity-90 leading-relaxed">
              議論の理論と型を学ぶレクチャーモードです。
              <br />
              各章で理論を学んだ後、AIによる理解度チェッククイズを受けられます。
            </p>
          </div>
        </div>

        <Button
          onClick={() =>
            onStartWithPreset({ topic: '議論教科書', mode: DebateMode.TEXTBOOK })
          }
          fullWidth
          className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg h-12 text-lg"
        >
          学習を開始する
        </Button>
      </div>
    );
  }

  // Mini-game Mode
  if (activeMode === DebateMode.MINIGAME) {
    return (
      <div className="w-full bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-slate-100 animate-fade-in-up delay-200 mb-8">
        <div className="mb-6 flex items-start gap-4 p-4 bg-pink-50 rounded-xl border border-pink-100 text-pink-800">
          <div className="bg-white p-2 rounded-lg shadow-sm text-pink-600">
            <Joystick size={24} />
          </div>
          <div>
            <h3 className="font-bold text-lg mb-1">ミニゲーム (Training Mini-games)</h3>
            <p className="text-sm opacity-90 leading-relaxed">
              30〜90秒でできる「議論筋トレ」。ゲーム感覚で瞬発力を鍛えましょう。
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              type: MiniGameType.EVIDENCE_FILL,
              title: 'Evidence穴埋め',
              desc: '不完全な主張に対し、説得力のある「根拠」を瞬時に補完するトレーニング。',
              icon: Search,
            },
            {
              type: MiniGameType.FALLACY_QUIZ,
              title: '誤謬（Fallacy）クイズ',
              desc: 'ストローマンや論点ずらしなど、議論に潜む「論理の詐術」を見抜く4択クイズ。',
              icon: ShieldAlert,
            },
            {
              type: MiniGameType.ISSUE_PUZZLE,
              title: '論点整理パズル',
              desc: 'バラバラになった「主張・根拠・論拠」のパーツを、正しい論理順序に並べ替える。',
              icon: LayoutList,
            },
            {
              type: MiniGameType.COMBO_REBUTTAL,
              title: '反論コンボアタック',
              desc: '次々と投げかけられる主張に対し、制限時間内に即座に反論を打ち返す千本ノック。',
              icon: Swords,
            },
            {
              type: MiniGameType.FERMI_ESTIMATION,
              title: 'フェルミ推定',
              desc: '「日本にピアノ調律師は何人？」等の問いに、論理的仮説を立てて概算する。',
              icon: Calculator,
            },
            {
              type: MiniGameType.LATERAL_THINKING,
              title: '水平思考パズル',
              desc: '「ウミガメのスープ」のような不可解な状況に対し、多角的な視点で真相を推論する。',
              icon: Lightbulb,
            },
            {
              type: MiniGameType.ACTIVE_INOCULATION,
              title: '能動的接種演習',
              desc: '指定された詭弁を意図的に使って説得文を作成。詭弁の構造を深く理解し、見抜く力を養う。',
              icon: ShieldAlert,
            },
          ].map(game => (
            <button
              key={game.type}
              onClick={() =>
                onStartWithPreset({
                  topic: game.title,
                  mode: DebateMode.MINIGAME,
                  miniGameType: game.type,
                })
              }
              className="p-5 rounded-xl border border-slate-200 hover:border-pink-300 hover:bg-pink-50 transition-all text-left flex items-start gap-4 group bg-white shadow-sm hover:shadow-md h-full"
            >
              <div className="bg-pink-100 p-3 rounded-xl text-pink-600 group-hover:bg-pink-200 mt-1 shrink-0">
                <game.icon size={24} />
              </div>
              <div>
                <span className="block font-bold text-slate-800 text-lg mb-2 group-hover:text-pink-700 transition-colors">
                  {game.title}
                </span>
                <p className="text-sm text-slate-600 leading-relaxed">{game.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Thinking Gym Mode
  if (activeMode === DebateMode.THINKING_GYM) {
    return (
      <div className="w-full bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-slate-100 animate-fade-in-up delay-200 mb-8">
        <div className="mb-6 flex items-start gap-4 p-4 bg-indigo-50 rounded-xl border border-indigo-100 text-indigo-800">
          <div className="bg-white p-2 rounded-lg shadow-sm text-indigo-600">
            <BrainCircuit size={24} />
          </div>
          <div>
            <h3 className="font-bold text-lg mb-1">思考ジム (Thinking Gym)</h3>
            <p className="text-sm opacity-90 leading-relaxed">
              1分〜3分でできる「思考の筋トレ」。特定のフレームワークを使って、AIが出すランダム課題を分析してください。
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {FRAMEWORK_LIST.map((fw, idx) => (
            <button
              key={idx}
              onClick={() =>
                onStartWithPreset({
                  topic: fw.name,
                  mode: DebateMode.THINKING_GYM,
                  thinkingFramework: fw.id,
                })
              }
              className="flex flex-col text-left p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-gradient-to-br hover:from-indigo-50 hover:to-indigo-100/50 hover:shadow-md transition-all group active:scale-[0.98]"
            >
              <div className="flex items-center justify-between w-full mb-2">
                <div className="bg-slate-100 p-2 rounded-lg text-slate-400 group-hover:bg-indigo-200 group-hover:text-indigo-700 transition-colors">
                  <fw.icon size={20} />
                </div>
                <span className="text-[10px] font-bold bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full border border-indigo-100 group-hover:border-indigo-200">
                  GYM
                </span>
              </div>
              <span className="font-bold text-slate-800 group-hover:text-indigo-800 block mb-1">
                {fw.name}
              </span>
              <p className="text-xs text-slate-600 leading-tight">{fw.desc}</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Study Mode (Fallacy Learning)
  if (activeMode === DebateMode.STUDY) {
    return (
      <div className="w-full bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-slate-100 animate-fade-in-up delay-200 mb-8">
        <div className="mb-6 flex items-start gap-4 p-4 bg-purple-50 rounded-xl border border-purple-100 text-purple-800">
          <div className="bg-white p-2 rounded-lg shadow-sm text-purple-600">
            <GraduationCap size={24} />
          </div>
          <div>
            <h3 className="font-bold text-lg mb-1">詭弁（Logical Fallacy）を学ぶ</h3>
            <p className="text-sm opacity-90 leading-relaxed">
              知りたい項目を選ぶと、AIが家庭教師となって「定義」「具体例」「対処法」を解説し、最後にロールプレイで実践練習を行います。
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {FALLACY_LIST.map((fallacy, idx) => (
            <button
              key={idx}
              onClick={() =>
                onStartWithPreset({ topic: fallacy.name, mode: DebateMode.STUDY })
              }
              className="flex flex-col text-left p-4 rounded-xl border border-slate-200 hover:border-purple-300 hover:bg-gradient-to-br hover:from-purple-50 hover:to-purple-100/50 hover:shadow-md transition-all group active:scale-[0.98]"
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span className="font-bold text-slate-800 group-hover:text-purple-700">
                  {fallacy.name}
                </span>
                <BrainCircuit
                  size={16}
                  className="text-slate-300 group-hover:text-purple-400"
                />
              </div>
              <span className="text-xs text-slate-500 font-mono mb-2">{fallacy.eng}</span>
              <p className="text-xs text-slate-600 leading-tight">{fallacy.desc}</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Drill Mode (Rebuttal Training)
  if (activeMode === DebateMode.DRILL) {
    return (
      <div className="w-full bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-slate-100 animate-fade-in-up delay-200 mb-8">
        <div className="mb-6 flex items-start gap-4 p-4 bg-orange-50 rounded-xl border border-orange-100 text-orange-800">
          <div className="bg-white p-2 rounded-lg shadow-sm text-orange-600">
            <Gavel size={24} />
          </div>
          <div>
            <h3 className="font-bold text-lg mb-1">反駁（リバッタル）特化ドリル</h3>
            <p className="text-sm opacity-90 leading-relaxed">
              相手の主張を崩すための特定の「型」を集中的にトレーニングします。
              AIがランダムな主張を行い、あなたが指定されたテクニックで反論します。
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {DRILL_LIST.map((drill, idx) => (
            <button
              key={idx}
              onClick={() =>
                onStartWithPreset({
                  topic: drill.name,
                  mode: DebateMode.DRILL,
                  difficulty: Difficulty.HARD,
                })
              }
              className="flex items-start gap-3 text-left p-4 rounded-xl border border-slate-200 hover:border-orange-300 hover:bg-gradient-to-br hover:from-orange-50 hover:to-orange-100/50 hover:shadow-md transition-all group active:scale-[0.98]"
            >
              <div className="bg-slate-100 p-2 rounded-lg text-slate-400 group-hover:bg-orange-200 group-hover:text-orange-700 transition-colors">
                <drill.icon size={20} />
              </div>
              <div>
                <span className="font-bold text-slate-800 group-hover:text-orange-800 block mb-1">
                  {drill.name}
                </span>
                <p className="text-xs text-slate-600 leading-tight">{drill.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Training Mode (Weakness Analysis)
  if (activeMode === DebateMode.TRAINING) {
    return (
      <div className="w-full bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-slate-100 animate-fade-in-up delay-200 mb-8">
        <div className="mb-6 flex items-start gap-4 p-4 bg-red-50 rounded-xl border border-red-100 text-red-800">
          <div className="bg-white p-2 rounded-lg shadow-sm text-red-600">
            <Target size={24} />
          </div>
          <div>
            <h3 className="font-bold text-lg mb-1">弱点克服トレーニング</h3>
            <p className="text-sm opacity-90 leading-relaxed">
              あなたの過去の議論データ（{archives.length}
              件）を分析し、陥りやすい論理的誤りや弱点を特定します。
              その後、AIコーチがあえてその弱点を攻める実践形式のトレーニングを行います。
            </p>
          </div>
        </div>

        {archives.length < 1 ? (
          <div className="text-center py-10 text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-300">
            <Target size={32} className="mx-auto mb-2 text-slate-400" />
            <p className="font-bold">データが足りません</p>
            <p className="text-sm mt-1">
              トレーニングを行うには、まず「議論実践モード」で
              <br />
              1回以上の議論完了データが必要です。
            </p>
            <Button
              onClick={() => setActiveMode(DebateMode.DEBATE)}
              variant="secondary"
              size="sm"
              className="mt-4"
            >
              議論実践モードへ
            </Button>
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="mb-6">
              <p className="text-sm font-bold text-slate-700 mb-2">蓄積されたデータ</p>
              <div className="flex justify-center gap-2 flex-wrap">
                {archives.slice(-5).map((a, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 bg-slate-100 text-slate-500 text-xs rounded border border-slate-200"
                  >
                    {a.topic.length > 10 ? a.topic.substring(0, 10) + '...' : a.topic}
                  </span>
                ))}
                {archives.length > 5 && (
                  <span className="text-xs text-slate-400 self-center">
                    ...他{archives.length - 5}件
                  </span>
                )}
              </div>
            </div>

            <Button
              onClick={onStartTraining}
              fullWidth
              variant="danger"
              className="h-12 text-lg shadow-lg hover:shadow-xl"
              disabled={isAnalyzingWeakness}
            >
              {isAnalyzingWeakness ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  弱点を分析中...
                </>
              ) : (
                <>
                  <Target size={20} className="mr-2" />
                  弱点分析＆トレーニング開始
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    );
  }

  return null;
});

SetupModeContent.displayName = 'SetupModeContent';
