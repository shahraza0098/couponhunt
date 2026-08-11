import { Prisma } from '@/app/generated/prisma/client';
type Decimal = Prisma.Decimal;

/**
 * Format a currency value for display.
 */
export function formatCurrency(amount: Decimal | number | null | undefined, currency = 'INR'): string {
  if (amount == null) return '';
  const num = typeof amount === 'number' ? amount : Number(amount);
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(num);
}

/**
 * Format a discount value for display (e.g. "20% OFF" or "₹500 OFF").
 */
export function formatDiscount(
  discountType: string | null | undefined,
  discountValue: Decimal | number | null | undefined,
  currency = 'INR'
): string {
  if (!discountType || discountValue == null) return 'Special Offer';
  const val = typeof discountValue === 'number' ? discountValue : Number(discountValue);

  switch (discountType) {
    case 'PERCENTAGE':
      return `${val}% OFF`;
    case 'FIXED_AMOUNT':
      return `${formatCurrency(val, currency)} OFF`;
    case 'FREE_SHIPPING':
      return 'Free Shipping';
    case 'CASHBACK':
      return `${val}% Cashback`;
    case 'BOGO':
      return 'Buy 1 Get 1 Free';
    default:
      return 'Special Offer';
  }
}

/**
 * Get a human-readable time-ago string.
 */
export function timeAgo(date: Date | string): string {
  const now = new Date();
  const d = typeof date === 'string' ? new Date(date) : date;
  const seconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 2592000) return `${Math.floor(seconds / 86400)}d ago`;
  if (seconds < 31536000) return `${Math.floor(seconds / 2592000)}mo ago`;
  return `${Math.floor(seconds / 31536000)}y ago`;
}

/**
 * Format a date for display.
 */
export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Check if a coupon/deal is expired.
 */
export function isExpired(expiresAt: Date | string | null | undefined): boolean {
  if (!expiresAt) return false;
  const d = typeof expiresAt === 'string' ? new Date(expiresAt) : expiresAt;
  return d.getTime() < Date.now();
}

/**
 * Check if a coupon/deal is expiring soon (within 3 days).
 */
export function isExpiringSoon(expiresAt: Date | string | null | undefined): boolean {
  if (!expiresAt) return false;
  const d = typeof expiresAt === 'string' ? new Date(expiresAt) : expiresAt;
  const threeDays = 3 * 24 * 60 * 60 * 1000;
  return d.getTime() > Date.now() && d.getTime() - Date.now() < threeDays;
}

/**
 * Get remaining time until expiry.
 */
export function getTimeRemaining(expiresAt: Date | string): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
} {
  const d = typeof expiresAt === 'string' ? new Date(expiresAt) : expiresAt;
  const total = Math.max(0, d.getTime() - Date.now());
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));

  return { days, hours, minutes, seconds, total };
}

/**
 * Truncate text to a max length with ellipsis.
 */
export function truncate(text: string | null | undefined, maxLength = 100): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trimEnd() + '…';
}

/**
 * Mask a coupon code for preview (show first 3 + last char).
 */
export function maskCode(code: string | null | undefined): string {
  if (!code) return '••••••';
  if (code.length <= 4) return code.substring(0, 1) + '•'.repeat(code.length - 1);
  return code.substring(0, 3) + '•'.repeat(code.length - 4) + code.substring(code.length - 1);
}
