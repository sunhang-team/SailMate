import React, { isValidElement, useMemo, type ReactElement, type ReactNode } from 'react';

import { useState } from 'react';

export interface StepProps<S extends string> {
  name: S;
  children: ReactNode;
}

export interface FunnelProps<S extends string> {
  children: Array<ReactElement<StepProps<S>>> | ReactElement<StepProps<S>>;
}

function StepComponent<S extends string>({ children }: StepProps<S>): ReactElement {
  return <>{children}</>;
}

export const useFunnel = <S extends string>(defaultStep: S) => {
  const [step, setStep] = useState<S>(defaultStep);

  const Funnel = useMemo(() => {
    return function FunnelComponent({ children }: FunnelProps<S>) {
      const childArray = React.Children.toArray(children).filter(isValidElement) as Array<ReactElement<StepProps<S>>>;

      const targetStep = childArray.find((childStep) => childStep.props.name === step);

      return targetStep || null;
    };
  }, [step]);

  return { Funnel, Step: StepComponent<S>, setStep, currentStep: step };
};
