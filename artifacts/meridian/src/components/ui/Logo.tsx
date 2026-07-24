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
        width="196"
        height="22"
        viewBox="0 0 196 22"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Meridian Private"
        style={{ display: 'block' }}
      >
        {/* Caret icon: two angled bars meeting at top-center */}
        <polygon points="2,20 10,3 14,3 7,20" fill="#1767e8" />
        <polygon points="10,3 14,3 22,20 18,20" fill="#1767e8" />

        {/* Wordmark: "Meridian" medium + "Private" regular */}
        <text
          x="32"
          y="17"
          fontFamily="'Instrument Sans', 'Arial', sans-serif"
          fontWeight="600"
          fontSize="15"
          letterSpacing="-0.3"
          fill={textColor}
        >
          Meridian
        </text>
        <text
          x="107"
          y="17"
          fontFamily="'Instrument Sans', 'Arial', sans-serif"
          fontWeight="400"
          fontSize="15"
          letterSpacing="-0.3"
          fill={textColor}
        >
          Private
        </text>
      </svg>
    </Link>
  );
}
