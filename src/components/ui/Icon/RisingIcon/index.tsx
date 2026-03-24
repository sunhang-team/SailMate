import { IconBase } from '../IconBase';
import type { IconProps } from '../types';

const VIEW_BOX = '0 0 32 32';

export function RisingIcon({ size = 24, className, ...props }: IconProps) {
  return (
    <IconBase size={size} className={className} viewBox={VIEW_BOX} {...props}>
      <rect width='32' height='32' fill='currentColor' />
    </IconBase>
  );
}
