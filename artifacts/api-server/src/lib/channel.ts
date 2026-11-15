import { emailConfigured } from "./emailSequence";
import { cloudApiConfigured } from "./whatsappCloud";

/**
 * How approved applicants are contacted:
 *  • whatsapp – WhatsApp Cloud API connected; the server sends WhatsApp templates
 *  • email    – approval and follow-up emails with a "Message us on WhatsApp" button
 *  • manual   – the dashboard opens WhatsApp with each message pre-filled
 */
export type Channel = "whatsapp" | "email" | "manual";

export function currentChannel(): Channel {
  if (cloudApiConfigured()) return "whatsapp";
  if (emailConfigured()) return "email";
  return "manual";
}
