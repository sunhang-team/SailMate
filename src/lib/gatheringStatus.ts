import { endOfDay, isPast, parseISO } from 'date-fns';

import { GATHERING_STATUS_LABEL } from '@/constants/gathering';

import type { GatheringStatus } from '@/api/gatherings/types';

export interface GatheringDisplayStatusInput {
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
}: GatheringDisplayStatusInput) => {
  const isFull = currentMembers >= maxMembers;

  // recruitDeadline이 없으면 startDate를 모집 마감일로 간주
  // 날짜만 있는 경우(00:00:00) 해당 일자가 끝날 때까지 유효하도록 endOfDay 처리
  const deadlineDate = recruitDeadline ? endOfDay(parseISO(recruitDeadline)) : endOfDay(parseISO(startDate));

  // date-fns의 isPast는 현재 시점(오늘)보다 이전인지 체크
  const isDeadlinePassed = isPast(deadlineDate);

  // 모임 종료일도 당일 끝까지 포함되도록 endOfDay 처리
  const isFinished = status === 'COMPLETED' || isPast(endOfDay(parseISO(endDate)));

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

export const getJoinButtonText = (params: {
  isFinished: boolean;
  isDeadlinePassed: boolean;
  isFull: boolean;
  hasPendingApplication: boolean;
  status: GatheringStatus;
}) => {
  const { isFinished, isDeadlinePassed, isFull, hasPendingApplication, status } = params;

  if (isFinished) return '완료된 모임';
  if (status === 'IN_PROGRESS' || isDeadlinePassed) return '모집 마감';
  if (isFull) return '모집 완료';
  if (hasPendingApplication) return '참여 대기중';
  return '참여 신청하기';
};
