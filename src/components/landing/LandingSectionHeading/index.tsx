import { cn } from '@/lib/cn';

interface LandingSectionHeadingProps {
  eyebrow: string;
  title: string;
  className?: string;
  align?: 'center' | 'left';
}

export function LandingSectionHeading({ eyebrow, title, className, align = 'center' }: LandingSectionHeadingProps) {
  return (
    <div
      className={cn(
        'flex max-w-[800px] flex-col gap-2',
        align === 'center' && 'mx-auto items-center text-center',
        align === 'left' && 'items-start text-left',
        className,
      )}
    >
      <p className='text-body-01-sb text-blue-300'>{eyebrow}</p>
      <h2 className='text-body-01-b lg:text-h2-b md:text-h3-b text-blue-500'>{title}</h2>
    </div>
  );
}
