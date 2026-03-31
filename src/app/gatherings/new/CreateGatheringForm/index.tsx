'use client';

import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Dropdown } from '@/components/ui/Dropdown';
import { CheckIcon } from '@/components/ui/Icon/CheckIcon';
import { StudyIcon, ProjectIcon, CategoryIcon, ArrowIcon } from '@/components/ui/Icon';
import { useDropdown } from '@/components/ui/Dropdown/context';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { useToastStore } from '@/components/ui/Toast/useToastStore';
import { useCreateGathering } from '@/api/gatherings/queries';
import { gatheringFormSchema } from '@/api/gatherings/schemas';
import { GATHERING_CATEGORIES, GATHERING_TYPES } from '@/constants/gathering';
import { cn } from '@/lib/cn';

import type { GatheringForm } from '@/api/gatherings/types';

const RotatingArrow = () => {
  const { isOpen } = useDropdown();
  return <ArrowIcon className={cn('rotate-90 transition-transform duration-200', isOpen ? '-rotate-90' : '')} />;
};

const TYPE_META = {
  스터디: { subtitle: '함께 학습하고 성장해요', Icon: StudyIcon },
  프로젝트: { subtitle: '함께 만들고 완성해요', Icon: ProjectIcon },
} as const;

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
  });

  const { mutate, isPending } = useCreateGathering();

  const typeValue = watch('type');
  const categoryValue = watch('category');
  const titleValue = watch('title') ?? '';
  const shortDescValue = watch('shortDescription') ?? '';
  const descValue = watch('description') ?? '';
  const goalValue = watch('goal') ?? '';

  const isFormComplete =
    !!typeValue && !!categoryValue && !!titleValue && !!shortDescValue && !!descValue && !!goalValue;

  const onSubmit = (data: GatheringForm) => {
    mutate(data, {
      onSuccess: () => {
        showToast({ variant: 'success', title: '모임이 생성되었습니다.' });
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
        <p className='text-h5-b text-gray-800'>
          모임 유형 <span className='text-blue-400'>*</span>
        </p>
        <Controller
          name='type'
          control={control}
          render={({ field }) => (
            <div className='flex gap-4'>
              {GATHERING_TYPES.map((type) => {
                const isSelected = field.value === type;
                const { subtitle, Icon } = TYPE_META[type];
                return (
                  <Card
                    key={type}
                    className={cn(
                      'flex h-40 flex-1 cursor-pointer items-center gap-6 rounded-lg px-8 shadow-none',
                      isSelected ? 'border-focus-100 bg-blue-50' : 'border-gray-300 bg-gray-100',
                    )}
                    onClick={() => field.onChange(type)}
                  >
                    <CheckIcon size={56} className={isSelected ? 'text-blue-300' : 'text-gray-300'} />
                    <div className='flex flex-1 flex-col gap-1'>
                      <span className={cn('text-h4-b', isSelected ? 'text-blue-300' : 'text-gray-600')}>{type}</span>
                      <span className={cn('text-body-01-r', isSelected ? 'text-blue-300' : 'text-gray-300')}>
                        {subtitle}
                      </span>
                    </div>
                    {isSelected && <Icon size={56} className='text-blue-300' />}
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
        <p className='text-h5-b text-gray-800'>
          기본 정보 <span className='text-blue-400'>*</span>
        </p>
        <div className='flex gap-4'>
          <div className='flex flex-1 flex-col gap-1'>
            <Input
              label={<span className='text-body-01-m text-gray-800'>모임 제목</span>}
              maxLength={30}
              placeholder='제목을 입력하세요'
              error={errors.title?.message}
              {...register('title')}
              className='text-body-01-r'
            />
            <p className='text-small-02-r self-end text-gray-400'>{titleValue.length}/30</p>
          </div>
          <Controller
            name='category'
            control={control}
            render={({ field }) => (
              <div className='flex flex-1 flex-col gap-1.5'>
                <p className='text-body-01-m text-gray-800'>카테고리</p>
                <Dropdown className='flex w-full flex-col'>
                  <Dropdown.Trigger>
                    <div
                      className={cn(
                        'flex w-full cursor-pointer items-center justify-between rounded-lg bg-white px-4 py-3',
                        field.value ? 'border-gradient-primary' : 'border border-gray-200',
                      )}
                    >
                      <div className='flex items-center gap-2'>
                        <CategoryIcon size={28} />
                        <span className={cn('text-body-01-r', field.value ? 'text-gray-900' : 'text-gray-400')}>
                          {field.value ?? '카테고리를 선택해주세요'}
                        </span>
                      </div>
                      <RotatingArrow />
                    </div>
                  </Dropdown.Trigger>
                  <Dropdown.Menu
                    containerClassName='w-full'
                    className='custom-scrollbar max-h-[240px] w-full overflow-y-auto rounded-lg border border-blue-100 bg-white p-2'
                  >
                    {GATHERING_CATEGORIES.map((cat) => (
                      <Dropdown.Item
                        key={cat}
                        onClick={() => field.onChange(cat)}
                        className={cn(
                          'cursor-pointer rounded-lg px-4 py-3 hover:bg-blue-100 hover:text-blue-400',
                          field.value === cat && 'bg-blue-100 text-blue-400',
                        )}
                      >
                        {cat}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
                {errors.category && (
                  <p className='text-xs text-red-200' role='alert'>
                    {errors.category.message}
                  </p>
                )}
              </div>
            )}
          />
        </div>
      </section>

      {/* 한 줄 소개 */}
      <div className='flex flex-col gap-1'>
        <div className='flex flex-1 flex-col gap-1'>
          <Input
            label={<span className='text-body-01-m text-gray-800'>한 줄 소개</span>}
            maxLength={50}
            placeholder='소개를 적어주세요'
            error={errors.shortDescription?.message}
            {...register('shortDescription')}
            className='text-body-01-r'
          />
          <p className='text-small-02-r self-end text-gray-400'>{shortDescValue.length}/50</p>
        </div>
      </div>

      {/* 상세 설명 */}
      <div className='flex flex-col gap-1'>
        <p className='text-body-01-m text-gray-800'>상세 설명</p>
        <Textarea
          maxLength={1000}
          rows={8}
          placeholder='모임을 설명을 상세히 적어주세요'
          error={errors.description?.message}
          {...register('description')}
          className='text-body-01-r'
        />
        <p className='text-small-02-r self-end text-gray-400'>{descValue.length}/1000</p>
      </div>

      {/* 모임 최종 목표 */}
      <div className='flex flex-col gap-1'>
        <Input
          label={
            <span className='text-h5-b text-gray-800'>
              모임 최종 목표 <span className='text-blue-400'>*</span>
            </span>
          }
          maxLength={200}
          placeholder='모임의 최종 목표를 적어주세요'
          error={errors.goal?.message}
          {...register('goal')}
          className='text-body-01-r'
        />
        <p className='text-small-02-r self-end text-gray-400'>{goalValue.length}/200</p>
      </div>

      {/* 태그 */}
      <div />

      {/* 이미지 */}
      <div />

      {/* 날짜/일정 */}
      <div />

      <Button
        type='submit'
        variant='action'
        size='action-sm'
        disabled={isPending || !isFormComplete}
        className='self-end'
      >
        작성 완료
      </Button>
    </form>
  );
}
