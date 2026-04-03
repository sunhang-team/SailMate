import React, { isValidElement, useMemo, type ReactElement, type ReactNode } from 'react';

import { useState, useCallback } from 'react';

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
  const [step, setStepState] = useState<S>(defaultStep);
  const [isAnimating, setIsAnimating] = useState(false);

  // Transition handler that wraps the actual state update
  const setStep = useCallback((nextStep: S) => {
    setIsAnimating(true);
    // 300ms match the duration in globals.css (.animate-funnel-out)
    setTimeout(() => {
      setStepState(nextStep);
      setIsAnimating(false);
    }, 300);
  }, []);

  const Funnel = useMemo(() => {
    return function FunnelComponent({ children }: FunnelProps<S>) {
      const childArray = React.Children.toArray(children).filter(isValidElement) as Array<ReactElement<StepProps<S>>>;

      const targetStep = childArray.find((childStep) => childStep.props.name === step);

      if (!targetStep) return null;

      return (
        <div key={step} className={isAnimating ? 'animate-funnel-out' : 'animate-funnel-in'}>
          {targetStep}
        </div>
      );
    };
  }, [step, isAnimating]);

  return { Funnel, Step: StepComponent<S>, setStep, currentStep: step };
};
