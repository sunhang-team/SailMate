import { IconBase } from '../IconBase';
import type { IconProps } from '../types';

const VIEW_BOX = '0 0 32 32';
const RISING_ICON_URL = new URL('./Rising.svg', import.meta.url).toString();

export function RisingIcon(props: IconProps) {
  return (
    <IconBase viewBox={VIEW_BOX} {...props}>
      <image href={RISING_ICON_URL} width='32' height='32' preserveAspectRatio='none' />
    </IconBase>
  );
}
