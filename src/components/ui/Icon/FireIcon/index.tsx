import { IconBase } from '../IconBase';
import type { IconProps } from '../types';

const VIEW_BOX = '0 0 25 32';
const FIRE_ICON_URL = new URL('./fire.svg', import.meta.url).toString();

export function FireIcon(props: IconProps) {
  return (
    <IconBase viewBox={VIEW_BOX} {...props}>
      <image href={FIRE_ICON_URL} width='25' height='32' preserveAspectRatio='xMidYMid meet' />
    </IconBase>
  );
}
