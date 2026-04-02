import { cn } from '@/lib/cn';
import { useDropdown } from '@/components/ui/Dropdown/context';
import { ArrowIcon } from '@/components/ui/Icon';

interface FilterTriggerProps {
  filterType: 'me' | 'team';
}

export function FilterTrigger({ filterType }: FilterTriggerProps) {
  const { isOpen } = useDropdown();
  return (
    <div className='text-small-01-m flex h-7 w-[89px] cursor-pointer items-center justify-between gap-1 rounded-lg bg-blue-50 px-3 py-1 text-blue-300 transition-colors hover:bg-blue-100 md:h-9 md:w-[112px] lg:w-[131px]'>
      <div className='text-small-02-m md:text-body-02-m lg:text-body-01-m flex items-center gap-1'>
        {filterType === 'me' ? '내 달성률' : '팀 달성률'}
      </div>
      <ArrowIcon
        className={cn(
          'h-4 w-4 text-blue-300 transition-transform duration-200 md:h-5 md:w-5 lg:h-6 lg:w-6',
          isOpen ? '-rotate-90' : 'rotate-90',
        )}
      />
    </div>
  );
}
