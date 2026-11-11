/** Date-only follow-up scheduling uses the user's local calendar day, not UTC. */
export function localDateKey(date: Date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function isValidDateKey(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  return parsed.getUTCFullYear() === year &&
    parsed.getUTCMonth() === month - 1 &&
    parsed.getUTCDate() === day;
}

export interface FollowUpLead {
  followUpDate?: string;
  priority?: 'normal' | 'high';
  status: 'new' | 'contacted' | 'scheduled' | 'closed';
}

export function isFollowUpDue(lead: FollowUpLead, today: string = localDateKey()): boolean {
  return (lead.status === 'new' || lead.status === 'contacted') &&
    !!lead.followUpDate && isValidDateKey(lead.followUpDate) &&
    lead.followUpDate <= today;
}

export function isFollowUpUpcoming(lead: FollowUpLead, today: string = localDateKey()): boolean {
  return (lead.status === 'new' || lead.status === 'contacted') &&
    !!lead.followUpDate && isValidDateKey(lead.followUpDate) &&
    lead.followUpDate > today;
}
