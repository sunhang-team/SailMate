'use client';

import { type ReactNode, useMemo } from 'react';
import { differenceInWeeks, isValid, parseISO } from 'date-fns';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { DatePicker } from '@/components/ui/DatePicker';
import { Dropdown } from '@/components/ui/Dropdown';
import { CheckIcon } from '@/components/ui/Icon/CheckIcon';
import { StudyIcon, ProjectIcon, CategoryIcon, ArrowIcon } from '@/components/ui/Icon';
import { useDropdown } from '@/components/ui/Dropdown/context';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { useToastStore } from '@/components/ui/Toast/useToastStore';
import { useCreateGathering } from '@/api/gatherings/queries';
import { gatheringFormSchema } from '@/api/gatherings/schemas';
import { DEFAULT_CATEGORIES, GATHERING_TYPES } from '@/constants/gathering';
import { cn } from '@/lib/cn';

import { ImageUpload } from './ImageUpload';
import { TagInput } from './TagInput';
import { WeeklyPlanForm } from './WeeklyPlanForm';

import type { GatheringForm } from '@/api/gatherings/types';

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
        'flex w-full cursor-pointer items-center justify-between rounded-lg bg-white px-4 py-3 transition-colors duration-200',
        isOpen ? 'border-gradient-primary' : 'border border-gray-200',
      )}
    >
      {children}
    </div>
  );
};

const TYPE_META = {
  스터디: { label: '스터디', subtitle: '함께 학습하고 성장해요', Icon: StudyIcon },
  프로젝트: { label: '프로젝트', subtitle: '함께 만들고 완성해요', Icon: ProjectIcon },
} as const;

const CATEGORY_META = Object.fromEntries(DEFAULT_CATEGORIES.map((c) => [c.id, { label: c.name }])) as Record<
  number,
  { label: string }
>;

