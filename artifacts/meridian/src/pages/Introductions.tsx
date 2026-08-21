import { useState } from 'react';
import { Link } from 'wouter';
import { Logo } from '@/components/ui/Logo';
import { Footer } from '@/components/layout/Footer';

const INSTRUMENT_SANS = { fontFamily: "'Instrument Sans', sans-serif" };
const REGISTER_URL = '/aldric-dashboard/register-capability';

/* ─────────────────────────────────────────────────────────
   NAVBAR
───────────────────────────────────────────────────────── */
const NAV_LINKS = ['Moving Capital', 'Global Network', 'Contact'];

function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <div className="sticky top-0 z-30">
      <header className="bg-white border-b border-gray-100 px-6 lg:px-[150px] h-[60px] flex items-center justify-between">
        <Logo theme="light" />

        {/* Desktop nav links */}
        <nav className="hidden md:flex items-center gap-8 text-[13.5px] text-[#1a1a2e] font-normal">
          {NAV_LINKS.map(l => (
            <a key={l} href="#" className="hover:text-[#0E61E8] transition-colors">{l}</a>
          ))}
        </nav>

        {/* Desktop CTA */}
        <a
          href={REGISTER_URL}
          className="hidden md:block bg-[#111827] text-white text-[13px] font-medium px-5 py-2.5 rounded-lg hover:bg-[#1f2937] transition-colors whitespace-nowrap"
        >
          Request an Introduction
        </a>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(o => !o)}
          className="md:hidden p-2 text-[#0b1733] rounded-md hover:bg-gray-100 transition-colors"
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? (
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2}>
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2}>
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          )}
        </button>
      </header>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden bg-white border-b border-gray-100 px-6 py-4 flex flex-col gap-4">
          {NAV_LINKS.map(l => (
            <a
              key={l}
              href="#"
              onClick={() => setOpen(false)}
              className="text-[14px] text-[#1a1a2e] font-medium hover:text-[#0E61E8] transition-colors"
            >
              {l}
            </a>
          ))}
          <a
            href={REGISTER_URL}
            onClick={() => setOpen(false)}
            className="mt-1 w-full text-center bg-[#111827] text-white text-[13px] font-medium px-5 py-2.5 rounded-lg hover:bg-[#1f2937] transition-colors"
          >
            Request an Introduction
          </a>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   HERO
───────────────────────────────────────────────────────── */
function Hero() {
  return (
    <section className="bg-white px-6 lg:px-[150px] pt-14 md:pt-20 pb-10 md:pb-14">
      <div className="max-w-3xl mx-auto flex flex-col items-center text-center">
        <h1
          className="text-[32px] md:text-[46px] lg:text-[56px] font-semibold text-[#000B2D] leading-[1.15] tracking-[-0.04em] mb-5"
          style={INSTRUMENT_SANS}
        >
          The Right Deals<br />Don't Just Happen.
        </h1>
        <p className="text-[#272626] text-[18px] md:text-[20px] leading-[1.4] mb-6" style={INSTRUMENT_SANS}>
          The right people don't search.<br />
          <span className="font-bold">They're introduced</span>
        </p>
        <p className="text-[#272626] text-[14px] md:text-[15px] leading-relaxed max-w-lg">
          Aldric Private is where consequential capital and consequential contacts move —
          privately, verified, and never listed for anyone to browse. Two services. Choose
          the one you need.
        </p>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────
   SERVICES
───────────────────────────────────────────────────────── */
function CheckItem({ text }: { text: string }) {
  return (
    <li className="flex gap-3 items-start">
      <svg className="flex-shrink-0 mt-[3px]" width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M3 8.5L6.5 12L13 5" stroke="#FFB300" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="text-[13px] text-[#ABADB0] leading-relaxed">{text}</span>
    </li>
  );
}

interface ServiceCardData {
  label: string;
  title: string;
  description: string;
  points: string[];
  buttonText: string;
}

const DEAL_FACILITATION: ServiceCardData = {
  label: 'Deal Facilitation',
  title: 'Private Introductions',
  description:
    "Some contacts were never going to be published anywhere. If you hold access worth bringing to the right deal — or you need someone who does - it's matched privately, one verified party to another, and never listed.",
  points: [
    'Both sides identity-verified before any introduction',
    'Fixed £5,000 sourcing deposit, variable facilitation fee',
    'All deals considered are subject to legality checks',
  ],
  buttonText: 'Register a capability or submit a requirement',
};

const FINANCIAL_INTRODUCTION: ServiceCardData = {
  label: 'Financial Introduction',
  title: 'Private Banking & Capital Movement',
  description:
    'For sums that were never going to move through the usual channels. Large-volume foreign exchange and private banking introductions for individuals and businesses who expect discretion to be the default, not a request.',
  points: [
    'Large-volume FX and private banking introductions',
    'Associate, Signature, and Sovereign membership tiers',
    'For financial deals only - separate from Private Introductions',
  ],
  buttonText: 'Move large capital',
};

function ServiceCard({ data, button }: { data: ServiceCardData; button: React.ReactNode }) {
  return (
    <div className="p-8 md:p-10">
      <p className="text-[12px] font-bold text-[#90B7F6] tracking-[0.05em] uppercase mb-5">
        {data.label}
      </p>
      <h3 className="text-[24px] md:text-[26px] font-extrabold text-white tracking-tight leading-tight mb-4">
        {data.title}
      </h3>
      <p className="text-[#ABADB0] text-[13px] leading-relaxed mb-6">
        {data.description}
      </p>
      <div className="border-t border-white/10 mb-6" />
      <ul className="space-y-4 mb-8">
        {data.points.map(p => <CheckItem key={p} text={p} />)}
      </ul>
      {button}
    </div>
  );
}

function Services() {
  return (
    <section className="bg-white px-6 lg:px-[150px] pb-16 md:pb-24">
      <div className="bg-[#010A2D] rounded-3xl overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="border-b md:border-b-0 md:border-r border-white/10">
            <ServiceCard
              data={DEAL_FACILITATION}
              button={
                <a href={REGISTER_URL}>
                  <button className="w-full md:w-auto bg-[#0F61E9] text-white text-[13.5px] font-semibold px-6 py-3 rounded-lg hover:bg-[#0d52c9] transition-colors md:whitespace-nowrap">
                    {DEAL_FACILITATION.buttonText} →
                  </button>
                </a>
              }
            />
          </div>
          <div>
            <ServiceCard
              data={FINANCIAL_INTRODUCTION}
              button={
                <Link href="/move-money-abroad">
                  <button className="w-full md:w-auto bg-[#0F61E9] text-white text-[13.5px] font-semibold px-6 py-3 rounded-lg hover:bg-[#0d52c9] transition-colors md:whitespace-nowrap">
                    {FINANCIAL_INTRODUCTION.buttonText} →
                  </button>
                </Link>
              }
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────
   PAGE
───────────────────────────────────────────────────────── */
export default function Introductions() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Services />
      </main>
      <Footer />
    </div>
  );
}
