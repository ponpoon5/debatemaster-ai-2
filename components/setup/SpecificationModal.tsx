import React from 'react';
/* Added missing icon imports: Swords, Users, Globe, MonitorPlay, Dumbbell, BrainCircuit, Book, GraduationCap, Joystick */
import {
  X,
  FileText,
  CheckCircle2,
  Code,
  Cpu,
  Layout,
  Target,
  BookOpen,
  Database,
  Zap,
  Layers,
  MessageSquare,
  ShieldCheck,
  Activity,
  Terminal,
  Swords,
  Users,
  Globe,
  MonitorPlay,
  Dumbbell,
  BrainCircuit,
  Book,
  GraduationCap,
  Joystick,
} from 'lucide-react';

interface SpecificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SpecificationModal: React.FC<SpecificationModalProps> = React.memo(({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-5xl max-h-[94vh] overflow-hidden flex flex-col animate-pop-in border border-slate-200">
        {/* Header - Advanced Engineering Tone */}
        <div className="flex items-center justify-between p-8 border-b border-slate-100 bg-gradient-to-br from-slate-50 to-indigo-50/30">
          <div className="flex items-center gap-5">
            <div className="bg-slate-900 p-4 rounded-2xl text-white shadow-2xl rotate-2">
              <Terminal size={32} />
            </div>
            <div>
              <h3 className="text-3xl font-black text-slate-800 tracking-tighter">
                TECHNICAL MASTER SPEC <span className="text-indigo-600">v3.4.4</span>
              </h3>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2">
                <Activity size={12} className="text-emerald-500" /> Production-Ready System with Proxy Architecture
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-3 rounded-full hover:bg-slate-200 text-slate-400 transition-all active:scale-90 shadow-inner"
          >
            <X size={28} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 sm:p-12 space-y-16 scrollbar-hide">
          {/* Section 1: Intel Engine Deep Dive */}
          <section className="space-y-8">
            <div className="flex items-center gap-3 text-indigo-700">
              <Cpu size={28} strokeWidth={2.5} />
              <h4 className="text-2xl font-black m-0 italic uppercase tracking-tighter">
                01. 思考エンジンと論理マッピング仕様
              </h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 hover:border-indigo-300 transition-all hover:shadow-lg group">
                <div className="flex items-center gap-2 mb-4">
                  <Layers size={20} className="text-indigo-500" />
                  <h5 className="font-extrabold text-slate-800">Toulmin 7要素解析</h5>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  発言を CLAIM, DATA, WARRANT, BACKING, REBUTTAL, QUALIFICATION
                  の7軸で数値化。0.1単位の充足度をヒートマップで可視化し、論理の欠陥を特定する。
                </p>
              </div>

              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 hover:border-emerald-300 transition-all hover:shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                  <ShieldCheck size={20} className="text-emerald-500" />
                  <h5 className="font-extrabold text-slate-800">立証責任トラッカー</h5>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Waltonの批判的質問理論に基づき、主張・反証・立証責任の状態をリアルタイムで追跡。議論の力学を可視化し、戦略的な思考を支援する。
                </p>
              </div>

              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 hover:border-rose-300 transition-all hover:shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                  <Zap size={20} className="text-rose-500" />
                  <h5 className="font-extrabold text-slate-800">SBI フィードバック</h5>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Situation(状況), Behavior(行動),
                  Impact(影響)の3段構成をAIに強制。主観を排した「冷徹かつ有益なアドバイス」を全発言に対して生成する。
                </p>
              </div>
            </div>
          </section>

          {/* Section 2: Mode Logic Templates */}
          <section className="space-y-8">
            <div className="flex items-center gap-3 text-indigo-700">
              <Zap size={28} strokeWidth={2.5} />
              <h4 className="text-2xl font-black m-0 italic uppercase tracking-tighter">
                02. 10種の教育モードとプロンプト・アーキテクチャ
              </h4>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                {
                  mode: '議論実践',
                  icon: Swords,
                  color: 'bg-blue-600',
                  logic: '4段階の難易度別State制御',
                },
                {
                  mode: '合意形成',
                  icon: Users,
                  color: 'bg-green-600',
                  logic: '感情派A vs 論理派Bの二律背反',
                },
                {
                  mode: '世界観RPG',
                  icon: Globe,
                  color: 'bg-teal-600',
                  logic: 'ランダムイベント[EVENT]タグ生成',
                },
                {
                  mode: '模範視聴',
                  icon: MonitorPlay,
                  color: 'bg-sky-600',
                  logic: 'Alice vs Bobのメタ実況解説',
                },
                {
                  mode: '弱点特訓',
                  icon: Target,
                  color: 'bg-red-600',
                  logic: '過去行動データの累積Cross分析',
                },
                {
                  mode: '反駁ドリル',
                  icon: Dumbbell,
                  color: 'bg-orange-600',
                  logic: '5種の論理攻撃パターン特訓',
                },
                {
                  mode: '思考ジム',
                  icon: BrainCircuit,
                  color: 'bg-indigo-600',
                  logic: 'MECE/SWOT等のFramework入出力',
                },
                {
                  mode: '教科書',
                  icon: Book,
                  color: 'bg-emerald-600',
                  logic: '理論学習とラボ実験のサイクル',
                },
                {
                  mode: '詭弁学習',
                  icon: GraduationCap,
                  color: 'bg-purple-600',
                  logic: 'Logical Fallacyの特定と対処法',
                },
                {
                  mode: 'ミニゲーム',
                  icon: Joystick,
                  color: 'bg-pink-600',
                  logic: '脳の瞬発力を鍛えるタイムアタック',
                },
              ].map((m, i) => (
                <div
                  key={i}
                  className="flex flex-col p-4 bg-slate-900 rounded-3xl text-white border border-white/5 relative overflow-hidden group"
                >
                  <m.icon
                    size={24}
                    className={`${m.color.replace('bg-', 'text-')} mb-3 group-hover:scale-125 transition-transform`}
                  />
                  <span className="block text-[11px] font-black tracking-tight mb-1">{m.mode}</span>
                  <span className="block text-[9px] text-white/40 leading-tight">{m.logic}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Section 3: Persistence & Safety */}
          <section className="space-y-8">
            <div className="flex items-center gap-3 text-indigo-700">
              <Database size={28} strokeWidth={2.5} />
              <h4 className="text-2xl font-black m-0 italic uppercase tracking-tighter">
                03. データ永続化、セキュリティ、UX定数
              </h4>
            </div>
            <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-4">
                  <h5 className="font-bold text-slate-800 flex items-center gap-2">
                    <ShieldCheck size={18} className="text-indigo-600" /> ストレージ仕様 (v4.0)
                  </h5>
                  <ul className="text-xs text-slate-600 space-y-2 list-disc pl-4 leading-relaxed font-medium">
                    <li>LocalStorage `debate_archives` キーへの完全依存</li>
                    <li>履歴データの自動マイグレーション (v1〜v3 {'>'} v4)</li>
                    <li>行動統計 (numerator/denominator) による長期プロファイリング</li>
                    <li>JSONバックアップのExport/Import（結合・上書きロジック搭載）</li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h5 className="font-bold text-slate-800 flex items-center gap-2">
                    <Activity size={18} className="text-indigo-600" /> インターフェース制約
                  </h5>
                  <ul className="text-xs text-slate-600 space-y-2 list-disc pl-4 leading-relaxed font-medium">
                    <li>AI応答のMarkdown装飾除去 (Regex cleanText)</li>
                    <li>全リクエストへの `STRICT_OUTPUT_RULES` インジェクション</li>
                    <li>Skeleton Screen & プログレスバー同期 (Complexity Factor)</li>
                    <li>Mobile First: スクロールロック & 仮想キーボード考慮</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4: Production Architecture */}
          <section className="space-y-8">
            <div className="flex items-center gap-3 text-indigo-700">
              <Terminal size={28} strokeWidth={2.5} />
              <h4 className="text-2xl font-black m-0 italic uppercase tracking-tighter">
                04. プロダクション・アーキテクチャ (v3.4.4)
              </h4>
            </div>
            <div className="bg-gradient-to-br from-slate-900 to-indigo-900 p-8 rounded-[2.5rem] border border-slate-700 text-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-4">
                  <h5 className="font-bold text-indigo-200 flex items-center gap-2">
                    <Code size={18} className="text-blue-400" /> Vercel Serverless Proxy
                  </h5>
                  <ul className="text-xs text-slate-300 space-y-2 list-disc pl-4 leading-relaxed font-medium">
                    <li>5つのAPI Routes: /generate, /generate-stream, /chat, /chat-stream, /health</li>
                    <li>会話履歴の自動蓄積ロジック（デモモード対応）</li>
                    <li>APIキーの完全隠蔽（環境変数経由）</li>
                    <li>統一レスポンス形式（response.text 自動抽出）</li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h5 className="font-bold text-indigo-200 flex items-center gap-2">
                    <ShieldCheck size={18} className="text-emerald-400" /> セキュリティ三層防御
                  </h5>
                  <ul className="text-xs text-slate-300 space-y-2 list-disc pl-4 leading-relaxed font-medium">
                    <li>レート制限: 100リクエスト/分/IP（メモリベース）</li>
                    <li>CORS: ドメインホワイトリスト方式</li>
                    <li>バリデーション: モデル名・コンテンツ長・配列形式チェック</li>
                    <li>全18機能のAPI呼び出し形式を統一（contents配列化）</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Section 5: Fixed Features in v3.4.4 */}
          <section className="space-y-8">
            <div className="flex items-center gap-3 text-emerald-700">
              <CheckCircle2 size={28} strokeWidth={2.5} />
              <h4 className="text-2xl font-black m-0 italic uppercase tracking-tighter">
                05. v3.4.4 修正済み機能
              </h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { label: 'デモモード', desc: 'Alice vs Bobの交互発言が正常動作' },
                { label: '仮想ホワイトボード', desc: 'ファシリテーションモードでLive表示' },
                { label: '前提確認', desc: 'トピック開始時の前提提案が動作' },
                { label: 'アドバイス分析', desc: 'リアルタイム戦術提案が正常化' },
                { label: '立証責任分析', desc: 'キャッシュ機能付きトラッカー' },
                { label: '戦略分析', desc: 'フェーズごとの戦略提示が動作' },
                { label: 'ミニゲーム', desc: '7種の思考ゲームが全て起動' },
                { label: 'クイズ機能', desc: '誤謬検出クイズが正常動作' },
                { label: '教科書モード', desc: '理論学習とラボが連動' },
                { label: '思考ジム', desc: 'フレームワーク訓練が動作' },
                { label: '合意形成最適化', desc: 'フィードバック生成速度を改善' },
                { label: '詳細レビュー', desc: 'SBIモデル分析が全機能で動作' },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 hover:shadow-lg transition-all"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 size={16} className="text-emerald-600" />
                    <span className="font-bold text-sm text-slate-800">{feature.label}</span>
                  </div>
                  <p className="text-[10px] text-slate-600 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Master Note */}
          <section className="bg-gradient-to-br from-indigo-900 to-slate-900 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] -ml-32 -mb-32"></div>

            <h4 className="text-xl font-black mb-6 flex items-center gap-3 border-b border-white/10 pb-6 uppercase tracking-widest italic">
              <Zap className="text-yellow-400 fill-yellow-400" size={24} />
              Architect's Directive - v3.4.4 Production
            </h4>
            <div className="space-y-4">
              <p className="text-sm opacity-90 leading-relaxed m-0 font-bold italic text-indigo-100">
                本アプリを再現するにあたり、最も重要なのは「AIとの会話」ではなく「ユーザー自身の論理的アップデート」である。
                UIは常にユーザーの発言を解体し、不足している要素（特にWarrantとEvidence）を「痛み」としてではなく「成長の余白」として提示せよ。
                アニメーションのラグ、フィードバックのトーン、全ては「真理への探求」という知的格闘技の臨場感を演出するためにある。
              </p>
              <p className="text-sm opacity-90 leading-relaxed m-0 font-bold italic text-emerald-200 border-t border-white/10 pt-4">
                v3.4.4では、全機能がVercel Serverless環境で動作する本番環境仕様に到達した。
                プロキシアーキテクチャによるAPIキーの完全隠蔽、セキュリティ三層防御、会話履歴の自動蓄積ロジック、そして全18機能の統一API形式化により、
                DebateMaster AIは「研究プロトタイプ」から「プロダクションレディな教育プラットフォーム」へと進化した。
                このドキュメントは、単なるコードの指針ではなく、DebateMaster AIという「知能の鏡」を構築するための完全設計図である。
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
});
