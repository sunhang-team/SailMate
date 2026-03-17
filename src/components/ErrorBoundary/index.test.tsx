import { useState, useEffect } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ErrorBoundary } from '.';

function ThrowError({ shouldThrow = true }: { shouldThrow?: boolean }) {
  if (shouldThrow) throw new Error('Test error');
  return <div>정상 렌더링</div>;
}

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation();
  jest.spyOn(console, 'group').mockImplementation();
  jest.spyOn(console, 'groupEnd').mockImplementation();
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('ErrorBoundary', () => {
  describe('정상 동작', () => {
    it('에러가 없으면 children을 렌더링한다', () => {
      render(
        <ErrorBoundary fallback={<div>에러</div>}>
          <div>정상 콘텐츠</div>
        </ErrorBoundary>,
      );

      expect(screen.getByText('정상 콘텐츠')).toBeInTheDocument();
    });
  });

  describe('에러 발생 시 fallback', () => {
    it('ReactNode fallback을 렌더링한다', () => {
      render(
        <ErrorBoundary fallback={<div>에러 발생</div>}>
          <ThrowError />
        </ErrorBoundary>,
      );

      expect(screen.getByText('에러 발생')).toBeInTheDocument();
      expect(screen.queryByText('정상 렌더링')).not.toBeInTheDocument();
    });

    it('함수형 fallback에 error와 reset을 전달한다', () => {
      render(
        <ErrorBoundary
          fallback={(error, reset) => (
            <div>
              <p>{error.message}</p>
              <button onClick={reset}>재시도</button>
            </div>
          )}
        >
          <ThrowError />
        </ErrorBoundary>,
      );

      expect(screen.getByText('Test error')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '재시도' })).toBeInTheDocument();
    });
  });

  describe('콜백', () => {
    it('에러 발생 시 onError를 호출한다', () => {
      const onError = jest.fn();

      render(
        <ErrorBoundary fallback={<div>에러</div>} onError={onError}>
          <ThrowError />
        </ErrorBoundary>,
      );

      expect(onError).toHaveBeenCalledTimes(1);
      expect(onError).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Test error' }),
        expect.objectContaining({ componentStack: expect.any(String) }),
      );
    });

    it('reset 시 onReset을 호출한다', async () => {
      const onReset = jest.fn();

      render(
        <ErrorBoundary fallback={(_, reset) => <button onClick={reset}>재시도</button>} onReset={onReset}>
          <ThrowError />
        </ErrorBoundary>,
      );

      await userEvent.click(screen.getByRole('button', { name: '재시도' }));

      expect(onReset).toHaveBeenCalledTimes(1);
    });
  });

  describe('리셋', () => {
    it('reset 호출 후 children을 다시 렌더링한다', async () => {
      let shouldThrow = true;

      function ConditionalError() {
        if (shouldThrow) throw new Error('Test error');
        return <div>복구됨</div>;
      }

      render(
        <ErrorBoundary
          fallback={(_, reset) => (
            <button
              onClick={() => {
                shouldThrow = false;
                reset();
              }}
            >
              재시도
            </button>
          )}
        >
          <ConditionalError />
        </ErrorBoundary>,
      );

      expect(screen.getByRole('button', { name: '재시도' })).toBeInTheDocument();

      await userEvent.click(screen.getByRole('button', { name: '재시도' }));

      expect(screen.getByText('복구됨')).toBeInTheDocument();
    });

    it('resetKeys 변경 시 에러 상태를 자동으로 클리어한다', () => {
      let shouldThrow = true;

      function ConditionalError() {
        if (shouldThrow) throw new Error('Test error');
        return <div>복구됨</div>;
      }

      const { rerender } = render(
        <ErrorBoundary fallback={<div>에러</div>} resetKeys={[1]}>
          <ConditionalError />
        </ErrorBoundary>,
      );

      expect(screen.getByText('에러')).toBeInTheDocument();

      shouldThrow = false;

      rerender(
        <ErrorBoundary fallback={<div>에러</div>} resetKeys={[2]}>
          <ConditionalError />
        </ErrorBoundary>,
      );

      expect(screen.getByText('복구됨')).toBeInTheDocument();
    });

    it('resetKeys가 빈 배열이면 리셋되지 않는다', () => {
      const { rerender } = render(
        <ErrorBoundary fallback={<div>에러</div>} resetKeys={[]}>
          <ThrowError />
        </ErrorBoundary>,
      );

      expect(screen.getByText('에러')).toBeInTheDocument();

      rerender(
        <ErrorBoundary fallback={<div>에러</div>} resetKeys={[]}>
          <ThrowError shouldThrow={false} />
        </ErrorBoundary>,
      );

      expect(screen.getByText('에러')).toBeInTheDocument();
    });
  });

  describe('에러 격리', () => {
    it('중첩된 ErrorBoundary에서 가장 가까운 경계가 에러를 잡는다', () => {
      render(
        <ErrorBoundary fallback={<div>외부 에러</div>}>
          <div>
            <ErrorBoundary fallback={<div>내부 에러</div>}>
              <ThrowError />
            </ErrorBoundary>
          </div>
        </ErrorBoundary>,
      );

      expect(screen.getByText('내부 에러')).toBeInTheDocument();
      expect(screen.queryByText('외부 에러')).not.toBeInTheDocument();
    });

    it('여러 children 중 하나만 에러나도 전체 fallback을 표시한다', () => {
      render(
        <ErrorBoundary fallback={<div>에러</div>}>
          <div>정상1</div>
          <ThrowError />
          <div>정상2</div>
        </ErrorBoundary>,
      );

      expect(screen.getByText('에러')).toBeInTheDocument();
      expect(screen.queryByText('정상1')).not.toBeInTheDocument();
      expect(screen.queryByText('정상2')).not.toBeInTheDocument();
    });
  });

  describe('비동기 에러', () => {
    it('setState에서 발생한 에러를 잡는다', async () => {
      function AsyncError() {
        const [, setError] = useState();

        useEffect(() => {
          setTimeout(() => {
            setError(() => {
              throw new Error('Async error');
            });
          }, 0);
        }, []);

        return <div>콘텐츠</div>;
      }

      render(
        <ErrorBoundary fallback={<div>비동기 에러</div>}>
          <AsyncError />
        </ErrorBoundary>,
      );

      await waitFor(() => {
        expect(screen.getByText('비동기 에러')).toBeInTheDocument();
      });
    });
  });
});
