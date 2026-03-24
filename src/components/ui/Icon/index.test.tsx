import { render, screen } from '@testing-library/react';
import { HeartIcon, SearchIcon } from './index';

describe('Icon', () => {
  test('size className should be applied', () => {
    render(<SearchIcon data-testid='search-icon' size={32} className='text-gray-500' />);

    const icon = screen.getByTestId('search-icon');

    expect(icon).toHaveAttribute('width', '32');
    expect(icon).toHaveAttribute('height', '32');
    expect(icon).toHaveClass('text-gray-500');
  });

  test('variant should be applied', () => {
    render(<HeartIcon data-testid='heart-icon' variant='filled' className='text-red-500' />);

    const icon = screen.getByTestId('heart-icon');

    expect(icon).toHaveAttribute('data-variant', 'filled');
    expect(icon).toHaveClass('text-red-500');
  });
});
