import type { ReactNode } from 'react';

export interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string;
  subInfo: ReactNode;
}

export function StatCard({ icon, label, value, subInfo }: StatCardProps) {
  return (
    <div className='border-focus-100 bg-gray-0 shadow-01 flex items-end justify-between rounded-2xl border p-6'>
      <div className='flex flex-col gap-4'>
        <span className='text-small-02-m lg:text-body-02-m text-blue-300'>{label}</span>
        <div className='flex flex-col gap-1'>
          <span className='text-h5-b md:text-h4-b lg:text-h3-b text-gray-900'>{value}</span>
          <div className='text-small-02-r lg:text-small-01-r text-gray-600'>{subInfo}</div>
        </div>
      </div>
      <div className='flex h-18 w-18 shrink-0 items-center justify-center rounded-full bg-blue-50'>{icon}</div>
    </div>
  );
}
