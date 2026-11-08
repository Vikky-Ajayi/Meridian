const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

export type AdminForm = "move-money" | "private-banking";
export type AdminStatus = "new" | "approved" | "hold" | "rejected";
export type ReplyState = "replied" | "waiting" | "unknown";

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
  followUpsStoppedAt: string | null;
  answers: AdminAnswer[];
}

export interface BrevoConnection {
  connected: boolean;
  missing: string[];
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

export function getApplications() {
  return request<{ applications: AdminApplication[]; brevo: BrevoConnection }>("/applications");
}

export function getWhatsappStatuses() {
  return request<{ statuses: Record<string, ReplyState> }>("/whatsapp-status");
}

const ref = (reference: string) => `/applications/${encodeURIComponent(reference)}`;

export function approveApplication(reference: string) {
  return request<{ application: AdminApplication }>(`${ref(reference)}/approve`, { method: "POST", body: {} });
}

export function setApplicationStatus(reference: string, status: "new" | "hold" | "rejected") {
  return request<{ application: AdminApplication }>(`${ref(reference)}/status`, { method: "POST", body: { status } });
}

export function saveApplicationNote(reference: string, note: string) {
  return request<{ application: AdminApplication }>(`${ref(reference)}/note`, { method: "PUT", body: { note } });
}

export function stopApplicationFollowUps(reference: string) {
  return request<{ application: AdminApplication }>(`${ref(reference)}/stop-follow-ups`, { method: "POST", body: {} });
}
