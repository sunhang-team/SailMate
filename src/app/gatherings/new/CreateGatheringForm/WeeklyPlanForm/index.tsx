'use client';

import { useEffect, useMemo, useState } from 'react';
import { type Control, type FieldErrors, type UseFormRegister, useController, useFieldArray } from 'react-hook-form';
import { AnimatePresence, motion } from 'motion/react';

import { Input } from '@/components/ui/Input';
import { ArrowIcon, CalendarIcon, CloseIcon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';

import type { GatheringForm } from '@/api/gatherings/types';

interface WeeklyPlanFormProps {
  control: Control<GatheringForm>;
  register: UseFormRegister<GatheringForm>;
  errors: FieldErrors<GatheringForm>;
  totalWeeks: number;
}

const MAX_DETAILS = 2;

const createEmptyGuide = (week: number) => ({
  week,
  title: '',
  details: [] as string[],
});

interface WeekDetailInputsProps {
  control: Control<GatheringForm>;
  index: number;
  error?: string;
}

function WeekDetailInputs({ control, index, error }: WeekDetailInputsProps) {
  const { field } = useController({
    control,
    name: `weeklyGuides.${index}.details`,
  });
  const details = field.value ?? [];

  const updateDetail = (detailIndex: number, nextValue: string) => {
    const nextDetails = details.map((d, i) => (i === detailIndex ? nextValue : d));
    field.onChange(nextDetails);
  };

  const handleAddDetail = () => {
    if (details.length >= MAX_DETAILS) return;
    field.onChange([...details, '']);
  };

  const handleRemoveDetail = (detailIndex: number) => {
    field.onChange(details.filter((_, i) => i !== detailIndex));
  };

  const canAddDetail = details.length < MAX_DETAILS;

  return (
    <div className='flex flex-col gap-3'>
      <p className='text-small-02-sb md:text-small-01-m lg:text-body-02-m flex items-center gap-1 text-gray-800'>
        세부 계획
      </p>

      {details.length === 0 ? (
        <Button
          type='button'
          variant='add-detail'
          size='add-detail'
          className='text-small-02-m md:text-body-02-m lg:text-body-01-m h-10.75 w-full md:h-14.5 lg:h-18'
          onClick={handleAddDetail}
        >
          + 세부 계획 추가
        </Button>
      ) : (
        <>
          <div className='flex flex-col gap-3 lg:flex-row'>
            <div className='relative w-full lg:w-1/2'>
              <Input
                placeholder='세부 계획을 적어주세요'
                value={details[0] ?? ''}
                onBlur={field.onBlur}
                onChange={(event) => updateDetail(0, event.target.value)}
                error={error}
                className='text-small-02-r md:text-body-02-r lg:text-body-01-r bg-gray-0 h-10.75 pr-10 md:h-14.5 lg:h-18 lg:px-7 lg:py-5 lg:pr-10'
              />
              <button
                type='button'
                onClick={() => handleRemoveDetail(0)}
                className='absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600'
              >
                <CloseIcon className='size-4 md:size-5 lg:size-5' />
              </button>
            </div>
            {details.length > 1 ? (
              <div className='relative w-full lg:w-1/2'>
                <Input
                  placeholder='세부 계획을 적어주세요'
                  value={details[1] ?? ''}
                  onBlur={field.onBlur}
                  onChange={(event) => updateDetail(1, event.target.value)}
                  className='text-small-02-r md:text-body-02-r lg:text-body-01-r bg-gray-0 h-10.75 pr-10 md:h-14.5 lg:h-18 lg:px-7 lg:py-5 lg:pr-10'
                />
                <button
                  type='button'
                  onClick={() => handleRemoveDetail(1)}
                  className='absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600'
                >
                  <CloseIcon className='size-4 md:size-5 lg:size-5' />
                </button>
              </div>
            ) : (
              canAddDetail && (
                <Button
                  type='button'
                  variant='add-detail'
                  size='add-detail'
                  className='text-small-02-m md:text-body-02-m lg:text-body-01-m hidden h-10.75 w-full md:h-14.5 lg:block lg:h-18 lg:w-1/2'
                  onClick={handleAddDetail}
                >
                  + 세부 계획 추가
                </Button>
              )
            )}
          </div>

          {canAddDetail && (
            <Button
              type='button'
              variant='add-detail'
              size='add-detail'
              className='text-small-02-m md:text-body-02-m lg:text-body-01-m h-10.75 w-full md:h-14.5 lg:hidden lg:h-18'
              onClick={handleAddDetail}
            >
              + 세부 계획 추가
            </Button>
          )}
        </>
      )}
    </div>
  );
}

export function WeeklyPlanForm({ control, register, errors, totalWeeks }: WeeklyPlanFormProps) {
  const [isOpenOverride, setIsOpenOverride] = useState<boolean | null>(null);
  const isOpen = isOpenOverride ?? false;
  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: 'weeklyGuides',
  });

  useEffect(() => {
    const allowedLength = Math.max(0, totalWeeks);
    const currentLength = fields.length;

    if (allowedLength === 0) {
      if (currentLength > 0) {
        remove();
      }
      return;
    }

    // 총 주차가 줄어든 경우에만 초과 주차를 자동 제거
    if (currentLength > allowedLength) {
      remove(allowedLength);
      return;
    }

    if (currentLength === 0) return;

    const normalized = fields.map((field, index) => ({
      week: index + 1,
      title: field.title ?? '',
      details: field.details ?? [],
    }));
    const hasSameWeekOrder = normalized.every((item, index) => item.week === fields[index]?.week);
    if (!hasSameWeekOrder) {
      replace(normalized);
    }
  }, [fields, remove, replace, totalWeeks]);

  const guideErrors = useMemo(() => errors.weeklyGuides, [errors.weeklyGuides]);
  const canAddNextWeek = fields.length < Math.max(0, totalWeeks);

  const handleAddNextWeek = () => {
    if (!canAddNextWeek) return;
    append(createEmptyGuide(fields.length + 1));
  };

  return (
    <section className='mt-2 flex flex-col md:mt-4'>
      <button
        type='button'
        onClick={() => setIsOpenOverride((prev) => !(prev ?? totalWeeks > 0))}
        className={cn(
          'bg-gray-150 flex h-10.75 items-center justify-between border border-gray-200 px-7 py-5 md:h-14.5 lg:h-18',
          isOpen ? 'rounded-t-lg rounded-b-none' : 'rounded-lg',
        )}
      >
        <span className='text-small-02-sb md:text-body-02-sb lg:text-body-01-sb text-gray-800'>주차별 계획</span>
        <ArrowIcon
          className={cn(
            'size-4 rotate-90 text-gray-800 transition-transform md:size-5 lg:size-6',
            isOpen && '-rotate-90',
          )}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            key='weekly-plan-panel'
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className='overflow-hidden'
          >
            <div className='bg-gray-0 flex flex-col gap-5 rounded-b-lg border border-t-0 border-gray-200 px-7 py-7'>
              {fields.length === 0 && (
                <div className='flex flex-col items-center gap-2 py-6 text-gray-400'>
                  <CalendarIcon className='size-8' />
                  <p className='text-small-01-r md:text-body-02-r text-center'>
                    {totalWeeks > 0
                      ? '아래 버튼을 눌러 주차별 계획을 추가해보세요'
                      : '모임 시작일과 종료일을 입력하면 주차별 계획을 작성할 수 있어요'}
                  </p>
                </div>
              )}
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className='border-gray-150 flex flex-col gap-6 border-b pb-5 last:border-b-0 last:pb-0'
                >
                  <p className='text-small-02-sb md:text-body-02-sb lg:text-body-01-sb text-gray-800'>
                    {index + 1}주차
                  </p>

                  <Input
                    label={
                      <span className='md:text-small-01-m lg:text-body-02-m hidden text-gray-800 md:inline'>제목</span>
                    }
                    placeholder={`${index + 1}주차 계획의 제목을 적어주세요`}
                    error={guideErrors?.[index]?.title?.message as string | undefined}
                    {...register(`weeklyGuides.${index}.title`)}
                    className='text-small-02-r md:text-body-02-r lg:text-body-01-r bg-gray-0 h-10.75 md:h-14.5 lg:h-18 lg:px-7 lg:py-5'
                  />

                  <WeekDetailInputs
                    control={control}
                    index={index}
                    error={guideErrors?.[index]?.details?.message as string | undefined}
                  />
                </div>
              ))}

              {canAddNextWeek && (
                <Button
                  type='button'
                  variant='add-task'
                  size='add-task'
                  className='text-small-02-sb md:text-body-02-sb lg:text-body-01-sb mb-2.5 h-10.75 md:h-14.5 lg:h-18'
                  onClick={handleAddNextWeek}
                >
                  + 다음 주차 추가
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
