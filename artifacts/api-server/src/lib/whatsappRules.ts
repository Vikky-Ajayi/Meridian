import { SEQUENCE_DAYS } from "./whatsappTemplates";

// Pure rules for the WhatsApp sequence: UK business hours, when a follow-up is
// due, and how replies are read. No database or network access, so they can be
// tested on their own.

const londonFormat = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/London",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  hourCycle: "h23",
  weekday: "short",
});

/** London calendar day (days since epoch), weekday and hour for a moment in time. */
export function londonParts(date: Date) {
  const parts = Object.fromEntries(londonFormat.formatToParts(date).map((p) => [p.type, p.value]));
  const day = Date.UTC(Number(parts.year), Number(parts.month) - 1, Number(parts.day)) / 86_400_000;
  return { day, weekday: parts.weekday as string, hour: Number(parts.hour) };
}

/** Follow-ups go out Monday–Friday, 08:00–20:00 UK time (the desk's advertised hours). */
export function withinSendingWindow(now: Date): boolean {
  const { weekday, hour } = londonParts(now);
  return !["Sat", "Sun"].includes(weekday) && hour >= 8 && hour < 20;
}

/**
 * Whether sequence message `index` (0-based) is due: from the start of the
 * UK calendar day that is SEQUENCE_DAYS[index] days after the approval day.
 */
export function isDue(approvedAt: Date, index: number, now: Date): boolean {
  if (index < 0 || index >= SEQUENCE_DAYS.length) return false;
  return londonParts(now).day >= londonParts(approvedAt).day + SEQUENCE_DAYS[index];
}

const OPT_OUT = /\b(stop|unsubscribe)\b|stop promotions|(don'?t|do not) (contact|message)/i;

/** The applicant is asking not to be contacted (typed, or Meta's "Stop promotions" button). */
export const isOptOut = (text: string) => OPT_OUT.test(text);

/** "call" / "whatsapp" from a quick-reply tap or a typed answer to Message 1. */
export function detectChoice(text: string): "call" | "whatsapp" | null {
  if (/\bcall\b/i.test(text)) return "call";
  if (/whats\s?app|\bchat\b/i.test(text)) return "whatsapp";
  return null;
}
