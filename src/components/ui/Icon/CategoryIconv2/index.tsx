import { IconBase } from '../IconBase';
import type { IconProps } from '../types';

const VIEW_BOX = '0 0 24 24';

const PATH =
  'M4 3H10Q11 3 11 4V10Q11 11 10 11H4Q3 11 3 10V4Q3 3 4 3Z' +
  'M14 3H20Q21 3 21 4V10Q21 11 20 11H14Q13 11 13 10V4Q13 3 14 3Z' +
  'M4 13H10Q11 13 11 14V20Q11 21 10 21H4Q3 21 3 20V14Q3 13 4 13Z' +
  'M14 13H20Q21 13 21 14V20Q21 21 20 21H14Q13 21 13 20V14Q13 13 14 13Z';

export function CategoryIconv2(props: IconProps) {
  return (
    <IconBase viewBox={VIEW_BOX} {...props}>
      <path d={PATH} fill='currentColor' />
    </IconBase>
  );
}
