'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { VisibilityIcon } from '@/components/ui/Icon';
import { useLogin } from '@/api/auth/queries';
import { loginFormSchema } from '@/api/auth/schemas';

import type { LoginForm as LoginFormValues } from '@/api/auth/types';

export function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    mode: 'onBlur',
  });

  const { mutate: loginMutate, isPending } = useLogin({
    onSuccess: () => router.push('/'),
    onError: () => setError('root', { message: '이메일 또는 비밀번호가 올바르지 않습니다.' }),
  });

  const onSubmit = (data: LoginFormValues) => loginMutate(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6'>
      <div className='mt-2'>
        <Input
          label={
            <>
              이메일 <span className='text-blue-400'>*</span>
            </>
          }
          type='email'
          placeholder='이메일을 입력해주세요'
          error={errors.email?.message}
          {...register('email')}
        />
      </div>
      <div className='relative'>
        <Input
          label={
            <>
              비밀번호 <span className='text-blue-400'>*</span>
            </>
          }
          type={showPassword ? 'text' : 'password'}
          placeholder='영문, 숫자, 특수문자 포함 8자 이상 입력해주세요'
          error={errors.password?.message}
          {...register('password')}
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

      <Button
        type='submit'
        variant='primary'
        size='join-login'
        className='mt-6 w-full'
        disabled={!isValid || isPending}
      >
        로그인
      </Button>
      <p className='text-small-01-r mt-4 text-center text-gray-800'>
        완성도가 처음이신가요?
        <Link href='/signup' className='text-small-01-r ml-3 text-blue-400'>
          회원가입
        </Link>
      </p>
    </form>
  );
}
