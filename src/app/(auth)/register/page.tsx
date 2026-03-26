import { AuthBottomLink } from '../components/AuthBottomLink';
import { AuthDivider } from '../components/AuthDivider';
import { SocialLoginButtons } from '../components/SocialLoginButtons';
import { EmailRegisterForm } from './EmailRegisterForm';

export default function Register() {
  return (
    <main className='flex justify-center px-4 py-20'>
      <div className='w-full max-w-[496px]'>
        <h1 className='text-h5-b mb-10 text-center text-gray-900'>회원가입</h1>
        <SocialLoginButtons />
        <AuthDivider text='또는 이메일로 가입' />
        <EmailRegisterForm />
        <AuthBottomLink text='이미 계정이 있으신가요?' linkText='로그인' href='/login' />
      </div>
    </main>
  );
}
