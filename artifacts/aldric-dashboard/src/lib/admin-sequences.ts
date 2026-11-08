import type { AdminApplication, AdminForm, ReplyState } from './admin-api';

// Copies of the Meta-approved WhatsApp templates that Brevo sends. Brevo holds
// the live versions; these are for previews in the admin dashboard only, so
// keep them in step when a template changes. {{1}} is the applicant's first name.
export const SEQUENCE_DAYS = [0, 2, 5, 9, 14] as const;

export const STEP_NAMES = [
  'Initial invitation',
  'Follow-up · day 2',
  'Questions · day 5',
  'Check-in · day 9',
  'Final follow-up · day 14',
] as const;

export const TEMPLATES: Record<AdminForm, readonly string[]> = {
  'move-money': [
    'Hi {{1}}, thank you for applying to move money abroad with Envoi & Co.\n\nYour application has been approved to progress to the next stage. Our team would like to discuss your transfer requirements and guide you through the next steps.\n\nWould you prefer to chat here on WhatsApp or schedule a call?',
    'Hi {{1}}, just following up on your request to move money abroad with Envoi & Co.\n\nAre you still planning to make the transfer? Reply here and we’ll help you explore the next steps.',
    'Hi {{1}}, do you have any questions about moving your money abroad?\n\nWhether it’s the process, required documents, fees or timing, our team can talk you through the details before you decide to proceed.\n\nWhat would you like to know?',
    'Hi {{1}}, we understand your transfer plans may have changed.\n\nAre you looking to move money soon, planning for later, or no longer looking? Let us know so we can follow up appropriately.',
    'Hi {{1}}, this is our final follow-up about your request to move money abroad with Envoi & Co.\n\nWe’ll pause our messages for now. If you’d like to continue, simply reply here whenever you’re ready.\n\nThank you for considering Envoi & Co.',
  ],
  'private-banking': [
    'Hi {{1}}, thank you for your interest in a private banking introduction through Envoi & Co.\n\nYour application has been approved to progress to the next stage. Our team would like to understand your banking requirements and explain how the introduction process works.\n\nWould you prefer to chat here on WhatsApp or schedule a call?',
    'Hi {{1}}, just following up on your request for a private banking introduction.\n\nAre you still interested in exploring your options with Envoi & Co? Reply here and we’ll guide you through the next steps.',
    'Hi {{1}}, do you have any questions before progressing with your private banking introduction?\n\nOur team can explain the process, the information required and what to expect next.\n\nWhat would you like to know?',
    'Hi {{1}}, we appreciate you may be busy.\n\nWould you like to discuss your private banking requirements now, reconnect later, or pause your enquiry? Let us know what suits you.',
    'Hi {{1}}, this is our final follow-up about your private banking introduction request.\n\nWe’ll pause our messages for now. If you’d like to continue, simply reply here whenever you’re ready.\n\nThank you for considering Envoi & Co.',
  ],
};

export const FORM_NAMES: Record<AdminForm, string> = {
  'move-money': 'Move Money Abroad',
  'private-banking': 'Private Banking',
};

export const firstName = (fullName: string) => fullName.trim().split(/\s+/)[0] ?? '';

export const fillTemplate = (template: string, app: AdminApplication) =>
  template.replace('{{1}}', firstName(app.fullName));

const DAY_MS = 86_400_000;

export type SequenceState =
  | { kind: 'running'; sent: number; nextInDays: number }
  | { kind: 'replied'; sent: number }
  | { kind: 'stopped'; sent: number }
  | { kind: 'finished'; sent: number };

/**
 * Where the applicant is in the five-message sequence. Message counts are
 * estimated from the approval date and the Brevo schedule (Brevo's sending
 * window can delay a message by up to a day).
 */
export function sequenceState(app: AdminApplication, reply: ReplyState | undefined, now = Date.now()): SequenceState | null {
  if (app.status !== 'approved' || !app.approvedAt) return null;
  const stoppedAt = app.followUpsStoppedAt ? Date.parse(app.followUpsStoppedAt) : null;
  const until = stoppedAt ?? now;
  const days = Math.max(0, Math.floor((until - Date.parse(app.approvedAt)) / DAY_MS));
  const sent = SEQUENCE_DAYS.filter((d) => d <= days).length;
  if (stoppedAt) return { kind: 'stopped', sent };
  if (reply === 'replied') return { kind: 'replied', sent };
  if (sent >= SEQUENCE_DAYS.length) return { kind: 'finished', sent };
  return { kind: 'running', sent, nextInDays: SEQUENCE_DAYS[sent] - days };
}
