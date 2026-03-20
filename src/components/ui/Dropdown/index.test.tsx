import { fireEvent, render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import { Dropdown } from '.';

const TestDropdown = () => (
  <Dropdown>
    <Dropdown.Trigger>
      <span>열기</span>
    </Dropdown.Trigger>
    <Dropdown.Menu>
      <Dropdown.Item>항목 1</Dropdown.Item>
      <Dropdown.Item>항목 2</Dropdown.Item>
    </Dropdown.Menu>
  </Dropdown>
);

describe('Dropdown', () => {
  test('초기 상태에서 Menu가 렌더링되지 않는다', () => {
    render(<TestDropdown />);

    const menu = screen.queryByRole('listbox');

    expect(menu).not.toBeInTheDocument();
  });

  test('Trigger 클릭 시 Menu가 열린다', () => {
    render(<TestDropdown />);

    const trigger = screen.getByRole('button');

    fireEvent.click(trigger);

    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  test('Item 클릭 시 Menu가 닫힌다', async () => {
    render(<TestDropdown />);

    const trigger = screen.getByRole('button');
    fireEvent.click(trigger);

    const item = screen.getByText('항목 1');
    fireEvent.click(item);

    await waitForElementToBeRemoved(() => screen.queryByRole('listbox'));
  });

  test('외부 영역 클릭 시 Menu가 닫힌다', async () => {
    render(<TestDropdown />);

    const trigger = screen.getByRole('button');

    fireEvent.click(trigger);
    fireEvent.mouseDown(document.body);

    await waitForElementToBeRemoved(() => screen.queryByRole('listbox'));
  });
});
