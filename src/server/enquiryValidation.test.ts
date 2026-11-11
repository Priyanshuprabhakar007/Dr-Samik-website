import { describe, expect, test } from 'bun:test';
import { validateEnquiry } from './enquiryValidation';

const good = {
  fullName: 'Asha Sharma',
  phone: '+91 98765 43210',
  email: 'asha@example.com',
  treatmentInterest: 'Rhinoplasty',
  consultationType: 'in-person',
  preferredDate: '2026-11-18',
  preferredTime: '11:00 AM',
};

describe('consultation intake validation', () => {
  test('normalizes valid fields without copying unapproved sensitive fields', () => {
    const result = validateEnquiry({ ...good, clinicalNotes: 'do not persist' });
    expect(result.fullName).toBe('Asha Sharma');
    expect(result.email).toBe('asha@example.com');
    expect('clinicalNotes' in result).toBe(false);
  });
  test('rejects invalid phone and email', () => {
    expect(() => validateEnquiry({ ...good, phone: 'abc123' })).toThrow();
    expect(() => validateEnquiry({ ...good, email: 'bad' })).toThrow();
  });
  test('rejects impossible dates', () => {
    expect(() => validateEnquiry({ ...good, preferredDate: '2026-02-30' })).toThrow();
  });
  test('rejects missing or invalid consultation type', () => {
    expect(() => validateEnquiry({ ...good, consultationType: 'offline' })).toThrow();
  });
});
