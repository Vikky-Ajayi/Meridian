const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

export type AdminForm = "move-money" | "private-banking";
export type AdminStatus = "new" | "approved" | "hold" | "rejected";

export interface AdminAnswer {
  key: string;
  question: string;
  answer: string;
}

export interface AdminApplication {
  reference: string;
  form: AdminForm;
  fullName: string;
  email: string;
  whatsappNumber: string;
  country: string;
  submittedAt: string;
  status: AdminStatus;
  note: string;
  approvedAt: string | null;
  /** How many of the five WhatsApp sequence messages have been sent (0–5). */
  messagesSent: number;
  lastMessageAt: string | null;
  repliedAt: string | null;
  followUpsStoppedAt: string | null;
  answers: AdminAnswer[];
}

async function request<T>(path: string, init?: { method: string; body?: unknown }): Promise<T> {
  const res = await fetch(`${API_BASE_URL}/api/admin${path}`, {
    method: init?.method ?? "GET",
    headers: init?.body === undefined ? undefined : { "Content-Type": "application/json" },
    body: init?.body === undefined ? undefined : JSON.stringify(init.body),
  });
  const data = (await res.json().catch(() => ({}))) as T & { error?: string };
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status}).`);
  return data;
}

type One = Promise<{ application: AdminApplication }>;
const ref = (reference: string) => `/applications/${encodeURIComponent(reference)}`;
const post = (reference: string, action: string, body: unknown = {}): One =>
  request(`${ref(reference)}/${action}`, { method: "POST", body });

export function getApplications() {
  return request<{ applications: AdminApplication[] }>("/applications");
}

/** Approves and records Message 1 as sent. */
export const approveApplication = (reference: string) => post(reference, "approve");
export const markMessageSent = (reference: string, step: number) => post(reference, "message-sent", { step });
export const undoMessage = (reference: string, step: number) => post(reference, "undo-message", { step });
export const setReplied = (reference: string, replied: boolean) => post(reference, "replied", { replied });
export const setFollowUpsStopped = (reference: string, stopped: boolean) => post(reference, "follow-ups", { stopped });
export const setApplicationStatus = (reference: string, status: "new" | "hold" | "rejected") =>
  post(reference, "status", { status });
export const saveApplicationNote = (reference: string, note: string): One =>
  request(`${ref(reference)}/note`, { method: "PUT", body: { note } });
