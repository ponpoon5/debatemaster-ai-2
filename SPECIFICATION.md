# DebateMaster AI (v3.4.1) 開発用完全マスター・ブループリント

## 1. システム全体設計

### 1.1 プロジェクトの核心

DebateMaster AIは、単なるチャットアプリではなく、**「論理の等値化と可視化」**を行う教育プラットフォームである。Gemini 2.5 Flashの推論能力を、Toulmin（トゥールミン）モデルとWalton（ウォルトン）議論スキームにマッピングすることで、論理の穴を科学的に特定する。

### 1.2 アーキテクチャ原則

- **State Management:** React hooks による疎結合な状態管理。ビジネスロジックは `hooks/` に、AI通信は `services/gemini/` にカプセル化する。
- **Zero-Backend:** 全ての処理をクライアントサイドで完結。APIキーは `process.env.API_KEY` から取得。
- **Type Safety:** 全てのデータ交換に `core/types` のインターフェースを強制。

---

## 2. コア・ロジック仕様 (AI分析エンジン)

### 2.1 論理構造マッピング (Toulmin Logic)

ユーザーの発言を以下の7要素に分類し、0.0〜1.0でスコアリングする。

1. **CLAIM:** 主張の明確さ。
2. **REASON:** 理由の妥当性。
3. **EVIDENCE:** 統計、事実、引用の有無と質。
4. **WARRANT:** 理由と主張を繋ぐ論理的ブリッジ。
5. **BACKING:** 論拠を支えるさらなる証拠。
6. **REBUTTAL:** 反論への予見と譲歩の有無。
7. **QUALIFICATION:** 断定を避け、確信度を適切に表現しているか。

### 2.2 議論スキーム特定 (Walton Schemes)

発言の「説得の型」を以下の6つから特定し、それぞれに紐づく**批判的質問 (CQ)** を検証する。

- **専門家の意見:** その人物は本当に権威か？ 分野が一致しているか？
- **因果関係:** 相関関係と因果関係を混同していないか？ 逆の因果はないか？
- **類推:** 比較対象の性質は本当に類似しているか？ 決定的な違いはないか？
- **帰結:** その結果は本当に発生するか？ 別の重大な副作用はないか？

### 2.3 SBIフィードバック・プロトコル

全ての個別アドバイスは以下の構造を維持しなければならない。

- **Situation:** 「相手が〇〇というリスクを指摘した際...」
- **Behavior:** 「あなたは具体的な数値を提示せず、感情的な反論に終始しました。」
- **Impact:** 「その結果、議論の客観性が失われ、第三者への説得力が低下しました。」

---

## 3. モード別詳細設計

### 3.1 議論実践 (DEBATE)

- **難易度 Extreme:** 意図的な詭弁（ストローマン、ゴールポスト移動）をAIに使用させ、ユーザーの「誤謬検知能力」を試す。
- **Premise Check:** 議論開始前に `definitions` と `goal` を JSON で合意。

### 3.2 合意形成 (FACILITATION)

- **キャラクター A (Red):** 感情、価値観、倫理、主観を重視。
- **キャラクター B (Blue):** 効率、データ、利害、客観を重視。
- **UI:** `Virtual Whiteboard` を搭載し、両者の意見の共通項をリアルタイム抽出。

### 3.3 弱点特訓 (TRAINING)

- **弱点プロファイル:** LocalStorage内の過去の全 `sessionMetrics` を集計。
- **ロジック:** `numerator` (成功数) / `denominator` (試行数) から、最も低いスコアの `WeaknessKey` を特定し、AIにその弱点のみを攻撃するよう指示。

---

## 4. データ構造 (Storage Schema v4)

LocalStorage キー名: `debate_archives`

```typescript
{
  schemaVersion: 4,
  archives: DebateArchive[],
  homeworkTasks: HomeworkTask[],
  weaknessProfile: {
    lastUpdated: string,
    metrics: Record<WeaknessKey, WeaknessMetric> // 蓄積された行動統計
  }
}
```

---

## 5. デザイン・システム & UX

### 5.1 カラーパレット

- **Brand Primary:** Blue 600 (`#2563eb`) - 信頼と論理
- **Success/Logic:** Emerald 500 (`#10b981`) - 健全な論理構造
- **Warning/Fallacy:** Rose 500 (`#ef4444`) - 詭弁・論理の穴
- **Neutral:** Slate 50 (`#f8fafc`) - 背景・基盤

### 5.2 アニメーション定数 (CSS Keyframes)

- `fade-in-up`: 0.5s, ease-out, translateY(20px) -> 0
- `pop-in`: 0.4s, cubic-bezier(0.175, 0.885, 0.32, 1.275), scale(0.9) -> 1
- `shimmer`: 1.5s, infinite, linear (AI分析中のプログレスバーに使用)

### 5.3 AI待ち時間 UX

分析に5秒以上かかる場合は、`LOADING_TIPS` 配列からランダムに「議論のコツ」を表示し、ユーザーの学習意欲を途切れさせない。

---

## 6. 実装上の禁止事項

1. **Markdown装飾の出力禁止:** AIには `**` や `#` を使わせない。UI側で `font-bold` 等のクラスを用いて制御する。
2. **思考プロセスの露出禁止:** `<think>` タグ等は、`cleanText` ユーティリティで正規表現を用いて完全に除去する。
3. **JSON Schemaの遵守:** 分析リクエストは必ず `responseMimeType: "application/json"` を使用し、プログラムがパース可能な形式を保証する。
