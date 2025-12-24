# DebateMaster AI - Proxy Server

プロダクション環境用のプロキシサーバー。Gemini APIキーを隠蔽します。

## デプロイ方法

### Railway

1. [Railway](https://railway.app/)にサインアップ
2. "New Project" → "Deploy from GitHub repo"
3. このリポジトリの`server`フォルダを選択
4. 環境変数を設定:
   - `GEMINI_API_KEY`: あなたのGemini APIキー
   - `PORT`: 4000（Railwayが自動設定する場合は不要）
   - `CLIENT_URL`: フロントエンドのURL（例: `https://your-app.vercel.app`）
5. デプロイ完了後、URLをメモ（例: `https://your-proxy.railway.app`）

### Render

1. [Render](https://render.com/)にサインアップ
2. "New +" → "Web Service"
3. このリポジトリを接続
4. 設定:
   - Root Directory: `server`
   - Build Command: `npm install`
   - Start Command: `npm start`
5. 環境変数を設定（上記と同じ）

### Heroku

```bash
cd server
heroku create your-app-name
heroku config:set GEMINI_API_KEY=your_key_here
heroku config:set CLIENT_URL=https://your-frontend.vercel.app
git init
git add .
git commit -m "Initial commit"
git push heroku main
```

## ローカル開発

```bash
cd server
npm install
# .env ファイルを作成して環境変数を設定
npm start
```

## 環境変数

| 変数名 | 説明 | 例 |
|--------|------|-----|
| `GEMINI_API_KEY` | Gemini API キー（必須） | `AIzaSy...` |
| `PORT` | サーバーポート | `4000` |
| `CLIENT_URL` | フロントエンドURL（CORS用） | `https://your-app.vercel.app` |
| `NODE_ENV` | 環境（オプション） | `production` |

## エンドポイント

- `GET /api/health` - ヘルスチェック
- `POST /api/gemini/generate` - 非ストリーミング生成
- `POST /api/gemini/generate-stream` - ストリーミング生成
- `POST /api/gemini/chat-stream` - チャットストリーミング
