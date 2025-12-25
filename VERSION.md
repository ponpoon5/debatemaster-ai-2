# DebateMaster AI - Version History

## Version 3.4.4 (2025-12-25)

### Critical Bug Fixes
- **プロキシモード完全対応**
  - 全てのAPI呼び出しで`contents`パラメータを正しい配列形式に修正
  - デモモードの会話履歴蓄積機能を実装
  - レスポンステキスト取得ロジックの統一

### Fixed Features
- **デモモード（模範視聴）**: AliceとBobが正しく交互に発言するように修正
- **仮想ホワイトボード（Live）**: ファシリテーションモードで正常動作
- **前提確認**: トピック開始時の前提提案機能が動作
- **全分析機能**: アドバイス、立証責任、戦略分析など全て正常化
- **トレーニング機能**: ミニゲーム、クイズ、教科書、思考ラボが動作

### Security Enhancements
- APIレート制限: 100リクエスト/分/IP
- CORS制限: ドメインホワイトリスト方式
- 入力バリデーション: モデル・コンテンツ長チェック

### Technical Changes
- 18ファイルでAPI呼び出し形式を修正
- プロキシラッパーに会話履歴蓄積ロジックを追加
- レスポンス形式の統一（`response.text`の取得方法）

---

## Version 3.4.2 (2025-12-21)

### New Features
- **立証責任トラッカー (Burden of Proof Tracker)**
  - 議論中の立証責任をリアルタイムで追跡・可視化
  - CQ（Critical Question）を「単なる疑問」と「反証主張」に区別
  - 立証責任の状態管理（active/fulfilled/challenged/abandoned）
  - トグル式の表示/非表示切り替え
  - 分析結果のキャッシュ機能

### Improvements
- **フィードバック画面の改善**
  - Calibrationセクションで、ユーザーの発言ごとに専用の改善版（betterResponse）を表示
  - MASTERY VERSION（理想形）がユーザーの発言に応じて動的に変化

### Technical Changes
- 新規型定義: `burden.types.ts`
- 新規コンポーネント: `BurdenTracker.tsx`
- 新規サービス: `burden.ts`, `burden/schema.ts`
- ExemplarSectionにdetailedReview propsを追加

---

## Version 3.4.1

### Features
- 標準ディベートモード
- ストーリーモード
- デモモード
- ファシリテーションモード
- 思考ジムモード
- スタディモード
- ドリルモード

### Core Functionality
- AI駆動のディベート対話
- リアルタイムフィードバック
- 詳細な議論分析
- Toulminモデルによる論理構造分析
- 質問力分析
- アンカー事例（Exemplars）
- トレーニング推奨機能
- 宿題管理システム

### UI/UX
- レスポンシブデザイン
- ダークモード対応
- アニメーション効果
- 議論履歴の保存・再生

---

## Semantic Versioning

This project follows Semantic Versioning (SemVer):
- **Major version (3)**: Incompatible API changes
- **Minor version (4)**: Add functionality in a backward compatible manner
- **Patch version (2)**: Backward compatible bug fixes
