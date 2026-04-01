import { IconBase } from '../IconBase';
import type { IconProps } from '../types';

const VIEW_BOX = '0 0 108 101';
const ICON_URL = new URL('./achievement-tracking.svg', import.meta.url).toString();

export function AchievementTrackingIcon(props: IconProps) {
  return (
    <IconBase viewBox={VIEW_BOX} {...props}>
      <image href={ICON_URL} width='108' height='101' preserveAspectRatio='xMidYMid meet' />
    </IconBase>
  );
}
