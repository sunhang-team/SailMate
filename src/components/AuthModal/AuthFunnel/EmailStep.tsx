import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useCheckEmail } from '@/api/auth/queries';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { SocialLoginButtons } from '@/app/(auth)/components/SocialLoginButtons';
import { AuthDivider } from '@/app/(auth)/components/AuthDivider';

const emailSchema = z.object({
  email: z.string().min(1, '이메일은 필수 입력입니다.').pipe(z.email('이메일 형식으로 작성해 주세요.')),
});
type EmailForm = z.infer<typeof emailSchema>;

export function EmailStep({ onResolved }: { onResolved: (email: string, isAvailable: boolean) => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<EmailForm>({
    resolver: zodResolver(emailSchema),
    mode: 'onChange',
  });

  const checkEmailMutation = useCheckEmail();

  const onSubmit = (data: EmailForm) => {
    checkEmailMutation.mutate(data.email, {
      onSuccess: (res) => {
        onResolved(data.email, res.available);
      },
    });
  };

  return (
    <div className='flex flex-col gap-5.5'>
      <div className='flex flex-col gap-2'>
        <h2 className='text-h4-b text-center text-gray-900'>로그인 / 회원가입</h2>
      </div>

      <SocialLoginButtons kakaoLabel='카카오로 시작하기' googleLabel='구글로 시작하기' />

      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6'>
        <Input
          label={
            <>
              이메일 <span className='ml-1 text-blue-400'>*</span>
            </>
          }
          placeholder='가입 여부에 따라 로그인/회원가입이 진행됩니다.'
          type='email'
          error={errors.email?.message}
          {...register('email')}
          className='h-11'
        />
        <Button
          variant='primary'
          size='join-login'
          type='submit'
          disabled={!isValid || checkEmailMutation.isPending}
          className='w-full'
        >
          {checkEmailMutation.isPending ? '확인 중...' : '다음'}
        </Button>
      </form>
    </div>
  );
}
