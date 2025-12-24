<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# DebateMaster AI (v3.4.1準安定版)

AI支援型ディベート学習プラットフォーム

View your app in AI Studio: https://ai.studio/apps/drive/1ZC71QyujsaMbutPxdhLWSOqBvKu4lJVz

---

## ⚠️ 開発者向け重要事項

**このプロジェクトは2025-12-21に大規模なリファクタリングを実施しました。**

### 🚨 開発を開始する前に必読

コードを書く前に、**必ず**以下のドキュメントを読んでください：

1. **[📘 MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)** - 新しいコーディングパターンを学習
   - エラー処理の新しい方法
   - 型ガードの使用方法
   - フックの使い方
   - コンポーネント開発ガイド

2. **[🏗️ ARCHITECTURE.md](./ARCHITECTURE.md)** - システム全体の理解
   - アーキテクチャ概要
   - データフロー
   - 型システム設計
   - パフォーマンス最適化

3. **[📊 REFACTORING_REPORT.md](./REFACTORING_REPORT.md)** - 変更内容の詳細
   - リファクタリングの目的
   - 実施した改善内容
   - ファイル変更サマリー

### ❌ これらを読まずにコードを書くと:

- 非推奨パターンを使用してしまう（例: `!` non-null assertion）
- 型安全性を損なうコードを書いてしまう
- エラー処理が統一されず、保守性が低下する
- レビューで大幅な修正が必要になる

### ✅ 読んだ後の確認

以下のチェックリストを確認してください：

- [ ] MIGRATION_GUIDE.mdを読んだ
- [ ] ARCHITECTURE.mdを読んだ
- [ ] REFACTORING_REPORT.mdを読んだ
- [ ] 新しいエラー処理パターンを理解した（`parseApiError`の使用）
- [ ] 型ガードの使い方を理解した（`!`の使用禁止）
- [ ] コンポーネント設計原則を理解した（100-150行以内、単一責任）

---

## 🚀 Quick Start

### Prerequisites

- Node.js (v18以降推奨)
- npm または yarn

### セットアップ手順

1. **依存関係のインストール**

   ```bash
   npm install
   ```

2. **環境変数の設定**

   `.env.local`ファイルを作成し、Gemini APIキーを設定:

   ```bash
   VITE_GEMINI_API_KEY=your_api_key_here
   ```

3. **開発サーバーの起動**

   ```bash
   npm run dev
   ```

   ブラウザで http://localhost:3009 を開く

4. **型チェック**

   ```bash
   npm run type-check
   # または
   npx tsc --noEmit
   ```

5. **プロダクションビルド**

   ```bash
   npm run build
   ```

6. **テスト実行**
   ```bash
   npm test          # watchモード
   npm run test:run  # 1回実行
   npm run test:coverage  # カバレッジレポート付き
   ```

---

## 📁 プロジェクト構造

```
debatemaster-ai/
├── core/                    # コアロジック・型定義
│   ├── types/              # TypeScript型定義
│   │   ├── error.types.ts  # エラー型（重要）
│   │   └── ...
│   ├── utils/              # ユーティリティ関数
│   │   ├── error-parser.ts # エラー処理（重要）
│   │   ├── type-guards.ts  # 型ガード（重要）
│   │   └── ...
│   └── config/             # 設定ファイル
├── hooks/                   # Reactカスタムフック
│   ├── useDebateApp.ts     # メインフック（統合）
│   ├── useErrorHandler.ts  # エラーハンドリング（重要）
│   └── debate/             # ディベート関連フック
│       ├── useDebateSession.ts
│       ├── useDebateMessaging.ts
│       └── useDebateFeedback.ts
├── services/                # 外部サービス連携
│   └── gemini/             # Google Gemini AI
├── components/              # Reactコンポーネント
├── docs/                    # ドキュメント（重要）
│   ├── MIGRATION_GUIDE.md
│   ├── ARCHITECTURE.md
│   └── REFACTORING_REPORT.md
└── vite.config.ts          # Vite設定（チャンク最適化済み）
```

