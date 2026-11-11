import { describe, expect, test } from 'bun:test';
import { isFollowUpDue, isFollowUpUpcoming, isValidDateKey, localDateKey } from './enquiryFollowUp';

describe('follow-up scheduling', () => {
  test('uses local calendar dates', () => {
    expect(localDateKey(new Date(2026, 10, 11, 9))).toBe('2026-11-11');
  });
  test('rejects malformed and impossible dates', () => {
    expect(isValidDateKey('2026-02-29')).toBe(false);
    expect(isValidDateKey('2028-02-29')).toBe(true);
    expect(isValidDateKey('2026-13-01')).toBe(false);
    expect(isValidDateKey('11/12/2026')).toBe(false);
  });
  test('due dates include today and overdue for open enquiries only', () => {
    expect(isFollowUpDue({ status: 'new', followUpDate: '2026-11-11' }, '2026-11-11')).toBe(true);
    expect(isFollowUpDue({ status: 'contacted', followUpDate: '2026-11-10' }, '2026-11-11')).toBe(true);
    expect(isFollowUpDue({ status: 'scheduled', followUpDate: '2026-11-10' }, '2026-11-11')).toBe(false);
    expect(isFollowUpDue({ status: 'closed', followUpDate: '2026-11-10' }, '2026-11-11')).toBe(false);
  });
  test('upcoming follow-ups exclude past dates and completed enquiries', () => {
    expect(isFollowUpUpcoming({ status: 'new', followUpDate: '2026-11-12' }, '2026-11-11')).toBe(true);
    expect(isFollowUpUpcoming({ status: 'new', followUpDate: '2026-11-11' }, '2026-11-11')).toBe(false);
    expect(isFollowUpUpcoming({ status: 'closed', followUpDate: '2026-11-12' }, '2026-11-11')).toBe(false);
  });
});
