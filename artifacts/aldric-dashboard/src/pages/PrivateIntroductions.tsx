import { Link } from 'wouter';
import { AldricLogo } from '@/components/AldricLogo';
import { AuthModal } from '@/components/AuthModal';
import { useAuth } from '@/lib/auth-context';

/* ─────────────────────────────────────────────────────────
   NAVBAR
───────────────────────────────────────────────────────── */
function Navbar() {
  const { openModal } = useAuth();
  return (
    <header className="bg-white border-b border-gray-100 px-6 md:px-10 h-[60px] flex items-center justify-between sticky top-0 z-30">
      <AldricLogo />
      <nav className="hidden md:flex items-center gap-8 text-[13.5px] text-[#1a1a2e] font-normal">
        {['Moving Capital', 'Global Network', 'Contact'].map(l => (
          <a key={l} href="#" className="hover:text-[#0E61E8] transition-colors">{l}</a>
        ))}
      </nav>
      <button
        onClick={() => openModal('register')}
        className="bg-[#111827] text-white text-[13px] font-medium px-5 py-2.5 rounded-lg hover:bg-[#1f2937] transition-colors whitespace-nowrap"
      >
        Request an Introduction
      </button>
    </header>
  );
}

/* ─────────────────────────────────────────────────────────
   HERO
───────────────────────────────────────────────────────── */
function Hero() {
  return (
    <section className="bg-white px-6 md:px-12 lg:px-20 pt-14 pb-16">
      <div className="max-w-3xl mx-auto flex flex-col items-center text-center">

        {/* Heading */}
        <h1 className="text-[38px] md:text-[50px] lg:text-[56px] font-extrabold text-[#0b1733] leading-[1.08] tracking-[-0.03em] mb-5">
          Access, Plotted<br />And Matched Privately.
        </h1>

        {/* Subtext */}
        <p className="text-[#6b7a99] text-[15px] leading-relaxed mb-8 max-w-[520px]">
          Aldric Private holds a private record of who can facilitate what, and who needs it.
          When a requirement matches a capability already on file, we make the introduction
          ourselves — quietly, and only once both sides are verified.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-16">
          <Link href="/register-capability">
            <button className="bg-[#111827] text-white text-[13px] font-semibold px-6 py-2.5 rounded-lg hover:bg-[#1f2937] transition-colors whitespace-nowrap">
              Register a Capability
            </button>
          </Link>
          <Link href="/submit-requirement">
            <button className="text-[#0b1733] text-[13px] font-semibold px-2 py-2.5 hover:text-[#1a56db] transition-colors whitespace-nowrap">
              Submit a Requirement
            </button>
          </Link>
        </div>

        {/* Diagram */}
        <div className="w-full max-w-2xl flex items-start justify-center gap-0">

          {/* Capability */}
          <DiagramCard
            imgSrc="/aldric-dashboard/assets/hero-capability.svg"
            label="Capability"
            sub="On file, Private"
            align="left"
          />

          {/* Arrow left → centre */}
          <div className="flex items-center justify-center flex-shrink-0 mt-[90px]">
            <CurvedArrow />
          </div>

          {/* Centre: ALDRIC */}
          <DiagramCard
            imgSrc="/aldric-dashboard/assets/hero-aldric-center.svg"
            label={null}
            sub="Verifies and Connects"
            align="center"
            isCenter
          />

          {/* Arrow centre → right */}
          <div className="flex items-center justify-center flex-shrink-0 mt-[90px]">
            <CurvedArrow />
          </div>

          {/* Requirement */}
          <DiagramCard
            imgSrc="/aldric-dashboard/assets/hero-requirement.svg"
            label="Requirement"
            sub="submitted, confidential"
            align="right"
          />

        </div>
      </div>
    </section>
  );
}

