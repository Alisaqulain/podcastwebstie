/** Wednesday = 3, Friday = 5 (JavaScript getUTCDay / getDay: Sun=0) */
export const BOOKING_WEEKDAYS = [3, 5] as const;

export const BOOKING_TIME_SLOTS = [
  "10:00",
  "11:30",
  "14:00",
  "15:30",
  "17:00",
] as const;

export type BookingTimeSlot = (typeof BOOKING_TIME_SLOTS)[number];

export function parseYmd(dateStr: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr.trim());
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]) - 1;
  const d = Number(m[3]);
  const dt = new Date(y, mo, d);
  if (dt.getFullYear() !== y || dt.getMonth() !== mo || dt.getDate() !== d) {
    return null;
  }
  return dt;
}

export function isAllowedBookingDay(date: Date, now = new Date()): boolean {
  const day = date.getDay();
  if (!BOOKING_WEEKDAYS.includes(day as 3 | 5)) return false;
  const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (date < startToday) return false;
  return true;
}

export function isValidBookingTime(time: string): time is BookingTimeSlot {
  return (BOOKING_TIME_SLOTS as readonly string[]).includes(time);
}

export function packagePayablePaise(price: number, discountPrice?: number | null) {
  const base = Math.round(Number(price));
  if (!Number.isFinite(base) || base < 100) return null;
  if (discountPrice == null || discountPrice === 0) return base;
  const d = Math.round(Number(discountPrice));
  if (!Number.isFinite(d) || d <= 0 || d >= base) return base;
  return d;
}
