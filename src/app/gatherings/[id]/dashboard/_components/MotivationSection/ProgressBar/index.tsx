interface ProgressBarProps {
  value: number;
  trackClassName: string;
  fillClassName: string;
  thumbClassName: string;
}

const THUMB_OFFSET_LARGE = 12;
const THUMB_OFFSET_SMALL = 8;
const MIDPOINT = 50;

export function ProgressBar({ value, trackClassName, fillClassName, thumbClassName }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));
  const thumbOffset = clamped > MIDPOINT ? THUMB_OFFSET_LARGE : THUMB_OFFSET_SMALL;

  return (
    <div className='relative'>
      <div className={`h-3 w-full rounded-full lg:h-4 ${trackClassName}`}>
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${fillClassName}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
      <div
        className={`absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full shadow-[0_0_4px_rgba(0,0,0,0.12)] lg:h-6 lg:w-6 ${thumbClassName}`}
        style={{ left: `calc(${clamped}% - ${thumbOffset}px)` }}
      >
        <div className='absolute inset-[3px] rounded-full bg-white lg:inset-[4px]' />
      </div>
    </div>
  );
}
