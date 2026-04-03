export type WeatherLevel = 'sunny' | 'cloudy' | 'stormy';

/** 남은 거리 (km): (100 - teamOverallRate) / 10 */
export const calculateRemainingDistance = (teamOverallRate: number): number =>
  Math.round(((100 - teamOverallRate) / 10) * 10) / 10;

/** 팀 HP (0~100): 멤버별 overallRate 평균 */
export const calculateTeamHP = (members: { overallRate: number }[]): number => {
  if (members.length === 0) return 100;
  return Math.round(members.reduce((sum, m) => sum + m.overallRate, 0) / members.length);
};

/** 거리 프로그레스 (0~100%): teamOverallRate 그대로 사용 */
export const calculateDistanceProgress = (teamOverallRate: number): number =>
  Math.min(100, Math.max(0, teamOverallRate));

/** 배 위치 (0~1): teamOverallRate / 100 */
export const calculateBoatPosition = (teamOverallRate: number): number =>
  Math.min(1, Math.max(0, teamOverallRate / 100));

/** 날씨 단계: HP 기반 3단계 */
export const getWeatherLevel = (hp: number): WeatherLevel => {
  if (hp >= 70) return 'sunny';
  if (hp >= 40) return 'cloudy';
  return 'stormy';
};

/** HP 수치 색상 클래스 */
export const getHPColorClass = (hp: number): string => {
  if (hp >= 70) return 'text-gray-700';
  if (hp >= 40) return 'text-orange-200';
  return 'text-red-200';
};
