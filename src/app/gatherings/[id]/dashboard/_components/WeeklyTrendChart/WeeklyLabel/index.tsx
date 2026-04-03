interface WeeklyLabelProps {
  x?: number;
  y?: number;
  payload?: { value: number };
  currentWeek: number;
}

export function WeeklyLabel({ x, y, payload, currentWeek }: WeeklyLabelProps) {
  if (x === undefined || y === undefined || payload === undefined) return null;
  const isCurrentWeek = payload.value === currentWeek;
  return (
    <text
      x={x}
      y={y + 16}
      textAnchor='middle'
      fill={isCurrentWeek ? '#191919' : '#a4a4a4'}
      className={
        isCurrentWeek
          ? 'text-small-02-sb md:text-small-01-sb lg:text-body-02-sb'
          : 'text-small-02-m md:text-small-01-m lg:text-body-02-m'
      }
    >
      {`${payload.value}주차`}
    </text>
  );
}
