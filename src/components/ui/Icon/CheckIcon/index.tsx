import { IconBase } from '../IconBase';
import type { IconProps } from '../types';

const VIEW_BOX = '0 0 20 20';
const SVG_CONTENT =
  '<path d="M8.33314 13.3703L5.29626 10.3334L6.16647 9.46322L8.33314 11.6299L13.8331 6.12988L14.7033 7.00009L8.33314 13.3703Z" fill="currentColor"/>';

export function CheckIcon({ size = 24, className, ...props }: IconProps) {
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
