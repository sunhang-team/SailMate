import { formatRecruitDeadlineDday } from '@/lib/formatGatheringDate';

interface DeadlineLabelProps {
  recruitDeadline: string;
}

export function DeadlineLabel({ recruitDeadline }: DeadlineLabelProps) {
  const label = formatRecruitDeadlineDday(recruitDeadline);
  return <span className='text-small-01-sb text-red-200'>{label}</span>;
}
