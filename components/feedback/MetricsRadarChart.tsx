import React from 'react';
import { EvaluationMetrics } from '../../core/types';
import { BarChart3 } from 'lucide-react';

interface MetricsRadarChartProps {
  metrics: EvaluationMetrics;
  overallScore?: number;
}

export const MetricsRadarChart: React.FC<MetricsRadarChartProps> = ({
  metrics,
  overallScore = 0,
}) => {
  const size = 320;
  const center = size / 2;
  const radius = 90; // Chart radius
  const keys: { key: keyof EvaluationMetrics; label: string }[] = [
    { key: 'logic', label: '論理性' },
    { key: 'evidence', label: '根拠' },
    { key: 'rebuttal', label: '反論力' },
    { key: 'persuasion', label: '説得力' },
    { key: 'consistency', label: '一貫性' },
    { key: 'constructiveness', label: '建設性' },
    { key: 'objectivity', label: '客観性' },
    { key: 'clarity', label: '明瞭性' },
  ];

  // Helper to get coordinates
  const getCoords = (value: number, index: number, maxVal: number = 10) => {
    // Start from -90deg (Top)
    const angle = (Math.PI * 2 * index) / keys.length - Math.PI / 2;
    const r = (value / maxVal) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  // Helper for item point colors (keep individual item logic)
  const getItemColor = (val: number) => {
    if (val >= 8) return '#2563eb'; // blue-600
    if (val >= 5) return '#059669'; // emerald-600
    return '#dc2626'; // red-600
  };

  // Determine Main Theme Color based on OVERALL Score (Matching Summary Section Logic)
  // SummarySection logic: >= 80 Emerald, >= 60 Blue, else Amber
  const getMainTheme = (score: number) => {
    if (score >= 80) return { stroke: '#059669', fill: 'rgba(5, 150, 105, 0.2)' }; // Emerald
    if (score >= 60) return { stroke: '#2563eb', fill: 'rgba(37, 99, 235, 0.2)' }; // Blue
    return { stroke: '#d97706', fill: 'rgba(217, 119, 6, 0.2)' }; // Amber
  };

  const { stroke: polygonStroke, fill: polygonFill } = getMainTheme(overallScore);

  // Generate path for the data
  const dataPoints = keys.map((k, i) => {
    const val = metrics[k.key] || 0;
    return getCoords(val, i);
  });
  const pathData =
    dataPoints.map((p, i) => (i === 0 ? `M ${p.x},${p.y}` : `L ${p.x},${p.y}`)).join(' ') + ' Z';

  // Generate grid levels
  const levels = [2, 4, 6, 8, 10];

  const getLabelAnchor = (index: number) => {
    if (index === 0 || index === 4) return 'middle';
    if (index > 0 && index < 4) return 'start';
    return 'end';
  };

  const getLabelBaseline = (index: number) => {
    if (index === 2 || index === 6) return 'middle';
    if (index > 2 && index < 6) return 'hanging'; // Bottom half
    return 'auto'; // Top half
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col items-center animate-fade-in">
      <div className="flex items-center gap-3 mb-2 text-slate-800 self-start">
        <BarChart3 size={24} className="text-blue-600" />
        <h3 className="text-lg font-bold">詳細評価スコア</h3>
      </div>
      <div className="relative w-full flex justify-center overflow-hidden">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="max-w-full h-auto"
        >
          {/* Background Grid */}
          {levels.map((level, lvlIdx) => {
            const points = keys
              .map((_, i) => {
                const { x, y } = getCoords(level, i);
                return `${x},${y}`;
              })
              .join(' ');
            return (
              <polygon
                key={level}
                points={points}
                fill={lvlIdx % 2 === 0 ? '#f8fafc' : '#ffffff'}
                stroke="#e2e8f0"
                strokeWidth="1"
              />
            );
          })}

          {/* Axes */}
          {keys.map((_, i) => {
            const start = getCoords(0, i);
            const end = getCoords(10, i);
            return (
              <line
                key={i}
                x1={start.x}
                y1={start.y}
                x2={end.x}
                y2={end.y}
                stroke="#e2e8f0"
                strokeDasharray="4 4"
              />
            );
          })}

          {/* Data Path */}
          <path
            d={pathData}
            fill={polygonFill}
            stroke={polygonStroke}
            strokeWidth="2.5"
            className="drop-shadow-sm transition-all duration-500"
          />

          {/* Data Points */}
          {dataPoints.map((p, i) => {
            const val = metrics[keys[i].key] || 0;
            return (
              <circle
                key={i}
                cx={p.x}
                cy={p.y}
                r="4"
                fill={getItemColor(val)}
                stroke="#ffffff"
                strokeWidth="2"
                className="transition-all duration-500"
              />
            );
          })}

          {/* Labels */}
          {keys.map((k, i) => {
            const val = metrics[k.key] || 0;
            const { x, y } = getCoords(12.5, i); // Place labels slightly outside
            return (
              <g key={i}>
                <text
                  x={x}
                  y={y}
                  textAnchor={getLabelAnchor(i)}
                  dominantBaseline={getLabelBaseline(i)}
                  className="font-bold fill-slate-700 text-[11px] sm:text-[12px]"
                >
                  {k.label}
                </text>
                <text
                  x={x}
                  y={y + 14}
                  textAnchor={getLabelAnchor(i)}
                  dominantBaseline={getLabelBaseline(i)}
                  className="font-bold text-[10px]"
                  fill={getItemColor(val)}
                >
                  {val}/10
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex gap-4 mt-2 text-[10px] font-medium text-slate-500">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-blue-600"></div>8-10: 優秀
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-emerald-600"></div>5-7: 標準
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-red-600"></div>0-4: 改善
        </div>
      </div>
    </div>
  );
};
