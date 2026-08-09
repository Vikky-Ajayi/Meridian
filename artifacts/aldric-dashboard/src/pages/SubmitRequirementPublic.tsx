import { useState } from 'react';
import { AldricLogo } from '@/components/AldricLogo';
import { CountryPhoneInput } from '@/components/CountryPhoneInput';
import { AuthModal } from '@/components/AuthModal';
import { PublicFormSelect } from '@/components/PublicFormSelect';
import { useAuth } from '@/lib/auth-context';
import { DEAL_CATEGORIES, GEOGRAPHIES, TIMELINES } from '@/lib/mock-data';
import { submitRequirement } from '@/lib/submissions-api';

const NAV_LINKS = ['Moving Capital', 'Global Network', 'Contact'];

function Navbar() {
  const { openModal } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <div className="sticky top-0 z-30">
      <header className="bg-white border-b border-gray-100 px-6 lg:px-[150px] h-[60px] flex items-center justify-between">
        <AldricLogo />

        <nav className="hidden md:flex items-center gap-8 text-[13.5px] text-[#1a1a2e] font-normal">
          {NAV_LINKS.map(l => (
            <a key={l} href="#" className="hover:text-[#0E61E8] transition-colors">{l}</a>
          ))}
        </nav>

        <button
          onClick={() => openModal('register')}
          className="hidden md:block bg-[#111827] text-white text-[13px] font-medium px-5 py-2.5 rounded-lg hover:bg-[#1f2937] transition-colors whitespace-nowrap"
        >
          Request an Introduction
        </button>

        <button
          onClick={() => setOpen(o => !o)}
          className="md:hidden p-2 text-[#0b1733] rounded-md hover:bg-gray-100 transition-colors"
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? (
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2}>
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2}>
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          )}
        </button>
      </header>

      {open && (
        <div className="md:hidden bg-white border-b border-gray-100 px-6 py-4 flex flex-col gap-4">
          {NAV_LINKS.map(l => (
            <a
              key={l}
              href="#"
              onClick={() => setOpen(false)}
              className="text-[14px] text-[#1a1a2e] font-medium hover:text-[#0E61E8] transition-colors"
            >
              {l}
            </a>
          ))}
          <button
            onClick={() => { setOpen(false); openModal('register'); }}
            className="mt-1 w-full bg-[#111827] text-white text-[13px] font-medium px-5 py-2.5 rounded-lg hover:bg-[#1f2937] transition-colors"
          >
            Request an Introduction
          </button>
        </div>
      )}
    </div>
  );
}

interface FormData {
  fullName: string; contactEmail: string; phoneNumber: string; whatsappNumber: string;
  dealCategory: string; geography: string; dealSize: string; description: string;
  timeline: string; priorExperience: string; agreed: boolean;
}

