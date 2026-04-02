interface SummaryInfoCardProps {
  currentWeek: number;
  remainingDays: number;
  incompleteTodoCount: number;
}

interface SummaryItemProps {
  label: string;
  value: string;
}

function SummaryItem({ label, value }: SummaryItemProps) {
  return (
    <div className='flex flex-col items-center gap-1 py-1'>
      <span className='text-small-02-m md:text-small-01-m lg:text-body-01-m text-gray-600'>{label}</span>
      <span className='text-body-02-b md:text-h5-b lg:text-h3-b text-gray-900'>{value}</span>
    </div>
  );
}

export function SummaryInfoCard({ currentWeek, remainingDays, incompleteTodoCount }: SummaryInfoCardProps) {
  return (
    <div className='rounded-2xl bg-gray-100'>
      <div className='grid grid-cols-3 divide-x divide-gray-200 px-2 py-3'>
        <SummaryItem label='현재 주차' value={`${currentWeek}주차`} />
        <SummaryItem label='목표까지' value={`${remainingDays}일`} />
        <SummaryItem label='남은 Todo' value={`${incompleteTodoCount}개`} />
      </div>
    </div>
  );
}
