import { useState } from 'react';
import { AldricLogo } from '@/components/AldricLogo';
import { AuthModal } from '@/components/AuthModal';
import { useAuth } from '@/lib/auth-context';
import { DEAL_CATEGORIES, GEOGRAPHIES } from '@/lib/mock-data';

function Navbar() {
  const { openModal } = useAuth();
  return (
    <header className="bg-white border-b border-gray-100 px-6 lg:px-[150px] h-[60px] flex items-center justify-between sticky top-0 z-30">
      <AldricLogo />
      <nav className="hidden md:flex items-center gap-8 text-[13.5px] text-[#1a1a2e] font-normal">
        {['Moving Capital', 'Global Network', 'Contact'].map(l => (
          <a key={l} href="#" className="hover:text-[#0E61E8] transition-colors">{l}</a>
        ))}
      </nav>
      <button
        onClick={() => openModal('register')}
        className="bg-[#111827] text-white text-[13px] font-medium px-5 py-2.5 rounded-lg hover:bg-[#1f2937] transition-colors whitespace-nowrap"
      >
        Request an Introduction
      </button>
    </header>
  );
}

interface FormData {
  fullName: string; contactEmail: string; phoneNumber: string; whatsappNumber: string;
  dealCategory: string; geography: string; dealSizeRange: string; description: string;
  priorExperience: string; agreed: boolean;
}

export default function RegisterCapabilityPublic() {
  const { openModal } = useAuth();
  const [form, setForm] = useState<FormData>({
    fullName: '', contactEmail: '', phoneNumber: '', whatsappNumber: '',
    dealCategory: '', geography: '', dealSizeRange: '', description: '',
    priorExperience: '', agreed: false,
  });

  const set = (k: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: (e.target as HTMLInputElement).type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    openModal('register');
  };

  const inputCls = 'w-full h-11 px-4 text-sm bg-[#F5F6FA] border border-gray-200 rounded-lg outline-none placeholder:text-gray-400 focus:border-[#0F61E9] transition-colors';
  const selectCls = 'w-full h-11 px-4 text-sm bg-[#F5F6FA] border border-gray-200 rounded-lg outline-none text-gray-400 focus:border-[#0F61E9] transition-colors appearance-none';
  const sectionHdr = (t: string) => (
    <div className="border-b border-gray-200 pb-2 mb-4">
      <p className="text-sm font-semibold text-gray-500 tracking-wide">{t}</p>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero header */}
      <div className="bg-[#0F61E9] px-6 pt-8 pb-10 md:pt-14 md:pb-16">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Register A Capability</h1>
        <p className="text-blue-200 text-sm md:text-base leading-relaxed max-w-lg">
          Tell us what you're able to facilitate. Reviewed internally<br className="hidden md:block" /> before it's ever considered for matching.
        </p>
      </div>

      {/* Form card */}
      <div className="flex-1 bg-white md:bg-[#0F61E9]">
        <div className="md:max-w-2xl md:mx-auto md:px-4 md:pb-16 md:-mt-4">
          <div className="bg-white md:rounded-2xl md:shadow-lg p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Personal Information */}
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
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">Phone Number</label>
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden h-11 bg-[#F5F6FA]">
                    <span className="px-3 flex-shrink-0">
                      <svg viewBox="0 0 20 15" className="w-5 h-4" fill="none">
                        <rect width="20" height="15" fill="#22C55E"/>
                        <circle cx="10" cy="7.5" r="3" fill="#fff" stroke="#22C55E" strokeWidth="0.5"/>
                        <circle cx="10" cy="7.5" r="2" fill="#22C55E"/>
                      </svg>
                    </span>
                    <input placeholder="0000 000 0000 .000" value={form.phoneNumber}
                      onChange={e => setForm(f => ({ ...f, phoneNumber: e.target.value }))}
                      className="flex-1 px-2 text-sm outline-none h-full bg-transparent placeholder:text-gray-400" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">WhatsApp Number</label>
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden h-11 bg-[#F5F6FA]">
                    <span className="px-3 flex-shrink-0">
                      <svg viewBox="0 0 20 15" className="w-5 h-4" fill="none">
                        <rect width="20" height="15" fill="#22C55E"/>
                        <circle cx="10" cy="7.5" r="3" fill="#fff" stroke="#22C55E" strokeWidth="0.5"/>
                        <circle cx="10" cy="7.5" r="2" fill="#22C55E"/>
                      </svg>
                    </span>
                    <input placeholder="0000 000 0000 .000" value={form.whatsappNumber}
                      onChange={e => setForm(f => ({ ...f, whatsappNumber: e.target.value }))}
                      className="flex-1 px-2 text-sm outline-none h-full bg-transparent placeholder:text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Capability Details */}
              {sectionHdr('Capability Details')}
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">Deal Category</label>
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
                <label className="block text-sm font-medium text-gray-800 mb-1">Geography / Market Covered</label>
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
                <label className="block text-sm font-medium text-gray-800 mb-1">Typical Deal Size Range</label>
                <input placeholder="£1M - £10M" value={form.dealSizeRange} onChange={set('dealSizeRange')} className={inputCls} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">Describe Your Capability</label>
                <textarea
                  rows={4}
                  placeholder="I have an established relationship with an agricultural trading group operating in West Africa. I can facilitate introductions between verified buyers and suppliers within this sector and have previously supported similar commercial introductions."
                  value={form.description}
                  onChange={set('description')}
                  className="w-full px-4 py-3 text-sm bg-[#F5F6FA] border border-gray-200 rounded-lg outline-none placeholder:text-gray-400 focus:border-[#0F61E9] resize-none"
                />
                <p className="text-xs text-gray-400 mt-1 leading-snug">
                  Describe, in confidence, the type of business access, relationship, introduction, or arrangement you may be able to facilitate. Explain the nature of the relationship, the market involved, and how introductions typically work. This information is reviewed internally before being considered for matching.
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">
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

              {/* Checkbox */}
              <label className="flex gap-3 items-start cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.agreed}
                  onChange={e => setForm(f => ({ ...f, agreed: e.target.checked }))}
                  className="mt-0.5 w-4 h-4 accent-[#0F61E9] flex-shrink-0"
                />
                <span className="text-xs text-gray-500 leading-relaxed">
                  I understand that my capability information will remain confidential and will only be shared with relevant parties after internal review, verification, and confirmation of a suitable requirement.
                </span>
              </label>

              <button
                type="submit"
                className="w-full bg-black text-white text-sm font-semibold py-3.5 rounded-lg hover:bg-black/85 transition-colors"
              >
                Submit Capability
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
