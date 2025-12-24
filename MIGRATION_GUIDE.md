# 移行ガイド - DebateMaster AI リファクタリング

このガイドは、リファクタリング後のコードベースで開発を継続する開発者向けの移行手順を説明します。

---

## 📋 目次

1. [エラー処理の新しいパターン](#エラー処理の新しいパターン)
2. [型ガードの使用方法](#型ガードの使用方法)
3. [フックの使用方法](#フックの使用方法)
4. [コンポーネント開発](#コンポーネント開発)
5. [よくある質問](#よくある質問)

---

## エラー処理の新しいパターン

### ❌ 旧パターン（使用しない）

```typescript
try {
  const response = await someApiCall();
} catch (error: any) {
  console.error('エラー:', error);
  let errorMessage = 'エラーが発生しました';

  const status = error.status || error.response?.status;
  if (status === 429) {
    errorMessage = 'API制限を超過しました';
  } else if (status === 503) {
    errorMessage = 'サービスが利用できません';
  }

  alert(errorMessage);
}
```

### ✅ 新パターン（推奨）

```typescript
import { parseApiError } from '@/core/utils/error-parser';

try {
  const response = await someApiCall();
} catch (error: unknown) {
  // unknown型を使用
  const apiError = parseApiError(error);
  console.error('[関数名] failed:', apiError);

  // エラーハンドラーを使用する場合
  handleError(apiError, '処理のコンテキスト');

  // または独自の処理
  if (apiError.code === ErrorCode.QUOTA_EXCEEDED) {
    // クオータ超過時の処理
  }
}
```

### エラー型の使用

```typescript
import { ApiError, ErrorCode } from '@/core/types/error.types';

// エラーを返す関数
function processData(data: unknown): ApiError | null {
  if (!isValid(data)) {
    return {
      code: ErrorCode.VALIDATION_ERROR,
      message: 'データが不正です',
      details: data,
    };
  }
  return null;
}

// Result型を使用する場合
import { Result } from '@/core/types/error.types';

async function fetchData(): Promise<Result<Data>> {
  try {
    const data = await api.getData();
    return { success: true, data };
  } catch (error) {
    const apiError = parseApiError(error);
    return { success: false, error: apiError };
  }
}
```

---

## 型ガードの使用方法

### ❌ 旧パターン（使用しない）

```typescript
// non-null assertionの使用
const score = review.score!;
const analysis = msg.structureAnalysis!;

// 危険な型変換
const data = response as MyType;
```

### ✅ 新パターン（推奨）

#### 1. 既存の型ガードを使用

```typescript
import { hasStructureAnalysis, AnalyzedMessage } from '@/core/utils/type-guards';

// メッセージのフィルタリング
const analyzedMessages = messages.filter((m): m is AnalyzedMessage => hasStructureAnalysis(m));

// この時点で analyzedMessages の型は AnalyzedMessage[]
// structureAnalysis プロパティに安全にアクセス可能
analyzedMessages.forEach(msg => {
  console.log(msg.structureAnalysis.overall); // OK
});
```

#### 2. カスタム型ガードの作成

```typescript
// インターフェースの拡張
interface ValidatedData extends BaseData {
  requiredField: string;
}

// 型ガード関数
function isValidatedData(data: BaseData): data is ValidatedData {
  return typeof data.requiredField === 'string' && data.requiredField.length > 0;
}

// 使用例
const validData = allData.filter(isValidatedData);
// validData の型は ValidatedData[] に自動的に絞り込まれる
```

#### 3. オプショナルプロパティの安全な使用

```typescript
// ❌ 悪い例
function processMessage(msg: Message) {
  const score = msg.structureAnalysis!.overall; // 危険
}

// ✅ 良い例
function processMessage(msg: Message) {
  if (hasStructureAnalysis(msg)) {
    // この中で msg は AnalyzedMessage 型
    const score = msg.structureAnalysis.overall; // 安全
  }
}
```

---

## フックの使用方法

### useDebateApp の使用

```typescript
import { useDebateApp } from '@/hooks/useDebateApp';

function MyComponent() {
  const {
    // セッション関連（useDebateSession から）
    handleStartDebate,
    handleSetupComplete,
    handlePremiseConfirmed,
    handleAiStart,

    // メッセージング関連（useDebateMessaging から）
    handleSendMessage,

    // フィードバック関連（useDebateFeedback から）
    handleEndDebate,

    // 状態
    screen,
    settings,
    messages,
    feedback,
  } = useDebateApp();

  // 使用例
  const startDebate = async () => {
    await handleStartDebate(newSettings);
  };
}
```

### useErrorHandler の使用

```typescript
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { parseApiError } from '@/core/utils/error-parser';

function MyComponent() {
  const { handleError, lastError, clearError } = useErrorHandler();

  const fetchData = async () => {
    try {
      const data = await api.getData();
    } catch (error) {
      const apiError = parseApiError(error);
      handleError(apiError, "データ取得");
    }
  };

  return (
    <>
      <button onClick={fetchData}>データ取得</button>
      {lastError && (
        <div className="error">
          {lastError.message}
          <button onClick={clearError}>閉じる</button>
        </div>
      )}
    </>
  );
}
```

---

## コンポーネント開発

### 新しいコンポーネントの作成

#### 小さく、責任を限定する

```typescript
// ❌ 悪い例: 巨大なコンポーネント
function MassiveComponent() {
  // 500行のコード...
}

// ✅ 良い例: 小さなコンポーネントに分割
function HeaderComponent() { /* ... */ }
function ContentComponent() { /* ... */ }
function FooterComponent() { /* ... */ }

function MainComponent() {
  return (
    <>
      <HeaderComponent />
      <ContentComponent />
      <FooterComponent />
    </>
  );
}
```

#### Props の型定義

```typescript
interface MyComponentProps {
  // 必須プロパティ
  title: string;
  onSubmit: (data: FormData) => void;

  // オプショナルプロパティ
  isLoading?: boolean;

  // コールバック with optional
  onError?: (error: ApiError) => void;
}

export const MyComponent: React.FC<MyComponentProps> = ({
  title,
  onSubmit,
  isLoading = false,
  onError,
}) => {
  // コンポーネント実装
};
```

### 再利用可能なコンポーネントの例

```typescript
// components/common/ErrorBoundary.tsx
import { ApiError } from '@/core/types/error.types';
import { getUserFriendlyMessage } from '@/core/utils/error-parser';

interface ErrorDisplayProps {
  error: ApiError;
  onRetry?: () => void;
  onDismiss?: () => void;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  onRetry,
  onDismiss
}) => {
  const message = getUserFriendlyMessage(error);

  return (
    <div className="error-display">
      <p>{message}</p>
      {onRetry && <button onClick={onRetry}>再試行</button>}
      {onDismiss && <button onClick={onDismiss}>閉じる</button>}
    </div>
  );
};
```

---

## サービス関数の作成

### 新しいサービス関数のテンプレート

````typescript
import { parseApiError } from '@/core/utils/error-parser';
import { extractUsage } from '../utils/token-usage';
import { ai } from '@/core/config/ai.config';

export const myNewService = async (
  input: InputType
): Promise<{ data: OutputType; usage: TokenUsage }> => {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: [
        /* ... */
      ],
      // ...
    });

    const usage = extractUsage(response);
    const text = response.text;

    // JSONパース（必要に応じて）
    const cleaned = text
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();
    const data = JSON.parse(cleaned) as OutputType;

    return { data, usage };
  } catch (error) {
    const apiError = parseApiError(error);
    console.error('[myNewService] failed:', apiError);

    // フォールバック値を返す
    return {
      data: getDefaultValue(),
      usage: { inputTokens: 0, outputTokens: 0, totalTokens: 0 },
    };
  }
};
````

---

## プロンプトの作成

### 新しいプロンプトのガイドライン

```typescript
export const getMyPrompt = (param: string) => {
  return `
  あなたは[役割]です。
  以下の[タスク]を実行してください。

  入力: ${param}

  [タスクの詳細]
  1. [ステップ1]
  2. [ステップ2]
  3. [ステップ3]

  【重要】全ての出力は**必ず日本語**で記述してください。英語は一切使用しないでください。
  出力はJSON形式で行ってください。
  `;
};
```

**重要事項**:

- 必ず日本語出力を強制する
- JSON出力の場合は明示的に指示
- 具体的な例を含める
- スキーマ定義を明確にする

---

## よくある質問

### Q1: 既存のコードを修正する必要がありますか？

A: いいえ、既存のコードは動作し続けます。ただし、**新しいコードでは新しいパターンを使用することを強く推奨**します。

### Q2: non-null assertionを使っても良いですか？

A: **使用しないでください**。代わりに型ガードを使用してください。non-null assertionはランタイムエラーの原因になります。

```typescript
// ❌ 使用しない
const value = obj.property!;

// ✅ 使用する
if (obj.property !== undefined) {
  const value = obj.property;
}

// ✅ または型ガードを使用
if (hasProperty(obj)) {
  const value = obj.property; // 型が自動的に絞り込まれる
}
```

### Q3: 型エラーが出たらどうすれば良いですか？

A: 以下の順序で確認してください:

1. **型ガードを使用できないか検討**

```typescript
if (hasStructureAnalysis(msg)) {
  // ここで安全にアクセス可能
}
```

2. **オプショナルチェーンを使用**

```typescript
const value = obj?.property?.nestedProperty;
```

3. **デフォルト値を使用**

```typescript
const value = obj?.property ?? defaultValue;
```

4. **どうしても必要な場合のみ型アサーション**

```typescript
const value = obj as MyType; // 最終手段
```

### Q4: alert()を使っても良いですか？

A: 既存のコードでは問題ありませんが、**新しいコードではuseErrorHandlerを使用することを推奨**します。将来的にToast UIに置き換える際も一箇所の変更で対応できます。

```typescript
// ❌ 直接alert使用
catch (error) {
  alert("エラーが発生しました");
}

// ✅ useErrorHandler使用
const { handleError } = useErrorHandler();

catch (error) {
  const apiError = parseApiError(error);
  handleError(apiError, "処理名");
}
```

### Q5: 大きなコンポーネントを作成しても良いですか？

A: **100-150行を超える場合は分割を検討してください**。以下の基準で判断:

- 複数の責任を持っている → 分割
- 再利用される可能性がある → 分割
- テストが複雑になる → 分割

### Q6: エラーをthrowしても良いですか？

A: **サービス層では基本的にthrowせず、フォールバック値を返してください**。

```typescript
// ❌ エラーをthrow
export const myService = async () => {
  const data = await api.call();
  if (!data) {
    throw new Error('データがありません');
  }
  return data;
};

// ✅ フォールバック値を返す
export const myService = async () => {
  try {
    const data = await api.call();
    return { data, usage };
  } catch (error) {
    const apiError = parseApiError(error);
    console.error('[myService] failed:', apiError);
    return { data: getDefaultValue(), usage: defaultUsage };
  }
};
```

### Q7: TypeScriptの型チェックを無効化しても良いですか？

A: **絶対にしないでください**。型チェックはバグを防ぐための重要な仕組みです。

```typescript
// ❌ 絶対にしない
// @ts-ignore
const value = dangerousOperation();

// ✅ 正しい方法
const value = safeOperation();
// または
if (isValidType(data)) {
  const value = data.property;
}
```

---

## チェックリスト

新しいコードを書く際に、以下を確認してください:

### エラー処理

- [ ] `parseApiError`を使用している
- [ ] `error`の型を`unknown`にしている
- [ ] 適切なフォールバック値を返している
- [ ] エラーログを出力している

### 型安全性

- [ ] non-null assertion (`!`) を使用していない
- [ ] 型ガードを適切に使用している
- [ ] オプショナルチェーン (`?.`) を活用している
- [ ] `any`型を使用していない

### コンポーネント

- [ ] 100-150行以内に収まっている
- [ ] 単一の責任を持っている
- [ ] Propsの型定義がある
- [ ] 再利用可能な設計になっている

### プロンプト

- [ ] 日本語出力を強制している
- [ ] JSON形式を明示している
- [ ] 具体的な例を含んでいる

### ビルド

- [ ] TypeScriptのエラーがない
- [ ] ビルドが成功する
- [ ] 不要なimportがない

---

## サポート

質問や問題がある場合:

1. このガイドを再確認
2. [REFACTORING_REPORT.md](./REFACTORING_REPORT.md)を参照
3. [ARCHITECTURE.md](./ARCHITECTURE.md)でアーキテクチャを確認
4. GitHubのIssueで質問

---

**Happy Coding! 🚀**
