const REPUTATION_THRESHOLDS = [
  { min: 70, label: '불꽃 메이트' },
  { min: 50, label: '신뢰 메이트' },
  { min: 30, label: '불씨 메이트' },
] as const;

const DEFAULT_LABEL = '참여 메이트';

export const getReputationLabel = (score: number): string => {
  return REPUTATION_THRESHOLDS.find((t) => score >= t.min)?.label ?? DEFAULT_LABEL;
};
