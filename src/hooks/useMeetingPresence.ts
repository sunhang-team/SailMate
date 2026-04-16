'use client';

import { useEffect, useState, useRef } from 'react';

import { supabase } from '@/lib/supabase';

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

  // isJoined 최신화
  useEffect(() => {
    isJoinedRef.current = isJoined;
  }, [isJoined]);

  // 1. 방 접속 유지 로직
  useEffect(() => {
    // 필수 정보가 없으면 연결하지 않음
    if (!gatheringId || !userId || !nickname || !supabase) return;

    // 사용자 ID가 아닌 gatheringId를 채널 이름으로 사용해 같은 모임 내 유저끼리 브로드캐스트
    const channelName = `meeting-${gatheringId}`;
    const channel = supabase.channel(channelName, {
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
          // 채널에 연결되었을 때, 만약 이미 '회의 참여'를 누른 상태라면 즉시 트래킹합니다.
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
      // 컴포넌트가 언마운트되거나 의존성이 변경(채널 교체)될 때 완벽하게 정리
      supabase?.removeChannel(channel);
      channelRef.current = null;
    };
  }, [gatheringId, userId, nickname]); // isJoined를 제외하여 깜빡임, 끊김 완전 차단

  // 2. 버튼 클릭 시 Track / Untrack 제어
  useEffect(() => {
    const channel = channelRef.current;
    if (!channel || !userId || !nickname) return;

    const updateTrackStatus = async () => {
      try {
        // 이미 참여중이라면 트래킹, 해제(나갔다면)라면 언트래킹(목록에서 사라짐)
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

    // 약간의 지연시간을 둬서 SUBSCRIBED 렌더링 사이클과 겹치지 않게 함
    const timeout = setTimeout(updateTrackStatus, PRESENCE_TRACK_DELAY_MS);
    return () => clearTimeout(timeout);
  }, [isJoined, userId, nickname]);

  // 브라우저 종료 및 탭 닫기 이벤트(beforeunload) 처리
  useEffect(() => {
    const handleBeforeUnload = () => {
      channelRef.current?.untrack();
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  return { presentUsers };
};
