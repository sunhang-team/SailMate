'use client';

import { Button } from '@/components/ui/Button';
import { KakaoIcon, GoogleIcon } from '@/components/ui/Icon';

interface SocialLoginButtonsProps {
  kakaoLabel: string;
  googleLabel: string;
}

export function SocialLoginButtons({ kakaoLabel, googleLabel }: SocialLoginButtonsProps) {
  const handleKakaoLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID;
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/auth/kakao/callback`;
    const authUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`;

    if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
      sessionStorage.setItem('returnTo', window.location.pathname + window.location.search);
    }

    window.location.href = authUrl;
  };

  const handleGoogleLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/auth/google/callback`;
    const scope = encodeURIComponent('openid email profile');
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;

    if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
      sessionStorage.setItem('returnTo', window.location.pathname + window.location.search);
    }

    window.location.href = authUrl;
  };

  return (
    <div className='mb-10 flex flex-col gap-3 md:flex-row'>
      <Button variant='social-kakao' size='social-kakao' className='w-full md:flex-1' onClick={handleKakaoLogin}>
        <KakaoIcon size={20} />
        {kakaoLabel}
      </Button>
      <Button variant='social' size='social' className='w-full md:flex-1' onClick={handleGoogleLogin}>
        <GoogleIcon size={20} />
        {googleLabel}
      </Button>
    </div>
  );
}
