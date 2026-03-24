import { forwardRef } from 'react';
import type { Ref } from 'react';
import { cn } from '@/lib/cn';
import type { IconProps } from './types';

export const IconBase = forwardRef(function IconBase(
  { size = 24, className, children, ...props }: IconProps,
  ref: Ref<SVGSVGElement>,
) {
  return (
    <svg
      ref={ref}
      width={size}
      height={size}
      className={cn('inline-block shrink-0', className)}
      xmlns='http://www.w3.org/2000/svg'
      aria-hidden={props['aria-label'] ? undefined : true}
      role={props['aria-label'] ? 'img' : undefined}
      {...props}
    >
      {children}
    </svg>
  );
});
