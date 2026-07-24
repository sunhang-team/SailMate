interface CompleteStepProps {
  gatheringId: number | null;
  onAddDetail: () => void;
}

export function CompleteStep({ gatheringId, onAddDetail }: CompleteStepProps) {
  return (
    <div>
      <p>모임 생성이 완료되었어요! (id: {gatheringId})</p>
      <button type='button' onClick={onAddDetail}>
        모임 소개 추가
      </button>
    </div>
  );
}
