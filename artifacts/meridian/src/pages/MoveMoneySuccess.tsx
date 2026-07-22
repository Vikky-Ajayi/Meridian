import { Navbar } from '@/components/layout/Navbar';

export default function MoveMoneySuccess() {
  return (
    <div className="flow-page is-move">
      <Navbar />
      <main className="flow-shell">
        <div className="flow-heading">
          <div>Private Client Desk</div>
          <h1>Move Money Abroad</h1>
        </div>
        <section className="success-card">
          <div className="success-badge">★</div>
          <div className="eyebrow">Enquiry Logged</div>
          <h2>Your Line To The Desk Is Open</h2>
          <p>
            A private client associate has your details and will pick up the conversation
            directly on WhatsApp. Quote your reference if asked.
          </p>
          <div className="success-ref">
            <span>Reference: <b>MMA-20260717-1639</b></span>
            <span>Freeborn Ehirhere Ebosele</span>
          </div>
          <button type="button">Message the Desk on WhatsApp</button>
          <h3>+44 7000 000000</h3>
          <p>Available 08:00-20:00 GMT, Monday to Friday.</p>
        </section>
      </main>
    </div>
  );
}
