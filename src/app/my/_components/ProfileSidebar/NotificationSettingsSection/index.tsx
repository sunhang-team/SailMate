'use client';

import { useEffect } from 'react';

import { AlarmIcon, AlarmOnIcon } from '@/components/ui/Icon';
import { useToastStore } from '@/components/ui/Toast/useToastStore';
import { Toggle } from '@/components/ui/Toggle';
import { usePushNotificationSetting } from '@/hooks/usePushNotificationSetting';

interface NotificationSettingsSectionProps {
  /** 태블릿 우측 컬럼 / 모바일·PC 하단 스택 */
  variant: 'tablet' | 'wide';
}

export function NotificationSettingsSection({ variant }: NotificationSettingsSectionProps) {
  const showToast = useToastStore((s) => s.showToast);

  const { isSupported, permission, isEnabled, isPending, error, enable, disable } = usePushNotificationSetting({
    onDenied: () => showToast({ variant: 'error', title: '브라우저 알림 권한이 거부되었습니다.' }),
  });

  useEffect(() => {
    if (error) showToast({ variant: 'error', title: '푸시 알림 설정에 실패했습니다.' });
  }, [error, showToast]);

  // 미지원 브라우저(iOS Safari 구버전 등)에서는 섹션 자체를 숨긴다
  if (isSupported === false) return null;

  const isDenied = permission === 'denied';

  const handleChange = (checked: boolean) => {
    if (checked) {
      void enable();
    } else {
      disable();
    }
  };

  if (variant === 'tablet') {
    return (
      <div className='border-gray-150 border-t pt-6 md:pt-7'>
        <p className='text-body-02-sb md:text-body-01-sb mb-5 text-gray-900 md:mb-6'>알림 설정</p>
        <div className='flex items-center justify-between gap-2'>
          <div className='flex items-center gap-2 text-gray-800'>
            {isEnabled ? <AlarmOnIcon className='size-5' /> : <AlarmIcon className='size-5' />}
            <span className='text-small-02-m md:text-small-01-m'>푸시 알림 받기</span>
          </div>
          <Toggle
            checked={isEnabled}
            onChange={handleChange}
            disabled={isDenied || isPending}
            aria-label='푸시 알림 받기'
          />
        </div>
        {isDenied && <p className='text-small-03-r mt-2 text-gray-500'>브라우저 설정에서 알림을 허용해주세요.</p>}
      </div>
    );
  }

  return (
    <div className='border-gray-150 mt-6 border-t pt-7'>
      <p className='text-body-01-sb mb-6 text-gray-900'>알림 설정</p>
      <div className='flex items-center justify-between gap-2'>
        <div className='flex items-center gap-2 text-gray-800'>
          {isEnabled ? <AlarmOnIcon className='size-6' /> : <AlarmIcon className='size-6' />}
          <span className='text-body-02-m'>푸시 알림 받기</span>
        </div>
        <Toggle
          checked={isEnabled}
          onChange={handleChange}
          disabled={isDenied || isPending}
          aria-label='푸시 알림 받기'
        />
      </div>
      {isDenied && <p className='text-small-02-r mt-2 text-gray-500'>브라우저 설정에서 알림을 허용해주세요.</p>}
    </div>
  );
}
