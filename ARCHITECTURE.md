# DebateMaster AI アーキテクチャドキュメント

このドキュメントでは、リファクタリング後のDebateMaster AIのアーキテクチャを説明します。

---

## 📐 全体構造

```
debatemaster-ai/
├── core/                    # コアロジック・型定義
│   ├── types/              # TypeScript型定義
│   ├── utils/              # ユーティリティ関数
│   └── config/             # 設定ファイル
├── hooks/                   # Reactカスタムフック
│   └── debate/             # ディベート関連フック
├── services/                # 外部サービス連携
│   └── gemini/             # Google Gemini AI
│       ├── analysis/       # 分析機能
│       ├── setup/          # セットアップ機能
│       ├── training/       # トレーニング機能
│       ├── session/        # セッション管理
│       ├── prompts/        # AIプロンプト
│       └── utils/          # サービスユーティリティ
├── components/              # Reactコンポーネント
│   ├── chat/               # チャット関連
│   ├── feedback/           # フィードバック関連
│   ├── setup/              # セットアップ関連
│   └── ...                 # その他
└── services/persistence/    # データ永続化
```

---

## 🏗️ レイヤーアーキテクチャ

```
┌─────────────────────────────────────┐
│         Presentation Layer          │  React Components
│    (Components, Screens, UI)        │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│         Application Layer           │  Custom Hooks
│    (useDebateApp, useErrorHandler)  │  Business Logic
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│          Service Layer              │  API Integration
│    (Gemini AI, Persistence)         │  External Services
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│           Core Layer                │  Types, Utils
│    (Type Definitions, Utilities)    │  Error Handling
└─────────────────────────────────────┘
```

---

## 📦 主要モジュール

### Core Layer

#### types/

型定義を集約。全てのレイヤーから参照される基盤。

```typescript
// core/types/error.types.ts
export interface ApiError {
  code: ErrorCode;
  message: string;
  status?: number;
  details?: unknown;
}

export enum ErrorCode {
  NETWORK_ERROR,
  TIMEOUT,
  QUOTA_EXCEEDED,
  // ...
}

export type Result<T, E = ApiError> = { success: true; data: T } | { success: false; error: E };
```

**役割**:

- 型の一元管理
- 型安全性の保証
- インターフェースの明確化

#### utils/

汎用的なユーティリティ関数。

```typescript
// core/utils/error-parser.ts
export function parseApiError(error: unknown): ApiError;

// core/utils/type-guards.ts
export function hasStructureAnalysis(msg: Message): msg is AnalyzedMessage;
export function hasValidUsageMetadata(response: any): boolean;
```

**役割**:

- 共通処理の集約
- 型ガード関数の提供
- エラー処理の統一

---

### Application Layer (Hooks)

#### useDebateApp (統合フック)

全体のビジネスロジックを統合。

```
useDebateApp
├── useDebateSession      (セッション管理)
├── useDebateMessaging    (メッセージング)
├── useDebateFeedback     (フィードバック)
├── useChatTools          (チャットツール)
├── useMessageAnalysis    (メッセージ分析)
└── useDebateArchives     (アーカイブ管理)
```

**データフロー**:

```
User Action
    ↓
useDebateApp
    ↓
Specialized Hook (useDebateSession, etc.)
    ↓
Service Layer (Gemini AI, etc.)
    ↓
State Update
    ↓
Component Re-render
```

#### useDebateSession

セッション管理に特化したフック。

**責任**:

- 議論の開始・終了
- セットアップ処理
- 前提条件の確認
- AIの先攻開始

**主要メソッド**:

```typescript
interface UseDebateSessionReturn {
  handleStartDebate: (settings: DebateSettings) => Promise<void>;
  handleSetupComplete: (settings: DebateSettings) => void;
  handlePremiseConfirmed: () => void;
  handleAiStart: (stance: 'PRO' | 'CON') => Promise<void>;
}
```

#### useDebateMessaging

メッセージ送受信に特化したフック。

**責任**:

- メッセージの送信
- AI応答の受信
- メッセージの構造分析
- トークン使用量の追跡

**主要メソッド**:

