import { IconBase } from '../IconBase';
import type { IconProps } from '../types';

const VIEW_BOX = '0 0 16 16';

export function ArrowIcon(props: IconProps) {
  return (
    <IconBase viewBox={VIEW_BOX} {...props}>
      <path
        d='M8.63079 7.99964L5.56413 4.93297L6.26662 4.23047L10.0358 7.99964L6.26662 11.7688L5.56413 11.0663L8.63079 7.99964Z'
        fill='currentColor'
      />
    </IconBase>
  );
}
