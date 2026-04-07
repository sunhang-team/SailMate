'use client';

import type { UseFormRegister, FieldErrors, UseFormHandleSubmit } from 'react-hook-form';

import type { UpdateProfileForm } from '@/api/users/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface ProfileEditFormProps {
  register: UseFormRegister<UpdateProfileForm>;
  handleSubmit: UseFormHandleSubmit<UpdateProfileForm>;
  errors: FieldErrors<UpdateProfileForm>;
  isPending: boolean;
  onSubmit: (data: UpdateProfileForm) => void;
  onCancel: () => void;
}

export function ProfileEditForm({
  register,
  handleSubmit,
  errors,
  isPending,
  onSubmit,
  onCancel,
}: ProfileEditFormProps) {
  return (
    <form
      className='border-gray-150 flex w-full flex-col gap-4 rounded-xl border border-dashed p-4'
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <p className='text-body-02-sb text-gray-900'>내 정보 수정</p>
      <Input
        label={
          <>
            닉네임 <span className='ml-1 text-blue-400'>*</span>
          </>
        }
        placeholder='닉네임을 입력해 주세요'
        error={errors.nickname?.message}
        maxLength={10}
        {...register('nickname')}
        className='h-11 w-full'
      />
      <Input
        label='프로필 이미지 URL'
        placeholder='비우면 기본 이미지 (jpg, png, webp URL)'
        error={errors.profileImage?.message}
        {...register('profileImage')}
        className='h-11 w-full'
      />
      <div className='flex w-full flex-wrap justify-end gap-2'>
        <Button type='button' variant='file-upload' size='file-upload' onClick={onCancel} disabled={isPending}>
          취소
        </Button>
        <Button type='submit' variant='primary' className='h-12 min-w-[100px] rounded-lg' disabled={isPending}>
          {isPending ? '저장 중...' : '저장'}
        </Button>
      </div>
    </form>
  );
}
