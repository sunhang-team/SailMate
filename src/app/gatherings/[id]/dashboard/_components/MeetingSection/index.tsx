'use client';

import { Suspense, useState } from 'react';

import { useToastStore } from '@/components/ui/Toast/useToastStore';

import { MeetingContent } from './MeetingContent';
import { MeetingLobby } from './MeetingLobby';

import type { MeetingStatus } from './MeetingContent';

interface MeetingSectionProps {
  gatheringId: number;
}

export function MeetingSection({ gatheringId }: MeetingSectionProps) {
  const [status, setStatus] = useState<MeetingStatus>('idle');
  const [token, setToken] = useState<string | null>(null);

  const { showToast } = useToastStore();

  const handleJoin = async () => {
    if (status === 'joining') return;
    setStatus('joining');

    try {
      const roomName = `gathering-${gatheringId}`;
      const resp = await fetch(`/api/livekit/token?room=${roomName}`);

      if (!resp.ok) {
        const errorData = await resp.json().catch(() => ({}));
        showToast({ variant: 'error', title: errorData.error || '회의 토큰을 가져오는데 실패했습니다.' });
        setStatus('error');
        return;
      }

      const data = await resp.json();
      if (data.token) {
        setToken(data.token);
        setStatus('joined');
      } else {
        showToast({ variant: 'error', title: '회의 토큰을 가져오는데 실패했습니다.' });
        setStatus('error');
      }
    } catch (error) {
      console.error('Error fetching dynamic token:', error);
      showToast({ variant: 'error', title: '회의실에 입장할 수 없습니다.' });
      setStatus('error');
    }
  };

  const handleDisconnected = () => {
    setStatus('idle');
    setToken(null);
  };

  return (
    <section className='px-4 py-10 md:px-7 xl:px-30'>
      <div className='mx-auto max-w-[1680px]'>
        <div className='group border-gray-150 relative overflow-hidden rounded-3xl border bg-white p-12 shadow-xl transition-all hover:shadow-2xl'>
          <div className='absolute -top-20 -right-20 h-64 w-64 rounded-full bg-blue-50 opacity-50 blur-3xl transition-all group-hover:scale-110' />
          <Suspense fallback={<MeetingLobby.Skeleton />}>
            <MeetingContent
              status={status}
              token={token}
              gatheringId={gatheringId}
              onJoin={handleJoin}
              onDisconnected={handleDisconnected}
            />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
