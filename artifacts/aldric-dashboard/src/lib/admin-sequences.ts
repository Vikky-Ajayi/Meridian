import type { AdminApplication, AdminForm } from './admin-api';

// WhatsApp follow-up messages. In manual mode the dashboard opens WhatsApp with
// the text pre-filled; in automatic mode the server sends the matching Meta
// templates (artifacts/api-server/src/lib/whatsappTemplates.ts, keep in step).
// {{1}} is the applicant's first name.

/** The WhatsApp account messages should be sent from. Shown as a reminder only. */
export const SENDER_WHATSAPP = '+44 7886 857463';

/** Booking link offered when an applicant asks for a call. Leave empty until it's known. */
export const CALENDLY_URL = '';

export const SEQUENCE_DAYS = [0, 2, 5, 9, 14] as const;

/** Names of the matching templates in Meta's WhatsApp Manager (automatic mode). */
export const META_TEMPLATE_NAMES: Record<AdminForm, readonly string[]> = {
  'move-money': ['mma_1_invite', 'mma_2_followup', 'mma_3_questions', 'mma_4_checkin', 'mma_5_final'],
  'private-banking': ['pbi_1_invite', 'pbi_2_followup', 'pbi_3_questions', 'pbi_4_checkin', 'pbi_5_final'],
};

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

/** Ready-made answers for when the applicant replies to Message 1. */
export const QUICK_REPLIES = [
  {
    id: 'whatsapp',
    label: 'They chose WhatsApp',
    text: 'Thank you, {{1}}. We’ll continue here on WhatsApp.\n\nWe’ll go through your requirements and the next steps with you here. Our team is available 08:00–20:00 GMT, Monday to Friday, so if you message outside these hours we’ll reply as soon as we’re back.\n\nFor your security, Envoi & Co will never ask for passwords, PINs or one-time codes on WhatsApp.',
  },
  {
    id: 'call',
    label: 'They chose a call',
    text: 'Thank you, {{1}}. You can choose a time for your call that suits you here:\n{{calendly}}\n\nOnce booked, you’ll receive a confirmation with the call details. If none of the times work for you, just reply here and we’ll arrange another.',
  },
] as const;

export const FORM_NAMES: Record<AdminForm, string> = {
  'move-money': 'Move Money Abroad',
  'private-banking': 'Private Banking',
};

export const firstName = (fullName: string) => fullName.trim().split(/\s+/)[0] ?? '';

export const fillTemplate = (template: string, app: AdminApplication) =>
  template
    .replace('{{1}}', firstName(app.fullName))
    .replace('{{calendly}}', CALENDLY_URL || '[add your Calendly link]');

/**
 * Turns the number as the form stored it ("+44 07886 857463") into the digits
 * wa.me expects ("447886857463"). The forms save "<dial code> <local number>";
 * a trunk 0 typed at the start of the local part is dropped (except for Italy,
 * where it's part of the number).
 */
export function whatsappDigits(stored: string): string {
  const trimmed = stored.trim();
  const match = trimmed.match(/^(\+[\d-]+)\s+(.*)$/);
  if (!match) {
    const digits = trimmed.replace(/\D/g, '');
    return digits.startsWith('00') ? digits.slice(2) : digits;
  }
  const dial = match[1].replace(/\D/g, '');
  let local = match[2].replace(/\D/g, '');
  if (local.startsWith(dial) && local.length > dial.length + 6) local = local.slice(dial.length);
  if (dial !== '39') local = local.replace(/^0+/, '');
  return dial + local;
}

/** A link that opens a WhatsApp chat with the applicant, optionally with a message pre-filled. */
export function whatsappLink(app: AdminApplication, text?: string) {
  const base = `https://wa.me/${whatsappDigits(app.whatsappNumber)}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

const DAY_MS = 86_400_000;

export type SequenceState =
  | { kind: 'optedOut'; sent: number }
  | { kind: 'replied'; sent: number }
  | { kind: 'stopped'; sent: number }
  | { kind: 'finished'; sent: number }
  /** The next message is due (or overdue). */
  | { kind: 'due'; sent: number; next: number; dueAt: number; daysOverdue: number }
  /** Waiting for the next message's day. */
  | { kind: 'waiting'; sent: number; next: number; dueAt: number; daysUntil: number };

/** Where an approved applicant is in the five-message sequence; null if not approved. */
export function sequenceState(app: AdminApplication, now = Date.now()): SequenceState | null {
  if (app.status !== 'approved' || !app.approvedAt) return null;
  const sent = app.messagesSent;
  if (app.optedOutAt) return { kind: 'optedOut', sent };
  if (app.repliedAt) return { kind: 'replied', sent };
  if (app.followUpsStoppedAt) return { kind: 'stopped', sent };
  if (sent >= SEQUENCE_DAYS.length) return { kind: 'finished', sent };

  // Due dates count calendar days from the approval day, so "day 2" is due from
  // the start of the second day after approval regardless of the approval time.
  const start = new Date(app.approvedAt);
  start.setHours(0, 0, 0, 0);
  const dueAt = start.getTime() + SEQUENCE_DAYS[sent] * DAY_MS;
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  const diff = Math.round((today.getTime() - dueAt) / DAY_MS);
  return diff >= 0
    ? { kind: 'due', sent, next: sent, dueAt, daysOverdue: diff }
    : { kind: 'waiting', sent, next: sent, dueAt, daysUntil: -diff };
}
