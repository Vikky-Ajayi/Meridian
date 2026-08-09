import { useState, ReactNode } from 'react';
import { Link, useLocation } from 'wouter';
import { AldricLogo } from '@/components/AldricLogo';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { useAuth } from '@/lib/auth-context';

const NAV = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>
      </svg>
    ),
  },
  {
    href: '/dashboard/register-capability',
    label: 'Register Capability',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 12h8M12 8v8"/>
      </svg>
    ),
  },
  {
    href: '/dashboard/submit-requirement',
    label: 'Submit Requirement',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/>
      </svg>
    ),
  },
  {
    href: '/dashboard/profile',
    label: 'Profile',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
      </svg>
    ),
  },
];

function Sidebar({ onClose }: { onClose?: () => void }) {
  const [location] = useLocation();
  const { logout } = useAuth();

  return (
    <div className="flex flex-col h-full py-6 px-4">
      <div className="mb-16 px-2">
        <AldricLogo />
      </div>
      <nav className="flex-1 space-y-5">
        {NAV.map(n => {
          const active = location === n.href || (n.href !== '/dashboard' && location.startsWith(n.href));
          return (
            <Link
              key={n.href}
              href={n.href}
              onClick={onClose}
              className={`flex items-center gap-4 px-6 py-4 rounded-full text-base font-medium transition-colors whitespace-nowrap ${
                active
                  ? 'bg-[#E6F1FF] text-black'
                  : 'text-black hover:bg-gray-100'
              }`}
            >
              <span className="flex-shrink-0 text-black">{n.icon}</span>
              {n.label}
            </Link>
          );
        })}
        <button
          onClick={() => { logout(); onClose?.(); }}
          className="w-full flex items-center gap-4 px-6 py-4 rounded-full text-base font-medium text-black hover:bg-gray-100 transition-colors"
        >
          <span className="text-gray-500">
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8}>
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </span>
          Logout
        </button>
      </nav>
    </div>
  );
}

function MobileDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { user, logout } = useAuth();
  const [location] = useLocation();

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col px-6 py-6">
      <div className="flex items-center justify-between mb-10">
        <AldricLogo />
        <button onClick={onClose} className="w-8 h-8 flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2}>
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
      <nav className="flex-1 space-y-2">
        {NAV.map(n => {
          const active = location === n.href || (n.href !== '/dashboard' && location.startsWith(n.href));
          return (
            <Link
              key={n.href}
              href={n.href}
              onClick={onClose}
              className={`flex items-center gap-4 px-4 py-4 rounded-full text-base font-medium transition-colors ${
                active ? 'bg-blue-50 text-[#0F61E9]' : 'text-gray-800 hover:bg-gray-50'
              }`}
            >
              <span className={active ? 'text-[#0F61E9]' : 'text-gray-500'}>{n.icon}</span>
              {n.label}
            </Link>
          );
        })}
        <button
          onClick={() => { logout(); onClose(); }}
          className="w-full flex items-center gap-4 px-4 py-4 rounded-full text-base font-medium text-gray-800 hover:bg-gray-50"
        >
          <span className="text-gray-500">
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8}>
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </span>
          Logout
        </button>
      </nav>
      <div className="mt-4 space-y-4">
        <WhatsAppButton className="w-full justify-center" />
        {user && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 flex-shrink-0">
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8}>
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <div>
              <p className="font-semibold text-sm text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface Props {
  children: ReactNode;
  title: string;
}

export function DashboardLayout({ children, title }: Props) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-[300px] flex-shrink-0 bg-white flex-col">
        <Sidebar />
      </aside>

      {/* Mobile drawer */}
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white px-4 md:px-10 h-[72px] flex items-center justify-between flex-shrink-0">
          {/* Mobile: logo + hamburger */}
          <div className="flex items-center gap-4 md:hidden">
            <AldricLogo />
          </div>
          {/* Desktop: page title */}
          <h1 className="hidden md:block text-[30px] font-bold tracking-[-0.04em] text-black">{title}</h1>

          <div className="flex items-center gap-4">
            <WhatsAppButton className="hidden sm:inline-flex" size="sm" />
            <WhatsAppButton className="sm:hidden" iconOnly />
            {user && (
              <div className="hidden md:flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8}>
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900 leading-tight">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>
            )}
            {/* Mobile hamburger */}
            <button
              className="md:hidden p-1"
              onClick={() => setDrawerOpen(true)}
            >
              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2}>
                <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-auto px-3 py-5 md:px-10 md:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
