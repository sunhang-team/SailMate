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
  const hasFiredRef = useRef(false);

  useEffect(() => {
    if (!data || hasFiredRef.current) return;
    hasFiredRef.current = true;

    const source = resolveGatheringEntrySource(new URLSearchParams(searchParams.toString()));
    const category = data.categories[0] ?? 'unknown';
    trackGatheringView({ gatheringId: String(gatheringId), category, source });
  }, [data, gatheringId, searchParams]);

  return null;
}
