import { type ReactNode } from 'react';

type TagBaseProps = Omit<React.ComponentProps<'span'>, 'color' | 'children'>;

interface CategoryTagProps extends TagBaseProps {
  variant: 'category';
  icon: ReactNode;
  label: string;
  sublabel: string;
}

interface DeadlineTagProps extends TagBaseProps {
  variant: 'deadline';
  state: 'goal' | 'warning';
  children: ReactNode;
}

interface DayTagProps extends TagBaseProps {
  variant: 'day';
  state: 'short' | 'relax';
  children: ReactNode;
}

interface InfoTagProps extends TagBaseProps {
  variant: 'info';
  state: 'good' | 'bad';
  children: ReactNode;
}

interface DurationTagProps extends TagBaseProps {
  variant: 'duration';
  children: ReactNode;
}

interface HashtagTagProps extends TagBaseProps {
  variant: 'hashtag';
  onRemove: () => void;
  children: ReactNode;
}

interface GoodTagProps extends TagBaseProps {
  variant: 'good';
  count: number;
  children: ReactNode;
}

interface BadTagProps extends TagBaseProps {
  variant: 'bad';
  count: number;
  children: ReactNode;
}

interface MateTagProps extends TagBaseProps {
  variant: 'mate';
  children: ReactNode;
}

interface StatusTagProps extends TagBaseProps {
  variant: 'status';
  state: 'progressing' | 'completed' | 'recruiting';
  children: ReactNode;
}

interface EmailTagProps extends TagBaseProps {
  variant: 'email';
  children: ReactNode;
}

interface CoreFeatureTagProps extends TagBaseProps {
  variant: 'coreFeature';
  children: ReactNode;
}

interface CoreFeatureSmallTagProps extends TagBaseProps {
  variant: 'coreFeatureSmall';
  children: ReactNode;
}

interface RouteTagProps extends TagBaseProps {
  variant: 'route';
  children: ReactNode;
}

export type TagProps =
  | CategoryTagProps
  | DeadlineTagProps
  | DayTagProps
  | InfoTagProps
  | DurationTagProps
  | HashtagTagProps
  | GoodTagProps
  | BadTagProps
  | MateTagProps
  | StatusTagProps
  | EmailTagProps
  | CoreFeatureTagProps
  | CoreFeatureSmallTagProps
  | RouteTagProps;
