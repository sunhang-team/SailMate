'use client';

import { useEffect, useRef } from 'react';

import { useToastStore } from '@/components/ui/Toast/useToastStore';

// 오프라인 토스트는 온라인 복귀 시 수동으로 제거하므로, 자동 닫힘을 사실상 막는 긴 값.
// (setTimeout 한계인 ~24.8일 이내)
const OFFLINE_TOAST_DURATION = 24 * 60 * 60 * 1000;

/**
 * 네트워크 연결이 끊기면 토스트로 알린다.
 * 오프라인 폴백 페이지(`/~offline`)가 "이동/새로고침" 상황을 다룬다면,
 * 이 컴포넌트는 "이미 보고 있는 화면에서 연결이 끊긴" 상황을 다룬다.
 * 순수 브라우저 이벤트(online/offline)만 사용 — SW 불필요. 렌더링은 없음.
 *
 * 참고: 온라인 복귀 시 SerwistProvider가 reloadOnOnline(기본 true)으로 페이지를
 * 새로고침해 자동 복구한다. 그때 토스트 store도 초기화되므로 별도 "복구 토스트"는 두지 않는다.
 * (handleOnline의 removeToast는 reload 전 정리 + reloadOnOnline을 끌 경우의 안전장치)
 */
export function NetworkStatusToast() {
  const showToast = useToastStore((state) => state.showToast);
  const removeToast = useToastStore((state) => state.removeToast);
  const offlineToastIdRef = useRef<string | null>(null);

  useEffect(() => {
    const handleOffline = () => {
      if (offlineToastIdRef.current) return; // 이미 떠 있으면 중복 방지
      offlineToastIdRef.current = showToast(
        { variant: 'error', title: '인터넷 연결이 끊겼어요', description: '연결 상태를 확인해 주세요.' },
        OFFLINE_TOAST_DURATION,
      );
    };

    const handleOnline = () => {
      if (!offlineToastIdRef.current) return;
      removeToast(offlineToastIdRef.current);
      offlineToastIdRef.current = null;
    };

    // 마운트 시점에 이미 오프라인이면 즉시 표시 (offline 이벤트는 전환 시에만 발생)
    if (!navigator.onLine) handleOffline();

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);
    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, [showToast, removeToast]);

  return null;
}
