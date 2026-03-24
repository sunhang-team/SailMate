import { IconBase } from '../IconBase';
import type { IconProps } from '../types';

const VIEW_BOX = '0 0 24 24';

export function FlagIcon({ size = 24, className, ...props }: IconProps) {
  return (
    <IconBase size={size} className={className} viewBox={VIEW_BOX} {...props}>
      <path d='M5 21V4H14L14.4 6H20V16H13L12.6 14H7V21H5Z' fill='currentColor' />
    </IconBase>
  );
}
