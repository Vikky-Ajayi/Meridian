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
        width="152"
        height="22"
        viewBox="0 0 152 22"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Meridian"
        style={{ display: 'block' }}
      >
        {/* Three blue bars — same proportions as the uploaded image */}
        <rect x="0"  y="0" width="6" height="22" fill="#1A56E8" />
        <rect x="9"  y="0" width="6" height="22" fill="#1A56E8" />
        <rect x="18" y="0" width="6" height="22" fill="#1A56E8" />

        {/* ERIDIAN wordmark */}
        <text
          x="30"
          y="17"
          fontFamily="'Instrument Sans', 'Arial Black', 'Arial', sans-serif"
          fontWeight="800"
          fontSize="17.5"
          letterSpacing="1.2"
          fill={textColor}
        >
          ERIDIAN
        </text>
      </svg>
    </Link>
  );
}
