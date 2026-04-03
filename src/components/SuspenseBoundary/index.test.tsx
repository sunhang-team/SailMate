import type { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { SuspenseBoundary } from '.';

function ThrowError(): ReactNode {
  throw new Error('Test error');
}

function SuspendingComponent(): ReactNode {
  throw new Promise(() => {});
}

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation();
  jest.spyOn(console, 'group').mockImplementation();
  jest.spyOn(console, 'groupEnd').mockImplementation();
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('SuspenseBoundary', () => {
  describe('정상 동작', () => {
    it('children을 정상적으로 렌더링한다', () => {
      render(
        <SuspenseBoundary pendingFallback={<div>로딩중</div>} errorFallback={<div>에러</div>}>
          <div>콘텐츠</div>
        </SuspenseBoundary>,
      );

      expect(screen.getByText('콘텐츠')).toBeInTheDocument();
    });
  });

  describe('로딩 상태', () => {
    it('Suspense 트리거 시 pendingFallback을 렌더링한다', () => {
      render(
        <SuspenseBoundary pendingFallback={<div>로딩중</div>} errorFallback={<div>에러</div>}>
          <SuspendingComponent />
        </SuspenseBoundary>,
      );

      expect(screen.getByText('로딩중')).toBeInTheDocument();
      expect(screen.queryByText('로딩 완료')).not.toBeInTheDocument();
    });
  });

  describe('에러 상태', () => {
    it('에러 발생 시 errorFallback을 렌더링한다', () => {
      render(
        <SuspenseBoundary pendingFallback={<div>로딩중</div>} errorFallback={<div>에러 발생</div>}>
          <ThrowError />
        </SuspenseBoundary>,
      );

      expect(screen.getByText('에러 발생')).toBeInTheDocument();
    });

    it('함수형 errorFallback에 error와 reset을 전달한다', () => {
      render(
        <SuspenseBoundary
          pendingFallback={<div>로딩중</div>}
          errorFallback={(error, reset) => (
            <div>
              <p>{error.message}</p>
              <button onClick={reset}>재시도</button>
            </div>
          )}
        >
          <ThrowError />
        </SuspenseBoundary>,
      );

      expect(screen.getByText('Test error')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '재시도' })).toBeInTheDocument();
    });

    it('에러 발생 시 onError를 호출한다', () => {
      const onError = jest.fn();

      render(
        <SuspenseBoundary pendingFallback={<div>로딩중</div>} errorFallback={<div>에러</div>} onError={onError}>
          <ThrowError />
        </SuspenseBoundary>,
      );

      expect(onError).toHaveBeenCalledTimes(1);
      expect(onError).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Test error' }),
        expect.objectContaining({ componentStack: expect.any(String) }),
      );
    });
  });

  describe('에러 격리', () => {
    it('중첩된 SuspenseBoundary는 독립적으로 동작한다', () => {
      render(
        <SuspenseBoundary pendingFallback={<div>외부 로딩</div>} errorFallback={<div>외부 에러</div>}>
          <div>외부 콘텐츠</div>
          <SuspenseBoundary pendingFallback={<div>내부 로딩</div>} errorFallback={<div>내부 에러</div>}>
            <SuspendingComponent />
          </SuspenseBoundary>
        </SuspenseBoundary>,
      );

      expect(screen.getByText('외부 콘텐츠')).toBeInTheDocument();
      expect(screen.getByText('내부 로딩')).toBeInTheDocument();
      expect(screen.queryByText('외부 로딩')).not.toBeInTheDocument();
    });
  });

  describe('에러 복구', () => {
    it('함수형 errorFallback의 reset으로 children을 복구한다', async () => {
      let shouldThrow = true;

      function Component(): ReactNode {
        if (shouldThrow) throw new Error('Test');
        return <div>복구됨</div>;
      }

      render(
        <SuspenseBoundary
          pendingFallback={<div>로딩</div>}
          errorFallback={(error, reset) => (
            <div>
              <p>에러: {error.message}</p>
              <button
                onClick={() => {
                  shouldThrow = false;
                  reset();
                }}
              >
                복구
              </button>
            </div>
          )}
        >
          <Component />
        </SuspenseBoundary>,
      );

      expect(screen.getByText('에러: Test')).toBeInTheDocument();

      await userEvent.click(screen.getByRole('button', { name: '복구' }));

      expect(screen.getByText('복구됨')).toBeInTheDocument();
    });
  });
});
