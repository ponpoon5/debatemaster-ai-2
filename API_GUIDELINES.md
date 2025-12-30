# Gemini API 呼び出しガイドライン

このドキュメントは、`@google/genai` v1.34.0 の正しい使用方法を定義します。

## ⚠️ 重要: API呼び出しの基本ルール

### ✅ 正しいAPI

```typescript
import { GoogleGenAI } from '@google/genai';

const genAI = new GoogleGenAI({ apiKey: API_KEY });
```

### 📋 利用可能なAPIメソッド

#### 1. モデル生成API（非ストリーミング）

```typescript
const result = await genAI.models.generateContent({
  model: 'gemini-2.0-flash-exp',
  contents: [...],
  config: {...}
});
```

#### 2. モデル生成API（ストリーミング）

```typescript
const stream = await genAI.models.generateContentStream({
  model: 'gemini-2.0-flash-exp',
  contents: [...],
  config: {...}
});

for await (const chunk of stream) {
  console.log(chunk.text);
}
```

#### 3. チャットAPI（非ストリーミング）

```typescript
const chat = genAI.chats.create({
  model: 'gemini-2.0-flash-exp',
  history: [...],  // 過去の会話履歴
  config: {
    systemInstruction: '...',
    temperature: 0.7,
    ...
  }
});

const result = await chat.sendMessage('ユーザーメッセージ');
```

#### 4. チャットAPI（ストリーミング）

```typescript
const chat = genAI.chats.create({
  model: 'gemini-2.0-flash-exp',
  history: [...],
  config: {...}
});

const stream = await chat.sendMessageStream('ユーザーメッセージ');

for await (const chunk of stream) {
  console.log(chunk.text);
}
```

## ❌ 使用禁止API

### 存在しないメソッド

以下のメソッドは**存在しません**。使用するとエラーになります：

```typescript
// ❌ エラー: getGenerativeModel is not a function
const model = genAI.getGenerativeModel('gemini-2.0-flash-exp');

// ❌ エラー: getGenerativeModel is not a function
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
```

## 📦 プロジェクトでの使用パターン

### パターン1: 直接モード（フロントエンドから直接呼び出し）

**使用箇所**: `services/gemini/client.ts`

```typescript
import { GoogleGenAI } from '@google/genai';
import { API_KEY } from '../../core/config/gemini.config';

const genAI = new GoogleGenAI({ apiKey: API_KEY });

// 非ストリーミング
export const generateContent = async (params) => {
  return await genAI.models.generateContent(params);
};

// ストリーミング
export const generateContentStream = async (params) => {
  return await genAI.models.generateContentStream(params);
};
```

### パターン2: プロキシモード（Vercelサーバーレス関数）

**使用箇所**: `api/gemini/*.ts`

```typescript
import { GoogleGenAI } from '@google/genai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenAI({ apiKey: GEMINI_API_KEY || '' });

export default async function handler(req, res) {
  const { model, contents, config } = req.body;

  // ✅ 正しい: models.generateContent
  const result = await genAI.models.generateContent({
    model,
    contents,
    config,
  });

  return res.json({
    text: result.text,
    usageMetadata: result.usageMetadata,
  });
}
```

## 🔒 セキュリティルール

### 本番環境（Vercel）

1. **必須**: APIキーは環境変数 `GEMINI_API_KEY` に保存
2. **必須**: `VITE_USE_PROXY=true` を設定
3. **推奨**: `VITE_PROXY_URL` は空（同一ドメインの `/api` を使用）

### ローカル開発

1. `.env.local` に `GEMINI_API_KEY` を設定
2. `VITE_USE_PROXY=false` で直接呼び出し、または
3. `VITE_USE_PROXY=true` でローカルプロキシサーバーを使用

## 📂 ファイル別API使用ルール