```typescript
interface UseDebateMessagingReturn {
  handleSendMessage: (text: string) => Promise<void>;
  messages: Message[];
  isSending: boolean;
}
```

#### useDebateFeedback

フィードバック生成に特化したフック。

**責任**:

- 議論の終了処理
- フィードバックの生成
- アーカイブの作成
- トークン使用量の集計

**主要メソッド**:

```typescript
interface UseDebateFeedbackReturn {
  handleEndDebate: () => Promise<void>;
  feedback: FeedbackData | null;
  isLoadingFeedback: boolean;
}
```

#### useErrorHandler

エラー処理の統一化。

**責任**:

- エラーの表示
- エラー履歴の管理
- エラークリア

**使用例**:

```typescript
const { handleError, lastError, clearError } = useErrorHandler();

try {
  await someOperation();
} catch (error) {
  const apiError = parseApiError(error);
  handleError(apiError, '操作名');
}
```

---

### Service Layer

#### Gemini AI Services

Google Gemini AIとの統合。

**ディレクトリ構造**:

```
services/gemini/
├── analysis/           # 分析サービス
│   ├── advice.ts      # アドバイス生成
│   ├── strategy.ts    # 戦略提案
│   ├── structure.ts   # 構造分析
│   ├── fact-check.ts  # ファクトチェック
│   ├── phase.ts       # フェーズ分析
│   ├── summary.ts     # 要約生成
│   └── feedback/      # フィードバック
│       ├── schema.ts  # スキーマ定義
│       └── feedback.ts# 生成ロジック
├── setup/             # セットアップサービス
│   ├── topic.ts       # トピック生成
│   ├── scenario.ts    # シナリオ生成
│   └── premise.ts     # 前提生成
├── training/          # トレーニングサービス
├── session/           # セッション管理
├── prompts/           # プロンプト定義
└── utils/             # ユーティリティ
    └── token-usage.ts # トークン計測
```

**統一パターン**:

全てのサービス関数は以下のパターンに従う:

```typescript
export const serviceName = async (
  params: InputType
): Promise<{ data: OutputType, usage: TokenUsage }> => {
  try {
    const response = await ai.models.generateContent({...});
    const usage = extractUsage(response);
    const data = parseResponse(response);
    return { data, usage };
  } catch (error) {
    const apiError = parseApiError(error);
    console.error("[serviceName] failed:", apiError);
    return { data: fallbackValue, usage: defaultUsage };
  }
};
```

**重要な設計原則**:

1. **エラーをthrowしない** - 常にフォールバック値を返す
2. **トークン使用量を追跡** - 全てのAPI呼び出しで計測
3. **ログを出力** - デバッグを容易にする

#### Persistence Services

ローカルストレージによるデータ永続化。

```typescript
services/persistence/
├── storage.ts         # ストレージ抽象化
├── archive.ts         # アーカイブ管理
└── backup.ts          # バックアップ・リストア
```

**データモデル**:

```typescript
interface DebateMasterStorage {
  settings: DebateSettings | null;
  archives: DebateArchive[];
  lastUpdated: string;
}
```

---

### Presentation Layer (Components)

#### コンポーネント設計原則

1. **Small & Focused** - 各コンポーネントは100-150行以内
2. **Single Responsibility** - 単一の責任を持つ
3. **Reusable** - 再利用可能な設計
4. **Type-Safe** - 完全な型定義

#### 主要コンポーネント

**Screen Components**:

```
├── TopScreen.tsx          # トップ画面
├── SetupScreen.tsx        # セットアップ画面
├── ChatScreen.tsx         # チャット画面
└── FeedbackScreen.tsx     # フィードバック画面
```

**Feature Components**:

```
components/
├── chat/
│   ├── MessageItem.tsx
│   ├── InputArea.tsx
│   ├── ChatHeader.tsx        # NEW (リファクタリングで作成)
│   ├── ChatEmptyState.tsx    # NEW
│   └── HomeworkModal.tsx     # NEW
├── feedback/
│   ├── DetailedReviewSection.tsx
│   ├── LogicSection.tsx
│   ├── ScoreTrendChart.tsx
│   └── QuestioningCard.tsx
└── setup/
    ├── ModeSelector.tsx
    └── TopicInput.tsx
```

