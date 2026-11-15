import { useEffect, type ReactNode } from 'react';
import { Link } from 'wouter';
import globe from '@/assets/landing-globe.png';
import { DESK_WHATSAPP_LINK, DESK_WHATSAPP_NUMBER } from '@/lib/contact';
import { SERVICES } from '@/lib/services';

// Landing page. Doubles as the ads landing page: every section leads to the
// service picker (#choose), and each service opens its two-step application.

const HEADING = { fontFamily: "'Inter Tight', Inter, sans-serif" };
const WRAP = 'max-w-[1300px] mx-auto px-5 sm:px-8';

const ICONS: Record<string, ReactNode> = {
  'large-capital-movement': <path d="M4 8h13l-3-3M20 16H7l3 3" />,
  'private-banking-introduction': <path d="M3 10l9-6 9 6M5 10v8M9 10v8M15 10v8M19 10v8M3 20h18" />,
  'high-value-real-estate': <path d="M4 11l8-7 8 7v9H4zM10 20v-5h4v5" />,
  'trust-offshore-company': <path d="M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h6" />,
  'bespoke-services': <path d="M12 3l2.7 5.5 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.8 1-6.1-4.4-4.3 6.1-.9z" />,
};

const STATS = [
  ['190+', 'Countries reached'],
  ['50+', 'Settlement currencies'],
  ['$50M+', 'Single-transfer capacity'],
  ['Tier-1', 'Custody, London & NY'],
] as const;

const TESTIMONIALS = [
  ['When our transaction became too complex for a retail service, Envoi & Co helped us understand the institutional route.', 'Private Client'],
  ['Envoi & Co provided a highly professional and discreet approach to navigating an international financial requirement. Their ability to understand our objectives and coordinate the right banking relationships made the process seamless.', 'Private Client, United Kingdom'],
  ['The level of attention, confidentiality, and professionalism demonstrated by Envoi & Co was exceptional. They understood that every financial situation is unique and provided a structured approach tailored to our circumstances.', 'International Client'],
] as const;

const STEPS = [
  ['01', 'Choose a service and apply', 'Tell us about your situation in your own words. About 5 minutes.'],
  ['02', 'Private consultation', 'Your dedicated contact calls you to agree the route, costs and documents.'],
  ['03', 'We handle it end to end', 'Funds move, accounts open, structures are set up. We stay with you to the end.'],
] as const;

const FIT = [
  'Have $100,000 or more to move, hold or invest',
  'Can show where your money came from',
  'Have been slowed down, capped or refused by your bank',
  'Want expert, paid support to get it done properly',
];

const FAQS = [
  ['What is the minimum amount?', 'We work with amounts from $100,000 up to $1 billion. Below that, we can point you to a suitable provider.'],
  ['Are you a bank? Who holds my money?', 'No, Envoi & Co is a private client desk. Your money is held and moved by regulated banks and licensed partners. We coordinate the process and stay with you throughout.'],
  ['Do you charge a fee?', 'Yes. We charge an advisory fee, based on the size and complexity of your transaction. You get a clear quote on your consultation call, before any work begins.'],
  ['What documents will I need?', 'Usually ID, proof of address and evidence of where the funds came from. We tell you exactly what is needed and help you prepare it.'],
  ['How quickly will you contact me?', 'A member of the desk reviews every application and contacts you within 24 hours.'],
] as const;

function Tick({ stroke = '#1767E8' }: { stroke?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="flex-none">
      <path d="M5 12l4 4 10-10" />
    </svg>
  );
}

function ServiceCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-left">
      {SERVICES.map((s, i) => {
        const featured = i === 0;
        return (
          <Link
            key={s.slug}
            href={`/${s.slug}`}
            className={`group flex flex-col gap-2.5 rounded-2xl p-5 no-underline border transition-shadow hover:shadow-[0_8px_24px_rgba(10,22,51,0.08)] ${
              featured ? 'bg-[#1767E8] border-[#1767E8] text-white' : 'bg-white border-[#DCE3EE] text-[#0A1633]'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={featured ? '#FFFFFF' : '#1767E8'} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                {ICONS[s.slug]}
              </svg>
              {featured && (
                <span className="rounded-full bg-white px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-[0.06em] text-[#1767E8]">Most requested</span>
              )}
            </div>
            <h3 className="m-0 text-[19px] leading-tight font-bold tracking-[-0.4px]" style={HEADING}>{s.name}</h3>
            <p className={`m-0 text-[13.5px] leading-snug ${featured ? 'text-white/90' : 'text-[#4A5468]'}`}>{s.cardText}</p>
            <span className={`mt-auto pt-2 inline-flex items-center gap-1.5 text-sm font-semibold ${featured ? 'text-white' : 'text-[#1767E8]'}`}>
              Apply
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </span>
          </Link>
        );
      })}
    </div>
  );
}

export function LandingFooter() {
  return (
    <footer className="border-t border-[#ECEFF4] bg-white">
      <div className={`${WRAP} py-8 flex flex-col gap-4 text-[12.5px] text-[#4A5468]`}>
        <p className="m-0 leading-relaxed">
          Envoi & Co acts as an introducer. We are not a bank and do not hold client funds or give regulated financial, tax or legal advice. Accounts, transfers and structures are provided by independent regulated institutions.
        </p>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span>© 2026 Envoi & Co. All rights reserved.</span>
          <nav className="flex flex-wrap gap-x-5 gap-y-2">
            <Link href="/about" className="underline text-[#4A5468]">About us</Link>
            <Link href="/contact" className="underline text-[#4A5468]">Contact us</Link>
            <Link href="/aml-policy" className="underline text-[#4A5468]">Regulatory information</Link>
            <Link href="/privacy" className="underline text-[#4A5468]">Privacy policy</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  // Arriving from another page via "Apply now" (/#choose): scroll once the picker exists.
  useEffect(() => {
    if (window.location.hash !== '#choose') return;
    const id = window.setTimeout(() => document.getElementById('choose')?.scrollIntoView(), 50);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <div className="bg-white text-[#0A1633]" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Hero + service picker */}
      <section className={`${WRAP} pt-10 sm:pt-14 text-center`}>
        <p className="inline-block m-0 rounded-full bg-[#EAF1FF] px-3.5 py-1.5 text-[13px] font-semibold text-[#1767E8]">For amounts from $100,000 to $1 billion</p>
        <h1 className="mx-auto mt-5 mb-0 max-w-[760px] text-[38px] sm:text-[56px] leading-[1.04] font-bold tracking-[-2px]" style={HEADING}>
          Move Significant Capital Across Borders, On Your Terms.
        </h1>
        <p className="mx-auto mt-5 mb-0 max-w-[620px] text-[17px] sm:text-lg leading-normal text-[#2B3445]">
          One private desk for large transfers, offshore banking, property purchases and wealth structures. Priced and handled like an institutional treasury, not a retail wire.
        </p>
        <h2 id="choose" className="mt-9 mb-4 scroll-mt-24 text-[15px] font-normal text-[#2B3445]">
          <strong className="font-semibold text-[#0A1633]">What do you need help with?</strong> Choose one to apply. It takes about 5 minutes.
        </h2>
        <ServiceCards />
        <div className="mt-5 flex flex-wrap justify-center gap-x-7 gap-y-2 text-[13px] text-[#2B3445]">
          <span className="inline-flex items-center gap-2"><Tick />Regulated banks and partners only</span>
          <span className="inline-flex items-center gap-2"><Tick />Your details stay confidential</span>
          <span className="inline-flex items-center gap-2"><Tick />A dedicated contact replies within 24 hours</span>
        </div>
        <img src={globe} alt="Globe with financial city skylines connected by transfer routes" className="mt-4 w-full h-auto block" />
      </section>

      {/* Stats */}
      <section className="bg-[#1767E8] text-white">
        <div className={`${WRAP} py-10 sm:py-12 grid grid-cols-2 lg:grid-cols-4 gap-8`}>
          {STATS.map(([value, label]) => (
            <div key={label}>
              <div className="text-[40px] sm:text-[56px] leading-none font-bold tracking-[-2px]" style={HEADING}>{value}</div>
              <div className="mt-2 text-[15px] text-white/90">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className={`${WRAP} py-16 sm:py-20`}>
        <h2 className="m-0 text-[30px] sm:text-[40px] font-bold tracking-[-1.2px]" style={HEADING}>Client Experiences</h2>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          {TESTIMONIALS.map(([quote, who]) => (
            <figure key={who} className="m-0 rounded-2xl bg-[#F3F5F9] p-7 flex flex-col gap-5">
              <span aria-hidden="true" className="text-[28px] leading-none font-bold text-[#1767E8]">“</span>
              <blockquote className="m-0 text-[15px] leading-relaxed">"{quote}"</blockquote>
              <figcaption className="mt-auto text-[13.5px] font-semibold">- {who}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-[#F7F9FC] border-y border-[#ECEFF4]">
        <div className={`${WRAP} py-16 sm:py-20`}>
          <div className="flex flex-wrap items-end justify-between gap-5">
            <h2 className="m-0 max-w-[620px] text-[30px] sm:text-[44px] leading-[1.05] font-bold tracking-[-1.6px]" style={HEADING}>From application to completion in three steps</h2>
            <a href="#choose" className="inline-flex items-center min-h-[48px] px-6 rounded bg-black text-white text-[15px] font-semibold no-underline">Choose your service</a>
          </div>
          <ol className="mt-8 p-0 list-none grid grid-cols-1 md:grid-cols-3 gap-4">
            {STEPS.map(([num, title, text]) => (
              <li key={num} className="rounded-2xl bg-white p-7">
                <div className="text-[36px] leading-none font-bold text-[#1767E8]" style={HEADING}>{num}</div>
                <h3 className="mt-4 mb-2 text-[18px] font-bold">{title}</h3>
                <p className="m-0 text-[14.5px] leading-normal text-[#4A5468]">{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Fit check */}
      <section className={`${WRAP} py-16 sm:py-20 grid grid-cols-1 md:grid-cols-[1fr_1.4fr] gap-8 items-start`}>
        <div>
          <h2 className="m-0 text-[30px] sm:text-[44px] leading-[1.05] font-bold tracking-[-1.6px]" style={HEADING}>Is Envoi & Co right for you?</h2>
          <p className="mt-4 mb-0 text-[16px] leading-normal text-[#4A5468]">We work with a small number of clients at a time, so we can give each one proper attention.</p>
        </div>
        <div className="rounded-2xl bg-[#F3F5F9] p-7">
          <h3 className="m-0 text-[17px] font-bold text-[#1767E8]">A good fit if you…</h3>
          <ul className="mt-4 mb-0 p-0 list-none flex flex-col gap-3 text-[15px]">
            {FIT.map((item) => <li key={item} className="flex items-start gap-2.5"><span className="mt-0.5"><Tick /></span>{item}</li>)}
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-[#F7F9FC] border-y border-[#ECEFF4]">
        <div className="max-w-[820px] mx-auto px-5 sm:px-8 py-16 sm:py-20">
          <h2 className="m-0 text-center text-[30px] sm:text-[40px] font-bold tracking-[-1.4px]" style={HEADING}>Before you apply</h2>
          <div className="mt-8 border-t border-[#DCE3EE]">
            {FAQS.map(([q, a], i) => (
              <details key={q} open={i === 0} className="group border-b border-[#DCE3EE] py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[16px] font-semibold [&::-webkit-details-marker]:hidden">
                  {q}
                  <span aria-hidden="true" className="text-xl font-normal text-[#1767E8] group-open:hidden">+</span>
                  <span aria-hidden="true" className="hidden text-xl font-normal text-[#1767E8] group-open:inline">–</span>
                </summary>
                <p className="mt-3 mb-0 max-w-[680px] text-[15px] leading-relaxed text-[#4A5468]">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="bg-[#0A1633] text-white">
        <div className={`${WRAP} py-16 sm:py-20 text-center`}>
          <h2 className="mx-auto m-0 max-w-[720px] text-[30px] sm:text-[44px] leading-[1.05] font-bold tracking-[-1.6px]" style={HEADING}>
            Have a large transaction coming up? Apply before it moves.
          </h2>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {SERVICES.map((s, i) => (
              <Link
                key={s.slug}
                href={`/${s.slug}`}
                className={`inline-flex items-center min-h-[46px] px-5 rounded text-[14.5px] font-semibold no-underline ${
                  i === 0 ? 'bg-[#1767E8] text-white' : 'bg-white text-[#0A1633]'
                }`}
              >
                {s.shortName}
              </Link>
            ))}
          </div>
          <p className="mt-6 mb-0 text-[14px] text-white/85">
            Prefer to talk first? WhatsApp the desk on{' '}
            <a href={DESK_WHATSAPP_LINK} target="_blank" rel="noreferrer" className="font-semibold text-white underline">{DESK_WHATSAPP_NUMBER}</a>
          </p>
        </div>
      </section>
    </div>
  );
}
