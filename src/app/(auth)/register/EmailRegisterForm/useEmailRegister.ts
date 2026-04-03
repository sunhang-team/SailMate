import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { authQueries, useRegister } from '@/api/auth/queries';
import { signupFormSchema } from '@/api/auth/schemas';
import { useToastStore } from '@/components/ui/Toast/useToastStore';

import type { SignupForm } from '@/api/auth/types';

export function useEmailRegister() {
  const router = useRouter();
  const showToast = useToastStore((state) => state.showToast);

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  // 중복 확인 상태 관리
  const [isEmailChecked, setIsEmailChecked] = useState(false);
  const [isNicknameChecked, setIsNicknameChecked] = useState(false);
  const [checkedEmail, setCheckedEmail] = useState('');
  const [checkedNickname, setCheckedNickname] = useState('');

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

  // 입력값이 변경되면 중복 확인 상태 초기화
  useEffect(() => {
    if (emailValue !== checkedEmail) {
      setIsEmailChecked(false);
    }
  }, [emailValue, checkedEmail]);

  useEffect(() => {
    if (nicknameValue !== checkedNickname) {
      setIsNicknameChecked(false);
    }
  }, [nicknameValue, checkedNickname]);

  // 이메일 중복 확인 쿼리
  const { refetch: refetchEmail, isFetching: isCheckingEmail } = useQuery({
    ...authQueries.checkEmail(emailValue),
    enabled: false,
  });

  // 닉네임 중복 확인 쿼리
  const { refetch: refetchNickname, isFetching: isCheckingNickname } = useQuery({
    ...authQueries.checkNickname(nicknameValue),
    enabled: false,
  });

  // 회원가입 뮤테이션
  const { mutate: registerMutate, isPending: isRegistering } = useRegister();

  const handleCheckEmail = async () => {
    if (errors.email || !emailValue) {
      await trigger('email');
      return;
    }

    const { data } = await refetchEmail();
    if (data?.available) {
      setIsEmailChecked(true);
      setCheckedEmail(emailValue);
    } else {
      setError('email', { type: 'manual', message: '이미 사용 중인 이메일입니다.' });
      setIsEmailChecked(false);
    }
  };

  const handleCheckNickname = async () => {
    if (errors.nickname || !nicknameValue) {
      await trigger('nickname');
      return;
    }

    const { data } = await refetchNickname();
    if (data?.available) {
      setIsNicknameChecked(true);
      setCheckedNickname(nicknameValue);
    } else {
      setError('nickname', { type: 'manual', message: '이미 사용 중인 닉네임입니다.' });
      setIsNicknameChecked(false);
    }
  };

  const onSubmit = (data: SignupForm) => {
    if (!isEmailChecked || !isNicknameChecked) {
      showToast({ title: '이메일과 닉네임 중복 확인을 완료해주세요.', variant: 'warning' });
      return;
    }

    registerMutate(data, {
      onSuccess: () => {
        showToast({ title: '회원가입이 완료되었습니다.', variant: 'success' });
        router.push('/main');
      },
      onError: () => {
        showToast({ title: '회원가입 중 오류가 발생했습니다.', variant: 'error' });
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
      isCheckingEmail,
      isCheckingNickname,
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
      onSubmit,
    },
  };
}
