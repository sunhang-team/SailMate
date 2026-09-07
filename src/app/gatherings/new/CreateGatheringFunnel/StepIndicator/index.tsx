import { cn } from '@/lib/cn';

interface StepIndicatorProps {
  currentStep: 'BASIC' | 'SCHEDULE' | 'COMPLETE' | 'DETAIL';
}

const STEP_ORDER = ['BASIC', 'SCHEDULE'] as const;

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  const activeIndex = STEP_ORDER.indexOf(currentStep as (typeof STEP_ORDER)[number]);
  if (activeIndex === -1) return null;

  return (
    <div className='mb-8 flex items-center gap-2'>
      {STEP_ORDER.map((step, index) => {
        const isCompleted = index < activeIndex;
        const isActive = index === activeIndex;
        return (
          <div key={step} className='flex items-center gap-2'>
            {index > 0 && (
              <span className='flex gap-1 text-gray-300' aria-hidden='true'>
                ····
              </span>
            )}
            <span
              className={cn(
                'text-small-01-sb flex size-8 items-center justify-center rounded-full',
                isActive && 'bg-blue-300 text-white',
                isCompleted && 'bg-blue-100 text-blue-300',
                !isActive && !isCompleted && 'bg-gray-200 text-gray-400',
              )}
            >
              {index + 1}
            </span>
          </div>
        );
      })}
    </div>
  );
}
