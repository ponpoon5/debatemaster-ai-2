# プロキシサーバー実装ガイド

## 📋 概要

DebateMaster AIには、本番環境でAPIキーを安全に管理するための**プロキシサーバー**機能が実装されています。

### アーキテクチャ

```
開発環境（ローカル）:
[フロントエンド] → 直接 → [Gemini API]
                    ↑
              APIキーを含む

本番環境（デプロイ後）:
[フロントエンド] → [プロキシサーバー] → [Gemini API]
                           ↑
                     APIキーを含む
```

## 🔧 環境設定

### 開発環境（推奨）

**直接モード**: フロントエンドから直接Gemini APIを呼び出し

`.env.local`:
```env
# 開発モード: 直接API呼び出し
VITE_GEMINI_API_KEY=your_api_key_here

# プロキシモードは無効
# VITE_PROXY_URL=http://localhost:3000
```

起動方法:
```bash
npm run dev
```

### 本番環境

**プロキシモード**: プロキシサーバー経由でAPI呼び出し

#### フロントエンド `.env.production`:
```env
# プロキシサーバーのURL
VITE_PROXY_URL=https://your-api-server.com

# APIキーは設定しない
```

#### バックエンド `server/.env`:
```env
GEMINI_API_KEY=your_api_key_here
PORT=3000
CLIENT_URL=https://your-frontend-url.com
```

## 🚀 起動方法

### 1. 開発モード（直接API呼び出し）

```bash
npm run dev
```

- ポート: `http://localhost:5173` (自動割当)
- APIキー: `.env.local` から読み込み
- 最も簡単で推奨される開発方法

### 2. プロキシモードのテスト

プロキシサーバーをローカルでテストする場合:

```bash
# 両方同時に起動
npm run dev:all

# または個別に起動
npm run dev:proxy    # ターミナル1: プロキシサーバー
npm run dev          # ターミナル2: フロントエンド
```

`.env.local` を以下に変更:
```env
VITE_PROXY_URL=http://localhost:3000
# VITE_GEMINI_API_KEY=... (コメントアウト)
```

`server/.env`:
```env
GEMINI_API_KEY=your_api_key_here
PORT=3000
CLIENT_URL=http://localhost:5173
```

## 📦 デプロイ

### Option 1: Vercel（推奨・最も簡単）

#### ステップ1: GitHubにプッシュ
```bash
git add .
git commit -m "Add proxy server for production"
git push origin main
```

#### ステップ2: Vercelにインポート

1. [Vercel Dashboard](https://vercel.com/dashboard)
2. "New Project" → リポジトリを選択
3. "Import"

#### ステップ3: 環境変数を設定

**Vercel Settings → Environment Variables**:
- `GEMINI_API_KEY`: あなたのAPIキー
- `CLIENT_URL`: `https://your-app.vercel.app` (デプロイ後に設定)
- `VITE_PROXY_URL`: `https://your-app.vercel.app` (フロントエンド用)

#### ステップ4: デプロイ

Vercelが自動的にビルド・デプロイします。

### Option 2: Render（フロント/バックエンド分離）

#### バックエンド（Web Service）
1. Render Dashboard → "New +" → "Web Service"
2. 設定:
   - **Build Command**: `npm install`
   - **Start Command**: `npm run server:start`
   - **Environment Variables**:
     - `GEMINI_API_KEY`: あなたのAPIキー
     - `PORT`: `3000`
     - `CLIENT_URL`: `https://your-frontend.onrender.com`

#### フロントエンド（Static Site）
1. Render Dashboard → "New +" → "Static Site"
2. 設定:
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
   - **Environment Variables**:
     - `VITE_PROXY_URL`: `https://your-api-server.onrender.com`

## 🔒 セキュリティ

### ✅ 推奨事項

1. **開発環境**:
   - `.env.local` にAPIキーを設定
   - `.env.local` は`.gitignore`で除外済み
   - 直接モードを使用（シンプルで高速）

2. **本番環境**:
   - プロキシサーバー経由でのみAPI呼び出し
   - フロントエンドにAPIキーを含めない
   - 環境変数で`VITE_PROXY_URL`のみ設定
   - HTTPSを必須とする

### ❌ 禁止事項

- `.env.local` をGitにコミット
- フロントエンドコードにAPIキーをハードコード
- 本番環境で`VITE_GEMINI_API_KEY`を設定

## 🧪 テスト方法

### プロキシサーバーのヘルスチェック

```bash
curl http://localhost:3000/api/health
# 期待される応答: {"status":"ok","timestamp":"..."}
```

### エンドポイント一覧

- `GET /api/health` - ヘルスチェック
- `POST /api/gemini/generate-stream` - ストリーミング生成
- `POST /api/gemini/chat-stream` - チャットストリーミング

## 📝 環境変数一覧

### フロントエンド

| 変数 | 必須 | 説明 | 開発 | 本番 |
|------|------|------|------|------|
| `VITE_GEMINI_API_KEY` | 開発時 | Gemini APIキー | ✅ | ❌ |
| `VITE_PROXY_URL` | 本番時 | プロキシサーバーURL | ❌ | ✅ |

### バックエンド（プロキシサーバー）

| 変数 | 必須 | 説明 | デフォルト |
|------|------|------|------------|
| `GEMINI_API_KEY` | ✅ | Gemini APIキー | - |
| `PORT` | - | サーバーポート | 3000 |
| `CLIENT_URL` | - | CORS用フロントエンドURL | http://localhost:5173 |

## 🎯 推奨ワークフロー

### 開発中

```bash
# 直接モードで開発（簡単・高速）
npm run dev
```

### デプロイ前テスト

```bash
# プロキシモードをローカルでテスト
npm run dev:all

# ブラウザで http://localhost:5173 を確認
# 開発者ツールでプロキシ経由の通信を確認
```

### 本番デプロイ

```bash
# ビルド確認
npm run build

# Vercel/Renderにデプロイ
# 環境変数を適切に設定
```

## 🐛 トラブルシューティング

### プロキシサーバーが起動しない

```bash
# .env ファイルを確認
cat server/.env

# GEMINI_API_KEY が設定されているか確認
```

### CORS エラー

プロキシサーバーの `CLIENT_URL` がフロントエンドのURLと一致しているか確認

### 接続エラー

1. プロキシサーバーが起動しているか確認
2. `VITE_PROXY_URL` が正しいか確認
3. ファイアウォール設定を確認

## 📚 関連ファイル

- `server/index.ts` - プロキシサーバー本体
- `services/gemini/proxy-client.ts` - プロキシ通信クライアント
- `vercel.json` - Vercelデプロイ設定
- `render.yaml` - Renderデプロイ設定
- `DEPLOYMENT.md` - 詳細なデプロイガイド

## ✨ まとめ

- **開発**: 直接モード（`VITE_GEMINI_API_KEY`）
- **本番**: プロキシモード（`VITE_PROXY_URL`）
- **セキュリティ**: APIキーはバックエンドのみで管理
- **シンプル**: 環境変数を切り替えるだけで動作モード変更