---

## 🔧 開発ガイドライン

### コーディング規約

1. **型安全性**
   - `!` (non-null assertion) は使用禁止
   - 型ガードを使用する
   - `any`型は避ける

2. **エラー処理**
   - `parseApiError`を使用
   - `try-catch`では`error: unknown`を使用
   - フォールバック値を必ず返す

3. **コンポーネント**
   - 100-150行以内に抑える
   - 単一の責任を持つ
   - Props の型定義を必ず行う

詳細は [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) を参照

---

## 📚 ドキュメント一覧

| ドキュメント                                     | 目的                             | 優先度    |
| ------------------------------------------------ | -------------------------------- | --------- |
| [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)       | 新しいコーディングパターンの学習 | 🔴 必須   |
| [ARCHITECTURE.md](./ARCHITECTURE.md)             | システム全体の理解               | 🔴 必須   |
| [REFACTORING_REPORT.md](./REFACTORING_REPORT.md) | リファクタリングの詳細           | 🔴 必須   |
| [TEST_SETUP.md](./TEST_SETUP.md)                 | テストセットアップと実行ガイド   | 🟢 テスト |
| [SPECIFICATION.md](./SPECIFICATION.md)           | 機能仕様                         | 🟡 推奨   |

---

## 🛠️ 利用可能なコマンド

```bash
# 開発サーバー起動
npm run dev

# TypeScript型チェック
npx tsc --noEmit

# プロダクションビルド
npm run build

# ビルドのプレビュー
npm run preview

# テスト実行
npm test                # watchモード
npm run test:run        # 1回実行
npm run test:coverage   # カバレッジレポート
npm run test:ui         # UI付きで実行
```

---

## 🐛 トラブルシューティング

### 型エラーが出る

1. `vite-env.d.ts`が存在するか確認
2. `import.meta.env`の使用箇所で型アサーションを確認
3. [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) の「よくある質問」を参照

### ビルドエラー

1. `npm install`で依存関係を再インストール
2. `node_modules`と`dist`を削除して再ビルド
3. TypeScript型チェックを実行: `npx tsc --noEmit`

### APIエラー

1. `.env.local`にAPIキーが設定されているか確認
2. `parseApiError`を使用しているか確認
3. エラーログを確認: コンソールに`[関数名] failed:`形式で出力される

### テストが実行できない

⚠️ **既知の問題**: フォルダ名に日本語が含まれているため、Vitestが正常に動作しません。

**解決方法**:

1. プロジェクトを英数字のみのパスに移動（例: `debatemaster-ai-v3.4.1`）
2. または [TEST_SETUP.md](./TEST_SETUP.md) の「既知の問題」セクションを参照

---

## 📈 リファクタリング成果

- ✅ 型エラー: 0件
- ✅ non-null assertion: 完全除去
- ✅ 最大チャンクサイズ: 70%削減 (861KB→257KB)
- ✅ コード行数: ~500行削減
- ✅ 後方互換性: 100%維持
- ✅ ユニットテスト: 81テストケース追加

詳細は [REFACTORING_REPORT.md](./REFACTORING_REPORT.md) を参照

---

## 🤝 貢献ガイドライン

1. **開発前**
   - 必須ドキュメント3点を読む
   - チェックリストを確認

2. **コード作成**
   - MIGRATION_GUIDEのパターンに従う
   - 型安全性を最優先
   - 単体テストを書く（推奨）

3. **コミット前**
   - TypeScript型チェック実行
   - ビルドが成功することを確認
   - コーディング規約遵守を確認

---

## 📝 ライセンス

プロジェクト固有のライセンスを確認してください。

---

## 🔗 関連リンク

- [AI Studio](https://ai.studio/apps/drive/1ZC71QyujsaMbutPxdhLWSOqBvKu4lJVz)
- [Google Gemini API Documentation](https://ai.google.dev/)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)

---

**最終更新**: 2025-12-21 (リファクタリング完了)
