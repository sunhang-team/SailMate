'use client';

import { useState } from 'react';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { signupFormSchema } from '@/api/auth/schemas';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { VisibilityIcon } from '@/components/ui/Icon';

import type { SignupForm } from '@/api/auth/types';

export function EmailRegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<SignupForm>({
    resolver: zodResolver(signupFormSchema),
    mode: 'onBlur',
  });

  // OAuth 로그인 시 이메일, 닉네임 중복체크 미연동
  const onSubmit = (data: SignupForm) => {
    // TODO: 회원가입 API 호출
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-8'>
      {/* 이메일 */}
      <div className={`flex gap-2 ${errors.email ? 'items-center' : 'items-end'}`}>
        <div className='flex-1'>
          <Input
            label={
              <>
                이메일 <span className='ml-1 text-blue-400'>*</span>
              </>
            }
            placeholder='이메일을 입력해주세요.'
            type='email'
            error={errors.email?.message}
            {...register('email')}
            className='h-11'
          />
        </div>
        <Button variant='check' size='check' type='button'>
          확인
        </Button>
      </div>

      {/* 닉네임 */}
      <div className={`flex gap-2 ${errors.nickname ? 'items-center' : 'items-end'}`}>
        <div className='flex-1'>
          <Input
            label={
              <>
                닉네임 <span className='ml-1 text-blue-400'>*</span>
              </>
            }
            placeholder='닉네임을 입력해주세요.'
            error={errors.nickname?.message}
            {...register('nickname')}
            className='h-11'
          />
        </div>
        <Button variant='check' size='check' type='button'>
          확인
        </Button>
      </div>

      {/* 비밀번호 */}
      <div className='relative'>
        <Input
          label={
            <>
              비밀번호 <span className='ml-1 text-blue-400'>*</span>
            </>
          }
          placeholder='영문, 숫자, 특수문자 포함 8자 이상 입력해주세요.'
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

      {/* 비밀번호 확인 */}
      <div className='relative'>
        <Input
          label={
            <>
              비밀번호 확인 <span className='ml-1 text-blue-400'>*</span>
            </>
          }
          placeholder='비밀번호를 한번 더 입력해주세요.'
          type={showPasswordConfirm ? 'text' : 'password'}
          error={errors.passwordConfirmation?.message}
          {...register('passwordConfirmation')}
          className='h-11'
        />
        <button
          type='button'
          className='absolute top-9 right-3 cursor-pointer text-gray-400'
          onClick={() => setShowPasswordConfirm((prev) => !prev)}
          aria-label={showPasswordConfirm ? '비밀번호 숨기기' : '비밀번호 보기'}
        >
          <VisibilityIcon variant={showPasswordConfirm ? 'on' : 'off'} size={20} />
        </button>
      </div>

      {/* 회원가입 버튼 */}
      <Button variant='primary' size='join-login' type='submit' disabled={!isValid} className='mt-3 w-full'>
        회원가입
      </Button>
    </form>
  );
}
