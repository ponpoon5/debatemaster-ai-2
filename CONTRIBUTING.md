# 貢献ガイド - DebateMaster AI

このプロジェクトへの貢献を歓迎します！

---

## 🚨 始める前に - 必読ドキュメント

コードを書く前に、**以下の3つのドキュメントを必ず読んでください**：

### 1️⃣ [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) - 最優先

**所要時間**: 15分

このドキュメントを読まずにコードを書くと、レビューで大幅な修正が必要になります。

**学べること**:

- ✅ エラー処理の新しいパターン（`parseApiError`の使用）
- ✅ 型ガードの使い方（`!`の使用禁止）
- ✅ フックの正しい使い方
- ✅ コンポーネント開発のベストプラクティス
- ✅ よくある間違いとその回避方法

**チェックポイント**:

- [ ] エラー処理のセクションを読んだ
- [ ] 型ガードのセクションを読んだ
- [ ] FAQを読んだ
- [ ] チェックリストを確認した

### 2️⃣ [ARCHITECTURE.md](./ARCHITECTURE.md)

**所要時間**: 20分

システム全体の設計を理解することで、適切な場所にコードを配置できます。

**学べること**:

- 🏗️ レイヤーアーキテクチャ
- 📦 主要モジュールの役割
- 🔄 データフロー
- 🎨 型システム設計
- 🚀 パフォーマンス最適化

**チェックポイント**:

- [ ] レイヤーアーキテクチャを理解した
- [ ] データフローを理解した
- [ ] 型システム設計を理解した

### 3️⃣ [REFACTORING_REPORT.md](./REFACTORING_REPORT.md)

**所要時間**: 10分

最近のリファクタリング内容を理解することで、プロジェクトの方向性が分かります。

**学べること**:

- 📊 リファクタリングの成果
- 🎯 実施内容の詳細
- 📁 ファイル変更サマリー
- ✅ 後方互換性の保証

**チェックポイント**:

- [ ] 主要な改善内容を理解した
- [ ] 新規作成ファイルを確認した
- [ ] 修正ファイルを確認した

---

## ✅ ドキュメント読了確認

全てのドキュメントを読んだら、以下を確認してください：

### 必須知識チェックリスト

#### エラー処理

- [ ] `parseApiError`の使い方を理解した
- [ ] `error: unknown`を使用する理由を理解した
- [ ] フォールバック値を返す理由を理解した
- [ ] `handleError`の使い方を理解した

#### 型安全性

- [ ] `!` (non-null assertion) を使用してはいけない理由を理解した
- [ ] 型ガードの作り方を理解した
- [ ] オプショナルチェーン(`?.`)の使い方を理解した
- [ ] `any`型を避ける理由を理解した

#### コンポーネント設計

- [ ] 100-150行以内に抑える理由を理解した
- [ ] 単一責任の原則を理解した
- [ ] Propsの型定義が必須である理由を理解した
- [ ] 再利用可能な設計の重要性を理解した

#### アーキテクチャ

- [ ] レイヤーアーキテクチャを理解した
- [ ] どのフックをいつ使うか理解した
- [ ] サービス層の役割を理解した
- [ ] データフローを理解した

---

## 🔧 開発環境のセットアップ

### 1. リポジトリのクローン

```bash
git clone <repository-url>
cd debatemaster-ai
```

### 2. 依存関係のインストール

```bash
npm install
```

### 3. 環境変数の設定

`.env.local`ファイルを作成:

```bash
VITE_GEMINI_API_KEY=your_api_key_here
```

### 4. 開発サーバーの起動

```bash
npm run dev
```

### 5. 型チェックの実行

```bash
npx tsc --noEmit
```

---

## 📝 コーディング規約

### 基本原則

1. **型安全性を最優先**

   ```typescript
   // ❌ 悪い例
   const value = obj.property!;

   // ✅ 良い例
   if (hasProperty(obj)) {
     const value = obj.property;
   }
   ```

2. **統一されたエラー処理**

   ```typescript
   // ❌ 悪い例
   catch (error: any) {
     alert("エラー");
   }

   // ✅ 良い例
   catch (error: unknown) {
     const apiError = parseApiError(error);
     handleError(apiError, "処理名");
   }
   ```

3. **小さく、焦点を絞ったコンポーネント**
   ```typescript
   // ✅ 良い例: 100-150行以内
   export const SmallComponent: React.FC<Props> = ({ ... }) => {
     // 単一の責任を持つ
   };
   ```

