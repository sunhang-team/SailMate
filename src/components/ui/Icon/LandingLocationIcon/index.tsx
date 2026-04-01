import { IconBase } from '../IconBase';
import type { IconProps } from '../types';

const VIEW_BOX = '0 0 50 46';
const ICON_URL = new URL('./location.svg', import.meta.url).toString();

export function LandingLocationIcon(props: IconProps) {
  return (
    <IconBase viewBox={VIEW_BOX} {...props}>
      <image href={ICON_URL} width='50' height='46' preserveAspectRatio='xMidYMid meet' />
    </IconBase>
  );
}
