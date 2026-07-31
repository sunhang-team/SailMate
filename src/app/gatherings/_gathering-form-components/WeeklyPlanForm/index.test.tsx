import { fireEvent, render, screen } from '@testing-library/react';
import { useForm } from 'react-hook-form';

import { WeeklyPlanForm } from '.';

import type { GatheringFormPartial } from '@/api/gatherings/types';

interface TestHarnessProps {
  totalWeeks: number;
}

function TestHarness({ totalWeeks }: TestHarnessProps) {
  const { control, register, formState } = useForm<GatheringFormPartial>({
    defaultValues: {
      weeklyGuides: [],
    },
  });

  return <WeeklyPlanForm control={control} register={register} errors={formState.errors} totalWeeks={totalWeeks} />;
}

describe('WeeklyPlanForm', () => {
  it('"다음 주차 추가" 버튼을 누르면 주차 입력 폼이 순서대로 추가된다', () => {
    render(<TestHarness totalWeeks={2} />);

    fireEvent.click(screen.getByRole('button', { name: /주차별 계획/i }));

    fireEvent.click(screen.getByRole('button', { name: /\+ 다음 주차 추가/i }));
    expect(screen.getByText('1주차')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /\+ 다음 주차 추가/i }));
    expect(screen.getByText('2주차')).toBeInTheDocument();
  });

  it('totalWeeks가 줄어들면 주차 입력 필드가 자동으로 줄어든다', () => {
    const { rerender } = render(<TestHarness totalWeeks={3} />);

    fireEvent.click(screen.getByRole('button', { name: /주차별 계획/i }));

    fireEvent.click(screen.getByRole('button', { name: /\+ 다음 주차 추가/i }));
    fireEvent.click(screen.getByRole('button', { name: /\+ 다음 주차 추가/i }));
    fireEvent.click(screen.getByRole('button', { name: /\+ 다음 주차 추가/i }));
    expect(screen.getByText('3주차')).toBeInTheDocument();

    rerender(<TestHarness totalWeeks={1} />);

    expect(screen.queryByText('3주차')).not.toBeInTheDocument();
    expect(screen.getByText('1주차')).toBeInTheDocument();
  });
});
