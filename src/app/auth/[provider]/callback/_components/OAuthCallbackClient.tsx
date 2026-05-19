'use client';

import { useEffect, useRef } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useSocialLoginCallback } from '@/api/auth/queries';
import { userQueries } from '@/api/users/queries';
import { useToastStore } from '@/components/ui/Toast/useToastStore';
import { trackAuthLogin, trackAuthSignUp } from '@/lib/analytics/auth';

import type { AuthMethod } from '@/lib/analytics/events';

const toAuthMethod = (provider: string): AuthMethod | null => {
  if (provider === 'kakao' || provider === 'google') return provider;
  return null;
};

export function OAuthCallbackClient() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const provider = params.provider as string;
  const code = searchParams.get('code');
  const { showToast } = useToastStore();

  const { mutate: loginCallback, isPending } = useSocialLoginCallback({
    onSuccess: (data) => {
      console.log('[OAuth 성공 응답 데이터]:', data);
      // OAuth 응답에는 user.id가 없어 /users/me 를 보강 호출해 GA identifyUser 에 전달.
      // GA 발사 실패가 로그인 흐름을 막지 않도록 fire-and-forget.
      const method = toAuthMethod(provider);
      if (method) {
        queryClient
          .fetchQuery(userQueries.me())
          .then((me) => {
            const userId = String(me.id);
            if (data.newUser) trackAuthSignUp({ userId, method });
            else trackAuthLogin({ userId, method });
          })
          .catch((error) => {
            console.warn('[GA] OAuth tracking 실패 (로그인은 정상 진행):', error);
          });
      }

      // 신규 유저인 경우 무조건 메인으로 이동
      if (data.newUser) {
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
      console.error('[OAuth 실패 에러]:', error);
      showToast({
        variant: 'error',
        title: '로그인에 실패했습니다.',
        description: '다시 시도해 주세요.',
      });
      router.replace('/login');
    },
  });

  const hasCalled = useRef(false);

  useEffect(() => {
    if (!code || !provider || hasCalled.current) return;

    // React 18 StrictMode의 더블 마운트로 인한 중복 호출 방지를 위해 sessionStorage 사용
    const processedCodeKey = `processed_code_${code}`;
    if (sessionStorage.getItem(processedCodeKey)) return;

    hasCalled.current = true;
    sessionStorage.setItem(processedCodeKey, 'true');

    const redirectUri = `${window.location.origin}${window.location.pathname}`;

    loginCallback({ provider, code, redirectUri });
  }, [code, provider, loginCallback]);

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
