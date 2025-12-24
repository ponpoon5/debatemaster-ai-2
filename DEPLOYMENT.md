# デプロイガイド - DebateMaster AI v3.4.3

## 概要

DebateMaster AIを**プロキシモード**でフルスタックデプロイする完全ガイドです。

### アーキテクチャ

```
ユーザー → フロントエンド (Vercel) → プロキシサーバー (Railway) → Gemini API
```

- **フロントエンド**: 静的ファイル（HTML/CSS/JS）
- **プロキシサーバー**: Express.js（APIキーを隠蔽）
- **セキュリティ**: APIキーはサーバー側のみ

---

## ステップ1: プロキシサーバーをデプロイ

### Railway を使用（推奨・無料枠あり）

#### 1-1. Railwayにサインアップ

1. https://railway.app/ にアクセス
2. "Start a New Project" をクリック
3. GitHubアカウントでサインアップ

#### 1-2. GitHubリポジトリを準備

```bash
# server フォルダのみを新しいリポジトリにプッシュ（推奨）
cd server
git init
git add .
git commit -m "Initial proxy server"
git remote add origin https://github.com/yourusername/debatemaster-proxy.git
git push -u origin main
```

または、既存のリポジトリをそのまま使用することも可能です。

#### 1-3. Railwayでデプロイ

1. Railway Dashboard で "New Project"
2. "Deploy from GitHub repo" を選択
3. リポジトリを選択（`server`フォルダのみのリポジトリ、または既存リポジトリ）
4. **Root Directory**を設定（既存リポジトリの場合）:
   - Settings → Service Settings → Root Directory: `server`

#### 1-4. 環境変数を設定

Railway Dashboard → Variables タブで以下を追加:

```
GEMINI_API_KEY=AIzaSy... (あなたのGemini APIキー)
CLIENT_URL=https://your-frontend.vercel.app (後で更新)
PORT=4000 (オプション、Railwayが自動設定)
```

#### 1-5. デプロイURLを確認

- Settings → Domains → "Generate Domain" をクリック
- URLをメモ: `https://your-app-production.up.railway.app`

---

## ステップ2: フロントエンドをデプロイ

### Vercel を使用（推奨）

#### 2-1. Vercelにサインアップ

1. https://vercel.com/ にアクセス
2. "Start Deploying" → GitHubでサインアップ

#### 2-2. プロジェクトをインポート

1. Dashboard → "Add New..." → "Project"
2. GitHubリポジトリを選択
3. "Import" をクリック

#### 2-3. ビルド設定を確認

以下の設定が自動検出されます:

- **Framework Preset**: Vite
- **Root Directory**: `./` (ルート)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

#### 2-4. 環境変数を設定

Environment Variables セクションで追加:

```
VITE_PROXY_URL=https://your-app-production.up.railway.app
```

**重要**: `VITE_GEMINI_API_KEY`は設定しないでください（プロキシを使用するため）。

#### 2-5. デプロイ

1. "Deploy" をクリック
2. 2-3分でデプロイ完了
3. URLをメモ: `https://your-app.vercel.app`

#### 2-6. プロキシサーバーのCORS設定を更新

1. Railwayに戻る
2. Variables タブで `CLIENT_URL` を更新:
   ```
   CLIENT_URL=https://your-app.vercel.app
   ```
3. サービスが自動的に再起動されます

---

## デプロイ確認

### 1. プロキシサーバーのヘルスチェック

ブラウザまたはcurlで確認:

```bash
curl https://your-app-production.up.railway.app/api/health
```

**期待される応答**:
```json
{
  "status": "ok",
  "timestamp": "2025-01-15T12:00:00.000Z"
}
```

### 2. フロントエンドの動作確認

1. `https://your-app.vercel.app` にアクセス
2. ブラウザのコンソール（F12）を開く
3. 以下のログを確認:
   ```
   🔧 AI Client Mode: PROXY
   🔧 API_KEY exists: false
   🔧 PROXY_URL: https://your-app-production.up.railway.app
   ```

