'use client';

import { useEffect, useRef } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useSocialLoginCallback } from '@/api/auth/queries';
import { userQueries } from '@/api/users/queries';
import { useToastStore } from '@/components/ui/Toast/useToastStore';
import { trackAuthLogin, trackAuthLoginFailed, trackAuthSignUp } from '@/lib/analytics/auth';

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

  const { mutateAsync: loginCallback } = useSocialLoginCallback();

  const hasCalledRef = useRef(false);
  const hasFiredCancelRef = useRef(false);

  useEffect(() => {
    if (!provider || hasCalledRef.current) return;

    // 인가 코드 누락 = provider 화면에서 사용자가 "취소" 한 케이스. 깔때기 누락으로 기록한다.
    if (!code) {
      if (hasFiredCancelRef.current) return;
      hasFiredCancelRef.current = true;
      const method = toAuthMethod(provider);
      if (method) trackAuthLoginFailed({ method, error: 'OAUTH_CANCELLED' });
      return;
    }

    // StrictMode 더블 마운트로 인한 중복 교환 방지 (인가 코드는 1회용)
    const processedCodeKey = `processed_code_${code}`;
    if (sessionStorage.getItem(processedCodeKey)) return;

    hasCalledRef.current = true;
    sessionStorage.setItem(processedCodeKey, 'true');

    const method = toAuthMethod(provider);
    const redirectUri = `${window.location.origin}${window.location.pathname}`;

    // mutateAsync가 반환한 Promise는 컴포넌트/옵저버 수명과 무관하게 settle 된다.
    // mutate() 콜백이나 isSuccess 상태는 StrictMode 더블 마운트로 옵저버가 churn 되면
    // 유실/미반영되어(교환은 성공해 쿠키만 발급된 채 콜백 화면에 멈춤) 리다이렉트가 누락됐다.
    // Promise then/catch 에서 처리하면 항상 보장된다.
    loginCallback({ provider, code, redirectUri })
      .then((data) => {
        // OAuth 응답에는 user.id가 없어 /users/me 를 보강 호출해 GA에 전달. 실패해도 로그인은 진행.
        if (method) {
          queryClient
            .fetchQuery(userQueries.me())
            .then((me) => {
              const userId = String(me.id);
              if (data.newUser) trackAuthSignUp({ userId, method });
              else trackAuthLogin({ userId, method });
            })
            .catch((trackingError) => {
              console.warn('[GA] OAuth tracking 실패 (로그인은 정상 진행):', trackingError);
            });
        }

        // 신규 유저는 무조건 메인으로, 기존 유저는 returnTo가 있으면 해당 페이지로.
        if (data.newUser) {
          router.replace('/main');
          return;
        }
        const returnTo = sessionStorage.getItem('returnTo');
        if (returnTo) {
          sessionStorage.removeItem('returnTo');
          router.replace(returnTo);
        } else {
          router.replace('/main');
        }
      })
      .catch((loginError) => {
        console.error('[OAuth] 콜백 실패:', loginError);
        // 1회용 인가 코드 재시도를 막던 가드 해제 — 사용자가 다시 로그인할 수 있게.
        sessionStorage.removeItem(processedCodeKey);
        // 신규/기존 유저 구분이 불가능한 시점이라 sign_up_failed 분기 없이 login_failed 로 통합한다.
        if (method) trackAuthLoginFailed({ method, error: loginError });
        showToast({
          variant: 'error',
          title: '로그인에 실패했습니다.',
          description: '다시 시도해 주세요.',
        });
        router.replace('/login');
      });
  }, [code, provider, loginCallback, queryClient, router, showToast]);

  return (
    <div className='flex min-h-screen flex-col items-center justify-center p-4 text-center'>
      <div className='mb-6 h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent' />
      <h1 className='text-h4-b mb-2 text-gray-900'>로그인 중입니다</h1>
      <p className='text-body-01-r text-gray-600'>잠시만 기다려 주세요...</p>

      {!code && (
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