export function CreateGatheringForm() {
  const showToast = useToastStore((state) => state.showToast);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<GatheringForm>({
    resolver: zodResolver(gatheringFormSchema),
    mode: 'onBlur',
    defaultValues: {
      tags: [],
      weeklyGuides: [],
    },
  });

  const { mutate, isPending } = useCreateGathering();

  const typeValue = watch('type');
  const categoryIdsValue = watch('categoryIds') ?? [];
  const titleValue = watch('title') ?? '';
  const shortDescValue = watch('shortDescription') ?? '';
  const descValue = watch('description') ?? '';
  const goalValue = watch('goal') ?? '';
  const tagsValue = watch('tags') ?? [];
  const maxMembersValue = watch('maxMembers');
  const recruitDeadlineValue = watch('recruitDeadline');
  const startDateValue = watch('startDate');
  const endDateValue = watch('endDate');
  const weeklyGuidesValue = watch('weeklyGuides') ?? [];

  const totalWeeks = useMemo(() => {
    if (!startDateValue || !endDateValue) return 0;

    const startDate = parseISO(startDateValue);
    const endDate = parseISO(endDateValue);
    const isDateRangeInvalid = !isValid(startDate) || !isValid(endDate);
    if (isDateRangeInvalid) return 0;

    return Math.max(1, differenceInWeeks(endDate, startDate));
  }, [endDateValue, startDateValue]);

  const isWeeklyGuidesComplete =
    weeklyGuidesValue.length > 0 &&
    weeklyGuidesValue.every((guide) => Boolean(guide?.title?.trim()) && Boolean(guide?.content?.trim()));

  const isFormComplete =
    !!typeValue &&
    categoryIdsValue.length > 0 &&
    !!titleValue &&
    !!shortDescValue &&
    !!descValue &&
    !!goalValue &&
    tagsValue.length > 0 &&
    typeof maxMembersValue === 'number' &&
    maxMembersValue >= 2 &&
    maxMembersValue <= 20 &&
    !!recruitDeadlineValue &&
    !!startDateValue &&
    !!endDateValue &&
    isWeeklyGuidesComplete;

  const onSubmit = (data: GatheringForm) => {
    mutate(data, {
      onSuccess: () => {
        showToast({ variant: 'success', title: '모임이 생성되었습니다.' });
        // 리다이렉트
      },
      onError: () => {
        showToast({ variant: 'error', title: '모임 생성에 실패했습니다.' });
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-8'>
      {/* 모임 유형 */}
      <section className='flex flex-col gap-3'>
        <p className='text-small-01-sb md:text-body-01-sb lg:text-h5-b text-gray-800'>
          모임 유형 <span className='text-blue-400'>*</span>
        </p>
        <Controller
          name='type'
          control={control}
          render={({ field }) => (
            <div className='flex flex-col gap-4 md:flex-row'>
              {GATHERING_TYPES.map((type) => {
                const isSelected = field.value === type;
                const { label, subtitle, Icon } = TYPE_META[type];
                return (
                  <Card
                    key={type}
                    className={cn(
                      'flex h-40 cursor-pointer items-center gap-6 rounded-lg px-8 shadow-none',
                      'h-[85px]',
                      'md:h-40 md:w-auto md:flex-1 md:gap-6 md:px-8',
                      isSelected ? 'border-focus-100 bg-blue-50' : 'border-gray-300 bg-gray-100',
                    )}
                    onClick={() => field.onChange(type)}
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
      <section className='flex flex-col gap-4'>
        <p className='text-small-01-sb md:text-body-01-sb lg:text-h5-b text-gray-800'>
          기본 정보 <span className='text-blue-400'>*</span>
        </p>
        <div className='flex flex-col gap-4 lg:flex-row'>
          <div className='flex w-full flex-col gap-1 lg:flex-1'>
            <Input
              label={
                <span className='text-small-02-m md:text-body-02-m lg:text-body-01-m text-gray-800'>모임 제목</span>
              }
              maxLength={30}
              placeholder='제목을 입력하세요'
              error={errors.title?.message}
              {...register('title')}
              className='text-small-02-r md:text-body-02-r lg:text-body-01-r'
            />
            <p className='text-small-02-r self-end text-gray-400'>{titleValue.length}/30</p>
          </div>
          <Controller
            name='categoryIds'
            control={control}
            render={({ field }) => {
              const selected = field.value ?? [];
              const selectedLabel =
                selected.length > 0 ? selected.map((id) => CATEGORY_META[id]?.label).join(', ') : null;

              const toggleCategory = (id: number) => {
                const next = selected.includes(id) ? selected.filter((v) => v !== id) : [...selected, id];
                field.onChange(next);
              };

              return (
                <div className='flex w-full flex-col gap-1.5 lg:flex-1'>
                  <p className='text-small-02-m md:text-body-02-m lg:text-body-01-m text-gray-800'>카테고리</p>
                  <Dropdown className='flex w-full flex-col'>
                    <Dropdown.Trigger>
                      <CategoryTriggerBorder>
                        <div className='flex items-center gap-2'>
                          <CategoryIcon className='size-4 md:size-6 lg:size-7' />
                          <span
                            className={cn(
                              'text-small-02-r md:text-body-02-r lg:text-body-01-r',
                              selectedLabel ? 'text-gray-900' : 'text-gray-400',
                            )}
                          >
                            {selectedLabel ?? '카테고리를 선택해주세요'}
                          </span>
                        </div>
                        <RotatingArrow />
                      </CategoryTriggerBorder>
                    </Dropdown.Trigger>
                    <Dropdown.Menu
                      containerClassName='w-full'
                      className='custom-scrollbar max-h-[240px] w-full overflow-y-auto rounded-lg border border-blue-100 bg-white p-2'
                    >
                      {DEFAULT_CATEGORIES.map((cat) => (
                        <Dropdown.Item
                          key={cat.id}
                          onClick={() => toggleCategory(cat.id)}
                          className={cn(
                            'cursor-pointer rounded-lg px-4 py-3 hover:bg-blue-100 hover:text-blue-400',
                            selected.includes(cat.id) && 'bg-blue-100 text-blue-400',
                          )}
                        >
                          {cat.name}
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
      </section>

      {/* 한 줄 소개 */}
      <div className='flex flex-col gap-1'>
        <div className='flex flex-1 flex-col gap-1'>
          <Input
            label={
              <span className='text-small-02-m md:text-body-02-m lg:text-body-01-m text-gray-800'>한 줄 소개</span>
            }
            maxLength={50}
            placeholder='소개를 적어주세요'
            error={errors.shortDescription?.message}
            {...register('shortDescription')}
            className='text-small-02-r md:text-body-02-r lg:text-body-01-r'
          />
          <p className='text-small-02-r self-end text-gray-400'>{shortDescValue.length}/50</p>
        </div>
      </div>

      {/* 상세 설명 */}
      <div className='flex flex-col gap-1'>
        <p className='text-small-02-m md:text-body-02-m lg:text-body-01-m text-gray-800'>상세 설명</p>
        <Textarea
          maxLength={1000}
          rows={8}
          placeholder='모임을 설명을 상세히 적어주세요'
          error={errors.description?.message}
          {...register('description')}
          className='text-small-02-r md:text-body-02-r lg:text-body-01-r px-4 py-3'
        />
        <p className='text-small-02-r self-end text-gray-400'>{descValue.length}/1000</p>
      </div>

      {/* 태그 */}
      <div className='flex flex-col gap-1'>
        <p className='text-small-02-m md:text-body-02-m lg:text-body-01-m text-gray-800'>태그</p>
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
        <p className='text-small-02-m md:text-body-02-m lg:text-body-01-m text-gray-800'>이미지</p>
        <Controller
          name='images'
          control={control}
          render={({ field }) => (
            <ImageUpload value={field.value ?? []} onChange={field.onChange} error={errors.images?.message} />
          )}
        />
      </div>

      {/* 모임 최종 목표 */}
      <div className='flex flex-col gap-1'>
        <Input
          label={
            <span className='text-small-01-sb md:text-body-01-sb lg:text-h5-b text-gray-800'>
              모임 최종 목표 <span className='text-blue-400'>*</span>
            </span>
          }
          maxLength={200}
          placeholder='모임의 최종 목표를 적어주세요'
          error={errors.goal?.message}
          {...register('goal')}
          className='text-small-02-r md:text-body-02-r lg:text-body-01-r'
        />
        <p className='text-small-02-r self-end text-gray-400'>{goalValue.length}/200</p>
      </div>

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
              max={20}
              label={
                <span className='text-small-02-m md:text-body-02-m lg:text-body-01-m text-gray-800'>모집 인원</span>
              }
              placeholder='모집 인원을 적어주세요'
              error={errors.maxMembers?.message}
              {...register('maxMembers', { valueAsNumber: true })}
              className='text-small-02-r md:text-body-02-r lg:text-body-01-r'
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
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  placeholder='모집 마감 일정을 선택해주세요'
                  error={errors.recruitDeadline?.message}
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
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  placeholder='모임 시작일을 선택해주세요'
                  error={errors.startDate?.message}
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
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  placeholder='모임 종료일을 선택해주세요'
                  error={errors.endDate?.message}
                />
              </div>
            )}
          />
        </div>

        <div className='mt-8 flex h-12 items-center justify-between rounded-lg bg-gray-100 px-7 py-5'>
          <p className='text-small-01-sb md:text-body-02-sb text-gray-800'>모임 기간</p>
          <p className='text-small-01-sb md:text-body-02-sb text-gray-800'>
            <span className='text-blue-400'>{totalWeeks}</span> 주
          </p>
        </div>

        <WeeklyPlanForm control={control} register={register} errors={errors} totalWeeks={totalWeeks} />
      </section>

      <Button
        type='submit'
        variant='action'
        size='action-sm'
        disabled={isPending || !isFormComplete}
        className='text-small-01-sb md:text-body-01-sb lg:text-h5-b h-12 w-[164px] self-end md:h-[72px] md:w-75 lg:h-20'
      >
        작성 완료
      </Button>
    </form>
  );
}
