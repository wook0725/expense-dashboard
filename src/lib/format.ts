const KRW = new Intl.NumberFormat('ko-KR', {
  style: 'currency',
  currency: 'KRW',
  maximumFractionDigits: 0,
});

/** 원화 금액 표기. 12345 -> "₩12,345" */
export function formatKrw(amount: number): string {
  if (!Number.isFinite(amount)) return '-';
  return KRW.format(Math.round(amount));
}

/** ISO 날짜 문자열을 "2026. 3. 28." 형태로. 파싱 불가하면 원본을 그대로 반환. */
export function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat('ko-KR', { dateStyle: 'medium' }).format(date);
}
