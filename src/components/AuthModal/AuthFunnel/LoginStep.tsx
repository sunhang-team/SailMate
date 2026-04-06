import { useState } from 'react';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { VisibilityIcon } from '@/components/ui/Icon';
import { useLogin } from '@/api/auth/queries';
import { loginFormSchema } from '@/api/auth/schemas';

import type { LoginForm } from '@/api/auth/types';

export function LoginStep({ email, onSuccess, onBack }: { email: string; onSuccess: () => void; onBack: () => void }) {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginFormSchema),
    mode: 'onChange',
    defaultValues: { email },
  });

  const { mutate: loginMutate, isPending } = useLogin({
    onSuccess,
    onError: () => setError('root', { message: '이메일 또는 비밀번호가 올바르지 않습니다.' }),
  });

  const onSubmit = (data: LoginForm) => loginMutate(data);

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex flex-col gap-2'>
        <h2 className='text-h4-b text-center text-gray-900'>비밀번호 입력</h2>
        <p className='text-body-02-r text-center text-gray-600'>{email} 계정으로 로그인합니다.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-8'>
        <div className='relative'>
          <Input
            label={
              <>
                비밀번호 <span className='ml-1 text-blue-400'>*</span>
              </>
            }
            placeholder='영문, 숫자, 특수문자 포함 8자 이상 입력해주세요'
            type={showPassword ? 'text' : 'password'}
            error={errors.password?.message}
            {...register('password')}
            className='h-11'
          />
          <button
            type='button'
            className='absolute top-9 right-3 cursor-pointer text-gray-400'
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
          >
            <VisibilityIcon variant={showPassword ? 'on' : 'off'} size={20} />
          </button>
        </div>

        {errors.root && <p className='text-small-02-r text-center text-red-200'>{errors.root.message}</p>}

        <div className='flex flex-col gap-3'>
          <Button variant='primary' size='join-login' type='submit' disabled={!isValid || isPending} className='w-full'>
            로그인
          </Button>
          <Button type='button' variant='login-outline' onClick={onBack} className='h-14 w-full'>
            뒤로가기
          </Button>
        </div>
      </form>
    </div>
  );
}
