import { useState } from 'react';
import { Link } from 'wouter';
import {
  useCompleteServiceApplication,
  useStartServiceApplication,
} from '@workspace/api-client-react';
import { Logo } from '@/components/ui/Logo';
import { DESK_WHATSAPP_LINK, DESK_WHATSAPP_NUMBER } from '@/lib/contact';
import {
  AMOUNT_OPTIONS,
  CURRENCIES,
  serviceBySlug,
  type Currency,
  type Field,
  type Service,
} from '@/lib/services';
import NotFound from '@/pages/not-found';

// Two-step application for one service. Step 1 is saved as a lead before step 2
// is shown, so contact details aren't lost if the visitor stops there.

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

const HEADING = { fontFamily: "'Inter Tight', Inter, sans-serif" };
const INPUT =
  'w-full min-h-[52px] px-3.5 border border-[#D5DBE5] rounded-md text-base font-normal text-[#0A1633] bg-white focus:outline-none focus:ring-2 focus:ring-[#1767E8]/40';
const LABEL = 'flex flex-col gap-2 text-[15px] font-semibold text-[#0A1633]';
const CARD = 'rounded-2xl border border-[#ECEFF4] bg-white';

type Stage = 'details' | 'situation' | 'done' | 'below-minimum';

/** The API's own message (e.g. a validation error) if it sent one. */
const errorText = (err: unknown) => {
  const message = (err as { data?: { error?: unknown } } | null)?.data?.error;
  return typeof message === 'string' && message ? message : 'Something went wrong. Please check your connection and try again.';
};

function Arrow({ back = false }: { back?: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={back ? 'M19 12H5M11 6l-6 6 6 6' : 'M5 12h14M13 6l6 6-6 6'} />
    </svg>
  );
}

function Check({ className = '' }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1767E8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <path d="M5 12l4 4 10-10" />
    </svg>
  );
}

function Progress({ step }: { step: 1 | 2 }) {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex justify-between text-sm">
        <span className="font-semibold text-[#1767E8]">Step {step} of 2</span>
        <span className="text-[#4A5468]">{step === 1 ? 'Your details · 30 seconds' : 'Your situation · about 5 minutes'}</span>
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        <span className="h-1.5 rounded-[3px] bg-[#1767E8]" />
        <span className={`h-1.5 rounded-[3px] ${step === 2 ? 'bg-[#1767E8]' : 'bg-[#DCE3EE]'}`} />
      </div>
    </div>
  );
}

