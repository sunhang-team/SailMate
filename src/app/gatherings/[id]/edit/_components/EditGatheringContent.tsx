'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useSuspenseQueries } from '@tanstack/react-query';

import { gatheringQueries } from '@/api/gatherings/queries';
import { mapGatheringDetailToFormValues } from '@/app/gatherings/new/CreateGatheringFunnel/mapGatheringDetailToFormValues';

import { EditGatheringForm } from '../EditGatheringForm';
import { InProgressEditForm } from '../InProgressEditForm';

import type { Category } from '@/api/gatherings/types';

interface EditGatheringContentProps {
  gatheringId: number;
}

export function EditGatheringContent({ gatheringId }: EditGatheringContentProps) {
  const router = useRouter();
  const [{ data: detail }, { data: categoriesData }] = useSuspenseQueries({
    queries: [gatheringQueries.detail(gatheringId), gatheringQueries.categories()],
  });

  const nameToId = useMemo(
    () => Object.fromEntries(categoriesData.categories.map((c: Category) => [c.name, c.id])) as Record<string, number>,
    [categoriesData.categories],
  );

  const initialValues = useMemo(() => mapGatheringDetailToFormValues(detail, nameToId), [detail, nameToId]);

  const isCompleted = detail.status === 'COMPLETED';

  useEffect(() => {
    if (isCompleted) router.replace(`/gatherings/${gatheringId}`);
  }, [isCompleted, gatheringId, router]);

  if (isCompleted) return null;

  if (detail.status === 'IN_PROGRESS') {
    return <InProgressEditForm gatheringId={gatheringId} initialValues={initialValues} />;
  }

  return <EditGatheringForm gatheringId={gatheringId} initialValues={initialValues} />;
}
