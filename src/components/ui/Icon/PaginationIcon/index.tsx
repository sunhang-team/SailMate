import { IconBase } from '../IconBase';
import type { IconProps } from '../types';

interface PaginationIconProps extends IconProps {
  variant?: 'prev' | 'next';
}

const VIEW_BOX = '0 0 48 48';
const PREV_ARROW =
  'M26.3333 30.5954L19.7373 23.9994L26.3333 17.4033L27.5627 18.6327L22.1961 23.9994L27.5627 29.366L26.3333 30.5954Z';
const NEXT_ARROW =
  'M25.104 23.9994L19.7373 18.6327L20.9667 17.4033L27.5627 23.9994L20.9667 30.5954L19.7373 29.366L25.104 23.9994Z';

export function PaginationIcon({ variant = 'next', ...props }: PaginationIconProps) {
  return (
    <IconBase viewBox={VIEW_BOX} data-variant={variant} {...props}>
      <circle cx='24' cy='24' r='23.5' stroke='currentColor' fill='none' />
      <path d={variant === 'prev' ? PREV_ARROW : NEXT_ARROW} fill='currentColor' />
    </IconBase>
  );
}
