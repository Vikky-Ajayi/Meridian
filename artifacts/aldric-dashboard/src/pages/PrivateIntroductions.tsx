import { Link } from 'wouter';
import { AldricLogo } from '@/components/AldricLogo';
import { AuthModal } from '@/components/AuthModal';
import { useAuth } from '@/lib/auth-context';

/* ── Navbar ─────────────────────────────────────────────── */
function Navbar() {
  const { openModal } = useAuth();
  return (
    <header className="bg-[#0D1B3E]/95 backdrop-blur-sm px-6 md:px-10 h-14 flex items-center justify-between relative z-20">
      <AldricLogo />
      <nav className="hidden md:flex items-center gap-7 text-sm text-gray-400">
        {['Moving Capital', 'Solutions', 'Global Payments', 'Advisory', 'Contact'].map(l => (
          <a key={l} href="#" className="hover:text-white transition-colors">{l}</a>
        ))}
      </nav>
      <button
        onClick={() => openModal('register')}
        className="bg-black text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-black/80 transition-colors"
      >
        Request an Introduction
      </button>
    </header>
  );
}

/* ── Hero ────────────────────────────────────────────────── */
function Hero() {
  return (
    <section className="bg-white pt-12 pb-0 px-6 md:px-16 lg:px-24">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row lg:items-center lg:gap-16">

        {/* Left — copy + CTAs */}
        <div className="flex-shrink-0 lg:w-[420px] pb-10 lg:pb-16">
          <h1 className="text-4xl md:text-5xl lg:text-[52px] font-bold text-[#0D1B3E] leading-[1.08] tracking-tight mb-5">
            Access, Plotted<br />And Matched<br />Privately.
          </h1>
          <p className="text-gray-500 text-sm md:text-base leading-relaxed mb-8">
            ALDRIC Private builds a private network of pre-verified facilitators and counterparties —
            matched only when both sides confirm — quantity not a factor, quality and confidentiality are.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/register-capability">
              <button className="bg-black text-white text-sm font-semibold px-6 py-3 rounded-lg hover:bg-black/85 transition-colors">
                Register the Capability
              </button>
            </Link>
            <Link href="/submit-requirement">
              <button className="bg-white text-[#0D1B3E] border border-gray-300 text-sm font-semibold px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors">
                Submit Requirement
              </button>
            </Link>
          </div>
        </div>

        {/* Right — flow diagram */}
        <div className="flex-1 flex items-end justify-center gap-0 pb-0 overflow-visible">

          {/* Capability card */}
          <div className="flex flex-col items-center gap-3 w-36 md:w-44">
            <div className="w-28 md:w-36 h-36 md:h-44 rounded-2xl overflow-hidden bg-[#f4f6fb]">
              <img src="/aldric-dashboard/assets/requirement-person.svg" alt="Capability" className="w-full h-full object-cover object-top" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-[#0D1B3E] text-sm">Capability</p>
              <p className="text-gray-400 text-xs mt-0.5">On the Private</p>
            </div>
          </div>

          {/* Left arrow */}
          <div className="flex items-center pb-8 mx-1 md:mx-2">
            <img src="/aldric-dashboard/assets/arrow-up.svg" alt="" className="w-20 md:w-28" style={{transform: 'scaleY(-1)'}} />
          </div>

          {/* Centre — ALDRIC */}
          <div className="flex flex-col items-center gap-2 pb-8 mx-1">
            <img src="/aldric-dashboard/assets/aldric-mark.svg" alt="ALDRIC" className="w-9 h-8" />
            <span className="text-[9px] font-bold text-[#0D1B3E] tracking-widest uppercase whitespace-nowrap">ALDRIC Private</span>
            <span className="text-[8px] text-gray-400 whitespace-nowrap">Verified and Confirmed</span>
          </div>

          {/* Right arrow */}
          <div className="flex items-center pb-8 mx-1 md:mx-2">
            <img src="/aldric-dashboard/assets/arrow-down.svg" alt="" className="w-20 md:w-28" />
          </div>

          {/* Requirement card */}
          <div className="flex flex-col items-center gap-3 w-36 md:w-44">
            <div className="w-28 md:w-36 h-36 md:h-44 rounded-2xl overflow-hidden bg-[#f4f6fb]">
              <img src="/aldric-dashboard/assets/capability-person.svg" alt="Requirement" className="w-full h-full object-cover object-top" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-[#0D1B3E] text-sm">Requirement</p>
              <p className="text-gray-400 text-xs mt-0.5">Sub-Introduced Confidential</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

/* ── Stats ───────────────────────────────────────────────── */
function Stats() {
  return (
    <section className="bg-[#0D1B3E] border-t-4 border-[#0F61E9] mt-14">
      <div className="max-w-6xl mx-auto px-6 md:px-16 lg:px-24 py-10 flex flex-col sm:flex-row gap-8 sm:gap-0 sm:divide-x sm:divide-white/10">
        <div className="sm:pr-16 flex-1">
          <p className="text-4xl md:text-5xl font-black text-[#0F61E9] tracking-tight">[N]+</p>
          <p className="text-gray-400 text-sm mt-2 leading-snug">Introductions facilitated to date</p>
        </div>
        <div className="sm:pl-16 flex-1">
          <p className="text-4xl md:text-5xl font-black text-[#0F61E9] tracking-tight">100%</p>
          <p className="text-gray-400 text-sm mt-2 leading-snug">Findings identified without introduction</p>
        </div>
      </div>
    </section>
  );
}

/* ── The Model ───────────────────────────────────────────── */
function TheModel() {
  return (
    <section className="bg-white py-16 md:py-20 px-6 md:px-16 lg:px-24">
      <div className="max-w-6xl mx-auto">
        <p className="text-xs font-bold text-[#0F61E9] tracking-[0.15em] uppercase mb-4">The Model</p>
        <h2 className="text-3xl md:text-4xl font-bold text-[#0D1B3E] tracking-tight mb-5 max-w-xl">
          Not A Marketplace.<br />A Private Ledger.
        </h2>
        <p className="text-gray-500 text-sm md:text-base leading-relaxed max-w-xl mb-12">
          Building a functioning ability is not the same as having a transaction. Registering a requirement in
          expectation is not the same as sourcing an opportunity. ALDRIC Private structures both sides
          separately — quietly, to ensure only confirmed matches are surfaced.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
          {/* Column 1 */}
          <div>
            <p className="text-[10px] font-bold text-[#0F61E9] tracking-[0.18em] uppercase mb-3">
              # You Can Facilitate
            </p>
            <h3 className="text-xl font-bold text-[#0D1B3E] mb-3">Register The Capability</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              If you hold an established relationship, access, or arrangement within a private network
              that could facilitate the movement of capital, goods, or commercial introductions —
              register it. ALDRIC Private reviews internally. Nothing is visible to the other side
              until a match is confirmed and both parties are verified.
            </p>
          </div>

          {/* Column 2 */}
          <div>
            <p className="text-[10px] font-bold text-[#0F61E9] tracking-[0.18em] uppercase mb-3">
              # You Need Facilitation
            </p>
            <h3 className="text-xl font-bold text-[#0D1B3E] mb-3">Submit The Requirement</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              If you have a specific capital movement, commercial transaction, or structured
              introduction requirement — your requirement is logged, reviewed, and held privately
              against the capability register. Your requirement to enter a new market, source a
              counterparty, or sub-introduce confidentially is treated as commercially sensitive and
              reviewed under strict internal protocols.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Process ─────────────────────────────────────────────── */
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
    <section className="bg-[#f7f8fc] py-16 md:py-20 px-6 md:px-16 lg:px-24">
      <div className="max-w-6xl mx-auto">
        <p className="text-xs font-bold text-[#0F61E9] tracking-[0.15em] uppercase mb-4">Process</p>
        <h2 className="text-3xl md:text-4xl font-bold text-[#0D1B3E] tracking-tight mb-12">
          How An Introduction<br />Is Made
        </h2>

        <div className="space-y-0">
          {STEPS.map((step, i) => (
            <div key={i} className="flex gap-5 md:gap-8 pb-8 relative">
              {/* Line connector */}
              {i < STEPS.length - 1 && (
                <div className="absolute left-[18px] top-9 bottom-0 w-px bg-gray-200" />
              )}
              {/* Circle */}
              <div className="flex-shrink-0 w-9 h-9 rounded-full border-2 border-gray-200 bg-white flex items-center justify-center relative z-10">
                <span className="text-xs font-semibold text-gray-400">{i + 1}</span>
              </div>
              {/* Content */}
              <div className="pt-1 pb-2">
                <h3 className="font-semibold text-[#0D1B3E] text-base mb-1">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed max-w-xl">{step.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Pricing ─────────────────────────────────────────────── */
function Pricing() {
  return (
    <section className="bg-[#0D1B3E] py-16 md:py-20 px-6 md:px-16 lg:px-24">
      <div className="max-w-6xl mx-auto">
        <p className="text-xs font-bold text-[#0F61E9] tracking-[0.15em] uppercase mb-4">Facilitation</p>
        <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4 max-w-lg">
          Priced To The Size Of<br />The Requirement
        </h2>
        <p className="text-gray-400 text-sm md:text-base leading-relaxed max-w-xl mb-12">
          The facilitator fee scales with the size of the deal you're seeking — you only pay to the scale of what you're sourcing. Nothing is guaranteed without payment.
        </p>

        {/* Price columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14 mb-10">
          <div>
            <p className="text-[10px] font-bold text-gray-400 tracking-[0.15em] uppercase mb-3">Sourcing Fee</p>
            <p className="text-4xl font-black text-white tracking-tight mb-3">£100,000</p>
            <p className="text-gray-400 text-sm leading-relaxed mb-5">
              Payable once a verified introduction has been made. Covers with the end of the requirement cycle — the sourcing phase.
            </p>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex gap-2"><span className="text-[#0F61E9] mt-0.5">—</span>Covers the internal sourcing process and vetting of candidates</li>
              <li className="flex gap-2"><span className="text-[#0F61E9] mt-0.5">—</span>Applies to transactions above a qualifying threshold</li>
              <li className="flex gap-2"><span className="text-[#0F61E9] mt-0.5">—</span>Paid at the point of confirmed capability match</li>
            </ul>
          </div>

          <div>
            <p className="text-[10px] font-bold text-gray-400 tracking-[0.15em] uppercase mb-3">Introduction Fee</p>
            <p className="text-4xl font-black text-white tracking-tight mb-3">£5,000</p>
            <p className="text-gray-400 text-sm leading-relaxed mb-5">
              Payable to begin the research. This covers the initial phase and is held as a search deposit.
            </p>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex gap-2"><span className="text-[#0F61E9] mt-0.5">—</span>Paid before search commences to confirm intent</li>
              <li className="flex gap-2"><span className="text-[#0F61E9] mt-0.5">—</span>Non-refundable once sourcing is initiated</li>
              <li className="flex gap-2"><span className="text-[#0F61E9] mt-0.5">—</span>Credited against the sourcing fee upon a successful match</li>
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="border-t border-white/10 pt-8">
          <p className="text-gray-400 text-sm leading-relaxed max-w-2xl mb-6">
            Read the full terms before anything is paid — what the deposit covers, how sourcing is defined, and what happens if no match is found.
          </p>
          <button className="bg-[#0F61E9] text-white text-sm font-semibold px-6 py-3 rounded-lg hover:bg-[#0F61E9]/90 transition-colors">
            Reviewed Terms and CTA
          </button>
        </div>
      </div>
    </section>
  );
}

/* ── Verification ────────────────────────────────────────── */
function Verification() {
  return (
    <section className="bg-white py-16 md:py-20 px-6 md:px-16 lg:px-24">
      <div className="max-w-6xl mx-auto">
        <p className="text-xs font-bold text-[#0F61E9] tracking-[0.15em] uppercase mb-4">Verification</p>
        <h2 className="text-3xl md:text-4xl font-bold text-[#0D1B3E] tracking-tight mb-12">
          What "Verified"<br />Actually Means
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
          <div>
            <p className="text-[10px] font-bold text-gray-400 tracking-[0.15em] uppercase mb-5">About</p>
            <h3 className="text-xl font-bold text-[#0D1B3E] mb-4">Who You Are</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Government-issued identity, confirmed source of the relationship or access, and a background
              review sufficient to engage at the level of transaction you are facilitating. We do not accept
              anonymous registrations, unverifiable introductions, or claims of access that cannot be substantiated.
            </p>
          </div>

          <div>
            <p className="text-[10px] font-bold text-gray-400 tracking-[0.15em] uppercase mb-5">Standard</p>
            <h3 className="text-xl font-bold text-[#0D1B3E] mb-4">What You're Bringing</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
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

/* ── CTA ─────────────────────────────────────────────────── */
function CTASection() {
  return (
    <section className="bg-[#0F61E9] py-16 md:py-20 px-6 md:px-16 lg:px-24">
      <div className="max-w-6xl mx-auto">
        <p className="text-xs font-bold text-blue-200 tracking-[0.15em] uppercase mb-5">Deal Confidence</p>
        <h2 className="text-3xl md:text-4xl lg:text-[44px] font-bold text-white leading-[1.1] tracking-tight mb-5 max-w-2xl">
          Tell Us What You Can Facilitate, Or What You Need Facilitated.
        </h2>
        <p className="text-blue-200 text-sm md:text-base leading-relaxed max-w-xl mb-10">
          Both submissions are treated as confidential. Nothing is shared, disclosed, or acted upon without
          prior internal review and identity verification.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/register-capability">
            <button className="bg-white text-[#0F61E9] text-sm font-semibold px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors">
              Register a Capability
            </button>
          </Link>
          <Link href="/submit-requirement">
            <button className="border border-white/40 text-white text-sm font-semibold px-6 py-3 rounded-lg hover:bg-white/10 transition-colors">
              Submit a Requirement
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ── Footer ──────────────────────────────────────────────── */
const FOOTER_LINKS = ['About', 'Solutions', 'Global Payments', 'Contact', 'Advisory', 'Privacy', 'Regulatory information'];

function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 md:px-16 lg:px-24 pt-10 pb-6 relative z-10">
        {/* Nav */}
        <nav className="flex flex-wrap gap-x-6 gap-y-3 mb-8">
          {FOOTER_LINKS.map(l => (
            <a key={l} href="#" className="text-xs text-gray-500 hover:text-gray-800 transition-colors">{l}</a>
          ))}
        </nav>

        {/* Legal */}
        <div className="border-t border-gray-100 pt-5">
          <p className="text-[11px] text-gray-400 leading-relaxed max-w-3xl">
            ALDRIC Private is operated as a private facilitation service. All introductions are subject to internal review and identity verification. Facilitation fees are outlined in the engagement terms and payable before sourcing commences. Nothing on this platform constitutes financial advice, investment guidance, or a guarantee of introduction.
          </p>
          <p className="text-[11px] text-gray-400 mt-3">© ALDRIC Private</p>
        </div>
      </div>

      {/* Watermark */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none select-none overflow-hidden w-full text-center"
        aria-hidden="true"
      >
        <span
          style={{
            fontFamily: 'inherit',
            fontSize: '22.5vw',
            fontWeight: 900,
            color: 'transparent',
            WebkitTextStroke: '1.5px #e5e7eb',
            letterSpacing: '-0.04em',
            lineHeight: 0.85,
            whiteSpace: 'nowrap',
            display: 'block',
          }}
        >
          ALDRIC
        </span>
      </div>
    </footer>
  );
}

/* ── Page ────────────────────────────────────────────────── */
export default function PrivateIntroductions() {
  return (
    <div className="min-h-screen flex flex-col">
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