4. ディベートを開始:
   - トピックを選択
   - AIとの議論を開始
   - フィードバック生成まで動作確認

### 3. ネットワークタブで確認

1. F12 → Network タブ
2. ディベート開始
3. リクエストが `https://your-app-production.up.railway.app/api/gemini/*` に送信されていることを確認

---

## トラブルシューティング

### ❌ CORS エラーが発生する

**症状**:
```
Access to fetch at 'https://your-proxy.railway.app/api/gemini/generate'
from origin 'https://your-app.vercel.app' has been blocked by CORS policy
```

**原因**: プロキシサーバーの`CLIENT_URL`が正しく設定されていない

**解決策**:
1. Railway → Variables → `CLIENT_URL` を確認
2. 正しいフロントエンドURLに設定:
   ```
   CLIENT_URL=https://your-app.vercel.app
   ```
3. サービスを再起動（自動的に再起動されます）

---

### ❌ プロキシサーバーが起動しない

**症状**: フロントエンドで "Failed to fetch" エラー

**確認項目**:

1. **環境変数の確認**:
   - Railway → Variables
   - `GEMINI_API_KEY` が設定されているか

2. **ログの確認**:
   - Railway → Deployments → 最新のデプロイをクリック
   - "View Logs" で起動ログを確認
   - エラーメッセージを確認

3. **package.jsonの確認**:
   ```bash
   cd server
   cat package.json
   ```
   `"start": "node index.js"` が存在するか確認

**解決策**:
```bash
# server/package.json を確認・修正
cd server
npm install  # 依存関係を再インストール
npm start    # ローカルで起動確認
```

---

### ❌ フロントエンドで "No client available" エラー

**症状**: ディベート開始時にエラー

**原因**: プロキシモードが有効だが、プロキシサーバーにアクセスできない

**解決策**:

1. **VITE_PROXY_URLの確認**:
   - Vercel → Settings → Environment Variables
   - `VITE_PROXY_URL` が正しく設定されているか
   - 末尾に `/` がないことを確認

2. **再デプロイ**:
   - Vercel → Deployments → "Redeploy"
   - 環境変数を変更した場合は必須

3. **プロキシサーバーの動作確認**:
   ```bash
   curl https://your-proxy.railway.app/api/health
   ```

---

### ❌ Gemini API エラー

**症状**:
```json
{
  "error": "Failed to generate content",
  "message": "API key not valid"
}
```

**解決策**:

