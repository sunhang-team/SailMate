import type { IllustrationIconVariant } from '@/components/ui/Icon/IllustrationIcon';

export interface EnergyGradeLevel {
  variant: IllustrationIconVariant;
  label: string;
  rangeText: string;
  min: number;
}

/** 활동 에너지 점수 등급 기준 (오름차순) */
export const ENERGY_GRADE_LEVELS: EnergyGradeLevel[] = [
  { variant: 'smoke', label: '연기 메이트', rangeText: '37.5점 미만', min: 0 },
  { variant: 'firestart', label: '불씨 메이트', rangeText: '37.5~39.9점', min: 37.5 },
  { variant: 'fire', label: '불꽃 메이트', rangeText: '40.0~44.9점', min: 40 },
  { variant: 'sun', label: '태양 메이트', rangeText: '45.0점 이상', min: 45 },
];

export const getEnergyGradeVariant = (score: number): IllustrationIconVariant => {
  // 유효하지 않은 점수는 최하 등급으로
  if (score < 0 || !Number.isFinite(score)) return ENERGY_GRADE_LEVELS[0].variant;

  const matched = [...ENERGY_GRADE_LEVELS].reverse().find((level) => score >= level.min);
  return matched!.variant; // score >= 0이면 항상 매칭됨
};
