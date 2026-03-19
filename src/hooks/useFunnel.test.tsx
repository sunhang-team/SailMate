import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useFunnel } from './useFunnel';

function FunnelTestComponent() {
  const { Funnel, Step, setStep } = useFunnel<'INFO' | 'FORM' | 'COMPLETE'>('INFO');

  return (
    <Funnel>
      <Step name='INFO'>
        <div>
          <h2>피그마 기초 스터디</h2>
          <button onClick={() => setStep('FORM')}>참여 신청하기</button>
        </div>
      </Step>
      <Step name='FORM'>
        <div>
          <h2>모임 신청 폼</h2>
          <button onClick={() => setStep('COMPLETE')}>작성 완료</button>
        </div>
      </Step>
      <Step name='COMPLETE'>
        <div>
          <h2>신청이 완료되었어요!</h2>
        </div>
      </Step>
    </Funnel>
  );
}

describe('useFunnel (상태 기반 다단계 전환)', () => {
  it('설정된 step에 따라 렌더링되는 컴포넌트가 올바르게 전환된다', async () => {
    render(<FunnelTestComponent />);
    const user = userEvent.setup();

    expect(screen.getByText('피그마 기초 스터디')).toBeInTheDocument();
    expect(screen.queryByText('모임 신청 폼')).not.toBeInTheDocument();

    await user.click(screen.getByText('참여 신청하기'));
    expect(screen.getByText('모임 신청 폼')).toBeInTheDocument();
    expect(screen.queryByText('피그마 기초 스터디')).not.toBeInTheDocument();

    await user.click(screen.getByText('작성 완료'));
    expect(screen.getByText('신청이 완료되었어요!')).toBeInTheDocument();
  });
});
