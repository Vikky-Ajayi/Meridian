/**
 * Generates a reference number like MMA-20260717-1639 (Move Money Abroad)
 * or PBI-20260717-1639 (Private Banking Introduction)
 */
export function generateReferenceNumber(prefix: "MMA" | "PBI"): string {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, "");
  const time = now.toTimeString().slice(0, 5).replace(":", "");
  return `${prefix}-${date}-${time}`;
}
