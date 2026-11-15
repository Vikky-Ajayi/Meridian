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
  /** Channel fixed at approval; null for older approvals (manual). */
  contactChannel: WhatsAppMode | null;
  /** How many of the five WhatsApp sequence messages have been sent (0–5). */
  messagesSent: number;
  lastMessageAt: string | null;
  repliedAt: string | null;
  followUpsStoppedAt: string | null;
  optedOutAt: string | null;
  /** What they chose in reply to Message 1 (WhatsApp channel). */
  choice: "whatsapp" | "call" | null;
  /** Most recent automatic-send failure, if any. */
  sendError: string | null;
  sendErrorAt: string | null;
  /** When they clicked the WhatsApp button in an approval email (email channel). */
  whatsappClickedAt: string | null;
  answers: AdminAnswer[];
}

/**
 * How approved applicants are contacted:
 * whatsapp: WhatsApp Cloud API connected; the server sends WhatsApp messages and replies land in the Inbox.
 * email: the server sends an approval email with a "Message us on WhatsApp" button, then follow-up emails.
 * manual: the dashboard opens WhatsApp with each message pre-filled.
 */
export type WhatsAppMode = "whatsapp" | "email" | "manual";

/**
 * The flow that applies to this applicant: approved applicants keep the channel
 * they were approved with; everyone else follows the currently active one.
 */
export const effectiveMode = (app: AdminApplication, current: WhatsAppMode): WhatsAppMode =>
  app.status === "approved" ? app.contactChannel ?? "manual" : current;

export interface WhatsAppInfo {
  mode: WhatsAppMode;
  /** Webhook secrets set, so replies and delivery updates arrive. */
  repliesConnected: boolean;
  /** Settings still needed for the email channel (empty when it's ready). */
  missingEmailConfig: string[];
}

export interface EmailTemplate {
  subject: string;
  paragraphs: string[];
}

export interface RenderedEmail {
  subject: string;
  html: string;
  text: string;
}

export interface Conversation {
  waId: string;
  name: string;
  profileName: string | null;
  reference: string | null;
  form: AdminForm | null;
  lastMessage: { body: string; direction: "in" | "out"; at: string; status: string } | null;
  lastInboundAt: string | null;
  /** Within WhatsApp's 24-hour window, so free text can be sent. */
  canReply: boolean;
  awaitingReply: boolean;
}

export interface ThreadMessage {
  id: number;
  direction: "in" | "out";
  kind: string;
  templateName: string | null;
  body: string;
  status: string;
  error: string | null;
  at: string;
}

export interface Thread {
  conversation: Conversation;
  messages: ThreadMessage[];
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
  return request<{ applications: AdminApplication[]; whatsapp: WhatsAppInfo }>("/applications");
}

/** Approves; sends Message / Email 1 (WhatsApp or email channel) or records it as sent (manual). */
export const approveApplication = (reference: string) => post(reference, "approve");
/** Automatic mode: send the follow-up that's due right now. */
export const sendDueNow = (reference: string) => post(reference, "send-due");
export const markMessageSent = (reference: string, step: number) => post(reference, "message-sent", { step });
export const undoMessage = (reference: string, step: number) => post(reference, "undo-message", { step });
export const setReplied = (reference: string, replied: boolean) => post(reference, "replied", { replied });
export const setFollowUpsStopped = (reference: string, stopped: boolean) => post(reference, "follow-ups", { stopped });
export const setApplicationStatus = (reference: string, status: "new" | "hold" | "rejected") =>
  post(reference, "status", { status });
export const saveApplicationNote = (reference: string, note: string): One =>
  request(`${ref(reference)}/note`, { method: "PUT", body: { note } });

export const getEmailPreview = (reference: string, step: number) =>
  request<RenderedEmail>(`${ref(reference)}/email-preview?step=${step}`);
export const getEmailTemplates = () =>
  request<{ templates: Record<AdminForm, EmailTemplate[]>; prefilledWhatsAppText: string }>("/email-templates");

export const getConversations = () => request<{ conversations: Conversation[] }>("/conversations");
export const getThread = (waId: string) => request<Thread>(`/conversations/${waId}`);
export const sendThreadMessage = (waId: string, text: string) =>
  request<Thread>(`/conversations/${waId}/messages`, { method: "POST", body: { text } });
export const restartThread = (waId: string) => request<Thread>(`/conversations/${waId}/restart`, { method: "POST", body: {} });
