'use client';

import type { AuthProvider } from '@/api/users/types';
import { Button } from '@/components/ui/Button';
import { EmailIcon, GoogleIcon, KakaoIcon } from '@/components/ui/Icon';

interface ProviderIconBadgeProps {
  provider: AuthProvider;
}

export function ProviderIconBadge({ provider }: ProviderIconBadgeProps) {
  const variant =
    provider === 'KAKAO' ? 'social-icon-kakao' : provider === 'GOOGLE' ? 'social-icon-google' : 'social-icon-email';
  const label =
    provider === 'KAKAO'
      ? '카카오로 가입한 계정'
      : provider === 'GOOGLE'
        ? '구글로 가입한 계정'
        : '이메일로 가입한 계정';

  const icon =
    provider === 'KAKAO' ? (
      <KakaoIcon className='size-3.5 md:size-5 lg:size-6' aria-hidden />
    ) : provider === 'GOOGLE' ? (
      <GoogleIcon className='size-3.5 md:size-5 lg:size-6' aria-hidden />
    ) : (
      <EmailIcon className='size-3.5 text-blue-300 md:size-5 lg:size-6' aria-hidden />
    );

  return (
    <Button
      type='button'
      variant={variant}
      size='social-icon'
      disabled
      tabIndex={-1}
      aria-label={label}
      title={label}
      className='pointer-events-none shrink-0'
    >
      {icon}
    </Button>
  );
}
