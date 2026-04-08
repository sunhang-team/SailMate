import { isPast, parseISO } from 'date-fns';
import { GATHERING_STATUS_LABEL } from '@/constants/gathering';
import type { GatheringStatus } from '@/api/gatherings/types';

interface GetGatheringDisplayStatusParams {
  status: GatheringStatus;
  currentMembers: number;
  maxMembers: number;
  startDate: string;
  endDate: string;
  recruitDeadline?: string | null;
}

/**
 * 모임의 실시간 상태와 시각적 태그 정보를 판별하는 공통 유틸리티
 */
export const getGatheringDisplayStatus = ({
  status,
  currentMembers,
  maxMembers,
  startDate,
  endDate,
  recruitDeadline,
}: GetGatheringDisplayStatusParams) => {
  const isFull = currentMembers >= maxMembers;
  // recruitDeadline이 없으면 startDate를 모집 마감일로 간주
  const deadlineDate = recruitDeadline ? parseISO(recruitDeadline) : parseISO(startDate);
  // date-fns의 isPast는 현재 시점(오늘)보다 이전인지 체크
  const isDeadlinePassed = isPast(deadlineDate);
  const isFinished = status === 'COMPLETED' || isPast(parseISO(endDate));

  // 1. 시각적 태그 상태 (recruiting | progressing | completed)
  let tagState: 'recruiting' | 'progressing' | 'completed' = 'recruiting';

  // 2. 표시용 텍스트
  let displayLabel: string = GATHERING_STATUS_LABEL[status];

  // 상세 분기 로직
  if (isFinished) {
    displayLabel = '진행완료';
    tagState = 'completed';
  } else if (status === 'IN_PROGRESS' || isDeadlinePassed || isFull) {
    // 이미 시작했거나, 모집 기한이 지났거나, 정원이 찬 경우 모두 '진행중'으로 통일
    displayLabel = '진행중';
    tagState = 'progressing';
  } else {
    // 순수하게 모집 중인 경우
    displayLabel = '모집중';
    tagState = 'recruiting';
  }

  // 참가 가능 여부 (참여 신청 버튼 활성화용)
  const isJoinable = status === 'RECRUITING' && !isFull && !isDeadlinePassed;

  return {
    displayLabel,
    tagState,
    isJoinable,
    isFull,
    isDeadlinePassed,
    isFinished,
  };
};
