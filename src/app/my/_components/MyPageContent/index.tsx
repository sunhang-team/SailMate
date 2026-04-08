import { PendingGatheringsSection } from '../PendingGatheringsSection';
import { SuspenseBoundary } from '@/components/SuspenseBoundary';

import type { MyPageTab, PendingGatheringSort } from '../../_constants';

interface MyPageContentProps {
  activeTab: MyPageTab;
  pendingSort: PendingGatheringSort;
}

const PendingGatheringsSkeleton = () => (
  <div className='mt-6 space-y-4' aria-busy>
    <div className='bg-gray-150 h-9 w-48 max-w-full animate-pulse rounded-md' />
    <div className='bg-gray-0 border-gray-150 h-72 w-full animate-pulse rounded-lg border' />
  </div>
);

export function MyPageContent({ activeTab, pendingSort }: MyPageContentProps) {
  if (activeTab === 'my-gatherings') return <p>나의 모임</p>;
  if (activeTab === 'created-gatherings') return <p>만든 모임</p>;
  if (activeTab === 'pending-gatherings') {
    return (
      <SuspenseBoundary
        pendingFallback={<PendingGatheringsSkeleton />}
        errorFallback={
          <p className='text-body-02-r mt-6 py-10 text-center text-gray-500'>
            대기 중인 모임 목록을 불러오지 못했습니다.
          </p>
        }
      >
        <PendingGatheringsSection pendingSort={pendingSort} />
      </SuspenseBoundary>
    );
  }
  if (activeTab === 'received-reviews') return <p>받은 리뷰</p>;
  if (activeTab === 'liked-gatherings') return <p>찜한 모임</p>;
}
