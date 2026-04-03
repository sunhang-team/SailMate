interface AuthDividerProps {
  text: string;
}

export function AuthDivider({ text }: AuthDividerProps) {
  return (
    <div className='mb-8 flex h-5.5 items-center gap-4'>
      <div className='h-px flex-1 bg-gray-200' />
      <span className='text-small-01-r text-gray-400'>{text}</span>
      <div className='h-px flex-1 bg-gray-200' />
    </div>
  );
}
