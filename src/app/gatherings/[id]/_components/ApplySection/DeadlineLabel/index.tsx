import { formatDate, MILLISECONDS_IN_A_DAY } from '../utils/dateUtils';

interface DeadlineLabelProps {
  recruitDeadline: string;
}

export function DeadlineLabel({ recruitDeadline }: DeadlineLabelProps) {
  const today = new Date();
  const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const deadline = new Date(recruitDeadline);
  if (Number.isNaN(deadline.getTime())) {
    return <span>{formatDate(recruitDeadline)}</span>;
  }
  const deadlineMidnight = new Date(deadline.getFullYear(), deadline.getMonth(), deadline.getDate());
  const diffDays = Math.ceil((deadlineMidnight.getTime() - todayMidnight.getTime()) / MILLISECONDS_IN_A_DAY);
  const label = diffDays > 0 ? `D-${diffDays}` : diffDays === 0 ? 'D-day' : '마감';
  return <span className='text-small-01-sb text-red-200'>{label}</span>;
}
