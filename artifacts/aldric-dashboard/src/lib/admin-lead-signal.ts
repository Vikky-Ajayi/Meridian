import type { AdminApplication } from './admin-api';

export type SignalLevel = 'strong' | 'fair' | 'weak';
export type SignalReason = { tone: 'good' | 'mixed' | 'poor'; text: string };

// A quick read of the multiple-choice answers so the most serious applicants
// stand out. It's a sorting aid; the admin still makes the call. Option text
// must match the live forms (artifacts/meridian/src/pages/FlowPage.tsx).
export function leadSignal(app: AdminApplication): { level: SignalLevel; reasons: SignalReason[] } {
  const a = Object.fromEntries(app.answers.map((x) => [x.key, x.answer]));
  const reasons: SignalReason[] = [];
  const add = (tone: SignalReason['tone'], text: string) => reasons.push({ tone, text });

  if (app.form === 'move-money') {
    const amount = a.amount ?? '';
    if (/£1 million – £10 million|£10 million\+/.test(amount)) add('good', `Moving ${amount}`);
    else if (/£500,000 – £1 million/.test(amount)) add('good', 'Moving £500,000 – £1 million');
    else if (/Prefer not/.test(amount)) add('poor', 'Would not disclose the amount');
    else if (amount) add('mixed', `Moving ${amount}`);

    const timeline = a.timeline ?? '';
    if (/Immediately|Within 30 days/.test(timeline)) add('good', `Ready to proceed: ${timeline.toLowerCase()}`);
    else if (/Researching/.test(timeline)) add('poor', 'Only researching options');
    else if (timeline) add('mixed', `Timeline: ${timeline.toLowerCase()}`);

    const availability = a.availability ?? '';
    if (/fully available/.test(availability)) add('good', 'Funds fully available');
    else if (/Not yet/.test(availability)) add('poor', 'Funds not yet available');
    else if (availability) add('mixed', 'Funds partly available');

    const institution = a.institution ?? '';
    if (institution === 'Yes') add('good', 'Funds held with a regulated institution');
    else if (institution === 'No') add('poor', 'Funds not held with a regulated institution');
    else if (institution) add('mixed', 'Regulated institution being arranged');

    const authority = a.authority ?? '';
    if (/own or control|authorised business representative/.test(authority)) add('good', 'Has authority over the funds');
    else if (authority) add('mixed', `Authority: ${authority.toLowerCase()}`);
  } else {
    const wealth = a.wealth ?? '';
    if (/£5 million – £25 million|£25 million\+|£1 million – £5 million/.test(wealth)) add('good', `Investable wealth ${wealth}`);
    else if (/Below £250,000/.test(wealth)) add('poor', 'Investable wealth below £250,000');
    else if (/Prefer not/.test(wealth)) add('poor', 'Would not disclose wealth');
    else if (wealth) add('mixed', `Investable wealth ${wealth}`);

    const timeline = a.timeline ?? '';
    if (/Immediately|Within 3 months/.test(timeline)) add('good', `Wants to start ${timeline.toLowerCase()}`);
    else if (/exploring/.test(timeline)) add('poor', 'Only exploring options');
    else if (timeline) add('mixed', `Timeline: ${timeline.toLowerCase()}`);

    const capital = a.capital ?? '';
    if (/£1 million – £5 million|£5 million – £25 million|£25 million\+/.test(capital)) add('good', `Initial capital ${capital}`);
    else if (/not yet determined/.test(capital)) add('poor', 'No initial capital figure');
    else if (/Below £250,000/.test(capital)) add('poor', 'Initial capital below £250,000');
    else if (capital) add('mixed', `Initial capital ${capital}`);
  }

  const points = reasons.reduce((sum, r) => sum + (r.tone === 'good' ? 2 : r.tone === 'mixed' ? 1 : 0), 0);
  const max = reasons.length * 2 || 1;
  const level: SignalLevel = points >= max * 0.75 ? 'strong' : points >= max * 0.45 ? 'fair' : 'weak';
  return { level, reasons };
}

/** References of other applications with the same email or WhatsApp number. */
export function findDuplicates(app: AdminApplication, all: AdminApplication[]): AdminApplication[] {
  const digits = (s: string) => s.replace(/\D/g, '');
  const email = app.email.trim().toLowerCase();
  const phone = digits(app.whatsappNumber);
  return all.filter(
    (other) =>
      other.reference !== app.reference &&
      (other.email.trim().toLowerCase() === email || (phone.length >= 7 && digits(other.whatsappNumber) === phone)),
  );
}
