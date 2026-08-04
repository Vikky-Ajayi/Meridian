import { useState, useEffect, useRef } from 'react';
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

function PasswordField({ placeholder, value, onChange }: { placeholder: string; value: string; onChange: (v: string) => void }) {
  const [show, setShow] = useState(false);
  return (
    <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden h-12 bg-[#F5F6FA]">
      <input
        type={show ? 'text' : 'password'}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="flex-1 px-4 text-sm outline-none bg-transparent placeholder:text-gray-400 h-full"
      />
      <button type="button" className="px-3 flex-shrink-0" onClick={() => setShow(!show)}>
        <EyeIcon open={show} />
      </button>
    </div>
  );
}

export function AuthModal({ onClose }: { onClose?: () => void }) {
  const { modal, openModal, closeModal, login, setPendingEmail, pendingEmail } = useAuth();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(59);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (modal === 'otp') {
      const t = setInterval(() => setCountdown(c => (c > 0 ? c - 1 : 0)), 1000);
      return () => clearInterval(t);
    }
  }, [modal]);

  const handleOtpChange = (idx: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp];
    next[idx] = val.slice(-1);
    setOtp(next);
    if (val && idx < 5) inputRefs.current[idx + 1]?.focus();
  };

  const handleClose = () => { closeModal(); onClose?.(); };

  if (modal === 'none') return null;

  const backdrop = (
    <div className="fixed inset-0 bg-black/50 z-40" onClick={handleClose} />
  );

  const header = (title: string) => (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      <button onClick={handleClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100">
        <svg viewBox="0 0 24 24" className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" strokeWidth={2}>
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>
  );

  const blackBtn = (label: string, onClick: () => void, disabled = false) => (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="w-full bg-black text-white text-sm font-semibold py-4 rounded-xl hover:bg-black/85 transition-colors disabled:opacity-50"
    >
      {label}
    </button>
  );

  const card = (content: React.ReactNode) => (
    <>
      {backdrop}
      <div className="fixed inset-x-0 bottom-0 z-50 md:inset-0 md:flex md:items-center md:justify-center md:p-4">
        <div className="bg-white rounded-t-3xl md:rounded-3xl md:max-w-sm md:w-full w-full p-7 shadow-2xl">
          {content}
        </div>
      </div>
    </>
  );

  if (modal === 'register') return card(
    <div>
      {header('Create Your Account')}
      <p className="text-gray-900 font-semibold mb-1">You're almost done.</p>
      <p className="text-gray-500 text-sm mb-6">Create a password to secure your account and access your private client dashboard,</p>
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
          <PasswordField placeholder="Select a Category" value={password} onChange={setPassword} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
          <PasswordField placeholder="Select a Category" value={confirm} onChange={setConfirm} />
        </div>
      </div>
      {blackBtn('Create Account & Continue', () => { setPendingEmail(email); openModal('otp'); })}
      <p className="text-center text-sm text-gray-500 mt-4">
        Already have an account?{' '}
        <button className="text-[#0F61E9] font-medium" onClick={() => openModal('login')}>Sign in instead.</button>
      </p>
    </div>
  );

  if (modal === 'login') return card(
    <div>
      {header('Welcome Back')}
      <p className="text-gray-700 text-sm font-medium mb-6">Sign in to access your private client dashboard.</p>
      <div className="space-y-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
          <input
            type="email"
            placeholder="name@email.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full h-12 px-4 text-sm border border-gray-200 rounded-xl bg-[#F5F6FA] outline-none placeholder:text-gray-400 focus:border-[#0F61E9]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
          <PasswordField placeholder="Select a Category" value={password} onChange={setPassword} />
        </div>
        <div className="flex justify-end">
          <button className="text-sm font-semibold text-gray-800" onClick={() => openModal('forgot')}>Forgot Password?</button>
        </div>
      </div>
      {blackBtn('Create Account & Continue', login)}
      <p className="text-center text-sm text-gray-500 mt-4">
        Don't have an account?{' '}
        <button className="text-[#0F61E9] font-medium" onClick={() => openModal('register')}>Get started</button>
      </p>
    </div>
  );

  if (modal === 'otp') return card(
    <div>
      {header('Enter OTP')}
      <p className="text-gray-600 text-sm mb-6">
        A 6-Digit code was sent to <strong className="text-gray-900">{pendingEmail || 'free*****@gmail.com'}</strong>
      </p>
      <div className="flex gap-2 justify-center mb-6">
        {otp.map((d, i) => (
          <input
            key={i}
            ref={el => { inputRefs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={d}
            onChange={e => handleOtpChange(i, e.target.value)}
            className={`w-12 h-14 text-center text-2xl font-bold border-2 rounded-xl outline-none transition-colors ${
              d ? 'border-[#22C55E] text-gray-900' : 'border-gray-200 text-gray-400'
            } bg-[#F5F6FA]`}
          />
        ))}
      </div>
      <p className="text-center text-sm text-gray-500 mb-6">
        Didn't get Code?{' '}
        <button className="text-[#0F61E9] font-medium">
          Resend Code in 00:{countdown.toString().padStart(2, '0')}
        </button>
      </p>
      {blackBtn('Confirm', () => openModal('success'))}
      <div className="text-center mt-4">
        <button className="text-sm text-gray-500" onClick={() => openModal('register')}>← Back</button>
      </div>
    </div>
  );

  if (modal === 'forgot') return card(
    <div>
      {header('Forgot Password?')}
      <p className="text-gray-700 text-sm mb-6">Enter email address, you will receive a code to reset your password</p>
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
        <input
          type="email"
          placeholder="name@email.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full h-12 px-4 text-sm border border-gray-200 rounded-xl bg-[#F5F6FA] outline-none placeholder:text-gray-400 focus:border-[#0F61E9]"
        />
      </div>
      {blackBtn('Submit', () => openModal('setnew'))}
      <div className="text-center mt-4">
        <button className="text-sm text-gray-500" onClick={() => openModal('login')}>← Back to Login</button>
      </div>
    </div>
  );

  if (modal === 'setnew') return card(
    <div>
      {header('Set New Password')}
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
          <PasswordField placeholder="At least 8 Characters" value={password} onChange={setPassword} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm New Password</label>
          <PasswordField placeholder="At least 8 Characters" value={confirm} onChange={setConfirm} />
        </div>
      </div>
      {blackBtn('Reset Password', login)}
    </div>
  );

  if (modal === 'success') return card(
    <div className="text-center py-4">
      <div className="flex justify-center mb-4">
        {/* Badge / seal shape matching design */}
        <svg viewBox="0 0 80 80" className="w-20 h-20" fill="none">
          <path
            d="M40 4 L47 16 L61 12 L61 27 L74 31 L68 44 L76 55 L64 61 L63 76 L49 72 L40 82 L31 72 L17 76 L16 61 L4 55 L12 44 L6 31 L19 27 L19 12 L33 16 Z"
            fill="#DCFCE7" stroke="#86EFAC" strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M28 40 l8 8 L52 30"
            stroke="#22C55E" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"
          />
        </svg>
      </div>
      <h2 className="text-lg font-bold text-gray-900 mb-2">rt</h2>
      <p className="text-gray-500 text-sm leading-relaxed mb-8">
        You can now access your private client dashboard to track your submissions, receive updates from our team, submit additional Capabilities or Requirements, and contact support whenever you need assistance.
      </p>
      <button
        onClick={login}
        className="w-full bg-[#0D1B3E] text-white text-sm font-semibold py-4 rounded-xl hover:opacity-90 transition-opacity"
      >
        Go to Dashboard
      </button>
    </div>
  );

  return null;
}
