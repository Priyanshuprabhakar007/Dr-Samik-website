/**
 * Privacy-conscious notification helpers for clinic staff only.
 * No patient names, contact details or medical notes are sent in email.
 */
export interface NotificationEnv {
  RESEND_API_KEY?: string;
  CLINIC_NOTIFICATION_FROM?: string;
  CLINIC_NOTIFICATION_TO?: string;
}

export type NotificationResult =
  | { sent: true }
  | { sent: false; reason: 'not-configured' };

export function isEmailConfigured(env: NotificationEnv): boolean {
  return !!(env.RESEND_API_KEY?.trim() && env.CLINIC_NOTIFICATION_FROM?.trim() && env.CLINIC_NOTIFICATION_TO?.trim());
}

export function indiaDateKey(value: Date = new Date()): string {
  // sv-SE reliably formats YYYY-MM-DD regardless of host-machine locale.
  return new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(value);
}

export function isDueFollowUp(
  item: { followUpDate?: unknown; status?: unknown },
  today: string,
): boolean {
  return (item.status === 'new' || item.status === 'contacted') &&
    typeof item.followUpDate === 'string' &&
    /^\d{4}-\d{2}-\d{2}$/.test(item.followUpDate) &&
    item.followUpDate <= today;
}

export function buildNewEnquiryNotice(reference: string) {
  return {
    subject: 'New consultation request — Dr. Samik Sharma',
    text: `A new consultation request was saved successfully.\n\nReference: ${reference}\n\nSign in to your private admin dashboard to review the enquiry. Do not reply to this automated message.`,
  };
}

export function buildFollowUpNotice(dueCount: number, date: string) {
  return {
    subject: `Staff follow-up reminder — ${dueCount} due — ${date}`,
    text: `There are ${dueCount} open enquiry follow-ups due on or before ${date} (Asia/Kolkata).\n\nLog in to the private admin dashboard to review and contact patients.\n\nNo appointment is automatically confirmed, and this message is for authorised clinic staff only.`,
  };
}

export async function sendClinicEmail(
  message: { subject: string; text: string },
  env: NotificationEnv = process.env,
  idempotencyKey?: string,
): Promise<NotificationResult> {
  if (!isEmailConfigured(env)) return { sent: false, reason: 'not-configured' };
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY!.trim()}`,
      'Content-Type': 'application/json',
      'User-Agent': 'DrSamikSharmaWebsite/1.0',
      ...(idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {}),
    },
    body: JSON.stringify({
      from: env.CLINIC_NOTIFICATION_FROM!.trim(),
      to: [env.CLINIC_NOTIFICATION_TO!.trim()],
      subject: message.subject,
      text: message.text,
    }),
    signal: AbortSignal.timeout(5000),
  });
  if (!response.ok) {
    // Do not log provider response bodies: they may contain addresses/metadata.
    throw new Error(`Clinic email provider rejected the request (HTTP ${response.status}).`);
  }
  return { sent: true };
}
