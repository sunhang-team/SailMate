import { useState } from 'react';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useCheckEmail, useCheckNickname, useRegister } from '@/api/auth/queries';
import { signupFormSchema } from '@/api/auth/schemas';

import type { CheckAvailabilityResponse, SignupForm } from '@/api/auth/types';

export function useEmailRegister() {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setError,
    formState: { errors, isValid },
  } = useForm<SignupForm>({
    resolver: zodResolver(signupFormSchema),
    mode: 'onBlur',
  });

  const emailValue = watch('email');
  const nicknameValue = watch('nickname');

  const checkEmailMutation = useCheckEmail();
  const checkNicknameMutation = useCheckNickname();

  const isEmailChecked = !!checkEmailMutation.data?.available && checkEmailMutation.variables === emailValue;
  const isNicknameChecked =
    !!checkNicknameMutation.data?.available && checkNicknameMutation.variables === nicknameValue;

  const { mutate: registerMutate, isPending: isRegistering } = useRegister();

  const handleCheckEmail = async () => {
    if (checkEmailMutation.isPending || !emailValue) return;

    const result = await trigger('email');
    if (!result) return;

    checkEmailMutation.mutate(emailValue, {
      onSuccess: (data: CheckAvailabilityResponse) => {
        if (!data.available) {
          setError('email', { type: 'manual', message: '이미 사용 중인 이메일입니다.' });
        }
      },
    });
  };

  const handleCheckNickname = async () => {
    if (checkNicknameMutation.isPending || !nicknameValue) return;

    const result = await trigger('nickname');
    if (!result) return;

    checkNicknameMutation.mutate(nicknameValue, {
      onSuccess: (data: CheckAvailabilityResponse) => {
        if (!data.available) {
          setError('nickname', { type: 'manual', message: '이미 사용 중인 닉네임입니다.' });
        }
      },
    });
  };

  return {
    state: {
      showPassword,
      setShowPassword,
      showPasswordConfirm,
      setShowPasswordConfirm,
      isEmailChecked,
      isNicknameChecked,
      isCheckingEmail: checkEmailMutation.isPending,
      isCheckingNickname: checkNicknameMutation.isPending,
      isRegistering,
    },
    form: {
      register,
      handleSubmit,
      trigger,
      errors,
      isValid,
      emailValue,
      nicknameValue,
    },
    handlers: {
      handleCheckEmail,
      handleCheckNickname,
      registerMutate,
    },
  };
}
