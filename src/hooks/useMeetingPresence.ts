'use client';

import { useEffect, useState, useRef } from 'react';

import { ensureSupabase, supabase } from '@/lib/supabase';

import type { RealtimeChannel } from '@supabase/supabase-js';

export interface PresenceUser {
  userId: number;
  nickname: string;
  onlineAt: string;
}

const PRESENCE_TRACK_DELAY_MS = 100;

export const useMeetingPresence = (
  gatheringId: number,
  userId: number | null,
  nickname: string | null,
  isJoined: boolean = false,
) => {
  const [presentUsers, setPresentUsers] = useState<PresenceUser[]>([]);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const isJoinedRef = useRef(isJoined);

  useEffect(() => {
    isJoinedRef.current = isJoined;
  }, [isJoined]);

  useEffect(() => {
    if (!gatheringId || !userId || !nickname) return;

    const client = ensureSupabase();

    const channelName = `meeting-${gatheringId}`;
    const channel = client.channel(channelName, {
      config: {
        presence: {
          key: userId.toString(),
        },
      },
    });

    channelRef.current = channel;

    const updateLocalPresence = () => {
      const state = channel.presenceState<PresenceUser>();
      const users: PresenceUser[] = [];

      Object.keys(state).forEach((key) => {
        const presenceArray = state[key];
        if (presenceArray && presenceArray.length > 0) {
          users.push(presenceArray[0]);
        }
      });

      setPresentUsers(users);
    };

    channel
      .on('presence', { event: 'sync' }, updateLocalPresence)
      .on('presence', { event: 'join' }, updateLocalPresence)
      .on('presence', { event: 'leave' }, updateLocalPresence)
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          if (isJoinedRef.current) {
            try {
              await channel.track({
                userId,
                nickname,
                onlineAt: new Date().toISOString(),
              });
            } catch (e) {
              console.error('Initial track failed:', e);
            }
          }
        }
      });

    return () => {
      client.removeChannel(channel);
      channelRef.current = null;
    };
  }, [gatheringId, userId, nickname]);

  useEffect(() => {
    const channel = channelRef.current;
    if (!channel || !userId || !nickname) return;

    const updateTrackStatus = async () => {
      try {
        if (isJoined) {
          await channel.track({
            userId,
            nickname,
            onlineAt: new Date().toISOString(),
          });
        } else {
          await channel.untrack();
        }
      } catch (error) {
        // 연결이 미처 안 된 상태에서 시도하면 에러가 날 수 있으나 무시 (위 SUBSCRIBED 에서 후처리됨)
      }
    };

    const timeout = setTimeout(updateTrackStatus, PRESENCE_TRACK_DELAY_MS);
    return () => clearTimeout(timeout);
  }, [isJoined, userId, nickname]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      channelRef.current?.untrack();
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  return { presentUsers };
};
