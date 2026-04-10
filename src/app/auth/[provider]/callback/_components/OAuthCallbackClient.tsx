'use client';

import { useEffect, useRef } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { useSocialLoginCallback } from '@/api/auth/queries';
import { useToastStore } from '@/components/ui/Toast/useToastStore';

export function OAuthCallbackClient() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const provider = params.provider as string;
  const code = searchParams.get('code');
  const { showToast } = useToastStore();

  const { mutate: loginCallback, isPending } = useSocialLoginCallback();
  const hasCalled = useRef(false);

  useEffect(() => {
    if (!code || !provider || hasCalled.current) return;

    hasCalled.current = true;

    loginCallback(
      { provider, code },
      {
        onSuccess: (data) => {
          // 신규 유저인 경우 무조건 메인으로 이동
          if (data.isNewUser) {
            router.replace('/main');
          } else {
            // 기존 유저인 경우 이전 페이지(returnTo)가 있다면 해당 페이지로, 없다면 메인으로 이동
            const returnTo = sessionStorage.getItem('returnTo');
            if (returnTo) {
              router.replace(returnTo);
              sessionStorage.removeItem('returnTo');
            } else {
              router.replace('/main');
            }
          }
        },
        onError: (error) => {
          console.error('소셜 로그인 실패:', error);
          showToast({
            variant: 'error',
            title: '로그인에 실패했습니다.',
            description: '다시 시도해 주세요.',
          });
          router.replace('/login');
        },
      },
    );
  }, [code, provider, loginCallback, router, showToast]);

  return (
    <div className='flex min-h-screen flex-col items-center justify-center p-4 text-center'>
      <div className='mb-6 h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent' />
      <h1 className='text-h4-b mb-2 text-gray-900'>로그인 중입니다</h1>
      <p className='text-body-01-r text-gray-600'>잠시만 기다려 주세요...</p>

      {!isPending && !code && (
        <div className='mt-4'>
          <p className='text-red-500'>인가 코드를 찾을 수 없습니다.</p>
          <button onClick={() => router.replace('/login')} className='mt-2 text-blue-500 underline'>
            로그인 페이지로 돌아가기
          </button>
        </div>
      )}
    </div>
  );
}
