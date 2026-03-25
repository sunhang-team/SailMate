import { IconBase } from '../IconBase';
import type { IconProps } from '../types';

const VIEW_BOX = '0 0 16 16';

export function CloseIcon(props: IconProps) {
  return (
    <IconBase viewBox={VIEW_BOX} {...props}>
      <path
        d='M5.4847 11.225L4.7757 10.516L7.29103 8.00064L4.7757 5.50197L5.4847 4.79297L8.00003 7.3083L10.4987 4.79297L11.2077 5.50197L8.69236 8.00064L11.2077 10.516L10.4987 11.225L8.00003 8.70964L5.4847 11.225Z'
        fill='currentColor'
      />
    </IconBase>
  );
}