| ファイル | 使用API | 備考 |
|---------|---------|------|
| `services/gemini/client.ts` | `genAI.models.*` | 直接モード用 |
| `services/gemini/chat-service.ts` | `genAI.chats.create()` | チャット用 |
| `api/gemini/generate.ts` | `genAI.models.generateContent()` | サーバーレス関数 |
| `api/gemini/generate-stream.ts` | `genAI.models.generateContentStream()` | サーバーレス関数 |
| `api/gemini/chat.ts` | `genAI.chats.create()` | サーバーレス関数 |
| `api/gemini/chat-stream.ts` | `genAI.chats.create()` | サーバーレス関数 |

## ⚙️ config オプション

### GenerationConfig（生成設定）

```typescript
{
  temperature: 0.7,              // 創造性（0.0 = 決定的、1.0 = ランダム）
  topK: 40,                      // トップK候補
  topP: 0.95,                    // トップP確率
  maxOutputTokens: 8192,         // 最大出力トークン数
  responseMimeType: 'text/plain', // レスポンス形式
  stopSequences: ['END'],        // 停止シーケンス
}
```

### システムインストラクション

```typescript
{
  systemInstruction: 'あなたは議論の専門家です。論理的に回答してください。',
}
```

## 🐛 トラブルシューティング

### エラー 1: "ContentUnion is required"

**発生日**: 2025-12-30 (v5.0.8 → v5.0.9)

**エラーメッセージ**:
```
Error: ContentUnion is required
at Chat.sendMessageStream
```

**原因**: `@google/genai` v1.34.0 の `sendMessage` および `sendMessageStream` メソッドは、**オブジェクト形式 `{ message: string }`** を期待しているが、**文字列を直接渡していた**。

**間違った実装**:
```typescript
// ❌ 間違い
const result = await chat.sendMessage(message);
const stream = await chat.sendMessageStream(message);
```

**正しい実装**:
```typescript
// ✅ 正しい
const result = await chat.sendMessage({ message });
const stream = await chat.sendMessageStream({ message });
```

**影響範囲**:
- `api/gemini/chat.ts`
- `api/gemini/chat-stream.ts`
- `hooks/debate/useDebateSession.ts`
- `hooks/debate/useDebateMessaging.ts`
- `services/gemini/proxy-wrapper.ts`

---

### エラー 2: "message is not defined"

**発生日**: 2025-12-30 (v5.0.9)

**エラーメッセージ**:
```
ReferenceError: message is not defined
at chat-DqMaljKd.js:2:4508
```

**原因**: `services/gemini/proxy-wrapper.ts` の会話履歴蓄積処理で、存在しない変数 `message.message` を参照していた。パラメータ名が `params: { message: string }` に変更されたのに、履歴追加部分で古いコード `message.message` が残っていた。

**間違った実装**:
```typescript
// ❌ 間違い（Line 210, 267, 296）
accumulatedHistory = [
  ...accumulatedHistory,
  { role: 'user', parts: [{ text: message.message }] },  // message は未定義
  { role: 'model', parts: [{ text: data.text }] },
];
```

**正しい実装**:
```typescript
// ✅ 正しい
accumulatedHistory = [
  ...accumulatedHistory,
  { role: 'user', parts: [{ text: params.message }] },  // params.message
  { role: 'model', parts: [{ text: data.text }] },
];
```

**影響範囲**:
- `services/gemini/proxy-wrapper.ts` (Line 210, 267, 296)

**修正コミット**:
- `6995116` - Fix: Undefined message variable in proxy-wrapper
- `b1b2fc6` - Fix: Third occurrence of undefined message variable

---

### エラー 3: 変数シャドーイング（Variable Shadowing）

**発生日**: 2025-12-30 (v5.0.9)

**エラーメッセージ**:
```
ReferenceError: message is not defined
```

**原因**: catchブロックで `const message` を宣言したことで、tryブロック内の `message` 変数がシャドーイング（上書き）され、未初期化状態で参照されてしまった。

