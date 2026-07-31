'use client';

import { type ReactNode, useEffect, useMemo, useRef } from 'react';
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
import { gatheringQueries, useCreateGathering, useUpdateGathering } from '@/api/gatherings/queries';
import {
  createInProgressDateRefinementSchema,
  gatheringFormBaseSchema,
  gatheringFormSchema,
  gatheringUpdateFormSchema,
} from '@/api/gatherings/schemas';
import { ImageUpload } from '@/app/gatherings/_gathering-form-components/ImageUpload';
import { TagInput } from '@/app/gatherings/_gathering-form-components/TagInput';
import { WeeklyPlanForm } from '@/app/gatherings/_gathering-form-components/WeeklyPlanForm';
import { GATHERING_TYPES } from '@/constants/gathering';
import { cn } from '@/lib/cn';
import {
  trackGatheringCreateFailed,
  trackGatheringCreateStart,
  trackGatheringCreateSubmit,
} from '@/lib/analytics/gathering';
import { getTotalWeeks } from '@/lib/formatGatheringDate';

import type { GatheringForm, GatheringStatus } from '@/api/gatherings/types';

const RotatingArrow = () => {
  const { isOpen } = useDropdown();
  return (
    <ArrowIcon
      className={cn(
        'size-4 rotate-90 transition-transform duration-200 md:size-6 lg:size-7',
        isOpen ? '-rotate-90' : '',
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
        'flex h-[47px] w-full cursor-pointer items-center justify-between rounded-lg bg-white px-4 py-3 transition-colors duration-200 md:h-[62px] lg:h-[76px] lg:px-7 lg:py-5',
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
  fieldRequired: boolean;
}

// fieldRequired: 진행 중 상태에서도 필수인 필드(수정 자체가 불가능하므로 '수정 불가' 표시)
// !fieldRequired: 진행 중 상태에 수정 가능한 필드(description/endDate 등, '(선택)' 표시)
const RequiredMark = ({ isInProgressEdit, fieldRequired }: RequiredMarkProps) => {
  if (!isInProgressEdit) return <span className='text-blue-400'>*</span>;
  if (fieldRequired) {
    return <span className='text-small-02-r lg:text-small-01-r font-normal text-gray-400'>(수정 불가)</span>;
  }
  return <span className='text-small-02-r lg:text-small-01-r font-normal text-gray-400'>(선택)</span>;
};

const TYPE_META = {
  스터디: { label: '스터디', subtitle: '함께 학습하고 성장해요', Icon: StudyIcon },
  프로젝트: { label: '프로젝트', subtitle: '함께 만들고 완성해요', Icon: ProjectIcon },
} as const;

interface EditGatheringFormProps {
  mode?: 'create' | 'edit';
  gatheringId?: number;
  initialValues?: Partial<GatheringForm>;
  gatheringStatus?: GatheringStatus;
}

export function EditGatheringForm({
  mode = 'create',
  gatheringId,
  initialValues,
  gatheringStatus,
}: EditGatheringFormProps) {
  const router = useRouter();
  const showToast = useToastStore((state) => state.showToast);
  const isEditMode = mode === 'edit';
  const isInProgressEdit = isEditMode && gatheringStatus === 'IN_PROGRESS';

  const { data: categoriesData } = useSuspenseQuery(gatheringQueries.categories());
  const categories = categoriesData.categories;
  const categoryMeta = useMemo(
    () => Object.fromEntries(categories.map((c) => [c.id, { label: c.name }])) as Record<number, { label: string }>,
    [categories],
  );

  const schema = useMemo(() => {
    if (!isEditMode) return gatheringFormSchema;
    if (isInProgressEdit) {
      return gatheringFormBaseSchema.partial().and(
        createInProgressDateRefinementSchema({
          recruitDeadline: initialValues?.recruitDeadline ?? '',
          startDate: initialValues?.startDate ?? '',
        }),
      );
    }
    return gatheringUpdateFormSchema;
  }, [isEditMode, isInProgressEdit, initialValues?.recruitDeadline, initialValues?.startDate]);

  const {
    register,
    handleSubmit,
    control,
    watch,
    trigger,
    formState: { errors, touchedFields, isDirty, isValid },
  } = useForm<GatheringForm>({
    // schema는 mode/status에 따라 create/RECRUITING/IN_PROGRESS 스키마 중 하나로 바뀌지만
    // 셋 다 GatheringForm 필드의 부분집합만 optional로 검증하므로 폼 타입과 안전하게 호환됨
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
  // edit 모드는 initialValues가 서버 응답으로 채워진 뒤 렌더링되므로, 여기서 한 번 trigger해
  // 사용자가 아무 필드도 건드리기 전부터 제출 버튼 상태가 실제 값과 일치하도록 만든다.
  useEffect(() => {
    if (isEditMode) trigger();
  }, [isEditMode, trigger]);

  const { mutate: createMutate, isPending: isCreatePending } = useCreateGathering();
  const { mutate: updateMutate, isPending: isUpdatePending } = useUpdateGathering(gatheringId ?? 0);
  const mutate = isEditMode ? updateMutate : createMutate;
  const isPending = isEditMode ? isUpdatePending : isCreatePending;

  // 단순 페이지 진입(헤더 호기심 클릭 등)은 page_view 자동 측정으로 잡히므로 제외.
  // isDirty 가 true 가 되는 순간 = 사용자가 어느 필드든 처음으로 값을 변경한 시점 =
  // 실제 "모임 만들기를 시작했다"는 의도. 그 시점에 1회 발사.
  const hasFiredStartRef = useRef(false);
  useEffect(() => {
    if (isEditMode || !isDirty || hasFiredStartRef.current) return;
    hasFiredStartRef.current = true;
    trackGatheringCreateStart();
  }, [isDirty, isEditMode]);

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
          if (!isEditMode) {
            const category = categories.find((c) => c.id === data.categoryIds[0])?.name ?? 'unknown';
            trackGatheringCreateSubmit({ category, memberCount: data.maxMembers });
          }
          showToast({ variant: 'success', title: isEditMode ? '모임이 수정되었습니다.' : '모임이 생성되었습니다.' });
          if (isEditMode && gatheringId) {
            router.push(`/gatherings/${gatheringId}`);
          } else {
            router.push('/main');
          }
        },
        onError: (error) => {
          if (!isEditMode) {
            const category = categories.find((c) => c.id === data.categoryIds[0])?.name ?? 'unknown';
            trackGatheringCreateFailed({ category, error });
          }
          showToast({
            variant: 'error',
            title: isEditMode ? '모임 수정에 실패했습니다.' : '모임 생성에 실패했습니다.',
          });
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-10 md:gap-14 lg:gap-20'>
      {/* 모임 유형 */}
      <section className='flex flex-col gap-3'>
        <p className='text-small-01-sb md:text-body-01-sb lg:text-h5-sb text-gray-800'>
          모임 유형 <RequiredMark isInProgressEdit={isInProgressEdit} fieldRequired />
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
        <p className='text-small-01-sb md:text-body-01-sb lg:text-h5-sb text-gray-800'>
          기본 정보 <RequiredMark isInProgressEdit={isInProgressEdit} fieldRequired />
        </p>
        <div className='flex flex-col gap-6 lg:flex-row lg:gap-4'>
          <div className='flex w-full flex-col gap-1 lg:flex-1'>
            <div className='relative'>
              <Input
                label={
                  <span className='text-small-02-m md:text-body-02-m lg:text-body-01-m text-gray-800'>모임 제목</span>
                }
                maxLength={30}
                placeholder='제목을 입력하세요'
                error={errors.title?.message}
                hideErrorMessage
                disabled={isInProgressEdit}
                {...register('title')}
                className={cn(
                  'text-small-02-r md:text-body-02-r lg:text-body-01-r bg-gray-0 pr-12 disabled:text-gray-400 lg:px-7 lg:py-5 lg:pr-20',
                  errors.title?.message ? 'h-[47px] md:h-[62px] lg:h-[76px]' : 'h-[43px] md:h-[58px] lg:h-[72px]',
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
                  <p className='text-small-02-m md:text-body-02-m lg:text-body-01-m text-gray-800'>카테고리</p>
                  <Dropdown className='flex w-full flex-col'>
                    <Dropdown.Trigger>
                      <CategoryTriggerBorder>
                        <div className='flex items-center gap-2'>
                          <CategoryIcon className='size-4 md:size-6 lg:size-7' />
                          {selected.length > 0 ? (
                            <div className='flex items-center gap-1'>
                              <span className='text-small-02-sb md:text-body-02-sb lg:text-body-01-sb text-gray-900'>
                                카테고리({selected.length})
                              </span>
                              <span className='text-small-02-m md:text-body-02-m lg:text-body-01-m text-gray-900'>
                                {selected.map((id) => categoryMeta[id]?.label).join(', ')}
                              </span>
                            </div>
                          ) : (
                            <span className='text-small-02-r md:text-body-02-r lg:text-body-01-r text-gray-400'>
                              카테고리를 선택해주세요
                            </span>
                          )}
                        </div>
                        <RotatingArrow />
                      </CategoryTriggerBorder>
                    </Dropdown.Trigger>
                    <Dropdown.Menu
                      containerClassName='w-full'
                      className='custom-scrollbar max-h-[240px] w-full overflow-y-auto rounded-lg border border-blue-100 bg-white p-2'
                    >
                      {categories.map((cat) => (
                        <Dropdown.Item
                          key={cat.id}
                          closeOnSelect={false}
                          disabled={selected.length >= MAX_CATEGORIES && !selected.includes(cat.id)}
                          onClick={() => toggleCategory(cat.id)}
                          className={cn(
                            'text-small-02-m md:text-body-02-m lg:text-body-01-m mb-[2px] flex cursor-pointer items-center justify-between rounded-lg px-4 py-3 text-gray-700 hover:bg-blue-100 hover:text-blue-400',
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
                <span className='text-small-02-m md:text-body-02-m lg:text-body-01-m text-gray-800'>한 줄 소개</span>
              }
              maxLength={50}
              placeholder='소개를 적어주세요'
              error={errors.shortDescription?.message}
              hideErrorMessage
              disabled={isInProgressEdit}
              {...register('shortDescription')}
              className='text-small-02-r md:text-body-02-r lg:text-body-01-r bg-gray-0 h-[43px] pr-12 disabled:text-gray-400 md:h-[58px] lg:h-[72px] lg:px-7 lg:py-5 lg:pr-20'
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

        {/* 상세 설명 */}
        <div className='flex flex-col gap-1'>
          <p className='text-small-02-m md:text-body-02-m lg:text-body-01-m flex items-center gap-1 text-gray-800'>
            상세 설명
            <span className='md:text-small-02-r lg:text-small-01-r text-[8px] font-normal text-gray-400'>(선택)</span>
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

        {/* 태그 */}
        <div className={cn('flex flex-col gap-1', isInProgressEdit && 'pointer-events-none opacity-60')}>
          <p className='text-small-02-m md:text-body-02-m lg:text-body-01-m flex items-center gap-1 text-gray-800'>
            태그 <RequiredMark isInProgressEdit={isInProgressEdit} fieldRequired />
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

        {/* 이미지 */}
        <div className='flex flex-col gap-1'>
          <p className='text-small-02-m md:text-body-02-m lg:text-body-01-m flex items-center gap-1 text-gray-800'>
            이미지
            <span className='md:text-small-02-r lg:text-small-01-r text-[8px] font-normal text-gray-400'>(선택)</span>
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

      {/* 모임 최종 목표 */}
      <div className='flex flex-col gap-1'>
        <div className='relative'>
          <Input
            label={
              <span className='text-small-01-sb md:text-body-01-sb lg:text-h5-sb text-gray-800'>
                모임 최종 목표 <RequiredMark isInProgressEdit={isInProgressEdit} fieldRequired />
              </span>
            }
            maxLength={200}
            placeholder='모임의 최종 목표를 적어주세요'
            error={errors.goal?.message}
            hideErrorMessage
            disabled={isInProgressEdit}
            {...register('goal')}
            className='text-small-02-r md:text-body-02-r lg:text-body-01-r bg-gray-0 h-[43px] pr-14 disabled:text-gray-400 md:h-[58px] lg:h-[72px] lg:px-7 lg:py-5 lg:pr-24'
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

      {/* 모집 정보 */}
      <section className='flex flex-col gap-4'>
        <p className='text-small-01-sb md:text-body-01-sb lg:text-h5-sb text-gray-800'>
          모집 정보 <RequiredMark isInProgressEdit={isInProgressEdit} fieldRequired />
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
              disabled={isInProgressEdit}
              {...register('maxMembers', { valueAsNumber: true })}
              className='text-small-02-r md:text-body-02-r lg:text-body-01-r bg-gray-0 h-[43px] disabled:text-gray-400 md:h-[58px] lg:h-[72px] lg:px-7 lg:py-5'
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
                  disabled={isInProgressEdit}
                  className='bg-gray-0 h-[43px] md:h-[58px] lg:h-[72px] lg:px-7 lg:py-5'
                />
              </div>
            )}
          />
        </div>
      </section>

      {/* 모임 일정 */}
      <section className='flex flex-col gap-4'>
        <p className='text-small-01-sb md:text-body-01-sb lg:text-h5-sb text-gray-800'>
          모임 일정 <span className='text-blue-400'>*</span>
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
                  disabled={isInProgressEdit}
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

        <WeeklyPlanForm control={control} register={register} errors={errors} totalWeeks={totalWeeks} />
      </section>

      <Button
        type='submit'
        variant='action'
        size='action-sm'
        disabled={isPending || !isValid}
        className='text-small-01-sb md:text-body-01-sb lg:text-h5-b h-12 w-[164px] self-end md:h-[72px] md:w-75 lg:h-20'
      >
        {isEditMode ? '수정 완료' : '작성 완료'}
      </Button>
    </form>
  );
}
