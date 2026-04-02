export const formatDate = (isoDate: string) => isoDate.slice(0, 10);
export const MILLISECONDS_IN_A_DAY = 1000 * 60 * 60 * 24;

export const formatReviewDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 7) {
    return diffDays === 0 ? '오늘' : `${diffDays}일전`;
  }

  return date
    .toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    .replace(/년|월/g, '.')
    .replace('일', '')
    .trim();
};
