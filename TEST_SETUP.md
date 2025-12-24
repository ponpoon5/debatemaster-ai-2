# テストセットアップガイド

## 📋 概要

このプロジェクトには、主要な機能に対する包括的なユニットテストが用意されています。

## 🧪 テスト対象

以下の主要コンポーネントに対してテストが実装されています：

### 1. エラーパーサー (`core/utils/error-parser.test.ts`)

- ✅ クオータ超過エラー（429）の検出
- ✅ サービス利用不可エラー（503）の検出
- ✅ タイムアウトエラーの検出
- ✅ ステータスコードの抽出
- ✅ ユーザーフレンドリーメッセージの生成
- ✅ コンテキスト付きメッセージ

**カバレッジ**: 17テストケース

### 2. 型ガード (`core/utils/type-guards.test.ts`)

- ✅ `hasValidUsageMetadata` - usageMetadataの存在確認
- ✅ `hasStructureAnalysis` - structureAnalysisの型ガード
- ✅ `isApiError` - ApiError型の判定
- ✅ 配列フィルタリングでの型ナローイング

**カバレッジ**: 30テストケース

### 3. トークン使用量計算 (`services/gemini/utils/token-usage.test.ts`)

- ✅ 正常なレスポンスからの抽出
- ✅ null/undefined `usageMetadata`の処理
- ✅ 部分的・不正な形式のメタデータ処理
- ✅ エッジケース（負の値、文字列、浮動小数点）
- ✅ 警告ログの出力確認

**カバレッジ**: 18テストケース

### 4. エラーハンドリングフック (`hooks/useErrorHandler.test.ts`)

- ✅ 初期状態の確認
- ✅ エラーハンドリングとalert表示
- ✅ コンテキスト付きエラーメッセージ
- ✅ エラークリア機能
- ✅ コールバック安定性（useCallback）
- ✅ 非同期エラーハンドリング

**カバレッジ**: 16テストケース

## 📦 使用技術

- **Vitest 4.0.16** - 高速なユニットテストフレームワーク
- **@testing-library/react 16.3.1** - Reactコンポーネントテスト
- **@testing-library/jest-dom 6.9.1** - DOM matchers
- **jsdom 27.3.0** - DOM環境シミュレーション

## 🚀 テストコマンド

```bash
# テストを実行（watchモード）
npm test

# テストを1回実行
npm run test:run

# カバレッジレポート付きで実行
npm run test:coverage

# UI付きでテスト実行
npm run test:ui
```

## ⚠️ 既知の問題

### 日本語フォルダパスの問題

現在、プロジェクトフォルダ名に日本語（全角文字）が含まれているため、Vitestがテストファイルを正しく読み込めない問題が発生しています。

**エラー**: `No test suite found in file`

**解決方法**:

1. **プロジェクトを英数字のみのパスに移動する（推奨）**

   ```bash
   # 例: フォルダをリネーム
   debatemaster-ai(vv3.4.1準安定版) → debatemaster-ai-v3.4.1
   ```

2. **または、WSL/Linuxで実行する**

   ```bash
   wsl
   cd /path/to/project
   npm test
   ```

3. **または、テストファイルを個別にコピーして実行する**
   - 英数字のみのパスにコピーしてテスト実行

## 📝 テストファイル構造

```
debatemaster-ai/
├── core/
│   └── utils/
│       ├── error-parser.ts
│       ├── error-parser.test.ts     # ✅ 17テスト
│       ├── type-guards.ts
│       └── type-guards.test.ts      # ✅ 30テスト
├── services/
│   └── gemini/
│       └── utils/
│           ├── token-usage.ts
│           └── token-usage.test.ts  # ✅ 18テスト
├── hooks/
│   ├── useErrorHandler.ts
│   └── useErrorHandler.test.ts      # ✅ 16テスト
├── test/
│   ├── setup.ts                     # テストセットアップ
│   └── simple.test.ts               # サンプルテスト
└── vitest.config.ts                 # Vitest設定
```

## 🎯 テスト作成ガイドライン

### 1. ファイル命名規則

- テストファイル: `[filename].test.ts` または `[filename].test.tsx`
- テスト対象ファイルと同じディレクトリに配置

### 2. テスト構造

```typescript
import { describe, it, expect } from 'vitest';
import { functionToTest } from './module';

describe('functionToTest', () => {
  describe('feature group', () => {
    it('should do something specific', () => {
      const result = functionToTest(input);
      expect(result).toBe(expected);
    });
  });
});
```

### 3. モックの使用

```typescript
import { vi, beforeEach, afterEach } from 'vitest';

describe('with mocks', () => {
  let spy: any;

  beforeEach(() => {
    spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    spy.mockRestore();
  });

  it('should call console.warn', () => {
    // テストコード
    expect(spy).toHaveBeenCalled();
  });
});
```

### 4. Reactフックのテスト

```typescript
import { renderHook, act } from '@testing-library/react';

describe('useCustomHook', () => {
  it('should update state', () => {
    const { result } = renderHook(() => useCustomHook());

    act(() => {
      result.current.updateState('new value');
    });

    expect(result.current.state).toBe('new value');
  });
});
```

## 📊 テストカバレッジ目標

- **関数カバレッジ**: 80%以上
- **行カバレッジ**: 75%以上
- **分岐カバレッジ**: 70%以上

### 現在のカバレッジ

| ファイル           | テスト数 | 状態         |
| ------------------ | -------- | ------------ |
| error-parser.ts    | 17       | ✅ 完了      |
| type-guards.ts     | 30       | ✅ 完了      |
| token-usage.ts     | 18       | ✅ 完了      |
| useErrorHandler.ts | 16       | ✅ 完了      |
| **合計**           | **81**   | **準備完了** |

## 🔄 CI/CD統合

将来的には、GitHub Actionsで自動テストを実行できます：

```yaml
# .github/workflows/test.yml (例)
name: Test
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run test:run
      - run: npm run test:coverage
```

## 📖 参考リソース

- [Vitest ドキュメント](https://vitest.dev/)
- [Testing Library ドキュメント](https://testing-library.com/)
- [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) - テストすべきパターン
- [ARCHITECTURE.md](./ARCHITECTURE.md) - システム構造の理解

## 🆘 トラブルシューティング

### Q: テストが見つからない

A: 以下を確認してください：

1. ファイル名が `*.test.ts` または `*.test.tsx` になっているか
2. `vitest.config.ts` が正しく設定されているか
3. プロジェクトパスに日本語が含まれていないか

### Q: モックが動作しない

A: `vi.spyOn()`の後に必ず`mockRestore()`を呼ぶようにしてください：

```typescript
afterEach(() => {
  spy.mockRestore();
});
```

### Q: 型エラーが出る

A: `/// <reference types="vitest" />` をvitest.config.tsの先頭に追加してください。

---

**テストを書いて、安全なリファクタリングを！** 🧪✨
