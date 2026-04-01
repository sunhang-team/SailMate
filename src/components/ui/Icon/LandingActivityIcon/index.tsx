import { IconBase } from '../IconBase';
import type { IconProps } from '../types';

const VIEW_BOX = '0 0 48 45';
const ICON_URL = new URL('./activity.svg', import.meta.url).toString();

export function LandingActivityIcon(props: IconProps) {
  return (
    <IconBase viewBox={VIEW_BOX} {...props}>
      <image href={ICON_URL} width='48' height='45' preserveAspectRatio='xMidYMid meet' />
    </IconBase>
  );
}
