import { IconBase } from '../IconBase';
import type { IconProps } from '../types';

const VIEW_BOX = '0 0 24 24';

export function CalendarIcon({ size = 24, className, ...props }: IconProps) {
  return (
    <IconBase size={size} className={className} viewBox={VIEW_BOX} {...props}>
      <path
        d='M5 21.999C4.45 21.999 3.97917 21.8032 3.5875 21.4115C3.19583 21.0199 3 20.549 3 19.999V5.99902C3 5.44902 3.19583 4.97819 3.5875 4.58652C3.97917 4.19486 4.45 3.99902 5 3.99902H6V1.99902H8V3.99902H16V1.99902H18V3.99902H19C19.55 3.99902 20.0208 4.19486 20.4125 4.58652C20.8042 4.97819 21 5.44902 21 5.99902V19.999C21 20.549 20.8042 21.0199 20.4125 21.4115C20.0208 21.8032 19.55 21.999 19 21.999H5ZM5 19.999H19V9.99902H5V19.999Z'
        fill='currentColor'
      />
    </IconBase>
  );
}
