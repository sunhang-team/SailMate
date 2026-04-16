'use client';

import type { PresenceUser } from '@/hooks/useMeetingPresence';

interface MeetingLobbyProps {
  presentUsers: PresenceUser[];
  userName: string;
  onJoin: () => void;
  isJoining?: boolean;
}

export function MeetingLobby({ presentUsers, userName, onJoin, isJoining }: MeetingLobbyProps) {
  return (
    <div className='relative flex flex-col items-center justify-center text-center'>
      <div className='mb-8 flex h-24 w-24 rotate-3 items-center justify-center rounded-3xl bg-blue-600 text-white shadow-2xl shadow-blue-200 transition-transform group-hover:rotate-0'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='40'
          height='40'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2.5'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' />
          <circle cx='9' cy='7' r='4' />
          <path d='M22 21v-2a4 4 0 0 0-3-3.87' />
          <path d='M16 3.13a4 4 0 0 1 0 7.75' />
        </svg>
      </div>

      <h2 className='text-h1-b mb-3 text-gray-900'>회의실 입장</h2>
      <p className='text-body-01-r mb-10 max-w-md text-gray-500'>
        <span className='font-bold text-blue-600'>{userName}</span>님, 실시간 화상 회의에 참여하시겠습니까? <br />
        동료들과 더 가깝게 소통해보세요.
      </p>

      {presentUsers.length > 0 && (
        <div className='mb-12 w-full max-w-lg rounded-2xl bg-gray-50 p-6'>
          <p className='text-small-01-b mb-4 text-left tracking-wider text-gray-400 uppercase'>현재 회의 중인 멤버</p>
          <div className='flex flex-wrap gap-2'>
            {presentUsers.map((p) => (
              <div
                key={p.userId}
                className='flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50/50 px-3 py-2 shadow-sm transition-colors'
              >
                <div className='h-2 w-2 animate-pulse rounded-full bg-blue-600' title='Meeting' />
                <span className='text-body-02-m text-blue-700'>{p.nickname}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={onJoin}
        disabled={isJoining}
        className='text-h4-b relative flex items-center justify-center gap-3 overflow-hidden rounded-2xl bg-blue-600 px-16 py-5 text-white transition-all hover:bg-blue-700 hover:shadow-2xl hover:shadow-blue-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50'
      >
        <span>{isJoining ? '입장 중...' : '회의 참여하기'}</span>
        {!isJoining && (
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='20'
            height='20'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <path d='M5 12h14' />
            <path d='m12 5 7 7-7 7' />
          </svg>
        )}
      </button>
    </div>
  );
}

MeetingLobby.Skeleton = function MeetingLobbySkeleton() {
  return (
    <div className='relative flex flex-col items-center justify-center text-center opacity-50'>
      <div className='mb-8 h-24 w-24 rounded-3xl bg-gray-200' />
      <div className='mb-3 h-8 w-48 rounded-lg bg-gray-200' />
      <div className='mb-10 h-16 w-64 rounded-lg bg-gray-200' />
      <div className='h-14 w-56 rounded-2xl bg-gray-200' />
    </div>
  );
};
