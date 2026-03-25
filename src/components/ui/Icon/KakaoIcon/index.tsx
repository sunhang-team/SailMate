import { IconBase } from '../IconBase';
import type { IconProps } from '../types';

const VIEW_BOX = '0 0 24 24';
const KAKAO_ICON_URL = new URL('./kakao.svg', import.meta.url).toString();

export function KakaoIcon(props: IconProps) {
  return (
    <IconBase viewBox={VIEW_BOX} {...props}>
      <image href={KAKAO_ICON_URL} width='24' height='24' preserveAspectRatio='xMidYMid meet' />
    </IconBase>
  );
}
