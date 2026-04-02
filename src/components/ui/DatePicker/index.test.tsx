import { fireEvent, render, screen } from '@testing-library/react';

import { DatePicker } from '.';

describe('DatePicker', () => {
  it('입력 버튼 클릭 시 캘린더가 열린다', () => {
    render(<DatePicker value='' onChange={jest.fn()} placeholder='날짜를 선택해주세요' />);

    fireEvent.click(screen.getByRole('button', { name: /날짜를 선택해주세요/i }));

    expect(screen.getByText(/\d{4}년 \d{1,2}월/)).toBeInTheDocument();
  });

  it('날짜 클릭 시 YYYY-MM-DD 형식으로 onChange를 호출한다', () => {
    const onChange = jest.fn();
    render(<DatePicker value='2026-03-27' onChange={onChange} />);

    fireEvent.click(screen.getByRole('button', { name: /2026 - 03 - 27/i }));
    fireEvent.click(screen.getByRole('button', { name: '28' }));

    expect(onChange).toHaveBeenCalledWith(expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/));
  });

  it('외부 클릭 시 캘린더가 닫힌다', () => {
    render(<DatePicker value='' onChange={jest.fn()} placeholder='날짜를 선택해주세요' />);

    fireEvent.click(screen.getByRole('button', { name: /날짜를 선택해주세요/i }));
    expect(screen.getByText(/\d{4}년 \d{1,2}월/)).toBeInTheDocument();

    fireEvent.mouseDown(document.body);
    expect(screen.queryByText(/\d{4}년 \d{1,2}월/)).not.toBeInTheDocument();
  });
});
