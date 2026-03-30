/**
 * 페이지네이션에 표시할 페이지 번호 배열을 반환합니다.
 * 페이지 수가 많을 때 현재 페이지 주변만 보여주고 나머지는 '...'로 축약합니다.
 */
const ELLIPSIS_THRESHOLD = 7; // 이 값 이하면 전체 페이지 표시, 초과하면 ... 사용

export const getPageRange = (currentPage: number, totalPages: number): (number | '...')[] => {
  if (totalPages <= ELLIPSIS_THRESHOLD) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // 현재 페이지 기준 양쪽으로 보여줄 페이지 수
  // delta=1 → currentPage ±1 (ex. 10이면 9, 10, 11)
  const delta = 1;

  // 항상 포함할 페이지: 첫 페이지(1), 마지막 페이지, 현재 페이지 ±delta
  // filter로 1~totalPages 범위를 벗어난 값 제거, Set으로 중복 제거
  const rangeSet = new Set(
    [1, totalPages, ...Array.from({ length: delta * 2 + 1 }, (_, i) => currentPage - delta + i)].filter(
      (p) => p >= 1 && p <= totalPages,
    ),
  );

  const sorted = Array.from(rangeSet).sort((a, b) => a - b);
  const result: (number | '...')[] = [];

  for (let i = 0; i < sorted.length; i++) {
    if (i > 0) {
      const gap = sorted[i] - sorted[i - 1];
      // 갭이 정확히 2면 '...' 대신 중간 숫자를 채움 (ex. 3→5이면 4 삽입)
      if (gap === 2) result.push(sorted[i] - 1);
      // 갭이 3 이상이면 '...' 삽입
      else if (gap > 2) result.push('...');
    }
    result.push(sorted[i]);
  }

  return result;
};