1. **APIキーの確認**:
   - Google AI Studio (https://makersuite.google.com/app/apikey) でAPIキーを確認
   - Railway → Variables → `GEMINI_API_KEY` を更新

2. **APIキーの権限**:
   - Gemini APIが有効化されているか確認
   - クォータが残っているか確認

---

## コスト見積もり

### 無料枠で運用可能

- **Railway**:
  - 月500時間の実行時間無料
  - 100GBの帯域幅無料
  - 1つのサービスなら十分

- **Vercel**:
  - 月100GBの帯域幅無料
  - 100万リクエスト無料
  - 趣味プロジェクトには十分

- **Gemini API**:
  - 無料枠: 15 RPM（リクエスト/分）
  - 詳細: https://ai.google.dev/pricing

### 有料プラン（必要に応じて）

- **Railway**: $5/月〜（従量課金）
- **Vercel**: $20/月（Proプラン）
- **Gemini API**: 従量課金（無料枠超過時）

---

## セキュリティ推奨事項

### ✅ DO（すべきこと）

1. **APIキーの管理**:
   - プロキシサーバーの環境変数のみで管理
   - `.env`ファイルを`.gitignore`に含める（既に設定済み）
   - 定期的にAPIキーをローテーション

2. **HTTPS必須**:
   - Railway/Vercelは自動的にHTTPSを提供
   - カスタムドメインも無料でHTTPS対応

3. **CORS設定**:
   - `CLIENT_URL`に本番フロントエンドのURLのみを設定
   - 開発環境では`localhost`を許可（既に実装済み）

### ❌ DON'T（避けるべきこと）

1. **APIキーの露出**:
   - フロントエンドコードにAPIキーをハードコード
   - `.env.local`をGitにコミット
   - ブラウザのコンソールにAPIキーを表示

2. **セキュリティリスク**:
   - HTTPでのデプロイ（HTTPS必須）
   - CORSを`*`（全て許可）に設定

---

## 更新とメンテナンス

### フロントエンドの更新

```bash
# コードを変更
git add .
git commit -m "Update frontend"
git push origin main

# Vercelが自動的に再デプロイ
```

### プロキシサーバーの更新

```bash
# server/ フォルダのコードを変更
cd server
git add .
git commit -m "Update proxy server"
git push origin main

# Railwayが自動的に再デプロイ
```

### ロールバック

- **Vercel**:
  1. Deployments タブ
  2. 前のデプロイを選択
  3. "Promote to Production" をクリック

- **Railway**:
  1. Deployments タブ
  2. 前のデプロイを選択
  3. "Redeploy" をクリック

---

## カスタムドメインの設定

### Vercel でカスタムドメインを設定

1. Settings → Domains
2. ドメインを入力（例: `debatemaster.example.com`）
3. DNSレコードを追加:
   ```
   Type: CNAME
   Name: debatemaster
   Value: cname.vercel-dns.com
   ```

4. 自動的にHTTPS証明書が発行されます

### Railway でカスタムドメインを設定

1. Settings → Domains
2. "Custom Domain" をクリック
3. ドメインを入力（例: `api.debatemaster.example.com`）
4. DNSレコードを追加:
   ```
   Type: CNAME
   Name: api
   Value: <Railway提供のCNAME>
   ```

5. Vercelの`VITE_PROXY_URL`を更新:
   ```
   VITE_PROXY_URL=https://api.debatemaster.example.com
   ```

---

## モニタリング（オプション）

### Railway ログの確認

1. Deployments → 最新のデプロイ
2. "View Logs" でリアルタイムログを確認
3. エラーやパフォーマンス問題を監視

### Vercel Analytics（無料）

1. Vercel Dashboard → Analytics タブ
2. トラフィック、パフォーマンス、エラー率を確認

### Sentry 統合（エラー追跡）

```bash
npm install @sentry/react @sentry/vite-plugin
```

詳細: https://docs.sentry.io/platforms/javascript/guides/react/

---

## よくある質問（FAQ）

**Q: デプロイに費用はかかりますか？**
A: Railway/Vercelの無料枠で運用可能です。Gemini APIも無料枠があります。

**Q: プロキシサーバーは必須ですか？**
A: セキュリティのため強く推奨します。APIキーを隠蔽できます。

**Q: デプロイに失敗しました**
A: 本ドキュメントのトラブルシューティングセクションを確認してください。

**Q: カスタムドメインは使えますか？**
A: はい、Vercel/Railwayともに無料でカスタムドメイン対応可能です。

---

## サポート

問題が発生した場合:

1. **GitHub Issues**: https://github.com/yourusername/debatemaster-ai/issues
2. **デプロイログを確認**: Railway/Vercelのログ
3. **ブラウザコンソールを確認**: F12でエラーメッセージ確認

---

## 参考リンク

- [Railway Documentation](https://docs.railway.app/)
- [Vercel Documentation](https://vercel.com/docs)
- [Google Gemini API](https://ai.google.dev/)
- [Express.js CORS](https://expressjs.com/en/resources/middleware/cors.html)

---

## チェックリスト

デプロイ前に確認:

- [ ] プロキシサーバーが正常に起動（ヘルスチェックOK）
- [ ] フロントエンドがビルド成功
- [ ] 環境変数が正しく設定（GEMINI_API_KEY, CLIENT_URL, VITE_PROXY_URL）
- [ ] CORS設定が正しい
- [ ] ディベート機能が動作
- [ ] フィードバック生成が動作
- [ ] ブラウザコンソールにエラーなし

---

**デプロイ完了！🎉**

問題なくデプロイできたら、ユーザーにURLを共有してDebateMaster AIを楽しんでもらいましょう！
