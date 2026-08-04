import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { NeedAssistance } from '@/components/NeedAssistance';
import { DEAL_CATEGORIES, GEOGRAPHIES, TIMELINES } from '@/lib/mock-data';

interface FormData {
  fullName: string; contactEmail: string; phoneNumber: string; whatsappNumber: string;
  dealCategory: string; geography: string; dealSize: string; description: string;
  timeline: string; priorExperience: string; agreed: boolean;
}

export default function SubmitRequirementDashboard() {
  const [form, setForm] = useState<FormData>({
    fullName: '', contactEmail: '', phoneNumber: '', whatsappNumber: '',
    dealCategory: '', geography: '', dealSize: '', description: '',
    timeline: '', priorExperience: '', agreed: false,
  });
  const [submitted, setSubmitted] = useState(false);

  const set = (k: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: (e.target as HTMLInputElement).type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value }));

  const inputCls = 'w-full h-11 px-4 text-sm bg-[#F5F6FA] border border-gray-200 rounded-lg outline-none placeholder:text-gray-400 focus:border-gray-300 transition-colors';
  const selectCls = 'w-full h-11 px-4 text-sm bg-[#F5F6FA] border border-gray-200 rounded-lg outline-none text-gray-400 focus:border-gray-300 transition-colors appearance-none';

  const sectionHdr = (t: string) => (
    <div className="border-b border-gray-200 pb-2 mb-4">
      <p className="text-sm font-semibold text-gray-500 tracking-wide">{t}</p>
    </div>
  );

  const dropdownField = (label: string, val: string, k: keyof FormData, placeholder: string, items: string[]) => (
    <div>
      <label className="block text-sm font-medium text-gray-800 mb-1">{label}</label>
      <div className="relative">
        <select value={val} onChange={set(k)} className={selectCls}>
          <option value="" disabled>{placeholder}</option>
          {items.map(i => <option key={i} value={i}>{i}</option>)}
        </select>
        <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2}><polyline points="6 9 12 15 18 9"/></svg>
        </span>
      </div>
    </div>
  );

  const flagIcon = (
    <svg viewBox="0 0 20 15" className="w-5 h-4" fill="none">
      <rect width="20" height="15" fill="#22C55E"/>
      <circle cx="10" cy="7.5" r="3" fill="#fff" stroke="#22C55E" strokeWidth="0.5"/>
      <circle cx="10" cy="7.5" r="2" fill="#22C55E"/>
    </svg>
  );

  if (submitted) {
    return (
      <DashboardLayout title="Submit Requirement">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl p-10 text-center shadow-sm">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg viewBox="0 0 24 24" className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Requirement Submitted</h2>
            <p className="text-gray-500 text-sm mb-6">Your requirement is under review. We'll contact you when a verified match is identified.</p>
            <button onClick={() => setSubmitted(false)} className="bg-[#0D1B3E] text-white text-sm font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity">
              Submit Another
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Submit Requirement">
      <div className="bg-[#0D1B3E] rounded-2xl p-8 md:p-10 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-2">Submit A Requirement</h2>
        <p className="text-gray-400 text-sm mb-8">
          Tell us what you're trying to get done. Reviewed internally, and only shared once a verified match<br className="hidden md:block"/> is confirmed.
        </p>

        <div className="bg-white rounded-xl p-6 md:p-8">
          <form onSubmit={e => { e.preventDefault(); setSubmitted(true); }} className="space-y-5">
            {sectionHdr('Personal Information')}
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">Full Name</label>
              <input placeholder="e.g John Doe" value={form.fullName} onChange={set('fullName')} className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">Contact Email</label>
              <input type="email" placeholder="name@email.com" value={form.contactEmail} onChange={set('contactEmail')} className={inputCls} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(['phoneNumber', 'whatsappNumber'] as const).map((k, i) => (
                <div key={k}>
                  <label className="block text-sm font-medium text-gray-800 mb-1">{i === 0 ? 'Phone Number' : 'WhatsApp Number'}</label>
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden h-11 bg-[#F5F6FA]">
                    <span className="px-3 flex-shrink-0">{flagIcon}</span>
                    <input placeholder="0000 000 0000 .000" value={form[k]}
                      onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))}
                      className="flex-1 px-2 text-sm outline-none h-full bg-transparent placeholder:text-gray-400" />
                  </div>
                </div>
              ))}
            </div>

            {sectionHdr('Requirement Details')}
            {dropdownField('Deal Category', form.dealCategory, 'dealCategory', 'Select a Category', DEAL_CATEGORIES)}
            {dropdownField('Geography / Market Covered', form.geography, 'geography', 'Select a Geography', GEOGRAPHIES)}
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">Declared Deal Size</label>
              <input placeholder="£1M - £10M" value={form.dealSize} onChange={set('dealSize')} className={inputCls} />
              <p className="text-xs text-gray-400 mt-1 leading-snug">
                This helps determine the appropriate engagement structure and applicable facilitation terms. See the engagement agreement for full details
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">Describe What You Need Facilitated</label>
              <textarea rows={4}
                placeholder="I have an established relationship with an agricultural trading group operating in West Africa. I can facilitate introductions between verified buyers and suppliers within this sector and have previously supported similar commercial introductions."
                value={form.description} onChange={set('description')}
                className="w-full px-4 py-3 text-sm bg-[#F5F6FA] border border-gray-200 rounded-lg outline-none placeholder:text-gray-400 focus:border-gray-300 resize-none" />
              <p className="text-xs text-gray-400 mt-1 leading-snug">
                Describe the business objective, type of introduction required, relevant industry, geography, and any specific criteria. Information remains private and is only reviewed by our team before any potential introduction
              </p>
            </div>
            {dropdownField('Timeline / Urgency', form.timeline, 'timeline', 'Select Timeline', TIMELINES)}
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
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
                I understand a £5,000 non-refundable Sourcing Deposit is payable to begin, and a Facilitation Fee applies once a verified introduction is made — full terms in the engagement agreement{' '}
                <a href="#" className="text-[#0F61E9] underline">(link to the PDF)</a>
              </span>
            </label>

            <div className="flex justify-end">
              <button type="submit" className="bg-black text-white text-sm font-semibold px-8 py-3 rounded-lg hover:bg-black/85 transition-colors">
                Submit Requirement
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="max-w-4xl mx-auto">
        <NeedAssistance />
      </div>
    </DashboardLayout>
  );
}
