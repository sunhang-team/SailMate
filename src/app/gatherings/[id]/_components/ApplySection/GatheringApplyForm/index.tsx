'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { applyGatheringFormSchema } from '@/api/applications/schemas';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { CheckIcon } from '@/components/ui/Icon';
import { cn } from '@/lib/cn';

const formSchema = applyGatheringFormSchema.extend({
  agreement: z.boolean().refine((val) => val === true, {
    message: '내용을 확인했으며 제공에 동의해야 합니다.',
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface GatheringApplyFormProps {
  gatheringTitle: string;
  onSubmit: (values: z.infer<typeof applyGatheringFormSchema>) => void;
  isLoading?: boolean;
}

export function GatheringApplyForm({ gatheringTitle, onSubmit, isLoading }: GatheringApplyFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      personalGoal: '',
      selfIntroduction: '',
      agreement: false,
    },
  });

  const personalGoal = watch('personalGoal');
  const selfIntroduction = watch('selfIntroduction');
  const agreement = watch('agreement');

  const handleFormSubmit = (data: FormValues) => {
    const { agreement, ...submitData } = data;
    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className='flex flex-col gap-6'>
      <div className='flex flex-col gap-2'>
        <h2 className='text-h3-b text-gray-900'>모임 신청</h2>
        <p className='text-body-02-m text-gray-600'>
          신청 모임 <span className='mx-2 text-gray-600'>|</span>{' '}
          <span className='text-body-02-sb text-gray-900'>{gatheringTitle}</span>
        </p>
      </div>

      <div className='flex flex-col gap-4'>
        <div className='relative flex flex-col gap-2'>
          <div className='flex justify-between'>
            <label className='text-body-02-m text-gray-800'>
              나의 목표 <span className='text-blue-400'>*</span>
            </label>
          </div>
          <Textarea
            {...register('personalGoal')}
            placeholder='이 모임에서 달성할 목표를 적어주세요. (최소 5자, 최대 200자)'
            className='min-h-[160px]'
            error={errors.personalGoal?.message}
          />
          <span className='text-small-01-r absolute right-4 bottom-1 text-gray-400'>{personalGoal.length}/200</span>
        </div>

        <div className='relative flex flex-col gap-2'>
          <label className='text-body-02-m text-gray-800'>한 줄 소개</label>
          <Textarea
            {...register('selfIntroduction')}
            placeholder='(선택) 모임장에게 한마디를 적어주세요.'
            className='min-h-[120px]'
            error={errors.selfIntroduction?.message}
          />
          <span className='text-small-01-r absolute right-4 bottom-1 text-gray-400'>
            {selfIntroduction?.length}/100
          </span>
        </div>
      </div>

      <div className='flex flex-col gap-2'>
        <p className='text-body-02-m text-gray-800'>팀 구성을 위해 닉네임과 평판 점수가 모임장에게 전달됩니다.</p>
        <label className='flex cursor-pointer items-center gap-2'>
          <input type='checkbox' {...register('agreement')} className='peer sr-only' />
          <CheckIcon className={cn('size-5 transition-colors', agreement ? 'text-blue-300' : 'text-gray-500')} />
          <span className={cn('text-small-01-r transition-colors', agreement ? 'text-blue-300' : 'text-gray-500')}>
            내용을 확인했으며 제공에 동의합니다.
          </span>
        </label>
      </div>

      <Button type='submit' variant='action' className='w-full' disabled={!isValid || isLoading}>
        {isLoading ? '신청 중...' : '작성 완료'}
      </Button>
    </form>
  );
}
