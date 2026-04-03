import { IconBase } from '../IconBase';
import type { IconProps } from '../types';

const VIEW_BOX = '0 0 45 47';
const ICON_URL = new URL('./paper.svg', import.meta.url).toString();

export function LandingPaperIcon(props: IconProps) {
  return (
    <IconBase viewBox={VIEW_BOX} {...props}>
      <image href={ICON_URL} width='45' height='47' preserveAspectRatio='xMidYMid meet' />
    </IconBase>
  );
}
