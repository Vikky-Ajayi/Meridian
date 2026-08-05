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
    <header className="bg-[#080f1f] px-6 md:px-10 h-14 flex items-center justify-between sticky top-0 z-30">
      <AldricLogo />
      <nav className="hidden md:flex items-center gap-7 text-[13px] text-[#8892a4]">
        {['Moving Capital', 'Global Payments', 'Contact'].map(l => (
          <a key={l} href="#" className="hover:text-white transition-colors">{l}</a>
        ))}
      </nav>
      <button
        onClick={() => openModal('register')}
        className="bg-black text-white text-[13px] font-medium px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 transition-colors"
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
    <section className="bg-white px-6 md:px-12 lg:px-20 pt-14 pb-10">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row lg:items-end lg:gap-12">

        {/* ── Left: copy ── */}
        <div className="lg:w-[400px] flex-shrink-0 pb-8 lg:pb-10">
          <h1 className="text-[40px] md:text-[48px] lg:text-[52px] font-extrabold text-[#0b1733] leading-[1.05] tracking-[-0.03em] mb-5">
            Access, Plotted<br />And Matched<br />Privately.
          </h1>
          <p className="text-[#6b7a99] text-sm leading-relaxed mb-8 max-w-sm">
            ALDRIC Private builds a private network of pre-verified facilitators and
            counterparties — matched only when both sides confirm — quantity not a factor,
            quality and confidentiality are.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/register-capability">
              <button className="bg-[#0b1733] text-white text-[13px] font-semibold px-5 py-2.5 rounded-lg hover:bg-[#0b1733]/85 transition-colors">
                Register the Capability
              </button>
            </Link>
            <Link href="/submit-requirement">
              <button className="bg-white text-[#0b1733] border border-[#d0d7e3] text-[13px] font-semibold px-5 py-2.5 rounded-lg hover:bg-gray-50 transition-colors">
                Submit Requirement
              </button>
            </Link>
          </div>
        </div>

        {/* ── Right: diagram ── */}
        <div className="flex-1 flex items-end justify-center lg:justify-end overflow-visible pb-0">
          <div className="flex items-end gap-0 relative pb-8">

            {/* Capability card */}
            <DiagramCard
              imgSrc="/aldric-dashboard/assets/requirement-person.svg"
              label="Capability"
              sub="On the Private"
            />

            {/* Arrow left → centre */}
            <div className="flex items-center self-center mb-10 mx-1">
              <ArrowRight flip />
            </div>

            {/* Centre: ALDRIC mark */}
            <div className="flex flex-col items-center self-center gap-1.5 mb-10 mx-3">
              <img
                src="/aldric-dashboard/assets/aldric-mark.svg"
                alt="ALDRIC"
                className="w-8 h-7"
              />
              <span className="text-[9px] font-bold text-[#0b1733] tracking-[0.14em] uppercase whitespace-nowrap">
                ALDRIC Private
              </span>
              <span className="text-[8px] text-[#9baac0] whitespace-nowrap">
                Verified and Confirmed
              </span>
            </div>

            {/* Arrow centre → right */}
            <div className="flex items-center self-center mb-10 mx-1">
              <ArrowRight />
            </div>

            {/* Requirement card */}
            <DiagramCard
              imgSrc="/aldric-dashboard/assets/capability-person.svg"
              label="Requirement"
              sub="Sub-Introduced Confidential"
            />

          </div>
        </div>
      </div>
    </section>
  );
}

function DiagramCard({ imgSrc, label, sub }: { imgSrc: string; label: string; sub: string }) {
  return (
    <div className="flex flex-col items-center gap-2.5 w-[130px] md:w-[150px]">
      <div
        className="w-full rounded-2xl overflow-hidden border border-[#e8edf5] shadow-sm bg-white"
        style={{ height: 160 }}
      >
        <img src={imgSrc} alt={label} className="w-full h-full object-cover object-top" />
      </div>
      <div className="text-center">
        <p className="text-[13px] font-semibold text-[#0b1733]">{label}</p>
        <p className="text-[11px] text-[#9baac0] mt-0.5 leading-snug">{sub}</p>
      </div>
    </div>
  );
}

