'use client';

import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { SuspenseBoundary } from '@/components/SuspenseBoundary';
import { gatheringFormSchema } from '@/api/gatherings/schemas';
import { useFunnel } from '@/hooks/useFunnel';

import { BasicInfoStep } from './BasicInfoStep';
import { CompleteStep } from './CompleteStep';
import { DetailStep } from './DetailStep';
import { DraftInitializer } from './DraftInitializer';
import { ScheduleStep } from './ScheduleStep';
import { StepIndicator } from './StepIndicator';

import type { FunnelStep } from './getInitialDraftStep';
import type { GatheringForm } from '@/api/gatherings/types';

interface CreateGatheringFunnelProps {
  initialDraftId?: number | null;
}

interface GatheringFunnelStepsProps {
  initialStep: FunnelStep;
  draftId: number | null;
  onDraftIdChange: (draftId: number) => void;
}

function GatheringFunnelSteps({ initialStep, draftId, onDraftIdChange }: GatheringFunnelStepsProps) {
  const { Funnel, Step, setStep, currentStep } = useFunnel<FunnelStep>(initialStep);
  const [createdGatheringId, setCreatedGatheringId] = useState<number | null>(null);

  return (
    <>
      <StepIndicator currentStep={currentStep} />
      <Funnel>
        <Step name='BASIC'>
          <BasicInfoStep draftId={draftId} onDraftSaved={onDraftIdChange} onNext={() => setStep('SCHEDULE')} />
        </Step>
        <Step name='SCHEDULE'>
          <ScheduleStep
            draftId={draftId}
            onDraftSaved={onDraftIdChange}
            onPrev={() => setStep('BASIC')}
            onCreated={(gatheringId) => {
              setCreatedGatheringId(gatheringId);
              setStep('COMPLETE');
            }}
          />
        </Step>
        <Step name='COMPLETE'>
          {createdGatheringId && (
            <CompleteStep gatheringId={createdGatheringId} onAddDetail={() => setStep('DETAIL')} />
          )}
        </Step>
        <Step name='DETAIL'>{createdGatheringId && <DetailStep gatheringId={createdGatheringId} />}</Step>
      </Funnel>
    </>
  );
}

export function CreateGatheringFunnel({ initialDraftId = null }: CreateGatheringFunnelProps) {
  const [draftId, setDraftId] = useState<number | null>(initialDraftId);

  const methods = useForm<GatheringForm>({
    resolver: zodResolver(gatheringFormSchema),
    mode: 'onChange',
    defaultValues: { categoryIds: [], tags: [], weeklyGuides: [] },
  });

  return (
    <FormProvider {...methods}>
      {initialDraftId ? (
        <SuspenseBoundary
          pendingFallback={
            <div className='flex flex-col gap-8'>
              <div className='bg-gray-150 h-40 animate-pulse rounded-lg' />
              <div className='bg-gray-150 h-60 animate-pulse rounded-lg' />
            </div>
          }
          errorFallback={
            <div className='rounded-lg border border-gray-200 bg-gray-50 px-4 py-6'>
              <p className='text-body-02-r text-gray-500'>임시저장을 불러올 수 없습니다</p>
            </div>
          }
        >
          <DraftInitializer draftId={initialDraftId}>
            {(initialStep) => (
              <GatheringFunnelSteps initialStep={initialStep} draftId={draftId} onDraftIdChange={setDraftId} />
            )}
          </DraftInitializer>
        </SuspenseBoundary>
      ) : (
        <GatheringFunnelSteps initialStep='BASIC' draftId={draftId} onDraftIdChange={setDraftId} />
      )}
    </FormProvider>
  );
}
