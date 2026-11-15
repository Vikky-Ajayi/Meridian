import { Logo } from '@/components/ui/Logo';

// Site header: logo and a single "Apply now" call to action, so the same page
// works as the ads landing page. "Apply now" leads to the service picker.
export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-t-2 border-[#1F1F1F] border-b border-b-[#ECEFF4]">
      <div className="max-w-[1300px] mx-auto h-[60px] px-5 sm:px-8 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <Logo theme="light" />
          <span className="hidden sm:inline-flex items-center gap-2 text-[13px] text-[#4A5468] whitespace-nowrap">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1767E8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 018 0v4" /></svg>
            Private Client Desk · Strictly confidential
          </span>
        </div>
        <a
          href="/#choose"
          className="inline-flex items-center min-h-[40px] px-5 rounded-md bg-black text-white text-[14px] font-semibold no-underline whitespace-nowrap hover:bg-zinc-800"
        >
          Apply now
        </a>
      </div>
    </nav>
  );
}
