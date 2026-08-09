import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { NeedAssistance } from '@/components/NeedAssistance';
import { CountryPhoneInput } from '@/components/CountryPhoneInput';
import { useAuth } from '@/lib/auth-context';

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg viewBox="0 0 24 24" className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );
}

function PasswordField({ label, placeholder, value, onChange }: { label: string; placeholder: string; value: string; onChange: (v: string) => void }) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden h-11 bg-[#F5F6FA]">
        <input
          type={show ? 'text' : 'password'}
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
          className="flex-1 px-4 text-sm outline-none bg-transparent placeholder:text-gray-300 h-full"
        />
        <button type="button" className="px-3 flex-shrink-0" onClick={() => setShow(!show)}>
          <EyeIcon open={show} />
        </button>
      </div>
    </div>
  );
}

export default function Profile() {
  const { user, setPendingUser } = useAuth();
  const [info, setInfo] = useState({
    fullName: user?.name ?? '',
    contactEmail: user?.email ?? '',
    phoneNumber: '',
    whatsappNumber: '',
  });
  const [passwords, setPasswords] = useState({ current: '', new_: '', confirm: '' });
  const [infoSaved, setInfoSaved] = useState(false);
  const [pwSaved, setPwSaved] = useState(false);

  const inputCls = 'w-full h-11 px-4 text-sm bg-[#F5F6FA] border border-gray-200 rounded-lg outline-none placeholder:text-gray-400 focus:border-gray-300 transition-colors';

  return (
    <DashboardLayout title="Profile">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Personal Information */}
        <div className="bg-[#0F61E9] rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Personal Information</h2>
          <div className="bg-white rounded-xl p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
              <input
                value={info.fullName}
                onChange={e => setInfo(i => ({ ...i, fullName: e.target.value }))}
                placeholder="e.g John Doe"
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Contact Email</label>
              <input
                type="email"
                value={info.contactEmail}
                onChange={e => setInfo(i => ({ ...i, contactEmail: e.target.value }))}
                placeholder="name@email.com"
                className={inputCls}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                <CountryPhoneInput
                  value={info.phoneNumber}
                  onChange={v => setInfo(i => ({ ...i, phoneNumber: v }))}
                  placeholder="0000 000 0000 .000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">WhatsApp Number</label>
                <CountryPhoneInput
                  value={info.whatsappNumber}
                  onChange={v => setInfo(i => ({ ...i, whatsappNumber: v }))}
                  placeholder="0000 000 0000 .000"
                />
              </div>
            </div>
            <div className="flex justify-end">
              {infoSaved && <span className="text-green-600 text-sm mr-4 flex items-center">Saved!</span>}
              <button
                onClick={() => {
                  setPendingUser({ name: info.fullName, email: info.contactEmail });
                  setInfoSaved(true);
                  setTimeout(() => setInfoSaved(false), 2000);
                }}
                className="bg-black text-white text-sm font-semibold px-6 py-2.5 rounded-lg hover:bg-black/85 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>

        {/* Change Password */}
        <div className="bg-[#0D1B3E] rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Change Password</h2>
          <div className="bg-white rounded-xl p-6 space-y-5">
            <PasswordField
              label="Current Password"
              placeholder="••••••"
              value={passwords.current}
              onChange={v => setPasswords(p => ({ ...p, current: v }))}
            />
            <PasswordField
              label="New Password"
              placeholder="••••••"
              value={passwords.new_}
              onChange={v => setPasswords(p => ({ ...p, new_: v }))}
            />
            <PasswordField
              label="Confirm New Password"
              placeholder="••••••"
              value={passwords.confirm}
              onChange={v => setPasswords(p => ({ ...p, confirm: v }))}
            />
            <div className="flex justify-end">
              {pwSaved && <span className="text-green-600 text-sm mr-4 flex items-center">Saved!</span>}
              <button
                onClick={() => { setPwSaved(true); setTimeout(() => setPwSaved(false), 2000); }}
                className="bg-black text-white text-sm font-semibold px-6 py-2.5 rounded-lg hover:bg-black/85 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>

        <NeedAssistance />
      </div>
    </DashboardLayout>
  );
}
