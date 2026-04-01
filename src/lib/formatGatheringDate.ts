import { differenceInDays, format, startOfDay } from 'date-fns';

/** ISO 날짜 문자열을 "yyyy.MM.dd" 형식으로 변환 */
export const formatDateDot = (dateString: string): string => {
  return format(new Date(dateString), 'yyyy.MM.dd');
};

/** ISO 날짜 문자열을 "M/d" 형식으로 변환 (예: "3/15") */
export const formatDateShort = (dateString: string): string => {
  return format(new Date(dateString), 'M/d');
};

/** 대상 날짜까지의 D-day 텍스트 반환 ("D-3" | "D-Day" | "D+1") */
export const formatDday = (targetDateString: string): string => {
  const today = startOfDay(new Date());
  const target = startOfDay(new Date(targetDateString));
  const diff = differenceInDays(target, today);

  if (diff > 0) return `D-${diff}`;
  if (diff === 0) return 'D-Day';
  return `D+${Math.abs(diff)}`;
};
