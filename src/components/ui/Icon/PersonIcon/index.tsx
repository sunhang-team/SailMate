import { IconBase } from '../IconBase';
import type { IconProps } from '../types';

const VIEW_BOX = '0 0 32 32';
const SVG_CONTENT = '<rect width="32" height="32" fill="currentColor"/>';

export function PersonIcon({ size = 24, className, ...props }: IconProps) {
  return (
    <IconBase
      size={size}
      className={className}
      viewBox={VIEW_BOX}
      dangerouslySetInnerHTML={{ __html: SVG_CONTENT }}
      {...props}
    />
  );
}
