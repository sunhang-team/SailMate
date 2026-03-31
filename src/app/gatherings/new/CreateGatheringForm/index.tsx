'use client';

import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/Button';
import { Dropdown } from '@/components/ui/Dropdown';
import { CheckIcon } from '@/components/ui/Icon/CheckIcon';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { useToastStore } from '@/components/ui/Toast/useToastStore';
import { useCreateGathering } from '@/api/gatherings/queries';
import { gatheringFormSchema } from '@/api/gatherings/schemas';
import { GATHERING_CATEGORIES, GATHERING_TYPES } from '@/constants/gathering';
import { cn } from '@/lib/cn';

import type { GatheringForm } from '@/api/gatherings/types';

export function CreateGatheringForm() {
  const router = useRouter();
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

  const titleValue = watch('title') ?? '';
  const shortDescValue = watch('shortDescription') ?? '';
  const descValue = watch('description') ?? '';
  const goalValue = watch('goal') ?? '';

  const onSubmit = (data: GatheringForm) => {
    mutate(data, {
      onSuccess: (response) => {
        showToast({ variant: 'success', title: '모임이 생성되었습니다.' });
        router.push(`/gatherings/${response.gathering.id}`);
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
        <p className='text-sm font-bold text-gray-900'>
          모임 유형 <span className='text-blue-400'>*</span>
        </p>
        <Controller
          name='type'
          control={control}
          render={({ field }) => (
            <div className='flex gap-4'>
              {GATHERING_TYPES.map((type) => {
                const isSelected = field.value === type;
                return (
                  <button
                    key={type}
                    type='button'
                    onClick={() => field.onChange(type)}
                    className={cn(
                      'flex items-center gap-2 rounded-xl border px-6 py-4 text-sm font-semibold transition-colors',
                      isSelected
                        ? 'border-blue-400 text-blue-400'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300',
                    )}
                  >
                    {isSelected && <CheckIcon size={20} />}
                    {type}
                  </button>
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
        <p className='text-sm font-bold text-gray-900'>
          기본 정보 <span className='text-blue-400'>*</span>
        </p>
        <div className='flex flex-col gap-1'>
          <Input
            label={<>모임 제목</>}
            maxLength={30}
            placeholder='제목을 입력하세요'
            error={errors.title?.message}
            {...register('title')}
          />
          <p className='self-end text-xs text-gray-400'>{titleValue.length}/30</p>
        </div>
        <Controller
          name='category'
          control={control}
          render={({ field }) => (
            <div className='flex flex-col gap-1.5'>
              <p className='text-sm font-bold text-gray-900'>
                카테고리 <span className='text-blue-400'>*</span>
              </p>
              <Dropdown className='w-full **:[[role=listbox]]:w-full *:[button]:w-full'>
                <Dropdown.Trigger>
                  <div className='flex items-center justify-between rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm'>
                    <span className={cn(field.value ? 'text-gray-900' : 'text-gray-400')}>
                      {field.value ?? '카테고리를 선택해 주세요'}
                    </span>
                  </div>
                </Dropdown.Trigger>
                <Dropdown.Menu className='w-full p-2'>
                  {GATHERING_CATEGORIES.map((cat) => (
                    <Dropdown.Item
                      key={cat}
                      onClick={() => field.onChange(cat)}
                      className={cn(
                        'cursor-pointer rounded-lg px-4 py-3 text-sm hover:bg-blue-100 hover:text-blue-400',
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
      </section>

      {/* 한 줄 소개 */}
      <div className='flex flex-col gap-1'>
        <p className='text-sm font-bold text-gray-900'>한 줄 소개</p>
        <Textarea
          maxLength={50}
          placeholder='소개를 적어주세요'
          error={errors.shortDescription?.message}
          {...register('shortDescription')}
        />
        <p className='self-end text-xs text-gray-400'>{shortDescValue.length}/50</p>
      </div>

      {/* 상세 설명 */}
      <div className='flex flex-col gap-1'>
        <p className='text-sm font-bold text-gray-900'>상세 설명</p>
        <Textarea
          maxLength={1000}
          rows={8}
          placeholder='모임을 설명을 상세히 적어주세요'
          error={errors.description?.message}
          {...register('description')}
        />
        <p className='self-end text-xs text-gray-400'>{descValue.length}/1000</p>
      </div>

      {/* 모임 최종 목표 */}
      <div className='flex flex-col gap-1'>
        <Input
          label={
            <>
              모임 최종 목표 <span className='text-blue-400'>*</span>
            </>
          }
          maxLength={200}
          placeholder='모임의 최종 목표를 적어주세요'
          error={errors.goal?.message}
          {...register('goal')}
        />
        <p className='self-end text-xs text-gray-400'>{goalValue.length}/200</p>
      </div>

      {/* 태그 — 후속 이슈 (SM-95~97) */}
      <div />

      {/* 이미지 — 후속 이슈 (SM-95~97) */}
      <div />

      {/* 날짜/일정 — 후속 이슈 (SM-95~97) */}
      <div />

      <Button type='submit' variant='action' size='action' disabled={isPending} className='w-full'>
        작성 완료
      </Button>
    </form>
  );
}
