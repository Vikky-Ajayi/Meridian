/**
 * Generates a reference number like MMA-20260717-1639 (Move Money Abroad),
 * PBI-20260717-1639 (Private Banking Introduction), CAP-20260717-1639
 * (Aldric Capability), or REQ-20260717-1639 (Aldric Requirement).
 */
export function generateReferenceNumber(prefix: "MMA" | "PBI" | "CAP" | "REQ"): string {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, "");
  const time = now.toTimeString().slice(0, 5).replace(":", "");
  return `${prefix}-${date}-${time}`;
}
