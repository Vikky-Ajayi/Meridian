import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
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
    <div className="flex h-12 items-center overflow-hidden rounded-xl bg-[#F4F5F8]">
      <input
        type={show ? 'text' : 'password'}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="h-full flex-1 bg-transparent px-4 text-sm outline-none placeholder:text-gray-400"
      />
      <button type="button" className="h-full border-l-2 border-white px-4 flex-shrink-0" onClick={() => setShow(!show)}>
        <EyeIcon open={show} />
      </button>
    </div>
  );
}

export function AuthModal({ onClose }: { onClose?: () => void }) {
  const { modal, openModal, closeModal, login, setPendingEmail, pendingEmail } = useAuth();
  const [, setLocation] = useLocation();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(59);
  const [error, setError] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (modal === 'otp') {
      setCountdown(59);
      const t = setInterval(() => setCountdown(c => (c > 0 ? c - 1 : 0)), 1000);
      return () => clearInterval(t);
    }
    return undefined;
  }, [modal]);

  useEffect(() => {
    setError('');
  }, [modal]);

  const handleOtpChange = (idx: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp];
    next[idx] = val.slice(-1);
    setOtp(next);
    if (val && idx < 5) inputRefs.current[idx + 1]?.focus();
  };

  const handleClose = () => { closeModal(); onClose?.(); };

  const goDashboard = () => {
    login();
    setLocation('/dashboard');
  };

  const requireEmail = () => {
    if (!email.trim()) {
      setError('Enter your email address.');
      return false;
    }
    return true;
  };

  const requirePasswords = () => {
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return false;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return false;
    }
    return true;
  };

  if (modal === 'none') return null;

  const backdrop = (
    <div className="fixed inset-0 bg-black/50 z-40" onClick={handleClose} />
  );

  const header = (title: string) => (
    <div className="mb-7 flex items-center justify-between">
      <h2 className="text-[24px] font-bold leading-[1.1] tracking-[-0.04em] text-black">{title}</h2>
      <button onClick={handleClose} className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F1F2F4] hover:bg-gray-200">
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
      className="w-full rounded-md bg-black py-3.5 text-sm font-semibold text-white transition-colors hover:bg-black/85 disabled:opacity-50"
    >
      {label}
    </button>
  );

  const card = (content: React.ReactNode) => (
    <>
      {backdrop}
      <div className="fixed inset-x-0 bottom-0 z-50 md:inset-0 md:flex md:items-center md:justify-center md:p-4">
        <div className="w-full rounded-t-[18px] bg-white px-4 pb-6 pt-5 shadow-2xl md:w-[450px] md:rounded-[22px] md:px-4 md:py-5">
          {content}
        </div>
      </div>
    </>
  );

  if (modal === 'register') return card(
    <div>
      {header('Create Your Account')}
      <p className="mb-1 text-base font-bold text-black">You're almost done.</p>
      <p className="mb-6 max-w-[360px] text-base leading-[1.45] text-black">Create a password to secure your account and access your private client dashboard,</p>
      <div className="mb-14 space-y-5 md:mb-14">
        <div>
          <label className="mb-2 block text-xs font-medium text-black">Password</label>
          <PasswordField placeholder="Select a Category" value={password} onChange={setPassword} />
        </div>
        <div>
          <label className="mb-2 block text-xs font-medium text-black">Confirm Password</label>
          <PasswordField placeholder="Select a Category" value={confirm} onChange={setConfirm} />
        </div>
      </div>
      {error && <p className="mb-3 text-center text-xs font-medium text-red-500">{error}</p>}
      {blackBtn('Create Account & Continue', () => {
        if (!requirePasswords()) return;
        setPendingEmail(email || 'free*****@gmail.com');
        setOtp(['', '', '', '', '', '']);
        openModal('otp');
      })}
      <p className="mt-8 text-center text-sm text-black">
        Already have an account?{' '}
        <button className="text-[#0066FF] font-medium" onClick={() => openModal('login')}>Sign in instead.</button>
      </p>
    </div>
  );

  if (modal === 'login') return card(
    <div>
      {header('Welcome Back')}
      <p className="mb-6 text-base font-medium text-black">Sign in to access your private client dashboard.</p>
      <div className="mb-8 space-y-5">
        <div>
          <label className="mb-2 block text-xs font-medium text-black">Email</label>
          <input
            type="email"
            placeholder="name@email.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="h-12 w-full rounded-xl bg-[#F4F5F8] px-4 text-sm outline-none placeholder:text-gray-400 focus:ring-1 focus:ring-[#0F61E9]"
          />
        </div>
        <div>
          <label className="mb-2 block text-xs font-medium text-black">Password</label>
          <PasswordField placeholder="Select a Category" value={password} onChange={setPassword} />
        </div>
        <div className="flex justify-end">
          <button className="text-base font-medium text-black" onClick={() => openModal('forgot')}>Forgot Password?</button>
        </div>
      </div>
      {error && <p className="mb-3 text-center text-xs font-medium text-red-500">{error}</p>}
      {blackBtn('Sign In', () => {
        if (!requireEmail() || !password) {
          setError('Enter your email and password.');
          return;
        }
        goDashboard();
      })}
      <p className="mt-8 text-center text-sm text-black">
        Don't have an account?{' '}
        <button className="text-[#0066FF] font-medium" onClick={() => openModal('register')}>Get started</button>
      </p>
    </div>
  );

  if (modal === 'otp') return card(
    <div>
      {header('Enter OTP')}
      <p className="mb-7 text-base text-gray-600">
        A 6-Digit code was sent to <strong className="text-gray-900">{pendingEmail || 'free*****@gmail.com'}</strong>
      </p>
      <div className="mb-12 flex justify-between gap-3">
        {otp.map((d, i) => (
          <input
            key={i}
            ref={el => { inputRefs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={d}
            onChange={e => handleOtpChange(i, e.target.value)}
            className={`h-12 w-12 rounded-xl border text-center text-3xl font-bold outline-none transition-colors ${
              d ? 'border-[#22C55E] text-gray-900' : 'border-gray-200 text-gray-400'
            } bg-[#F5F6FA]`}
          />
        ))}
      </div>
      <p className="mb-14 text-center text-sm text-gray-500">
        Didn't get Code?{' '}
        <button
          className="text-[#0066FF] font-medium"
          onClick={() => {
            setCountdown(59);
            setOtp(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();
          }}
        >
          {countdown > 0 ? `Resend Code in 00:${countdown.toString().padStart(2, '0')}` : 'Resend Code'}
        </button>
      </p>
      {blackBtn('Confirm', () => {
        if (otp.some(d => !d)) {
          setError('Enter the 6-digit code.');
          return;
        }
        openModal('success');
      })}
      {error && <p className="mt-3 text-center text-xs font-medium text-red-500">{error}</p>}
      <div className="mt-8 text-center">
        <button className="text-sm text-black" onClick={() => openModal('register')}>← Back</button>
      </div>
    </div>
  );

  if (modal === 'forgot') return card(
    <div>
      {header('Forgot Password?')}
      <p className="mb-7 text-base font-medium leading-[1.45] text-black">Enter email address, you will receive a code to reset your password</p>
      <div className="mb-14">
        <label className="mb-2 block text-xs font-medium text-black">Email</label>
        <input
          type="email"
          placeholder="name@email.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="h-12 w-full rounded-xl bg-[#F4F5F8] px-4 text-sm outline-none placeholder:text-gray-400 focus:ring-1 focus:ring-[#0F61E9]"
        />
      </div>
      {error && <p className="mb-3 text-center text-xs font-medium text-red-500">{error}</p>}
      {blackBtn('Submit', () => {
        if (!requireEmail()) return;
        setPendingEmail(email);
        openModal('setnew');
      })}
      <div className="mt-8 text-center">
        <button className="text-sm text-black" onClick={() => openModal('login')}>← Back to Login</button>
      </div>
    </div>
  );

  if (modal === 'setnew') return card(
    <div>
      {header('Set New Password')}
      <div className="mb-14 space-y-5">
        <div>
          <label className="mb-2 block text-xs font-medium text-black">New Password</label>
          <PasswordField placeholder="At least 8 Characters" value={password} onChange={setPassword} />
        </div>
        <div>
          <label className="mb-2 block text-xs font-medium text-black">Confirm New Password</label>
          <PasswordField placeholder="At least 8 Characters" value={confirm} onChange={setConfirm} />
        </div>
      </div>
      {error && <p className="mb-3 text-center text-xs font-medium text-red-500">{error}</p>}
      {blackBtn('Reset Password', () => {
        if (!requirePasswords()) return;
        openModal('resetSuccess');
      })}
    </div>
  );

  if (modal === 'resetSuccess') return card(
    <div className="px-4 py-8 text-center md:px-7 md:py-8">
      <div className="mb-8 flex justify-center">
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
      <h2 className="mb-4 text-[20px] font-bold leading-[1.35] tracking-[-0.03em] text-black">
        Your password has been reset successfully.
      </h2>
      <p className="mb-12 text-sm leading-relaxed text-black">
        You can now sign in with your new password and access your private client dashboard.
      </p>
      <button
        onClick={() => openModal('login')}
        className="rounded-md bg-[#07133C] px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
      >
        Back to Login
      </button>
    </div>
  );

  if (modal === 'success') return card(
    <div className="px-4 py-8 text-center md:px-7 md:py-8">
      <div className="mb-8 flex justify-center">
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
      <h2 className="mb-4 text-[20px] font-bold leading-[1.35] tracking-[-0.03em] text-black">
        Your account has been created and your submission has been received.
      </h2>
      <p className="mb-12 text-sm leading-relaxed text-black">
        You can now access your private client dashboard to track your submissions, receive updates from our team, submit additional Capabilities or Requirements, and contact support whenever you need assistance.
      </p>
      <button
        onClick={goDashboard}
        className="rounded-md bg-[#07133C] px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
      >
        Go to Dashboard
      </button>
    </div>
  );

  return null;
}
