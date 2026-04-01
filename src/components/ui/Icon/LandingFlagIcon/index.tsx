import { IconBase } from '../IconBase';
import type { IconProps } from '../types';

const VIEW_BOX = '0 0 44 44';
const ICON_URL = new URL('./flag.svg', import.meta.url).toString();

export function LandingFlagIcon(props: IconProps) {
  return (
    <IconBase viewBox={VIEW_BOX} {...props}>
      <image href={ICON_URL} width='44' height='44' preserveAspectRatio='xMidYMid meet' />
    </IconBase>
  );
}
