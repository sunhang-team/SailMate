'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { loginFormSchema } from '@/api/auth/schemas';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { VisibilityIcon } from '@/components/ui/Icon';
import { useLogin } from '@/api/auth/queries';

import type { LoginForm } from '@/api/auth/types';

export function EmailLoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid, submitCount, touchedFields },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginFormSchema),
    mode: 'onChange',
  });

  const { mutate: loginMutate, isPending } = useLogin({
    onSuccess: () => router.push('/main'),
    onError: () => setError('root', { message: '이메일 또는 비밀번호가 올바르지 않습니다.' }),
  });

  const onSubmit = (data: LoginForm) => loginMutate(data);
  const showEmailError = !!touchedFields.email || submitCount > 0;
  const showPasswordError = !!touchedFields.password || submitCount > 0;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-8'>
      {/* 이메일 입력 필드 */}
      <Input
        label={
          <span className='text-small-01-m md:text-body-02-m'>
            이메일 <span className='ml-1 text-blue-400'>*</span>
          </span>
        }
        placeholder='이메일을 입력해주세요'
        type='email'
        error={showEmailError ? errors.email?.message : undefined}
        {...register('email')}
        className='h-11 placeholder:text-gray-300'
      />
      {/* 비밀번호 입력 필드 + 보기/숨기기 토글 버튼 */}
      <div className='relative'>
        <Input
          label={
            <span className='text-small-01-m md:text-body-02-m'>
              비밀번호 <span className='ml-1 text-blue-400'>*</span>
            </span>
          }
          placeholder='영문, 숫자, 특수문자 포함 8자 이상 입력해주세요'
          type={showPassword ? 'text' : 'password'}
          error={showPasswordError ? errors.password?.message : undefined}
          {...register('password')}
          className='h-11 placeholder:text-gray-300'
        />
        <button
          type='button'
          className='absolute top-9 right-3 cursor-pointer text-gray-400 md:top-10'
          onClick={() => setShowPassword((prev) => !prev)}
          aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
        >
          <VisibilityIcon variant={showPassword ? 'on' : 'off'} size={20} />
        </button>
      </div>

      {/* 로그인 API 실패 시 서버 에러 메시지 (이메일/비밀번호 불일치 등) */}
      {errors.root && <p className='text-small-02-r text-center text-red-200'>{errors.root.message}</p>}

      {/* 로그인 제출 버튼 — 유효성 검사 통과 전·API 요청 중 비활성화 */}
      <Button
        variant='primary'
        size='join-login'
        type='submit'
        disabled={!isValid || isPending} // isPending: API 응답 대기 중 이중 제출 방지
        className='mt-3 w-full'
      >
        로그인
      </Button>
    </form>
  );
}
