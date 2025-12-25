import { WeaknessProfile, SessionMetric } from '../core/types';

/**
 * 弱点プロファイルを更新する関数
 *
 * SessionMetricsから指標を集計し、既存プロファイルとマージする。
 * numerator/denominatorを累積し、スコアを再計算する。
 *
 * @param currentProfile - 現在の弱点プロファイル
 * @param newMetrics - 新しいセッションメトリクス配列
 * @returns 更新された弱点プロファイル
 */
export const updateWeaknessProfile = (
  currentProfile: WeaknessProfile,
  newMetrics?: SessionMetric[]
): WeaknessProfile => {
  if (!newMetrics || newMetrics.length === 0) {
    return currentProfile;
  }

  const updatedMetrics = { ...currentProfile.metrics };

  newMetrics.forEach(m => {
    const existing = updatedMetrics[m.key] || {
      key: m.key,
      label: m.label,
      description: '',
      rate: { numerator: 0, denominator: 0 },
      score: 0,
      lastUpdated: new Date().toISOString(),
      sampleSize: 0,
    };

    // Aggregate: Accumulate numerator and denominator
    const newNumerator = existing.rate.numerator + m.rate.numerator;
    const newDenominator = existing.rate.denominator + m.rate.denominator;

    // Recalculate score (simple percentage for now)
    const newScore =
      newDenominator > 0 ? Math.round((newNumerator / newDenominator) * 100) : 0;

    updatedMetrics[m.key] = {
      ...existing,
      rate: { numerator: newNumerator, denominator: newDenominator },
      score: newScore,
      lastUpdated: new Date().toISOString(),
      sampleSize: newDenominator,
    };
  });

  return {
    lastUpdated: new Date().toISOString(),
    metrics: updatedMetrics,
  };
};
