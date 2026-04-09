import { IconBase } from '../IconBase';
import type { IconProps } from '../types';

const VIEW_BOX = '0 0 3 23';

export function ExclamationIcon(props: IconProps) {
  return (
    <IconBase viewBox={VIEW_BOX} {...props}>
      <path d='M0 14.5067V0H2.56V14.5067H0ZM0 22.0553V19.4953H2.56V22.0553H0Z' fill='currentColor' />
    </IconBase>
  );
}
