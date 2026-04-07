'use client';

import { useState } from 'react';

import { useFunnel } from '@/hooks/useFunnel';

import { EmailStep } from './EmailStep';
import { LoginStep } from './LoginStep';
import { RegisterStep } from './RegisterStep';

interface AuthFunnelProps {
  onSuccess: () => void;
}

export function AuthFunnel({ onSuccess }: AuthFunnelProps) {
  const { Funnel, Step, setStep } = useFunnel<'EMAIL' | 'LOGIN' | 'REGISTER'>('EMAIL');
  const [certifiedEmail, setCertifiedEmail] = useState('');

  return (
    <Funnel>
      <Step name='EMAIL'>
        <EmailStep
          onResolved={(email, isAvailable) => {
            setCertifiedEmail(email);
            if (isAvailable) {
              setStep('REGISTER');
            } else {
              setStep('LOGIN');
            }
          }}
        />
      </Step>
      <Step name='LOGIN'>
        <LoginStep email={certifiedEmail} onSuccess={onSuccess} onBack={() => setStep('EMAIL')} />
      </Step>
      <Step name='REGISTER'>
        <RegisterStep email={certifiedEmail} onSuccess={onSuccess} onBack={() => setStep('EMAIL')} />
      </Step>
    </Funnel>
  );
}