#### コンポーネント間通信

```
Props Down, Events Up パターン

Parent Component
    │
    ├─ Props ──→ Child Component
    │                │
    └─ Events ←──────┘
```

**例**:

```typescript
// Parent
<ChatScreen
  messages={messages}
  onSendMessage={handleSendMessage}
/>

// Child
interface ChatScreenProps {
  messages: Message[];           // Props down
  onSendMessage: (text: string) => void;  // Events up
}
```

---

## 🔄 データフロー

### メッセージ送信フロー

```
User Input (InputArea)
    ↓
ChatScreen.handleSendMessage
    ↓
useDebateApp.handleSendMessage
    ↓
useDebateMessaging.handleSendMessage
    ↓
Gemini AI Service (session/debate.ts)
    ↓
parseApiError (on error)
    ↓
State Update (messages)
    ↓
Component Re-render
    ↓
MessageItem displays new message
```

### エラー処理フロー

```
Service Layer (API Call)
    ↓
catch (error)
    ↓
parseApiError(error)
    ↓ ApiError
handleError(apiError, context)
    ↓
getUserFriendlyMessage(apiError, context)
    ↓
alert() / Toast UI
```

### フィードバック生成フロー

```
User clicks "終了"
    ↓
useDebateFeedback.handleEndDebate
    ↓
generateFeedback(settings, messages)
    ↓
Gemini AI (analysis/feedback.ts)
    ↓
Parse response with schema
    ↓
State Update (feedback)
    ↓
Navigate to FeedbackScreen
    ↓
Display analyzed results
```

---

## 🎨 型システム設計

### 型の階層構造

```
Core Types (common.types.ts)
    ├── Message
    ├── DebateSettings
    ├── TokenUsage
    └── DebateMode

Extended Types
    ├── AnalyzedMessage (Message + structureAnalysis)
    ├── ScoredReview (MessageReview + score)
    └── ApiError (error.types.ts)

Component Props
    ├── ChatScreenProps
    ├── MessageItemProps
    └── FeedbackScreenProps
```

### 型ガードの活用

```typescript
// 基本型
interface Message {
  id: string;
  text: string;
  role: 'user' | 'model';
  structureAnalysis?: UtteranceStructureScore;
}

// 拡張型
interface AnalyzedMessage extends Message {
  structureAnalysis: UtteranceStructureScore; // 必須
}

// 型ガード
function hasStructureAnalysis(msg: Message): msg is AnalyzedMessage {
  return msg.structureAnalysis != null;
}

// 使用
const analyzedMessages = messages.filter(hasStructureAnalysis);
// analyzedMessages の型は AnalyzedMessage[]
```

---

## 🔧 ビルドシステム

### Vite設定

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // 依存関係ごとにチャンク分割
          if (id.includes('node_modules/react')) return 'react-vendor';
          if (id.includes('@google/generative-ai')) return 'google-ai';
          if (id.includes('lucide-react')) return 'lucide-icons';
          if (id.includes('/components/feedback/')) return 'feedback';
          if (id.includes('/components/chat/')) return 'chat';
          if (id.includes('node_modules')) return 'vendor';
        },
      },
    },
  },
});
```

### チャンク戦略

```
初期ロード (Critical Path)
├── react-vendor.js (189 KB)
├── index.js (152 KB)
└── lucide-icons.js (48 KB)
    Total: ~390 KB

遅延ロード (Lazy Loading)
├── chat.js (158 KB)      - チャット画面で使用時
├── feedback.js (58 KB)   - フィードバック画面で使用時
└── google-ai.js          - AI機能使用時

共有依存関係 (Shared)
└── vendor.js (257 KB)    - 初回のみ、以降キャッシュ
```

---

## 🚀 パフォーマンス最適化

### レンダリング最適化

1. **メモ化**

```typescript
const MemoizedComponent = React.memo(MyComponent);

const memoizedValue = useMemo(() => {
  return expensiveCalculation(data);
}, [data]);

