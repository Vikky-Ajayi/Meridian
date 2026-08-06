import { useState } from 'react';
import { AldricLogo } from '@/components/AldricLogo';
import { AuthModal } from '@/components/AuthModal';
import { useAuth } from '@/lib/auth-context';
import { DEAL_CATEGORIES, GEOGRAPHIES, TIMELINES } from '@/lib/mock-data';

function MobileNavbar() {
  return (
    <header className="bg-black px-5 h-14 flex items-center justify-between relative z-10">
      <AldricLogo />
      <button className="text-white p-1">
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2}>
          <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>
    </header>
  );
}

function DesktopNavbar() {
  const { openModal } = useAuth();
  return (
    <header className="hidden md:flex bg-[#0D1B3E]/90 backdrop-blur-sm px-8 h-14 items-center justify-between relative z-10">
      <AldricLogo />
      <nav className="flex items-center gap-8 text-sm text-gray-300">
        {['Moving Capital', 'Solutions', 'Global Payments', 'Advisory', 'Contact'].map(l => (
          <a key={l} href="#" className="hover:text-white transition-colors">{l}</a>
        ))}
      </nav>
      <button
        onClick={() => openModal('register')}
        className="bg-black text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-black/80 transition-colors"
      >
        Request an Introduction
      </button>
    </header>
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

  const set = (k: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: (e.target as HTMLInputElement).type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    openModal('register');
  };

  const inputCls = 'w-full h-11 px-4 text-[14px] font-medium leading-[1.4] tracking-[-0.02em] bg-[#F5F6FA] border border-gray-200 rounded-lg outline-none placeholder:text-gray-400 focus:border-[#0F61E9] transition-colors';
  const selectCls = 'w-full h-11 px-4 text-[14px] font-medium leading-[1.4] tracking-[-0.02em] bg-[#F5F6FA] border border-gray-200 rounded-lg outline-none text-gray-400 focus:border-[#0F61E9] transition-colors appearance-none';
  const labelCls = 'block text-[14px] font-medium text-gray-800 mb-1 leading-[1.4] tracking-[-0.02em]';
  const sectionHdr = (t: string) => (
    <div className="flex items-center gap-3 mb-4">
      <span className="text-[14px] font-semibold leading-[1.4] tracking-[-0.02em] text-gray-500 whitespace-nowrap" style={{ fontFamily: "'Instrument Sans', sans-serif" }}>{t}</span>
      <div className="flex-1 h-px bg-gray-200" />
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <div className="md:hidden"><MobileNavbar /></div>
      <div className="hidden md:block"><DesktopNavbar /></div>

      {/* Hero header */}
      <div className="bg-[#0D1B3E] px-6 pt-8 pb-10 md:pt-14 md:pb-16">
        <h1 className="text-[40px] font-semibold text-white mb-2 leading-[1.15] tracking-[-0.04em] text-center capitalize" style={{ fontFamily: "'Instrument Sans', sans-serif" }}>Submit A Requirement</h1>
        <p className="text-gray-400 text-[14px] font-medium leading-[1.4] tracking-[-0.02em] text-center max-w-lg" style={{ fontFamily: "'Instrument Sans', sans-serif" }}>
          Tell us what you're trying to get done. Reviewed internally, and only shared once a verified match is confirmed.
        </p>
      </div>

      {/* Form card */}
      <div className="flex-1 bg-white md:bg-[#0D1B3E]">
        <div className="md:max-w-2xl md:mx-auto md:px-4 md:pb-16 md:-mt-4">
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
                {['phoneNumber', 'whatsappNumber'].map((k, i) => (
                  <div key={k}>
                    <label className={labelCls}>{i === 0 ? 'Phone Number' : 'WhatsApp Number'}</label>
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden h-11 bg-[#F5F6FA]">
                      <span className="px-3 flex-shrink-0">
                        <svg viewBox="0 0 20 15" className="w-5 h-4" fill="none">
                          <rect width="20" height="15" fill="#22C55E"/>
                          <circle cx="10" cy="7.5" r="3" fill="#fff" stroke="#22C55E" strokeWidth="0.5"/>
                          <circle cx="10" cy="7.5" r="2" fill="#22C55E"/>
                        </svg>
                      </span>
                      <input
                        placeholder="0000 000 0000 .000"
                        value={(form as any)[k]}
                        onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))}
                        className="flex-1 px-2 text-[14px] font-medium leading-[1.4] tracking-[-0.02em] outline-none h-full bg-transparent placeholder:text-gray-400"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {sectionHdr('Requirement Details')}
              <div>
                <label className={labelCls}>Deal Category</label>
                <div className="relative">
                  <select value={form.dealCategory} onChange={set('dealCategory')} className={selectCls}>
                    <option value="" disabled>Select a Category</option>
                    {DEAL_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2}><polyline points="6 9 12 15 18 9"/></svg>
                  </span>
                </div>
              </div>
              <div>
                <label className={labelCls}>Geography / Market Covered</label>
                <div className="relative">
                  <select value={form.geography} onChange={set('geography')} className={selectCls}>
                    <option value="" disabled>Select a Geography</option>
                    {GEOGRAPHIES.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2}><polyline points="6 9 12 15 18 9"/></svg>
                  </span>
                </div>
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
                <div className="relative">
                  <select value={form.timeline} onChange={set('timeline')} className={selectCls}>
                    <option value="" disabled>Select Timeline</option>
                    {TIMELINES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2}><polyline points="6 9 12 15 18 9"/></svg>
                  </span>
                </div>
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
                className="w-full bg-black text-white text-sm font-semibold py-3.5 rounded-lg hover:bg-black/85 transition-colors"
              >
                Submit Requirement
              </button>
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
