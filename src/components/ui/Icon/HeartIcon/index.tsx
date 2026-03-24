import { IconBase } from '../IconBase';
import type { IconProps } from '../types';

interface HeartIconProps extends IconProps {
  variant?: 'outline' | 'filled';
}

const VIEW_BOX = '0 0 24 24';

export function HeartIcon({ size = 24, className, variant = 'outline', ...props }: HeartIconProps) {
  return (
    <IconBase size={size} className={className} viewBox={VIEW_BOX} data-variant={variant} {...props}>
      {variant === 'filled' ? (
        <path
          d='M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.03L12 21.35Z'
          fill='currentColor'
        />
      ) : (
        <path
          d='M16.5 4.5C18.75 4.5 20.5 6.26 20.5 8.5C20.5 9.54 20.17 10.62 19.28 11.8C18.36 13.03 16.96 14.4 15.2 15.97C14.32 16.76 13.36 17.58 12.31 18.52L12 18.8L11.69 18.52C10.64 17.58 9.68 16.76 8.8 15.97C7.04 14.4 5.64 13.03 4.72 11.8C3.83 10.62 3.5 9.54 3.5 8.5C3.5 6.26 5.25 4.5 7.5 4.5C8.79 4.5 10.07 5.08 10.98 6.13L12 7.32L13.02 6.13C13.93 5.08 15.21 4.5 16.5 4.5ZM16.5 3C14.76 3 13.09 3.81 12 5.08C10.91 3.81 9.24 3 7.5 3C4.42 3 2 5.42 2 8.5C2 12.28 5.4 15.36 10.55 20.03L12 21.35L13.45 20.03C18.6 15.36 22 12.28 22 8.5C22 5.42 19.58 3 16.5 3Z'
          fill='currentColor'
        />
      )}
    </IconBase>
  );
}
