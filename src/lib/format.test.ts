import { describe, expect, it } from 'vitest';
import { formatKrw, formatDate } from './format';

describe('formatKrw', () => {
  it('원화 기호와 천 단위 구분자를 붙인다', () => {
    expect(formatKrw(12345)).toBe('₩12,345');
  });

  it('소수점은 반올림한다', () => {
    expect(formatKrw(999.6)).toBe('₩1,000');
  });

  it('숫자가 아니면 대시를 반환한다', () => {
    expect(formatKrw(Number.NaN)).toBe('-');
  });
});

describe('formatDate', () => {
  it('ISO 날짜를 한국어 표기로 바꾼다', () => {
    expect(formatDate('2026-03-28')).toContain('2026');
  });

  it('파싱할 수 없으면 원본을 그대로 둔다', () => {
    expect(formatDate('not-a-date')).toBe('not-a-date');
  });
});
