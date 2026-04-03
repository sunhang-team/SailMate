'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useCalendar } from '@frontend-toolkit-js/hooks';
import { format, isValid, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';

import { ArrowIcon, CalendarIcon } from '@/components/ui/Icon';
import { fieldControlVariants, fieldGradientFocusWrapperClass } from '@/components/ui/fieldControlVariants';
import { cn } from '@/lib/cn';

interface DatePickerProps {
  value?: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
}

const WEEKDAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const DISPLAY_FORMAT = 'yyyy - MM - dd';
const ISO_DATE_FORMAT = 'yyyy-MM-dd';

// RHF 문자열 값(yyyy-MM-dd)을 캘린더 기준 Date로 안전하게 변환
const parseValueToDate = (value?: string) => {
  if (!value) return new Date();

  const parsed = parseISO(value);
  return isValid(parsed) ? parsed : new Date();
};

export function DatePicker({
  value,
  onChange,
  onBlur,
  placeholder = '날짜를 선택해주세요',
  error,
  disabled,
}: DatePickerProps) {
  // input + popover를 포함하는 커스텀 date picker 상태
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedDate = useMemo(() => (value ? parseISO(value) : null), [value]);
  const calendarDefaultDate = useMemo(() => parseValueToDate(value), [value]);
  const hasError = !!error;

  // 헤드리스 캘린더 훅: 42일 그리드 데이터와 월 이동 기능 제공
  const { currentDate, days, prev, next, setDate } = useCalendar({
    defaultDate: calendarDefaultDate,
    weekStartsOn: 0,
  });

  useEffect(() => {
    if (!isOpen) return;

    // 팝오버 바깥 클릭 시 캘린더 닫기
    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
        onBlur?.();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onBlur]);

  const handleToggle = () => {
    if (disabled) return;
    setIsOpen((prevOpen) => !prevOpen);
  };

  const handleSelectDate = (date: Date) => {
    // 내부 선택은 Date, 폼 저장은 ISO 문자열(yyyy-MM-dd)로 통일
    setDate(date);
    onChange(format(date, ISO_DATE_FORMAT));
    setIsOpen(false);
    onBlur?.();
  };

  const displayValue = selectedDate && isValid(selectedDate) ? format(selectedDate, DISPLAY_FORMAT) : '';

  return (
    <div ref={containerRef} className='relative w-full'>
      {hasError ? (
        <button
          type='button'
          onClick={handleToggle}
          className={cn(
            fieldControlVariants({ state: 'error' }),
            'flex cursor-pointer items-center justify-between text-left',
            disabled && 'cursor-not-allowed opacity-60',
          )}
          disabled={disabled}
        >
          <span
            className={cn(
              'text-small-02-r md:text-body-02-r lg:text-body-01-r',
              displayValue ? 'text-gray-900' : 'text-gray-400',
            )}
          >
            {displayValue || placeholder}
          </span>
          <CalendarIcon className='text-gray-800 sm:size-4 lg:size-6' />
        </button>
      ) : (
        <div className={fieldGradientFocusWrapperClass}>
          <button
            type='button'
            onClick={handleToggle}
            className={cn(
              fieldControlVariants({ state: 'default' }),
              'flex cursor-pointer items-center justify-between text-left',
              disabled && 'cursor-not-allowed opacity-60',
            )}
            disabled={disabled}
          >
            <span
              className={cn(
                'text-small-02-r md:text-body-02-r lg:text-body-01-r',
                displayValue ? 'text-gray-900' : 'text-gray-400',
              )}
            >
              {displayValue || placeholder}
            </span>
            <CalendarIcon className='size-4 text-gray-800 md:size-5' />
          </button>
        </div>
      )}

      {error && (
        <p className='mt-1 text-xs text-red-200' role='alert'>
          {error}
        </p>
      )}

      {isOpen && (
        <div className='bg-gray-0 shadow-01 absolute right-0 z-20 mt-2 h-[330px] w-full rounded-lg border border-blue-100 p-4 md:w-full lg:h-[338px] lg:w-[376px]'>
          <div className='mb-4 flex items-center justify-between'>
            <button
              type='button'
              onClick={prev}
              className='flex size-7 items-center justify-center rounded-full border border-blue-100 text-blue-300'
              aria-label='이전 달'
            >
              <ArrowIcon className='size-4 -rotate-180' />
            </button>
            <p className='text-body-01-sb text-blue-400'>{format(currentDate, 'yyyy년 M월', { locale: ko })}</p>
            <button
              type='button'
              onClick={next}
              className='flex size-7 items-center justify-center rounded-full border border-blue-100 text-blue-300'
              aria-label='다음 달'
            >
              <ArrowIcon className='size-4' />
            </button>
          </div>

          <div className='mb-2 grid grid-cols-7 gap-y-2'>
            {WEEKDAY_LABELS.map((label, index) => (
              <span key={`${label}-${index}`} className='text-center text-xs text-gray-500'>
                {label}
              </span>
            ))}
          </div>

          <div className='grid grid-cols-7 gap-y-2'>
            {days.map((day) => {
              const isSelected = value === format(day.date, ISO_DATE_FORMAT);
              return (
                <button
                  type='button'
                  key={day.date.toISOString()}
                  onClick={() => handleSelectDate(day.date)}
                  className={cn(
                    'mx-auto flex size-7 items-center justify-center rounded-full text-xs',
                    day.isCurrentMonth ? 'text-gray-800' : 'text-gray-300',
                    day.isToday && !isSelected && 'font-bold text-blue-400',
                    isSelected && 'bg-blue-300 text-white',
                  )}
                >
                  {day.day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
