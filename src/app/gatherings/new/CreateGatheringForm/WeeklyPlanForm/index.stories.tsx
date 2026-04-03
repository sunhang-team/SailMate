import { useForm } from 'react-hook-form';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { WeeklyPlanForm } from '.';

import type { GatheringFormPartial } from '@/api/gatherings/types';

interface WeeklyPlanFormStoryArgs {
  totalWeeks: number;
}

const meta = {
  title: 'app/CreateGatheringForm/WeeklyPlanForm',
  args: {
    totalWeeks: 1,
  },
  argTypes: {
    totalWeeks: {
      control: { type: 'number', min: 0, step: 1 },
    },
  },
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta<WeeklyPlanFormStoryArgs>;

export default meta;

type Story = StoryObj<WeeklyPlanFormStoryArgs>;

function WeeklyPlanFormStory({ totalWeeks }: WeeklyPlanFormStoryArgs) {
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
  args: {
    totalWeeks: 1,
  },
  render: (args) => <WeeklyPlanFormStory totalWeeks={args.totalWeeks} />,
};

export const ThreeWeeks: Story = {
  args: {
    totalWeeks: 3,
  },
  render: (args) => <WeeklyPlanFormStory totalWeeks={args.totalWeeks} />,
};
