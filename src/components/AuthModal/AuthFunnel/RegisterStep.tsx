import { useState } from 'react';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { VisibilityIcon } from '@/components/ui/Icon';
import { useCheckNickname, useRegister } from '@/api/auth/queries';
import { signupFormSchema } from '@/api/auth/schemas';
import { useToastStore } from '@/components/ui/Toast/useToastStore';

import type { SignupForm } from '@/api/auth/types';

export function RegisterStep({
  email,
  onSuccess,
  onBack,
}: {
  email: string;
  onSuccess: () => void;
  onBack: () => void;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const showToast = useToastStore((state) => state.showToast);

  const {
    register: formRegister,
    handleSubmit,
    watch,
    trigger,
    setError,
    formState: { errors, isValid },
  } = useForm<SignupForm>({
    resolver: zodResolver(signupFormSchema),
    mode: 'onBlur',
    defaultValues: { email },
  });

  const nicknameValue = watch('nickname');
  const checkNicknameMutation = useCheckNickname();
  const isNicknameChecked =
    !!checkNicknameMutation.data?.available && checkNicknameMutation.variables === nicknameValue;

  const { mutate: registerMutate, isPending: isRegistering } = useRegister();

  const handleCheckNickname = async () => {
    if (checkNicknameMutation.isPending || !nicknameValue) return;
    const result = await trigger('nickname');
    if (!result) return;

    checkNicknameMutation.mutate(nicknameValue, {
      onSuccess: (data) => {
        if (!data.available) {
          setError('nickname', { type: 'manual', message: '이미 사용 중인 닉네임입니다.' });
        }
      },
    });
  };

  const onSubmit = (data: SignupForm) => {
    if (!isNicknameChecked) {
      showToast({ title: '닉네임 중복 확인을 완료해주세요.', variant: 'warning' });
      return;
    }
    registerMutate(data, {
      onSuccess: () => {
        showToast({ title: '회원가입이 완료되었습니다.', variant: 'success' });
        onSuccess();
      },
      onError: () => {
        showToast({ title: '회원가입 중 오류가 발생했습니다.', variant: 'error' });
      },
    });
  };

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex flex-col gap-2'>
        <h2 className='text-h4-b text-center text-gray-900'>회원가입</h2>
        <p className='text-body-02-r text-center text-gray-600'>완성도 서비스 가입을 위해 정보를 입력해주세요.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-8'>
        <Input label='이메일' type='email' value={email} disabled className='h-11 bg-gray-50' />

        <div className='flex flex-col gap-2'>
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
                {...formRegister('nickname')}
                className='h-11'
              />
            </div>
            <Button
              variant='check'
              size='check'
              type='button'
              onClick={handleCheckNickname}
              disabled={checkNicknameMutation.isPending || !nicknameValue}
            >
              {checkNicknameMutation.isPending ? '확인 중...' : '확인'}
            </Button>
          </div>
          {isNicknameChecked && !errors.nickname && (
            <p className='text-small-02-r ml-1 text-blue-400'>사용 가능한 닉네임입니다.</p>
          )}
        </div>

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
            {...formRegister('password', { onBlur: () => trigger('passwordConfirmation') })}
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
            {...formRegister('passwordConfirmation')}
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

        <div className='flex flex-col gap-3'>
          <Button
            variant='primary'
            size='join-login'
            type='submit'
            disabled={!isValid || !isNicknameChecked || isRegistering}
            className='w-full'
          >
            {isRegistering ? '가입 중...' : '회원가입 완료'}
          </Button>
          <Button type='button' variant='login-outline' onClick={onBack} className='h-14 w-full'>
            뒤로가기
          </Button>
        </div>
      </form>
    </div>
  );
}
