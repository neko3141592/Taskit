import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 日付をJST（日本時間）でフォーマットする
 */
export function formatDateJST(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('ja-JP', {
    ...options,
    timeZone: 'Asia/Tokyo'
  });
}

/**
 * 日時をJST（日本時間）でフォーマットする
 */
export function formatDateTimeJST(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleString('ja-JP', {
    ...options,
    timeZone: 'Asia/Tokyo'
  });
}
