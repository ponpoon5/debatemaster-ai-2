# Vercelデプロイメントガイド

## 🔐 セキュアなAPIキー管理

このアプリは**サーバーレス関数**を使用してGemini APIキーを安全に管理します。

### アーキテクチャ

```
ブラウザ → Vercelサーバーレス関数 (/api/gemini/*) → Gemini API
         ↑ APIキーはサーバー側のみに保存
         ↑ ブラウザには露出しない
```

## Vercel環境変数の設定

### 1. Vercelダッシュボードにアクセス

1. [Vercel Dashboard](https://vercel.com/dashboard) にログイン
2. プロジェクト `debatemaster-ai-2` を選択
3. **Settings** タブを開く
4. 左メニューから **Environment Variables** を選択

### 2. 必須環境変数を設定

#### `GEMINI_API_KEY` （必須）

- **Key**: `GEMINI_API_KEY`
- **Value**: あなたのGemini APIキー
- **Environment**: Production, Preview, Development 全てにチェック
- **取得方法**: https://aistudio.google.com/app/apikey

#### `VITE_USE_PROXY` （推奨）

- **Key**: `VITE_USE_PROXY`
- **Value**: `true`
- **Environment**: Production, Preview にチェック
- **説明**: Vercelサーバーレス関数を経由してAPIを呼び出す

#### `VITE_PROXY_URL` （推奨）

- **Key**: `VITE_PROXY_URL`
- **Value**: 空欄のままでOK（Vercelの場合、同一ドメインの `/api` を使用）
- **Environment**: Production, Preview にチェック

### 3. 再デプロイ

環境変数を設定したら、**Deployments** タブから最新デプロイを選択し、**Redeploy** をクリックします。

## ローカル開発環境の設定

### 1. `.env.local` ファイルを作成

プロジェクトルートに `.env.local` ファイルを作成：

```bash
# Gemini API Key (サーバーレス関数用)
GEMINI_API_KEY=your_gemini_api_key_here

# プロキシモード有効化
VITE_USE_PROXY=true

# ローカルプロキシURL (空欄の場合は /api を使用)
VITE_PROXY_URL=
```

### 2. 開発サーバーを起動

```bash
npm run dev
```

## セキュリティベストプラクティス

### ✅ 推奨設定（本番環境）

```env
# Vercel環境変数
GEMINI_API_KEY=sk-xxxxx...  # サーバー側のみ
VITE_USE_PROXY=true         # プロキシ経由
VITE_PROXY_URL=             # 空欄（同一ドメイン）
```

- APIキーはサーバー側のみに保存
- ブラウザからは `/api/gemini/*` を呼び出す
- APIキーはブラウザに露出しない

### ⚠️ 非推奨設定（セキュリティリスク）

```env
# 危険！ブラウザにAPIキーが露出します
VITE_USE_PROXY=false
VITE_GEMINI_API_KEY=sk-xxxxx...  # ❌ ブラウザに露出
```

## トラブルシューティング

### エラー: "USE_PROXY is true but PROXY_URL is empty"

**原因**: `VITE_USE_PROXY=true` なのに `VITE_PROXY_URL` が設定されていない

**解決方法**:

1. Vercelの場合、`VITE_PROXY_URL` は空欄でOK（同一ドメインの `/api` を自動使用）
2. または `VITE_PROXY_URL` を削除してください

### エラー: "GEMINI_API_KEY is not configured"

**原因**: サーバーレス関数に `GEMINI_API_KEY` が渡されていない

**解決方法**:

1. Vercelダッシュボードで `GEMINI_API_KEY` を設定
2. 再デプロイを実行

### API呼び出しが失敗する

**確認事項**:

1. Vercel環境変数が正しく設定されているか
2. 最新のコードが反映されているか（再デプロイ）
3. ブラウザのコンソールでエラー内容を確認

## ファイル構成

```
api/
├── gemini/
│   ├── generate.ts       # 非ストリーミング生成
│   ├── generate-stream.ts # ストリーミング生成
│   └── chat-stream.ts     # チャットストリーミング
.env.example              # 環境変数テンプレート
.env.local               # ローカル環境変数（Git無視）
```

## APIエンドポイント

### POST /api/gemini/generate

非ストリーミングコンテンツ生成

**Request Body**:
```json
{
  "model": "gemini-2.0-flash-exp",
  "contents": [...],
  "config": {...}
}
```

### POST /api/gemini/generate-stream

ストリーミングコンテンツ生成（SSE）

### POST /api/gemini/chat-stream

チャットストリーミング（SSE）

**Request Body**:
```json
{
  "model": "gemini-2.0-flash-exp",
  "history": [...],
  "message": "ユーザーメッセージ",
  "config": {...}
}
```

## 参考リンク

- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)
- [Vercel Serverless Functions](https://vercel.com/docs/functions/serverless-functions)
- [Google AI Studio](https://aistudio.google.com/app/apikey)
