import { CloseIcon, IllustrationIcon } from '@/components/ui/Icon';
import type { IllustrationIconVariant } from '@/components/ui/Icon/IllustrationIcon';

interface EnergyItem {
  label: string;
  variant: IllustrationIconVariant;
  count: number;
}

const ENERGY_ITEMS: EnergyItem[] = [
  { label: '연기', variant: 'smoke', count: 0 },
  { label: '불씨', variant: 'firestart', count: 0 },
  { label: '불꽃', variant: 'fire', count: 0 },
  { label: '태양', variant: 'sun', count: 0 },
];

export function ActivityEnergyCard() {
  return (
    <div className='border-gray-150 bg-gray-0 shadow-02 flex flex-col gap-4 rounded-lg border p-6'>
      <span className='text-h5-sb text-gray-900'>활동 에너지 평가</span>
      <div className='flex items-stretch rounded-lg bg-gray-100 px-4 py-3'>
        {ENERGY_ITEMS.map(({ label, variant, count }, index) => (
          <>
            {index > 0 && (
              <span key={`divider-${variant}`} className='bg-gray-150 mx-4 w-px self-stretch' aria-hidden />
            )}
            <div key={variant} className='flex flex-1 items-center justify-center gap-2'>
              <IllustrationIcon variant={variant} className='size-6 shrink-0' aria-hidden />
              <span className='text-body-01-sb text-gray-800'>{label}</span>
              <CloseIcon className='size-4 text-gray-300' aria-hidden />
              <span className='text-body-01-r text-gray-600'>{count}</span>
            </div>
          </>
        ))}
      </div>
    </div>
  );
}
