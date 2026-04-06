'use client';

import { useCreateApplication } from '@/api/applications/queries';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { useFunnel } from '@/hooks/useFunnel';
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

  const { mutate, isPending } = useCreateApplication(gatheringId, {
    onSuccess: () => setStep('SUCCESS'),
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
