import { IconBase } from '../IconBase';
import type { IconProps } from '../types';

interface FireButtonIconProps extends IconProps {
  variant?: 'active' | 'disabled';
}

const VIEW_BOX_BY_VARIANT = {
  active: '20 20 48 48',
  disabled: '20 88 48 48',
} as const;
const FIRE_BUTTON_ICON_URL = new URL('./fire-button.svg', import.meta.url).toString();

export function FireButtonIcon({ variant = 'active', ...props }: FireButtonIconProps) {
  return (
    <IconBase viewBox={VIEW_BOX_BY_VARIANT[variant]} data-variant={variant} {...props}>
      <image href={FIRE_BUTTON_ICON_URL} width='88' height='156' preserveAspectRatio='xMidYMid meet' />
    </IconBase>
  );
}
