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
      <div className='flex h-full items-center justify-center bg-gray-950 p-6 text-white'>
        <p>LiveKit URL이 설정되지 않았습니다.</p>
      </div>
    );
  }

  return (
    <div className='border-gray-150 h-[700px] overflow-hidden rounded-3xl border bg-gray-950 shadow-2xl'>
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
        className='flex h-full flex-col'
      >
        {/* 상단 헤더: 디스코드 스타일의 어두운 바 */}
        <div className='flex items-center justify-between border-b border-gray-800 bg-gray-900 px-6 py-4'>
          <div className='flex items-center gap-4'>
            <button
              type='button'
              className='flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg transition-colors hover:bg-blue-700'
              onClick={onDisconnected}
              aria-label='회의실 나가기'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='20'
                height='20'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <path d='m15 18-6-6 6-6' />
              </svg>
            </button>
            <div>
              <h3 className='text-body-01-b text-white'>Live Meeting</h3>
              <p className='text-small-01-r text-gray-500'>모임: {gathering.title}</p>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <div className='h-2 w-2 animate-pulse rounded-full bg-green-500' />
            <span className='text-small-01-m text-gray-400'>참여 중</span>
          </div>
        </div>

        {/* 메인 비디오 그리드 영역 */}
        <div className='relative flex-1 overflow-hidden p-4'>
          <MeetingGrid />
        </div>

        {/* 하단 컨트롤 영역: 디스코드 스타일의 플로팅 느낌 버튼들 */}
        <div className='flex items-center justify-center gap-4 bg-gray-900/80 px-6 py-6 backdrop-blur-md'>
          <ControlBar
            variation='minimal'
            controls={{
              camera: true,
              microphone: true,
              screenShare: true,
              leave: true,
              chat: false,
            }}
          />
        </div>

        {/* 오디오 처리 */}
        <RoomAudioRenderer />
      </LiveKitRoom>
    </div>
  );
}
