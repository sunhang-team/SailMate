'use client';

export function RetryButton() {
  return (
    <button
      type='button'
      onClick={() => window.location.reload()}
      className='bg-gradient-primary text-body-02-sb mt-2 rounded-lg px-6 py-3 text-white'
    >
      다시 시도
    </button>
  );
}
