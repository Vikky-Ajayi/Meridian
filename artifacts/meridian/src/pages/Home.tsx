import { Link } from 'wouter';
import heroGlobe from '@/assets/Mask group-desktop.png';
import worldMap from '@/assets/Frame 1410106951.png';
import iconHandshake from '@/assets/Frame.png';
import iconCurrency from '@/assets/Frame-1.png';
import iconBank from '@/assets/Frame-2.png';
import iconShield from '@/assets/Frame-3.png';
import reasonProperty from '@/assets/Frame 1410106902.png';
import reasonBusiness from '@/assets/Frame 1410106902-4.png';
import reasonRelocation from '@/assets/Frame 1410106902-1.png';
import reasonPortfolio from '@/assets/Frame 1410106902-2.png';
import reasonOther from '@/assets/Frame 1410106902-3.png';

const stats = [
  { value: '190+', label: 'Countries reached', lightLabel: 'Countries', icon: iconHandshake },
  { value: '50+', label: 'Settlement currencies', lightLabel: 'Currencies', icon: iconCurrency },
  { value: '$50M+', label: 'Single-transfer capacity', lightLabel: 'Indicative single-transfer capacity', icon: iconBank },
  { value: 'Tier-1', lightValue: 'T+0-T+1', label: 'Custody, London & NY', lightLabel: 'Large-value settlement', icon: iconShield },
];

const testimonials = [
  ['Aldric Private provided a highly professional and discreet approach to navigating an international financial requirement. Their ability to understand our objectives and coordinate the right banking relationships made the process seamless.', 'Private Client, United Kingdom'],
  ['The level of attention, confidentiality, and professionalism demonstrated by Aldric Private was exceptional. They understood that every financial situation is unique and provided a structured approach tailored to our circumstances.', 'International Client'],
  ['Aldric Private helped us identify suitable private banking solutions aligned with our requirements. Their advisory approach gave us confidence throughout the process.', 'Business Owner, Europe'],
  ['When our transaction became too complex for a retail service, Aldric Private helped us understand the institutional route.', 'Private Client'],
];

const reasons = [
  [reasonProperty, 'Property & real estate', 'Funding an overseas purchase or completion on a fixed date, in the currency and jurisdiction your solicitor needs - not the one your old bank happens to support.'],
  [reasonBusiness, 'Business sale or acquisition', 'Moving proceeds from an exit, or funding an acquisition abroad, with FX locked ahead of completion so the number on the term sheet is the number that lands.'],
  [reasonRelocation, 'Relocation & residency programs', 'Repositioning wealth ahead of a move - sequenced with your legal and tax advisers so capital arrives in the right account, at the right time, once'],
  [reasonPortfolio, 'Portfolio consolidation', 'Bringing accounts, holdings and deposits scattered across custodians and currencies under a single, safeguarded relationship.'],
  [reasonOther, 'Other business & personal reasons', 'Supplier payments, inheritance, family settlements, investment capital, and other transfers requiring tailored support.'],
];

const solution = [
  ['Personalized international banking', 'Global multi-currency accounts, opened once and accessible from anywhere - structured around how your capital actually moves, not how a branch is organised.'],
  ['Treasury & foreign exchange', 'Institutional liquidity and FX execution at a speed built for opportunity - priced and settled like a trading desk, not a retail counter.'],
  ['Deposit & asset safeguarding', 'Variable and fixed-term accounts, safeguarded with Tier-1 institutions in London and New York - capital held to the same standard, wherever you are.'],
  ['Privacy through virtual assets', 'Send and receive digital assets without carrying virtual-asset exposure on your own balance sheet.'],
];

function StatsBar({ light = false }: { light?: boolean }) {
  return (
    <section className={`meridian-stats ${light ? 'is-light' : ''}`}>
      {stats.map((stat) => (
        <div className="meridian-stat" key={`${stat.value}-${stat.label}`}>
          <img src={stat.icon} alt="" />
          <b>{light && stat.lightValue ? stat.lightValue : stat.value}</b>
          <span>{light ? stat.lightLabel : stat.label}</span>
        </div>
      ))}
    </section>
  );
}

