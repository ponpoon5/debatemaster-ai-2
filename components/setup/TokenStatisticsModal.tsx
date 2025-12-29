import React, { useMemo, useState } from 'react';
import { X, TrendingUp, DollarSign, BarChart3 } from 'lucide-react';
import { DebateArchive } from '../../core/types';
import {
  calculateTokenStatistics,
  formatTokenCount,
  formatCost,
} from '../../core/utils/token-statistics';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface TokenStatisticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  archives: DebateArchive[];
}

type SortType = 'date' | 'tokens' | 'cost';

export const TokenStatisticsModal: React.FC<TokenStatisticsModalProps> = ({
  isOpen,
  onClose,
  archives,
}) => {
  const [sortType, setSortType] = useState<SortType>('date');

  const statistics = useMemo(() => calculateTokenStatistics(archives), [archives]);

  // グラフ用データの準備
  const chartData = useMemo(() => {
    return statistics.sessionBreakdown
      .slice()
      .reverse() // 時系列順（古い→新しい）
      .map(session => ({
        date: new Date(session.date).toLocaleDateString('ja-JP', {
          month: 'short',
          day: 'numeric',
        }),
        input: session.usage.inputTokens,
        output: session.usage.outputTokens,
        total: session.usage.totalTokens,
        topic: session.topic,
      }));
  }, [statistics.sessionBreakdown]);

  // ソート処理
  const sortedSessions = useMemo(() => {
    const sessions = [...statistics.sessionBreakdown];

    switch (sortType) {
      case 'date':
        return sessions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      case 'tokens':
        return sessions.sort((a, b) => b.usage.totalTokens - a.usage.totalTokens);
      case 'cost':
        return sessions.sort((a, b) => b.costUSD - a.costUSD);
      default:
        return sessions;
    }
  }, [statistics.sessionBreakdown, sortType]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-8 h-8" />
            <h2 className="text-2xl font-bold">トークン使用量統計</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            aria-label="閉じる"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-6">
          {statistics.sessionCount === 0 ? (
            <div className="text-center py-12">
              <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">まだトークン使用履歴がありません</p>
            </div>
          ) : (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {/* Total Tokens */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                  <div className="flex items-center gap-2 text-blue-700 mb-2">
                    <TrendingUp className="w-5 h-5" />
                    <span className="font-semibold">総トークン数</span>
                  </div>
                  <div className="text-3xl font-bold text-blue-900 mb-1">
                    {formatTokenCount(statistics.totalUsage.totalTokens)}
                  </div>
                  <div className="text-sm text-blue-600">
                    Input: {formatTokenCount(statistics.totalUsage.inputTokens)} / Output:{' '}
                    {formatTokenCount(statistics.totalUsage.outputTokens)}
                  </div>
                  <div className="text-xs text-blue-500 mt-2">
                    {statistics.sessionCount} セッション
                  </div>
                </div>

                {/* Total Cost USD */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                  <div className="flex items-center gap-2 text-green-700 mb-2">
                    <DollarSign className="w-5 h-5" />
                    <span className="font-semibold">総コスト (USD)</span>
                  </div>
                  <div className="text-3xl font-bold text-green-900 mb-1">
                    {formatCost(statistics.totalCostUSD, 'usd')}
                  </div>
                  <div className="text-sm text-green-600">
                    平均: {formatCost(statistics.totalCostUSD / statistics.sessionCount, 'usd')} /
                    セッション
                  </div>
                </div>

                {/* Total Cost JPY */}
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                  <div className="flex items-center gap-2 text-purple-700 mb-2">
                    <DollarSign className="w-5 h-5" />
                    <span className="font-semibold">総コスト (JPY)</span>
                  </div>
                  <div className="text-3xl font-bold text-purple-900 mb-1">
                    {formatCost(statistics.totalCostJPY, 'jpy')}
                  </div>
                  <div className="text-sm text-purple-600">
                    平均: {formatCost(statistics.totalCostJPY / statistics.sessionCount, 'jpy')} /
                    セッション
                  </div>
                </div>
              </div>

              {/* Chart Section */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
                <h3 className="text-lg font-bold text-gray-800 mb-4">トークン使用量の推移</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="date"
                      stroke="#6b7280"
                      style={{ fontSize: '12px' }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        padding: '12px',
                      }}
                      formatter={(value: number, name: string) => {
                        const labels: Record<string, string> = {
                          input: 'Input Tokens',
                          output: 'Output Tokens',
                          total: 'Total Tokens',
                        };
                        return [formatTokenCount(value), labels[name] || name];
                      }}
                      labelFormatter={(label, payload) => {
                        if (payload && payload[0]) {
                          return `${label} - ${payload[0].payload.topic}`;
                        }
                        return label;
                      }}
                    />
                    <Legend
                      wrapperStyle={{ paddingTop: '20px' }}
                      formatter={(value: string) => {
                        const labels: Record<string, string> = {
                          input: 'Input Tokens',
                          output: 'Output Tokens',
                        };
                        return labels[value] || value;
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="input"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={{ fill: '#3b82f6', r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="output"
                      stroke="#a855f7"
                      strokeWidth={2}
                      dot={{ fill: '#a855f7', r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Sort Buttons */}
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setSortType('date')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    sortType === 'date'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  日付順
                </button>
                <button
                  onClick={() => setSortType('tokens')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    sortType === 'tokens'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  トークン数順
                </button>
                <button
                  onClick={() => setSortType('cost')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    sortType === 'cost'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  コスト順
                </button>
              </div>

              {/* Session List */}
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-gray-800 mb-3">セッション詳細</h3>
                {sortedSessions.map(session => (
                  <div
                    key={session.id}
                    className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 mb-1">{session.topic}</h4>
                        <p className="text-sm text-gray-500">
                          {new Date(session.date).toLocaleString('ja-JP', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-blue-600">
                          {formatTokenCount(session.usage.totalTokens)}
                        </div>
                        <div className="text-sm text-gray-600">
                          {formatCost(session.costUSD, 'usd')} / {formatCost(session.costJPY, 'jpy')}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-4 text-sm text-gray-600">
                      <span>Input: {formatTokenCount(session.usage.inputTokens)}</span>
                      <span>Output: {formatTokenCount(session.usage.outputTokens)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 border-t border-gray-200 p-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};
