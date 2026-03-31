import { CreateGatheringForm } from './CreateGatheringForm';

export default function CreateGatheringPage() {
  return (
    <main className='mx-auto max-w-[800px] px-4 py-10'>
      <h1 className='text-h3-b mb-8 text-gray-900'>모임 만들기</h1>
      <CreateGatheringForm />
    </main>
  );
}
