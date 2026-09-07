'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Controller, type Resolver, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { DatePicker } from '@/components/ui/DatePicker';
import { Textarea } from '@/components/ui/Textarea';
import { useToastStore } from '@/components/ui/Toast/useToastStore';
import { useUpdateGathering } from '@/api/gatherings/queries';
import { createInProgressDateRefinementSchema, gatheringFormBaseSchema } from '@/api/gatherings/schemas';
import { WeeklyPlanForm } from '@/app/gatherings/_gathering-form-components/WeeklyPlanForm';
import { getTotalWeeks } from '@/lib/formatGatheringDate';

import type { GatheringForm } from '@/api/gatherings/types';

const DATE_FIELDS = ['startDate', 'endDate'] as const;

interface InProgressEditFormProps {
  gatheringId: number;
  initialValues: Partial<GatheringForm>;
}

export function InProgressEditForm({ gatheringId, initialValues }: InProgressEditFormProps) {
  const router = useRouter();
  const showToast = useToastStore((state) => state.showToast);

  const schema = useMemo(
    () =>
      gatheringFormBaseSchema.partial().and(
        createInProgressDateRefinementSchema({
          recruitDeadline: initialValues?.recruitDeadline ?? '',
          startDate: initialValues?.startDate ?? '',
        }),
      ),
    [initialValues?.recruitDeadline, initialValues?.startDate],
  );

  const {
    register,
    handleSubmit,
    control,
    watch,
    trigger,
    formState: { errors, touchedFields, isValid },
  } = useForm<GatheringForm>({
    resolver: zodResolver(schema) as Resolver<GatheringForm>,
    mode: 'onChange',
    defaultValues: {
      categoryIds: [],
      tags: [],
      weeklyGuides: [],
      ...initialValues,
    },
  });

  // resolver(zodResolver)가 있는 useForm은 마운트 시 formState.isValid를 자동 계산하지 않는다.
  // initialValues가 서버 응답으로 채워진 뒤 렌더링되므로, 여기서 한 번 trigger해
  // 사용자가 아무 필드도 건드리기 전부터 제출 버튼 상태가 실제 값과 일치하도록 만든다.
  useEffect(() => {
    trigger();
  }, [trigger]);

  const { mutate, isPending } = useUpdateGathering(gatheringId);

  const descValue = watch('description') ?? '';
  const startDateValue = watch('startDate');
  const endDateValue = watch('endDate');
  const totalWeeks = startDateValue && endDateValue ? getTotalWeeks(startDateValue, endDateValue) : 0;

  const onSubmit = (data: GatheringForm) => {
    mutate(
      { ...data, description: data.description?.trim() || undefined },
      {
        onSuccess: () => {
          showToast({ variant: 'success', title: '모임이 수정되었습니다.' });
          router.push(`/gatherings/${gatheringId}`);
        },
        onError: () => {
          showToast({ variant: 'error', title: '모임 수정에 실패했습니다.' });
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-10 md:gap-12 lg:gap-14'>
      <Card className='hover:shadow-02 shadow-02 flex flex-col gap-10 border-none p-6 py-10 md:gap-14 md:p-10 md:py-14 lg:gap-20 lg:p-14 lg:py-18'>
        <p className='text-small-02-r md:text-body-02-r lg:text-body-01-r rounded-lg bg-blue-50 px-4 py-3 text-blue-300 lg:px-7 lg:py-5'>
          진행 중인 모임은 일부 정보만 수정할 수 있어요. 모임 종료일, 주차별 계획, 상세 설명을 변경할 수 있어요.
        </p>

        {/* 모임 일정 */}
        <section className='flex flex-col gap-4'>
          <p className='text-small-01-sb md:text-body-01-sb lg:text-h5-sb text-gray-800'>모임 일정</p>

          <div className='flex flex-col gap-4 md:flex-row'>
            <Controller
              name='startDate'
              control={control}
              render={({ field }) => (
                <div className='flex w-full flex-col gap-1.5'>
                  <p className='text-small-02-m md:text-body-02-m lg:text-body-01-m text-gray-800'>모임 시작일</p>
                  <DatePicker
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    placeholder='모임 시작일을 선택해주세요'
                    disabled
                    className='bg-gray-0 h-10.75 md:h-14.5 lg:h-18 lg:px-7 lg:py-5'
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
                    className='bg-gray-0 h-10.75 md:h-14.5 lg:h-18 lg:px-7 lg:py-5'
                  />
                </div>
              )}
            />
          </div>

          <div className='mt-2 flex h-10.75 items-center justify-between rounded-lg bg-gray-100 px-7 py-5 md:mt-4 md:h-14.5 lg:h-18'>
            <p className='text-small-02-sb md:text-body-02-sb lg:text-body-01-sb text-gray-800'>모임 기간</p>
            <p className='text-small-02-sb md:text-body-02-sb lg:text-body-01-sb text-gray-800'>
              <span className='text-blue-400'>{totalWeeks}</span> 주
            </p>
          </div>
        </section>

        {/* 모임 세부 정보 */}
        <section className='flex flex-col gap-6 md:gap-8'>
          <p className='text-small-01-sb md:text-body-01-sb lg:text-h5-sb text-gray-800'>모임 세부 정보</p>

          <WeeklyPlanForm control={control} register={register} errors={errors} totalWeeks={totalWeeks} />

          {/* 상세 설명 */}
          <div className='flex flex-col gap-1'>
            <p className='text-small-02-m md:text-body-02-m lg:text-body-01-m flex items-center gap-1 text-gray-800'>
              상세 설명
            </p>
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
        </section>
      </Card>

      <div className='flex justify-end gap-3'>
        <Button
          type='button'
          variant='mypage-edit'
          size={undefined}
          onClick={() => router.push(`/gatherings/${gatheringId}`)}
          className='text-small-01-sb md:text-body-01-sb lg:text-h5-sb bg-gray-150 h-12 w-25 border-gray-400 text-gray-700 md:h-18 md:w-56 lg:h-20 lg:w-75'
        >
          취소
        </Button>
        <Button
          type='submit'
          variant='action'
          size='action-sm'
          disabled={isPending || !isValid}
          className='text-small-01-sb md:text-body-01-sb lg:text-h5-sb h-12 w-25 bg-blue-300 md:h-18 md:w-56 lg:h-20 lg:w-75'
        >
          변경 사항 저장
        </Button>
      </div>
    </form>
  );
}