function DiagramCard({
  imgSrc,
  label,
  sub,
  align,
  isCenter = false,
}: {
  imgSrc: string;
  label: string | null;
  sub: string;
  align: 'left' | 'center' | 'right';
  isCenter?: boolean;
}) {
  const textAlign = align === 'left' ? 'text-left' : align === 'right' ? 'text-right' : 'text-center';
  return (
    <div className={`flex flex-col ${align === 'center' ? 'items-center' : align === 'left' ? 'items-start' : 'items-end'} gap-3 flex-1`}>
      {/* Illustration */}
      <div className="w-[140px] md:w-[160px] aspect-[200/270]">
        <img src={imgSrc} alt={label ?? 'ALDRIC Private'} className="w-full h-full object-contain" />
      </div>
      {/* Label */}
      <div className={`${textAlign}`}>
        {isCenter ? (
          <p className="text-[14px] font-extrabold text-[#0b1733]">
            <span className="text-[#1a56db] font-black">ALDRIC</span>
            <span className="text-[11px] font-semibold text-[#6b7a99] ml-1">Private</span>
          </p>
        ) : (
          <p className="text-[15px] font-bold text-[#0b1733]">{label}</p>
        )}
        <p className="text-[12px] text-[#9baac0] mt-0.5">{sub}</p>
      </div>
    </div>
  );
}

