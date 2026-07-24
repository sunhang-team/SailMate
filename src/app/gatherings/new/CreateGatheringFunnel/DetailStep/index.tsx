interface DetailStepProps {
  gatheringId: number;
}

export function DetailStep({ gatheringId }: DetailStepProps) {
  return <div data-gathering-id={gatheringId} />;
}
