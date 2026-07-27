'use client';

import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { gatheringFormSchema } from '@/api/gatherings/schemas';
import { useFunnel } from '@/hooks/useFunnel';

import { BasicInfoStep } from './BasicInfoStep';
import { CompleteStep } from './CompleteStep';
import { DetailStep } from './DetailStep';
import { ScheduleStep } from './ScheduleStep';
import { StepIndicator } from './StepIndicator';

import type { GatheringForm } from '@/api/gatherings/types';

type FunnelStep = 'BASIC' | 'SCHEDULE' | 'COMPLETE' | 'DETAIL';

export function CreateGatheringFunnel() {
  const { Funnel, Step, setStep, currentStep } = useFunnel<FunnelStep>('BASIC');
  const [createdGatheringId, setCreatedGatheringId] = useState<number | null>(null);

  const methods = useForm<GatheringForm>({
    resolver: zodResolver(gatheringFormSchema),
    mode: 'onChange',
    defaultValues: { categoryIds: [], tags: [], weeklyGuides: [] },
  });

  return (
    <FormProvider {...methods}>
      <StepIndicator currentStep={currentStep} />
      <Funnel>
        <Step name='BASIC'>
          <BasicInfoStep onNext={() => setStep('SCHEDULE')} />
        </Step>
        <Step name='SCHEDULE'>
          <ScheduleStep
            onPrev={() => setStep('BASIC')}
            onCreated={(gatheringId) => {
              setCreatedGatheringId(gatheringId);
              setStep('COMPLETE');
            }}
          />
        </Step>
        <Step name='COMPLETE'>
          <CompleteStep gatheringId={createdGatheringId} onAddDetail={() => setStep('DETAIL')} />
        </Step>
        <Step name='DETAIL'>{createdGatheringId && <DetailStep gatheringId={createdGatheringId} />}</Step>
      </Funnel>
    </FormProvider>
  );
}
