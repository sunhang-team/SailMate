'use client';

import { useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';

import { useQuery } from '@tanstack/react-query';

import { gatheringQueries } from '@/api/gatherings/queries';
import { resolveGatheringEntrySource, trackGatheringView } from '@/lib/analytics/gathering';

interface GatheringDetailTrackerProps {
  gatheringId: number;
}

export function GatheringDetailTracker({ gatheringId }: GatheringDetailTrackerProps) {
  const searchParams = useSearchParams();
  const { data } = useQuery(gatheringQueries.detail(gatheringId));
  // (gatheringId, source) 조합을 키로 두어 동일 모임이라도 진입 경로가 바뀌면 다시 발사한다.
  // 같은 조합에 대해선 1회만 발사.
  const lastFiredSignatureRef = useRef<string | null>(null);

  useEffect(() => {
    if (!data) return;
    const source = resolveGatheringEntrySource(new URLSearchParams(searchParams.toString()));
    const signature = `${gatheringId}|${source}`;
    if (lastFiredSignatureRef.current === signature) return;
    lastFiredSignatureRef.current = signature;

    const category = data.categories[0] ?? 'unknown';
    trackGatheringView({ gatheringId: String(gatheringId), category, source });
  }, [data, gatheringId, searchParams]);

  return null;
}
