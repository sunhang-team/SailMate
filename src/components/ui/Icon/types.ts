import type { SVGProps } from 'react';

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'width' | 'height' | 'className' | 'color'> {
  size?: number;
  className?: string;
}
