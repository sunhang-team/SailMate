import { IconBase } from '../IconBase';
import type { IconProps } from '../types';

const VIEW_BOX = '0 0 45 45';
const ICON_URL = new URL('./check.svg', import.meta.url).toString();

export function LandingCheckIcon(props: IconProps) {
  return (
    <IconBase viewBox={VIEW_BOX} {...props}>
      <image href={ICON_URL} width='45' height='45' preserveAspectRatio='xMidYMid meet' />
    </IconBase>
  );
}
