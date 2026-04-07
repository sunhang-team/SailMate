import { SuspenseBoundary } from '@/components/SuspenseBoundary';

import { MyGatheringsList } from '../MyGatheringsList';

import type { MyPageTab } from '../../_constants';

interface MyPageContentProps {
  activeTab: MyPageTab;
}

export function MyPageContent({ activeTab }: MyPageContentProps) {
  if (activeTab === 'my-gatherings')
    return (
      <SuspenseBoundary
        pendingFallback={<div className='flex h-40 items-center justify-center text-gray-400'>불러오는 중...</div>}
        errorFallback={
          <p className='flex h-40 items-center justify-center text-gray-500'>모임을 불러올 수 없습니다.</p>
        }
      >
        <MyGatheringsList />
      </SuspenseBoundary>
    );
  if (activeTab === 'created-gatherings') return <p>만든 모임</p>;
  if (activeTab === 'pending-gatherings') return <p>대기중인 모임</p>;
  if (activeTab === 'received-reviews') return <p>받은 리뷰</p>;
  if (activeTab === 'liked-gatherings') return <p>찜한 모임</p>;
}
