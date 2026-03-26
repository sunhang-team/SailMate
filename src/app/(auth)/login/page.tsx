import { LoginForm } from './_components/LoginForm';

export default function LoginPage() {
  return (
    <main className='flex min-h-screen items-center justify-center px-4'>
      <div className='flex w-full max-w-[496px] flex-col gap-10'>
        <h1 className='text-h5-b text-center text-gray-900'>로그인</h1>
        <LoginForm />
      </div>
    </main>
  );
}
