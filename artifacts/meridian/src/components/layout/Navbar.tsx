import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Logo } from '@/components/ui/Logo';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <Logo theme="light" />
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              About Us
            </Link>
            <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Solutions
            </Link>
            <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Global Payments
            </Link>
            <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Advisory
            </Link>
            <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Contact
            </Link>
            
            <div className="flex items-center gap-4 ml-4">
              <Link href="/private-banking-introduction">
                <Button className="rounded-none bg-primary hover:bg-primary/90 text-white font-medium px-6 py-5">Request an Introduction</Button>
              </Link>
            </div>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-foreground p-2">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 px-4 pt-2 pb-6 space-y-4 shadow-lg">
          <Link href="/about" className="block px-3 py-2 text-base font-medium text-foreground hover:bg-gray-50 rounded-md">
            About Us
          </Link>
          <Link href="/" className="block px-3 py-2 text-base font-medium text-foreground hover:bg-gray-50 rounded-md">
            Solutions
          </Link>
          <Link href="/" className="block px-3 py-2 text-base font-medium text-foreground hover:bg-gray-50 rounded-md">
            Global Payments
          </Link>
          <Link href="/" className="block px-3 py-2 text-base font-medium text-foreground hover:bg-gray-50 rounded-md">
            Advisory
          </Link>
          <Link href="/" className="block px-3 py-2 text-base font-medium text-foreground hover:bg-gray-50 rounded-md">
            Contact
          </Link>
          <div className="pt-4 flex flex-col gap-3">
            <Link href="/private-banking-introduction" className="block">
              <Button className="w-full justify-center rounded-none font-medium h-12">Request an Introduction</Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
