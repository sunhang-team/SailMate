interface InfoCardProps {
  title: string;
  children: React.ReactNode;
}

export function InfoCard({ title, children }: InfoCardProps) {
  return (
    <div className='flex flex-col gap-3 xl:gap-6'>
      <h2 className='text-body-01-sb xl:text-h5-sb text-gray-900'>{title}</h2>
      <div className='flex h-[51px] items-center rounded-lg bg-gray-100 px-4 xl:h-20 xl:px-7'>{children}</div>
    </div>
  );
}
