import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ErrorFallback } from '.';

describe('ErrorFallback', () => {
  describe('렌더링', () => {
    it('전달된 에러 메시지를 렌더링한다', () => {
      render(<ErrorFallback message='카테고리를 불러올 수 없습니다.' onRetry={() => {}} />);

      expect(screen.getByText('카테고리를 불러올 수 없습니다.')).toBeInTheDocument();
    });

    it('기본 재시도 버튼 라벨로 "다시 시도"를 렌더링한다', () => {
      render(<ErrorFallback message='에러' onRetry={() => {}} />);

      expect(screen.getByRole('button', { name: '다시 시도' })).toBeInTheDocument();
    });

    it('retryLabel을 지정하면 해당 라벨을 사용한다', () => {
      render(<ErrorFallback message='에러' onRetry={() => {}} retryLabel='새로고침' />);

      expect(screen.getByRole('button', { name: '새로고침' })).toBeInTheDocument();
    });

    it('role=alert를 부여해 보조 기술이 인지할 수 있도록 한다', () => {
      render(<ErrorFallback message='에러' onRetry={() => {}} />);

      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('className prop을 컨테이너에 병합한다', () => {
      render(<ErrorFallback message='에러' onRetry={() => {}} className='custom-cls' />);

      expect(screen.getByRole('alert')).toHaveClass('custom-cls');
    });
  });

  describe('resetErrorBoundary 연동', () => {
    it('재시도 버튼 클릭 시 onRetry 콜백을 호출한다', async () => {
      const user = userEvent.setup();
      const handleRetry = jest.fn();

      render(<ErrorFallback message='에러' onRetry={handleRetry} />);

      await user.click(screen.getByRole('button', { name: '다시 시도' }));

      expect(handleRetry).toHaveBeenCalledTimes(1);
    });
  });
});
