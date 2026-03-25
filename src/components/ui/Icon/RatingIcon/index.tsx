import { IconBase } from '../IconBase';
import type { IconProps } from '../types';

interface RatingIconProps extends IconProps {
  variant?: 'gold' | 'silver' | 'bronze';
}

const VIEW_BOX_BY_VARIANT = {
  gold: '132 20 30 40',
  silver: '76 20 30 40',
  bronze: '20 20 30 40',
} as const;
const RATING_ICON_URL = new URL('./rating.svg', import.meta.url).toString();

export function RatingIcon({ variant = 'gold', ...props }: RatingIconProps) {
  return (
    <IconBase viewBox={VIEW_BOX_BY_VARIANT[variant]} data-variant={variant} {...props}>
      <image href={RATING_ICON_URL} width='182' height='80' preserveAspectRatio='xMidYMid meet' />
    </IconBase>
  );
}
