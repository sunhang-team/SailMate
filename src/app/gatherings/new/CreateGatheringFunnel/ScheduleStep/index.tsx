'use client';

import { Controller, useFormContext } from 'react-hook-form';

import { Button } from '@/components/ui/Button';
import { DatePicker } from '@/components/ui/DatePicker';
import { Input } from '@/components/ui/Input';
import { useToastStore } from '@/components/ui/Toast/useToastStore';
import { useCreateGathering } from '@/api/gatherings/queries';
import { getTotalWeeks } from '@/lib/formatGatheringDate';

import { SCHEDULE_STEP_FIELDS } from '../steps';

import type { GatheringForm } from '@/api/gatherings/types';

const DATE_FIELDS = ['recruitDeadline', 'startDate', 'endDate'] as const;

interface ScheduleStepProps {
  onPrev: () => void;
  onCreated: (gatheringId: number) => void;
}

export function ScheduleStep({ onPrev, onCreated }: ScheduleStepProps) {
  const showToast = useToastStore((state) => state.showToast);
  const {
    register,
    control,
    watch,
    trigger,
    getValues,
    formState: { errors, touchedFields },
  } = useFormContext<GatheringForm>();

  const startDateValue = watch('startDate');
  const endDateValue = watch('endDate');
  const totalWeeks = startDateValue && endDateValue ? getTotalWeeks(startDateValue, endDateValue) : 0;

  const { mutate, isPending } = useCreateGathering();

  const handleNext = async () => {
    const isValid = await trigger(SCHEDULE_STEP_FIELDS);
    if (!isValid) return;

    mutate(getValues(), {
      onSuccess: (data) => onCreated(data.gathering.id),
      onError: () => showToast({ variant: 'error', title: '모임 생성에 실패했습니다.' }),
    });
  };

  return (
    <div className='flex flex-col gap-10 md:gap-14 lg:gap-20'>
      {/* 모집 정보 */}
      <section className='flex flex-col gap-4'>
        <p className='text-small-01-sb md:text-body-01-sb lg:text-h5-b text-gray-800'>
          모집 정보 <span className='text-blue-400'>*</span>
        </p>

        <div className='flex w-full flex-col gap-4 md:flex-row'>
          <div className='flex w-full flex-col gap-1.5'>
            <Input
              type='number'
              min={2}
              max={10}
              label={
                <span className='text-small-02-m md:text-body-02-m lg:text-body-01-m text-gray-800'>모집 인원</span>
              }
              placeholder='모집 인원을 적어주세요'
              error={errors.maxMembers?.message}
              {...register('maxMembers', { valueAsNumber: true })}
              className='text-small-02-r md:text-body-02-r lg:text-body-01-r bg-gray-0 h-[43px] md:h-[58px] lg:h-[72px] lg:px-7 lg:py-5'
            />
          </div>

          <Controller
            name='recruitDeadline'
            control={control}
            render={({ field }) => (
              <div className='flex w-full flex-col gap-1.5'>
                <p className='text-small-02-m md:text-body-02-m lg:text-body-01-m text-gray-800'>모집 마감 일정</p>
                <DatePicker
                  value={field.value}
                  onChange={(value) => {
                    field.onChange(value);
                    const fieldsToTrigger = DATE_FIELDS.filter((f) => f === field.name || touchedFields[f]);
                    trigger(fieldsToTrigger);
                  }}
                  onBlur={field.onBlur}
                  placeholder='모집 마감 일정을 선택해주세요'
                  error={errors.recruitDeadline?.message}
                  className='bg-gray-0 h-[43px] md:h-[58px] lg:h-[72px] lg:px-7 lg:py-5'
                />
              </div>
            )}
          />
        </div>
      </section>

      {/* 모임 일정 */}
      <section className='flex flex-col gap-4'>
        <p className='text-small-01-sb md:text-body-01-sb lg:text-h5-b text-gray-800'>
          모임 일정 <span className='text-blue-400'>*</span>
        </p>

        <div className='flex flex-col gap-4 md:flex-row'>
          <Controller
            name='startDate'
            control={control}
            render={({ field }) => (
              <div className='flex w-full flex-col gap-1.5'>
                <p className='text-small-02-m md:text-body-02-m lg:text-body-01-m text-gray-800'>모임 시작일</p>
                <DatePicker
                  value={field.value}
                  onChange={(value) => {
                    field.onChange(value);
                    const fieldsToTrigger = DATE_FIELDS.filter((f) => f === field.name || touchedFields[f]);
                    trigger(fieldsToTrigger);
                  }}
                  onBlur={field.onBlur}
                  placeholder='모임 시작일을 선택해주세요'
                  error={errors.startDate?.message}
                  className='bg-gray-0 h-[43px] md:h-[58px] lg:h-[72px] lg:px-7 lg:py-5'
                />
              </div>
            )}
          />

          <Controller
            name='endDate'
            control={control}
            render={({ field }) => (
              <div className='flex w-full flex-col gap-1.5'>
                <p className='text-small-02-m md:text-body-02-m lg:text-body-01-m text-gray-800'>모임 종료일</p>
                <DatePicker
                  value={field.value}
                  onChange={(value) => {
                    field.onChange(value);
                    const fieldsToTrigger = DATE_FIELDS.filter((f) => f === field.name || touchedFields[f]);
                    trigger(fieldsToTrigger);
                  }}
                  onBlur={field.onBlur}
                  placeholder='모임 종료일을 선택해주세요'
                  error={errors.endDate?.message}
                  className='bg-gray-0 h-[43px] md:h-[58px] lg:h-[72px] lg:px-7 lg:py-5'
                />
              </div>
            )}
          />
        </div>

        <div className='mt-2 flex h-[43px] items-center justify-between rounded-lg bg-gray-100 px-7 py-5 md:mt-4 md:h-[58px] lg:h-[72px]'>
          <p className='text-small-02-sb md:text-body-02-sb lg:text-body-01-sb text-gray-800'>모임 기간</p>
          <p className='text-small-02-sb md:text-body-02-sb lg:text-body-01-sb text-gray-800'>
            <span className='text-blue-400'>{totalWeeks}</span> 주
          </p>
        </div>
      </section>

      <div className='flex justify-between gap-3'>
        <Button
          type='button'
          variant='social'
          size={undefined}
          className='h-12 w-[164px] text-gray-800 md:h-[72px] md:w-75 lg:h-20'
        >
          임시 저장
        </Button>
        <div className='flex gap-3'>
          <Button
            type='button'
            variant='mypage-edit'
            size={undefined}
            onClick={onPrev}
            className='h-12 w-[164px] md:h-[72px] md:w-75 lg:h-20'
          >
            이전 단계
          </Button>
          <Button
            type='button'
            variant='action'
            size='action-sm'
            disabled={isPending}
            onClick={handleNext}
            className='text-small-01-sb md:text-body-01-sb lg:text-h5-b h-12 w-[164px] md:h-[72px] md:w-75 lg:h-20'
          >
            다음 단계
          </Button>
        </div>
      </div>
    </div>
  );
}
