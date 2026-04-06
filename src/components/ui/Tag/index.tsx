import { type ReactNode } from 'react';

import { cva } from 'class-variance-authority';

import { ArrowIcon, CloseIcon, CompletedIcon, ProgressIcon, RecruitingIcon } from '@/components/ui/Icon';
import { cn } from '@/lib/cn';

import { RemoveButton } from './RemoveButton';

import type { TagProps } from './types';

const tagVariants = cva('inline-flex w-fit items-center justify-center rounded-lg whitespace-nowrap', {
  variants: {
    variant: {
      category: 'bg-gray-150 text-blue-500 px-3 py-1 gap-1',
      deadline: 'text-small-02-m px-3 py-1',
      day: 'text-body-02-m px-5 py-1.5',
      info: 'text-small-02-m px-3 py-1 gap-0.5',
      duration: 'bg-gray-150 text-gray-600 text-small-02-m px-3 py-1',
      hashtag: 'bg-gray-150 text-gray-700 text-body-01-r px-3 py-1 gap-0.5',
      good: 'bg-blue-100 text-blue-300 text-body-02-m px-3 py-1 gap-1',
      bad: 'bg-gray-150 text-gray-600 text-body-02-m px-3 py-1 gap-1',
      mate: 'bg-gray-100 text-gradient-primary border-gradient-primary text-small-02-m px-3 py-1',
      status: 'text-small-01-sb px-3 py-1 gap-1',
      email: 'bg-gray-150 text-gray-400 lg:text-body-01-r px-3 py-1 md:text-body-02-r text-small-01-r',
      filter:
        'cursor-pointer gap-[2px] bg-blue-300 text-gray-0 text-small-02-r px-2 py-1 gap-1 [&_button]:text-gray-0 [&_svg]:size-4',
      coreFeature: 'bg-blue-100 text-blue-300 px-3 py-1 gap-1 text-small-01-sb',
      coreFeatureSmall: 'bg-blue-100 text-blue-300 px-3 py-1 gap-1 text-small-02-sb',
      route:
        'h-[27px] w-[65px] rounded-xl bg-blue-100 text-small-01-sb text-blue-300 md:h-[34px] md:w-[78px] md:text-body-02-sb lg:h-[40px] lg:w-[91px] lg:text-body-01-sb',
    },
    state: {
      goal: '',
      warning: '',
      short: '',
      relax: '',
      good: '',
      bad: '',
      progressing: '',
      completed: '',
      recruiting: '',
    },
  },
  compoundVariants: [
    { variant: 'deadline', state: 'goal', class: 'bg-blue-100 text-blue-300' },
    { variant: 'deadline', state: 'warning', class: 'bg-red-100 text-red-200' },
    { variant: 'day', state: 'short', class: 'bg-gray-0 text-red-200' },
    { variant: 'day', state: 'relax', class: 'bg-gray-0 text-blue-300' },
    { variant: 'info', state: 'good', class: 'bg-blue-100 text-blue-300' },
    { variant: 'info', state: 'bad', class: 'bg-orange-100 text-orange-200' },
    { variant: 'status', state: 'progressing', class: 'bg-blue-300 text-gray-0' },
    { variant: 'status', state: 'completed', class: 'bg-gray-700 text-gray-0' },
    { variant: 'status', state: 'recruiting', class: 'bg-blue-200 text-gray-0' },
  ],
});

const STATUS_ICON_MAP = {
  progressing: ProgressIcon,
  completed: CompletedIcon,
  recruiting: RecruitingIcon,
} as const;

const DOMAIN_KEYS = new Set([
  'variant',
  'state',
  'icon',
  'label',
  'sublabel',
  'count',
  'onRemove',
  'children',
  'className',
]);

const extractSpanProps = (props: TagProps) => {
  const spanProps: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(props)) {
    if (!DOMAIN_KEYS.has(key)) spanProps[key] = value;
  }
  return spanProps;
};

const renderContent = (props: TagProps): ReactNode => {
  switch (props.variant) {
    case 'category':
      return (
        <>
          {props.icon}
          <span className='text-small-01-sb'>{props.label}</span>
          <ArrowIcon size={14} direction='right' />
          <span className='text-small-01-r'>{props.sublabel}</span>
        </>
      );
    case 'status': {
      const StatusIcon = STATUS_ICON_MAP[props.state];
      return (
        <>
          <StatusIcon size={14} />
          {props.children}
        </>
      );
    }
    case 'good':
    case 'bad':
      return (
        <>
          {props.children}
          <CloseIcon size={24} className='text-gray-400' />
          <span className={cn('text-body-02-m', props.variant === 'bad' ? 'text-gray-700' : 'text-gray-600')}>
            {props.count}
          </span>
        </>
      );
    case 'hashtag':
    case 'filter':
      return (
        <>
          {props.children}
          <RemoveButton onRemove={props.onRemove} />
        </>
      );
    default:
      return 'children' in props ? props.children : null;
  }
};

export function Tag(props: TagProps) {
  const state = 'state' in props ? props.state : undefined;
  const className = props.className;
  const spanProps = extractSpanProps(props);

  return (
    <span
      data-slot='tag'
      data-variant={props.variant}
      className={cn(tagVariants({ variant: props.variant, state }), className)}
      {...spanProps}
    >
      {renderContent(props)}
    </span>
  );
}

export { tagVariants };
export type { TagProps } from './types';
