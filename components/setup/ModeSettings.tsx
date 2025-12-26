import React from 'react';
import { DebateMode, StoryScenario } from '../../core/types';
import { Users, Globe, MonitorPlay, ThumbsUp, ThumbsDown, Loader2, BookOpen } from 'lucide-react';
import { Button } from '../Button';

interface ModeSettingsProps {
  activeMode: DebateMode;
  aStance: 'PRO' | 'CON';
  setAStance: (stance: 'PRO' | 'CON') => void;
  storyScenario: StoryScenario | null;
  setStoryScenario: (scenario: StoryScenario | null) => void;
  isGeneratingScenario: boolean;
  topic: string;
  onGenerateScenario: () => void;
}

export const ModeSettings: React.FC<ModeSettingsProps> = React.memo(({
  activeMode,
  aStance,
  setAStance,
  storyScenario,
  setStoryScenario,
  isGeneratingScenario,
  topic,
  onGenerateScenario,
}) => {
  if (activeMode === DebateMode.FACILITATION) {
    return (
      <div className="bg-green-50 p-5 rounded-xl border border-green-100 space-y-4">
        <div className="flex items-start gap-4 text-green-800">
          <div className="bg-white p-2 rounded-lg shadow-sm text-green-600">
            <Users size={24} />
          </div>
          <div>
            <h3 className="font-bold text-lg mb-1">ファシリテーション・シミュレーター</h3>
            <p className="text-sm opacity-90 leading-relaxed">
              あなたは議論の進行役（ファシリテーター）です。
              <br />
              <span className="font-bold text-red-600">感情的なAさん</span>と
              <span className="font-bold text-blue-600">論理的なBさん</span>
              の対立する意見を整理し、合意形成を目指してください。
            </p>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-green-800 uppercase tracking-wider mb-2">
            Aさん（感情派）の立場
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setAStance('PRO')}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all border-2 ${
                aStance === 'PRO'
                  ? 'bg-white border-green-500 text-green-700 shadow-sm'
                  : 'bg-green-100/50 border-transparent text-green-800/60 hover:bg-green-100'
              }`}
            >
              <ThumbsUp size={16} className={aStance === 'PRO' ? 'text-green-600' : 'opacity-50'} />
              <span>肯定側 (Pro)</span>
            </button>
            <button
              type="button"
              onClick={() => setAStance('CON')}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all border-2 ${
                aStance === 'CON'
                  ? 'bg-white border-red-500 text-red-700 shadow-sm'
                  : 'bg-green-100/50 border-transparent text-green-800/60 hover:bg-green-100'
              }`}
            >
              <ThumbsDown size={16} className={aStance === 'CON' ? 'text-red-600' : 'opacity-50'} />
              <span>否定側 (Con)</span>
            </button>
          </div>
          <p className="text-xs text-green-700 mt-2 text-center">
            ※ Bさん（論理派）は自動的に反対の立場になります。
          </p>
        </div>
      </div>
    );
  }

  if (activeMode === DebateMode.STORY) {
    return (
      <div className="space-y-4">
        <div className="bg-teal-50 p-5 rounded-xl border border-teal-100 space-y-4">
          <div className="flex items-start gap-4 text-teal-800">
            <div className="bg-white p-2 rounded-lg shadow-sm text-teal-600">
              <Globe size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1">世界観シナリオ・ディベート</h3>
              <p className="text-sm opacity-90 leading-relaxed">
                AIが架空の世界と危機的状況を生成します。
                <br />
                あなたはその世界の一員として役割を与えられ、重要な意思決定を行います。
              </p>
            </div>
          </div>
        </div>

        {!storyScenario ? (
          <Button
            type="button"
            onClick={onGenerateScenario}
            disabled={!topic.trim() || isGeneratingScenario}
            fullWidth
            className="bg-teal-600 hover:bg-teal-700 text-white"
          >
            {isGeneratingScenario ? (
              <>
                <Loader2 size={18} className="animate-spin mr-2" />
                シナリオ生成中...
              </>
            ) : (
              <>
                <Globe size={18} className="mr-2" />
                シナリオを生成する
              </>
            )}
          </Button>
        ) : (
          <div className="bg-white border border-teal-200 rounded-xl overflow-hidden shadow-sm animate-fade-in">
            <div className="bg-teal-50 px-4 py-3 border-b border-teal-100 flex justify-between items-center">
              <span className="font-bold text-teal-800 flex items-center gap-2">
                <BookOpen size={16} /> 生成されたシナリオ
              </span>
              <button
                type="button"
                onClick={() => setStoryScenario(null)}
                className="text-xs text-teal-600 hover:underline"
              >
                再生成
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <h4 className="text-lg font-bold text-slate-800 mb-1">{storyScenario.title}</h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {storyScenario.worldSetting}
                </p>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <h5 className="text-xs font-bold text-slate-500 uppercase mb-2">あなたの役割</h5>
                <div className="flex items-start gap-2">
                  <div className="bg-teal-100 p-1.5 rounded-full text-teal-700 mt-0.5">
                    <Users size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">
                      {storyScenario.userRole.title}
                    </p>
                    <p className="text-xs text-slate-600">{storyScenario.userRole.mission}</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <h5 className="text-xs font-bold text-slate-500 uppercase mb-2">主な登場人物</h5>
                <ul className="text-sm text-slate-700 space-y-1 list-disc pl-4">
                  {storyScenario.stakeholders.map((s, i) => (
                    <li key={i}>
                      <span className="font-bold">{s.name}</span> ({s.role}):{' '}
                      {s.standpoint.substring(0, 30)}...
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (activeMode === DebateMode.DEMO) {
    return (
      <div className="bg-sky-50 p-5 rounded-xl border border-sky-100 space-y-4">
        <div className="flex items-start gap-4 text-sky-800">
          <div className="bg-white p-2 rounded-lg shadow-sm text-sky-600">
            <MonitorPlay size={24} />
          </div>
          <div>
            <h3 className="font-bold text-lg mb-1">模範ディベート視聴モード</h3>
            <p className="text-sm opacity-90 leading-relaxed">
              AI同士（Alice vs Bob）のハイレベルな議論を観察します。
              <br />
              発言ごとに<span className="font-bold text-indigo-600">リアルタイムの解説</span>
              が付き、論理構成やレトリックを俯瞰して学べます。
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
});
