'use client';

interface StatRow {
  label: string;
  value: string;
}

interface ActivityStatsSectionProps {
  rows: StatRow[];
  variant: 'tablet' | 'wide';
}

export function ActivityStatsSection({ rows, variant }: ActivityStatsSectionProps) {
  if (variant === 'tablet') {
    return (
      <div className='border-gray-150 border-t pt-6 md:pt-7'>
        <p className='text-body-02-sb md:text-body-01-sb mb-5 text-gray-900 md:mb-6'>활동 통계</p>
        <dl className='flex flex-col gap-4'>
          {rows.map((row) => (
            <div key={row.label} className='text-small-02-m md:text-small-01-m flex items-center justify-between'>
              <dt className='shrink-0 text-gray-800'>{row.label}</dt>
              <dd className='text-small-02-sb md:text-small-01-sb text-gray-700'>{row.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    );
  }

  return (
    <div className='border-gray-150 mt-6 border-t pt-7'>
      <p className='text-body-01-sb mb-6 text-gray-900'>활동 통계</p>
      <dl className='flex flex-col gap-4'>
        {rows.map((row) => (
          <div key={row.label} className='text-body-02-m flex items-center justify-between'>
            <dt className='shrink-0 text-gray-800'>{row.label}</dt>
            <dd className='text-body-01-sb text-gray-700'>{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
