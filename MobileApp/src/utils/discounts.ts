import { Discount } from '../context/BusinessContext';
import { Service } from '../services/api';

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

// Reads dates written like "10 Nov 2026"
export function parseDate(text: string): Date | null {
  const m = text.trim().match(/^(\d{1,2})\s+([A-Za-z]{3})[A-Za-z]*\s+(\d{4})$/);
  if (!m) return null;
  const month = MONTHS.indexOf(m[2].toLowerCase());
  if (month < 0) return null;
  return new Date(Number(m[3]), month, Number(m[1]));
}

export function isDiscountLive(d: Discount, now: Date = new Date()): boolean {
  if (!d.active) return false;
  const start = parseDate(d.startDate);
  const end = parseDate(d.endDate);
  if (!start || !end) return false;
  end.setHours(23, 59, 59, 999);
  return now >= start && now <= end;
}

// Best live discount for one service. percent is 0 when there is none.
export function discountedPrice(service: Service, discounts: Discount[] | undefined) {
  const live = (discounts ?? []).filter(
    d => isDiscountLive(d) && d.serviceIds.includes(service.id),
  );
  if (live.length === 0) return { price: service.price, percent: 0 };
  const best = Math.max(...live.map(d => d.percent));
  return { price: Math.round((service.price * (100 - best)) / 100), percent: best };
}