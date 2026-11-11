import { describe, expect, test } from 'bun:test';
import {
  indiaDateKey, isDueFollowUp, isEmailConfigured, buildNewEnquiryNotice,
  buildFollowUpNotice, sendClinicEmail,
} from './clinicNotifications';

describe('clinic notifications', () => {
  test('uses clinic timezone, including UTC to IST day rollover', () => {
    expect(indiaDateKey(new Date('2026-11-10T20:00:00Z'))).toBe('2026-11-11');
  });
  test('recognises due open follow-ups only', () => {
    expect(isDueFollowUp({ followUpDate: '2026-11-10', status: 'new' }, '2026-11-11')).toBe(true);
    expect(isDueFollowUp({ followUpDate: '2026-11-12', status: 'contacted' }, '2026-11-11')).toBe(false);
    expect(isDueFollowUp({ followUpDate: '2026-11-10', status: 'closed' }, '2026-11-11')).toBe(false);
    expect(isDueFollowUp({ followUpDate: 'not-a-date', status: 'new' }, '2026-11-11')).toBe(false);
  });
  test('requires all provider settings', () => {
    expect(isEmailConfigured({})).toBe(false);
    expect(isEmailConfigured({ RESEND_API_KEY: 'key', CLINIC_NOTIFICATION_FROM: 'a@b.com', CLINIC_NOTIFICATION_TO: 'c@d.com' })).toBe(true);
  });
  test('does not include names, phone numbers or medical details in messages', () => {
    const a = buildNewEnquiryNotice('SS-123');
    const b = buildFollowUpNotice(2, '2026-11-11');
    expect(a.text).toContain('SS-123');
    expect(b.text).toContain('2');
    expect(a.text).not.toContain('patient name');
    expect(b.text).not.toContain('phone number');
  });
  test('stays disabled without configured mail credentials', async () => {
    expect(await sendClinicEmail({ subject: 'test', text: 'test' }, {})).toEqual({ sent: false, reason: 'not-configured' });
  });
});
