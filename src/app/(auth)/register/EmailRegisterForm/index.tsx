'use client';

import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { VisibilityIcon } from '@/components/ui/Icon';
import { useToastStore } from '@/components/ui/Toast/useToastStore';

import { useEmailRegister } from './useEmailRegister';

import type { SignupForm } from '@/api/auth/types';

export function EmailRegisterForm() {
  const router = useRouter();
  const showToast = useToastStore((state) => state.showToast);
  const { state, form, handlers } = useEmailRegister();

  const onSubmit = (data: SignupForm) => {
    if (!state.isEmailChecked || !state.isNicknameChecked) {
      showToast({ title: '이메일과 닉네임 중복 확인을 완료해주세요.', variant: 'warning' });
      return;
    }

    handlers.registerMutate(data, {
      onSuccess: () => {
        showToast({ title: '회원가입이 완료되었습니다.', variant: 'success' });
        router.push('/main');
      },
      onError: () => {
        showToast({ title: '회원가입 중 오류가 발생했습니다.', variant: 'error' });
      },
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-8'>
      <div className='flex flex-col gap-2'>
        <div className={`flex gap-2 ${form.errors.email ? 'items-center' : 'items-end'}`}>
          <div className='flex-1'>
            <Input
              label={
                <span className='text-small-01-m md:text-body-02-m'>
                  이메일 <span className='ml-1 text-blue-400'>*</span>
                </span>
              }
              placeholder='이메일을 입력해주세요.'
              type='email'
              error={form.errors.email?.message}
              {...form.register('email')}
              className='h-11 placeholder:text-gray-300'
            />
          </div>
          <Button
            variant='check'
            size='check'
            type='button'
            onClick={handlers.handleCheckEmail}
            disabled={state.isCheckingEmail || !form.emailValue}
          >
            {state.isCheckingEmail ? '확인 중...' : '확인'}
          </Button>
        </div>
        {state.isEmailChecked && !form.errors.email && (
          <p className='text-small-02-r ml-1 text-blue-400'>사용 가능한 이메일입니다.</p>
        )}
      </div>

      <div className='flex flex-col gap-2'>
        <div className={`flex gap-2 ${form.errors.nickname ? 'items-center' : 'items-end'}`}>
          <div className='flex-1'>
            <Input
              label={
                <span className='text-small-01-m md:text-body-02-m'>
                  닉네임 <span className='ml-1 text-blue-400'>*</span>
                </span>
              }
              placeholder='닉네임을 입력해주세요.'
              error={form.errors.nickname?.message}
              {...form.register('nickname')}
              className='h-11 placeholder:text-gray-300'
            />
          </div>
          <Button
            variant='check'
            size='check'
            type='button'
            onClick={handlers.handleCheckNickname}
            disabled={state.isCheckingNickname || !form.nicknameValue}
          >
            {state.isCheckingNickname ? '확인 중...' : '확인'}
          </Button>
        </div>
        {state.isNicknameChecked && !form.errors.nickname && (
          <p className='text-small-02-r ml-1 text-blue-400'>사용 가능한 닉네임입니다.</p>
        )}
      </div>

      <div className='relative'>
        <Input
          label={
            <span className='text-small-01-m md:text-body-02-m'>
              비밀번호 <span className='ml-1 text-blue-400'>*</span>
            </span>
          }
          placeholder='영문, 숫자, 특수문자 포함 8자 이상 입력해주세요.'
          type={state.showPassword ? 'text' : 'password'}
          error={form.errors.password?.message}
          {...form.register('password', {
            onBlur: () => form.trigger('passwordConfirmation'),
          })}
          className='h-11 placeholder:text-gray-300'
        />
        <button
          type='button'
          className='absolute top-9 right-3 cursor-pointer text-gray-400 md:top-10'
          onClick={() => state.setShowPassword((prev) => !prev)}
          aria-label={state.showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
        >
          <VisibilityIcon variant={state.showPassword ? 'on' : 'off'} size={20} />
        </button>
      </div>

      <div className='relative'>
        <Input
          label={
            <span className='text-small-01-m md:text-body-02-m'>
              비밀번호 확인 <span className='ml-1 text-blue-400'>*</span>
            </span>
          }
          placeholder='비밀번호를 한번 더 입력해주세요.'
          type={state.showPasswordConfirm ? 'text' : 'password'}
          error={form.errors.passwordConfirmation?.message}
          {...form.register('passwordConfirmation')}
          className='h-11 placeholder:text-gray-300'
        />
        <button
          type='button'
          className='absolute top-9 right-3 cursor-pointer text-gray-400 md:top-10'
          onClick={() => state.setShowPasswordConfirm((prev) => !prev)}
          aria-label={state.showPasswordConfirm ? '비밀번호 숨기기' : '비밀번호 보기'}
        >
          <VisibilityIcon variant={state.showPasswordConfirm ? 'on' : 'off'} size={20} />
        </button>
      </div>

      <Button
        variant='primary'
        size='join-login'
        type='submit'
        disabled={!form.isValid || !state.isEmailChecked || !state.isNicknameChecked || state.isRegistering}
        className='mt-3 w-full'
      >
        {state.isRegistering ? '회원가입 중...' : '회원가입'}
      </Button>
    </form>
  );
}
