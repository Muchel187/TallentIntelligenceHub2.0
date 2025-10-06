/**
 * BigFiveChart Component
 * Displays Big Five scores as a radar/spider chart
 */

'use client';

interface BigFiveChartProps {
  scores: {
    O: number;
    C: number;
    E: number;
    A: number;
    N: number;
  };
}

const DIMENSIONS = [
  { key: 'O', label: 'Openness', color: '#3B82F6' },
  { key: 'C', label: 'Conscientiousness', color: '#10B981' },
  { key: 'E', label: 'Extraversion', color: '#F59E0B' },
  { key: 'A', label: 'Agreeableness', color: '#EF4444' },
  { key: 'N', label: 'Neuroticism', color: '#8B5CF6' },
];

/**
 * Generate SVG radar chart path
 */
function generateRadarPath(scores: Record<string, number>, maxScore: number = 120): string {
  const points: string[] = [];
  const centerX = 200;
  const centerY = 200;
  const maxRadius = 150;

  DIMENSIONS.forEach((dim, index) => {
    const angle = (index * 2 * Math.PI) / DIMENSIONS.length - Math.PI / 2;
    const score = scores[dim.key] || 0;
    const radius = (score / maxScore) * maxRadius;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    points.push(`${x},${y}`);
  });

  return `M ${points.join(' L ')} Z`;
}

export function BigFiveChart({ scores }: BigFiveChartProps) {
  const maxScore = 120;
  const centerX = 200;
  const centerY = 200;
  const maxRadius = 150;

  // Generate concentric circles for background
  const levels = [24, 48, 72, 96, 120];

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* SVG Radar Chart */}
      <svg
        viewBox="0 0 400 400"
        className="w-full h-auto"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background circles */}
        {levels.map((level) => (
          <circle
            key={level}
            cx={centerX}
            cy={centerY}
            r={(level / maxScore) * maxRadius}
            fill="none"
            stroke="#E5E7EB"
            strokeWidth="1"
          />
        ))}

        {/* Axis lines */}
        {DIMENSIONS.map((dim, index) => {
          const angle = (index * 2 * Math.PI) / DIMENSIONS.length - Math.PI / 2;
          const x = centerX + maxRadius * Math.cos(angle);
          const y = centerY + maxRadius * Math.sin(angle);

          return (
            <line
              key={dim.key}
              x1={centerX}
              y1={centerY}
              x2={x}
              y2={y}
              stroke="#D1D5DB"
              strokeWidth="1"
            />
          );
        })}

        {/* Score polygon */}
        <path
          d={generateRadarPath(scores, maxScore)}
          fill="rgba(59, 130, 246, 0.2)"
          stroke="#3B82F6"
          strokeWidth="2"
        />

        {/* Score points */}
        {DIMENSIONS.map((dim, index) => {
          const angle = (index * 2 * Math.PI) / DIMENSIONS.length - Math.PI / 2;
          const score = scores[dim.key as keyof typeof scores] || 0;
          const radius = (score / maxScore) * maxRadius;
          const x = centerX + radius * Math.cos(angle);
          const y = centerY + radius * Math.sin(angle);

          return (
            <circle
              key={dim.key}
              cx={x}
              cy={y}
              r="5"
              fill={dim.color}
              stroke="white"
              strokeWidth="2"
            />
          );
        })}

        {/* Labels */}
        {DIMENSIONS.map((dim, index) => {
          const angle = (index * 2 * Math.PI) / DIMENSIONS.length - Math.PI / 2;
          const labelRadius = maxRadius + 30;
          const x = centerX + labelRadius * Math.cos(angle);
          const y = centerY + labelRadius * Math.sin(angle);

          return (
            <text
              key={`label-${dim.key}`}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-sm font-medium fill-gray-700"
            >
              {dim.label}
            </text>
          );
        })}
      </svg>

      {/* Score Legend */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        {DIMENSIONS.map((dim) => {
          const score = scores[dim.key as keyof typeof scores];
          const interpretation = interpretScore(score);

          return (
            <div
              key={dim.key}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: dim.color }}
                />
                <span className="font-medium text-gray-900">{dim.label}</span>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-gray-900">{score}</div>
                <div className={`text-xs font-medium ${getInterpretationColor(interpretation)}`}>
                  {interpretation.toUpperCase()}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function interpretScore(score: number): 'low' | 'average' | 'high' {
  if (score < 60) return 'low';
  if (score > 90) return 'high';
  return 'average';
}

function getInterpretationColor(interpretation: string): string {
  switch (interpretation) {
    case 'low':
      return 'text-blue-600';
    case 'high':
      return 'text-green-600';
    default:
      return 'text-gray-600';
  }
}
