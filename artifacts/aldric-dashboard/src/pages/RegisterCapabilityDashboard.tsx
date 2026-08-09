import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { CountryPhoneInput } from '@/components/CountryPhoneInput';
import { NeedAssistance } from '@/components/NeedAssistance';
import { PublicFormSelect } from '@/components/PublicFormSelect';
import { DEAL_CATEGORIES, GEOGRAPHIES } from '@/lib/mock-data';
import { submitCapability } from '@/lib/submissions-api';

interface FormData {
  fullName: string; contactEmail: string; phoneNumber: string; whatsappNumber: string;
  dealCategory: string; geography: string; dealSizeRange: string; description: string;
  priorExperience: string; agreed: boolean;
}

export default function RegisterCapabilityDashboard() {
  const [form, setForm] = useState<FormData>({
    fullName: '', contactEmail: '', phoneNumber: '', whatsappNumber: '',
    dealCategory: '', geography: '', dealSizeRange: '', description: '',
    priorExperience: '', agreed: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const set = (k: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: (e.target as HTMLInputElement).type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value }));

  const inputCls = 'w-full h-11 px-4 text-[14px] font-medium leading-[1.4] tracking-[-0.02em] bg-[#F5F6FA] border border-gray-200 rounded-lg outline-none placeholder:text-gray-400 focus:border-white/80 transition-colors';
  const labelCls = 'block text-[14px] font-semibold text-gray-800 mb-1 leading-[1.4] tracking-[-0.02em]';

  const sectionHdr = (t: string) => (
    <div className="flex items-center gap-3 mb-4">
      <span className="text-[14px] font-bold leading-[1.4] tracking-[-0.02em] text-gray-500 whitespace-nowrap" style={{ fontFamily: "'Instrument Sans', sans-serif" }}>{t}</span>
      <div className="flex-1 h-px bg-gray-200" />
    </div>
  );

  const dropdownField = (label: string, val: string, k: 'dealCategory' | 'geography', placeholder: string, items: string[]) => (
    <div>
      <label className={labelCls}>{label}</label>
      <PublicFormSelect
        options={items}
        placeholder={placeholder}
        value={val}
        onChange={v => setForm(f => ({ ...f, [k]: v }))}
      />
    </div>
  );

  if (submitted) {
    return (
      <DashboardLayout title="Register Capability">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl p-10 text-center shadow-sm">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg viewBox="0 0 24 24" className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Capability Submitted</h2>
            <p className="text-gray-500 text-sm mb-6">Your capability has been submitted for internal review. We'll be in touch if a match is identified.</p>
            <button onClick={() => setSubmitted(false)} className="bg-[#0F61E9] text-white text-sm font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity">
              Submit Another
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Register Capability">
      <div className="bg-[#0F61E9] rounded-2xl p-8 md:p-10 max-w-4xl mx-auto">
        <h2 className="text-[40px] font-semibold text-white mb-2 leading-[1.15] tracking-[-0.04em] text-center capitalize" style={{ fontFamily: "'Instrument Sans', sans-serif" }}>Register A Capability</h2>
        <p className="text-blue-200 text-[14px] font-medium leading-[1.4] tracking-[-0.02em] text-center mb-8" style={{ fontFamily: "'Instrument Sans', sans-serif" }}>Tell us what you're able to facilitate. Reviewed internally before it's ever considered for matching.</p>

        <div className="bg-white rounded-xl p-6 md:p-8">
          <form
            onSubmit={async e => {
              e.preventDefault();
              setSubmitError('');
              setSubmitting(true);
              try {
                await submitCapability({ ...form, source: 'dashboard' });
                setSubmitted(true);
              } catch (err) {
                setSubmitError(err instanceof Error ? err.message : 'Submission failed. Please try again.');
              } finally {
                setSubmitting(false);
              }
            }}
            className="space-y-5"
          >
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

            {sectionHdr('Capability Details')}
            {dropdownField('Deal Category', form.dealCategory, 'dealCategory', 'Select a Category', DEAL_CATEGORIES)}
            {dropdownField('Geography / Market Covered', form.geography, 'geography', 'Select a Geography', GEOGRAPHIES)}
            <div>
              <label className={labelCls}>Typical Deal Size Range</label>
              <input placeholder="£1M - £10M" value={form.dealSizeRange} onChange={set('dealSizeRange')} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Describe Your Capability</label>
              <textarea rows={4} placeholder="I have an established relationship with an agricultural trading group operating in West Africa. I can facilitate introductions between verified buyers and suppliers within this sector and have previously supported similar commercial introductions."
                value={form.description} onChange={set('description')}
                className="w-full px-4 py-3 text-sm bg-[#F5F6FA] border border-gray-200 rounded-lg outline-none placeholder:text-gray-400 focus:border-gray-300 resize-none" />
              <p className="text-xs text-gray-400 mt-1 leading-snug">
                Describe, in confidence, the type of business access, relationship, introduction, or arrangement you may be able to facilitate. Explain the nature of the relationship, the market involved, and how introductions typically work. This information is reviewed internally before being considered for matching.
              </p>
            </div>
            <div>
              <label className={labelCls}>
                Prior Experience Facilitating Similar Introductions <span className="font-normal text-gray-400">(optional)</span>
              </label>
              <textarea rows={3} placeholder="Describe previous introductions, industries involved, or relevant experience."
                value={form.priorExperience} onChange={set('priorExperience')}
                className="w-full px-4 py-3 text-sm bg-[#F5F6FA] border border-gray-200 rounded-lg outline-none placeholder:text-gray-400 focus:border-gray-300 resize-none" />
            </div>

            <label className="flex gap-3 items-start cursor-pointer">
              <input type="checkbox" checked={form.agreed} onChange={e => setForm(f => ({ ...f, agreed: e.target.checked }))}
                className="mt-0.5 w-4 h-4 accent-[#0F61E9] flex-shrink-0" />
              <span className="text-xs text-gray-500 leading-relaxed">
                I understand that my capability information will remain confidential and will only be shared with relevant parties after internal review, verification, and confirmation of a suitable requirement.
              </span>
            </label>

            <div className="flex justify-end">
              <button type="submit" className="bg-black text-white text-sm font-semibold px-8 py-3 rounded-lg hover:bg-black/85 transition-colors">
                {submitting ? 'Submitting...' : 'Submit Capability'}
              </button>
            </div>
            {submitError && <p className="text-center text-xs font-medium text-red-500">{submitError}</p>}
          </form>
        </div>
      </div>
      <div className="max-w-4xl mx-auto">
        <NeedAssistance />
      </div>
    </DashboardLayout>
  );
}
