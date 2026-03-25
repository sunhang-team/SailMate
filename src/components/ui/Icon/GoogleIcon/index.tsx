import { IconBase } from '../IconBase';
import type { IconProps } from '../types';

const VIEW_BOX = '0 0 24 24';
const GOOGLE_ICON_URL = new URL('./google.svg', import.meta.url).toString();

export function GoogleIcon(props: IconProps) {
  return (
    <IconBase viewBox={VIEW_BOX} {...props}>
      <image href={GOOGLE_ICON_URL} width='24' height='24' preserveAspectRatio='xMidYMid meet' />
    </IconBase>
  );
}