**間違った実装**:
```typescript
try {
  const { message } = req.body;
  const result = await chat.sendMessage({ message }); // ← エラー
} catch (error: unknown) {
  const message = error instanceof Error ? error.message : 'Unknown error'; // ← これがシャドーイング
  return res.status(500).json({ error: 'Failed', message });
}
```

**正しい実装**:
```typescript
try {
  const { message } = req.body;
  const result = await chat.sendMessage({ message }); // ✅ 正常
} catch (error: unknown) {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error'; // ✅ 別名を使用
  return res.status(500).json({ error: 'Failed', message: errorMessage });
}
```

**ベストプラクティス**:

✅ **DO**: エラーメッセージには専用の変数名を使う
```typescript
const errorMessage = error instanceof Error ? error.message : 'Unknown error';
const errorDetails = error instanceof Error ? error.stack : undefined;
```

❌ **DON'T**: パラメータ名と同じ変数名をcatchブロックで使わない
```typescript
// パラメータに message があるなら
const message = error.message; // ← シャドーイング発生！
```

**影響範囲**:
- `api/gemini/chat.ts` (Line 65)
- `api/gemini/chat-stream.ts` (Line 95)
- `api/gemini/generate.ts` (Line 61)
- `api/gemini/generate-stream.ts` (Line 91)

**修正コミット**:
- `936f5ee` - Fix: Variable shadowing in error handlers

---

### エラー 4: "getGenerativeModel is not a function"

**原因**: 存在しないAPIを使用している

**解決**:
```typescript
// ❌ 間違い
const model = genAI.getGenerativeModel('gemini-2.0-flash-exp');

// ✅ 正しい（非チャット）
const result = await genAI.models.generateContent({...});

// ✅ 正しい（チャット）
const chat = genAI.chats.create({...});
```

---

### エラー 5: "GEMINI_API_KEY is not configured"

**原因**: 環境変数が設定されていない

**解決**:
- Vercel: ダッシュボードで `GEMINI_API_KEY` を設定
- ローカル: `.env.local` に `GEMINI_API_KEY=...` を追加

---

### エラー 6: "USE_PROXY is true but PROXY_URL is empty"

**原因**: プロキシモードなのにURLが設定されていない（これは警告のみ）

**解決**:
- Vercel: `VITE_PROXY_URL` は空で OK（同一ドメイン `/api` を使用）
- ローカル: `VITE_PROXY_URL=http://localhost:3000` を設定

---

## 🚀 Vercelデプロイのベストプラクティス

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

## 📋 APIシグネチャチェックリスト

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

## 🔍 デバッグ手順

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

## 📚 参考リンク

- [@google/genai ドキュメント](https://github.com/google/generative-ai-js)
- [Gemini API リファレンス](https://ai.google.dev/api)
- [Vercel環境変数](https://vercel.com/docs/projects/environment-variables)

## 📖 関連ドキュメント

- [README.md](./README.md) - プロジェクト概要
- [CHANGELOG.md](./CHANGELOG.md) - 変更履歴

---

## 🔄 更新履歴

- 2025-12-30 17:00: TROUBLESHOOTING.md を統合（v5.0.9）
  - 追加: ContentUnion Required エラー詳細
  - 追加: message is not defined エラー詳細（3箇所すべて）
  - 追加: 変数シャドーイングの防止
  - 追加: Vercelデプロイのベストプラクティス
  - 追加: APIシグネチャチェックリスト
  - 追加: デバッグ手順
- 2025-12-30 15:00: sendMessage/sendMessageStream APIシグネチャ修正（v5.0.8）
  - 修正: `chat.sendMessage({ message })` → `chat.sendMessage(message)` → 再修正: `chat.sendMessage({ message })`
  - 修正: バージョン番号を v1.30.0 → v1.34.0 に更新
  - 原因: ContentUnion required エラーの解決
- 2025-12-30: 初版作成（v5.0.8）
