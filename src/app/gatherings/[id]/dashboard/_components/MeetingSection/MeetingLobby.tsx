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
    <div className='relative flex min-h-[420px] flex-col items-center justify-center text-center md:min-h-[520px]'>
      <div className='mb-6 flex h-18 w-18 rotate-3 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-2xl shadow-blue-200 transition-transform group-hover:rotate-0 md:mb-8 md:h-24 md:w-24 md:rounded-3xl'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='32'
          height='32'
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

      <h2 className='text-h4-b md:text-h1-b mb-3 text-gray-900'>회의실 입장</h2>
      <p className='text-body-02-r md:text-body-01-r mb-8 max-w-md text-gray-500 md:mb-10'>
        <span className='font-bold text-blue-600'>{userName}</span>님, 실시간 화상 회의에 참여하시겠습니까? <br />
        동료들과 더 가깝게 소통해보세요.
      </p>

      {presentUsers.length > 0 && (
        <div className='mb-8 w-full max-w-lg rounded-2xl bg-gray-50 p-4 md:mb-12 md:p-6'>
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
        className='text-body-01-b md:text-h4-b relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-blue-600 px-6 py-4 text-white transition-all hover:bg-blue-700 hover:shadow-2xl hover:shadow-blue-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto md:px-16 md:py-5'
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
    <div className='relative flex min-h-[420px] flex-col items-center justify-center text-center opacity-50 md:min-h-[520px]'>
      <div className='mb-6 h-18 w-18 rounded-2xl bg-gray-200 md:mb-8 md:h-24 md:w-24 md:rounded-3xl' />
      <div className='mb-3 h-8 w-40 rounded-lg bg-gray-200 md:w-48' />
      <div className='mb-8 h-16 w-56 rounded-lg bg-gray-200 md:mb-10 md:w-64' />
      <div className='h-14 w-full max-w-56 rounded-2xl bg-gray-200' />
    </div>
  );
};
