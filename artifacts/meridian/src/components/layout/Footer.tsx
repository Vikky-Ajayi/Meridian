import { Link } from 'wouter';
import { Logo } from '@/components/ui/Logo';

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Logo + nav row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12">
          <Logo theme="light" />
          <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-[#272626]">
            <Link href="/about" className="hover:text-[#000B2D] transition-colors">About</Link>
            <Link href="/" className="hover:text-[#000B2D] transition-colors">Solutions</Link>
            <Link href="/" className="hover:text-[#000B2D] transition-colors">Global Payments</Link>
            <Link href="/" className="hover:text-[#000B2D] transition-colors">Contact</Link>
            <Link href="/" className="hover:text-[#000B2D] transition-colors">Advisory</Link>
            <Link href="/" className="hover:text-[#000B2D] transition-colors">Privacy</Link>
            <Link href="/aml-policy" className="hover:text-[#000B2D] transition-colors">Regulatory information</Link>
          </div>
        </div>

        {/* Legal disclaimers */}
        <div className="space-y-4 text-xs text-gray-500 leading-relaxed max-w-5xl mb-10">
          <p>
            Meridian acts as a business banking and foreign exchange introducer, connecting eligible individuals and businesses with suitable regulated financial service providers and banking partners.
          </p>
          <p>
            We assist clients seeking banking solutions, including private clients, high-net-worth individuals (HNWIs), politically exposed persons (PEPs), and businesses operating in industries that may require specialist banking support, including Money Service Businesses (MSBs), FX companies, cryptocurrency businesses, gaming and gambling operators, adult entertainment businesses, and CBD-related businesses.
          </p>
          <p>
            Account openings, banking relationships, and financial services are subject to the independent approval processes, compliance requirements, and risk assessments of the relevant financial institutions and service providers. Meridian does not guarantee acceptance or approval by any banking partner.
          </p>
          <p>
            Meridian provides its services in partnership with licensed financial institutions and payment providers within their respective jurisdictions. All trademarks, logos, and brand names referenced belong to their respective owners. The use of these trademarks and brand names does not imply endorsement by, affiliation with, or association with Meridian.
          </p>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-100 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-gray-400">
          <span>© 2025 by Meridian</span>
          <span>Designed for Discerning Clients</span>
        </div>
      </div>

      {/* Large watermark */}
      <div className="mt-10 overflow-hidden select-none pointer-events-none">
        <div className="flex items-center justify-start pl-4 opacity-[0.06]">
          <span className="flex items-center gap-[5px] mr-[3px]">
            <span className="block w-[18px] h-[88px] bg-[#000B2D]" />
            <span className="block w-[18px] h-[88px] bg-[#000B2D]" />
            <span className="block w-[18px] h-[88px] bg-[#000B2D]" />
          </span>
          <span className="text-[88px] font-bold tracking-[0.04em] uppercase text-[#000B2D] leading-none">ERIDIAN</span>
        </div>
      </div>
    </footer>
  );
}
