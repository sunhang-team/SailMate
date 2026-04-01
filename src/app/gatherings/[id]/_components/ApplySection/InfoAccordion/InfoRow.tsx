interface InfoRowProps {
  icon: React.ReactNode;
  children: React.ReactNode;
}

export function InfoRow({ icon, children }: InfoRowProps) {
  return (
    <li className='text-small-01-r flex items-start gap-4 text-gray-800'>
      {icon}
      <span className='text-body-02-m text-gray-700'>{children}</span>
    </li>
  );
}