const memoizedCallback = useCallback(() => {
  handleClick();
}, [dependency]);
```

2. **仮想スクロール** (大量メッセージ対応)

```typescript
// 必要に応じて実装
import { FixedSizeList } from 'react-window';
```

### バンドル最適化

1. **Tree Shaking** - 使用されないコードの除去
2. **Code Splitting** - チャンクによる分割
3. **Lazy Loading** - 必要時にのみロード

```typescript
// 動的インポート
const FeedbackScreen = lazy(() => import('./FeedbackScreen'));

<Suspense fallback={<Loading />}>
  <FeedbackScreen />
</Suspense>
```

---

## 🔐 セキュリティ

### API キー管理

```typescript
// 環境変数から読み込み
export const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || fallbackKey;
```

**ベストプラクティス**:

- 本番環境では必ず環境変数を使用
- フォールバックキーは開発用のみ
- `.env.local`をgitignoreに追加

### XSS対策

```typescript
// Reactは自動的にエスケープ
<div>{userInput}</div>  // 安全

// dangerouslySetInnerHTMLは使用しない
<div dangerouslySetInnerHTML={{__html: userInput}} />  // 危険
```

---

## 📊 監視・ロギング

### エラーログ

```typescript
// 統一されたログ形式
console.error('[関数名] failed:', apiError);
```

### トークン使用量追跡

```typescript
interface TokenUsage {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
}

// 全てのAI呼び出しで追跡
const usage = extractUsage(response);
updateTokenUsage(usage);
```

---

## 🧪 テスト戦略

### ユニットテスト（推奨）

```typescript
// 型ガードのテスト
describe('hasStructureAnalysis', () => {
  it('should return true for analyzed message', () => {
    const msg: Message = {
      id: '1',
      text: 'test',
      role: 'user',
      structureAnalysis: {
        /* ... */
      },
    };
    expect(hasStructureAnalysis(msg)).toBe(true);
  });
});

// エラーパーサーのテスト
describe('parseApiError', () => {
  it('should parse quota exceeded error', () => {
    const error = { status: 429 };
    const result = parseApiError(error);
    expect(result.code).toBe(ErrorCode.QUOTA_EXCEEDED);
  });
});
```

### 統合テスト（推奨）

```typescript
// フックのテスト
import { renderHook, act } from '@testing-library/react-hooks';

test('useDebateSession handles start debate', async () => {
  const { result } = renderHook(() => useDebateSession());

  await act(async () => {
    await result.current.handleStartDebate(mockSettings);
  });

  expect(result.current.isLoading).toBe(false);
});
```

---

## 📚 依存関係

### 主要ライブラリ

```json
{
  "dependencies": {
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "@google/generative-ai": "latest",
    "lucide-react": "latest"
  },
  "devDependencies": {
    "typescript": "^5.8",
    "vite": "^6.4",
    "@vitejs/plugin-react": "latest"
  }
}
```

### 依存関係グラフ

```
React Application
    ↓
Custom Hooks (Application Logic)
    ↓
Service Layer
    ├─→ @google/generative-ai
    └─→ localStorage API
```

---

## 🔄 今後の拡張ポイント

### 短期（次回リリース）

1. **Toast UI の導入**

```typescript
// alert() を置き換え
import { toast } from 'react-hot-toast';

const { handleError } = useErrorHandler({
  onError: message => toast.error(message),
});
```

2. **ユニットテストの追加**

- 型ガード関数
- エラーパーサー
- 各カスタムフック

### 中期（3ヶ月）

1. **状態管理ライブラリの導入**

```typescript
// Zustandの例
import create from 'zustand';

const useDebateStore = create(set => ({
  messages: [],
  addMessage: msg =>
    set(state => ({
      messages: [...state.messages, msg],
    })),
}));
```

2. **E2Eテスト**

```typescript
// Playwrightの例
test('complete debate flow', async ({ page }) => {
  await page.goto('/');
  await page.click('[data-testid="start-debate"]');
  // ...
});
```

### 長期（6ヶ月）

1. **マイクロフロントエンド化**
2. **PWA対応**
3. **オフライン機能**

---

## 📖 参考資料

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Documentation](https://react.dev/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Google AI Documentation](https://ai.google.dev/)

---

**このドキュメントは継続的に更新されます。**
