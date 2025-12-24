# DebateMaster AI vv3.4.3 - 詳細仕様書

**最終更新日**: 2025-12-22
**バージョン**: 3.4.3
**コードネーム**: Active Inoculation

---

## 📋 目次

1. [プロジェクト概要](#1-プロジェクト概要)
2. [システムアーキテクチャ](#2-システムアーキテクチャ)
3. [画面構成と遷移フロー](#3-画面構成と遷移フロー)
4. [コア機能仕様](#4-コア機能仕様)
5. [AI分析エンジン](#5-ai分析エンジン)
6. [ディベートモード詳細](#6-ディベートモード詳細)
7. [フィードバックシステム](#7-フィードバックシステム)
8. [学習・トレーニング機能](#8-学習トレーニング機能)
9. [データ構造と型定義](#9-データ構造と型定義)
10. [技術スタック](#10-技術スタック)
11. [UI/UXデザイン](#11-uiuxデザイン)
12. [パフォーマンス最適化](#12-パフォーマンス最適化)

---

## 1. プロジェクト概要

### 1.1 アプリケーション名
**DebateMaster AI vv3.4.3**

### 1.2 コンセプト
DebateMaster AIは、単なるチャットボットではなく、**「論理の等値化と可視化」**を実現する教育プラットフォームです。Google Gemini 2.5 Flashの推論能力を、学術的な議論理論（Toulmin モデル、Walton 議論スキーム）にマッピングすることで、ユーザーの論理的思考力を科学的に分析・育成します。

### 1.3 主な特徴
- ✅ **10種類のディベートモード** - 目的別の多様な訓練環境
- ✅ **リアルタイム論理構造分析** - Toulminモデルによる7要素分析
- ✅ **立証責任トラッカー** - 議論中の立証責任を可視化（v3.4.2新機能）
- ✅ **包括的フィードバック** - 8つの評価軸 × 個別メッセージ分析
- ✅ **7種類のミニゲーム** - ゲーミフィケーションによる訓練（能動的接種演習含む）
- ✅ **教科書学習機能** - 理論学習と練習問題
- ✅ **弱点プロファイル** - 過去データに基づく個別最適化
- ✅ **完全クライアントサイド** - バックエンド不要、プライバシー保護

### 1.4 対象ユーザー
- 論理的思考力を鍛えたい学生・社会人
- ディベート競技の練習をしたい方
- プレゼンテーション・交渉力を向上させたい方
- 批判的思考（Critical Thinking）を学びたい方

---

## 2. システムアーキテクチャ

### 2.1 アーキテクチャ概要

```
┌─────────────────────────────────────────────────────┐
│                   React Application                 │
│                      (App.tsx)                      │
└─────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────┐
│              Main Application Logic                 │
│              (useDebateApp Hook)                    │
│                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────┐ │
│  │   Session    │  │  Messaging   │  │ Feedback │ │
│  │  Management  │  │  Management  │  │Generation│ │
│  └──────────────┘  └──────────────┘  └──────────┘ │
└─────────────────────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        ▼                ▼                ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  Components  │  │   Services   │  │  Core Utils  │
│              │  │              │  │              │
│ - Screens    │  │ - Gemini AI  │  │ - Types      │
│ - Chat UI    │  │ - Analysis   │  │ - Error      │
│ - Feedback   │  │ - Training   │  │ - Guards     │
│ - Games      │  │ - Setup      │  │ - Parsers    │
└──────────────┘  └──────────────┘  └──────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────┐
│           Google Gemini 2.5 Flash API               │
│         (with Structured JSON Schema)               │
└─────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────┐
│            LocalStorage Persistence                 │
│          (debate_archives, weaknessProfile)         │
└─────────────────────────────────────────────────────┘
```

### 2.2 設計原則

#### 2.2.1 状態管理
- **React Hooks ベース**: `useState`, `useEffect`, `useCallback`を活用
- **疎結合設計**: ビジネスロジックは `hooks/` に、AI通信は `services/gemini/` に分離
- **単一責任原則**: 各フックは1つの責務のみを持つ

#### 2.2.2 型安全性
- **TypeScript 100%**: 全ファイルで型定義を強制
- **Type Guards**: `!` (non-null assertion) の使用を禁止、型ガードで安全に型を絞り込む
- **Centralized Types**: `core/types/` に全型定義を集約

#### 2.2.3 Zero-Backend Architecture
- バックエンドサーバー不要
- 全処理をブラウザ上で完結
- APIキーは環境変数 `VITE_GEMINI_API_KEY` から取得
- データ永続化は LocalStorage を使用

### 2.3 ディレクトリ構造

```
debatemaster-ai/
├── App.tsx                    # ルートコンポーネント
├── index.tsx                  # エントリーポイント
│
├── components/                # UIコンポーネント
│   ├── SetupScreen.tsx        # 初期設定画面
│   ├── PremiseCheckScreen.tsx # 前提確認画面
│   ├── ChatScreen.tsx         # メイン議論画面
│   ├── FeedbackScreen.tsx     # フィードバック画面
│   ├── TextbookScreen.tsx     # 教科書学習画面
│   ├── MiniGameScreen.tsx     # ミニゲーム画面
│   ├── HistoryScreen.tsx      # 履歴表示画面
│   │
│   ├── chat/                  # チャット関連
│   │   ├── MessageItem.tsx
│   │   ├── InputArea.tsx
│   │   ├── BurdenTracker.tsx  # 立証責任トラッカー (v3.4.2)
│   │   ├── SupportPanel.tsx
│   │   ├── ArgumentBuilderModal.tsx
│   │   ├── ThinkingGymModal.tsx
│   │   ├── SummaryModal.tsx
│   │   └── WhiteboardModal.tsx
│   │
│   ├── feedback/              # フィードバック関連
│   │   ├── SummarySection.tsx
│   │   ├── DetailedReviewSection.tsx
│   │   ├── LogicSection.tsx
│   │   ├── QuestioningSection.tsx
│   │   └── ExemplarSection.tsx
│   │
│   ├── minigame/              # ミニゲーム関連
│   │   ├── EvidenceFillView.tsx
│   │   ├── FallacyQuizView.tsx
│   │   ├── IssuePuzzleView.tsx
│   │   ├── ComboRebuttalView.tsx
│   │   ├── FermiEstimationView.tsx
│   │   └── LateralThinkingView.tsx
│   │
│   ├── textbook/              # 教科書関連
│   │   ├── AttackQuizView.tsx
│   │   ├── WeighingQuizView.tsx
│   │   ├── DefinitionQuizView.tsx
│   │   └── StandardQuizView.tsx
│   │
│   ├── setup/                 # セットアップ関連
│   │   ├── AppHeader.tsx
│   │   ├── TopicInput.tsx
│   │   ├── ModeGrid.tsx
│   │   └── DifficultyCards.tsx
│   │
│   └── common/                # 共通コンポーネント
│       └── LoadingOverlay.tsx
│
├── hooks/                     # カスタムフック
│   ├── useDebateApp.ts        # メインアプリロジック
│   ├── debate/
│   │   ├── useDebateSession.ts
│   │   ├── useDebateMessaging.ts
│   │   └── useDebateFeedback.ts
│   ├── useChatTools.ts
│   ├── useMessageAnalysis.ts
│   ├── useSetupLogic.ts
│   ├── usePremiseLogic.ts
│   ├── useFeedbackLogic.ts
│   ├── useTextbookLogic.ts
│   ├── useMiniGameLogic.ts
│   ├── useDebateArchives.ts
│   └── useErrorHandler.ts
│
├── services/                  # 外部サービス連携
│   └── gemini/
│       ├── client.ts          # Gemini APIクライアント
│       ├── chat-service.ts    # チャットサービス
│       ├── instructions.ts    # システムインストラクション
│       │
│       ├── setup/             # 初期化関連
│       │   ├── topic.ts
│       │   ├── scenario.ts
│       │   └── premise.ts
│       │
│       ├── analysis/          # AI分析エンジン
│       │   ├── strategy.ts
│       │   ├── phase.ts
│       │   ├── structure.ts
│       │   ├── summary.ts
│       │   ├── advice.ts
│       │   ├── fact-check.ts
│       │   ├── feedback.ts
│       │   └── burden.ts      # 立証責任分析 (v3.4.2)
│       │
│       ├── training/          # 学習・訓練
│       │   ├── textbook.ts
│       │   ├── quiz.ts
│       │   ├── minigame.ts
│       │   ├── weakness.ts
│       │   └── lab.ts
│       │
│       └── prompts/           # プロンプトテンプレート
│           └── modes/
│               ├── standard.ts
│               ├── demo.ts
│               ├── facilitation.ts
│               ├── story.ts
│               └── training.ts
│
├── core/                      # コアロジック
│   ├── types/                 # TypeScript型定義
│   │   ├── index.ts
│   │   ├── common.types.ts
│   │   ├── debate.types.ts
│   │   ├── feedback.types.ts
│   │   ├── mode.types.ts
│   │   ├── minigame.types.ts
│   │   ├── textbook.types.ts
│   │   ├── story.types.ts
│   │   ├── homework.types.ts
│   │   ├── burden.types.ts    # 立証責任型定義 (v3.4.2)
│   │   ├── error.types.ts
│   │   └── persistence.types.ts
│   │
│   ├── config/                # 設定ファイル
│   │   ├── constants.ts
│   │   ├── gemini.config.ts
│   │   └── version.ts         # バージョン管理 (v3.4.2)
│   │
│   └── utils/                 # ユーティリティ関数
│       ├── error-parser.ts
│       ├── type-guards.ts
│       └── index.ts
│
├── vite.config.ts             # Vite設定（チャンク最適化済み）
├── tsconfig.json              # TypeScript設定
├── package.json               # 依存関係管理
├── .env.local                 # 環境変数（APIキー）
│
└── docs/                      # ドキュメント
    ├── README.md
    ├── VERSION.md             # バージョン履歴 (v3.4.2)
    ├── SPECIFICATION.md       # 基本仕様
    ├── DETAILED_SPECIFICATION.md  # 詳細仕様（本ドキュメント）
    ├── ARCHITECTURE.md        # アーキテクチャ詳細
    ├── MIGRATION_GUIDE.md     # 移行ガイド
    ├── REFACTORING_REPORT.md  # リファクタリング報告
    └── TEST_SETUP.md          # テストセットアップ
```

---

## 3. 画面構成と遷移フロー

### 3.1 画面一覧

| 画面名 | ファイル | 役割 |
|-------|---------|------|
| **初期設定画面** | `SetupScreen.tsx` | ディベートモード・難易度・論題の選択 |
| **前提確認画面** | `PremiseCheckScreen.tsx` | 定義とゴールの合意形成 |
| **メイン議論画面** | `ChatScreen.tsx` | ユーザーとAIのリアルタイム対話 |
| **フィードバック画面** | `FeedbackScreen.tsx` | 議論の詳細分析と評価表示 |
| **教科書学習画面** | `TextbookScreen.tsx` | 理論学習と練習問題 |
| **ミニゲーム画面** | `MiniGameScreen.tsx` | ゲーム形式のスキル訓練 |
| **履歴画面** | `HistoryScreen.tsx` | 過去の議論の閲覧・統計表示 |

### 3.2 画面遷移フロー

```
[起動]
  ↓
┌──────────────────────┐
│   SetupScreen        │ ← ユーザー設定入力
│  (初期設定画面)      │    - 論題選択/入力
│                      │    - モード選択
│                      │    - 難易度選択
└──────────────────────┘
  ↓ [開始ボタン]
┌──────────────────────┐
│ PremiseCheckScreen   │ ← AI生成の定義・ゴール確認
│  (前提確認画面)      │    - 修正・再生成可能
└──────────────────────┘
  ↓ [議論開始]
┌──────────────────────┐
│   ChatScreen         │ ← メイン議論
│  (メイン議論画面)    │    - リアルタイムチャット
│                      │    - 構造分析表示
│                      │    - 立証責任トラッカー (v3.4.2)
│                      │    - サポートツール
└──────────────────────┘
  ↓ [議論終了]
┌──────────────────────┐
│  FeedbackScreen      │ ← 包括的フィードバック
│ (フィードバック画面) │    - スコア表示
│                      │    - 詳細分析
│                      │    - トレーニング推奨
└──────────────────────┘
  │
  ├─→ [教科書推奨] → TextbookScreen
  ├─→ [ゲーム推奨] → MiniGameScreen
  ├─→ [履歴確認]   → HistoryScreen
  └─→ [新規議論]   → SetupScreen
```

### 3.3 各画面の詳細

#### 3.3.1 SetupScreen（初期設定画面）

**役割**: ディベートの基本設定を行う

**主要コンポーネント**:
- `AppHeader`: アプリ名・バージョン表示
- `TopicInput`: 論題の入力/選択
- `ModeGrid`: モード選択カード
- `DifficultyCards`: 難易度選択
- `TokenStatus`: トークン使用量表示

**ユーザー入力**:
- 論題（フリー入力 or サジェスト選択）
- ディベートモード（10種類）
- 難易度（EASY/NORMAL/HARD/EXTREME）
- 立場（賛成/反対/任意）
- オプション設定（デモモード時の戦略等）

**画面遷移**:
- [開始ボタン] → PremiseCheckScreen
- [履歴表示] → HistoryScreen
- [教科書] → TextbookScreen
- [ミニゲーム] → MiniGameScreen

---

#### 3.3.2 PremiseCheckScreen（前提確認画面）

**役割**: 議論の前提（定義・ゴール）をAIと合意する

**表示内容**:
- **定義（Definitions）**: 論題に含まれる主要概念の定義
- **議論のゴール（Goal）**: 何を目指す議論なのか

**操作**:
- ✏️ **編集**: ユーザーが定義・ゴールを修正可能
- 🔄 **再生成**: AIに新しい前提を生成させる
- ✅ **承認**: 前提に合意し、議論を開始

**技術実装**:
- AIサービス: `services/gemini/setup/premise.ts`
- フック: `usePremiseLogic.ts`

---

#### 3.3.3 ChatScreen（メイン議論画面）

**役割**: ユーザーとAIのリアルタイム対話

**主要UI要素**:

1. **ヘッダー部**:
   - 論題表示
   - 議論フェーズ表示（POSITION→GROUNDS→CLASH→REBUTTAL→WEIGHING→CLOSING）
   - トークンカウンター

2. **メッセージエリア**:
   - ユーザー発言（青系）
   - AI発言（グレー系）
   - 各メッセージに「構造スコア」表示（Toulmin要素の充足度）

3. **立証責任トラッカー** (v3.4.2新機能):
   - トグルボタンで表示/非表示切り替え
   - 立証責任の状態可視化
   - CQ（批判的質問）の分類表示

4. **入力エリア**:
   - テキスト入力フィールド
   - 送信ボタン
   - 議論終了ボタン

5. **Floating Action Buttons**:
   - 💡 戦略アドバイス
   - 🏋️ 思考ジム
   - 📝 要約生成
   - 🎨 ホワイトボード（ファシリテーションモード）
   - ⚖️ 立証責任トラッカー (v3.4.2)

**リアルタイム分析**:
- **構造分析**: 各発言のToulmin要素をスコアリング
- **フェーズ判定**: 現在の議論段階を自動判定
- **戦略提案**: ユーザーの弱点に応じた次の一手を提案

**技術実装**:
- メインフック: `useDebateMessaging.ts`
- AI分析: `services/gemini/analysis/structure.ts`
- 立証責任: `services/gemini/analysis/burden.ts` (v3.4.2)

---

#### 3.3.4 FeedbackScreen（フィードバック画面）

**役割**: 議論終了後の包括的フィードバック表示

**セクション構成**:

1. **総合スコア表示**:
   - 0-100点のスコア
   - レーダーチャート（8軸）
   - 強み・弱み・改善点のサマリー

2. **詳細レビュー**:
   - 各メッセージへのSBIフィードバック
     - **Situation**: どの場面で
     - **Behavior**: どんな行動をとったか
     - **Impact**: その結果どうなったか
   - 検出された誤謬の指摘

3. **論理構造分析（LogicSection）**:
   - Toulmin Model 7要素のスコア
   - Claim, Data, Warrant, Backing, Rebuttal, Qualifier, Conclusion

4. **質問分析（QuestioningSection）**:
   - 質問タイプ分類（OPEN/CLOSED/SUBTLE）
   - 質問の深さ・効果性評価

5. **模範例表示（ExemplarSection）**:
   - ユーザー発言の選択
   - 選択発言に対する改善版（Better Response）表示 (v3.4.2改善)
   - レベル別の模範例（Mastery/Secure/Developing/Error）

6. **トレーニング推奨**:
   - おすすめミニゲーム
   - おすすめ教科書章
   - 弱点に特化したドリル

**技術実装**:
- フィードバック生成: `services/gemini/analysis/feedback.ts`
- フック: `useFeedbackLogic.ts`

---

#### 3.3.5 TextbookScreen（教科書学習画面）

**役割**: 理論学習と練習問題による知識習得

**章構成**:

| 章 | タイトル | 内容 |
|----|---------|------|
| 第1章 | クレーム・エビデンス基礎 | 主張と証拠の構成要素 |
| 第2章 | 反論の型（7 Attack Points） | 7つの攻撃パターンの学習 |
| 第3章 | 比重分析（Weighing） | メリット・デメリット比較 |
| 第4章 | 定義の堅牢性 | 定義攻撃への対策 |

**学習フロー**:
1. 理論解説の表示
2. AI生成の練習問題
3. ユーザー回答の入力
4. AI採点とフィードバック
5. 次の問題 or 次の章へ

**技術実装**:
- 問題生成: `services/gemini/training/textbook.ts`
- フック: `useTextbookLogic.ts`

---

#### 3.3.6 MiniGameScreen（ミニゲーム画面）

**役割**: ゲーム形式でスキルを楽しく訓練

**ゲーム種類**:

1. **EVIDENCE_FILL** - 証拠埋め込みゲーム
   - 不完全な主張に適切な証拠を選択

2. **FALLACY_QUIZ** - 誤謬クイズ
   - 10種類の論理的誤謬を識別

3. **ISSUE_PUZZLE** - イシューパズル
   - Toulmin要素を正しい順序に並べ替え

4. **COMBO_REBUTTAL** - コンボ再反論
   - 複数の反論テクニックを組み合わせる

5. **FERMI_ESTIMATION** - フェルミ推定
   - 概算計算能力の訓練

6. **LATERAL_THINKING** - 側方思考
   - 創造的発想力の育成

7. **ACTIVE_INOCULATION** - 能動的接種演習
   - 詭弁を意図的に構成し、構造理解を深める

**ゲームフロー**:
1. ゲーム選択
2. 問題表示（ラウンド制）
3. ユーザー回答
4. 即時フィードバック
5. スコア集計・結果表示

**技術実装**:
- コンテンツ生成: `services/gemini/training/minigame.ts`
- フック: `useMiniGameLogic.ts`

---

#### 3.3.7 HistoryScreen（履歴画面）

**役割**: 過去の議論の閲覧と統計表示

**表示内容**:
- 議論リスト（論題、日時、スコア）
- 各議論の詳細（クリックで展開）
- 統計情報:
  - 総議論回数
  - 平均スコア
  - スコアトレンド（折れ線グラフ）
  - 弱点分布

**操作**:
- 📖 **再生**: 過去の議論を読み直す
- 🗑️ **削除**: 議論履歴を削除
- 📊 **統計表示**: 全体的な成長を可視化

**技術実装**:
- データ管理: `useDebateArchives.ts`
- フック: `useHistoryLogic.ts`

---

## 4. コア機能仕様

### 4.1 論理構造分析（Toulmin Model）

**Toulmin Modelとは**:
イギリスの哲学者Stephen Toulminが提唱した議論の構造モデル。

**7つの構成要素**:

| 要素 | 英語名 | 説明 | スコアリング基準 |
|-----|--------|------|----------------|
| **主張** | Claim | 議論で伝えたい結論 | 明確性・具体性 |
| **根拠** | Data/Grounds | 主張を支える事実・証拠 | 信頼性・関連性・量 |
| **論拠** | Warrant | データと主張を結びつける理由 | 論理的妥当性 |
| **裏付け** | Backing | 論拠をさらに支える証拠 | 権威性・実証性 |
| **反駁** | Rebuttal | 反論への予見と対応 | 網羅性・説得力 |
| **限定** | Qualifier | 主張の確信度・適用範囲 | 適切性・慎重さ |
| **結論** | Conclusion | 議論全体のまとめ | 首尾一貫性 |

**分析方法**:
- 各ユーザー発言をGemini APIに送信
- レスポンススキーマで7要素のスコア（0.0-1.0）を取得
- リアルタイムでUIに表示

**実装ファイル**:
- `services/gemini/analysis/structure.ts`
- `hooks/useMessageAnalysis.ts`
- `components/chat/message/StructureHeatmap.tsx`

---

### 4.2 議論フェーズ管理

**議論フェーズ（DebateProgressPhase）**:

議論は以下の6つのフェーズで進行します。

1. **POSITION** - 立場表明
   - ユーザーとAIが互いの立場を明確化
   - 主張の骨子を提示

2. **GROUNDS** - 根拠構築
   - 主張を支える証拠・理由を提示
   - データの信頼性を問う

3. **CLASH** - 対立点の明確化
   - 意見の相違点を特定
   - 論点を整理

4. **REBUTTAL** - 反論・再反論
   - 相手の主張に反論
   - 自分の主張を防御

5. **WEIGHING** - 比重分析
   - メリット・デメリットを比較
   - 優先順位を議論

6. **CLOSING** - 結論・まとめ
   - 議論全体を総括
   - 最終的な主張を再確認

**フェーズ判定**:
- AIが会話の流れから自動判定
- 各フェーズに応じた「勝利条件」をユーザーに提示

**実装ファイル**:
- `services/gemini/analysis/phase.ts`
- `core/types/debate.types.ts` (DebateFlowState)
- `components/chat/DebatePhaseBar.tsx`

---

### 4.3 立証責任トラッカー（v3.4.2新機能）

**立証責任（Burden of Proof）とは**:
議論において、ある主張を証明する義務が誰にあるかを示す概念。

**機能概要**:
- 議論中の全ての主張と立証責任を追跡
- CQ（Critical Question: 批判的質問）を「単なる疑問」と「反証主張」に区別
- 立証責任の状態を可視化

**立証責任の種類（BurdenType）**:

| タイプ | 説明 | 例 |
|-------|------|---|
| `claim` | 新しい主張 | 「死刑制度は廃止すべきだ」 |
| `simple_question` | 単なる疑問（立証責任は元の主張者に残る） | 「その統計の出典は？」 |
| `counter_claim` | 反証主張（質問者に立証責任が移る） | 「むしろ犯罪抑止効果がある」 |

**立証責任の状態（BurdenStatus）**:

| 状態 | 説明 |
|-----|------|
| `active` | 未だ証明されていない（立証義務が残っている） |
| `fulfilled` | 十分な証拠が提示され、立証完了 |
| `challenged` | 相手から反論され、再立証が必要 |
| `abandoned` | 主張者が立証を放棄（議論が進んだ等） |

**UI表示**:
- ChatScreen右側にパネル表示
- トグルボタンで表示/非表示切り替え
- 各立証責任を展開/折りたたみ可能
- ユーザー/AI別に色分け表示

**実装ファイル**:
- 型定義: `core/types/burden.types.ts`
- AI分析: `services/gemini/analysis/burden.ts`
- スキーマ: `services/gemini/analysis/burden/schema.ts`
- UIコンポーネント: `components/chat/BurdenTracker.tsx`
- 統合: `components/ChatScreen.tsx`

---

### 4.4 SBIフィードバック・プロトコル

**SBIモデルとは**:
Center for Creative Leadership が提唱したフィードバックの構造化手法。

**3要素**:

1. **Situation（状況）**:
   - どの場面での行動か
   - 例: 「相手が環境コストを指摘した際...」

2. **Behavior（行動）**:
   - 具体的にどんな行動をとったか
   - 例: 「あなたは具体的な数値を提示せず、感情的な反論に終始しました」

3. **Impact（影響）**:
   - その行動がどんな結果を生んだか
   - 例: 「その結果、議論の客観性が失われ、説得力が低下しました」

**適用箇所**:
- FeedbackScreen の DetailedReviewSection
- 各メッセージへの個別アドバイス

**実装ファイル**:
- `services/gemini/analysis/feedback.ts`
- `components/feedback/DetailedReviewSection.tsx`

---

### 4.5 弱点プロファイル分析

**目的**:
ユーザーの過去の議論データを集計し、最も弱い要素を特定して個別最適化されたトレーニングを提案。

**弱点キー（WeaknessKey）**:

| キー | 日本語名 | 説明 |
|-----|---------|------|
| `warrant_clarity` | 論拠の明確さ | データと主張を繋ぐ論理が弱い |
| `evidence_quality` | 証拠の質 | 引用・統計が不足または不適切 |
| `fallacy_frequency` | 誤謬の頻度 | 論理的誤謬を犯しやすい |
| `question_depth` | 質問の深さ | 質問が浅く、本質に迫れない |
| `weighing_clarity` | 比重分析 | メリット・デメリット比較が弱い |
| `structure_consistency` | 構造的一貫性 | 議論の流れが一貫していない |
| `emotional_control` | 感情制御 | 感情的になりやすい |
| `listening_responsiveness` | 傾聴・応答 | 相手の主張を理解せず反論 |

**分析方法**:
- LocalStorageに保存された全議論の `sessionMetrics` を集計
- 各WeaknessKeyの成功率（numerator/denominator）を計算
- 最もスコアが低い要素を「現在の弱点」として特定

**実装ファイル**:
- 型定義: `core/types/homework.types.ts`
- 分析サービス: `services/gemini/training/weakness.ts`
- データ管理: `useDebateArchives.ts`

---

## 5. AI分析エンジン

### 5.1 Gemini API統合

**使用モデル**:
- **Gemini 2.5 Flash** (`gemini-2.0-flash-exp`)
- 高速・低コスト・高精度な推論能力

**APIクライアント設定**:
```typescript
// services/gemini/client.ts
import { GoogleGenerativeAI } from '@google/genai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
export const genAI = new GoogleGenerativeAI(apiKey);

export const createChatModel = () => {
  return genAI.getGenerativeModel({
    model: 'gemini-2.0-flash-exp',
    generationConfig: {
      temperature: 0.7,
      topP: 0.95,
      maxOutputTokens: 8192,
    },
  });
};
```

**Structured Output (JSON Schema)**:
- 全ての分析リクエストは `responseMimeType: "application/json"` を使用
- レスポンススキーマを事前定義し、型安全性を確保

**例（構造分析のスキーマ）**:
```typescript
// services/gemini/analysis/structure/schema.ts
import { Type, Schema } from '@google/genai';

export const structureAnalysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    claim: { type: Type.NUMBER, description: '主張の明確さ (0.0-1.0)' },
    reason: { type: Type.NUMBER, description: '理由の妥当性 (0.0-1.0)' },
    evidence: { type: Type.NUMBER, description: '証拠の質 (0.0-1.0)' },
    warrant: { type: Type.NUMBER, description: '論拠の強さ (0.0-1.0)' },
    backing: { type: Type.NUMBER, description: '裏付けの有無 (0.0-1.0)' },
    rebuttal: { type: Type.NUMBER, description: '反駁の予見 (0.0-1.0)' },
    qualifier: { type: Type.NUMBER, description: '限定の適切さ (0.0-1.0)' },
  },
  required: ['claim', 'reason', 'evidence', 'warrant', 'backing', 'rebuttal', 'qualifier'],
};
```

---

### 5.2 分析サービス一覧

#### 5.2.1 セットアップ関連（setup/）

**topic.ts - 論題生成**:
- 機能: ユーザーの関心に基づいて論題を提案
- 入力: キーワード、カテゴリ
- 出力: 5つの論題候補

**scenario.ts - シナリオ生成**:
- 機能: ストーリーモード用のシナリオを生成
- 入力: テーマ、難易度
- 出力: ストーリー背景、キャラクター、選択肢

**premise.ts - 前提生成**:
- 機能: 論題から定義とゴールを生成
- 入力: 論題、立場
- 出力: Definitions（定義リスト）、Goal（議論の目的）

---

#### 5.2.2 リアルタイム分析（analysis/）

**structure.ts - 構造分析**:
- 機能: 発言のToulmin要素をスコアリング
- 入力: ユーザー発言テキスト
- 出力: 7要素のスコア（0.0-1.0）
- 呼び出し: 各メッセージ送信時

**phase.ts - フェーズ分析**:
- 機能: 現在の議論フェーズを判定
- 入力: 全メッセージ履歴
- 出力: 現在フェーズ（POSITION/GROUNDS/CLASH等）、勝利条件
- 呼び出し: 定期的（メッセージ3件ごと等）

**strategy.ts - 戦略提案**:
- 機能: ユーザーの次の一手を提案
- 入力: 現在の議論状況、ユーザーの弱点
- 出力: 戦略アドバイス、具体的な発言例
- 呼び出し: ユーザーが「戦略ボタン」を押した時

**summary.ts - 要約生成**:
- 機能: 議論の要点を抽出
- 入力: 全メッセージ履歴
- 出力: 3-5個の箇条書き要約
- 呼び出し: ユーザーが「要約ボタン」を押した時

**advice.ts - アドバイス生成**:
- 機能: 誤謬検出とアドバイス
- 入力: ユーザーの最近の発言
- 出力: 検出された誤謬、改善提案
- 呼び出し: ユーザーが「アドバイスボタン」を押した時

**fact-check.ts - ファクトチェック**:
- 機能: 発言内容の事実確認
- 入力: 主張文、証拠
- 出力: 事実性の評価、信頼性スコア
- 呼び出し: オプション機能（未実装）

**feedback.ts - フィードバック生成**:
- 機能: 議論終了後の包括的フィードバック
- 入力: 全メッセージ履歴、論題、設定
- 出力: FeedbackData（スコア、メトリクス、詳細レビュー、推奨等）
- 呼び出し: 議論終了時

**burden.ts - 立証責任分析** (v3.4.2):
- 機能: 議論中の立証責任を追跡
- 入力: 全メッセージ履歴、論題
- 出力: BurdenAnalysis（立証責任リスト、サマリー）
- 呼び出し: ユーザーが「立証責任トラッカー」を起動した時

---

#### 5.2.3 学習・訓練（training/）

**textbook.ts - 教科書問題生成・採点**:
- `generateTextbookProblem()`: 章に応じた練習問題を生成
- `evaluateTextbookAnswer()`: ユーザー回答を採点しフィードバック

**quiz.ts - クイズ生成**:
- 機能: 7つの反論タイプクイズを生成
- 出力: 問題文、選択肢、正解、解説

**minigame.ts - ミニゲームコンテンツ生成**:
- 機能: 6種類のミニゲームの問題を生成
- 入力: ゲームタイプ、難易度
- 出力: 問題、選択肢、正解、解説

**weakness.ts - 弱点分析**:
- 機能: 過去データから弱点プロファイルを生成
- 入力: 全議論履歴
- 出力: WeaknessProfile（8つのWeaknessKeyのスコア）

**lab.ts - ラボ機能**:
- `ToulminLab`: ユーザーの発言をToulmin要素に分解
- `DefinitionLab`: 定義の堅牢性をチェック

---

### 5.3 プロンプトエンジニアリング

**プロンプト構造**:
全てのAIリクエストは以下の構造を持ちます。

```
[System Instruction]
  ↓
[Mode-Specific Instruction]
  ↓
[Task-Specific Instruction]
  ↓
[Context (Conversation History)]
  ↓
[User Input]
```

**System Instruction**:
- AIの基本的な役割定義
- 議論の原則（論理性、客観性、公平性）
- 禁止事項（Markdown装飾、思考プロセスの露出等）

**Mode-Specific Instruction**:
- ディベートモードに応じた振る舞い
- 例: DEBATEモードでは「論理的に反論」、TRAININGモードでは「弱点を攻撃」

**実装ファイル**:
- `services/gemini/instructions.ts` - 共通システムインストラクション
- `services/gemini/prompts/modes/*.ts` - モード別プロンプト

---

## 6. ディベートモード詳細

### 6.1 モード一覧

| モード | 英語名 | 説明 | 難易度 |
|-------|--------|------|--------|
| **通常ディベート** | DEBATE | 1対1の論理的議論 | 全レベル |
| **学習モード** | STUDY | 優しく教えるAI | EASY |
| **トレーニング** | TRAINING | 弱点を集中攻撃 | HARD |
| **ドリル** | DRILL | 特定スキルの反復練習 | NORMAL |
| **ファシリテーション** | FACILITATION | 2つの立場を調停 | NORMAL |
| **思考ジム** | THINKING_GYM | フレームワークを使った思考訓練 | NORMAL |
| **ストーリー** | STORY | 物語形式の意思決定 | EASY |
| **デモ** | DEMO | 模擬ディベート観戦 | EASY |
| **教科書** | TEXTBOOK | 理論学習と練習問題 | - |
| **ミニゲーム** | MINIGAME | ゲーム形式の訓練 | - |

---

### 6.2 各モードの仕様

#### 6.2.1 DEBATE（通常ディベート）

**概要**: 最も基本的な1対1の議論モード

**AI振る舞い**:
- EASY: 肯定的・教育的な態度
- NORMAL: 論理的一貫性を重視
- HARD: 厳密な証拠を要求
- EXTREME: 詭弁・レトリック・心理戦を使用（ユーザーの検知能力を試す）

**プロンプト例**:
```
あなたは論理的思考を鍛えるディベートパートナーです。
ユーザーの主張に対し、以下の点を重視して反論してください：
- 証拠の信頼性
- 論拠の妥当性
- 反駁への対応
```

**実装**:
- プロンプト: `services/gemini/prompts/modes/standard.ts`

---

#### 6.2.2 FACILITATION（ファシリテーション）

**概要**: 対立する2つの立場（キャラクターA・B）を調停

**キャラクター設定**:
- **キャラクターA（Red）**: 感情・価値観・倫理・主観を重視
- **キャラクターB（Blue）**: 効率・データ・利害・客観を重視

**ユーザーの役割**:
両者の意見を聞き、共通点を見出し、合意形成を促す

**特別UI**:
- **Virtual Whiteboard**: 両者の意見の共通項をリアルタイム抽出・可視化

**実装**:
- プロンプト: `services/gemini/prompts/modes/facilitation.ts`
- セッション管理: `services/gemini/session/facilitation.ts`
- UI: `components/chat/WhiteboardModal.tsx`

---

#### 6.2.3 TRAINING（トレーニング）

**概要**: ユーザーの弱点を集中的に攻撃し、克服を促す

**動作**:
1. 弱点プロファイルを読み込む
2. 最もスコアが低いWeaknessKeyを特定
3. AIがその弱点を突く質問・反論を行う

**例**:
- 弱点が `evidence_quality` の場合 → AIは証拠の出典を徹底的に要求
- 弱点が `emotional_control` の場合 → AIは挑発的な発言で冷静さを試す

**実装**:
- プロンプト: `services/gemini/prompts/modes/training.ts`
- 弱点分析: `services/gemini/training/weakness.ts`

---

#### 6.2.4 STORY（ストーリーモード）

**概要**: 物語形式で意思決定を学ぶ

**流れ**:
1. AIがシナリオを提示（例: 企業の経営判断、倫理的ジレンマ）
2. ユーザーが選択肢を選ぶ
3. AIが結果を提示し、次のシーンへ
4. 最終的な結果と評価

**評価軸**:
- 決定の合理性
- 社会的影響
- 倫理的配慮

**実装**:
- プロンプト: `services/gemini/prompts/modes/story.ts`
- 型定義: `core/types/story.types.ts`

---

#### 6.2.5 DEMO（デモンストレーション）

**概要**: AIが両陣営を演じ、模擬ディベートを見せる

**目的**:
- 高度な議論技術を観察
- 戦略パターンを学習

**ユーザー操作**:
- 「次へ」ボタンで議論を進める
- 途中で一時停止し、分析を確認

**評価**:
- Clash分析（対立点の鮮明さ）
- 戦略ハイライト（優れたテクニック）
- 学習ポイント

**実装**:
- プロンプト: `services/gemini/prompts/modes/demo.ts`
- 型定義: `core/types/story.types.ts` (DemoAnalysis)

---

#### 6.2.6 THINKING_GYM（思考ジム）

**概要**: 特定の思考フレームワークを使った訓練

**フレームワーク例**:
- **MECE（Mutually Exclusive, Collectively Exhaustive）**: 漏れなくダブりなく
- **ロジックツリー**: 問題を階層的に分解
- **SWOT分析**: 強み・弱み・機会・脅威
- **Why-Why分析**: 根本原因の探求

**流れ**:
1. フレームワークの説明
2. 問題提示
3. ユーザーがフレームワークを適用
4. AIが評価・フィードバック

**実装**:
- UI: `components/chat/ThinkingGymModal.tsx`

---

## 7. フィードバックシステム

### 7.1 評価メトリクス

**8つの評価軸**:

| メトリクス | 英語名 | 説明 | 評価基準 |
|-----------|--------|------|---------|
| **論理性** | logic | 主張と根拠の論理的整合性 | Toulmin要素の充足度 |
| **証拠性** | evidence | 事実・データ・引用の質と量 | 信頼できる出典の使用 |
| **再反論** | rebuttal | 相手の反論への対応 | 予見的反駁の有無 |
| **説得性** | persuasion | 第三者への説得力 | 修辞技法の適切さ |
| **一貫性** | consistency | 議論全体の首尾一貫性 | 矛盾の有無 |
| **建設性** | constructiveness | 議論の前進への貢献 | 新しい視点の提示 |
| **客観性** | objectivity | 感情に流されない冷静さ | 感情的表現の抑制 |
| **明確性** | clarity | 発言の明瞭さ・分かりやすさ | 専門用語の適切な説明 |

**スコアリング方法**:
- 各軸を0.0-1.0でスコアリング
- 総合スコアは8軸の平均 × 100（0-100点）

---

### 7.2 詳細レビュー

**個別メッセージへのフィードバック**:

各ユーザー発言に対し、以下の構造でフィードバックを生成:

```typescript
interface DetailedReview {
  messageIndex: number;          // メッセージ番号
  critique: string;              // SBIモデルによる批評
  detectedFallacies: string[];   // 検出された誤謬
  betterResponse: string;        // 改善版の発言例（v3.4.2改善）
  positives: string[];           // 良かった点
}
```

**SBIフィードバック例**:
```
【Situation】
相手が「再生可能エネルギーのコストが高い」と指摘した際、

【Behavior】
あなたは「将来的には安くなる」とだけ述べ、具体的な根拠を示しませんでした。

【Impact】
その結果、主張の説得力が低下し、相手に反論の隙を与えてしまいました。
```

---

### 7.3 トレーニング推奨

**推奨アルゴリズム**:

1. **弱点特定**:
   - フィードバックの8軸スコアから最も低い軸を特定
   - 過去の弱点プロファイルと照合

2. **推奨生成**:
   - **ミニゲーム推奨**: 弱点に対応するゲームを提案
     - 例: `evidence_quality` が低い → EVIDENCE_FILL ゲーム
   - **教科書章推奨**: 関連する理論章を提案
     - 例: `rebuttal` が低い → 第2章「反論の型」
   - **思考ジム推奨**: 適切なフレームワークを提案
   - **ドリルモード推奨**: 弱点に特化した訓練セッション

**実装**:
```typescript
interface TrainingRecommendation {
  minigames: MiniGameType[];     // 推奨ミニゲーム
  textbookChapters: number[];    // 推奨教科書章
  thinkingFrameworks: string[];  // 推奨フレームワーク
  drillFocus: WeaknessKey;       // ドリルの焦点
  explanation: string;           // 推奨理由
}
```

---

### 7.4 模範例表示（Exemplars）

**レベル別の模範例**:

各評価軸に対し、4つのレベルの例文を表示:

| レベル | 説明 | 色 |
|-------|------|---|
| **Mastery** | 理想的な発言 | 緑 |
| **Secure** | 十分なレベル | 青 |
| **Developing** | 改善の余地あり | 黄 |
| **Error** | 避けるべき発言 | 赤 |

**v3.4.2改善点**:
- ユーザーが自分の発言を選択
- 選択した発言に対する専用の改善版（`betterResponse`）を表示
- より個別化されたフィードバック

**実装**:
- コンポーネント: `components/feedback/ExemplarSection.tsx`
- 型定義: `core/types/feedback.types.ts` (ExemplarMetricSet)

---

## 8. 学習・トレーニング機能

### 8.1 教科書機能（TextbookScreen）

**章構成**:

#### 第1章: クレーム・エビデンス基礎
- **学習内容**:
  - 主張（Claim）とは何か
  - 証拠（Evidence）の種類と質
  - 論拠（Warrant）の重要性
- **練習問題**:
  - 不完全な主張に証拠を追加する
  - 論拠の妥当性を評価する

#### 第2章: 反論の型（7 Attack Points）
- **学習内容**:
  - 7つの反論パターン
    1. 定義攻撃
    2. 因果関係攻撃
    3. 証拠攻撃
    4. 論拠攻撃
    5. 比重攻撃
    6. 代替案攻撃
    7. 実現可能性攻撃
- **練習問題**:
  - 相手の主張に対し、適切な反論タイプを選択
  - 反論文を作成

#### 第3章: 比重分析（Weighing）
- **学習内容**:
  - メリット・デメリットの比較方法
  - 優先順位の付け方
  - トレードオフの考え方
- **練習問題**:
  - 複数の主張の重要度を比較
  - 最も説得力のある比重論証を作成

#### 第4章: 定義の堅牢性
- **学習内容**:
  - 定義攻撃への対策
  - 曖昧さの排除
  - 操作的定義の作成
- **練習問題**:
  - 脆弱な定義を堅牢にする
  - 定義攻撃に反論する

**実装**:
- 問題生成: `services/gemini/training/textbook.ts`
- コンポーネント: `components/textbook/*.tsx`

---

### 8.2 ミニゲーム機能（MiniGameScreen）

#### 8.2.1 EVIDENCE_FILL（証拠埋め込みゲーム）

**ゲーム内容**:
1. AIが不完全な主張を提示
   - 例: 「気候変動対策は急務だ。なぜなら[　]だからだ。」
2. ユーザーが適切な証拠を選択（4択）
3. 正解/不正解のフィードバック

**訓練スキル**:
- 証拠の適切性判断
- 主張と証拠の関連性理解

---

#### 8.2.2 FALLACY_QUIZ（誤謬クイズ）

**ゲーム内容**:
1. AIが論理的誤謬を含む発言を提示
2. ユーザーが誤謬のタイプを選択（4択）
3. 解説と正解表示

**誤謬タイプ**:
- ストローマン（藁人形論法）
- 論点ずらし
- 人身攻撃
- 早急な一般化
- 誤った二分法
- 滑り坂論法
- 権威への訴え
- 感情への訴え
- 循環論法
- 偽の因果関係

---

#### 8.2.3 ISSUE_PUZZLE（イシューパズル）

**ゲーム内容**:
1. AIがバラバラのToulmin要素を提示
   - Claim, Data, Warrant, Conclusion
2. ユーザーが正しい順序にドラッグ&ドロップ
3. 正しい構造の解説

**訓練スキル**:
- 論理構造の理解
- 議論の組み立て方

---

#### 8.2.4 COMBO_REBUTTAL（コンボ再反論）

**ゲーム内容**:
1. AIが相手の主張を提示
2. ユーザーが複数の反論テクニックを組み合わせる
3. 組み合わせの効果性を評価

**訓練スキル**:
- 多角的反論
- 戦略的思考

---

#### 8.2.5 FERMI_ESTIMATION（フェルミ推定）

**ゲーム内容**:
1. AIが推定問題を提示
   - 例: 「日本全国のコンビニの数は？」
2. ユーザーが概算プロセスを記述
3. AIが思考プロセスを評価

**訓練スキル**:
- 論拠なき想像の排除
- 段階的推論

---

#### 8.2.6 LATERAL_THINKING（側方思考）

**ゲーム内容**:
1. AIが制約条件のある問題を提示
2. ユーザーが創造的な解決策を考案
3. 発想の独創性を評価

**訓練スキル**:
- 固定観念の打破
- 多角的視点

---

#### 8.2.7 ACTIVE_INOCULATION(能動的接種演習)

**ゲーム内容**:
1. AIがシナリオを提示(例: 「成績不振の学生として教師を説得する」)
2. 指定された4-6個の詭弁・誤謬を意図的に使用して説得文を作成
3. AIが詭弁の使用状況、説得力、創造性を評価

**評価基準**:
- **詭弁の使用(60点)**: 指定された詭弁を正確に、自然に使用できているか
- **説得力(25点)**: 詭弁を使いつつも表面的には説得力があるか
- **創造性(15点)**: 複数の詭弁を巧みに組み合わせているか

**訓練スキル**:
- 詭弁の構造理解
- 不当な論理操作の識別力向上
- 批判的思考力の強化

**重要な倫理的配慮**:
この演習の目的は「詭弁を見抜く力を養うこと」であり、実際に詭弁を使うことを推奨するものではありません。情報の予防接種として、詭弁の構造を理解することで、現実の不当な論理操作を識別する能力を高めます。

---

### 8.3 弱点プロファイル

**データ構造**:
```typescript
interface WeaknessProfile {
  lastUpdated: string;  // ISO 8601形式
  metrics: Record<WeaknessKey, WeaknessMetric>;
}

interface WeaknessMetric {
  numerator: number;    // 成功回数
  denominator: number;  // 試行回数
  score: number;        // 成功率（0.0-1.0）
}
```

**更新タイミング**:
- 議論終了時
- フィードバック生成時に各WeaknessKeyのスコアを計算
- LocalStorageに蓄積

**活用**:
- TRAININGモードで弱点を集中攻撃
- トレーニング推奨の生成
- 成長グラフの表示

---

## 9. データ構造と型定義

### 9.1 主要な型定義

#### 9.1.1 DebateSettings

```typescript
interface DebateSettings {
  topic: string;                    // 論題
  mode: DebateMode;                 // ディベートモード
  difficulty: Difficulty;           // 難易度
  userPosition?: 'for' | 'against' | 'any';  // ユーザーの立場
  premise?: PremiseData;            // 前提（定義・ゴール）
  demoSettings?: {
    strategy: string;
    focusPoint: string;
  };
}
```

---

#### 9.1.2 Message

```typescript
interface Message {
  role: 'user' | 'ai';              // 発言者
  text: string;                     // 発言内容
  timestamp: number;                // タイムスタンプ（Unix時間）
  structureScore?: StructureScore;  // 構造分析スコア
  phase?: DebateProgressPhase;      // 発言時のフェーズ
}

interface StructureScore {
  claim: number;        // 0.0-1.0
  reason: number;
  evidence: number;
  warrant: number;
  backing: number;
  rebuttal: number;
  qualifier: number;
}
```

---

#### 9.1.3 FeedbackData

```typescript
interface FeedbackData {
  score: number;                    // 総合スコア（0-100）
  metrics: EvaluationMetrics;       // 8軸評価
  strengths: string[];              // 強み
  weaknesses: string[];             // 弱み
  advice: string[];                 // アドバイス
  detailedReview: DetailedReview[]; // 個別メッセージレビュー
  exemplars: ExemplarMetricSet[];   // 模範例
  trainingRecommendation?: TrainingRecommendation;  // 訓練推奨
  sessionMetrics?: Record<WeaknessKey, WeaknessMetric>;  // 弱点メトリクス
}

interface EvaluationMetrics {
  logic: number;           // 論理性（0.0-1.0）
  evidence: number;        // 証拠性
  rebuttal: number;        // 再反論
  persuasion: number;      // 説得性
  consistency: number;     // 一貫性
  constructiveness: number;// 建設性
  objectivity: number;     // 客観性
  clarity: number;         // 明確性
}
```

---

#### 9.1.4 BurdenOfProof（v3.4.2）

```typescript
interface BurdenOfProof {
  id: string;                       // 一意ID
  type: BurdenType;                 // claim | simple_question | counter_claim
  status: BurdenStatus;             // active | fulfilled | challenged | abandoned
  claimText: string;                // 主張文
  claimMessageIndex: number;        // 主張が発せられたメッセージ番号
  claimant: 'user' | 'ai';          // 主張者
  burdenHolder: 'user' | 'ai';      // 現在の立証責任者
  evidenceMessageIndices: number[]; // 証拠が提示されたメッセージ番号リスト
  isCriticalQuestion: boolean;      // CQかどうか
  criticalQuestionText?: string;    // CQの内容
  criticalQuestionIndex?: number;   // CQのメッセージ番号
  explanation: string;              // 立証責任の説明
  assessment?: string;              // 立証状況の評価
  createdAt: number;                // 作成時刻（Unix時間）
  resolvedAt?: number;              // 解決時刻
}

interface BurdenAnalysis {
  burdens: BurdenOfProof[];         // 立証責任リスト
  summary: {
    userActiveBurdens: number;      // ユーザーの未解決立証責任数
    aiActiveBurdens: number;        // AIの未解決立証責任数
    totalResolved: number;          // 解決済み総数
    criticalQuestionsCount: number; // CQ総数
  };
}
```

---

### 9.2 LocalStorage スキーマ

**キー名**: `debate_archives`

**スキーマバージョン**: 4

```typescript
interface DebateArchivesData {
  schemaVersion: number;           // 現在4
  archives: DebateArchive[];       // 議論履歴
  homeworkTasks: HomeworkTask[];   // 宿題タスク
  weaknessProfile: WeaknessProfile;// 弱点プロファイル
}

interface DebateArchive {
  id: string;                      // 一意ID（UUID）
  timestamp: number;               // 保存時刻
  settings: DebateSettings;        // 設定
  messages: Message[];             // メッセージ履歴
  feedback: FeedbackData;          // フィードバック
}
```

---

## 10. 技術スタック

### 10.1 フロントエンド

| 技術 | バージョン | 用途 |
|-----|-----------|------|
| **React** | 19.2.0 | UIフレームワーク |
| **TypeScript** | 5.8.2 | 型安全な開発 |
| **Vite** | 6.2.0 | ビルドツール・開発サーバー |
| **Tailwind CSS** | - | スタイリング（CDN） |
| **Lucide React** | 0.555.0 | アイコンライブラリ |
| **React Hot Toast** | 2.6.0 | トースト通知 |

---

### 10.2 AI・API

| 技術 | バージョン | 用途 |
|-----|-----------|------|
| **Google Gemini API** | 2.5 Flash | AI推論エンジン |
| **@google/genai** | 1.30.0 | Gemini SDK |

---

### 10.3 テスト・品質管理

| 技術 | バージョン | 用途 |
|-----|-----------|------|
| **Vitest** | 4.0.16 | ユニットテスト |
| **@testing-library/react** | 16.3.1 | コンポーネントテスト |
| **@vitest/coverage-v8** | 4.0.16 | カバレッジ計測 |
| **ESLint** | 9.39.2 | 静的解析 |
| **Prettier** | 3.7.4 | コードフォーマット |

---

### 10.4 開発環境

- **Node.js**: v18以降推奨
- **パッケージマネージャー**: npm
- **エディタ**: VSCode推奨

---

## 11. UI/UXデザイン

### 11.1 カラーパレット

| 用途 | カラー | Tailwind Class | 説明 |
|-----|--------|---------------|------|
| **ブランドプライマリ** | `#2563eb` | `blue-600` | 信頼と論理 |
| **成功・論理健全** | `#10b981` | `emerald-500` | 健全な論理構造 |
| **警告・誤謬** | `#ef4444` | `rose-500` | 詭弁・論理の穴 |
| **ニュートラル背景** | `#f8fafc` | `slate-50` | 背景・基盤 |
| **テキストプライマリ** | `#1e293b` | `slate-800` | 本文テキスト |
| **テキストセカンダリ** | `#64748b` | `slate-500` | サブテキスト |

---

### 11.2 タイポグラフィ

- **フォント**: システムフォント（-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif）
- **見出し（H1）**: `text-3xl font-bold`
- **見出し（H2）**: `text-2xl font-semibold`
- **本文**: `text-base`
- **キャプション**: `text-xs text-slate-500`

---

### 11.3 アニメーション

**定義済みアニメーション**:

1. **fade-in-up**:
   - 用途: 要素の出現
   - デュレーション: 0.5s
   - イージング: ease-out
   - 効果: `translateY(20px) → 0, opacity: 0 → 1`

2. **pop-in**:
   - 用途: モーダル・ボタンの強調
   - デュレーション: 0.4s
   - イージング: `cubic-bezier(0.175, 0.885, 0.32, 1.275)`
   - 効果: `scale(0.9) → 1`

3. **shimmer**:
   - 用途: ローディング中のプログレスバー
   - デュレーション: 1.5s
   - イージング: linear
   - ループ: infinite

---

### 11.4 レスポンシブデザイン

**ブレークポイント**:
- **Mobile**: `< 640px`
- **Tablet**: `640px - 1024px`
- **Desktop**: `>= 1024px`

**対応**:
- 全画面がモバイルファーストで設計
- Tailwindの `sm:`, `md:`, `lg:` プレフィックスで調整

---

### 11.5 アクセシビリティ

- **キーボードナビゲーション**: 全インタラクティブ要素にフォーカス可能
- **ARIA属性**: ボタン・モーダルに適切なARIAラベル
- **カラーコントラスト**: WCAG AA基準を満たす

---

## 12. パフォーマンス最適化

### 12.1 コード分割（Code Splitting）

**Vite設定（vite.config.ts）**:
```typescript
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'vendor': ['lucide-react', 'react-hot-toast'],
          'gemini': ['@google/genai'],
          'chat': [
            './components/ChatScreen.tsx',
            './components/chat/MessageItem.tsx',
            './components/chat/InputArea.tsx',
          ],
          'feedback': [
            './components/FeedbackScreen.tsx',
            './components/feedback/LogicSection.tsx',
          ],
        },
      },
    },
  },
});
```

**効果**:
- 最大チャンクサイズ: 861KB → 257KB（70%削減）
- 初回ロード時間の短縮

---

### 12.2 React最適化

**1. メモ化（Memoization）**:
- `React.memo()`: 頻繁に再レンダリングされるコンポーネント
- `useMemo()`: 高コストな計算結果
- `useCallback()`: イベントハンドラ

**2. 遅延ローディング（Lazy Loading）**:
```typescript
const TextbookScreen = lazy(() => import('./components/TextbookScreen'));
const MiniGameScreen = lazy(() => import('./components/MiniGameScreen'));
```

---

### 12.3 API呼び出し最適化

**1. デバウンス（Debounce）**:
- ユーザー入力中の連続API呼び出しを抑制
- 例: トピック検索、リアルタイム分析

**2. キャッシング**:
- 立証責任トラッカーの結果をキャッシュ（v3.4.2）
- 再表示時にAPI再呼び出しを回避

---

### 12.4 ビルド最適化

**成果（v3.4.1リファクタリング後）**:
- ✅ 型エラー: 0件
- ✅ non-null assertion: 完全除去
- ✅ 最大チャンクサイズ: 70%削減
- ✅ コード行数: ~500行削減
- ✅ ユニットテスト: 81テストケース追加

---

## 13. 開発ガイドライン

### 13.1 コーディング規約

**必読ドキュメント**:
1. [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) - 新しいコーディングパターン
2. [ARCHITECTURE.md](./ARCHITECTURE.md) - システム全体の理解
3. [REFACTORING_REPORT.md](./REFACTORING_REPORT.md) - 変更内容の詳細

**重要な原則**:
- `!` (non-null assertion) の使用禁止 → 型ガードを使用
- `any` 型の回避
- `parseApiError` によるエラー処理の統一
- コンポーネントは100-150行以内に抑える
- 単一責任原則の遵守

---

### 13.2 Git ワークフロー

**ブランチ戦略**:
- `main`: 本番環境
- `develop`: 開発環境
- `feature/*`: 新機能開発
- `bugfix/*`: バグ修正

**コミットメッセージ**:
```
<type>(<scope>): <subject>

<body>
```

**type**:
- `feat`: 新機能
- `fix`: バグ修正
- `refactor`: リファクタリング
- `docs`: ドキュメント
- `test`: テスト追加

---

### 13.3 テスト戦略

**テストピラミッド**:
1. **単体テスト（Unit Tests）**: 個別関数・フックのテスト
2. **統合テスト（Integration Tests）**: コンポーネント間連携のテスト
3. **E2Eテスト（End-to-End Tests）**: ユーザーフロー全体のテスト（未実装）

**カバレッジ目標**:
- 重要なビジネスロジック: 80%以上
- ユーティリティ関数: 90%以上

---

## 14. デプロイ・運用

### 14.1 ビルドコマンド

```bash
# 本番ビルド
npm run build

# プレビュー（ビルド結果の確認）
npm run preview
```

**出力先**: `dist/` ディレクトリ

---

### 14.2 環境変数

**必須環境変数**:
```bash
VITE_GEMINI_API_KEY=your_api_key_here
```

**設定方法**:
1. `.env.local` ファイルを作成
2. APIキーを記述
3. Gitにコミットしない（`.gitignore` に記載済み）

---

### 14.3 ホスティング

**推奨プラットフォーム**:
- Vercel
- Netlify
- Firebase Hosting
- GitHub Pages

**設定例（Vercel）**:
1. GitHubリポジトリと連携
2. ビルドコマンド: `npm run build`
3. 出力ディレクトリ: `dist`
4. 環境変数に `VITE_GEMINI_API_KEY` を設定

---

## 15. トラブルシューティング

### 15.1 よくある問題

**問題**: 型エラーが出る
- **解決策**:
  1. `vite-env.d.ts` が存在するか確認
  2. `npx tsc --noEmit` で型チェック
  3. [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) のFAQを参照

**問題**: ビルドエラー
- **解決策**:
  1. `npm install` で依存関係を再インストール
  2. `node_modules` と `dist` を削除して再ビルド
  3. Node.jsのバージョンを確認（v18以降）

**問題**: APIエラー
- **解決策**:
  1. `.env.local` にAPIキーが正しく設定されているか確認
  2. APIキーの有効性を確認
  3. ネットワーク接続を確認

**問題**: テストが実行できない
- **原因**: フォルダ名に日本語が含まれている
- **解決策**: プロジェクトを英数字のみのパスに移動

---

## 16. 今後の拡張予定

### 16.1 計画中の機能

- [ ] **音声入力**: Web Speech APIによる音声ディベート
- [ ] **マルチプレイヤー**: 複数ユーザーでのディベート
- [ ] **リーダーボード**: スコアランキング
- [ ] **カスタムAIペルソナ**: ユーザー定義のAIキャラクター
- [ ] **エクスポート機能**: 議論のPDF/Markdown出力
- [ ] **ダークモード**: UI全体のダークテーマ

---

### 16.2 技術的改善

- [ ] **PWA化**: オフライン対応・ホーム画面追加
- [ ] **E2Eテスト**: Playwrightによる自動テスト
- [ ] **国際化（i18n）**: 英語・その他言語対応
- [ ] **パフォーマンス監視**: Real User Monitoring
- [ ] **AI モデル切り替え**: Gemini Pro / Opus 選択機能

---

## 17. 関連リンク

- **プロジェクトリポジトリ**: （未公開の場合は記載不要）
- **AI Studio**: https://ai.studio/apps/drive/1ZC71QyujsaMbutPxdhLWSOqBvKu4lJVz
- **Google Gemini API ドキュメント**: https://ai.google.dev/
- **React ドキュメント**: https://react.dev/
- **TypeScript ハンドブック**: https://www.typescriptlang.org/docs/
- **Vite ガイド**: https://vitejs.dev/guide/

---

## 18. ライセンス

プロジェクト固有のライセンスを確認してください。

---

## 19. クレジット

### 開発者
- **メイン開発**: （開発者名）

### 使用技術・ライブラリ
- React, TypeScript, Vite
- Google Gemini API
- Tailwind CSS
- Lucide Icons

### 理論的基盤
- **Toulmin Model**: Stephen Toulmin (1958) "The Uses of Argument"
- **Walton Argumentation Schemes**: Douglas Walton (1996) "Argumentation Schemes for Presumptive Reasoning"
- **SBI Feedback Model**: Center for Creative Leadership

---

## 20. 変更履歴

### v3.4.3 (2025-12-22)
- ✅ 能動的接種演習(ACTIVE_INOCULATION)に詭弁説明機能追加
- ✅ クリック可能な詭弁カードで各詭弁の詳細説明を表示
- ✅ 10種類の詭弁タイプに対応した説明と例文の追加

### v3.4.2 (2025-12-21)
- ✅ 立証責任トラッカー機能追加
- ✅ Calibration改善版表示の個別化
- ✅ バージョン管理システム導入
- ✅ 能動的接種演習(ACTIVE_INOCULATION)ミニゲーム追加

### v3.4.1 (2025-12-21)
- ✅ 大規模リファクタリング
- ✅ 型安全性の向上
- ✅ パフォーマンス最適化
- ✅ テストカバレッジ向上

---

**Document Version**: 1.0
**Last Updated**: 2025-12-22
**Maintained by**: DebateMaster AI Development Team