function ArrowRight({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      width="56"
      height="40"
      viewBox="0 0 56 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={flip ? { transform: 'scaleX(-1)' } : undefined}
    >
      <path
        d="M4 32 C 16 32, 20 8, 28 8 C 36 8, 40 32, 52 32"
        stroke="#cbd5e1"
        strokeWidth="1.5"
        strokeDasharray="4 3"
        fill="none"
      />
      <path d="M48 29 L52 32 L48 35" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────
   STATS
───────────────────────────────────────────────────────── */
function Stats() {
  return (
    <section className="bg-[#08122a] border-t-[3px] border-[#1a56db]">
      <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-20 py-10 grid grid-cols-2 divide-x divide-white/10">
        <div className="pr-8 md:pr-16">
          <p className="text-[42px] md:text-5xl font-black text-[#3b82f6] tracking-tight leading-none">[N]+</p>
          <p className="text-[#6b7a99] text-sm mt-2.5 leading-snug">Introductions facilitated to date</p>
        </div>
        <div className="pl-8 md:pl-16">
          <p className="text-[42px] md:text-5xl font-black text-[#3b82f6] tracking-tight leading-none">100%</p>
          <p className="text-[#6b7a99] text-sm mt-2.5 leading-snug">Findings identified without introduction</p>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────
   THE MODEL
───────────────────────────────────────────────────────── */
function TheModel() {
  return (
    <section className="bg-[#080f1f] py-16 md:py-20 px-6 md:px-12 lg:px-20">
      <div className="max-w-6xl mx-auto">
        <p className="text-[11px] font-bold text-[#3b82f6] tracking-[0.16em] uppercase mb-5">The Model</p>
        <h2 className="text-[28px] md:text-[34px] font-extrabold text-white tracking-tight leading-[1.1] mb-5 max-w-lg">
          Not A Marketplace.<br />A Private Ledger.
        </h2>
        <p className="text-[#6b7a99] text-sm leading-relaxed mb-12 max-w-2xl">
          Building a functioning ability is not the same as having a transaction. Registering a requirement in
          expectation is not the same as sourcing an opportunity. ALDRIC Private structures both sides separately —
          quietly, to ensure only confirmed matches are surfaced.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
          <div>
            <p className="text-[10px] font-bold text-[#3b82f6] tracking-[0.16em] uppercase mb-3">
              # You Can Facilitate
            </p>
            <h3 className="text-[17px] font-bold text-white mb-3">Register The Capability</h3>
            <p className="text-[#6b7a99] text-[13px] leading-relaxed">
              If you hold an established relationship, access, or arrangement within a private network
              that could facilitate the movement of capital, goods, or commercial introductions —
              register it. ALDRIC Private reviews internally. Nothing is visible to the other side
              until a match is confirmed and both parties are verified.
            </p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-[#3b82f6] tracking-[0.16em] uppercase mb-3">
              # You Need Facilitation
            </p>
            <h3 className="text-[17px] font-bold text-white mb-3">Submit The Requirement</h3>
            <p className="text-[#6b7a99] text-[13px] leading-relaxed">
              If you have a specific capital movement, commercial transaction, or structured introduction
              requirement — your requirement is logged, reviewed, and held privately against the capability
              register. Your requirement to enter a new market, source a counterparty, or sub-introduce
              confidentially is treated as commercially sensitive.
            </p>
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
    body: 'A structured requirement is submitted by the principal — specifying transaction type, geography, scale, and confidentiality terms. No requirement is visible externally.',
  },
  {
    title: 'Private search',
    body: 'ALDRIC Private conducts a discreet internal search across the capability register. Only pre-registered facilitators relevant to the requirement are approached — not a public broadcast, not a document exchange.',
  },
  {
    title: 'Identity verification',
    body: 'Both parties are verified before names are exchanged. Source of identity, standard of engagement, and capacity to facilitate are all confirmed ahead of any introduction being arranged.',
  },
  {
    title: 'Introduction',
    body: 'Once verified, ALDRIC Private facilitates the introduction directly. Where relevant, two sides are connected, after which you can take matters forward from there.',
  },
];

function Process() {
  return (
    <section className="bg-white py-16 md:py-20 px-6 md:px-12 lg:px-20">
      <div className="max-w-6xl mx-auto">
        <p className="text-[11px] font-bold text-[#3b82f6] tracking-[0.16em] uppercase mb-5">Process</p>
        <h2 className="text-[28px] md:text-[34px] font-extrabold text-[#0b1733] tracking-tight leading-[1.1] mb-12">
          How An Introduction<br />Is Made
        </h2>

        <div className="max-w-2xl space-y-0">
          {STEPS.map((step, i) => (
            <div key={i} className="flex gap-5 relative pb-8">
              {i < STEPS.length - 1 && (
                <div className="absolute left-[17px] top-10 bottom-0 w-px bg-[#e5e9f0]" />
              )}
              <div className="flex-shrink-0 w-9 h-9 rounded-full border border-[#dde2ec] bg-white flex items-center justify-center relative z-10">
                <span className="text-[12px] font-semibold text-[#9baac0]">{i + 1}</span>
              </div>
              <div className="pt-1">
                <h3 className="text-[15px] font-semibold text-[#0b1733] mb-1.5">{step.title}</h3>
                <p className="text-[#6b7a99] text-[13px] leading-relaxed">{step.body}</p>
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
function Pricing() {
  return (
    <section className="bg-[#080f1f] py-16 md:py-20 px-6 md:px-12 lg:px-20">
      <div className="max-w-6xl mx-auto">
        <p className="text-[11px] font-bold text-[#3b82f6] tracking-[0.16em] uppercase mb-5">Facilitation</p>
        <h2 className="text-[28px] md:text-[34px] font-extrabold text-white tracking-tight leading-[1.1] mb-4 max-w-md">
          Priced To The Size Of<br />The Requirement
        </h2>
        <p className="text-[#6b7a99] text-sm leading-relaxed mb-12 max-w-xl">
          The facilitator fee scales with the size of the deal you're seeking — you only pay to the scale
          of what you're sourcing. Nothing is guaranteed without payment.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 mb-12">
          <div>
            <p className="text-[10px] font-bold text-[#6b7a99] tracking-[0.14em] uppercase mb-3">Sourcing Fee</p>
            <p className="text-[38px] font-black text-white tracking-tight leading-none mb-4">£100,000</p>
            <p className="text-[#6b7a99] text-[13px] leading-relaxed mb-5">
              Payable once a verified introduction has been made. Covers with the end of the requirement
              cycle — the sourcing phase.
            </p>
            <ul className="space-y-2.5">
              {[
                'Covers the internal sourcing process and vetting of candidates',
                'Applies to transactions above a qualifying threshold',
                'Paid at the point of confirmed capability match',
              ].map(t => (
                <li key={t} className="flex gap-2.5 text-[13px] text-[#6b7a99]">
                  <span className="text-[#3b82f6] mt-0.5 flex-shrink-0">—</span>{t}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[10px] font-bold text-[#6b7a99] tracking-[0.14em] uppercase mb-3">Introduction Fee</p>
            <p className="text-[38px] font-black text-white tracking-tight leading-none mb-4">£5,000</p>
            <p className="text-[#6b7a99] text-[13px] leading-relaxed mb-5">
              Payable to begin the research. This covers the initial phase and is held as a search deposit.
            </p>
            <ul className="space-y-2.5">
              {[
                'Paid before search commences to confirm intent',
                'Non-refundable once sourcing is initiated',
                'Credited against the sourcing fee upon a successful match',
              ].map(t => (
                <li key={t} className="flex gap-2.5 text-[13px] text-[#6b7a99]">
                  <span className="text-[#3b82f6] mt-0.5 flex-shrink-0">—</span>{t}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/8 pt-8">
          <p className="text-[#6b7a99] text-[13px] leading-relaxed max-w-2xl mb-6">
            Read the full terms before anything is paid — what the deposit covers, how sourcing is defined,
            and what happens if no match is found.
          </p>
          <button className="bg-[#1a2540] border border-white/10 text-white text-[13px] font-semibold px-6 py-3 rounded-lg hover:bg-[#1a2540]/70 transition-colors">
            Reviewed Terms and CTA
          </button>
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
