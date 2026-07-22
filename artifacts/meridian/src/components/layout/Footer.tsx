import { Link } from 'wouter';
import { Logo } from '@/components/ui/Logo';

const footerLinks = [
  ['About', '/about'],
  ['Solutions', '/'],
  ['Global Payments', '/'],
  ['Contact', '/'],
  ['Advisory', '/'],
  ['Privacy', '/'],
  ['Regulatory information', '/aml-policy'],
];

export function Footer() {
  return (
    <footer className="meridian-footer">
      <div className="footer-inner">
        <div className="footer-top">
          <Logo theme="light" />
          <nav>
            {footerLinks.map(([label, href]) => (
              <Link key={label} href={href}>{label}</Link>
            ))}
          </nav>
        </div>

        <div className="footer-legal">
          <p>
            Meridian acts as a business banking and foreign exchange introducer, connecting
            eligible individuals and businesses with suitable regulated financial service
            providers and banking partners.
          </p>
          <p>
            We assist clients seeking banking solutions, including private clients,
            high-net-worth individuals (HNWIs), politically exposed persons (PEPs), and
            businesses operating in industries that may require specialist banking support,
            including Money Service Businesses (MSBs), FX companies, cryptocurrency
            businesses, gaming and gambling operators, adult entertainment businesses, and
            CBD-related businesses.
          </p>
          <p>
            Account openings, banking relationships, and financial services are subject to
            the independent approval processes, compliance requirements, and risk
            assessments of the relevant financial institutions and service providers.
            Meridian does not guarantee acceptance or approval by any banking partner.
          </p>
          <p>
            Meridian provides its services in partnership with licensed financial
            institutions and payment providers within their respective jurisdictions.
            <br />
            All trademarks, logos, and brand names referenced belong to their respective
            owners. The use of these trademarks and brand names does not imply endorsement
            by, affiliation with, or association with Meridian.
          </p>
        </div>

        <div className="footer-copy">
          <span>© 2025 by Meridian</span>
          <span>Designed for Discerning Clients</span>
        </div>
      </div>
      <svg className="footer-watermark" viewBox="0 0 1000 720" aria-hidden="true">
        <text
          x="0"
          y="720"
          textLength="1000"
          lengthAdjust="spacingAndGlyphs"
          fontFamily="'Instrument Sans', sans-serif"
          fontWeight="700"
          fill="#e9e9eb"
        >
          MERIDIAN
        </text>
      </svg>
    </footer>
  );
}
