import { useState } from 'react';
import { useSubmitContactEnquiry } from '@workspace/api-client-react';
import { WhatsAppIcon } from '@/components/WhatsAppIcon';
import { DESK_WHATSAPP_LINK } from '@/lib/contact';

const ENQUIRY_TYPES = [
  'Private Banking Introduction',
  'Moving Capital',
  'Business Banking',
  'General Enquiry',
  'Other',
];

export default function Contact() {
  const mutation = useSubmitContactEnquiry();
  const [fullName, setFullName] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [natureOfEnquiry, setNatureOfEnquiry] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);

  const isValid =
    fullName.trim() && emailAddress.trim() && phoneNumber.trim() && natureOfEnquiry && message.trim();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid || mutation.isPending) return;
    setError(null);
    try {
      const result = await mutation.mutateAsync({
        data: {
          fullName: fullName.trim(),
          emailAddress: emailAddress.trim(),
          phoneNumber: phoneNumber.trim(),
          natureOfEnquiry,
          message: message.trim(),
        },
      });
      setReference(result.referenceNumber);
    } catch {
      setError('Something went wrong. Please try again.');
    }
  }

  return (
    <div className="content-page contact-page">
      <section className="blue-panel">
        <div className="eyebrow">Contact Us</div>
        <h1>Get in Touch with Envoi & Co.</h1>
        <p>
          At Envoi & Co., we provide trusted, professional and personalised assistance with
          private banking introductions and large-scale capital movements. Whether you're
          looking to establish a private banking relationship, arrange a significant funds
          transfer, or discuss your financial requirements, our team is here to assist.
        </p>
      </section>

      <main className="text-body">
        <h2>Speak to Our Team</h2>
        <p>
          You can contact us through our online enquiry form or connect directly with one of
          our Private Client Associates via WhatsApp. Our team will review your enquiry and
          respond as soon as possible.
        </p>

        <h3 className="contact-subheading">Send Us an Enquiry</h3>
        {reference ? (
          <div className="contact-success">
            <h3>Thank you, your enquiry has been received.</h3>
            <p>
              A member of our team will be in touch as soon as possible. Quote your reference
              if asked: <b>{reference}</b>
            </p>
          </div>
        ) : (
          <form className="contact-form" onSubmit={handleSubmit}>
            <label>
              Full Name
              <input value={fullName} onChange={(e) => setFullName(e.target.value)} required />
            </label>
            <label>
              Email Address
              <input
                type="email"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
                required
              />
            </label>
            <label>
              Phone Number
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </label>
            <label>
              Nature of Enquiry
              <select
                value={natureOfEnquiry}
                onChange={(e) => setNatureOfEnquiry(e.target.value)}
                required
              >
                <option value="" disabled>Select nature of enquiry</option>
                {ENQUIRY_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </label>
            <label className="full">
              Your Message
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </label>
            {error && <p className="full form-error">{error}</p>}
            <button
              className="full"
              type="submit"
              disabled={!isValid || mutation.isPending}
              style={{ opacity: !isValid || mutation.isPending ? 0.5 : 1 }}
            >
              {mutation.isPending ? 'Submitting…' : 'Submit Enquiry'}
            </button>
          </form>
        )}

        <h3 className="contact-subheading">Prefer to Speak Directly?</h3>
        <p>
          Connect with one of our advisors on WhatsApp for a confidential discussion about
          your requirements.
        </p>
        <a className="contact-whatsapp" href={DESK_WHATSAPP_LINK} target="_blank" rel="noreferrer">
          <WhatsAppIcon />
          Chat With Us on WhatsApp
        </a>

        <p className="contact-disclaimer">
          Envoi & Co. acts as a private banking introducer and capital movement facilitator.
          We are not a bank and do not handle or hold client funds. Banking services and
          financial transactions are subject to the requirements and approval of the relevant
          financial institutions.
        </p>
      </main>
    </div>
  );
}
