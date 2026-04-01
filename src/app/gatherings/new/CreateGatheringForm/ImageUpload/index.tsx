'use client';

import { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/Button';
import { BackupIcon, CloseIcon } from '@/components/ui/Icon';
import { cn } from '@/lib/cn';

const MAX_IMAGES = 6;
const ACCEPTED_MIME_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];

interface ImageUploadProps {
  value: File[];
  onChange: (files: File[]) => void;
  error?: string;
}

export function ImageUpload({ value, onChange, error }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // render에서 img src로 사용 → state로 관리 (render 중 ref 접근 금지)
  const [previewUrls, setPreviewUrls] = useState<Map<File, string>>(new Map());

  // cleanup 전용: 생성된 모든 URL을 누적 보관
  // state는 cleanup 시점에 stale해질 수 있어서 ref로 별도 관리
  const allCreatedUrls = useRef<string[]>([]);

  // 언마운트 시 생성했던 URL 전부 메모리 해제
  useEffect(() => {
    const urls = allCreatedUrls.current; // effect 안에서 복사 (cleanup warning 방지)
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const addFiles = (newFiles: File[]) => {
    const valid = newFiles.filter((f) => ACCEPTED_MIME_TYPES.includes(f.type));
    const merged = [...value, ...valid].slice(0, MAX_IMAGES);

    // 새 파일의 URL 생성 후 state와 cleanup ref 모두에 저장
    const newUrls = new Map(previewUrls);
    valid.forEach((file) => {
      if (!newUrls.has(file)) {
        const url = URL.createObjectURL(file);
        newUrls.set(file, url);
        allCreatedUrls.current.push(url); // 언마운트 시 해제할 목록에 추가
      }
    });
    setPreviewUrls(newUrls);
    onChange(merged);
  };

  const handleRemove = (index: number) => {
    const file = value[index];
    // state에서 해당 파일 URL 제거 (즉시 해제는 하지 않음, 언마운트 시 일괄 해제)
    const newUrls = new Map(previewUrls);
    newUrls.delete(file);
    setPreviewUrls(newUrls);
    onChange(value.filter((_, i) => i !== index));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    addFiles(Array.from(e.target.files));
    e.target.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(Array.from(e.dataTransfer.files));
  };

  const openFilePicker = () => fileInputRef.current?.click();

  const hasImages = value.length > 0;
  const emptySlotCount = MAX_IMAGES - value.length;

  return (
    <div className='flex flex-col gap-1.5'>
      <p className='text-small-01-sb md:text-body-01-sb lg:text-h5-b text-gray-800'>이미지</p>

      {!hasImages ? (
        /* ── 0장: 큰 드롭존 ── */
        <div
          className={cn(
            'flex w-full cursor-pointer flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-gray-300 bg-gray-100',
            'h-[408px]',
            isDragging && 'border-gradient-primary',
          )}
          onClick={openFilePicker}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <BackupIcon size={80} className='text-gray-300' />
          <div className='flex flex-col items-center gap-1'>
            <p className='text-body-01-m text-gray-600'>이곳을 클릭해 이미지를 업로드해주세요</p>
            <p className='text-body-02-r text-gray-300'>JPEG, PNG, PDF</p>
          </div>
          <Button
            type='button'
            variant='file-upload'
            size='file-upload'
            onClick={(e) => {
              e.stopPropagation();
              openFilePicker();
            }}
          >
            파일 찾기
          </Button>
        </div>
      ) : (
        /* ── 1장 이상: 썸네일 + 빈 슬롯 ── */
        <div
          className={cn(
            'flex flex-row gap-2 overflow-x-auto rounded-lg md:flex-wrap md:overflow-x-visible',
            isDragging && 'outline-2 outline-blue-300 outline-dashed',
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {value.map((file, index) => {
            const isPdf = file.type === 'application/pdf';
            const previewUrl = isPdf ? undefined : previewUrls.get(file);

            return (
              <div
                key={index}
                className='relative aspect-3/4 w-[200px] shrink-0 overflow-hidden rounded-lg md:w-[calc((100%-1rem)/3)] lg:w-[264px]'
              >
                {isPdf ? (
                  <div className='flex h-full w-full flex-col items-center justify-center gap-2 bg-gray-100'>
                    <span className='text-body-02-sb rounded bg-gray-300 px-2 py-0.5 text-gray-600'>PDF</span>
                    <p className='text-body-02-r w-full truncate px-3 text-center text-gray-600'>{file.name}</p>
                  </div>
                ) : (
                  // blob URL(브라우저 메모리의 임시 주소)은 next/image가 서버에서 접근할 수 없어 <img> 태그를 직접 사용
                  <img src={previewUrl} alt={file.name} className='h-full w-full object-cover' />
                )}

                {/* 삭제 버튼 */}
                <button
                  type='button'
                  onClick={() => handleRemove(index)}
                  className='absolute top-1.5 right-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-white/[0.28] transition-colors hover:bg-white/50'
                >
                  <CloseIcon size={20} className='text-white' />
                </button>
              </div>
            );
          })}

          {/* 빈 슬롯 */}
          {Array.from({ length: emptySlotCount }).map((_, i) => (
            <button
              key={`empty-${i}`}
              type='button'
              onClick={openFilePicker}
              className='bg-gray-150 flex aspect-3/4 w-[200px] shrink-0 cursor-pointer items-center justify-center gap-1 rounded-lg border border-dashed border-gray-300 md:w-[calc((100%-1rem)/3)] lg:w-[264px]'
            >
              <span className='text-body-01-m text-gray-600'>+</span>
              <span className='text-body-01-m text-gray-600'>이미지 추가</span>
            </button>
          ))}
        </div>
      )}

      <input
        ref={fileInputRef}
        type='file'
        accept='image/jpeg,image/png,application/pdf'
        multiple
        className='hidden'
        onChange={handleFileChange}
      />

      {error && (
        <p className='text-xs text-red-200' role='alert'>
          {error}
        </p>
      )}
    </div>
  );
}
