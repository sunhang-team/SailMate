import type { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';

import { gatheringKeys, gatheringQueries } from '@/api/gatherings/queries';
import { server } from '@/mocks/server';

import { CategoryFilterSection } from '.';

import type { GetCategoriesResponse } from '@/api/gatherings/types';

const MOCK_CATEGORIES: GetCategoriesResponse = {
  categories: [
    { id: 7, name: '개발' },
    { id: 8, name: '어학' },
    { id: 9, name: '독서' },
    { id: 10, name: '자격증' },
    { id: 11, name: '디자인' },
  ],
};

interface RenderOptions {
  prefetched?: GetCategoriesResponse;
}

const renderWithQueryClient = (ui: ReactNode, { prefetched }: RenderOptions = {}) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0, staleTime: Infinity } },
  });

  if (prefetched) {
    queryClient.setQueryData(gatheringQueries.categories().queryKey, prefetched);
  }

  const result = render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
  return { ...result, queryClient };
};

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation();
  jest.spyOn(console, 'group').mockImplementation();
  jest.spyOn(console, 'groupEnd').mockImplementation();
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('CategoryFilterSection (카테고리 ErrorBoundary 동작)', () => {
  describe('정상 동작', () => {
    it('prefetch된 카테고리가 있으면 멀티셀렉트 placeholder를 렌더링한다', () => {
      renderWithQueryClient(<CategoryFilterSection selectedValues={[]} onChange={() => {}} />, {
        prefetched: MOCK_CATEGORIES,
      });

      expect(screen.getByText('카테고리를 선택해주세요')).toBeInTheDocument();
      expect(screen.queryByText('카테고리를 불러올 수 없습니다.')).not.toBeInTheDocument();
    });
  });

  describe('에러 격리', () => {
    it('카테고리 API 실패 시 fallback을 렌더링하고 외부 영역에는 영향을 주지 않는다', async () => {
      server.use(
        http.get('*/v1/gatherings/categories', () =>
          HttpResponse.json({ success: false, data: null, message: '서버 오류' }, { status: 500 }),
        ),
      );

      renderWithQueryClient(
        <div>
          <div>키워드 필터 영역</div>
          <CategoryFilterSection selectedValues={[]} onChange={() => {}} />
          <div>타입 필터 영역</div>
        </div>,
      );

      await waitFor(() => {
        expect(screen.getByText('카테고리를 불러올 수 없습니다.')).toBeInTheDocument();
      });

      // 카테고리 섹션 내부의 ErrorBoundary가 에러를 잡아 외부 영역으로 전파되지 않는다
      expect(screen.getByText('키워드 필터 영역')).toBeInTheDocument();
      expect(screen.getByText('타입 필터 영역')).toBeInTheDocument();
      expect(screen.queryByText('카테고리를 선택해주세요')).not.toBeInTheDocument();
    });

    it('에러 fallback에 다시 시도 버튼이 노출된다', async () => {
      server.use(
        http.get('*/v1/gatherings/categories', () =>
          HttpResponse.json({ success: false, data: null, message: '서버 오류' }, { status: 500 }),
        ),
      );

      renderWithQueryClient(<CategoryFilterSection selectedValues={[]} onChange={() => {}} />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: '다시 시도' })).toBeInTheDocument();
      });
    });

    it('다시 시도 버튼 클릭 시 카테고리 쿼리 캐시를 reset하여 refetch와 ErrorBoundary 리셋이 함께 일어난다', async () => {
      server.use(
        http.get('*/v1/gatherings/categories', () =>
          HttpResponse.json({ success: false, data: null, message: '서버 오류' }, { status: 500 }),
        ),
      );

      const user = userEvent.setup();

      const { queryClient } = renderWithQueryClient(<CategoryFilterSection selectedValues={[]} onChange={() => {}} />);
      const resetQueriesSpy = jest.spyOn(queryClient, 'resetQueries');

      // 첫 fetch 실패로 fallback 노출까지 대기
      const retryButton = await screen.findByRole('button', { name: '다시 시도' });

      await user.click(retryButton);

      // ErrorBoundary의 onReset이 호출되어 카테고리 쿼리 캐시를 resetQueries로 초기화한다.
      // resetQueries는 활성 observer가 있으면 자동으로 refetch를 트리거하므로,
      // 이 호출 하나로 "refetch + ErrorBoundary 리셋"이 모두 연결된다.
      expect(resetQueriesSpy).toHaveBeenCalledWith({ queryKey: gatheringKeys.categories() });
    });
  });
});
