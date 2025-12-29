import { TokenUsage, DebateArchive } from '../types';

export interface TokenStatistics {
  totalUsage: TokenUsage;
  sessionCount: number;
  averagePerSession: TokenUsage;
  totalCostUSD: number;
  totalCostJPY: number;
  sessionBreakdown: Array<{
    id: string;
    topic: string;
    date: string;
    usage: TokenUsage;
    costUSD: number;
    costJPY: number;
  }>;
}

const USD_JPY_RATE = 150;
const INPUT_COST_PER_MILLION = 0.075;
const OUTPUT_COST_PER_MILLION = 0.3;

/**
 * トークン使用量からコストを計算
 * @param usage トークン使用量
 * @returns USD と JPY でのコスト
 */
export const calculateCost = (usage: TokenUsage): { usd: number; jpy: number } => {
  const inputCost = (usage.inputTokens / 1_000_000) * INPUT_COST_PER_MILLION;
  const outputCost = (usage.outputTokens / 1_000_000) * OUTPUT_COST_PER_MILLION;
  const totalUSD = inputCost + outputCost;
  const totalJPY = totalUSD * USD_JPY_RATE;

  return {
    usd: Number(totalUSD.toFixed(4)),
    jpy: Number(totalJPY.toFixed(2)),
  };
};

/**
 * アーカイブからトークン統計を計算
 * @param archives ディベートアーカイブの配列
 * @returns 統計情報
 */
export const calculateTokenStatistics = (archives: DebateArchive[]): TokenStatistics => {
  // セッションごとの詳細データを作成
  const sessionBreakdown = archives
    .filter(archive => archive.tokenUsage) // tokenUsageがあるもののみ
    .map(archive => {
      const usage = archive.tokenUsage!;
      const cost = calculateCost(usage);

      return {
        id: archive.id,
        topic: archive.topic,
        date: archive.date,
        usage,
        costUSD: cost.usd,
        costJPY: cost.jpy,
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // 日付降順

  // 総累積計算
  const totalUsage = sessionBreakdown.reduce(
    (acc, session) => ({
      inputTokens: acc.inputTokens + session.usage.inputTokens,
      outputTokens: acc.outputTokens + session.usage.outputTokens,
      totalTokens: acc.totalTokens + session.usage.totalTokens,
    }),
    { inputTokens: 0, outputTokens: 0, totalTokens: 0 }
  );

  const totalCost = calculateCost(totalUsage);
  const sessionCount = sessionBreakdown.length;

  // 平均計算
  const averagePerSession: TokenUsage =
    sessionCount > 0
      ? {
          inputTokens: Math.round(totalUsage.inputTokens / sessionCount),
          outputTokens: Math.round(totalUsage.outputTokens / sessionCount),
          totalTokens: Math.round(totalUsage.totalTokens / sessionCount),
        }
      : { inputTokens: 0, outputTokens: 0, totalTokens: 0 };

  return {
    totalUsage,
    sessionCount,
    averagePerSession,
    totalCostUSD: totalCost.usd,
    totalCostJPY: totalCost.jpy,
    sessionBreakdown,
  };
};

/**
 * トークン数をフォーマットして表示用文字列に変換
 * @param tokens トークン数
 * @returns フォーマット済み文字列 (例: "1,234" or "1.2K")
 */
export const formatTokenCount = (tokens: number): string => {
  if (tokens >= 1_000_000) {
    return `${(tokens / 1_000_000).toFixed(1)}M`;
  } else if (tokens >= 1_000) {
    return `${(tokens / 1_000).toFixed(1)}K`;
  }
  return tokens.toLocaleString();
};

/**
 * コストをフォーマットして表示用文字列に変換
 * @param cost コスト (USD or JPY)
 * @param currency 通貨タイプ
 * @returns フォーマット済み文字列
 */
export const formatCost = (cost: number, currency: 'usd' | 'jpy'): string => {
  if (currency === 'usd') {
    return `$${cost.toFixed(4)}`;
  } else {
    return `¥${cost.toFixed(2)}`;
  }
};
