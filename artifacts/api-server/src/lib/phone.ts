/**
 * The digits WhatsApp uses for a number (country code + number, no "+"), from
 * the form's stored value ("+44 07886 857463" → "447886857463"). The forms save
 * "<dial code> <local number>"; a trunk 0 typed at the start of the local part
 * is dropped, except for Italy where it's part of the number.
 * Keep in step with whatsappDigits in artifacts/aldric-dashboard/src/lib/admin-sequences.ts.
 */
export function whatsappDigits(stored: string): string {
  const trimmed = stored.trim();
  const match = trimmed.match(/^(\+[\d-]+)\s+(.*)$/);
  if (!match) {
    const digits = trimmed.replace(/\D/g, "");
    return digits.startsWith("00") ? digits.slice(2) : digits;
  }
  const dial = match[1].replace(/\D/g, "");
  let local = match[2].replace(/\D/g, "");
  if (local.startsWith(dial) && local.length > dial.length + 6) local = local.slice(dial.length);
  if (dial !== "39") local = local.replace(/^0+/, "");
  return dial + local;
}
