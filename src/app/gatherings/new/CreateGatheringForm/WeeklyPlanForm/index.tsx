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
      <p className='text-small-02-sb md:text-small-01-m lg:text-body-02-m text-gray-800'>세부 계획</p>

      {details.length === 0 ? (
        <Button
          type='button'
          variant='add-detail'
          size='add-detail'
          className='text-small-02-m md:text-body-02-m lg:text-body-01-m h-[43px] w-full md:h-[58px] lg:h-[72px]'
          onClick={handleAddDetail}
        >
          + 세부 계획 추가
        </Button>
      ) : (
        <>
          <div className='flex flex-col gap-3 lg:flex-row'>
            <div className='flex w-full flex-col gap-1.5 lg:w-1/2'>
              <div className='flex items-center gap-2'>
                <Input
                  placeholder='세부 계획을 적어주세요'
                  value={details[0] ?? ''}
                  onBlur={field.onBlur}
                  onChange={(event) => updateDetail(0, event.target.value)}
                  error={error}
                  className='text-small-02-r md:text-body-02-r lg:text-body-01-r bg-gray-0 h-[43px] md:h-[58px] lg:h-[72px] lg:px-7 lg:py-5'
                />
                <button
                  type='button'
                  onClick={() => handleRemoveDetail(0)}
                  className='shrink-0 text-gray-400 hover:text-gray-600'
                >
                  <CloseIcon className='size-4' />
                </button>
              </div>
            </div>
            {canAddDetail && (
              <Button
                type='button'
                variant='add-detail'
                size='add-detail'
                className='text-small-02-m md:text-body-02-m lg:text-body-01-m hidden h-[43px] w-full md:h-[58px] lg:block lg:h-[72px] lg:w-1/2'
                onClick={handleAddDetail}
              >
                + 세부 계획 추가
              </Button>
            )}
          </div>

          {details.length > 1 && (
            <div className='flex w-full flex-col gap-1.5 lg:w-1/2'>
              <div className='flex items-center gap-2'>
                <Input
                  placeholder='세부 계획을 적어주세요'
                  value={details[1] ?? ''}
                  onBlur={field.onBlur}
                  onChange={(event) => updateDetail(1, event.target.value)}
                  className='text-small-02-r md:text-body-02-r lg:text-body-01-r bg-gray-0 h-[43px] md:h-[58px] lg:h-[72px] lg:px-7 lg:py-5'
                />
                <button
                  type='button'
                  onClick={() => handleRemoveDetail(1)}
                  className='shrink-0 text-gray-400 hover:text-gray-600'
                >
                  <CloseIcon className='size-4' />
                </button>
              </div>
            </div>
          )}

          {canAddDetail && (
            <Button
              type='button'
              variant='add-detail'
              size='add-detail'
              className='text-small-02-m md:text-body-02-m lg:text-body-01-m h-[43px] w-full md:h-[58px] lg:hidden lg:h-[72px]'
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
  const isOpen = isOpenOverride ?? totalWeeks > 0;
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

    // 최초 1주차는 자동 생성, 이후 주차는 "다음 주차 추가" 버튼으로만 생성
    if (currentLength === 0) {
      append(createEmptyGuide(1), { shouldFocus: false });
      return;
    }

    const normalized = fields.map((field, index) => ({
      week: index + 1,
      title: field.title ?? '',
      details: field.details ?? [],
    }));
    const hasSameWeekOrder = normalized.every((item, index) => item.week === fields[index]?.week);
    if (!hasSameWeekOrder) {
      replace(normalized);
    }
  }, [append, fields, remove, replace, totalWeeks]);

  const guideErrors = useMemo(() => errors.weeklyGuides, [errors.weeklyGuides]);
  const canAddNextWeek = fields.length < Math.max(0, totalWeeks);

  const handleAddNextWeek = () => {
    if (!canAddNextWeek) return;
    append(createEmptyGuide(fields.length + 1));
  };

  return (
    <section className='mt-8 flex flex-col'>
      <button
        type='button'
        onClick={() => setIsOpenOverride((prev) => !(prev ?? totalWeeks > 0))}
        className={cn(
          'bg-gray-150 flex h-[43px] items-center justify-between border border-gray-200 px-7 py-5 md:h-[58px] lg:h-[72px]',
          isOpen ? 'rounded-t-lg rounded-b-none' : 'rounded-lg',
        )}
      >
        <span className='text-small-02-sb md:text-body-02-sb lg:text-body-01-sb text-gray-800'>
          주차별 계획 <span className='text-blue-400'>*</span>
        </span>
        <ArrowIcon className={cn('size-4 rotate-90 text-gray-800 transition-transform', isOpen && '-rotate-90')} />
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
                    모임 시작일과 종료일을 입력하면 주차별 계획을 작성할 수 있어요
                  </p>
                </div>
              )}
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className='border-gray-150 flex flex-col gap-3 border-b pb-5 last:border-b-0 last:pb-0'
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
                    className='text-small-02-r md:text-body-02-r lg:text-body-01-r bg-gray-0 h-[43px] md:h-[58px] lg:h-[72px] lg:px-7 lg:py-5'
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
                  className='text-small-02-sb md:text-body-02-sb lg:text-body-01-sb mb-2.5 h-[43px] md:h-[58px] lg:h-[72px]'
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
