import { Navbar } from '@/components/layout/Navbar';

export default function PrivateBankingSuccess() {
  return (
    <div className="flow-page is-bank">
      <Navbar />
      <main className="flow-shell">
        <div className="flow-heading">
          <div>Private Client Desk</div>
          <h1>Move Money Abroad</h1>
        </div>
        <section className="success-card">
          <div className="success-badge">★</div>
          <div className="eyebrow">Enquiry Logged</div>
          <h2>Your Introduction Is Being Arranged</h2>
          <p>
            A private client associate has your details and will reach out directly to
            arrange your introduction. Quote your reference if asked.
          </p>
          <div className="success-ref">
            <span>Reference: <b>MMA-20260717-1639</b></span>
            <span>Freeborn Ehirhere Ebosele</span>
          </div>
          <h3>We'll be in touch at as soon as possible</h3>
          <p>Available 08:00-20:00 GMT, Monday to Friday.</p>
        </section>
      </main>
    </div>
  );
}