### コミット前チェックリスト

- [ ] TypeScript型チェックをパスした (`npx tsc --noEmit`)
- [ ] ビルドが成功した (`npm run build`)
- [ ] `!` (non-null assertion) を使用していない
- [ ] `any`型を使用していない
- [ ] エラー処理で`parseApiError`を使用している
- [ ] コンポーネントが100-150行以内
- [ ] 不要なコメントを削除した
- [ ] console.logを削除した（デバッグ用は除く）

---

## 🔀 ブランチ戦略

### ブランチ命名規則

```
feature/機能名    # 新機能
fix/バグ名        # バグ修正
refactor/対象    # リファクタリング
docs/ドキュメント # ドキュメント更新
```

### 例

```bash
git checkout -b feature/add-user-profile
git checkout -b fix/chat-scroll-issue
git checkout -b refactor/error-handling
git checkout -b docs/update-readme
```

---

## 📤 Pull Request

### PR作成前チェックリスト

- [ ] 必須ドキュメント3点を読んだ
- [ ] コーディング規約を遵守した
- [ ] TypeScript型チェックをパスした
- [ ] ビルドが成功した
- [ ] コミット前チェックリストを確認した
- [ ] 変更内容をREADMEに反映した（必要な場合）

### PRテンプレート

```markdown
## 変更内容

<!-- 何を変更したか -->

## 変更理由

<!-- なぜこの変更が必要か -->

## 影響範囲

<!-- どのファイル/機能に影響するか -->

## テスト

<!-- どのようにテストしたか -->

## チェックリスト

- [ ] 必須ドキュメント3点を読んだ
- [ ] TypeScript型チェックをパスした
- [ ] ビルドが成功した
- [ ] コーディング規約を遵守した
```

---

## 🧪 テスト

### ユニットテスト（推奨）

```typescript
// example.test.ts
import { parseApiError } from '@/core/utils/error-parser';
import { ErrorCode } from '@/core/types/error.types';

describe('parseApiError', () => {
  it('should parse quota exceeded error', () => {
    const error = { status: 429 };
    const result = parseApiError(error);
    expect(result.code).toBe(ErrorCode.QUOTA_EXCEEDED);
  });
});
```

---

## 🆘 ヘルプ

### 質問がある場合

1. **まずドキュメントを確認**
   - [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) のFAQ
   - [ARCHITECTURE.md](./ARCHITECTURE.md)
   - [REFACTORING_REPORT.md](./REFACTORING_REPORT.md)

2. **それでも解決しない場合**
   - GitHubのIssueで質問
   - プロジェクトメンバーに相談

### よくある質問

#### Q: 型エラーが出るがどうすれば良い？

A: [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) の「よくある質問」セクションを参照してください。

#### Q: どのフックを使えば良い？

A: [ARCHITECTURE.md](./ARCHITECTURE.md) の「Application Layer (Hooks)」セクションを参照してください。

#### Q: エラー処理はどうすれば良い？

A: [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) の「エラー処理の新しいパターン」セクションを参照してください。

---

## 📊 コードレビュー基準

レビューでは以下をチェックします：

### 型安全性

- ✅ `!` (non-null assertion) を使用していない
- ✅ `any`型を使用していない
- ✅ 型ガードを適切に使用している
- ✅ オプショナルチェーンを活用している

### エラー処理

- ✅ `parseApiError`を使用している
- ✅ `error`の型を`unknown`にしている
- ✅ フォールバック値を返している
- ✅ エラーログを出力している

### コンポーネント

- ✅ 100-150行以内に収まっている
- ✅ 単一の責任を持っている
- ✅ Propsの型定義がある
- ✅ 再利用可能な設計になっている

### アーキテクチャ

- ✅ 適切なレイヤーにコードを配置している
- ✅ データフローに従っている
- ✅ 依存関係が適切

---

## 🎓 学習リソース

### 必須ドキュメント（繰り返し）

1. [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) ⭐⭐⭐
2. [ARCHITECTURE.md](./ARCHITECTURE.md) ⭐⭐⭐
3. [REFACTORING_REPORT.md](./REFACTORING_REPORT.md) ⭐⭐⭐

### 推奨リソース

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Documentation](https://react.dev/)
- [Vite Guide](https://vitejs.dev/guide/)

---

## 📜 ライセンス

プロジェクト固有のライセンスを確認してください。

---

**貢献いただきありがとうございます！** 🎉

質問や提案があれば、遠慮なくお知らせください。
