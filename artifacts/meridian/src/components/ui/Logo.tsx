import { Link } from 'wouter';

interface LogoProps {
  theme?: 'light' | 'dark';
  className?: string;
}

export function Logo({ theme = 'light', className = '' }: LogoProps) {
  const textColor = theme === 'dark' ? '#FFFFFF' : '#0A0A0A';

  return (
    <Link href="/" className={`inline-flex items-center group ${className}`}>
      <svg
        width="148"
        height="22"
        viewBox="0 0 148 22"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Meridian"
        style={{ display: 'block' }}
      >
        {/* Three blue bars */}
        <rect x="0"  y="0" width="5" height="22" fill="#1A56E8" />
        <rect x="8"  y="0" width="5" height="22" fill="#1A56E8" />
        <rect x="16" y="0" width="5" height="22" fill="#1A56E8" />

        {/* ERIDIAN wordmark */}
        <text
          x="28"
          y="17"
          fontFamily="'Instrument Sans', 'Arial', sans-serif"
          fontWeight="700"
          fontSize="17"
          letterSpacing="1.5"
          fill={textColor}
        >
          ERIDIAN
        </text>
      </svg>
    </Link>
  );
}
