import { IllustrationIcon } from '@/components/ui/Icon';
import { ENERGY_GRADE_LEVELS } from '@/lib/energyGrade';

const DESCRIPTION =
  '모임 달성률과 받은 리뷰를 바탕으로 계산되는 활동 점수예요.\n꾸준히 참여하고 좋은 리뷰를 받으면 올라가며,\n참여율이 낮으면 내려갈 수 있어요.';

export function ActivityEnergyInfoTooltip() {
  return (
    <div className='flex flex-col gap-6'>
      <div className='flex flex-col gap-4'>
        <p className='text-body-01-sb text-gray-0'>활동 에너지란?</p>
        <p className='text-body-02-r whitespace-pre-line text-gray-100'>{DESCRIPTION}</p>
      </div>
      <div className='bg-gray-0 overflow-hidden rounded-xl'>
        <div className='text-body-02-m border-gray-150 bg-gray-0 flex items-center gap-54.5 border-b px-5 py-3 text-gray-900 min-[475px]:justify-normal min-[475px]:gap-35'>
          <span className='min-[475px]:w-26.5 min-[475px]:shrink-0'>등급</span>
          <span>기준</span>
        </div>
        <div className='flex flex-col gap-6 px-5 py-4'>
          {ENERGY_GRADE_LEVELS.map((grade) => (
            <div key={grade.variant} className='flex items-center gap-35 min-[475px]:justify-normal min-[475px]:gap-35'>
              <div className='flex min-w-0 items-center gap-2 min-[475px]:w-26.5 min-[475px]:shrink-0'>
                <IllustrationIcon variant={grade.variant} className='size-6 shrink-0' aria-hidden />
                <span className='text-body-02-r text-gray-800'>{grade.label}</span>
              </div>
              <span className='text-body-02-r text-gray-800'>{grade.rangeText}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
