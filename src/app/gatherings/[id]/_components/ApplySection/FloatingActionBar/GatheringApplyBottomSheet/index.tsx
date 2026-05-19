'use client';

import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useCreateApplication } from '@/api/applications/queries';
import { gatheringQueries } from '@/api/gatherings/queries';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { useToastStore } from '@/components/ui/Toast/useToastStore';
import { useFunnel } from '@/hooks/useFunnel';
import { trackGatheringJoin } from '@/lib/analytics/gathering';
import { GatheringApplyForm } from '../../GatheringApplyForm';
import { GatheringApplySuccess } from '../../GatheringApplySuccess';

interface GatheringApplyBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  gatheringId: number;
  gatheringTitle: string;
}

export function GatheringApplyBottomSheet({
  isOpen,
  onClose,
  gatheringId,
  gatheringTitle,
}: GatheringApplyBottomSheetProps) {
  const { Funnel, Step, setStep, currentStep } = useFunnel<'APPLY' | 'SUCCESS'>('APPLY');
  const { showToast } = useToastStore();

  // 모임 상세 데이터는 부모 페이지에서 prefetched. cache hit 으로 비용 없음.
  // join_gathering 이벤트의 category 파라미터 매핑용.
  const { data: detailData } = useQuery(gatheringQueries.detail(gatheringId));

  const { mutate, isPending } = useCreateApplication(gatheringId, {
    onSuccess: () => {
      if (detailData) {
        trackGatheringJoin({ gatheringId: String(gatheringId), category: detailData.categories[0] ?? 'unknown' });
      }
      setStep('SUCCESS');
    },
    onError: (error) => {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        showToast({ variant: 'error', title: error.response.data.message });
        return;
      }
      showToast({ variant: 'error', title: '신청에 실패했습니다.' });
    },
  });
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <BottomSheet.Header showCloseButton={currentStep === 'APPLY'}>{null}</BottomSheet.Header>
      <BottomSheet.Body>
        <Funnel>
          <Step name='APPLY'>
            <GatheringApplyForm gatheringTitle={gatheringTitle} onSubmit={mutate} isLoading={isPending} />
          </Step>
          <Step name='SUCCESS'>
            <GatheringApplySuccess onClose={onClose} />
          </Step>
        </Funnel>
      </BottomSheet.Body>
    </BottomSheet>
  );
}
