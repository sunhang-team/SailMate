import { IconBase } from '../IconBase';
import type { IconProps } from '../types';

const VIEW_BOX = '0 0 24 24';
const CIRCLE = { cx: 10.5, cy: 10.5, r: 5.5 };
const LINE = { x1: 14.5, y1: 14.5, x2: 20, y2: 20 };

// SVG fill은 CSS currentColor로 그라디언트를 적용할 수 없어,
// gradient prop이 true일 때 <defs>에 linearGradient를 정의하고 fill='url(#id)'로 참조한다.
const GRADIENT_ID = 'search-icon-gradient-primary';

interface SearchIconProps extends IconProps {
  gradient?: boolean;
}

export function SearchIcon({ gradient = false, ...props }: SearchIconProps) {
  return (
    <IconBase viewBox={VIEW_BOX} {...props}>
      {gradient && (
        <defs>
          <linearGradient id={GRADIENT_ID} x1='0%' y1='0%' x2='100%' y2='0%'>
            <stop offset='0%' stopColor='#1e58f8' />
            <stop offset='100%' stopColor='#00ccff' />
          </linearGradient>
        </defs>
      )}
      <circle
        cx={CIRCLE.cx}
        cy={CIRCLE.cy}
        r={CIRCLE.r}
        fill='none'
        stroke={gradient ? `url(#${GRADIENT_ID})` : 'currentColor'}
        strokeWidth={1.8}
      />
      <line
        x1={LINE.x1}
        y1={LINE.y1}
        x2={LINE.x2}
        y2={LINE.y2}
        stroke={gradient ? `url(#${GRADIENT_ID})` : 'currentColor'}
        strokeWidth={1.8}
        strokeLinecap='round'
      />
    </IconBase>
  );
}
