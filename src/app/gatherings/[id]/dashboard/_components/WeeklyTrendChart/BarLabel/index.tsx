interface BarLabelProps {
  x?: number;
  y?: number;
  width?: number;
  value?: number | null;
  index?: number;
  currentWeek: number;
  chartData: { week: number; rate: number | null }[];
}

export function BarLabel({ x, y, width, value, index, currentWeek, chartData }: BarLabelProps) {
  if (
    value == null ||
    index === undefined ||
    chartData[index]?.week !== currentWeek ||
    x === undefined ||
    y === undefined ||
    width === undefined
  )
    return null;
  const centerX = x + width / 2;
  return (
    <foreignObject x={centerX - 60} y={y - 70} width={120} height={70} className='overflow-visible'>
      <div className='flex h-full w-full flex-col items-center justify-end pb-1'>
        <div className='text-small-02-sb md:text-small-01-sb lg:text-body-01-sb flex h-[28px] w-[44px] items-center justify-center rounded-[4px] bg-blue-500 text-white md:h-[40px] md:w-[62px] lg:h-[52px] lg:w-[92px]'>
          {`${value}%`}
        </div>
        <div className='-mt-px h-0 w-0 border-t-[6px] border-r-[6px] border-l-[6px] border-t-blue-500 border-r-transparent border-l-transparent'></div>
      </div>
    </foreignObject>
  );
}
