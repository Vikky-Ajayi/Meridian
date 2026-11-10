// Privacy policy. Describes what the site and admin dashboard actually do
// (forms, WhatsApp follow-ups, service providers); review with compliance
// before changing the processing it describes.

const LAST_UPDATED = '10 November 2026';

const sections: [string, string[]][] = [
  ['Who We Are', [
    'Envoi & Co ("we", "us") provides private banking introductions and international transfer advisory services.',
    'We are responsible for the personal information you give us through this website and when we contact you. Questions about this policy can be sent to compliance@envoiandco.com.',
  ]],
  ['What We Collect', [
    'Move Money Abroad enquiries: the approximate amount, where the funds are held and where they are going, the purpose and source of the funds, whether they are available, your authority over them, your timeline and the assistance you need.',
    'Private Banking Introduction enquiries: the banking relationship you are looking for, your approximate investable wealth and initial capital, the jurisdictions you are interested in, your goals, the general source of your wealth, your timeline and what prompted your enquiry.',
    'Contact details for all enquiries: your full name, country of residence, email address and WhatsApp number. The contact form also collects your phone number and message.',
    'If you select an amount below our minimum, we record only that amount, without any contact details.',
    'Messages you send us on WhatsApp, and the delivery and read status of messages we send you.',
    'If you create a client dashboard account, your email address and the capabilities or requirements you submit.',
  ]],
  ['How We Use It', [
    'To review your enquiry and decide whether we can help.',
    'To contact you about your enquiry, mainly on WhatsApp and by email, and to arrange calls you request.',
    'To arrange introductions you ask us to make, sharing only the details relevant to that introduction with the regulated institutions or partners involved.',
    'To meet our legal and regulatory obligations, including anti-money-laundering checks and record-keeping.',
    'We use your information because it is necessary to respond to your request and take steps before entering into an engagement with you, for our legitimate interests in running and protecting our business, and to comply with the law.',
  ]],
  ['WhatsApp Messages', [
    'If your enquiry is approved to progress, we will message you on WhatsApp at the number you provided. If you do not reply, we may send up to four short follow-up messages over the following 14 days, after which we stop.',
    'We send these messages using the WhatsApp Business Platform provided by Meta. Meta processes the messages to deliver them, under its own terms and privacy policy.',
    'You can stop our messages at any time by replying STOP, or by telling us you no longer wish to be contacted. We will not message you again unless you contact us.',
    'For your security, we will never ask for passwords, PINs or one-time codes on WhatsApp.',
  ]],
  ['Who We Share It With', [
    'Service providers who host or operate our website and systems on our behalf: website hosting (Vercel), application hosting and database (Railway), record keeping (Google Workspace), email delivery for login codes (Resend) and messaging (Meta, WhatsApp Business Platform).',
    'Banks, financial institutions and partners, only when you ask us to proceed with an introduction or transfer and only as needed for it.',
    'Regulators, law enforcement or other authorities where the law requires it.',
    'We do not sell your personal information.',
  ]],
  ['International Transfers', [
    'Some of our service providers process information outside the United Kingdom. Where they do, we rely on appropriate safeguards, such as adequacy regulations or standard contractual clauses, to protect your information.',
  ]],
  ['How Long We Keep It', [
    'We keep your information only for as long as we need it for the purposes above, including to meet legal and regulatory record-keeping requirements. Anti-money-laundering records, for example, are generally kept for five years after a business relationship ends.',
    'If your enquiry does not progress, we delete or anonymise your details when we no longer need them.',
  ]],
  ['Your Rights', [
    'You can ask us for a copy of your personal information, ask us to correct or delete it, object to or ask us to restrict how we use it, and ask us to transfer it to you or someone else.',
    'Where we rely on your consent, you can withdraw it at any time.',
    'To make a request, email compliance@envoiandco.com. You also have the right to complain to the Information Commissioner\'s Office (ico.org.uk), although we would appreciate the chance to resolve your concern first.',
  ]],
  ['Security', [
    'We use appropriate technical and organisational measures to protect your information, including encrypted connections and restricted access. No method of transmission over the internet is completely secure, so please do not send account numbers, passwords or identity documents through our forms or WhatsApp unless we ask for them through a secure channel.',
  ]],
  ['Changes To This Policy', [
    `We may update this policy from time to time. The latest version will always be on this page. Last updated: ${LAST_UPDATED}.`,
  ]],
];

export default function Privacy() {
  return (
    <div className="content-page policy-page">
      <section className="blue-panel">
        <h1>Privacy Policy</h1>
        <p>
          This policy explains what personal information Envoi & Co collects when you use this
          website or contact us, how we use it, who we share it with and the choices you have.
        </p>
      </section>
      <main className="text-body">
        {sections.map(([title, paragraphs], index) => (
          <section className="policy-block" key={title}>
            <h2>{index + 1}. {title}</h2>
            {paragraphs.map((text) => <p key={text}>{text}</p>)}
          </section>
        ))}
        <section className="policy-block">
          <h2>{sections.length + 1}. Contact</h2>
          <p>
            Compliance Officer: Robert Tigi<br />
            Email: <span className="blue-link">compliance@envoiandco.com</span>
          </p>
        </section>
      </main>
    </div>
  );
}
