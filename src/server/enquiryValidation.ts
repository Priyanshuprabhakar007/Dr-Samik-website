export interface ValidEnquiry {
  fullName: string;
  phone: string;
  email: string;
  treatmentInterest: string;
  consultationType: 'in-person' | 'virtual';
  preferredDate: string;
  preferredTime: string;
}

/** Returns only approved enquiry fields, rejecting invalid submissions. */
export function validateEnquiry(payload: unknown): ValidEnquiry {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    throw new Error('Invalid form payload.');
  }
  const data = payload as Record<string, unknown>;
  const fullName = typeof data.fullName === 'string' ? data.fullName.trim() : '';
  const phone = typeof data.phone === 'string' ? data.phone.trim() : '';
  const email = typeof data.email === 'string' ? data.email.trim().toLowerCase() : '';
  const procedure = typeof data.treatmentInterest === 'string'
    ? data.treatmentInterest.trim()
    : typeof data.procedure === 'string' ? data.procedure.trim() : '';
  const chosenDate = typeof data.preferredDate === 'string' ? data.preferredDate.trim() : '';
  const preferredTime = typeof data.preferredTime === 'string' ? data.preferredTime.trim() : '';

  if (fullName.length < 2 || fullName.length > 100) throw new Error('Enter a valid name (2–100 characters).');
  if (!/^[+\d()\s.\-]{7,30}$/.test(phone) || phone.replace(/\D/g, '').length < 7) {
    throw new Error('Enter a valid phone number.');
  }
  if (email.length > 100 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('Enter a valid email address.');
  }
  if (!procedure || procedure.length > 100) throw new Error('Select a treatment.');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(chosenDate)) throw new Error('Choose a valid preferred date.');
  const [year, month, day] = chosenDate.split('-').map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  if (parsed.getUTCFullYear() !== year || parsed.getUTCMonth() + 1 !== month || parsed.getUTCDate() !== day) {
    throw new Error('Choose a valid preferred date.');
  }
  if (preferredTime.length > 30) throw new Error('Invalid preferred time.');
  if (data.consultationType !== 'in-person' && data.consultationType !== 'virtual') {
    throw new Error('Select a consultation format.');
  }
  return {
    fullName, phone, email, treatmentInterest: procedure,
    consultationType: data.consultationType,
    preferredDate: chosenDate,
    preferredTime: preferredTime || '11:00 AM',
  };
}
