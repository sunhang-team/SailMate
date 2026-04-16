'use client';

import { ControlBar, LiveKitRoom, RoomAudioRenderer } from '@livekit/components-react';
import { useSuspenseQuery } from '@tanstack/react-query';
import '@livekit/components-styles';

import { gatheringQueries } from '@/api/gatherings/queries';
import { MeetingGrid } from './MeetingGrid';

interface MeetingRoomProps {
  token: string;
  gatheringId: number;
  onDisconnected: () => void;
}

export function MeetingRoom({ token, gatheringId, onDisconnected }: MeetingRoomProps) {
  const { data: gathering } = useSuspenseQuery(gatheringQueries.detail(gatheringId));
  const serverUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL;

  if (!serverUrl) {
    return (
      <div className='flex h-full items-center justify-center bg-blue-500 p-6 text-white'>
        <p>LiveKit URL이 설정되지 않았습니다.</p>
      </div>
    );
  }

  return (
    // 1. 전체 컨테이너를 Midnight Blue 계열로 변경
    <div
      className='h-[700px] overflow-hidden rounded-3xl border border-blue-400/20 bg-blue-500 shadow-2xl'
      style={{ isolation: 'isolate' }}
    >
      <LiveKitRoom
        audio={false}
        video={false}
        token={token}
        serverUrl={serverUrl}
        connectOptions={{ autoSubscribe: true }}
        options={{
          adaptiveStream: true,
          dynacast: true,
          audioCaptureDefaults: {
            autoGainControl: true,
            echoCancellation: true,
            noiseSuppression: true,
            voiceIsolation: true,
          },
        }}
        onDisconnected={onDisconnected}
        data-lk-theme='default'
        className='flex h-full flex-col rounded-[inherit] bg-transparent'
      >
        {/* 2. 헤더 영역 스타일: 반투명 다크 블루 적용 */}
        <div className='flex items-center justify-between rounded-t-[inherit] bg-blue-500/50 px-6 py-4 backdrop-blur-md'>
          <div className='flex items-center gap-4'>
            <button
              type='button'
              className='flex h-10 cursor-pointer items-center gap-2 rounded-xl bg-blue-300 px-4 text-white shadow-lg transition-all hover:bg-blue-400 active:scale-95'
              onClick={onDisconnected}
              aria-label='회의실 나가기'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='18'
                height='18'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <path d='M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4' />
                <polyline points='16 17 21 12 16 7' />
                <line x1='21' y1='12' x2='9' y2='12' />
              </svg>
              <span className='text-small-01-b'>나가기</span>
            </button>

            <div>
              <h3 className='text-body-01-b text-white'>Live Meeting</h3>
              <p className='text-small-01-r text-blue-150/60'>모임: {gathering.title}</p>
            </div>
          </div>
          <div className='flex items-center gap-2 rounded-full bg-blue-400/20 px-3 py-1.5'>
            <div className='h-2 w-2 animate-pulse rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.6)]' />
            <span className='text-small-02-sb text-blue-100'>참여 중</span>
          </div>
        </div>

        {/* 3. 그리드 영역: 배경색 최적화 */}
        <div className='relative flex-1 overflow-hidden bg-linear-to-b from-blue-500/30 to-blue-500/10 p-4'>
          <MeetingGrid />
        </div>

        {/* 4. 푸터 영역: Glassmorphism 스타일 컨트롤 바 */}
        <div className='flex items-center justify-center gap-4 rounded-b-[inherit] border-t border-white/5 bg-blue-500/80 px-6 py-6 backdrop-blur-xl'>
          <ControlBar
            variation='minimal'
            controls={{
              camera: true,
              microphone: true,
              screenShare: true,
              leave: false,
              chat: false,
            }}
          />
        </div>
        <RoomAudioRenderer />
      </LiveKitRoom>
    </div>
  );
}
