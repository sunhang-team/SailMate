'use client';

import { type ReactNode, useMemo } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Controller, useFormContext } from 'react-hook-form';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Dropdown } from '@/components/ui/Dropdown';
import { useDropdown } from '@/components/ui/Dropdown/context';
import { CheckIcon } from '@/components/ui/Icon/CheckIcon';
import { StudyIcon, ProjectIcon, CategoryIcon, ArrowIcon, CloseIcon } from '@/components/ui/Icon';
import { Input } from '@/components/ui/Input';
import { gatheringQueries } from '@/api/gatherings/queries';
import { GATHERING_TYPES } from '@/constants/gathering';
import { cn } from '@/lib/cn';

import { TagInput } from '../../CreateGatheringForm/TagInput';
import { BASIC_STEP_FIELDS } from '../steps';

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
        'flex h-[47px] w-full cursor-pointer items-center justify-between rounded-lg bg-white px-4 py-3 transition-colors duration-200 md:h-[62px] lg:h-[76px] lg:px-7 lg:py-5',
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

const MAX_CATEGORIES = 3;

interface BasicInfoStepProps {
  onNext: () => void;
}

export function BasicInfoStep({ onNext }: BasicInfoStepProps) {
  const { data: categoriesData } = useSuspenseQuery(gatheringQueries.categories());
  const categories = categoriesData.categories;
  const categoryMeta = useMemo(
    () => Object.fromEntries(categories.map((c) => [c.id, { label: c.name }])) as Record<number, { label: string }>,
    [categories],
  );

  const {
    register,
    control,
    watch,
    trigger,
    formState: { errors },
  } = useFormContext<GatheringForm>();

  const titleValue = watch('title') ?? '';
  const shortDescValue = watch('shortDescription') ?? '';
  const goalValue = watch('goal') ?? '';

  const handleNext = async () => {
    const isValid = await trigger(BASIC_STEP_FIELDS);
    if (isValid) onNext();
  };

  return (
    <div className='flex flex-col gap-10 md:gap-14 lg:gap-20'>
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
                      'flex h-40 cursor-pointer items-center gap-6 rounded-lg px-8 shadow-none hover:shadow-none',
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
                        {label}
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
        <p className='text-small-01-sb md:text-body-01-sb lg:text-h5-b text-gray-800'>
          기본 정보 <span className='text-blue-400'>*</span>
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
                {...register('title')}
                className={cn(
                  'text-small-02-r md:text-body-02-r lg:text-body-01-r bg-gray-0 pr-12 lg:px-7 lg:py-5 lg:pr-20',
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

              const toggleCategory = (id: number) => {
                if (selected.includes(id)) {
                  field.onChange(selected.filter((v) => v !== id));
                  return;
                }
                if (selected.length >= MAX_CATEGORIES) return;
                field.onChange([...selected, id]);
              };

              return (
                <div className='flex w-full flex-col gap-1.5 lg:flex-1'>
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
              {...register('shortDescription')}
              className='text-small-02-r md:text-body-02-r lg:text-body-01-r bg-gray-0 h-[43px] pr-12 md:h-[58px] lg:h-[72px] lg:px-7 lg:py-5 lg:pr-20'
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
                <span className='text-small-02-m md:text-body-02-m lg:text-body-01-m text-gray-800'>
                  모임 최종 목표
                </span>
              }
              maxLength={200}
              placeholder='모임의 최종 목표를 적어주세요'
              error={errors.goal?.message}
              hideErrorMessage
              {...register('goal')}
              className='text-small-02-r md:text-body-02-r lg:text-body-01-r bg-gray-0 h-[43px] pr-14 md:h-[58px] lg:h-[72px] lg:px-7 lg:py-5 lg:pr-24'
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
        <div className='flex flex-col gap-1'>
          <p className='text-small-02-m md:text-body-02-m lg:text-body-01-m flex items-center gap-1 text-gray-800'>
            태그
            <span className='md:text-small-02-r lg:text-small-01-r text-[8px] font-normal text-gray-400'>(선택)</span>
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

      <div className='flex justify-between gap-3'>
        <Button
          type='button'
          variant='social'
          size={undefined}
          className='h-12 w-[164px] text-gray-800 md:h-[72px] md:w-75 lg:h-20'
        >
          임시 저장
        </Button>
        <Button
          type='button'
          variant='action'
          size='action-sm'
          onClick={handleNext}
          className='text-small-01-sb md:text-body-01-sb lg:text-h5-b h-12 w-[164px] md:h-[72px] md:w-75 lg:h-20'
        >
          다음 단계
        </Button>
      </div>
    </div>
  );
}
