import { IconBase } from '../IconBase';
import type { IconProps } from '../types';

const VIEW_BOX = '0 0 42 42';

export function ProfilePlaceholderIcon(props: IconProps) {
  return (
    <IconBase viewBox={VIEW_BOX} {...props}>
      <circle cx='21' cy='21' r='20.895' fill='#F9FAFC' stroke='#EDEFF1' strokeWidth='0.21' />
      <path
        d='M20.9996 25.4097C27.9582 25.4097 33.599 31.0507 33.5992 38.0093V46.4097H8.4V38.0093C8.40026 31.0507 14.041 25.4097 20.9996 25.4097ZM20.9996 8.60986C25.1748 8.60986 28.559 11.9943 28.5592 16.1694C28.5592 20.3447 25.1749 23.73 20.9996 23.73C16.8243 23.73 13.44 20.3447 13.44 16.1694C13.4402 11.9943 16.8244 8.60986 20.9996 8.60986Z'
        fill='#EDEFF1'
      />
    </IconBase>
  );
}
