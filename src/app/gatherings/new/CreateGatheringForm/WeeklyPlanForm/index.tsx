'use client';

import { useEffect, useMemo, useState } from 'react';
import { type Control, type FieldErrors, type UseFormRegister, useFieldArray } from 'react-hook-form';

import { Input } from '@/components/ui/Input';
import { ArrowIcon } from '@/components/ui/Icon';
import { Textarea } from '@/components/ui/Textarea';
import { cn } from '@/lib/cn';

import type { GatheringFormPartial } from '@/api/gatherings/types';

interface WeeklyPlanFormProps {
  control: Control<GatheringFormPartial>;
  register: UseFormRegister<GatheringFormPartial>;
  errors: FieldErrors<GatheringFormPartial>;
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

export function WeeklyPlanForm({ control, register, errors, totalWeeks }: WeeklyPlanFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { fields, replace } = useFieldArray({
    control,
    name: 'weeklyGuides',
  });

  useEffect(() => {
    const nextLength = Math.max(0, totalWeeks);
    const currentGuides = fields.map((field, index) => ({
      week: index + 1,
      title: field.title ?? '',
      content: field.content ?? '',
    }));

    const resized = Array.from({ length: nextLength }, (_, index) => {
      const existing = currentGuides[index];
      return existing ? { ...existing, week: index + 1 } : createEmptyGuide(index + 1);
    });

    const hasSameLength = currentGuides.length === resized.length;
    const hasSameValue =
      hasSameLength &&
      resized.every(
        (item, index) =>
          item.week === currentGuides[index]?.week &&
          item.title === currentGuides[index]?.title &&
          item.content === currentGuides[index]?.content,
      );

    if (!hasSameValue) {
      replace(resized);
    }
  }, [fields, replace, totalWeeks]);

  const guideErrors = useMemo(() => errors.weeklyGuides, [errors.weeklyGuides]);

  return (
    <section className='mt-8 flex flex-col'>
      <button
        type='button'
        onClick={() => setIsOpen((prev) => !prev)}
        className='bg-gray-150 flex h-12 items-center justify-between rounded-lg border border-gray-200 px-7 py-5'
      >
        <span className='text-small-01-sb md:text-body-02-sb text-gray-800'>
          주차별 계획 <span className='md: text-small-02-r lg:text-small-01-r text-gray-400'>(선택)</span>
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

              <Textarea
                label='세부 계획'
                placeholder='세부 계획을 적어주세요'
                error={guideErrors?.[index]?.content?.message as string | undefined}
                rows={3}
                {...register(`weeklyGuides.${index}.content`)}
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
