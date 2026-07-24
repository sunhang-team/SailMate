interface ScheduleStepProps {
  onPrev: () => void;
  onCreated: (gatheringId: number) => void;
}

export function ScheduleStep({ onPrev, onCreated }: ScheduleStepProps) {
  return (
    <div>
      <button type='button' onClick={onPrev}>
        이전 단계
      </button>
      <button type='button' onClick={() => onCreated(0)}>
        다음 단계
      </button>
    </div>
  );
}
