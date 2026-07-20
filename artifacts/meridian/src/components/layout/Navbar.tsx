import { Link } from 'wouter';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Logo } from '@/components/ui/Logo';

const navLinkClass =
  'text-[14px] font-medium text-[#4B4B4B] hover:text-black transition-colors whitespace-nowrap leading-[130%] tracking-[-0.02em]';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="w-full px-8 lg:px-12">
        <div className="flex items-center h-[60px]">

          {/* Logo – far left */}
          <Logo theme="light" />

          {/* Nav links – 44 px after logo */}
          <div className="hidden md:flex items-center ml-[44px] gap-[44px]">
            <Link href="/about" className={navLinkClass}>Moving Capital</Link>
            <Link href="/"     className={navLinkClass}>Solutions</Link>
            <Link href="/"     className={navLinkClass}>Global Payments</Link>
            <Link href="/"     className={navLinkClass}>Advisory</Link>
            <Link href="/"     className={navLinkClass}>Contact</Link>
          </div>

          {/* Spacer – pushes button to far right */}
          <div className="hidden md:block flex-1" />

          {/* Button – 56 px gap from last nav link achieved via spacer above */}
          <Link href="/private-banking-introduction" className="hidden md:block">
            <button className="ml-[56px] bg-black text-white text-[13px] font-medium px-5 py-2 rounded-[6px] hover:bg-zinc-800 transition-colors whitespace-nowrap">
              Request an Introduction
            </button>
          </Link>

          {/* Mobile hamburger */}
          <button className="md:hidden ml-auto p-2 text-black" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-8 py-4 space-y-3">
          <Link href="/about" onClick={() => setIsOpen(false)} className="block py-2 text-sm text-[#4B4B4B]">Moving Capital</Link>
          <Link href="/"      onClick={() => setIsOpen(false)} className="block py-2 text-sm text-[#4B4B4B]">Solutions</Link>
          <Link href="/"      onClick={() => setIsOpen(false)} className="block py-2 text-sm text-[#4B4B4B]">Global Payments</Link>
          <Link href="/"      onClick={() => setIsOpen(false)} className="block py-2 text-sm text-[#4B4B4B]">Advisory</Link>
          <Link href="/"      onClick={() => setIsOpen(false)} className="block py-2 text-sm text-[#4B4B4B]">Contact</Link>
          <Link href="/private-banking-introduction" onClick={() => setIsOpen(false)}>
            <button className="w-full mt-3 bg-black text-white text-sm font-medium py-3 rounded-[6px]">
              Request an Introduction
            </button>
          </Link>
        </div>
      )}
    </nav>
  );
}
