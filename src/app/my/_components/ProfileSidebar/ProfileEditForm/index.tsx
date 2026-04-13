'use client';

import { useRef } from 'react';

import { Controller } from 'react-hook-form';

import type { Control, UseFormRegister, FieldErrors, UseFormHandleSubmit } from 'react-hook-form';

import type { UpdateProfileForm } from '@/api/users/types';
import { Input } from '@/components/ui/Input';

const ACCEPTED_IMAGE_TYPES = 'image/jpeg,image/png,image/webp';

interface ProfileEditFormProps {
  control: Control<UpdateProfileForm>;
  register: UseFormRegister<UpdateProfileForm>;
  handleSubmit: UseFormHandleSubmit<UpdateProfileForm>;
  errors: FieldErrors<UpdateProfileForm>;
  isPending: boolean;
  onSubmit: (data: UpdateProfileForm) => void;
  onCancel: () => void;
}

export function ProfileEditForm({
  control,
  register,
  handleSubmit,
  errors,
  isPending,
  onSubmit,
  onCancel,
}: ProfileEditFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      <Controller
        name='profileImage'
        control={control}
        render={({ field }) => (
          <div className='flex flex-col gap-1.5'>
            <label className='text-sm font-bold text-gray-900'>프로필 이미지</label>
            <input
              ref={fileInputRef}
              type='file'
              accept={ACCEPTED_IMAGE_TYPES}
              className='hidden'
              onChange={(e) => {
                const file = e.target.files?.[0] ?? null;
                field.onChange(file);
              }}
            />
            <div className='flex items-center gap-2'>
              <button
                type='button'
                className='text-small-01-r border-gray-150 h-11 shrink-0 rounded-lg border px-4 text-gray-800'
                onClick={() => fileInputRef.current?.click()}
              >
                파일 선택
              </button>
              <span className='text-small-01-r min-w-0 truncate text-gray-600'>
                {field.value instanceof File ? field.value.name : '선택된 파일 없음'}
              </span>
            </div>
            <p className='text-small-02-r text-gray-400'>jpg, png, webp / 5MB 이하</p>
            {errors.profileImage?.message && (
              <p className='text-xs text-red-200' role='alert'>
                {errors.profileImage.message}
              </p>
            )}
          </div>
        )}
      />
      <div className='flex w-full justify-end gap-2'>
        <button
          type='button'
          className='text-small-01-r border-gray-150 h-11 rounded-lg border px-6 text-gray-800 disabled:opacity-50'
          onClick={onCancel}
          disabled={isPending}
        >
          취소
        </button>
        <button
          type='submit'
          className='text-small-01-r bg-gradient-primary h-11 rounded-lg px-6 text-white disabled:opacity-50'
          disabled={isPending}
        >
          {isPending ? '저장 중...' : '저장'}
        </button>
      </div>
    </form>
  );
}
