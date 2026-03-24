import type { ComponentType } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { iconsRegistry } from './iconsRegistry';
import type { IconProps } from './types';

const meta = {
  title: 'components/Icon',
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Gallery: Story = {
  render: () => (
    <div className='space-y-8'>
      {Object.entries(iconsRegistry).map(([name, item]) => {
        const IconComponent = item.component;
        const VariantIconComponent = IconComponent as ComponentType<IconProps & { variant?: string }>;
        const variants = item.variants ?? ['default'];

        return (
          <section key={name} className='space-y-3'>
            <h3 className='text-sm font-semibold'>{name}</h3>
            <div className='flex flex-wrap gap-4'>
              {variants.map((variant) => (
                <div key={variant} className='flex min-w-[96px] flex-col items-center gap-2 rounded border p-3'>
                  {variant === 'default' ? (
                    <IconComponent size={24} className='text-gray-700' />
                  ) : (
                    <VariantIconComponent size={24} className='text-gray-700' variant={variant} />
                  )}
                  <span className='text-xs text-gray-500'>{variant}</span>
                </div>
              ))}
              {!item.fixedColor && (
                <div className='flex min-w-[96px] flex-col items-center gap-2 rounded border p-3'>
                  <IconComponent size={24} className='text-red-500' />
                  <span className='text-xs text-gray-500'>text-red-500</span>
                </div>
              )}
            </div>
          </section>
        );
      })}
    </div>
  ),
};
