interface BasicInfoStepProps {
  onNext: () => void;
}

export function BasicInfoStep({ onNext }: BasicInfoStepProps) {
  return (
    <button type='button' onClick={onNext}>
      다음 단계
    </button>
  );
}