export default function SubmitRequirementPublic() {
  const { openModal } = useAuth();
  const [form, setForm] = useState<FormData>({
    fullName: '', contactEmail: '', phoneNumber: '', whatsappNumber: '',
    dealCategory: '', geography: '', dealSize: '', description: '',
    timeline: '', priorExperience: '', agreed: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const set = (k: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: (e.target as HTMLInputElement).type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitting(true);
    try {
      await submitRequirement({ ...form, source: 'public' });
      openModal('register');
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = 'w-full h-11 px-4 text-[14px] font-medium leading-[1.4] tracking-[-0.02em] bg-[#F5F6FA] border border-gray-200 rounded-lg outline-none placeholder:text-gray-400 focus:border-[#0F61E9] transition-colors';
  const labelCls = 'block text-[14px] font-semibold text-gray-800 mb-1 leading-[1.4] tracking-[-0.02em]';
  const sectionHdr = (t: string) => (
    <div className="flex items-center gap-3 mb-4">
      <span className="text-[14px] font-bold leading-[1.4] tracking-[-0.02em] text-gray-500 whitespace-nowrap" style={{ fontFamily: "'Instrument Sans', sans-serif" }}>{t}</span>
      <div className="flex-1 h-px bg-gray-200" />
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero header */}
      <div className="bg-[#0D1B3E] pt-8 pb-10 md:pt-14 md:pb-8 rounded-t-2xl">
        <div className="md:max-w-2xl md:mx-auto md:px-4">
          <div className="px-6 md:px-0">
            <h1 className="text-[40px] font-semibold text-white mb-2 leading-[1.15] tracking-[-0.04em] text-left capitalize" style={{ fontFamily: "'Instrument Sans', sans-serif" }}>Submit A Requirement</h1>
            <p className="text-gray-400 text-[14px] font-medium leading-[1.4] tracking-[-0.02em] text-left max-w-lg md:max-w-none md:whitespace-nowrap" style={{ fontFamily: "'Instrument Sans', sans-serif" }}>
              Tell us what you're trying to get done. Reviewed internally, and only shared once a verified match is confirmed.
            </p>
          </div>
        </div>
      </div>

      {/* Form card */}
      <div className="flex-1 bg-white md:bg-[#0D1B3E]">
        <div className="md:max-w-2xl md:mx-auto md:px-4 md:pb-16 md:-mt-2">
          <div className="bg-white md:rounded-2xl md:shadow-lg p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {sectionHdr('Personal Information')}
              <div>
                <label className={labelCls}>Full Name</label>
                <input placeholder="e.g John Doe" value={form.fullName} onChange={set('fullName')} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Contact Email</label>
                <input type="email" placeholder="name@email.com" value={form.contactEmail} onChange={set('contactEmail')} className={inputCls} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(['phoneNumber', 'whatsappNumber'] as const).map((k, i) => (
                  <div key={k}>
                    <label className={labelCls}>{i === 0 ? 'Phone Number' : 'WhatsApp Number'}</label>
                    <CountryPhoneInput
                      value={form[k]}
                      onChange={v => setForm(f => ({ ...f, [k]: v }))}
                    />
                  </div>
                ))}
              </div>

              {sectionHdr('Requirement Details')}
              <div>
                <label className={labelCls}>Deal Category</label>
                <PublicFormSelect
                  options={DEAL_CATEGORIES}
                  placeholder="Select a Category"
                  value={form.dealCategory}
                  onChange={v => setForm(f => ({ ...f, dealCategory: v }))}
                />
              </div>
              <div>
                <label className={labelCls}>Geography / Market Covered</label>
                <PublicFormSelect
                  options={GEOGRAPHIES}
                  placeholder="Select a Geography"
                  value={form.geography}
                  onChange={v => setForm(f => ({ ...f, geography: v }))}
                />
              </div>
              <div>
                <label className={labelCls}>Declared Deal Size</label>
                <input placeholder="£1M - £10M" value={form.dealSize} onChange={set('dealSize')} className={inputCls} />
                <p className="text-xs text-gray-400 mt-1 leading-snug">
                  This helps determine the appropriate engagement structure and applicable facilitation terms. See the engagement agreement for full details
                </p>
              </div>
              <div>
                <label className={labelCls}>Describe What You Need Facilitated</label>
                <textarea
                  rows={4}
                  placeholder="I have an established relationship with an agricultural trading group operating in West Africa. I can facilitate introductions between verified buyers and suppliers within this sector and have previously supported similar commercial introductions."
                  value={form.description}
                  onChange={set('description')}
                  className="w-full px-4 py-3 text-sm bg-[#F5F6FA] border border-gray-200 rounded-lg outline-none placeholder:text-gray-400 focus:border-[#0F61E9] resize-none"
                />
                <p className="text-xs text-gray-400 mt-1 leading-snug">
                  Describe the business objective, type of introduction required, relevant industry, geography, and any specific criteria. Information remains private and is only reviewed by our team before any potential introduction
                </p>
              </div>
              <div>
                <label className={labelCls}>Timeline / Urgency</label>
                <PublicFormSelect
                  options={TIMELINES}
                  placeholder="Select Timeline"
                  value={form.timeline}
                  onChange={v => setForm(f => ({ ...f, timeline: v }))}
                />
              </div>
              <div>
                <label className={labelCls}>
                  Prior Experience Facilitating Similar Introductions <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe previous introductions, industries involved, or relevant experience."
                  value={form.priorExperience}
                  onChange={set('priorExperience')}
                  className="w-full px-4 py-3 text-sm bg-[#F5F6FA] border border-gray-200 rounded-lg outline-none placeholder:text-gray-400 focus:border-[#0F61E9] resize-none"
                />
              </div>

              <label className="flex gap-3 items-start cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.agreed}
                  onChange={e => setForm(f => ({ ...f, agreed: e.target.checked }))}
                  className="mt-0.5 w-4 h-4 accent-[#0F61E9] flex-shrink-0"
                />
                <span className="text-xs text-gray-500 leading-relaxed">
                  I understand a £5,000 non-refundable Sourcing Deposit is payable to begin, and a Facilitation Fee applies once a verified introduction is made — full terms in the engagement agreement{' '}
                  <a href="#" className="text-[#0F61E9] underline">(link to the PDF)</a>
                </span>
              </label>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-black text-white text-sm font-semibold py-3.5 rounded-lg hover:bg-black/85 transition-colors"
              >
                {submitting ? 'Submitting...' : 'Submit Requirement'}
              </button>
              {submitError && <p className="text-center text-xs font-medium text-red-500">{submitError}</p>}
            </form>

            <p className="text-center text-sm text-gray-500 mt-4">
              Already have an account?{' '}
              <button className="text-[#0F61E9] font-medium" onClick={() => openModal('login')}>Sign in instead.</button>
            </p>
          </div>
        </div>
      </div>

      <AuthModal />
    </div>
  );
}