// Every question is compulsory; "I'd rather explain on a call" is the way to skip step 2.
function FieldInput({ field, value, onChange }: { field: Field; value: string; onChange: (v: string) => void }) {
  if (field.kind === 'select') {
    return (
      <select className={INPUT} required value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">Select…</option>
        {field.options?.map((o) => <option key={o}>{o}</option>)}
      </select>
    );
  }
  if (field.kind === 'textarea') {
    return (
      <textarea
        className={`${INPUT} py-3 leading-relaxed resize-y`}
        required
        rows={field.rows ?? 3}
        maxLength={4000}
        placeholder={field.placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }
  return <input className={INPUT} required type="text" placeholder={field.placeholder} value={value} onChange={(e) => onChange(e.target.value)} />;
}

function Aside() {
  return (
    <aside className="flex-[1_1_300px] flex flex-col gap-4 lg:sticky lg:top-6">
      <div className="rounded-2xl bg-[#1767E8] text-white p-6">
        <h2 className="m-0 text-xl font-bold tracking-[-0.5px]" style={HEADING}>What happens next</h2>
        <ol className="mt-3 mb-0 pl-5 list-decimal flex flex-col gap-2 text-[14.5px] leading-snug">
          <li>A member of our desk reviews your application.</li>
          <li>We contact you within 24 hours for a private consultation.</li>
          <li>We agree the route and costs, then handle it to completion.</li>
        </ol>
      </div>
      <figure className={`${CARD} m-0 p-6`}>
        <blockquote className="m-0 text-[14.5px] leading-relaxed text-[#0A1633]">
          "Envoi & Co provided a highly professional and discreet approach to navigating an international financial requirement."
        </blockquote>
        <figcaption className="mt-3 text-[13px] font-semibold text-[#0A1633]">- Private Client, United Kingdom</figcaption>
      </figure>
      <div className={`${CARD} p-6 flex flex-col gap-2.5 text-[13.5px] text-[#2B3445]`}>
        <span className="flex gap-2.5 items-start"><Check className="mt-0.5 flex-none" />Regulated banks and partners only</span>
        <span className="flex gap-2.5 items-start"><Check className="mt-0.5 flex-none" />One dedicated contact</span>
        <span className="flex gap-2.5 items-start">
          <Check className="mt-0.5 flex-none" />
          <span>Prefer to talk? WhatsApp <a className="font-semibold text-[#0A1633] underline" href={DESK_WHATSAPP_LINK} target="_blank" rel="noreferrer">{DESK_WHATSAPP_NUMBER}</a></span>
        </span>
      </div>
    </aside>
  );
}

function ServiceForm({ service }: { service: Service }) {
  const [stage, setStage] = useState<Stage>('details');
  const [lead, setLead] = useState({
    fullName: '',
    whatsappNumber: '',
    emailAddress: '',
    countryOfResidence: '',
    currency: 'GBP' as Currency,
    amount: '',
    timeline: '',
    extra: '',
    consent: false,
  });
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [confirms, setConfirms] = useState({ accuracy: false, fee: false });
  const [session, setSession] = useState<{ reference: string; token: string } | null>(null);
  const [skipped, setSkipped] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const start = useStartServiceApplication();
  const complete = useCompleteServiceApplication();
  const setL = <K extends keyof typeof lead>(key: K, value: (typeof lead)[K]) => setLead((prev) => ({ ...prev, [key]: value }));
  const show = (next: Stage) => {
    setError(null);
    setStage(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  async function submitDetails(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!e.currentTarget.reportValidity() || start.isPending) return;
    setError(null);
    try {
      const result = await start.mutateAsync({
        data: {
          service: service.slug,
          fullName: lead.fullName,
          whatsappNumber: lead.whatsappNumber,
          emailAddress: lead.emailAddress,
          countryOfResidence: lead.countryOfResidence,
          currency: lead.currency,
          amount: lead.amount,
          timeline: lead.timeline,
          extraAnswer: lead.extra,
          consent: lead.consent,
        },
      });
      setSession({ reference: result.referenceNumber, token: result.token });
      if (result.belowMinimum) {
        show('below-minimum');
        return;
      }
      window.fbq?.('track', 'Lead', { content_name: service.name });
      show('situation');
    } catch (err) {
      setError(errorText(err));
    }
  }

  async function finish(action: 'apply' | 'call', form?: HTMLFormElement) {
    if (!session || complete.isPending) return;
    if (action === 'apply' && form && !form.reportValidity()) return;
    setError(null);
    try {
      await complete.mutateAsync({
        referenceNumber: session.reference,
        data: {
          token: session.token,
          action,
          answers: action === 'apply' ? answers : undefined,
          confirmsAccuracy: confirms.accuracy,
          acceptsAdvisoryFee: confirms.fee,
        },
      });
      window.fbq?.('trackCustom', action === 'apply' ? 'SubmitApplication' : 'CallRequested', { content_name: service.name });
      setSkipped(action === 'call');
      show('done');
    } catch (err) {
      setError(errorText(err));
    }
  }

  const amountOptions = AMOUNT_OPTIONS[lead.currency];

  return (
    <div className="min-h-screen bg-[#F7F9FC] text-[#0A1633]" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      <header className="border-t-2 border-[#1F1F1F] border-b border-b-[#ECEFF4] bg-white">
        <div className="max-w-[1300px] mx-auto px-5 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
          <Logo theme="light" />
          <span className="inline-flex items-center gap-2 text-sm text-[#4A5468]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1767E8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 018 0v4" /></svg>
            Secure and confidential
          </span>
        </div>
      </header>

      <div className="max-w-[1300px] mx-auto px-5 sm:px-8 pt-10 sm:pt-12 pb-24 flex flex-wrap gap-10 items-start">
        <main className="flex-[999_1_640px] min-w-0 flex flex-col gap-7">
          {stage === 'details' && (
            <>
              <div className="flex flex-col gap-3.5">
                <Link href="/" className="self-start inline-flex items-center gap-1.5 min-h-[44px] text-sm text-[#4A5468] no-underline">
                  <Arrow back />Change service
                </Link>
                <p className="m-0 text-sm font-semibold text-[#1767E8]">{service.name}</p>
                <h1 className="m-0 text-[36px] sm:text-[48px] leading-[1.02] font-bold tracking-[-1.8px]" style={HEADING}>{service.title}</h1>
                <p className="m-0 max-w-[640px] text-lg leading-normal text-[#4A5468]">{service.intro}</p>
              </div>
              <form className={`${CARD} p-6 sm:p-9 flex flex-col gap-7`} onSubmit={submitDetails}>
                <Progress step={1} />
                <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-5">
                  <label className={LABEL}>Full name
                    <input className={INPUT} required type="text" autoComplete="name" placeholder="Your name" value={lead.fullName} onChange={(e) => setL('fullName', e.target.value)} />
                  </label>
                  <label className={LABEL}>WhatsApp / phone
                    <input className={INPUT} required type="tel" autoComplete="tel" placeholder="+44 …" value={lead.whatsappNumber} onChange={(e) => setL('whatsappNumber', e.target.value)} />
                  </label>
                  <label className={LABEL}>Email
                    <input className={INPUT} required type="email" autoComplete="email" placeholder="you@example.com" value={lead.emailAddress} onChange={(e) => setL('emailAddress', e.target.value)} />
                  </label>
                  <label className={LABEL}>Country of residence
                    <input className={INPUT} required type="text" autoComplete="country-name" placeholder="e.g. United Kingdom" value={lead.countryOfResidence} onChange={(e) => setL('countryOfResidence', e.target.value)} />
                  </label>
                  <div className={LABEL}>
                    <span id="currency-label">Currency</span>
                    <div role="radiogroup" aria-labelledby="currency-label" className="grid grid-cols-2 gap-2">
                      {CURRENCIES.map((c) => (
                        <button
                          key={c.value}
                          type="button"
                          role="radio"
                          aria-checked={lead.currency === c.value}
                          onClick={() => setLead((prev) => ({ ...prev, currency: c.value, amount: '' }))}
                          className={`min-h-[52px] rounded-md border text-base font-semibold ${
                            lead.currency === c.value ? 'border-[#1767E8] bg-[#EAF1FF] text-[#1767E8]' : 'border-[#D5DBE5] bg-white text-[#0A1633]'
                          }`}
                        >
                          {c.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <label className={LABEL}>{service.amountLabel}
                    <select className={INPUT} required value={lead.amount} onChange={(e) => setL('amount', e.target.value)}>
                      <option value="">Select…</option>
                      {amountOptions.map((o) => <option key={o}>{o}</option>)}
                    </select>
                  </label>
                  <label className={LABEL}>{service.timelineLabel}
                    <select className={INPUT} required value={lead.timeline} onChange={(e) => setL('timeline', e.target.value)}>
                      <option value="">Select…</option>
                      {service.timelineOptions.map((o) => <option key={o}>{o}</option>)}
                    </select>
                  </label>
                  {service.extra && (
                    <label className={LABEL}>{service.extra.label}
                      <FieldInput field={service.extra} value={lead.extra} onChange={(v) => setL('extra', v)} />
                    </label>
                  )}
                </div>
                <label className="flex gap-3 items-start text-sm leading-normal text-[#2B3445] cursor-pointer">
                  <input type="checkbox" required className="w-5 h-5 mt-px flex-none accent-[#1767E8]" checked={lead.consent} onChange={(e) => setL('consent', e.target.checked)} />
                  <span>I agree to Envoi & Co contacting me about my enquiry. See our <Link href="/privacy" className="text-[#1767E8] underline">privacy policy</Link>.</span>
                </label>
                {error && <p role="alert" className="m-0 text-sm text-[#B42318]">{error}</p>}
                <button type="submit" disabled={start.isPending} className="inline-flex items-center justify-center gap-2.5 min-h-[56px] px-8 rounded bg-black text-white font-semibold text-[17px] disabled:opacity-60">
                  {start.isPending ? 'Saving…' : <>Continue<Arrow /></>}
                </button>
                <p className="m-0 text-center text-[13px] text-[#5A6478]">Your details are confidential and never shared without your consent.</p>
              </form>
            </>
          )}

          {stage === 'situation' && (
            <form
              className="flex flex-col gap-6"
              onSubmit={(e) => { e.preventDefault(); finish('apply', e.currentTarget); }}
            >
              <div className={`${CARD} px-6 py-8 sm:px-9 flex flex-col gap-5`}>
                <Progress step={2} />
                <div className="flex gap-3.5 items-start px-4 py-4 rounded-[10px] bg-[#EAF1FF]">
                  <Check className="flex-none mt-0.5" />
                  <p className="m-0 text-[15px] leading-normal">
                    <strong>Thanks, we have your details.</strong> A few more answers let us prepare properly, so your first call is about solutions, not paperwork.
                  </p>
                </div>
                <h1 className="m-0 text-[30px] sm:text-[36px] leading-[1.05] font-bold tracking-[-1.2px]" style={HEADING}>Tell us about your situation</h1>
              </div>

              {service.sections.map((section, i) => (
                <fieldset key={section.title} className={`${CARD} m-0 p-6 sm:p-8 grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-5`}>
                  <legend className="float-left w-full col-span-full p-0 mb-1 flex items-center gap-3 text-[22px] font-bold tracking-[-0.6px]" style={HEADING}>
                    <span className="inline-flex w-8 h-8 rounded-lg bg-[#EAF1FF] text-[#1767E8] items-center justify-center text-sm">{i + 1}</span>
                    {section.title}
                  </legend>
                  {section.fields.map((field) => (
                    <label key={field.key} className={`${LABEL} ${field.kind === 'textarea' || field.full ? 'col-span-full' : ''}`}>
                      {field.label}
                      {field.hint && <span className="text-[13px] font-normal text-[#5A6478] leading-snug">{field.hint}</span>}
                      <FieldInput field={field} value={answers[field.key] ?? ''} onChange={(v) => setAnswers((prev) => ({ ...prev, [field.key]: v }))} />
                    </label>
                  ))}
                </fieldset>
              ))}

              <div className={`${CARD} p-6 sm:p-8 flex flex-col gap-5`}>
                <label className="flex gap-3 items-start text-sm leading-normal text-[#2B3445] cursor-pointer">
                  <input type="checkbox" required className="w-5 h-5 mt-px flex-none accent-[#1767E8]" checked={confirms.accuracy} onChange={(e) => setConfirms((p) => ({ ...p, accuracy: e.target.checked }))} />
                  <span>I confirm the information above is accurate, and agree that my details may be shared with partner institutions only with my consent.</span>
                </label>
                <label className="flex gap-3 items-start text-sm leading-normal text-[#2B3445] cursor-pointer">
                  <input type="checkbox" required className="w-5 h-5 mt-px flex-none accent-[#1767E8]" checked={confirms.fee} onChange={(e) => setConfirms((p) => ({ ...p, fee: e.target.checked }))} />
                  <span>I understand Envoi & Co charges an advisory fee, which is confirmed with me before any work begins.</span>
                </label>
                {error && <p role="alert" className="m-0 text-sm text-[#B42318]">{error}</p>}
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <button type="button" disabled={complete.isPending} onClick={() => finish('call')} className="min-h-[44px] bg-transparent border-0 p-0 text-[15px] text-[#0A1633] underline cursor-pointer">
                    I'd rather explain on a call
                  </button>
                  <button type="submit" disabled={complete.isPending} className="min-h-[56px] px-10 rounded bg-black text-white font-semibold text-[17px] disabled:opacity-60">
                    {complete.isPending ? 'Sending…' : 'Apply'}
                  </button>
                </div>
              </div>
            </form>
          )}

          {stage === 'done' && (
            <div className={`${CARD} p-8 sm:p-10 flex flex-col gap-4 items-start`}>
              <span className="inline-flex w-14 h-14 rounded-full bg-[#EAF1FF] items-center justify-center">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1767E8" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12l4 4 10-10" /></svg>
              </span>
              <h2 className="m-0 text-[30px] leading-tight font-bold tracking-[-1px]" style={HEADING}>
                {skipped ? "No problem. We'll call you." : 'Thank you. Your application is in.'}
              </h2>
              <p className="m-0 text-base leading-relaxed text-[#4A5468] max-w-[560px]">
                {skipped
                  ? 'A member of our desk will contact you within 24 hours to talk it through. Have your ID and details of where the funds came from to hand.'
                  : 'A member of our desk will review your answers and contact you within 24 hours to arrange a private consultation.'}
              </p>
              {session && <p className="m-0 text-sm text-[#4A5468]">Your reference: <strong className="text-[#0A1633]">{session.reference}</strong></p>}
              <Link href="/" className="mt-2 inline-flex items-center gap-2 text-[15px] font-semibold text-[#1767E8]">Back to home</Link>
            </div>
          )}

          {stage === 'below-minimum' && (
            <div className={`${CARD} p-8 sm:p-10 flex flex-col gap-4 items-start`}>
              <h2 className="m-0 text-[30px] leading-tight font-bold tracking-[-1px]" style={HEADING}>Thank You for Your Interest</h2>
              <div className="flex flex-col gap-3 text-base leading-relaxed text-[#4A5468] max-w-[600px]">
                <p className="m-0">Our service is designed for individuals and businesses looking to move significant amounts of capital. Unfortunately, the amount you've selected falls below our current minimum threshold.</p>
                <p className="m-0">If you need to move larger funds in the future, we'd be delighted to assist you.</p>
                <p className="m-0">You can also recommend our service to friends, family or business associates who may benefit from our expertise.</p>
                <p className="m-0">We look forward to assisting you in the future.</p>
              </div>
              <Link href="/" className="mt-2 inline-flex items-center gap-2 text-[15px] font-semibold text-[#1767E8]">Back to home</Link>
            </div>
          )}
        </main>
        <Aside />
      </div>
    </div>
  );
}

export default function ServiceApplication({ slug }: { slug: string }) {
  const service = serviceBySlug(slug);
  return service ? <ServiceForm key={service.slug} service={service} /> : <NotFound />;
}
