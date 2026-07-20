import { Link } from 'wouter';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Logo } from '@/components/ui/Logo';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex justify-between items-center h-[64px]">
          <Logo theme="light" />

          <div className="hidden md:flex items-center gap-8">
            <Link href="/about" className="text-sm font-medium text-[#272626] hover:text-[#000B2D] transition-colors">
              Moving Capital
            </Link>
            <Link href="/" className="text-sm font-medium text-[#272626] hover:text-[#000B2D] transition-colors">
              Solutions
            </Link>
            <Link href="/" className="text-sm font-medium text-[#272626] hover:text-[#000B2D] transition-colors">
              Global Payments
            </Link>
            <Link href="/" className="text-sm font-medium text-[#272626] hover:text-[#000B2D] transition-colors">
              Advisory
            </Link>
            <Link href="/" className="text-sm font-medium text-[#272626] hover:text-[#000B2D] transition-colors">
              Contact
            </Link>
            <Link href="/private-banking-introduction">
              <button className="ml-2 bg-black text-white text-sm font-medium px-5 py-2.5 hover:bg-black/85 transition-colors">
                Request an Introduction
              </button>
            </Link>
          </div>

          <button
            className="md:hidden p-2 text-[#000B2D]"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 space-y-3">
          <Link href="/about" onClick={() => setIsOpen(false)} className="block py-2 text-sm font-medium text-[#272626]">Moving Capital</Link>
          <Link href="/" onClick={() => setIsOpen(false)} className="block py-2 text-sm font-medium text-[#272626]">Solutions</Link>
          <Link href="/" onClick={() => setIsOpen(false)} className="block py-2 text-sm font-medium text-[#272626]">Global Payments</Link>
          <Link href="/" onClick={() => setIsOpen(false)} className="block py-2 text-sm font-medium text-[#272626]">Advisory</Link>
          <Link href="/" onClick={() => setIsOpen(false)} className="block py-2 text-sm font-medium text-[#272626]">Contact</Link>
          <Link href="/private-banking-introduction" onClick={() => setIsOpen(false)}>
            <button className="w-full mt-2 bg-black text-white text-sm font-medium py-3">
              Request an Introduction
            </button>
          </Link>
        </div>
      )}
    </nav>
  );
}
