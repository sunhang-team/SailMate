import { cn } from '@/lib/cn';

import { Card } from '../Card';

interface GatheringCardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function GatheringCardHeader({ children, className }: GatheringCardHeaderProps) {
  return <div className={cn('mb-6 flex justify-between', className)}>{children}</div>;
}

interface GatheringCardBodyProps {
  children: React.ReactNode;
  className?: string;
}

export function GatheringCardBody({ children, className }: GatheringCardBodyProps) {
  return <div className={cn('flex flex-col gap-3', className)}>{children}</div>;
}

interface GatheringCardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function GatheringCardFooter({ children, className }: GatheringCardFooterProps) {
  return <div className={cn('flex gap-2', className)}>{children}</div>;
}

interface GatheringCardRootProps {
  children: React.ReactNode;
  className?: string;
}

function GatheringCardRoot({ children, className }: GatheringCardRootProps) {
  return <Card className={cn('p-7', className)}>{children}</Card>;
}

export const GatheringCard = Object.assign(GatheringCardRoot, {
  Header: GatheringCardHeader,
  Body: GatheringCardBody,
  Footer: GatheringCardFooter,
});
