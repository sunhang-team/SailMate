interface AchievementGaugeProps {
  label: string;
  rate: number;
  arcColor: string;
}

const CX = 250;
const CY = 180;
const RADIUS = 120;
const STROKE_WIDTH = 15;

export function AchievementGauge({ label, rate, arcColor }: AchievementGaugeProps) {
  // 0~99.99 클램프 (rate=100일 때 start/end 동일점 문제 방지)
  const clampedRate = Math.min(Math.max(rate, 0), 99.99);
  const endAngleRad = Math.PI - (clampedRate / 100) * Math.PI;
  const endX = CX + RADIUS * Math.cos(endAngleRad);
  const endY = CY - RADIUS * Math.sin(endAngleRad);

  const startX = CX - RADIUS;
  const startY = CY;
  const endTrackX = CX + RADIUS;

  const bgGradientId = `gauge-bg-${label.replace(/\s/g, '-')}`;
  const markerGradientId = `marker-gradient-${label.replace(/\s/g, '-')}`;

  return (
    <div className='flex flex-1 flex-col rounded-2xl bg-gray-100 p-4 md:p-6'>
      <p className='text-small-02-sb md:text-h5-sb mb-1 text-gray-400'>{label}</p>
      <svg viewBox='0 0 400 220' className='max-h-80 w-full' aria-label={`${label} ${rate}%`}>
        <defs>
          {/* 반원 안쪽 배경 그라데이션 (위→아래) */}
          <linearGradient id={bgGradientId} x1='0%' y1='0%' x2='0%' y2='100%'>
            <stop offset='0%' stopColor='#e8f4ff' />
            <stop offset='100%' stopColor='#e8f4ff' stopOpacity='0' />
          </linearGradient>
          {/* 끝점 마커 그라데이션 */}
          <linearGradient id={markerGradientId} x1='0%' y1='0%' x2='100%' y2='0%'>
            <stop offset='0%' stopColor='#1e58f8' />
            <stop offset='100%' stopColor='#00ccff' />
          </linearGradient>
        </defs>

        {/* 반원 안쪽 배경 채우기 */}
        <path
          d={`M ${startX} ${startY} A ${RADIUS} ${RADIUS} 0 0 1 ${endTrackX} ${startY} Z`}
          fill={`url(#${bgGradientId})`}
        />

        {/* 배경 arc */}
        <path
          d={`M ${startX} ${startY} A ${RADIUS} ${RADIUS} 0 0 1 ${endTrackX} ${startY}`}
          fill='none'
          stroke='#dbf0ff'
          strokeWidth={STROKE_WIDTH}
          strokeLinecap='round'
        />

        {/* 진행 arc */}
        <path
          d={`M ${startX} ${startY} A ${RADIUS} ${RADIUS} 0 0 1 ${endX} ${endY}`}
          fill='none'
          stroke={arcColor}
          strokeWidth={STROKE_WIDTH}
          strokeLinecap='round'
        />

        {/* 끝점 마커 원 (테두리만, 가운데 비어있음) */}
        <circle cx={endX} cy={endY} r={10} fill='white' stroke={`url(#${markerGradientId})`} strokeWidth={3} />

        {/* 라벨 텍스트 (반원 내부 중앙) */}
        <text x={CX} y={115} textAnchor='middle' fill='#a4a4a4' className='text-small-02-sb md:text-small-01-sb'>
          {label}
        </text>

        {/* 달성률 숫자 (반원 중앙) */}
        <text x={CX} y={CY - 10} textAnchor='middle' fontSize={48} fontWeight={700} fill='#010937'>
          {rate}%
        </text>

        {/* 0 / 100 라벨 */}
        <text x={startX} y={CY + 28} textAnchor='middle' fontSize={12} fill='#bbbbbb'>
          0
        </text>
        <text x={endTrackX} y={CY + 28} textAnchor='middle' fontSize={12} fill='#bbbbbb'>
          100
        </text>
      </svg>
    </div>
  );
}
