import { useEffect, useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';

interface EnquiryResult {
  referenceNumber: string;
  fullName: string;
  whatsappNumber?: string | null;
  whatsappLink?: string | null;
}

export default function MoveMoneySuccess() {
  const [result, setResult] = useState<EnquiryResult | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem('meridian_enquiry_result');
    if (raw) {
      try {
        setResult(JSON.parse(raw));
        sessionStorage.removeItem('meridian_enquiry_result');
      } catch {
        // ignore
      }
    }
  }, []);

  const whatsappHref = result?.whatsappLink ?? (result?.whatsappNumber ? `https://wa.me/${result.whatsappNumber.replace(/\D/g, '')}` : null);

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
            <span>Reference: <b>{result?.referenceNumber ?? '—'}</b></span>
            <span>{result?.fullName ?? ''}</span>
          </div>
          {whatsappHref ? (
            <a href={whatsappHref} target="_blank" rel="noreferrer">
              <button type="button">Message the Desk on WhatsApp</button>
            </a>
          ) : (
            <button type="button" disabled>Message the Desk on WhatsApp</button>
          )}
          {result?.whatsappNumber && <h3>{result.whatsappNumber}</h3>}
          <p>Available 08:00–20:00 GMT, Monday to Friday.</p>
        </section>
      </main>
    </div>
  );
}
