'use client';

import { useSuspenseQuery } from '@tanstack/react-query';

import { userQueries } from '@/api/users/queries';
import { useMeetingPresence } from '@/hooks/useMeetingPresence';

import { MeetingRoom } from './MeetingRoom';
import { MeetingLobby } from './MeetingLobby';

export type MeetingStatus = 'idle' | 'joining' | 'joined' | 'error';

export function MeetingContent({
  status,
  token,
  gatheringId,
  onJoin,
  onDisconnected,
}: {
  status: MeetingStatus;
  token: string | null;
  gatheringId: number;
  onJoin: () => void;
  onDisconnected: () => void;
}) {
  const { data: user } = useSuspenseQuery(userQueries.me());

  const { presentUsers } = useMeetingPresence(gatheringId, user.id, user.nickname, status === 'joined');

  if (status === 'joined' && token) {
    return <MeetingRoom token={token} gatheringId={gatheringId} onDisconnected={onDisconnected} />;
  }

  return (
    <MeetingLobby
      presentUsers={presentUsers}
      userName={user.nickname}
      onJoin={onJoin}
      isJoining={status === 'joining'}
    />
  );
}
