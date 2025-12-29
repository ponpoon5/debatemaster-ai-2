# Gemini API 呼び出しガイドライン

このドキュメントは、`@google/genai` v1.30.0 の正しい使用方法を定義します。

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

const result = await chat.sendMessage({ message: 'ユーザーメッセージ' });
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

### エラー: "getGenerativeModel is not a function"

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

### エラー: "GEMINI_API_KEY is not configured"

**原因**: 環境変数が設定されていない

**解決**:
- Vercel: ダッシュボードで `GEMINI_API_KEY` を設定
- ローカル: `.env.local` に `GEMINI_API_KEY=...` を追加

### エラー: "USE_PROXY is true but PROXY_URL is empty"

**原因**: プロキシモードなのにURLが設定されていない（これは警告のみ）

**解決**:
- Vercel: `VITE_PROXY_URL` は空で OK（同一ドメイン `/api` を使用）
- ローカル: `VITE_PROXY_URL=http://localhost:3000` を設定

## 📚 参考リンク

- [@google/genai ドキュメント](https://github.com/google/generative-ai-js)
- [Gemini API リファレンス](https://ai.google.dev/api)
- [Vercel環境変数](https://vercel.com/docs/projects/environment-variables)

## 🔄 更新履歴

- 2025-12-30: 初版作成（v5.0.8）
