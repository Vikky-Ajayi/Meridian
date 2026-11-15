import { randomBytes } from "node:crypto";

/**
 * Generates a reference number like MMA-20260717-1639 (Move Money Abroad),
 * PBI-20260717-1639 (Private Banking Introduction), CON-20260717-1639
 * (Contact Us), CAP-20260717-1639
 * (Envoi Capability), or REQ-20260717-1639 (Envoi Requirement).
 */
export function generateReferenceNumber(prefix: "MMA" | "PBI" | "CON" | "CAP" | "REQ"): string {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, "");
  const time = now.toTimeString().slice(0, 5).replace(":", "");
  return `${prefix}-${date}-${time}`;
}

/**
 * Reference for a service application, e.g. HRE-20261115-1432-K7P. The random
 * suffix keeps references unique when two people apply in the same minute.
 */
export function generateServiceReference(prefix: string): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const suffix = Array.from(randomBytes(3), (b) => alphabet[b % alphabet.length]).join("");
  return `${generateReferenceNumber("MMA").replace(/^MMA/, prefix)}-${suffix}`;
}
