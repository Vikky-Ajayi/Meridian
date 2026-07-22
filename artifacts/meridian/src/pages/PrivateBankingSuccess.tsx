import { useEffect, useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';

interface EnquiryResult {
  referenceNumber: string;
  fullName: string;
  whatsappNumber?: string | null;
  whatsappLink?: string | null;
}

export default function PrivateBankingSuccess() {
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

  return (
    <div className="flow-page is-bank">
      <Navbar />
      <main className="flow-shell">
        <div className="flow-heading">
          <div>Private Client Desk</div>
          <h1>Private Banking Introduction</h1>
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
            <span>Reference: <b>{result?.referenceNumber ?? '—'}</b></span>
            <span>{result?.fullName ?? ''}</span>
          </div>
          <h3>We'll be in touch as soon as possible</h3>
          <p>Available 08:00–20:00 GMT, Monday to Friday.</p>
        </section>
      </main>
    </div>
  );
}
