import { IconBase } from '../IconBase';
import type { IconProps } from '../types';

const VIEW_BOX = '0 0 116 100';
const ICON_URL = new URL('./team-building.svg', import.meta.url).toString();

export function TeamBuildingIcon(props: IconProps) {
  return (
    <IconBase viewBox={VIEW_BOX} {...props}>
      <image href={ICON_URL} width='116' height='100' preserveAspectRatio='xMidYMid meet' />
    </IconBase>
  );
}
