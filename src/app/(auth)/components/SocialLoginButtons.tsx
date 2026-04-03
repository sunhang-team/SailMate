import { Button } from '@/components/ui/Button';
import { KakaoIcon, GoogleIcon } from '@/components/ui/Icon';

interface SocialLoginButtonsProps {
  kakaoLabel: string;
  googleLabel: string;
}

export function SocialLoginButtons({ kakaoLabel, googleLabel }: SocialLoginButtonsProps) {
  return (
    <div className='mb-10 flex flex-col gap-3 md:flex-row'>
      <Button variant='social-kakao' size='social-kakao' className='w-full md:flex-1'>
        <KakaoIcon size={20} />
        {kakaoLabel}
      </Button>
      <Button variant='social' size='social' className='w-full md:flex-1'>
        <GoogleIcon size={20} />
        {googleLabel}
      </Button>
    </div>
  );
}
