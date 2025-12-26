import React from 'react';
import { MessageReview, Message } from '../../core/types';
import { TrendingUp, User, Bot } from 'lucide-react';

interface ScoreTrendChartProps {
  reviews: MessageReview[];
  messages: Message[];
  onPointClick: (messageIndex: number) => void;
}

// Type guard for scored reviews
interface ScoredReview extends MessageReview {
  score: number;
}

function hasScoredReview(review: MessageReview): review is ScoredReview {
  return review.score !== undefined;
}

export const ScoreTrendChart: React.FC<ScoreTrendChartProps> = React.memo(({
  reviews,
  messages,
  onPointClick,
}) => {
  // Filter only scored reviews with type guard
  const scoredReviews = reviews
    .filter(hasScoredReview)
    .sort((a, b) => a.messageIndex - b.messageIndex);

  if (scoredReviews.length === 0) return null;

  const width = 600;
  const height = 200;
  const padding = 30;
  const graphWidth = width - padding * 2;
  const graphHeight = height - padding * 2;

  const maxScore = 10;

  // Calculate points
  const points = scoredReviews.map((r, i) => {
    // If only one point, place it in the center horizontally
    const x =
      scoredReviews.length > 1
        ? padding + (i / (scoredReviews.length - 1)) * graphWidth
        : width / 2;

    const y = height - padding - (r.score / maxScore) * graphHeight;
    return { x, y, score: r.score, messageIndex: r.messageIndex };
  });

  // Only draw path if we have more than 1 point
  const pathD = points.length > 1 ? `M ${points.map(p => `${p.x},${p.y}`).join(' L ')}` : '';

  // Color Helper
  const getPointColor = (score: number) => {
    if (score >= 8) return '#2563eb'; // blue-600
    if (score >= 5) return '#10b981'; // emerald-500
    return '#ef4444'; // red-500
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 w-full overflow-hidden animate-fade-in mb-6">
      <div className="flex items-center gap-2 mb-6 text-slate-800">
        <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
          <TrendingUp size={24} />
        </div>
        <div>
          <h3 className="text-lg font-bold">スコア推移 (Score Trend)</h3>
          <p className="text-xs text-slate-500">ユーザーとAIの応酬における論理強度の変化</p>
        </div>
      </div>

      <div className="relative w-full aspect-[3/1] min-h-[150px]">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
          {/* Grid Lines */}
          {[0, 2.5, 5, 7.5, 10].map(val => {
            const y = height - padding - (val / maxScore) * graphHeight;
            return (
              <g key={val}>
                <line
                  x1={padding}
                  y1={y}
                  x2={width - padding}
                  y2={y}
                  stroke="#e2e8f0"
                  strokeDasharray="4 4"
                />
                <text
                  x={padding - 10}
                  y={y + 4}
                  textAnchor="end"
                  className="text-[10px] fill-slate-400 font-mono"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Trend Line (Only if multiple points) */}
          {pathD && (
            <>
              <path
                d={pathD}
                fill="none"
                stroke="#94a3b8"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="drop-shadow-sm opacity-50"
              />
              <path
                d={`${pathD} L ${points[points.length - 1].x},${height - padding} L ${points[0].x},${height - padding} Z`}
                fill="url(#gradient)"
                opacity="0.1"
              />
            </>
          )}

          <defs>
            <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#ffffff" />
            </linearGradient>
          </defs>

          {/* Data Points */}
          {points.map((p, i) => {
            const role = messages[p.messageIndex]?.role || 'model';
            const isUser = role === 'user';

            return (
              <g
                key={i}
                className="group cursor-pointer"
                onClick={() => onPointClick(p.messageIndex)}
              >
                {/* Invisible Hit Target (Larger area for stable hovering) */}
                <circle cx={p.x} cy={p.y} r="15" fill="transparent" />

                {/* Shape: Circle for User, Diamond for AI */}
                {isUser ? (
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r="5"
                    fill={getPointColor(p.score)}
                    stroke="#fff"
                    strokeWidth="2"
                    className="transition-all duration-300 group-hover:scale-150 shadow-sm"
                    style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                  />
                ) : (
                  // Use Path for Diamond instead of rotated Rect to avoid transform conflicts
                  <path
                    d={`M ${p.x},${p.y - 6} L ${p.x + 6},${p.y} L ${p.x},${p.y + 6} L ${p.x - 6},${p.y} Z`}
                    fill={getPointColor(p.score)}
                    stroke="#fff"
                    strokeWidth="2"
                    className="transition-all duration-300 group-hover:scale-150 shadow-sm"
                    style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                  />
                )}

                {/* Tooltip on Hover */}
                <g className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                  <rect x={p.x - 35} y={p.y - 50} width="70" height="35" rx="6" fill="#1e293b" />
                  <path
                    d={`M ${p.x - 5},${p.y - 15} L ${p.x},${p.y - 10} L ${p.x + 5},${p.y - 15} Z`}
                    fill="#1e293b"
                  />

                  <text
                    x={p.x}
                    y={p.y - 32}
                    textAnchor="middle"
                    fill="white"
                    className="text-[10px] font-bold"
                  >
                    {isUser ? 'USER' : 'AI'}: {p.score} pts
                  </text>
                  <text
                    x={p.x}
                    y={p.y - 20}
                    textAnchor="middle"
                    fill="#94a3b8"
                    className="text-[9px] font-mono"
                  >
                    Turn #{p.messageIndex + 1}
                  </text>
                </g>

                {/* X Axis Label */}
                <text
                  x={p.x}
                  y={height - 10}
                  textAnchor="middle"
                  className="text-[10px] fill-slate-400 font-bold group-hover:fill-blue-600 transition-colors"
                >
                  {p.messageIndex + 1}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <div className="flex justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-[10px] text-slate-600 font-bold">
            <span className="w-2 h-2 rounded-full bg-slate-400"></span> User
          </div>
          <div className="flex items-center gap-1 text-[10px] text-slate-600 font-bold">
            <span className="w-2 h-2 rotate-45 bg-slate-400"></span> AI
          </div>
        </div>
        <div className="w-px h-4 bg-slate-200"></div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium">
            <span className="w-2 h-2 rounded-full bg-[#2563eb]"></span> High (8-10)
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium">
            <span className="w-2 h-2 rounded-full bg-[#10b981]"></span> Mid (5-7)
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium">
            <span className="w-2 h-2 rounded-full bg-[#ef4444]"></span> Low (0-4)
          </div>
        </div>
      </div>
    </div>
  );
});
