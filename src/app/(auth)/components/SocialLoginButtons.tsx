import { Button } from '@/components/ui/Button';
import { KakaoIcon, GoogleIcon } from '@/components/ui/Icon';

export function SocialLoginButtons() {
  return (
    <div className='mb-10 flex gap-3'>
      <Button variant='social-kakao' size='social-kakao' className='flex-1'>
        <KakaoIcon size={20} />
        카카오로 시작하기
      </Button>
      <Button variant='social' size='social' className='flex-1'>
        <GoogleIcon size={20} />
        구글로 시작하기
      </Button>
    </div>
  );
}