export default function Home() {
  return (
    <div className="meridian-home">
      <section className="meridian-hero">
        <h1>Move Significant Capital Across Borders, On Your Terms.</h1>
        <p>
          A dedicated desk for large-value international transfers, property purchases,
          business sales, relocations, portfolio consolidation, priced and executed like an
          institutional treasury, not a retail wire.
        </p>
        <div className="meridian-hero-actions">
          <Link className="meridian-btn meridian-btn-dark" href="/move-money-abroad">Move money abroad</Link>
          <Link className="meridian-btn meridian-btn-light" href="/private-banking-introduction">Request banking introduction</Link>
        </div>
        <img className="meridian-globe" src={heroGlobe} alt="Global banking network" />
      </section>

      <StatsBar />

      <section className="meridian-testimonials">
        <div className="meridian-wrap">
          <h2>Client Experiences</h2>
          <div className="testimonial-viewport">
            <div className="testimonial-track">
              {[...testimonials, ...testimonials].map(([quote, author], index) => (
                <article className="testimonial-card" key={`${author}-${index}`}>
                  <div>
                    <div className="quote-mark">“</div>
                    <p>"{quote}"</p>
                  </div>
                  <b>- {author}</b>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="solutions" className="capital-section">
        <div className="capital-head">
          <div>
            <div className="eyebrow">Large Capital Movement</div>
            <h2>When The Amount Is Too Large For A Retail Wire.</h2>
          </div>
          <p>
            Above a certain size, a transfer stops being a transaction and becomes an
            event - timing, sequencing and jurisdiction all matter. This is the work your
            desk does before you move.
          </p>
        </div>
        <div className="reason-grid">
          {reasons.map(([icon, title, copy]) => (
            <article className="reason-card" key={title}>
              <img src={icon} alt="" />
              <div>
                <b>{title}</b>
                <p>{copy}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="solution-section">
        <div>
          <h2>The Solution</h2>
          <p>
            Tailored financial solutions designed for high-net-worth individuals, families,
            entrepreneurs and corporates - four disciplines, held under one relationship.
          </p>
        </div>
        <div className="solution-steps">
          {solution.map(([title, copy], index) => (
            <article key={title}>
              <strong>0{index + 1}</strong>
              <div>
                <b>{title}</b>
                <p>{copy}</p>
              </div>
              <span>-</span>
            </article>
          ))}
        </div>
      </section>

      <section id="payments" className="payments-section">
        <div className="payments-head">
          <div>
            <div className="eyebrow">Global Payments</div>
            <h2>Large-Value Transfers, Routed Like Institutional Flow.</h2>
          </div>
          <p>
            Every corridor below is a direct relationship, not a chain of correspondent
            banks. Above six figures, that difference shows up in your rate and your
            settlement date.
          </p>
        </div>
        <img className="world-map" src={worldMap} alt="Live corridor network map" />
      </section>

      <div className="stats-light-wrap">
        <StatsBar light />
      </div>

      <section id="advisory" className="desk-section">
        <div className="desk-card">
          <div className="desk-avatar">MV</div>
          <div className="desk-title">
            <b>Your Desk</b>
            <p>Dedicated Account Manager</p>
          </div>
          <dl>
            <div><dt>Chat</dt><dd>• Online now</dd></div>
            <div><dt>Speak By Phone</dt><dd>On request</dd></div>
            <div><dt>Meet In Person</dt><dd>London · NY · Zurich</dd></div>
          </dl>
        </div>
        <div className="advisory-copy">
          <div className="eyebrow">Advisory</div>
          <h2>Expert Advice On Asset Movement</h2>
          <p>
            Moving a significant sum across jurisdictions is rarely one transaction. Your
            desk advises on sequencing, timing, currency and structure before you move
            capital, not after - so a large transfer only has to happen once.
          </p>
          <div className="eyebrow">Availability</div>
          <h2>A Dedicated Desk, Around The Clock</h2>
          <p>
            Chat, speak or meet your account manager at your own convenience - across
            time zones, not around office hours.
          </p>
        </div>
      </section>

      <section className="banking-intro-section">
        <div>
          <div className="eyebrow">Banking Introductions</div>
          <h2>Access Private Banking Through Our Network</h2>
          <p>
            Whether you are looking to open a personal or business account, require
            multi-currency banking, or need a specialist private banking relationship,
            Aldric Private introduces qualified clients to banks within our trusted global
            network that best match their financial needs and circumstances.
          </p>
          <p>
            Tell us a little about your requirements, and a member of our desk will
            contact you within one business day to discuss the most suitable banking
            options available.
          </p>
        </div>
        <form className="intro-form">
          <label>Full Name<input placeholder="e.g. John Doe" /></label>
          <label>Email address<input placeholder="e.g. info@example.com" /></label>
          <label>Region<select><option>Select region</option></select></label>
          <label>Relationship<select><option>Select relationship</option></select></label>
          <label className="full">Message optional<textarea placeholder="How can we help?" /></label>
          <button className="full" type="button">Request an Introduction</button>
        </form>
      </section>
    </div>
  );
}
