'use client';

import type { MyPageTab } from '../../_constants';

interface MyPageContentProps {
  activeTab: MyPageTab;
}

export function MyPageContent({ activeTab }: MyPageContentProps) {
  if (activeTab === 'my-gatherings') return <p>나의 모임</p>;
  if (activeTab === 'created-gatherings') return <p>만든 모임</p>;
  if (activeTab === 'pending-gatherings') return <p>대기중인 모임</p>;
  if (activeTab === 'received-reviews') return <p>받은 리뷰</p>;
  if (activeTab === 'liked-gatherings') return <p>찜한 모임</p>;
}
