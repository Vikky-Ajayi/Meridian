import { Link } from 'wouter';
import { Logo } from '@/components/ui/Logo';

export function Footer() {
  return (
    <footer className="bg-foreground text-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <Logo theme="dark" className="mb-6" />
          </div>
          
          <div>
            <h3 className="font-semibold text-white mb-6 uppercase tracking-wider text-xs">Solutions</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/move-money-abroad" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Global Payments
                </Link>
              </li>
              <li>
                <Link href="/private-banking-introduction" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Private Banking
                </Link>
              </li>
              <li>
                <Link href="/" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Advisory Services
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-6 uppercase tracking-wider text-xs">Company</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white text-sm transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/aml-policy" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Compliance
                </Link>
              </li>
              <li>
                <Link href="/" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-6 uppercase tracking-wider text-xs">Legal</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/aml-policy" className="text-gray-400 hover:text-white text-sm transition-colors">
                  AML Policy
                </Link>
              </li>
              <li>
                <Link href="/" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-12 text-sm text-gray-500 space-y-4">
          <p>
            Meridian Advisory Limited is an independent financial advisory firm. We are not a bank, nor do we provide tax or legal advice. 
            All payment and foreign exchange services are provided by our regulated tier-1 banking partners and authorized electronic money institutions.
          </p>
          <div className="flex justify-between items-center mt-8">
            <p>© {new Date().getFullYear()} Meridian Advisory Limited. All rights reserved.</p>
          </div>
        </div>

        <div className="mt-20 overflow-hidden text-center opacity-[0.03] select-none pointer-events-none">
          <span className="text-[15vw] font-bold tracking-tighter leading-none whitespace-nowrap">MERIDIAN</span>
        </div>
      </div>
    </footer>
  );
}
