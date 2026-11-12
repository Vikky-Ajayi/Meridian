import { useEffect, useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';

interface EnquiryResult {
  referenceNumber: string;
  fullName: string;
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

  return (
    <div className="flow-page is-move">
      <Navbar />
      <main className="flow-shell">
        <div className="flow-heading">
          <div>Private Client Desk</div>
          <h1>Move Money Abroad</h1>
        </div>
        <section className="success-card">
          <div className="success-badge">
            {/* Star badge */}
            <svg width="36" height="36" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          <div className="eyebrow">Enquiry Received</div>
          <h2>Your request is under review</h2>
          <p>
            Our team is reviewing your request to move money abroad. If you match our client
            profile, we’ll contact you by email and on WhatsApp using the number you provided.
          </p>
          <p>Please keep your reference number handy.</p>
          <div className="success-ref">
            <span>Reference: <b>{result?.referenceNumber ?? '—'}</b></span>
            <span>{result?.fullName ?? ''}</span>
          </div>
        </section>
      </main>
    </div>
  );
}
