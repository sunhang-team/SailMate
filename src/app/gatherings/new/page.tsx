import { CreateGatheringForm } from './CreateGatheringForm';

export default function CreateGatheringPage() {
  return (
    <main className='mx-auto max-w-[1680px] px-5 py-20'>
      <h1 className='text-body-01-b md:text-h4-b lg:text-h3-b mb-8 text-gray-900'>모임 만들기</h1>
      <CreateGatheringForm />
    </main>
  );
}
