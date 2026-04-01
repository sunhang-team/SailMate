import { useForm } from 'react-hook-form';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { WeeklyPlanForm } from '.';

import type { GatheringFormPartial } from '@/api/gatherings/types';

const meta = {
  title: 'app/CreateGatheringForm/WeeklyPlanForm',
  component: WeeklyPlanForm,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta<typeof WeeklyPlanForm>;

export default meta;

type Story = StoryObj<typeof meta>;

function WeeklyPlanFormStory({ totalWeeks }: { totalWeeks: number }) {
  const { control, register, formState } = useForm<GatheringFormPartial>({
    defaultValues: {
      weeklyGuides: [],
    },
  });

  return (
    <div className='w-full max-w-[840px]'>
      <WeeklyPlanForm control={control} register={register} errors={formState.errors} totalWeeks={totalWeeks} />
    </div>
  );
}

export const OneWeek: Story = {
  render: () => <WeeklyPlanFormStory totalWeeks={1} />,
};

export const ThreeWeeks: Story = {
  render: () => <WeeklyPlanFormStory totalWeeks={3} />,
};
