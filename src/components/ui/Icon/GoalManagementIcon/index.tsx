import { IconBase } from '../IconBase';
import type { IconProps } from '../types';

const VIEW_BOX = '0 0 106 101';
const ICON_URL = new URL('./goal-management.svg', import.meta.url).toString();

export function GoalManagementIcon(props: IconProps) {
  return (
    <IconBase viewBox={VIEW_BOX} {...props}>
      <image href={ICON_URL} width='106' height='101' preserveAspectRatio='xMidYMid meet' />
    </IconBase>
  );
}
