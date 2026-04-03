import { AuthBottomLink } from '../components/AuthBottomLink';
import { AuthDivider } from '../components/AuthDivider';
import { SocialLoginButtons } from '../components/SocialLoginButtons';
import { EmailLoginForm } from './EmailLoginForm';

export default function LoginPage() {
  return (
    <main className='flex justify-center px-4 py-20 md:py-25'>
      <div className='w-full max-w-[496px]'>
        <h1 className='text-h5-b mb-10 text-center text-gray-900'>로그인</h1>
        <SocialLoginButtons kakaoLabel='카카오로 로그인' googleLabel='구글로 로그인' />
        <AuthDivider text='또는 이메일로 로그인' />
        <EmailLoginForm />
        <AuthBottomLink text='완성도가 처음이신가요?' linkText='회원가입' href='/register' />
      </div>
    </main>
  );
}
