import { IconBase } from '../IconBase';
import type { IconProps } from '../types';

const VIEW_BOX = '0 0 105 100';
const ICON_URL = new URL('./CollaborationManners.svg', import.meta.url).toString();

export function CollaborationMannersIcon(props: IconProps) {
  return (
    <IconBase viewBox={VIEW_BOX} {...props}>
      <image href={ICON_URL} width='105' height='100' preserveAspectRatio='xMidYMid meet' />
    </IconBase>
  );
}