function CurvedArrow() {
  return (
    <svg width="72" height="50" viewBox="0 0 72 50" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M4 38 C 18 38, 24 12, 36 12 C 48 12, 54 38, 68 38"
        stroke="#c7d2e0"
        strokeWidth="1.5"
        strokeDasharray="5 4"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M62 34 L68 38 L62 42"
        stroke="#c7d2e0"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────
   STATS
───────────────────────────────────────────────────────── */
function Stats() {
  return (
    <section className="bg-white px-6 md:px-12 lg:px-20 pb-14">
      <div className="max-w-3xl mx-auto">
        <div className="bg-[#1a56db] rounded-2xl px-8 md:px-14 py-10 grid grid-cols-2 divide-x divide-white/20">
          <div className="pr-8 md:pr-14">
            <p className="text-[42px] md:text-5xl font-black text-white tracking-tight leading-none">[N]+</p>
            <p className="text-white/70 text-sm mt-2.5 leading-snug">Introductions facilitated to date</p>
          </div>
          <div className="pl-8 md:pl-14">
            <p className="text-[42px] md:text-5xl font-black text-white tracking-tight leading-none">100%</p>
            <p className="text-white/70 text-sm mt-2.5 leading-snug">Parties identity-verified before introduction</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────
   THE MODEL
───────────────────────────────────────────────────────── */
const CAPABILITY_POINTS = [
  'No cost to register — there is nothing to pay to be on the record',
  'Nothing about you is shared, published, or searchable by anyone outside Aldric Private',
  "You're only ever approached for a genuine, reviewed match to your stated capability",
  'You decide, deal by deal, whether you want to proceed once we reach out',
  "The requirement's identity and details are verified before you're ever introduced",
];

const REQUIREMENT_POINTS = [
  'A private search against contacts that were never publicly listed anywhere',
  'Both sides identity-verified before any names are exchanged',
  'A clearly stated facilitation fee, payable only once a real introduction is made',
  'No obligation to proceed with the facilitator beyond the introduction itself',
];

function CheckItem({ text }: { text: string }) {
  return (
    <li className="flex gap-3 items-start">
      <svg className="flex-shrink-0 mt-[3px]" width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M3 8.5L6.5 12L13 5" stroke="#C9A84C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="text-[13px] text-[#8fa3c0] leading-relaxed">{text}</span>
    </li>
  );
}

function TheModel() {
  return (
    <section className="bg-[#000B2D] py-16 md:py-20 px-6 md:px-12 lg:px-20">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <p className="text-[11px] font-bold text-white tracking-[0.18em] uppercase mb-4">The Model</p>
        <h2 className="text-[28px] md:text-[38px] lg:text-[42px] font-extrabold text-white tracking-tight leading-[1.05] mb-4">
          Not A Marketplace. A Private Ledger.
        </h2>
        <p className="text-[#6b7a99] text-[14px] leading-relaxed mb-12 max-w-2xl">
          Nothing is listed publicly, and nothing is browsable. Capabilities and requirements sit privately in
          the same system, and Aldric Private is the only party that ever sees both sides at once.
        </p>

        {/* Two-column cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 border border-white/10 rounded-xl overflow-hidden">

          {/* Left card */}
          <div className="border-b md:border-b-0 md:border-r border-white/10 p-8 md:p-10">
            <p className="text-[10px] font-bold text-[#3b82f6] tracking-[0.18em] uppercase mb-6">
              If You Can Facilitate
            </p>
            <h3 className="text-[22px] md:text-[26px] font-extrabold text-white tracking-tight leading-tight mb-4">
              Register The Capability
            </h3>
            <p className="text-[#6b7a99] text-[13px] leading-relaxed mb-8">
              If you have a genuine contact, access, or arrangement you can bring to the right deal,
              tell us in confidence — the type of introduction, the sector, and the scale you operate at.
              Our team reviews it before it's added to the record. It stays there privately until a
              matching requirement comes in; you're never contacted with anything else, and nothing is
              shared about you until we've confirmed a real match and verified both sides.
            </p>
            <ul className="space-y-4">
              {CAPABILITY_POINTS.map(p => <CheckItem key={p} text={p} />)}
            </ul>
          </div>

          {/* Right card */}
          <div className="p-8 md:p-10">
            <p className="text-[10px] font-bold text-[#3b82f6] tracking-[0.18em] uppercase mb-6">
              If You Need An Introduction
            </p>
            <h3 className="text-[22px] md:text-[26px] font-extrabold text-white tracking-tight leading-tight mb-4">
              Submit The Requirement
            </h3>
            <p className="text-[#6b7a99] text-[13px] leading-relaxed mb-8">
              If you need help getting a deal done and think the right contact exists somewhere, describe
              what you're trying to achieve and the size of it. We search the existing record privately
              for a facilitator who's already told us they can support exactly this kind of deal. Your
              requirement is never published, listed, or shared beyond that private search — only a
              facilitator we've identified as a genuine, verified match ever sees it, and only once
              you've both cleared verification.
            </p>
            <ul className="space-y-4">
              {REQUIREMENT_POINTS.map(p => <CheckItem key={p} text={p} />)}
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────
   PROCESS
───────────────────────────────────────────────────────── */
const STEPS = [
  {
    title: 'Requirement received',
    body: 'A requirement is submitted with the deal type, scale, and what\'s needed from the other side.',
  },
  {
    title: 'Private search',
    body: 'Aldric Private searches the existing record of registered capabilities for a genuine match — not a keyword match, a judged one.',
  },
  {
    title: 'Identity verification',
    body: "Both parties are verified before either name is shared with the other — and a registered capability is checked well beyond identity before it's ever matched. Neither side sees the other's details until this is complete.",
  },
  {
    title: 'Introduction',
    body: 'Once verified, Aldric Private makes the introduction directly. What happens between the two parties afterward is between them.',
  },
];

function Process() {
  return (
    <section className="bg-white py-16 md:py-20 px-6 md:px-12 lg:px-20">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <p className="text-[11px] font-bold text-[#3b82f6] tracking-[0.18em] uppercase mb-4">Process</p>
        <h2 className="text-[28px] md:text-[36px] font-extrabold text-[#0b1733] tracking-tight leading-[1.05] mb-10">
          How An Introduction Is Made
        </h2>

        {/* Steps */}
        <div className="border-t border-[#e8ecf2]">
          {STEPS.map((step, i) => (
            <div key={i} className="flex items-start gap-8 md:gap-14 py-10 border-b border-[#e8ecf2]">
              {/* Step number */}
              <span className="flex-shrink-0 text-[32px] md:text-[38px] font-black text-[#d0d7e3] leading-none tracking-tight w-12 text-right">
                {String(i + 1).padStart(2, '0')}
              </span>
              {/* Content */}
              <div className="flex-1 pt-1">
                <h3 className="text-[15px] font-bold text-[#0b1733] mb-2">{step.title}</h3>
                <p className="text-[#6b7a99] text-[13px] leading-relaxed max-w-2xl">{step.body}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────
   PRICING
───────────────────────────────────────────────────────── */
const FEE_NOTES = [
  'The £5,000 deposit is non-refundable once sourcing begins, whether or not a match is found.',
  'If no match is sourced, you are not charged the deposit again on a future request — it\'s only payable once more once a contact is successfully sourced.',
  'The facilitation fee itself is only payable once a verified introduction has actually been made.',
  'The facilitator you\'re introduced to may set their own separate fee for the work of making the deal happen — this is agreed directly between you and them, and is not set, capped, or collected by Aldric Private.',
  'Exact terms are set out in the engagement agreement provided before any payment is taken.',
];

function Pricing() {
  return (
    <section className="bg-white py-16 md:py-20 px-6 md:px-12 lg:px-20">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <p className="text-[11px] font-bold text-[#3b82f6] tracking-[0.18em] uppercase mb-4">Facilitation Fee</p>
        <h2 className="text-[28px] md:text-[36px] font-extrabold text-[#0b1733] tracking-tight leading-[1.1] mb-4 max-w-sm">
          Priced To The Size Of The Requirement
        </h2>
        <p className="text-[#6b7a99] text-[13px] leading-relaxed mb-10 max-w-xs">
          The facilitation fee scales with the size of the deal you're seeking help with. A representative example is set out below.
        </p>

        {/* Card */}
        <div className="bg-[#f4f5f7] rounded-2xl overflow-hidden">

          {/* Fee columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#e2e5ea] p-8 md:p-10 gap-0">
            <div className="pb-8 md:pb-0 md:pr-10">
              <p className="text-[12px] text-[#6b7a99] mb-3">Facilitation fee</p>
              <p className="text-[36px] md:text-[42px] font-black text-[#1a56db] tracking-tight leading-none mb-4">£100,000</p>
              <p className="text-[#374151] text-[13px] leading-relaxed">
                Payable once a verified introduction has been made. Scales with the size of the requirement submitted.
              </p>
            </div>
            <div className="pt-8 md:pt-0 md:pl-10">
              <p className="text-[12px] text-[#6b7a99] mb-3">Sourcing deposit</p>
              <p className="text-[36px] md:text-[42px] font-black text-[#1a56db] tracking-tight leading-none mb-4">£5,000</p>
              <p className="text-[#374151] text-[13px] leading-relaxed">
                Payable upfront to begin the search. This covers the sourcing work itself, not a guaranteed outcome.
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-[#e2e5ea] mx-8 md:mx-10" />

          {/* Notes list */}
          <ul className="px-8 md:px-10 py-8 space-y-4">
            {FEE_NOTES.map(note => (
              <li key={note} className="flex gap-3 text-[13px] text-[#4b5563] leading-relaxed">
                <span className="flex-shrink-0 text-[#9baac0] mt-[2px]">·</span>
                {note}
              </li>
            ))}
          </ul>

          {/* Divider */}
          <div className="border-t border-[#e2e5ea] mx-8 md:mx-10" />

          {/* Engagement agreement row */}
          <div className="px-8 md:px-10 py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="text-[11px] text-[#9baac0] uppercase tracking-[0.14em] mb-2">Engagement agreement</p>
              <p className="text-[14px] font-bold text-[#0b1733] leading-snug max-w-md">
                Read the full terms before anything is paid — what the deposit covers, how sourcing is defined, and what happens if no match is found.
              </p>
            </div>
            <button className="flex-shrink-0 bg-[#111827] text-white text-[13px] font-semibold px-5 py-3 rounded-lg hover:bg-[#1f2937] transition-colors whitespace-nowrap">
              Download Agreement (PDF)
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────
   VERIFICATION
───────────────────────────────────────────────────────── */
function Verification() {
  return (
    <section id="verification" className="bg-[#08122a] py-16 md:py-20 px-6 md:px-12 lg:px-20">
      <div className="max-w-6xl mx-auto">
        <p className="text-[11px] font-bold text-[#3b82f6] tracking-[0.16em] uppercase mb-5">Verification</p>
        <h2 className="text-[28px] md:text-[34px] font-extrabold text-white tracking-tight leading-[1.1] mb-12">
          What "Verified"<br />Actually Means
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
          <div>
            <p className="text-[10px] font-bold text-[#6b7a99] tracking-[0.14em] uppercase mb-5">About</p>
            <h3 className="text-[17px] font-bold text-white mb-4">Who You Are</h3>
            <p className="text-[#6b7a99] text-[13px] leading-relaxed">
              Government-issued identity, confirmed source of the relationship or access, and a background
              review sufficient to engage at the level of transaction you are facilitating. We do not accept
              anonymous registrations, unverifiable introductions, or claims of access that cannot be
              substantiated.
            </p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-[#6b7a99] tracking-[0.14em] uppercase mb-5">Standard</p>
            <h3 className="text-[17px] font-bold text-white mb-4">What You're Bringing</h3>
            <p className="text-[#6b7a99] text-[13px] leading-relaxed">
              The capability or requirement is subject to plausibility and proportionality review. A capability
              must be commercially realistic. A requirement must be within the scope of what private facilitation
              can address. Neither side is visible to the other until both are confirmed as verified.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────
   CTA
───────────────────────────────────────────────────────── */
function CTASection() {
  return (
    <section className="bg-[#1a56db] py-16 md:py-20 px-6 md:px-12 lg:px-20">
      <div className="max-w-6xl mx-auto">
        <p className="text-[11px] font-bold text-[#93c5fd] tracking-[0.16em] uppercase mb-5">Deal Confidence</p>
        <h2 className="text-[28px] md:text-[38px] lg:text-[42px] font-extrabold text-white leading-[1.05] tracking-tight mb-5 max-w-2xl">
          Tell Us What You Can Facilitate,<br />Or What You Need Facilitated.
        </h2>
        <p className="text-[#bfdbfe] text-sm leading-relaxed max-w-lg mb-10">
          Both submissions are treated as confidential. Nothing is shared, disclosed, or acted upon without
          prior internal review and identity verification.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/register-capability">
            <button className="bg-white text-[#1a56db] text-[13px] font-semibold px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors">
              Register a Capability
            </button>
          </Link>
          <Link href="/submit-requirement">
            <button className="border border-white/30 text-white text-[13px] font-semibold px-6 py-3 rounded-lg hover:bg-white/10 transition-colors">
              Submit a Requirement
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────
   FOOTER
───────────────────────────────────────────────────────── */
const FOOTER_LINKS = [
  'About', 'Solutions', 'Global Payments', 'Contact',
  'Advisory', 'Privacy', 'Regulatory information',
];

function Footer() {
  return (
    <footer className="bg-white relative overflow-hidden pt-10 pb-6">
      {/* Nav + legal */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-20 relative z-10">
        <nav className="flex flex-wrap gap-x-5 gap-y-3 mb-8">
          {FOOTER_LINKS.map(l => (
            <a key={l} href="#" className="text-[12px] text-[#8892a4] hover:text-[#0b1733] transition-colors">
              {l}
            </a>
          ))}
        </nav>
        <div className="border-t border-[#edf0f5] pt-5">
          <p className="text-[11px] text-[#a0aab8] leading-relaxed max-w-3xl">
            ALDRIC Private is operated as a private facilitation service. All introductions are subject to
            internal review and identity verification. Facilitation fees are outlined in the engagement terms
            and payable before sourcing commences. Nothing on this platform constitutes financial advice,
            investment guidance, or a guarantee of introduction.
          </p>
          <div className="flex items-center justify-between mt-3">
            <p className="text-[11px] text-[#a0aab8]">© ALDRIC Private</p>
            <p className="text-[11px] text-[#a0aab8]">Consulting and financial services</p>
          </div>
        </div>
      </div>

      {/* MERIDIAN watermark */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none select-none w-full text-center leading-none"
        aria-hidden="true"
      >
        <span
          style={{
            fontSize: '22vw',
            fontWeight: 900,
            color: 'transparent',
            WebkitTextStroke: '1px #e5e9f0',
            letterSpacing: '-0.04em',
            whiteSpace: 'nowrap',
            display: 'block',
            lineHeight: 0.8,
          }}
        >
          MERIDIAN
        </span>
      </div>
    </footer>
  );
}

/* ─────────────────────────────────────────────────────────
   PAGE
───────────────────────────────────────────────────────── */
export default function PrivateIntroductions() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Stats />
        <TheModel />
        <Process />
        <Pricing />
        <Verification />
        <CTASection />
      </main>
      <Footer />
      <AuthModal />
    </div>
  );
}
