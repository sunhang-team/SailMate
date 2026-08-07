'use client';

import { type ReactNode, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Controller, type Resolver, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { DatePicker } from '@/components/ui/DatePicker';
import { Dropdown } from '@/components/ui/Dropdown';
import { CheckIcon } from '@/components/ui/Icon/CheckIcon';
import { StudyIcon, ProjectIcon, CategoryIcon, ArrowIcon, CloseIcon } from '@/components/ui/Icon';
import { useDropdown } from '@/components/ui/Dropdown/context';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { useToastStore } from '@/components/ui/Toast/useToastStore';
import { gatheringQueries, useUpdateGathering } from '@/api/gatherings/queries';
import {
  createInProgressDateRefinementSchema,
  gatheringFormBaseSchema,
  gatheringUpdateFormSchema,
} from '@/api/gatherings/schemas';
import { ImageUpload } from '@/app/gatherings/_gathering-form-components/ImageUpload';
import { TagInput } from '@/app/gatherings/_gathering-form-components/TagInput';
import { WeeklyPlanForm } from '@/app/gatherings/_gathering-form-components/WeeklyPlanForm';
import { GATHERING_TYPES } from '@/constants/gathering';
import { cn } from '@/lib/cn';
import { getTotalWeeks } from '@/lib/formatGatheringDate';

import type { GatheringForm, GatheringStatus } from '@/api/gatherings/types';

const RotatingArrow = ({ isInProgressEdit }: { isInProgressEdit: boolean }) => {
  const { isOpen } = useDropdown();
  return (
    <ArrowIcon
      className={cn(
        'size-4 rotate-90 transition-transform duration-200 md:size-6 lg:size-7',
        isOpen ? '-rotate-90' : '',
        isInProgressEdit && 'text-gray-400',
      )}
    />
  );
};

// 드롭다운이 열려있을 때만 gradient 테두리, 닫히면 grayscale로 복귀
const CategoryTriggerBorder = ({ children }: { children: ReactNode }) => {
  const { isOpen } = useDropdown();
  return (
    <div
      className={cn(
        'flex h-11.75 w-full cursor-pointer items-center justify-between rounded-lg bg-white px-4 py-3 transition-colors duration-200 md:h-15.5 lg:h-19 lg:px-7 lg:py-5',
        isOpen ? 'border-gradient-primary' : 'border border-gray-200',
      )}
    >
      {children}
    </div>
  );
};

const DATE_FIELDS = ['recruitDeadline', 'startDate', 'endDate'] as const;

interface RequiredMarkProps {
  isInProgressEdit: boolean;
}

const RequiredMark = ({ isInProgressEdit }: RequiredMarkProps) => {
  if (!isInProgressEdit) return null;
  return <span className='text-small-02-r lg:text-small-01-r font-normal text-gray-400'>(수정 불가)</span>;
};

const TYPE_META = {
  스터디: { label: '스터디', subtitle: '함께 학습하고 성장해요', Icon: StudyIcon },
  프로젝트: { label: '프로젝트', subtitle: '함께 만들고 완성해요', Icon: ProjectIcon },
} as const;

interface EditGatheringFormProps {
  gatheringId: number;
  initialValues: Partial<GatheringForm>;
  gatheringStatus: GatheringStatus;
}

export function EditGatheringForm({ gatheringId, initialValues, gatheringStatus }: EditGatheringFormProps) {
  const router = useRouter();
  const showToast = useToastStore((state) => state.showToast);
  const isInProgressEdit = gatheringStatus === 'IN_PROGRESS';

  const { data: categoriesData } = useSuspenseQuery(gatheringQueries.categories());
  const categories = categoriesData.categories;
  const categoryMeta = useMemo(
    () => Object.fromEntries(categories.map((c) => [c.id, { label: c.name }])) as Record<number, { label: string }>,
    [categories],
  );

  const schema = useMemo(() => {
    if (isInProgressEdit) {
      return gatheringFormBaseSchema.partial().and(
        createInProgressDateRefinementSchema({
          recruitDeadline: initialValues?.recruitDeadline ?? '',
          startDate: initialValues?.startDate ?? '',
        }),
      );
    }
    return gatheringUpdateFormSchema;
  }, [isInProgressEdit, initialValues?.recruitDeadline, initialValues?.startDate]);

  const {
    register,
    handleSubmit,
    control,
    watch,
    trigger,
    formState: { errors, touchedFields, isValid },
  } = useForm<GatheringForm>({
    // schema는 status(RECRUITING/IN_PROGRESS)에 따라 둘 중 하나로 바뀌지만
    // 둘 다 GatheringForm 필드의 부분집합만 optional로 검증하므로 폼 타입과 안전하게 호환됨
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

  const titleValue = watch('title') ?? '';
  const shortDescValue = watch('shortDescription') ?? '';
  const descValue = watch('description') ?? '';
  const goalValue = watch('goal') ?? '';
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
        {/* 모임 유형 */}
        <section className='flex flex-col gap-3'>
          <p
            className={cn(
              'text-small-01-sb md:text-body-01-sb lg:text-h5-sb text-gray-800',
              isInProgressEdit && 'text-gray-400',
            )}
          >
            모임 유형 <RequiredMark isInProgressEdit={isInProgressEdit} />
          </p>
          <Controller
            name='type'
            control={control}
            render={({ field }) => (
              <div className='flex flex-col gap-4 md:flex-row'>
                {GATHERING_TYPES.map((type) => {
                  const isSelected = field.value === type;
                  const { subtitle, Icon } = TYPE_META[type];
                  return (
                    <Card
                      key={type}
                      className={cn(
                        'flex h-40 items-center gap-6 rounded-lg px-8 shadow-none hover:shadow-none',
                        'h-21.25',
                        'md:h-40 md:w-auto md:flex-1 md:gap-6 md:px-8',
                        isInProgressEdit ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
                        isSelected ? 'border-focus-100 bg-blue-50' : 'border-gray-300 bg-gray-100',
                      )}
                      onClick={() => {
                        if (isInProgressEdit) return;
                        field.onChange(type);
                      }}
                    >
                      <CheckIcon
                        className={cn('size-8 md:size-10 lg:size-14', isSelected ? 'text-blue-300' : 'text-gray-300')}
                      />
                      <div className='flex flex-1 flex-col gap-1'>
                        <span
                          className={cn(
                            'text-body-02-sb md:text-h5-b lg:text-h4-b',
                            isSelected ? 'text-blue-300' : 'text-gray-600',
                          )}
                        >
                          {TYPE_META[type].label}
                        </span>
                        <span
                          className={cn(
                            'text-small-02-r md:text-body-02-r lg:text-body-01-r',
                            isSelected ? 'text-blue-300' : 'text-gray-300',
                          )}
                        >
                          {subtitle}
                        </span>
                      </div>
                      {isSelected && <Icon className='size-9 text-blue-300 md:size-12 lg:size-14' />}
                    </Card>
                  );
                })}
              </div>
            )}
          />
          {errors.type && (
            <p className='text-xs text-red-200' role='alert'>
              {errors.type.message}
            </p>
          )}
        </section>

        {/* 기본 정보 */}
        <section className='flex flex-col gap-6 md:gap-8'>
          <p
            className={cn(
              'text-small-01-sb md:text-body-01-sb lg:text-h5-sb text-gray-800',
              isInProgressEdit && 'text-gray-400',
            )}
          >
            기본 정보 <RequiredMark isInProgressEdit={isInProgressEdit} />
          </p>
          <div className='flex flex-col gap-6 lg:flex-row lg:gap-4'>
            <div className='flex w-full flex-col gap-1 lg:flex-1'>
              <div className='relative'>
                <Input
                  label={
                    <span
                      className={cn(
                        'text-small-02-m md:text-body-02-m lg:text-body-01-m text-gray-800',
                        isInProgressEdit && 'text-gray-400',
                      )}
                    >
                      모임 제목
                    </span>
                  }
                  maxLength={30}
                  placeholder='제목을 입력하세요'
                  error={errors.title?.message}
                  hideErrorMessage
                  disabled={isInProgressEdit}
                  {...register('title')}
                  className={cn(
                    'text-small-02-r md:text-body-02-r lg:text-body-01-r bg-gray-0 pr-12 disabled:text-gray-400 lg:px-7 lg:py-5 lg:pr-20',
                    errors.title?.message ? 'h-11.75 md:h-15.5 lg:h-19' : 'h-10.75 md:h-14.5 lg:h-18',
                  )}
                />
                <span className='md:text-small-02-r pointer-events-none absolute right-3 bottom-1 text-[8px] text-gray-400 lg:right-5 lg:bottom-4'>
                  {titleValue.length}/30
                </span>
              </div>
              {errors.title?.message && (
                <p className='text-xs text-red-200' role='alert'>
                  {errors.title.message}
                </p>
              )}
            </div>
            <Controller
              name='categoryIds'
              control={control}
              render={({ field }) => {
                const selected = field.value ?? [];

                const MAX_CATEGORIES = 3;

                const toggleCategory = (id: number) => {
                  if (isInProgressEdit) return;
                  if (selected.includes(id)) {
                    field.onChange(selected.filter((v) => v !== id));
                    return;
                  }
                  if (selected.length >= MAX_CATEGORIES) return;
                  field.onChange([...selected, id]);
                };

                return (
                  <div
                    className={cn(
                      'flex w-full flex-col gap-1.5 lg:flex-1',
                      isInProgressEdit && 'pointer-events-none opacity-60',
                    )}
                  >
                    <p
                      className={cn(
                        'text-small-02-m md:text-body-02-m lg:text-body-01-m text-gray-800',
                        isInProgressEdit && 'text-gray-400',
                      )}
                    >
                      카테고리
                    </p>
                    <Dropdown className='flex w-full flex-col'>
                      <Dropdown.Trigger>
                        <CategoryTriggerBorder>
                          <div className='flex items-center gap-2'>
                            <CategoryIcon
                              className={cn('size-4 md:size-6 lg:size-7', isInProgressEdit && 'text-gray-400')}
                            />
                            {selected.length > 0 ? (
                              <div className='flex items-center gap-1'>
                                <span
                                  className={cn(
                                    'text-small-02-sb md:text-body-02-sb lg:text-body-01-sb text-gray-900',
                                    isInProgressEdit && 'text-gray-400',
                                  )}
                                >
                                  카테고리({selected.length})
                                </span>
                                <span
                                  className={cn(
                                    'text-small-02-m md:text-body-02-m lg:text-body-01-m text-gray-900',
                                    isInProgressEdit && 'text-gray-400',
                                  )}
                                >
                                  {selected.map((id) => categoryMeta[id]?.label).join(', ')}
                                </span>
                              </div>
                            ) : (
                              <span className='text-small-02-r md:text-body-02-r lg:text-body-01-r text-gray-400'>
                                카테고리를 선택해주세요
                              </span>
                            )}
                          </div>
                          <RotatingArrow isInProgressEdit={isInProgressEdit} />
                        </CategoryTriggerBorder>
                      </Dropdown.Trigger>
                      <Dropdown.Menu
                        containerClassName='w-full'
                        className='custom-scrollbar max-h-60 w-full overflow-y-auto rounded-lg border border-blue-100 bg-white p-2'
                      >
                        {categories.map((cat) => (
                          <Dropdown.Item
                            key={cat.id}
                            closeOnSelect={false}
                            disabled={selected.length >= MAX_CATEGORIES && !selected.includes(cat.id)}
                            onClick={() => toggleCategory(cat.id)}
                            className={cn(
                              'text-small-02-m md:text-body-02-m lg:text-body-01-m mb-0.5 flex cursor-pointer items-center justify-between rounded-lg px-4 py-3 text-gray-700 hover:bg-blue-100 hover:text-blue-400',
                              selected.includes(cat.id) && 'bg-blue-100 text-blue-400',
                            )}
                          >
                            {cat.name}
                            {selected.includes(cat.id) && <CloseIcon className='size-4 text-blue-400 md:size-5' />}
                          </Dropdown.Item>
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>
                    {errors.categoryIds && (
                      <p className='text-xs text-red-200' role='alert'>
                        {errors.categoryIds.message}
                      </p>
                    )}
                  </div>
                );
              }}
            />
          </div>

          {/* 한 줄 소개 */}
          <div className='flex flex-1 flex-col gap-1'>
            <div className='relative'>
              <Input
                label={
                  <span
                    className={cn(
                      'text-small-02-m md:text-body-02-m lg:text-body-01-m text-gray-800',
                      isInProgressEdit && 'text-gray-400',
                    )}
                  >
                    한 줄 소개
                  </span>
                }
                maxLength={50}
                placeholder='소개를 적어주세요'
                error={errors.shortDescription?.message}
                hideErrorMessage
                disabled={isInProgressEdit}
                {...register('shortDescription')}
                className='text-small-02-r md:text-body-02-r lg:text-body-01-r bg-gray-0 h-10.75 pr-12 disabled:text-gray-400 md:h-14.5 lg:h-18 lg:px-7 lg:py-5 lg:pr-20'
              />
              <span className='md:text-small-02-r pointer-events-none absolute right-3 bottom-1 text-[8px] text-gray-400 lg:right-5 lg:bottom-4'>
                {shortDescValue.length}/50
              </span>
            </div>
            {errors.shortDescription?.message && (
              <p className='text-xs text-red-200' role='alert'>
                {errors.shortDescription.message}
              </p>
            )}
          </div>

          {/* 모임 최종 목표 */}
          <div className='flex flex-col gap-1'>
            <div className='relative'>
              <Input
                label={
                  <span
                    className={cn(
                      'text-small-02-m md:text-body-02-m lg:text-body-01-m text-gray-800',
                      isInProgressEdit && 'text-gray-400',
                    )}
                  >
                    모임 최종 목표
                  </span>
                }
                maxLength={200}
                placeholder='모임의 최종 목표를 적어주세요'
                error={errors.goal?.message}
                hideErrorMessage
                disabled={isInProgressEdit}
                {...register('goal')}
                className='text-small-02-r md:text-body-02-r lg:text-body-01-r bg-gray-0 h-10.75 pr-14 disabled:text-gray-400 md:h-14.5 lg:h-18 lg:px-7 lg:py-5 lg:pr-24'
              />
              <span className='md:text-small-02-r pointer-events-none absolute right-3 bottom-1 text-[8px] text-gray-400 lg:right-7 lg:bottom-4'>
                {goalValue.length}/200
              </span>
            </div>
            {errors.goal?.message && (
              <p className='text-xs text-red-200' role='alert'>
                {errors.goal.message}
              </p>
            )}
          </div>

          {/* 태그 */}
          <div className={cn('flex flex-col gap-1', isInProgressEdit && 'pointer-events-none opacity-60')}>
            <p
              className={cn(
                'text-small-02-m md:text-body-02-m lg:text-body-01-m flex items-center gap-1 text-gray-800',
                isInProgressEdit && 'text-gray-400',
              )}
            >
              태그
            </p>
            <Controller
              name='tags'
              control={control}
              render={({ field }) => (
                <TagInput
                  value={field.value ?? []}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  error={errors.tags?.root?.message ?? errors.tags?.message}
                />
              )}
            />
          </div>
        </section>
      </Card>

      <Card className='hover:shadow-02 shadow-02 flex flex-col gap-10 border-none p-6 py-10 md:gap-14 md:p-10 md:py-14 lg:gap-20 lg:p-14 lg:py-18'>
        {/* 모집 정보 */}
        <section className='flex flex-col gap-4'>
          <p
            className={cn(
              'text-small-01-sb md:text-body-01-sb lg:text-h5-sb text-gray-800',
              isInProgressEdit && 'text-gray-400',
            )}
          >
            모집 정보 <RequiredMark isInProgressEdit={isInProgressEdit} />
          </p>

          <div className='flex w-full flex-col gap-4 md:flex-row'>
            <div className='flex w-full flex-col gap-1.5'>
              <Input
                type='number'
                min={2}
                max={10}
                label={
                  <span
                    className={cn(
                      'text-small-02-m md:text-body-02-m lg:text-body-01-m text-gray-800',
                      isInProgressEdit && 'text-gray-400',
                    )}
                  >
                    모집 인원
                  </span>
                }
                placeholder='모집 인원을 적어주세요'
                error={errors.maxMembers?.message}
                disabled={isInProgressEdit}
                {...register('maxMembers', { valueAsNumber: true })}
                className='text-small-02-r md:text-body-02-r lg:text-body-01-r bg-gray-0 h-10.75 disabled:text-gray-400 md:h-14.5 lg:h-18 lg:px-7 lg:py-5'
              />
            </div>

            <Controller
              name='recruitDeadline'
              control={control}
              render={({ field }) => (
                <div className='flex w-full flex-col gap-1.5'>
                  <p
                    className={cn(
                      'text-small-02-m md:text-body-02-m lg:text-body-01-m text-gray-800',
                      isInProgressEdit && 'text-gray-400',
                    )}
                  >
                    모집 마감 일정
                  </p>
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
                    disabled={isInProgressEdit}
                    className='bg-gray-0 h-10.75 md:h-14.5 lg:h-18 lg:px-7 lg:py-5'
                  />
                </div>
              )}
            />
          </div>
        </section>

        {/* 모임 일정 */}
        <section className='flex flex-col gap-4'>
          <p className='text-small-01-sb md:text-body-01-sb lg:text-h5-sb text-gray-800'>
            모임 일정
            {isInProgressEdit && (
              <span className='text-small-02-r lg:text-small-01-r ml-1 font-normal text-gray-400'>
                (종료일만 수정 가능)
              </span>
            )}
          </p>

          <div className='flex flex-col gap-4 md:flex-row'>
            <Controller
              name='startDate'
              control={control}
              render={({ field }) => (
                <div className='flex w-full flex-col gap-1.5'>
                  <p
                    className={cn(
                      'text-small-02-m md:text-body-02-m lg:text-body-01-m text-gray-800',
                      isInProgressEdit && 'text-gray-400',
                    )}
                  >
                    모임 시작일
                  </p>
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
                    disabled={isInProgressEdit}
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
      </Card>

      <Card className='hover:shadow-02 shadow-02 flex flex-col gap-6 border-none p-6 py-10 md:gap-8 md:p-10 md:py-14 lg:p-14 lg:py-18'>
        {/* 모임 세부 정보 */}
        <section className='flex flex-col gap-6 md:gap-8'>
          <p className='text-small-01-sb md:text-body-01-sb lg:text-h5-sb text-gray-800'>
            모임 세부 정보
            <span className='text-small-02-r lg:text-small-01-r ml-1 font-normal text-gray-400'>(수정 가능)</span>
          </p>

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
