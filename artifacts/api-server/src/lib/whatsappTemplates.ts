// WhatsApp message templates used in WhatsApp Cloud API mode. Each one must be
// created and approved in Meta's WhatsApp Manager with exactly this name and
// language, with {{1}} as the applicant's first name. The text here is what we
// record in the dashboard inbox; keep it identical to the approved template
// (and to TEMPLATES in artifacts/aldric-dashboard/src/lib/admin-sequences.ts).

export type FormType = "move-money" | "private-banking";

export const TEMPLATE_LANGUAGE = "en_GB";

/** Days after approval on which each sequence message is due. */
export const SEQUENCE_DAYS = [0, 2, 5, 9, 14] as const;

export const SEQUENCE_TEMPLATES: Record<FormType, readonly { name: string; text: string }[]> = {
  "move-money": [
    { name: "mma_1_invite", text: "Hi {{1}}, thank you for applying to move money abroad with Envoi & Co.\n\nYour application has been approved to progress to the next stage. Our team would like to discuss your transfer requirements and guide you through the next steps.\n\nWould you prefer to chat here on WhatsApp or schedule a call?" },
    { name: "mma_2_followup", text: "Hi {{1}}, just following up on your request to move money abroad with Envoi & Co.\n\nAre you still planning to make the transfer? Reply here and we’ll help you explore the next steps." },
    { name: "mma_3_questions", text: "Hi {{1}}, do you have any questions about moving your money abroad?\n\nWhether it’s the process, required documents, fees or timing, our team can talk you through the details before you decide to proceed.\n\nWhat would you like to know?" },
    { name: "mma_4_checkin", text: "Hi {{1}}, we understand your transfer plans may have changed.\n\nAre you looking to move money soon, planning for later, or no longer looking? Let us know so we can follow up appropriately." },
    { name: "mma_5_final", text: "Hi {{1}}, this is our final follow-up about your request to move money abroad with Envoi & Co.\n\nWe’ll pause our messages for now. If you’d like to continue, simply reply here whenever you’re ready.\n\nThank you for considering Envoi & Co." },
  ],
  "private-banking": [
    { name: "pbi_1_invite", text: "Hi {{1}}, thank you for your interest in a private banking introduction through Envoi & Co.\n\nYour application has been approved to progress to the next stage. Our team would like to understand your banking requirements and explain how the introduction process works.\n\nWould you prefer to chat here on WhatsApp or schedule a call?" },
    { name: "pbi_2_followup", text: "Hi {{1}}, just following up on your request for a private banking introduction.\n\nAre you still interested in exploring your options with Envoi & Co? Reply here and we’ll guide you through the next steps." },
    { name: "pbi_3_questions", text: "Hi {{1}}, do you have any questions before progressing with your private banking introduction?\n\nOur team can explain the process, the information required and what to expect next.\n\nWhat would you like to know?" },
    { name: "pbi_4_checkin", text: "Hi {{1}}, we appreciate you may be busy.\n\nWould you like to discuss your private banking requirements now, reconnect later, or pause your enquiry? Let us know what suits you." },
    { name: "pbi_5_final", text: "Hi {{1}}, this is our final follow-up about your private banking introduction request.\n\nWe’ll pause our messages for now. If you’d like to continue, simply reply here whenever you’re ready.\n\nThank you for considering Envoi & Co." },
  ],
};

/** Automatic answers to the two quick-reply buttons on Message 1. */
export const REPLY_TEMPLATES = {
  whatsapp: {
    name: "reply_chose_whatsapp",
    text: "Thank you, {{1}}. We’ll continue here on WhatsApp.\n\nA member of our team will message you shortly to discuss your requirements and the next steps. Our team is available 08:00–20:00 GMT, Monday to Friday, so if you’ve messaged outside these hours, we’ll reply as soon as we’re back.\n\nFor your security, Envoi & Co will never ask for passwords, PINs or one-time codes on WhatsApp.",
  },
  call: {
    name: "reply_chose_call",
    text: "Thank you, {{1}}. Please use the button below to choose a time for your call that suits you.\n\nOnce booked, you’ll receive a confirmation with the call details. If none of the times work for you, just reply here and we’ll arrange another.",
  },
} as const;

/** Reopens a conversation after WhatsApp's 24-hour reply window has closed. */
export const RESTART_TEMPLATE = {
  name: "envoi_restart",
  text: "Hi {{1}}, we’re following up on your enquiry with Envoi & Co. Reply here whenever suits you and our team will pick up the conversation.",
} as const;

export const fillFirstName = (text: string, firstName: string) => text.replace("{{1}}", firstName);

export const firstNameOf = (fullName: string) => fullName.trim().split(/\s+/)[0] ?? "";
