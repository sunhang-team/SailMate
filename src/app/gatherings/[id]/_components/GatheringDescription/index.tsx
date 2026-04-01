interface GatheringDescriptionProps {
  description: string;
}

export function GatheringDescription({ description }: GatheringDescriptionProps) {
  return (
    <div className='flex flex-col gap-3 xl:gap-6'>
      <h2 className='text-body-01-sb xl:text-h5-b text-gray-900'>모임 설명 💡</h2>
      <p className='text-body-02-r whitespace-pre-line text-gray-800 xl:max-w-[675px]'>{description}</p>
    </div>
  );
}
