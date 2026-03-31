import { IconBase } from '../IconBase';
import type { IconProps } from '../types';

const VIEW_BOX = '0 0 54 45';
const ICON_URL = new URL('./heart.svg', import.meta.url).toString();

export function LandingHeartIcon(props: IconProps) {
  return (
    <IconBase viewBox={VIEW_BOX} {...props}>
      <image href={ICON_URL} width='54' height='45' preserveAspectRatio='xMidYMid meet' />
    </IconBase>
  );
}
