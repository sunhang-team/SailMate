'use client';

import { useRouter } from 'next/navigation';
import { Controller, useFormContext } from 'react-hook-form';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Textarea } from '@/components/ui/Textarea';
import { useToastStore } from '@/components/ui/Toast/useToastStore';
import { useUpdateGathering } from '@/api/gatherings/queries';
import { getTotalWeeks } from '@/lib/formatGatheringDate';

import { ImageUpload } from '../../CreateGatheringForm/ImageUpload';
import { WeeklyPlanForm } from '../../CreateGatheringForm/WeeklyPlanForm';
import { DETAIL_STEP_FIELDS } from '../steps';

import type { GatheringForm } from '@/api/gatherings/types';

interface DetailStepProps {
  gatheringId: number;
}

export function DetailStep({ gatheringId }: DetailStepProps) {
  const router = useRouter();
  const showToast = useToastStore((state) => state.showToast);
  const {
    register,
    control,
    watch,
    trigger,
    getValues,
    formState: { errors },
  } = useFormContext<GatheringForm>();

  const typeValue = watch('type');
  const titleValue = watch('title');
  const descValue = watch('description') ?? '';
  const startDateValue = watch('startDate');
  const endDateValue = watch('endDate');
  const totalWeeks = startDateValue && endDateValue ? getTotalWeeks(startDateValue, endDateValue) : 0;

  const { mutate, isPending } = useUpdateGathering(gatheringId);

  const handleComplete = async () => {
    const isValid = await trigger(DETAIL_STEP_FIELDS);
    if (!isValid) return;

    const { description, weeklyGuides, images } = getValues();
    mutate(
      { description: description?.trim() || undefined, weeklyGuides, images },
      {
        onSuccess: () => {
          showToast({ variant: 'success', title: '모임 소개가 추가되었습니다.' });
          router.push(`/gatherings/${gatheringId}`);
        },
        onError: () => showToast({ variant: 'error', title: '모임 소개 추가에 실패했습니다.' }),
      },
    );
  };

  return (
    <div className='flex flex-col gap-10 md:gap-14 lg:gap-10'>
      <div className='flex flex-col gap-1'>
        <p className='text-small-02-r md:text-body-02-r text-gray-500'>
          {typeValue} / {titleValue}
        </p>
        <h1 className='text-body-01-b md:text-h4-b lg:text-h3-b text-gray-900'>모임을 더 자세히 소개해보세요.</h1>
      </div>

      <Card className='hover:shadow-02 shadow-02 flex flex-col gap-6 border-none p-6 py-10 md:gap-8 md:p-10 md:py-14 lg:mb-20 lg:p-14 lg:py-18'>
        <section className='flex flex-col gap-6 md:gap-8'>
          <p className='text-small-01-sb md:text-body-01-sb lg:text-h5-b text-gray-800'>모임 세부 정보</p>

          {/* 주차별 계획 */}
          <WeeklyPlanForm control={control} register={register} errors={errors} totalWeeks={totalWeeks} />

          {/* 상세 설명 */}
          <div className='flex flex-col gap-1'>
            <p className='text-small-02-m md:text-body-02-m lg:text-body-01-m text-gray-800'>상세 설명</p>
            <div className='relative'>
              <Textarea
                maxLength={1000}
                rows={8}
                placeholder='모임을 설명을 상세히 적어주세요'
                error={errors.description?.message}
                hideErrorMessage
                {...register('description')}
                className='text-small-02-r md:text-body-02-r lg:text-body-01-r bg-gray-0 px-4 py-3 pb-7 lg:px-7 lg:py-5 lg:pb-8'
              />
              <span className='md:text-small-02-r pointer-events-none absolute right-3 bottom-3 text-[8px] text-gray-400 lg:right-5 lg:bottom-4'>
                {descValue.length}/1000
              </span>
            </div>
            {errors.description?.message && (
              <p className='text-xs text-red-200' role='alert'>
                {errors.description.message}
              </p>
            )}
          </div>

          {/* 이미지 */}
          <div className='flex flex-col gap-1'>
            <p className='text-small-02-m md:text-body-02-m lg:text-body-01-m flex items-center gap-1 text-gray-800'>
              이미지
            </p>
            <Controller
              name='images'
              control={control}
              render={({ field }) => (
                <ImageUpload value={field.value ?? []} onChange={field.onChange} error={errors.images?.message} />
              )}
            />
          </div>
        </section>
      </Card>

      <div className='flex justify-between gap-3'>
        <Button
          type='button'
          variant='social'
          size={undefined}
          className='bg-gray-0 text-small-01-sb md:text-body-01-sb lg:text-h5-sb h-12 w-41 text-gray-800 md:h-18 md:w-75 lg:h-20'
        >
          임시 저장
        </Button>
        <Button
          type='button'
          variant='action'
          size='action-sm'
          disabled={isPending}
          onClick={handleComplete}
          className='text-small-01-sb md:text-body-01-sb lg:text-h5-sb h-12 w-41 md:h-18 md:w-75 lg:h-20'
        >
          완료
        </Button>
      </div>
    </div>
  );
}
