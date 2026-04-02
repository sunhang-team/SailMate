'use client';

import { useEffect, useMemo, useState } from 'react';
import { type Control, type FieldErrors, type UseFormRegister, useController, useFieldArray } from 'react-hook-form';

import { Input } from '@/components/ui/Input';
import { ArrowIcon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';

import type { GatheringForm } from '@/api/gatherings/types';

interface WeeklyPlanFormProps {
  control: Control<GatheringForm>;
  register: UseFormRegister<GatheringForm>;
  errors: FieldErrors<GatheringForm>;
  totalWeeks: number;
}

interface WeeklyGuideItem {
  week: number;
  title: string;
  content: string;
}

const createEmptyGuide = (week: number): WeeklyGuideItem => ({
  week,
  title: '',
  content: '',
});

const parseDetailLines = (value: string | undefined) => {
  if (!value) return [''];
  const parsed = value.split('\n');
  return parsed.length > 0 ? parsed : [''];
};

interface WeekDetailInputsProps {
  control: Control<GatheringForm>;
  index: number;
  error?: string;
}

function WeekDetailInputs({ control, index, error }: WeekDetailInputsProps) {
  const { field } = useController({
    control,
    name: `weeklyGuides.${index}.content`,
  });
  const detailLines = parseDetailLines(field.value);

  const updateDetailLine = (lineIndex: number, nextValue: string) => {
    const currentLines = parseDetailLines(field.value);
    const nextLines = currentLines.map((line, idx) => (idx === lineIndex ? nextValue : line));
    field.onChange(nextLines.join('\n'));
  };

  const handleAddDetailLine = () => {
    const nextLines = [...parseDetailLines(field.value), ''];
    field.onChange(nextLines.join('\n'));
  };

  return (
    <div className='flex flex-col gap-3'>
      <p className='text-small-02-m md:text-body-02-m text-gray-800'>세부 계획</p>

      <div className='flex flex-col gap-3 lg:flex-row'>
        <div className='flex w-full flex-col gap-1.5 lg:w-1/2'>
          <Input
            placeholder='세부 계획을 적어주세요'
            value={detailLines[0] ?? ''}
            onBlur={field.onBlur}
            onChange={(event) => updateDetailLine(0, event.target.value)}
            error={error}
            className='text-small-02-r md:text-body-02-r h-11 md:h-14.5'
          />
        </div>
        <Button
          type='button'
          variant='add-detail'
          size='add-detail'
          className='hidden h-[calc(2.75rem+5px)] w-full md:h-[calc(3.625rem+5px)] lg:block lg:w-1/2'
          onClick={handleAddDetailLine}
        >
          + 세부 계획 추가
        </Button>
      </div>

      {detailLines.slice(1).map((detailLine, lineIndex) => (
        <div key={`${index}-detail-${lineIndex + 1}`} className='flex w-full flex-col gap-1.5 lg:w-1/2'>
          <Input
            placeholder='세부 계획을 적어주세요'
            value={detailLine}
            onBlur={field.onBlur}
            onChange={(event) => updateDetailLine(lineIndex + 1, event.target.value)}
            className='text-small-02-r md:text-body-02-r h-11 md:h-14.5'
          />
        </div>
      ))}

      <Button
        type='button'
        variant='add-detail'
        size='add-detail'
        className='h-[calc(2.75rem+2px)] w-full md:h-[calc(3.625rem+2px)] lg:hidden'
        onClick={handleAddDetailLine}
      >
        + 세부 계획 추가
      </Button>
    </div>
  );
}

export function WeeklyPlanForm({ control, register, errors, totalWeeks }: WeeklyPlanFormProps) {
  const [isOpen, setIsOpen] = useState(false);
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
      append(createEmptyGuide(1));
      return;
    }

    const normalized = fields.map((field, index) => ({
      week: index + 1,
      title: field.title ?? '',
      content: field.content ?? '',
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
        onClick={() => setIsOpen((prev) => !prev)}
        className='bg-gray-150 flex h-12 items-center justify-between rounded-lg border border-gray-200 px-7 py-5'
      >
        <span className='text-small-01-sb md:text-body-02-sb text-gray-800'>
          주차별 계획 <span className='md:text-small-02-r lg:text-small-01-r text-gray-400'>(선택)</span>
        </span>
        <ArrowIcon className={cn('size-4 rotate-90 text-gray-800 transition-transform', isOpen && '-rotate-90')} />
      </button>

      {isOpen && fields.length > 0 && (
        <div className='bg-gray-0 flex flex-col gap-5 rounded-b-lg border border-t-0 border-gray-200 px-7 py-7'>
          {fields.map((field, index) => (
            <div key={field.id} className='border-gray-150 flex flex-col gap-3 border-b pb-5 last:border-b-0 last:pb-0'>
              <p className='text-small-01-sb md:text-body-01-sb text-gray-800'>{index + 1}주차</p>

              <Input
                label={<span className='text-small-02-m md:text-body-02-m text-gray-800'>제목</span>}
                placeholder={`${index + 1}주차 계획의 제목을 적어주세요`}
                error={guideErrors?.[index]?.title?.message as string | undefined}
                {...register(`weeklyGuides.${index}.title`)}
              />

              <WeekDetailInputs
                control={control}
                index={index}
                error={guideErrors?.[index]?.content?.message as string | undefined}
              />
            </div>
          ))}

          {canAddNextWeek && (
            <Button type='button' variant='add-task' size='add-task' className='mb-2.5' onClick={handleAddNextWeek}>
              + 다음 주차 추가
            </Button>
          )}
        </div>
      )}
    </section>
  );
}
