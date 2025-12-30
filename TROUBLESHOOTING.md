# トラブルシューティングガイド

このドキュメントは、過去に発生した問題とその解決方法を記録しています。

## 目次

1. [ContentUnion Required エラー](#contentunion-required-エラー)
2. [Message is not defined エラー](#message-is-not-defined-エラー)
3. [変数シャドーイングの防止](#変数シャドーイングの防止)
4. [Vercelデプロイのベストプラクティス](#vercelデプロイのベストプラクティス)

---

## ContentUnion Required エラー

### 発生日
2025-12-30 (v5.0.8 → v5.0.9)

### エラーメッセージ
```
Error: ContentUnion is required
at Chat.sendMessageStream
```

### 原因
`@google/genai` v1.34.0 の `sendMessage` および `sendMessageStream` メソッドは、**オブジェクト形式 `{ message: string }`** を期待しているが、**文字列を直接渡していた**。

### 間違った実装
```typescript
// ❌ 間違い
const result = await chat.sendMessage(message);
const stream = await chat.sendMessageStream(message);
```

### 正しい実装
```typescript
// ✅ 正しい
const result = await chat.sendMessage({ message });
const stream = await chat.sendMessageStream({ message });
```

### 影響範囲
- `api/gemini/chat.ts`
- `api/gemini/chat-stream.ts`
- `hooks/debate/useDebateSession.ts`
- `hooks/debate/useDebateMessaging.ts`
- `services/gemini/proxy-wrapper.ts`

### 修正コミット
- `279a56a` - Revert to correct API signature { message: string }

---

## Message is not defined エラー

### 発生日
2025-12-30 (v5.0.9)

### エラーメッセージ
```
ReferenceError: message is not defined
at chat-DqMaljKd.js:2:4508
```

### 原因
`services/gemini/proxy-wrapper.ts` の会話履歴蓄積処理で、存在しない変数 `message.message` を参照していた。

パラメータ名が `params: { message: string }` に変更されたのに、履歴追加部分で古いコード `message.message` が残っていた。

### 間違った実装
```typescript
// ❌ 間違い（Line 210, 267）
accumulatedHistory = [
  ...accumulatedHistory,
  { role: 'user', parts: [{ text: message.message }] },  // message は未定義
  { role: 'model', parts: [{ text: data.text }] },
];
```

### 正しい実装
```typescript
// ✅ 正しい
accumulatedHistory = [
  ...accumulatedHistory,
  { role: 'user', parts: [{ text: params.message }] },  // params.message
  { role: 'model', parts: [{ text: data.text }] },
];
```

### 影響範囲
- `services/gemini/proxy-wrapper.ts` (Line 210, 267, 296)

### 修正コミット
- `6995116` - Fix: Undefined message variable in proxy-wrapper

---

## 変数シャドーイングの防止

### 発生日
2025-12-30 (v5.0.9)

### エラーメッセージ
```
ReferenceError: message is not defined
```

### 原因
catchブロックで `const message` を宣言したことで、tryブロック内の `message` 変数がシャドーイング（上書き）され、未初期化状態で参照されてしまった。

### 間違った実装
```typescript
try {
  const { message } = req.body;
  const result = await chat.sendMessage({ message }); // ← エラー
} catch (error: unknown) {
  const message = error instanceof Error ? error.message : 'Unknown error'; // ← これがシャドーイング
  return res.status(500).json({ error: 'Failed', message });
}
```

### 正しい実装
```typescript
try {
  const { message } = req.body;
  const result = await chat.sendMessage({ message }); // ✅ 正常
} catch (error: unknown) {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error'; // ✅ 別名を使用
  return res.status(500).json({ error: 'Failed', message: errorMessage });
}
```

### ベストプラクティス

#### ✅ DO: エラーメッセージには専用の変数名を使う
```typescript
const errorMessage = error instanceof Error ? error.message : 'Unknown error';
const errorDetails = error instanceof Error ? error.stack : undefined;
```

#### ❌ DON'T: パラメータ名と同じ変数名をcatchブロックで使わない
```typescript
// パラメータに message があるなら
const message = error.message; // ← シャドーイング発生！
```

### 影響範囲
- `api/gemini/chat.ts` (Line 65)
- `api/gemini/chat-stream.ts` (Line 95)
- `api/gemini/generate.ts` (Line 61)
- `api/gemini/generate-stream.ts` (Line 91)

### 修正コミット
- `936f5ee` - Fix: Variable shadowing in error handlers

---

## Vercelデプロイのベストプラクティス

### キャッシュ問題への対処

#### 問題
Vercelがビルドキャッシュを使用するため、コードの変更が反映されないことがある。

#### 解決方法

**方法1: 空コミットで強制再デプロイ**
```bash
git commit --allow-empty -m "Force Vercel redeploy - clear build cache"
git push
```

**方法2: Vercelダッシュボードで手動再デプロイ**
1. Vercelダッシュボードにアクセス
2. プロジェクトを選択
3. "Deployments" タブを開く
4. 最新デプロイの "..." メニュー → "Redeploy"
5. **"Use existing Build Cache" のチェックを外す**（重要！）
6. "Redeploy" をクリック

**方法3: バージョン番号を上げる**
```typescript
// core/config/version.ts
export const APP_VERSION = {
  major: 5,
  minor: 0,
  patch: 10,  // ← インクリメント
  // ...
}
```

### ブラウザキャッシュのクリア

#### ハードリロード
- Windows/Linux: `Ctrl + Shift + R` または `Ctrl + F5`
- Mac: `Cmd + Shift + R`

#### 完全なキャッシュクリア
1. ブラウザ設定を開く
2. プライバシーとセキュリティ
3. 閲覧履歴データの削除
4. 「キャッシュされた画像とファイル」をチェック
5. データを削除

#### プライベートブラウジング
- Chrome/Edge: `Ctrl + Shift + N`
- Firefox: `Ctrl + Shift + P`

---

## APIシグネチャチェックリスト

### @google/genai v1.34.0 の正しい使い方

#### ✅ チャットAPI（非ストリーミング）
```typescript
const chat = genAI.chats.create({
  model: 'gemini-2.0-flash-exp',
  history: [],
  config: {},
});

const result = await chat.sendMessage({ message: 'テキスト' });
```

#### ✅ チャットAPI（ストリーミング）
```typescript
const stream = await chat.sendMessageStream({ message: 'テキスト' });
```

#### ✅ モデルAPI（非ストリーミング）
```typescript
const result = await genAI.models.generateContent({
  model: 'gemini-2.0-flash-exp',
  contents: [...],
  config: {},
});
```

#### ✅ モデルAPI（ストリーミング）
```typescript
const stream = await genAI.models.generateContentStream({
  model: 'gemini-2.0-flash-exp',
  contents: [...],
  config: {},
});
```

#### ❌ 使用禁止API
```typescript
// 存在しません！
const model = genAI.getGenerativeModel('gemini-2.0-flash-exp');
```

---

## デバッグ手順

### 1. ローカルビルドの確認
```bash
npm run build
```
- ビルドが成功することを確認
- エラーがあれば修正

### 2. ローカルでのテスト
```bash
npm run dev
```
- `http://localhost:5173` でテスト
- ブラウザのコンソールでエラーを確認

### 3. APIエンドポイントの直接テスト
```bash
# ヘルスチェック
curl https://debatemaster-ai-2.vercel.app/api/health

# または PowerShell
Invoke-RestMethod -Uri 'https://debatemaster-ai-2.vercel.app/api/health'
```

### 4. Vercelログの確認
1. Vercelダッシュボードを開く
2. プロジェクトを選択
3. "Deployments" タブ
4. 最新デプロイをクリック
5. "Building" / "Function Logs" を確認

---

## 関連ドキュメント

- [API_GUIDELINES.md](./API_GUIDELINES.md) - Gemini API呼び出しガイドライン
- [README.md](./README.md) - プロジェクト概要
- [CHANGELOG.md](./CHANGELOG.md) - 変更履歴

---

## 更新履歴

- 2025-12-30: 初版作成（v5.0.9）
  - ContentUnion Required エラー
  - Message is not defined エラー
  - 変数シャドーイングの防止
  - Vercelデプロイのベストプラクティス
